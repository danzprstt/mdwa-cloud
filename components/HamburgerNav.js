import { useState } from 'react';
import { Menu, X, Home, Briefcase, ShoppingBag, Wrench, ExternalLink } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', icon: <Home size={18} />, href: '/', external: false },
  { label: 'Portofolio', icon: <Briefcase size={18} />, href: 'https://portofolio.example.com', external: true },
  { label: 'Store', icon: <ShoppingBag size={18} />, href: 'https://store.example.com', external: true },
  { label: 'Tools', icon: <Wrench size={18} />, href: 'https://tools.example.com', external: true },
];

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);

  function close() { setOpen(false); }
  function toggle() { setOpen(prev => !prev); }

  return (
    <>
      {/* Trigger button */}
      <button className="hamburger-btn" onClick={toggle} aria-label="Menu">
        <Menu size={18} />
      </button>

      {/* Overlay — klik untuk tutup */}
      {open && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 299,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Drawer dari kanan */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, right: 0,
        width: 260, zIndex: 300,
        background: 'var(--surface)',
        backdropFilter: 'var(--blur)',
        WebkitBackdropFilter: 'var(--blur)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
        padding: '20px 14px',
        display: 'flex', flexDirection: 'column', gap: 4,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, paddingBottom: 14,
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>Menu</span>
          <button
            onClick={close}
            style={{
              border: 'none', background: 'none', cursor: 'pointer',
              color: 'var(--text2)', display: 'flex', padding: 6,
              borderRadius: 8, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            onClick={close}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              fontSize: '0.9rem', fontWeight: 600,
              color: 'var(--text2)', textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            {link.icon}
            {link.label}
            {link.external && <ExternalLink size={13} style={{ marginLeft: 'auto', opacity: 0.4 }} />}
          </a>
        ))}
      </div>
    </>
  );
}
