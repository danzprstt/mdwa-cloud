import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // Login form
  const [lu, setLu] = useState('');
  const [lp, setLp] = useState('');

  // Register form
  const [rn, setRn] = useState('');
  const [ru, setRu] = useState('');
  const [rp, setRp] = useState('');

  const clearMsg = () => { setErr(''); setOk(''); };

  async function doLogin(e) {
    e.preventDefault();
    clearMsg();
    if (!lu || !lp) return setErr('Isi semua field!');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: lu, password: lp }),
    });
    const d = await res.json();
    if (d.ok) router.push('/');
    else setErr(d.error || 'Login gagal');
  }

  async function doRegister(e) {
    e.preventDefault();
    clearMsg();
    if (!rn || !ru || !rp) return setErr('Isi semua field!');
    if (rp.length < 6) return setErr('Password minimal 6 karakter!');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: rn, username: ru, password: rp }),
    });
    const d = await res.json();
    if (d.ok) { setOk('Akun dibuat! Silakan login.'); setTab('login'); setRn(''); setRu(''); setRp(''); }
    else setErr(d.error || 'Gagal daftar');
  }

  return (
    <>
      <Head><title>MDWA Cloud — Login</title></Head>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <div className="brand-ico">☁</div>
            <h1>MDWA <em style={{ color: 'var(--blue)', fontStyle: 'normal' }}>Cloud</em></h1>
            <p>Private Cloud Storage</p>
          </div>

          <div className="tab-row">
            <button className={`tab-b ${tab === 'login' ? 'on' : ''}`} onClick={() => { setTab('login'); clearMsg(); }}>Masuk</button>
            <button className={`tab-b ${tab === 'register' ? 'on' : ''}`} onClick={() => { setTab('register'); clearMsg(); }}>Daftar</button>
          </div>

          {err && <div className="msg-err">⚠ {err}</div>}
          {ok && <div className="msg-ok">✅ {ok}</div>}

          {tab === 'login' && (
            <form onSubmit={doLogin}>
              <div className="inp-g">
                <label className="inp-label">Username</label>
                <input className="inp" placeholder="username" value={lu} onChange={e => setLu(e.target.value)} autoComplete="username" />
              </div>
              <div className="inp-g">
                <label className="inp-label">Password</label>
                <input className="inp" type="password" placeholder="••••••••" value={lp} onChange={e => setLp(e.target.value)} autoComplete="current-password" />
              </div>
              <button type="submit" className="btn btn-primary btn-full">Masuk →</button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={doRegister}>
              <div className="inp-g">
                <label className="inp-label">Nama Lengkap</label>
                <input className="inp" placeholder="Nama kamu" value={rn} onChange={e => setRn(e.target.value)} />
              </div>
              <div className="inp-g">
                <label className="inp-label">Username</label>
                <input className="inp" placeholder="huruf & angka" value={ru} onChange={e => setRu(e.target.value)} />
              </div>
              <div className="inp-g">
                <label className="inp-label">Password</label>
                <input className="inp" type="password" placeholder="min. 6 karakter" value={rp} onChange={e => setRp(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-full">Buat Akun →</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
