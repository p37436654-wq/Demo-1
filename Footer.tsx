import { ArrowUpRight, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-topline"><span>YOUR NEXT CHAPTER STARTS OUT THERE.</span><span>MAHINDRA · BUILT BEYOND</span></div>
      <div className="footer-main">
        <div className="footer-brand"><BrandMark /><p>For the unplanned turn.<br />For the places waiting past it.</p></div>
        <div className="footer-col"><span>THE EXPERIENCE</span><Link to="/#lineup">Explore the lineup</Link><Link to="/compare">Compare vehicles</Link><Link to="/#electric">Go electric</Link></div>
        <div className="footer-col"><span>GET OUT THERE</span><a href="https://auto.mahindra.com/test-drive" target="_blank" rel="noreferrer">Book a test drive <ArrowUpRight size={12} /></a><a href="https://auto.mahindra.com/dealer-locator" target="_blank" rel="noreferrer">Find your dealer <ArrowUpRight size={12} /></a><a href="https://auto.mahindra.com/" target="_blank" rel="noreferrer">Official Mahindra Auto <ArrowUpRight size={12} /></a></div>
        <div className="footer-social"><a href="https://www.instagram.com/mahindrarise/" aria-label="Mahindra on Instagram" target="_blank" rel="noreferrer"><Instagram size={18} /></a><a href="https://www.youtube.com/@MahindraAutomotive" aria-label="Mahindra on YouTube" target="_blank" rel="noreferrer"><Youtube size={18} /></a></div>
      </div>
      <div className="footer-bottom"><span>Specifications and prices shown are indicative; availability, features and figures vary by variant and market.</span><span>© MAHINDRA — BUILT BEYOND <i>·</i> AN INDEPENDENT SHOWCASE CONCEPT</span></div>
    </footer>
  );
}
