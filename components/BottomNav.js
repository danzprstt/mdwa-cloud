import { useRouter } from 'next/router';
import { Home, User, Wrench } from 'lucide-react';

export default function BottomNav({ active }) {
  const router = useRouter();
  return (
    <nav className="bnav">
      <button className={`bnav-item ${active==='home'?'active':''}`} onClick={() => router.push('/')}>
        <span className="bnav-ico"><Home size={22} strokeWidth={active==='home'?2.5:1.8} /></span>
        <span>Home</span>
        <div className="bnav-dot" />
      </button>
      <button className={`bnav-item ${active==='tools'?'active':''}`} onClick={() => router.push('/tools')}>
        <span className="bnav-ico"><Wrench size={22} strokeWidth={active==='tools'?2.5:1.8} /></span>
        <span>Tools</span>
        <div className="bnav-dot" />
      </button>
      <button className={`bnav-item ${active==='profile'?'active':''}`} onClick={() => router.push('/profile')}>
        <span className="bnav-ico"><User size={22} strokeWidth={active==='profile'?2.5:1.8} /></span>
        <span>Profil</span>
        <div className="bnav-dot" />
      </button>
    </nav>
  );
}
