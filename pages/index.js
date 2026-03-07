import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import FileCard from '../components/FileCard';

export default function HomePage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('Semua');
  const [toast, setToast] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [delModal, setDelModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('Umum');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState([]);
  const fileInputRef = useRef();
  const logRef = useRef();

  function showToast(msg, type = 'ok') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function addLog(msg, cls = 'info') {
    setUploadLogs(prev => [...prev, { msg, cls }]);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
  }

  async function loadFiles() {
    const res = await fetch('/api/files');
    if (res.status === 401) { router.push('/login'); return; }
    const d = await res.json();
    if (d.ok) setFiles(d.files);
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  const folders = ['Semua', ...new Set(files.map(f => f.folder || 'Umum'))];
  const filtered = activeFolder === 'Semua' ? files : files.filter(f => (f.folder || 'Umum') === activeFolder);

  // Generate thumbnail from video using canvas (client-side)
  async function generateVideoThumb(file, fileId) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      video.onloadeddata = () => {
        video.currentTime = Math.min(2, video.duration * 0.1);
      };

      video.onseeked = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 480; canvas.height = 270;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, 480, 270);
          canvas.toBlob(async (blob) => {
            if (blob) {
              const fd = new FormData();
              fd.append('thumb', blob, 'thumb.jpg');
              fd.append('fileId', fileId);
              await fetch('/api/save-thumb', { method: 'POST', body: fd });
              addLog('  🖼 Thumbnail video tersimpan', 'ok');
            }
            URL.revokeObjectURL(objectUrl);
            resolve();
          }, 'image/jpeg', 0.85);
        } catch (e) {
          URL.revokeObjectURL(objectUrl);
          resolve();
        }
      };

      video.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(); };
      setTimeout(() => { URL.revokeObjectURL(objectUrl); resolve(); }, 15000);
    });
  }

  async function handleUpload(fileList) {
    if (!fileList || !fileList.length) return;
    setUploading(true);
    setUploadLogs([]);
    setUploadProgress(0);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const title = fileList.length === 1 && uploadTitle ? uploadTitle : file.name.replace(/\.[^.]+$/, '');
      addLog(`⬆ Upload: ${file.name}`);

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', uploadFolder);
      fd.append('title', title);

      try {
        const xhr = new XMLHttpRequest();
        const result = await new Promise((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round(((i + e.loaded / e.total) / fileList.length) * 100);
              setUploadProgress(pct);
            }
          };
          xhr.onload = () => resolve(JSON.parse(xhr.responseText));
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.open('POST', '/api/upload');
          xhr.send(fd);
        });

        if (result.ok) {
          addLog(`✅ ${file.name} berhasil!`, 'ok');
          if (result.catboxUrl) addLog(`  ☁ Catbox: ${result.catboxUrl}`, 'ok');
          if (result.uguuUrl) addLog(`  ⚡ Uguu: ${result.uguuUrl}`, 'ok');
          if (result.supabaseUrl) addLog(`  🟢 Supabase: OK`, 'ok');
          if (result.catboxError) addLog(`  ⚠ Catbox: ${result.catboxError}`, 'err');
          if (result.uguuError) addLog(`  ⚠ Uguu: ${result.uguuError}`, 'err');

          // Generate canvas thumbnail for video
          const ext = file.name.split('.').pop().toLowerCase();
          const isVideo = ['mp4','webm','avi','mkv','mov'].includes(ext);
          if (isVideo && result.file?.id) {
            addLog('  🎬 Generating thumbnail...', 'info');
            await generateVideoThumb(file, result.file.id);
          }
        } else {
          addLog(`❌ Gagal: ${result.error}`, 'err');
        }
      } catch (e) {
        addLog(`❌ Error: ${e.message}`, 'err');
      }
    }

    setUploadProgress(100);
    setUploading(false);
    showToast(`${fileList.length} file diupload!`);
    setTimeout(() => { loadFiles(); setUploadOpen(false); setUploadLogs([]); setUploadProgress(0); }, 1500);
  }

  async function deleteFile() {
    if (!delModal) return;
    const res = await fetch('/api/delete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: delModal.id }),
    });
    const d = await res.json();
    if (d.ok) { showToast('File dihapus'); setFiles(prev => prev.filter(f => f.id !== delModal.id)); }
    else showToast('Gagal hapus', 'err');
    setDelModal(null);
  }

  async function saveTitle(id, title) {
    const res = await fetch('/api/edit-title', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title }),
    });
    const d = await res.json();
    if (d.ok) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, title } : f));
      showToast('Judul diperbarui');
    } else showToast('Gagal', 'err');
    setEditModal(null);
  }

  return (
    <>
      <Head><title>MDWA Cloud</title></Head>

      <div className="topbar">
        <div className="brand"><div className="brand-ico">☁</div>MDWA <em>Cloud</em></div>
        <button className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>⬆ Upload</button>
      </div>

      <div className="page">
        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <div className="stat-n">{files.length}</div>
            <div className="stat-l">File</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ fontSize: '0.85rem' }}>
              {formatTotalSize(files)}
            </div>
            <div className="stat-l">Storage</div>
          </div>
          <div className="stat">
            <div className="stat-n">{folders.length - 1 || 0}</div>
            <div className="stat-l">Folder</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="sec-ttl" style={{ marginTop: 20 }}>Filter</div>
        <div className="filter-tabs">
          {folders.map(f => (
            <button key={f} className={`ftab ${activeFolder === f ? 'on' : ''}`} onClick={() => setActiveFolder(f)}>
              {f === 'Semua' ? '🗂 ' : '📁 '}{f}
            </button>
          ))}
        </div>

        <div className="sec-ttl">File Saya</div>

        {loading ? (
          <div className="empty"><div className="empty-ico">⏳</div><p>Memuat file...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty"><div className="empty-ico">🗂️</div><p>Belum ada file.<br />Upload sekarang!</p></div>
        ) : (
          <div className="file-grid">
            {filtered.map((f, i) => (
              <FileCard
                key={f.id} file={f} index={i}
                onDelete={() => setDelModal(f)}
                onEditTitle={() => setEditModal(f)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">⬆ Upload File</div>
            <div className="modal-sub">Upload ke Supabase + Catbox + Uguu.se otomatis</div>

            <div
              className="drop-zone"
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dov'); }}
              onDragLeave={e => e.currentTarget.classList.remove('dov')}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dov'); handleUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
              <div className="drop-ico">📂</div>
              <div className="drop-txt">Drop file atau <span>klik pilih</span></div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 4, fontFamily: 'Space Mono' }}>Max 200MB per file</div>
            </div>

            <div className="inp-g" style={{ marginTop: 12 }}>
              <label className="inp-label">Folder</label>
              <input className="inp" value={uploadFolder} onChange={e => setUploadFolder(e.target.value)} placeholder="Umum" />
            </div>
            <div className="inp-g">
              <label className="inp-label">Judul (opsional)</label>
              <input className="inp" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Judul file..." />
            </div>

            {uploading && (
              <div className="prog-wrap">
                <div className="prog-label"><span>Mengupload...</span><span>{uploadProgress}%</span></div>
                <div className="prog-bg"><div className="prog-fill" style={{ width: uploadProgress + '%' }} /></div>
              </div>
            )}

            {uploadLogs.length > 0 && (
              <div className="upload-log" ref={logRef}>
                {uploadLogs.map((l, i) => (
                  <div key={i} className={`log-line ${l.cls}`}>{l.msg}</div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-ghost btn-full" onClick={() => setUploadOpen(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {delModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">🗑 Hapus File?</div>
            <div className="modal-sub">Hapus "{delModal.title || delModal.original_name}"? File di Supabase juga akan dihapus. URL Catbox/Uguu tetap aktif.</div>
            <div className="modal-actions">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDelModal(null)}>Batal</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={deleteFile}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Title Modal */}
      {editModal && (
        <EditTitleModal
          file={editModal}
          onSave={(title) => saveTitle(editModal.id, title)}
          onClose={() => setEditModal(null)}
        />
      )}

      <BottomNav active="home" />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function formatTotalSize(files) {
  const total = files.reduce((a, f) => a + (f.size || 0), 0);
  if (!total) return '0 B';
  const k = 1024, s = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(total) / Math.log(k));
  return (total / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
}

function EditTitleModal({ file, onSave, onClose }) {
  const [title, setTitle] = useState(file.title || file.original_name || '');
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-handle" />
        <div className="modal-title">✏️ Edit Judul</div>
        <div className="inp-g">
          <label className="inp-label">Judul Baru</label>
          <input className="inp" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSave(title)} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Batal</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(title)}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
