import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ParticleHeroProps {
  image: string;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  radius: number;
  offset: number;
  drift: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function ParticleHero({ image }: ParticleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const imageElement = new Image();
    imageElement.src = image;
    let frame = 0;
    let disposed = false;
    let particles: Particle[] = [];
    let lastWidth = 0;
    let lastHeight = 0;
    let start = 0;

    const buildScene = () => {
      if (disposed || !imageElement.complete || !imageElement.naturalWidth) return;
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      lastWidth = width;
      lastHeight = height;

      const sampleW = 176;
      const sampleH = Math.round(sampleW * imageElement.naturalHeight / imageElement.naturalWidth);
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = sampleW;
      sampleCanvas.height = sampleH;
      const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!sampleCtx) return;
      sampleCtx.drawImage(imageElement, 0, 0, sampleW, sampleH);
      const pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
      const scale = Math.min(width * 0.69 / sampleW, height * 0.74 / sampleH);
      const left = width * 0.41 + (width * 0.56 - width * 0.41 - sampleW * scale) / 2;
      const top = height * 0.14 + (height * 0.77 - height * 0.14 - sampleH * scale) / 2;
      const points: Particle[] = [];

      for (let y = 1; y < sampleH; y += 2) {
        for (let x = 1; x < sampleW; x += 2) {
          const index = (y * sampleW + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          // Use the red body panels as a clean silhouette mask; ignore the studio background entirely.
          const vehiclePaint = red > 50 && red > green * 1.15 && red > blue * 1.1 && red - green > 22;
          if (pixels[index + 3] < 80 || !vehiclePaint) continue;
          const spreadX = width * 0.9;
          const spreadY = height * 0.75;
          points.push({
            tx: left + x * scale,
            ty: top + y * scale,
            color: `rgb(${red},${green},${blue})`,
            radius: 0.65 + Math.random() * 1.05,
            offset: Math.random() * Math.PI * 2,
            drift: 0.8 + Math.random() * 2.5,
            x: left + x * scale + (Math.random() - 0.5) * spreadX,
            y: top + y * scale + (Math.random() - 0.5) * spreadY,
          });
        }
      }
      particles = points;
      start = performance.now();
      if (prefersReduced) drawStill();
    };

    const drawStill = () => {
      const width = lastWidth || canvas.clientWidth;
      const height = lastHeight || canvas.clientHeight;
      context.fillStyle = '#10100f';
      context.fillRect(0, 0, width, height);
      if (!imageElement.naturalWidth) return;
      const maxW = width * 0.67;
      const maxH = height * 0.73;
      const scale = Math.min(maxW / imageElement.naturalWidth, maxH / imageElement.naturalHeight);
      const w = imageElement.naturalWidth * scale;
      const h = imageElement.naturalHeight * scale;
      context.globalAlpha = 0.82;
      context.drawImage(imageElement, width * 0.43 + (maxW - w) * 0.5, height * 0.14 + (maxH - h) * 0.5, w, h);
      context.globalAlpha = 1;
    };

    const draw = (now: number) => {
      if (disposed) return;
      if (canvas.clientWidth !== lastWidth || canvas.clientHeight !== lastHeight) buildScene();
      const width = lastWidth;
      const height = lastHeight;
      context.fillStyle = '#10100f';
      context.fillRect(0, 0, width, height);
      const elapsed = now - start;
      const cycle = elapsed % 18300;
      let progress = clamp(cycle / 4200);
      if (cycle > 12400) progress = 1 - clamp((cycle - 12400) / 1900);
      const eased = progress * progress * (3 - 2 * progress);
      const wobble = cycle > 7400 && cycle < 13700 ? Math.sin(now * 0.00055) : 0;

      if (eased > 0.89) {
        const fade = clamp((eased - 0.89) / 0.11) * 0.1;
        if (imageElement.naturalWidth && fade > 0.02) {
          const scale = Math.min(width * 0.67 / imageElement.naturalWidth, height * 0.74 / imageElement.naturalHeight);
          const w = imageElement.naturalWidth * scale;
          const h = imageElement.naturalHeight * scale;
          context.globalAlpha = fade;
          context.drawImage(imageElement, width * 0.43 + (width * 0.67 - w) * 0.5, height * 0.14 + (height * 0.74 - h) * 0.5, w, h);
          context.globalAlpha = 1;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const escape = 1 - eased;
        const x = particle.x + (particle.tx - particle.x) * eased + Math.sin(now * 0.00042 + particle.offset) * particle.drift * (0.5 + wobble * 0.2);
        const y = particle.y + (particle.ty - particle.y) * eased + Math.cos(now * 0.00039 + particle.offset) * particle.drift * (0.5 + wobble * 0.2);
        const opacity = Math.min(1, 0.17 + progress * 0.9) * (progress < 0.045 ? clamp(progress * 22) : 1);
        context.globalAlpha = opacity;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(x, y, particle.radius * (0.72 + progress * 0.38), 0, Math.PI * 2);
        context.fill();
        if (escape > 0.45 && i % 10 === 0) {
          context.fillStyle = '#c9543d';
          context.globalAlpha = escape * 0.2;
          context.fillRect(x + 3, y - 6, 1, 1);
        }
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    imageElement.onload = () => {
      buildScene();
      if (!prefersReduced) frame = window.requestAnimationFrame(draw);
    };
    imageElement.onerror = () => {
      context.fillStyle = '#10100f';
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    };
    const resizeObserver = new ResizeObserver(() => {
      if (!imageElement.complete || !imageElement.naturalWidth) return;
      buildScene();
      if (prefersReduced) drawStill();
    });
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [image]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <canvas className="hero-particles" ref={canvasRef} aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-ribbon" aria-hidden="true">MADE TO MOVE YOU <span /> MAHINDRA · INDIA</div>
      <div className="hero-copy">
        <p className="eyebrow hero-kicker"><span className="eyebrow-line" />THE ROAD IS ONLY A BEGINNING</p>
        <h1 id="hero-title">Built<br /><em>Beyond.</em></h1>
        <p className="hero-intro">A world of purpose-built SUVs.<br />One instinct: go further.</p>
        <div className="hero-actions">
          <a href="#lineup" className="button button--light">Explore the lineup <ArrowRight size={16} /></a>
          <Link to="/compare" className="hero-quiet-link">Find your Mahindra</Link>
        </div>
      </div>
      <div className="hero-aside"><span>01 / 04</span><i />A force that<br />moves as one.</div>
      <a href="#lineup" className="hero-scroll" aria-label="Scroll to explore the vehicle lineup"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      <div className="hero-bottom-note"><span>MAHINDRA · EST. 1945</span><span>GO WHERE YOUR INSTINCT TAKES YOU</span></div>
    </section>
  );
}
