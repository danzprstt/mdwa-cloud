import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPass, setEditPass] = useState('');
  const [editErr, setEditErr] = useState('');
  const [addName, setAddName] = useState('');
  const [addUser, setAddUser] = useState('');
  const [addPass, setAddPass] = useState('');
  const [addErr, setAddErr] = useState('');
  const [addOk, setAddOk] = useState('');

  function showToast(msg, type = 'ok') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    fetch('/api/me').then(r => {
      if (r.status === 401) { router.push('/login'); return; }
      return r.json();
    }).then(d => { if (d?.ok) { setUser(d.user); setEditName(d.user.name); } });
    fetch('/api/files').then(r => r.json()).then(d => { if (d.ok) setFiles(d.files); });
  }, []);

  async function doLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  }

  async function saveEdit() {
    setEditErr('');
    const res = await fetch('/api/edit-profile', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, password: editPass }),
    });
    const d = await res.json();
    if (d.ok) { showToast('Profil diperbarui!'); setEditOpen(false); setUser(u => ({ ...u, name: editName })); }
    else setEditErr(d.error || 'Gagal');
  }

  async function createAcc() {
    setAddErr(''); setAddOk('');
    if (!addName || !addUser || !addPass) return setAddErr('Isi semua field!');
    const res = await fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addName, username: addUser, password: addPass }),
    });
    const d = await res.json();
    if (d.ok) { setAddOk('Akun berhasil dibuat!'); setAddName(''); setAddUser(''); setAddPass(''); }
    else setAddErr(d.error || 'Gagal');
  }

  const totalSize = files.reduce((a, f) => a + (f.size || 0), 0);
  const initial = (user?.name || 'U')[0].toUpperCase();

  function formatSize(b) {
    if (!b) return '0 B';
    const k = 1024, s = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return (b / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
  }

  return (
    <>
      <Head><title>MDWA Cloud — Profil</title></Head>
      <div className="topbar">
        <div className="brand"><div className="brand-ico">☁</div>MDWA <em>Cloud</em></div>
      </div>

      <div className="page">
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px 16px', marginBottom: 14 }}>
          <div className="avatar">{initial}</div>
          <div className="p-name">{user?.name || '—'}</div>
          <div className="p-uname">@{user?.username || '—'}</div>
          <div className="stats">
            <div className="stat"><div className="stat-n">{files.length}</div><div className="stat-l">File</div></div>
            <div className="stat"><div className="stat-n" style={{ fontSize: '0.82rem' }}>{formatSize(totalSize)}</div><div className="stat-l">Storage</div></div>
            <div className="stat"><div className="stat-n">{new Set(files.map(f => f.folder || 'Umum')).size}</div><div className="stat-l">Folder</div></div>
          </div>
        </div>

        <div className="sec-ttl">Akun</div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div className="menu">
            <button className="menu-item" onClick={() => setEditOpen(true)}><span className="mi-ico">✏️</span>Edit Profil<span className="mi-arr">›</span></button>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <button className="menu-item" onClick={() => setAddOpen(true)}><span className="mi-ico">➕</span>Buat Akun Baru<span className="mi-arr">›</span></button>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <button className="menu-item" onClick={doLogout}><span className="mi-ico">🔄</span>Ganti Akun<span className="mi-arr">›</span></button>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <button className="menu-item red" onClick={doLogout}><span className="mi-ico">🚪</span>Keluar</button>
          </div>
        </div>

        <div className="sec-ttl">Cloud Info</div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: 'var(--text2)', lineHeight: 2 }}>
            <div>🟢 Status: <span style={{ color: 'var(--green)' }}>Online</span></div>
            <div>☁ Primary CDN: <span style={{ color: 'var(--blue2)' }}>catbox.moe</span></div>
            <div>⚡ Backup CDN: <span style={{ color: 'var(--yellow)' }}>uguu.se</span></div>
            <div>🟩 Storage: <span style={{ color: 'var(--green)' }}>Supabase</span></div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">✏️ Edit Profil</div>
            <div className="inp-g">
              <label className="inp-label">Nama Baru</label>
              <input className="inp" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="inp-g">
              <label className="inp-label">Password Baru (kosong = tidak berubah)</label>
              <input className="inp" type="password" value={editPass} onChange={e => setEditPass(e.target.value)} placeholder="Password baru..." />
            </div>
            {editErr && <div className="msg-err">⚠ {editErr}</div>}
            <div className="modal-actions">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditOpen(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveEdit}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {addOpen && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">➕ Buat Akun Baru</div>
            <div className="inp-g"><label className="inp-label">Nama</label><input className="inp" value={addName} onChange={e => setAddName(e.target.value)} placeholder="Nama lengkap" /></div>
            <div className="inp-g"><label className="inp-label">Username</label><input className="inp" value={addUser} onChange={e => setAddUser(e.target.value)} placeholder="username" /></div>
            <div className="inp-g"><label className="inp-label">Password</label><input className="inp" type="password" value={addPass} onChange={e => setAddPass(e.target.value)} placeholder="min. 6 karakter" /></div>
            {addErr && <div className="msg-err">⚠ {addErr}</div>}
            {addOk && <div className="msg-ok">✅ {addOk}</div>}
            <div className="modal-actions">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddOpen(false)}>Tutup</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={createAcc}>Buat</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}
