export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url } = req.body;
  if (!url) return res.json({ ok: false, error: 'URL diperlukan' });

  const platform = detectPlatform(url);
  if (!platform) return res.json({ ok: false, error: 'Platform tidak didukung. Coba TikTok, Instagram, YouTube, Facebook, Pinterest, atau Twitter.' });

  try {
    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ url: url.trim(), videoQuality: '720', audioFormat: 'mp3', filenameStyle: 'pretty', downloadMode: 'auto' }),
    });
    const data = await cobaltRes.json();
    if (data.status === 'error') return res.json({ ok: false, error: data.error?.code || 'Gagal mengambil media' });
    if (data.status === 'redirect' || data.status === 'tunnel') return res.json({ ok: true, platform, type: data.status, url: data.url, filename: data.filename || `${platform}_download` });
    if (data.status === 'picker') return res.json({ ok: true, platform, type: 'picker', items: data.picker, audio: data.audio });
    return res.json({ ok: false, error: 'Response tidak dikenali' });
  } catch (e) {
    return res.json({ ok: false, error: 'Server error: ' + e.message });
  }
}

function detectPlatform(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('tiktok.com') || u.includes('vm.tiktok.com')) return 'tiktok';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'facebook';
  if (u.includes('pinterest.com') || u.includes('pin.it')) return 'pinterest';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('reddit.com')) return 'reddit';
  if (u.includes('soundcloud.com')) return 'soundcloud';
  return null;
}
