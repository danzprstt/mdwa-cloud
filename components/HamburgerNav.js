import { useState } from 'react';
import { Menu, X, Home, Briefcase, ShoppingBag, Wrench, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { label: 'Home', icon: <Home size={18} />, href: 'https://danztech.vercel.app/index.html', external: true },
  { label: 'Portofolio', icon: <Briefcase size={18} />, href: 'https://danztech.vercel.app/portofolio.html', external: true },
  { label: 'Store', icon: <ShoppingBag size={18} />, href: 'https://danztech.vercel.app/store.html', external: true },
  { label: 'Tools', icon: <Wrench size={18} />, href: '/tools', external: false },
];

export default function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function close() { setOpen(false); }
  function toggle() { setOpen(prev => !prev); }

  function handleClick(link) {
    close();
    if (link.external) {
      window.open(link.href, '_blank', 'noopener noreferrer');
    } else {
      router.push(link.href);
    }
  }

  return (
    <>
      <button className="hamburger-btn" onClick={toggle} aria-label="Menu">
        <Menu size={18} />
      </button>

      {open && (
        <div onClick={close} style={{ position:'fixed', inset:0, zIndex:299, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }} />
      )}

      <div style={{
        position:'fixed', top:0, bottom:0, right:0, width:260, zIndex:300,
        background:'var(--surface)', borderLeft:'1px solid var(--border)',
        boxShadow:'-8px 0 32px rgba(0,0,0,0.2)',
        padding:'20px 14px', display:'flex', flexDirection:'column', gap:4,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, paddingBottom:14, borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontWeight:800, fontSize:'1rem' }}>Menu</span>
          <button onClick={close} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--text2)', display:'flex', padding:6, borderRadius:8 }}>
            <X size={20} />
          </button>
        </div>

        {NAV_LINKS.map(link => (
          <button key={link.label} onClick={() => handleClick(link)} style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'12px 14px', borderRadius:12,
            fontSize:'0.9rem', fontWeight:600, color:'var(--text2)',
            background:'none', border:'none', cursor:'pointer',
            fontFamily:'Plus Jakarta Sans, sans-serif', width:'100%', textAlign:'left',
            transition:'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--blue)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)'; }}
          >
            {link.icon}
            {link.label}
            {link.external && <ExternalLink size={13} style={{ marginLeft:'auto', opacity:0.4 }} />}
          </button>
        ))}
      </div>
    </>
  );
}
