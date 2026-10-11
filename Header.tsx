import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import BrandMark from './BrandMark';

interface HeaderProps {
  compareCount: number;
}

export default function Header({ compareCount }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <Link to="/" className="brand-link" aria-label="Mahindra Built Beyond home" onClick={close}>
        <BrandMark />
      </Link>
      <nav className={`main-nav${open ? ' main-nav--open' : ''}`} aria-label="Main navigation">
        <NavLink to="/#lineup" onClick={close} className="nav-item">THE LINEUP <span>14</span></NavLink>
        <NavLink to="/#electric" onClick={close} className="nav-item">ELECTRIC <span className="nav-dot" /></NavLink>
        <a href="https://auto.mahindra.com/dealer-locator" target="_blank" rel="noreferrer" onClick={close} className="nav-item">FIND A DEALER <ArrowUpRight size={13} /></a>
        <Link to="/compare" onClick={close} className="nav-compare">COMPARE <span>{compareCount ? String(compareCount).padStart(2, '0') : '—'}</span></Link>
        <a href="https://auto.mahindra.com/test-drive" target="_blank" rel="noreferrer" className="nav-cta" onClick={close}>BOOK A DRIVE <ArrowUpRight size={14} /></a>
      </nav>
      <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
