import { useState } from 'react';

const WAVE_HEIGHTS = [40, 60, 100, 75, 45, 90, 60, 30, 80, 55];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getTypeClass(type) {
  const map = { image: 't-image', video: 't-video', audio: 't-audio', pdf: 't-pdf', archive: 't-archive' };
  return map[type] || 't-other';
}

function getTypeFallbackIcon(type) {
  const icons = { image: '🖼️', video: '🎬', audio: '🎵', pdf: '📕', archive: '🗜️', doc: '📝', sheet: '📊', code: '⚙️', file: '📄' };
  return icons[type] || '📄';
}

export default function FileCard({ file, index, onDelete, onEditTitle }) {
  const [imgError, setImgError] = useState(false);
  const type = file.file_type || 'file';
  const ext = (file.ext || '').replace('.', '').toUpperCase() || 'FILE';

  // Thumbnail
  const renderThumb = () => {
    if (type === 'audio') {
      return (
        <div className="audio-thumb">
          <div className="waveform">
            {WAVE_HEIGHTS.map((h, i) => (
              <div key={i} className="wave-bar" style={{ height: h + '%', animationDelay: i * 0.1 + 's' }} />
            ))}
          </div>
          <div className="audio-title-sm">{file.title || file.original_name}</div>
        </div>
      );
    }

    const thumbSrc = file.thumb_url;
    if (thumbSrc && !imgError) {
      return (
        <>
          <img
            src={thumbSrc}
            alt={file.title || file.original_name}
            loading="lazy"
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {type === 'video' && (
            <div className="play-overlay">
              <div className="play-btn-ico">▶</div>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="thumb-fallback">
        <div className="thumb-fallback-ico">{getTypeFallbackIcon(type)}</div>
        <div className="thumb-fallback-ext">{ext}</div>
      </div>
    );
  };

  const downloadUrl = file.catbox_url || file.uguu_url || file.supabase_url || '#';

  return (
    <div className="fcard" style={{ animationDelay: index * 0.05 + 's' }}>
      <div className="fcard-thumb">
        {renderThumb()}
        <div className={`fcard-type ${getTypeClass(type)}`}>{ext}</div>
        <div className="fcard-date">{formatDate(file.uploaded_at)}</div>
      </div>

      <div className="fcard-body">
        <div className="fcard-title-row">
          <div className="fcard-title">{file.title || file.original_name}</div>
          <button className="edit-title-btn" onClick={onEditTitle} title="Edit judul">✏️</button>
        </div>
        <div className="fcard-fname">📄 {file.original_name}</div>
        <div className="fcard-meta">
          <span className="fcard-tag size">💾 {file.size_formatted || '—'}</span>
          <span className="fcard-tag loc">📁 {file.folder || 'Umum'}</span>
        </div>
        <div className="fcard-urls">
          {file.catbox_url
            ? <a href={file.catbox_url} target="_blank" rel="noopener noreferrer" className="url-chip catbox">☁ Catbox</a>
            : <span className="url-chip pending">☁ Catbox—</span>}
          {file.uguu_url
            ? <a href={file.uguu_url} target="_blank" rel="noopener noreferrer" className="url-chip uguu">⚡ Uguu</a>
            : <span className="url-chip pending">⚡ Uguu—</span>}
          {file.supabase_url
            ? <a href={file.supabase_url} target="_blank" rel="noopener noreferrer" className="url-chip supa">🟢 Supa</a>
            : null}
        </div>
      </div>

      <div className="fcard-actions">
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="fcard-btn dl">⬇ Download</a>
        <button className="fcard-btn del" onClick={onDelete}>🗑 Hapus</button>
      </div>
    </div>
  );
}
