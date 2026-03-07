// components/BottomNav.js
import { useRouter } from 'next/router';

export default function BottomNav({ active }) {
  const router = useRouter();
  return (
    <nav className="bnav">
      <button className={`bnav-item ${active === 'home' ? 'active' : ''}`} onClick={() => router.push('/')}>
        <span className="bnav-ico">🏠</span>
        <span>Home</span>
        <div className="bnav-dot" />
      </button>
      <button className={`bnav-item ${active === 'profile' ? 'active' : ''}`} onClick={() => router.push('/profile')}>
        <span className="bnav-ico">👤</span>
        <span>Profil</span>
        <div className="bnav-dot" />
      </button>
    </nav>
  );
}
