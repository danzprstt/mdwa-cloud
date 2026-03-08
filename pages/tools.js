import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import {
  Download, QrCode, Link2, Image, Palette, FileJson,
  Key, Hash, Clock, ArrowLeftRight, Type, Shuffle,
  Copy, Check, AlertCircle, Loader, ChevronRight,
  TikTok, Instagram, Youtube, Facebook, Twitter,
  Sun, Moon, X, ExternalLink, RefreshCw
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import HamburgerNav from '../components/HamburgerNav';
import Toast from '../components/Toast';

// ─── TOOL DEFINITIONS ─────────────────────────────────────
const TOOL_CATEGORIES = [
  {
    id: 'downloader',
    label: 'Downloader',
    color: '#4f6ef7',
    grad: 'linear-gradient(135deg,#4f6ef7,#06b6d4)',
    tools: [
      { id: 'dl-tiktok', label: 'TikTok DL', icon: '🎵', desc: 'Download video TikTok tanpa watermark' },
      { id: 'dl-instagram', label: 'Instagram DL', icon: '📸', desc: 'Foto, video, reels Instagram' },
      { id: 'dl-youtube', label: 'YouTube DL', icon: '▶', desc: 'Video & audio YouTube' },
      { id: 'dl-facebook', label: 'Facebook DL', icon: '👤', desc: 'Video Facebook & Reels' },
      { id: 'dl-pinterest', label: 'Pinterest DL', icon: '📌', desc: 'Gambar & video Pinterest' },
      { id: 'dl-twitter', label: 'Twitter/X DL', icon: '✦', desc: 'Video & GIF Twitter/X' },
    ],
  },
  {
    id: 'generator',
    label: 'Generator',
    color: '#10b981',
    grad: 'linear-gradient(135deg,#10b981,#06b6d4)',
    tools: [
      { id: 'qr', label: 'QR Generator', icon: '▣', desc: 'Buat QR code dari teks atau URL' },
      { id: 'password', label: 'Password Generator', icon: '🔑', desc: 'Generate password kuat & aman' },
      { id: 'hash', label: 'Hash Generator', icon: '#', desc: 'MD5, SHA1, SHA256 hash' },
      { id: 'uuid', label: 'UUID Generator', icon: '⊞', desc: 'Generate UUID v4 unik' },
      { id: 'color', label: 'Color Picker', icon: '🎨', desc: 'Picker warna & generate palette' },
      { id: 'lorem', label: 'Lorem Ipsum', icon: 'Aa', desc: 'Generate dummy text' },
    ],
  },
  {
    id: 'converter',
    label: 'Converter',
    color: '#8b5cf6',
    grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    tools: [
      { id: 'url-shortener', label: 'URL Shortener', icon: '🔗', desc: 'Persingkat URL panjang' },
      { id: 'base64', label: 'Base64', icon: '64', desc: 'Encode & decode Base64' },
      { id: 'json', label: 'JSON Formatter', icon: '{}', desc: 'Format & validasi JSON' },
      { id: 'timestamp', label: 'Timestamp', icon: '⏱', desc: 'Convert Unix timestamp' },
      { id: 'unit', label: 'Unit Converter', icon: '⇄', desc: 'Konversi satuan: panjang, berat, suhu' },
      { id: 'wordcount', label: 'Word Counter', icon: 'W', desc: 'Hitung kata & karakter teks' },
    ],
  },
];

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('mdwa-theme') || 'dark';
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); localStorage.setItem('mdwa-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  function showToast(msg, type = 'ok') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Disalin!'));
  }

  const allTools = TOOL_CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, catColor: c.color, catGrad: c.grad })));
  const filteredSearch = search ? allTools.filter(t => t.label.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())) : null;

  if (activeTool) {
    return (
      <ToolDetail
        toolId={activeTool}
        onBack={() => setActiveTool(null)}
        showToast={showToast}
        copyText={copyText}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <>
      <Head><title>MDWA Cloud — Tools</title></Head>
      <div className="topbar">
        <div className="brand">
          <div className="brand-ico" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          Tools
        </div>
        <div className="topbar-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>
          <HamburgerNav />
        </div>
      </div>

      <div className="page">
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text3)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="inp" placeholder="Cari tools..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>

        {filteredSearch ? (
          <>
            <div className="sec-ttl">Hasil Pencarian ({filteredSearch.length})</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {filteredSearch.map(tool => (
                <ToolCard key={tool.id} tool={tool} grad={tool.catGrad} onClick={() => setActiveTool(tool.id)} />
              ))}
            </div>
          </>
        ) : (
          TOOL_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <div className="sec-ttl" style={{ color: cat.color }}>{cat.label}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {cat.tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} grad={cat.grad} onClick={() => setActiveTool(tool.id)} />
                ))}
              </div>
            </div>
          ))
        )}

        <div style={{ height: 20 }} />
      </div>

      <BottomNav active="tools" />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function ToolCard({ tool, grad, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '16px 14px', cursor: 'pointer',
      textAlign: 'left', transition: 'all 0.18s', fontFamily: 'Plus Jakarta Sans, sans-serif',
      animation: 'fadeUp 0.3s ease both',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--border2)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='var(--border)'; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: grad,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', color: 'white', fontWeight: 800, marginBottom: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>{tool.icon}</div>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{tool.label}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text3)', lineHeight: 1.4, fontWeight: 500 }}>{tool.desc}</div>
    </button>
  );
}

// ─── TOOL DETAIL ───────────────────────────────────────────
function ToolDetail({ toolId, onBack, showToast, copyText, theme, toggleTheme }) {
  return (
    <>
      <Head><title>MDWA Cloud — Tools</title></Head>
      <div className="topbar">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={onBack} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--text2)', display:'flex', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="brand" style={{ fontSize:'0.95rem' }}>Tools</div>
        </div>
        <div className="topbar-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>
          <HamburgerNav />
        </div>
      </div>
      <div className="page">
        <ToolContent toolId={toolId} showToast={showToast} copyText={copyText} />
      </div>
      <BottomNav active="tools" />
    </>
  );
}

function ToolContent({ toolId, showToast, copyText }) {
  // Downloader
  if (toolId.startsWith('dl-')) return <DownloaderTool platform={toolId.replace('dl-','')} showToast={showToast} />;
  if (toolId === 'qr') return <QRTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'password') return <PasswordTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'hash') return <HashTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'uuid') return <UUIDTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'color') return <ColorTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'lorem') return <LoremTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'url-shortener') return <URLShortenerTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'base64') return <Base64Tool copyText={copyText} showToast={showToast} />;
  if (toolId === 'json') return <JSONTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'timestamp') return <TimestampTool copyText={copyText} showToast={showToast} />;
  if (toolId === 'unit') return <UnitTool />;
  if (toolId === 'wordcount') return <WordCountTool />;
  return <div className="empty"><p>Tool tidak ditemukan</p></div>;
}

// ─── INDIVIDUAL TOOLS ──────────────────────────────────────

function ToolBox({ title, icon, children }) {
  return (
    <div>
      <div style={{ fontSize:'1.05rem', fontWeight:800, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:'1.2rem' }}>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

function ResultBox({ value, onCopy, label = 'Hasil' }) {
  if (!value) return null;
  return (
    <div style={{ marginTop:14, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'12px 14px' }}>
      <div style={{ fontSize:'0.68rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:'0.85rem', color:'var(--text)', wordBreak:'break-all', fontFamily:'Space Mono,monospace', lineHeight:1.6 }}>{value}</div>
      {onCopy && (
        <button onClick={() => onCopy(value)} style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, border:'1px solid var(--border2)', background:'none', borderRadius:8, padding:'6px 12px', fontSize:'0.75rem', color:'var(--blue)', cursor:'pointer', fontWeight:700 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Salin
        </button>
      )}
    </div>
  );
}

// DOWNLOADER
function DownloaderTool({ platform, showToast }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const platformInfo = {
    tiktok: { label:'TikTok', color:'#010101', icon:'🎵' },
    instagram: { label:'Instagram', color:'#e1306c', icon:'📸' },
    youtube: { label:'YouTube', color:'#ff0000', icon:'▶' },
    facebook: { label:'Facebook', color:'#1877f2', icon:'👤' },
    pinterest: { label:'Pinterest', color:'#e60023', icon:'📌' },
    twitter: { label:'Twitter/X', color:'#000000', icon:'✦' },
  };
  const info = platformInfo[platform] || { label: platform, icon: '⬇' };

  async function doDownload() {
    if (!url.trim()) return setError('Masukkan URL dulu!');
    setLoading(true); setError(''); setResult(null);
    const res = await fetch('/api/tools/download', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() }),
    });
    const d = await res.json();
    setLoading(false);
    if (d.ok) setResult(d);
    else setError(d.error || 'Gagal mengambil media');
  }

  return (
    <ToolBox title={`${info.icon} ${info.label} Downloader`} icon="">
      <div className="inp-g">
        <label className="inp-label">URL {info.label}</label>
        <input className="inp" placeholder={`Paste link ${info.label} di sini...`} value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && doDownload()} />
      </div>
      {error && <div className="msg-err" style={{ marginBottom:10 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
      <button className="btn btn-primary btn-full" onClick={doDownload} disabled={loading}>
        {loading ? 'Memproses...' : `⬇ Download ${info.label}`}
      </button>

      {result && (
        <div style={{ marginTop:16 }}>
          {result.type === 'picker' ? (
            <div>
              <div style={{ fontSize:'0.8rem', color:'var(--text2)', marginBottom:10, fontWeight:600 }}>Pilih media yang mau didownload:</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {result.items?.map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:10, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 14px', textDecoration:'none', color:'var(--text)', fontSize:'0.82rem', fontWeight:600 }}>
                    {item.thumb && <img src={item.thumb} alt="" style={{ width:48, height:48, objectFit:'cover', borderRadius:8 }} />}
                    <span>Media {i+1} — {item.type || 'file'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft:'auto', color:'var(--blue)' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </a>
                ))}
                {result.audio && (
                  <a href={result.audio} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:12, padding:'10px 14px', textDecoration:'none', color:'var(--green)', fontSize:'0.82rem', fontWeight:600 }}>
                    🎵 Audio saja
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft:'auto' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <a href={result.url} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-full" style={{ textDecoration:'none', marginTop:0 }}>
              ⬇ Download Sekarang
            </a>
          )}
        </div>
      )}
    </ToolBox>
  );
}

// QR GENERATOR
function QRTool({ copyText, showToast }) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [qrUrl, setQrUrl] = useState('');

  function generate() {
    if (!text) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`);
  }

  return (
    <ToolBox title="QR Code Generator" icon="▣">
      <div className="inp-g"><label className="inp-label">Teks atau URL</label><input className="inp" placeholder="https://example.com atau teks apapun" value={text} onChange={e => setText(e.target.value)} /></div>
      <div className="inp-g">
        <label className="inp-label">Ukuran: {size}px</label>
        <input type="range" min="100" max="500" step="50" value={size} onChange={e => setSize(e.target.value)} style={{ width:'100%' }} />
      </div>
      <button className="btn btn-primary btn-full" onClick={generate}>Generate QR</button>
      {qrUrl && (
        <div style={{ marginTop:16, textAlign:'center' }}>
          <img src={qrUrl} alt="QR Code" style={{ borderRadius:12, border:'1px solid var(--border)', maxWidth:'100%' }} />
          <a href={qrUrl} download="qrcode.png" className="btn btn-ghost btn-full" style={{ marginTop:10, textDecoration:'none' }}>⬇ Download PNG</a>
        </div>
      )}
    </ToolBox>
  );
}

// PASSWORD GENERATOR
function PasswordTool({ copyText, showToast }) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper:true, lower:true, numbers:true, symbols:true });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  function generate() {
    let chars = '';
    if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return;
    let pwd = '';
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
    const s = [options.upper, options.lower, options.numbers, options.symbols].filter(Boolean).length;
    setStrength(s);
  }

  const strengthLabels = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#4f6ef7'];

  return (
    <ToolBox title="Password Generator" icon="🔑">
      <div className="inp-g">
        <label className="inp-label">Panjang: {length} karakter</label>
        <input type="range" min="8" max="64" value={length} onChange={e => setLength(+e.target.value)} style={{ width:'100%' }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {Object.entries(options).map(([key, val]) => (
          <label key={key} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'var(--text2)', cursor:'pointer', fontWeight:600 }}>
            <input type="checkbox" checked={val} onChange={e => setOptions(o => ({ ...o, [key]:e.target.checked }))} />
            {key === 'upper' ? 'Huruf Besar' : key === 'lower' ? 'Huruf Kecil' : key === 'numbers' ? 'Angka' : 'Simbol'}
          </label>
        ))}
      </div>
      <button className="btn btn-primary btn-full" onClick={generate}>Generate Password</button>
      {password && (
        <div style={{ marginTop:14 }}>
          <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:'14px', fontFamily:'Space Mono,monospace', fontSize:'0.88rem', wordBreak:'break-all', letterSpacing:1 }}>{password}</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
            <div style={{ flex:1, height:4, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${strength*25}%`, background:strengthColors[strength], borderRadius:4, transition:'width 0.3s' }} />
            </div>
            <span style={{ fontSize:'0.72rem', color:strengthColors[strength], fontWeight:700 }}>{strengthLabels[strength]}</span>
          </div>
          <button onClick={() => { copyText(password); showToast('Password disalin!'); }} className="btn btn-ghost btn-full" style={{ marginTop:8 }}>
            Salin Password
          </button>
        </div>
      )}
    </ToolBox>
  );
}

// HASH GENERATOR
function HashTool({ copyText, showToast }) {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState(null);

  async function generate() {
    if (!text) return;
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const results = {};
    for (const algo of ['SHA-1','SHA-256','SHA-384','SHA-512']) {
      const buf = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    }
    setHashes(results);
  }

  return (
    <ToolBox title="Hash Generator" icon="#">
      <div className="inp-g"><label className="inp-label">Teks Input</label><textarea className="inp" rows={3} placeholder="Masukkan teks..." value={text} onChange={e => setText(e.target.value)} /></div>
      <button className="btn btn-primary btn-full" onClick={generate}>Generate Hash</button>
      {hashes && Object.entries(hashes).map(([algo, hash]) => (
        <div key={algo} style={{ marginTop:10, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 12px' }}>
          <div style={{ fontSize:'0.65rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{algo}</div>
          <div style={{ fontSize:'0.7rem', fontFamily:'Space Mono,monospace', color:'var(--text)', wordBreak:'break-all' }}>{hash}</div>
          <button onClick={() => copyText(hash)} style={{ marginTop:6, fontSize:'0.68rem', color:'var(--blue)', border:'none', background:'none', cursor:'pointer', fontWeight:700 }}>Salin</button>
        </div>
      ))}
    </ToolBox>
  );
}

// UUID GENERATOR
function UUIDTool({ copyText, showToast }) {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);

  function generate() {
    const newUuids = Array.from({ length: count }, () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    });
    setUuids(newUuids);
  }

  return (
    <ToolBox title="UUID Generator" icon="⊞">
      <div className="inp-g">
        <label className="inp-label">Jumlah UUID: {count}</label>
        <input type="range" min="1" max="10" value={count} onChange={e => setCount(+e.target.value)} style={{ width:'100%' }} />
      </div>
      <button className="btn btn-primary btn-full" onClick={generate}>Generate UUID</button>
      {uuids.map((u, i) => (
        <div key={i} style={{ marginTop:8, display:'flex', alignItems:'center', gap:8, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 12px' }}>
          <span style={{ flex:1, fontFamily:'Space Mono,monospace', fontSize:'0.75rem', color:'var(--text)', wordBreak:'break-all' }}>{u}</span>
          <button onClick={() => copyText(u)} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--blue)', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      ))}
    </ToolBox>
  );
}

// COLOR PICKER
function ColorTool({ copyText, showToast }) {
  const [color, setColor] = useState('#4f6ef7');
  const [palette, setPalette] = useState([]);

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b); let h,s,l=(max+min)/2;
    if (max===min) { h=s=0; } else {
      const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
      h/=6;
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  }
  function generatePalette() {
    const shades = [0.2,0.4,0.6,0.8,1,1.2,1.4,1.6,1.8];
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
    setPalette(shades.map(s => {
      const nr = Math.min(255,Math.round(r*s)), ng = Math.min(255,Math.round(g*s)), nb = Math.min(255,Math.round(b*s));
      return `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`;
    }));
  }

  return (
    <ToolBox title="Color Picker" icon="🎨">
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width:60, height:60, borderRadius:12, border:'none', cursor:'pointer' }} />
        <div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.9rem', fontWeight:700 }}>{color.toUpperCase()}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text2)', marginTop:2 }}>{hexToRgb(color)}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text2)' }}>{hexToHsl(color)}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => copyText(color)}>Salin HEX</button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={generatePalette}>Generate Palette</button>
      </div>
      {palette.length > 0 && (
        <div style={{ marginTop:14, display:'flex', gap:4 }}>
          {palette.map((c,i) => (
            <div key={i} onClick={() => copyText(c)} style={{ flex:1, height:48, borderRadius:8, background:c, cursor:'pointer', transition:'transform 0.15s' }}
              title={c}
              onMouseEnter={e => e.currentTarget.style.transform='scaleY(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform='scaleY(1)'}
            />
          ))}
        </div>
      )}
    </ToolBox>
  );
}

// LOREM IPSUM
function LoremTool({ copyText, showToast }) {
  const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
  const [count, setCount] = useState(50);
  const [type, setType] = useState('words');
  const [result, setResult] = useState('');

  function generate() {
    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) words.push(LOREM[i % LOREM.length]);
      setResult(words.join(' ') + '.');
    } else {
      const paras = [];
      for (let i = 0; i < count; i++) {
        const len = Math.floor(Math.random()*50)+20;
        const words = [];
        for (let j = 0; j < len; j++) words.push(LOREM[Math.floor(Math.random()*LOREM.length)]);
        paras.push(words.join(' ') + '.');
      }
      setResult(paras.join('\n\n'));
    }
  }

  return (
    <ToolBox title="Lorem Ipsum Generator" icon="Aa">
      <div className="inp-g">
        <label className="inp-label">Jenis</label>
        <div style={{ display:'flex', gap:8 }}>
          {['words','paragraphs'].map(t => (
            <button key={t} onClick={() => setType(t)} className={`btn ${type===t?'btn-primary':'btn-ghost'}`} style={{ flex:1 }}>
              {t === 'words' ? 'Kata' : 'Paragraf'}
            </button>
          ))}
        </div>
      </div>
      <div className="inp-g">
        <label className="inp-label">Jumlah {type === 'words' ? 'Kata' : 'Paragraf'}: {count}</label>
        <input type="range" min="1" max={type==='words'?200:10} value={count} onChange={e => setCount(+e.target.value)} style={{ width:'100%' }} />
      </div>
      <button className="btn btn-primary btn-full" onClick={generate}>Generate</button>
      {result && (
        <div style={{ marginTop:14, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:14, fontSize:'0.82rem', lineHeight:1.7, color:'var(--text2)', maxHeight:200, overflowY:'auto', whiteSpace:'pre-wrap' }}>{result}</div>
      )}
      {result && <button onClick={() => copyText(result)} className="btn btn-ghost btn-full" style={{ marginTop:8 }}>Salin Teks</button>}
    </ToolBox>
  );
}

// URL SHORTENER
function URLShortenerTool({ copyText, showToast }) {
  const [url, setUrl] = useState('');
  const [short, setShort] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function shorten() {
    if (!url) return setError('Masukkan URL dulu!');
    setLoading(true); setError(''); setShort('');
    const res = await fetch('/api/tools/shorten', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({url}) });
    const d = await res.json();
    setLoading(false);
    if (d.ok) setShort(d.shortUrl);
    else setError(d.error || 'Gagal');
  }

  return (
    <ToolBox title="URL Shortener" icon="🔗">
      <div className="inp-g"><label className="inp-label">URL Panjang</label><input className="inp" placeholder="https://url-panjang-banget.com/..." value={url} onChange={e => setUrl(e.target.value)} /></div>
      {error && <div className="msg-err">{error}</div>}
      <button className="btn btn-primary btn-full" onClick={shorten} disabled={loading}>{loading ? 'Mempersingkat...' : 'Persingkat URL'}</button>
      {short && (
        <div style={{ marginTop:14, background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:12, padding:'14px' }}>
          <div style={{ fontSize:'0.68rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>URL Singkat</div>
          <a href={short} target="_blank" rel="noopener noreferrer" style={{ fontFamily:'Space Mono,monospace', color:'var(--blue)', fontSize:'0.88rem' }}>{short}</a>
          <button onClick={() => { copyText(short); showToast('URL disalin!'); }} className="btn btn-ghost btn-full" style={{ marginTop:10 }}>Salin URL</button>
        </div>
      )}
    </ToolBox>
  );
}

// BASE64
function Base64Tool({ copyText }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  function convert() {
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else setOutput(decodeURIComponent(escape(atob(input))));
    } catch { setOutput('Error: Input tidak valid'); }
  }

  return (
    <ToolBox title="Base64 Encode/Decode" icon="64">
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {['encode','decode'].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`btn ${mode===m?'btn-primary':'btn-ghost'}`} style={{ flex:1 }}>
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <div className="inp-g"><label className="inp-label">Input</label><textarea className="inp" rows={4} value={input} onChange={e => setInput(e.target.value)} placeholder={mode==='encode' ? 'Teks biasa...' : 'Base64 string...'} /></div>
      <button className="btn btn-primary btn-full" onClick={convert}>{mode === 'encode' ? 'Encode' : 'Decode'}</button>
      {output && <ResultBox value={output} onCopy={copyText} label="Hasil" />}
    </ToolBox>
  );
}

// JSON FORMATTER
function JSONTool({ copyText, showToast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  function format() {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch(e) { setError('JSON tidak valid: ' + e.message); setOutput(''); }
  }

  function minify() {
    setError('');
    try { setOutput(JSON.stringify(JSON.parse(input))); }
    catch(e) { setError('JSON tidak valid'); }
  }

  return (
    <ToolBox title="JSON Formatter" icon="{}">
      <div className="inp-g"><label className="inp-label">JSON Input</label><textarea className="inp" rows={6} value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value"}' style={{ fontFamily:'Space Mono,monospace', fontSize:'0.8rem' }} /></div>
      {error && <div className="msg-err" style={{ marginBottom:10 }}>{error}</div>}
      <div style={{ display:'flex', gap:8 }}>
        <button className="btn btn-primary" style={{ flex:2 }} onClick={format}>Format / Beautify</button>
        <button className="btn btn-ghost" style={{ flex:1 }} onClick={minify}>Minify</button>
      </div>
      {output && (
        <div style={{ marginTop:14, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, padding:14, maxHeight:300, overflowY:'auto' }}>
          <pre style={{ fontFamily:'Space Mono,monospace', fontSize:'0.72rem', color:'var(--text)', whiteSpace:'pre-wrap', wordBreak:'break-all' }}>{output}</pre>
          <button onClick={() => copyText(output)} className="btn btn-ghost btn-full" style={{ marginTop:8 }}>Salin JSON</button>
        </div>
      )}
    </ToolBox>
  );
}

// TIMESTAMP
function TimestampTool({ copyText }) {
  const [ts, setTs] = useState(Math.floor(Date.now()/1000).toString());
  const [date, setDate] = useState(new Date().toISOString().slice(0,16));

  function tsToDate() {
    const d = new Date(parseInt(ts) * 1000);
    return isNaN(d) ? 'Invalid' : d.toLocaleString('id-ID', { dateStyle:'full', timeStyle:'long' });
  }
  function dateToTs() {
    const d = new Date(date);
    return isNaN(d) ? 'Invalid' : Math.floor(d.getTime()/1000).toString();
  }
  function setNow() { setTs(Math.floor(Date.now()/1000).toString()); setDate(new Date().toISOString().slice(0,16)); }

  return (
    <ToolBox title="Timestamp Converter" icon="⏱">
      <button className="btn btn-ghost btn-full" onClick={setNow} style={{ marginBottom:16 }}>Gunakan Waktu Sekarang</button>
      <div className="inp-g"><label className="inp-label">Unix Timestamp → Tanggal</label><input className="inp" value={ts} onChange={e => setTs(e.target.value)} placeholder="1700000000" style={{ fontFamily:'Space Mono,monospace' }} /></div>
      <ResultBox value={tsToDate()} onCopy={copyText} label="Hasil Konversi" />
      <div className="inp-g" style={{ marginTop:16 }}><label className="inp-label">Tanggal → Unix Timestamp</label><input className="inp" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} /></div>
      <ResultBox value={dateToTs()} onCopy={copyText} label="Unix Timestamp" />
    </ToolBox>
  );
}

// UNIT CONVERTER
function UnitTool() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('m');
  const [results, setResults] = useState(null);

  const units = {
    length: { m:1, km:0.001, cm:100, mm:1000, inch:39.3701, ft:3.28084, yard:1.09361, mile:0.000621371 },
    weight: { kg:1, g:1000, mg:1000000, lb:2.20462, oz:35.274, ton:0.001 },
    temperature: null,
    area: { 'm2':1, 'km2':0.000001, 'cm2':10000, 'ft2':10.7639, 'acre':0.000247105, 'ha':0.0001 },
  };

  function convert() {
    if (!value || isNaN(value)) return;
    const v = parseFloat(value);
    if (category === 'temperature') {
      const c = from==='C' ? v : from==='F' ? (v-32)*5/9 : v-273.15;
      setResults({ 'Celsius':c.toFixed(4), 'Fahrenheit':(c*9/5+32).toFixed(4), 'Kelvin':(c+273.15).toFixed(4) });
    } else {
      const base = v / units[category][from];
      const res = {};
      Object.entries(units[category]).forEach(([u, factor]) => { res[u] = (base * factor).toFixed(6); });
      setResults(res);
    }
  }

  const cats = ['length','weight','temperature','area'];
  const currentUnits = category === 'temperature' ? ['C','F','K'] : Object.keys(units[category] || {});

  return (
    <ToolBox title="Unit Converter" icon="⇄">
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {cats.map(c => (
          <button key={c} onClick={() => { setCategory(c); setResults(null); setFrom(c==='temperature'?'C':'m'); }} className={`ftab ${category===c?'on':''}`}>
            {c === 'length' ? 'Panjang' : c === 'weight' ? 'Berat' : c === 'temperature' ? 'Suhu' : 'Luas'}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <div style={{ flex:2 }}><label className="inp-label">Nilai</label><input className="inp" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" /></div>
        <div style={{ flex:1 }}><label className="inp-label">Dari</label>
          <select className="inp" value={from} onChange={e => setFrom(e.target.value)}>
            {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <button className="btn btn-primary btn-full" onClick={convert}>Konversi</button>
      {results && (
        <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
          {Object.entries(results).map(([unit, val]) => (
            <div key={unit} style={{ display:'flex', justifyContent:'space-between', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px' }}>
              <span style={{ fontSize:'0.8rem', color:'var(--text2)', fontWeight:600 }}>{unit}</span>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.8rem', color:'var(--text)' }}>{parseFloat(val).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </ToolBox>
  );
}

// WORD COUNTER
function WordCountTool() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g,'').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolBox title="Word Counter" icon="W">
      <textarea className="inp" rows={8} value={text} onChange={e => setText(e.target.value)} placeholder="Ketik atau paste teks di sini..." />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:14 }}>
        {[
          { label:'Kata', value:words },
          { label:'Karakter', value:chars },
          { label:'Tanpa Spasi', value:charsNoSpace },
          { label:'Kalimat', value:sentences },
          { label:'Paragraf', value:paragraphs },
          { label:'Baca ~', value:`${readTime} mnt` },
        ].map(item => (
          <div key={item.label} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--blue)', fontFamily:'Space Mono,monospace' }}>{item.value}</div>
            <div style={{ fontSize:'0.62rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', marginTop:2, fontWeight:700 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </ToolBox>
  );
}
