import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { VehicleImage } from '../data/types';

export default function MediaGallery({ images }: { images: VehicleImage[] }) {
  const [active, setActive] = useState(0);
  const selected = images[active] ?? images[0];
  if (!selected) return null;
  return (
    <div className="media-gallery">
      <div className="gallery-stage">
        <img key={selected.src} src={selected.src} alt={selected.alt} loading="lazy" />
        <span className="gallery-counter">{String(active + 1).padStart(2, '0')} <i>/</i> {String(images.length).padStart(2, '0')}</span>
        <a href={selected.src} target="_blank" rel="noreferrer" className="gallery-expand" aria-label="Open image in a new tab"><ArrowUpRight size={16} /></a>
        <span className="gallery-caption">{selected.caption}</span>
      </div>
      {images.length > 1 && <div className="gallery-rail" role="tablist" aria-label="Vehicle photos">
        {images.map((item, index) => (
          <button role="tab" aria-selected={active === index} key={item.src} className={`gallery-thumb${active === index ? ' is-active' : ''}`} onClick={() => setActive(index)} aria-label={`Show photo ${index + 1}: ${item.caption}`}>
            <img src={item.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>}
    </div>
  );
}
