import { useState, useEffect } from 'react';
import { Menu, X, Home, Briefcase, ShoppingBag, Wrench, ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', icon: <Home size={18} />, href: '/' },
  { label: 'Portofolio', icon: <Briefcase size={18} />, href: 'https://portofolio.example.com', external: true },
  { label: 'Store', icon: <ShoppingBag size={18} />, href: 'https://store.example.com', external: true },
  { label: 'Tools', icon: <Wrench size={18} />, href: 'https://tools.example.com', external: true },
];

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(true)} aria-label="Menu">
        <Menu size={18} />
      </button>
      <div className={`hamburger-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`hamburger-menu ${open ? 'open' : ''}`}>
        <div className="hmenu-header">
          <span className="hmenu-title">Menu</span>
          <button className="hmenu-close" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="hmenu-item"
            onClick={() => setOpen(false)}
          >
            {link.icon}
            {link.label}
            {link.external && <ExternalLink size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
          </a>
        ))}
      </div>
    </>
  );
}
