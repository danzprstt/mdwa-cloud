// Downloader API — multi-platform scraping
export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { url, platform } = req.body;
  if (!url) return res.json({ ok: false, error: 'URL diperlukan' });

  const detected = platform || detectPlatform(url);
  if (!detected) return res.json({ ok: false, error: 'Platform tidak dikenali. Pastikan URL dari TikTok, Instagram, YouTube, Facebook, Pinterest, atau Twitter.' });

  try {
    switch (detected) {
      case 'tiktok': return await downloadTikTok(url, res);
      case 'instagram': return await downloadInstagram(url, res);
      case 'youtube': return await downloadYouTube(url, res);
      case 'facebook': return await downloadFacebook(url, res);
      case 'pinterest': return await downloadPinterest(url, res);
      case 'twitter': return await downloadTwitter(url, res);
      default: return res.json({ ok: false, error: 'Platform belum didukung' });
    }
  } catch (e) {
    return res.json({ ok: false, error: 'Gagal: ' + e.message });
  }
}

function detectPlatform(url) {
  const u = (url || '').toLowerCase();
  if (u.includes('tiktok.com') || u.includes('vm.tiktok.com') || u.includes('vt.tiktok.com')) return 'tiktok';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com') || u.includes('fb.watch') || u.includes('fb.com')) return 'facebook';
  if (u.includes('pinterest.com') || u.includes('pin.it')) return 'pinterest';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  return null;
}

// TikTok — SnapTik scraping
async function downloadTikTok(url, res) {
  // Use tikwm.com API (free, reliable)
  const formData = new URLSearchParams();
  formData.append('url', url);
  formData.append('hd', '1');

  const r = await fetch('https://www.tikwm.com/api/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' },
    body: formData.toString(),
  });
  const data = await r.json();

  if (data.code !== 0) throw new Error(data.msg || 'TikTok gagal');

  const d = data.data;
  return res.json({
    ok: true, platform: 'tiktok',
    type: 'result',
    title: d.title || 'TikTok Video',
    thumb: d.cover,
    items: [
      d.hdplay && { label: 'Video HD (No Watermark)', url: d.hdplay, type: 'video' },
      d.play && { label: 'Video SD (No Watermark)', url: d.play, type: 'video' },
      d.wmplay && { label: 'Video + Watermark', url: d.wmplay, type: 'video' },
      d.music && { label: 'Audio MP3', url: d.music, type: 'audio' },
    ].filter(Boolean),
  });
}

// Instagram — SaveIG scraping
async function downloadInstagram(url, res) {
  const apiUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&omitscript=true`;

  // Use instafinsta scraper
  const r = await fetch('https://v3.saveig.app/api/ajaxSearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
      'Origin': 'https://saveig.app',
      'Referer': 'https://saveig.app/',
    },
    body: `q=${encodeURIComponent(url)}&t=media&lang=id`,
  });

  const text = await r.text();

  // Parse HTML response to find download links
  const videoMatches = text.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/g) || [];
  const imageMatches = text.match(/href="(https:\/\/[^"]+\.jpg[^"]*)"/g) || [];
  const allLinks = [...videoMatches, ...imageMatches]
    .map(m => m.replace(/href="/, '').replace(/"$/, ''))
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 6);

  if (allLinks.length === 0) {
    // Fallback: direct link hint
    return res.json({
      ok: true, platform: 'instagram', type: 'manual',
      message: 'Instagram membatasi scraping. Coba buka link ini di browser lalu download manual.',
      fallbackLinks: [
        { label: 'SaveIG.app', url: `https://saveig.app/?url=${encodeURIComponent(url)}` },
        { label: 'SnapInsta', url: `https://snapinsta.app/?url=${encodeURIComponent(url)}` },
      ],
    });
  }

  return res.json({
    ok: true, platform: 'instagram', type: 'result',
    items: allLinks.map((u, i) => ({
      label: u.includes('.mp4') ? `Video ${i+1}` : `Gambar ${i+1}`,
      url: u, type: u.includes('.mp4') ? 'video' : 'image',
    })),
  });
}

// YouTube — y2mate scraping
async function downloadYouTube(url, res) {
  // Use y2meta API
  const videoId = extractYTId(url);
  if (!videoId) throw new Error('ID video YouTube tidak ditemukan');

  const r = await fetch('https://www.y2meta.app/api/ajaxSearch/id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0',
      'Origin': 'https://www.y2meta.app',
      'Referer': 'https://www.y2meta.app/',
    },
    body: `q=${encodeURIComponent(url)}&vt=mp4`,
  });

  const data = await r.json();

  if (!data.status || data.status !== 'ok') {
    // Fallback
    return res.json({
      ok: true, platform: 'youtube', type: 'manual',
      message: 'Gunakan salah satu layanan berikut untuk download YouTube:',
      fallbackLinks: [
        { label: 'Y2Mate', url: `https://www.y2mate.com/youtube/${videoId}` },
        { label: 'SaveFrom', url: `https://en.savefrom.net/#url=${encodeURIComponent(url)}` },
        { label: 'Loader.to', url: `https://loader.to/api/button/?url=${encodeURIComponent(url)}` },
      ],
    });
  }

  // Parse links from response
  const links = [];
  if (data.links?.mp4) {
    Object.entries(data.links.mp4).forEach(([q, info]) => {
      if (info.url) links.push({ label: `Video ${q}`, url: info.url, type: 'video' });
    });
  }
  if (data.links?.mp3) {
    Object.entries(data.links.mp3).forEach(([q, info]) => {
      if (info.url) links.push({ label: `Audio ${q}`, url: info.url, type: 'audio' });
    });
  }

  return res.json({ ok: true, platform: 'youtube', type: 'result', title: data.title, thumb: data.thumbnail, items: links.slice(0, 5) });
}

function extractYTId(url) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Facebook — getfvid scraping
async function downloadFacebook(url, res) {
  return res.json({
    ok: true, platform: 'facebook', type: 'manual',
    message: 'Pilih layanan untuk download video Facebook:',
    fallbackLinks: [
      { label: 'FDown.net', url: `https://fdown.net/index.php?URLz=${encodeURIComponent(url)}` },
      { label: 'GetFVid', url: `https://www.getfvid.com/?url=${encodeURIComponent(url)}` },
      { label: 'SaveFB', url: `https://savefb.net/?url=${encodeURIComponent(url)}` },
    ],
  });
}

// Pinterest
async function downloadPinterest(url, res) {
  try {
    const r = await fetch(`https://www.pinterest.com/oembed/?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await r.json();

    if (data.thumbnail_url) {
      // Get original resolution
      const origUrl = data.thumbnail_url.replace(/\/\d+x\//, '/originals/');
      return res.json({
        ok: true, platform: 'pinterest', type: 'result',
        title: data.title || 'Pinterest Media',
        thumb: data.thumbnail_url,
        items: [
          { label: 'Gambar Original', url: origUrl, type: 'image' },
          { label: 'Gambar Preview', url: data.thumbnail_url, type: 'image' },
        ],
      });
    }
    throw new Error('Tidak dapat mengambil media');
  } catch {
    return res.json({
      ok: true, platform: 'pinterest', type: 'manual',
      message: 'Pilih layanan untuk download Pinterest:',
      fallbackLinks: [
        { label: 'PinDown', url: `https://pindown.net/?url=${encodeURIComponent(url)}` },
        { label: 'PinterestVideoDownloader', url: `https://pinterestvideodownloader.com/?url=${encodeURIComponent(url)}` },
      ],
    });
  }
}

// Twitter/X
async function downloadTwitter(url, res) {
  return res.json({
    ok: true, platform: 'twitter', type: 'manual',
    message: 'Pilih layanan untuk download Twitter/X:',
    fallbackLinks: [
      { label: 'SaveTweetVid', url: `https://savetweetvid.com/?url=${encodeURIComponent(url)}` },
      { label: 'TwitFix', url: `https://twitsave.com/?url=${encodeURIComponent(url)}` },
      { label: 'GetVideoBot', url: `https://twittervideodownloader.com/?url=${encodeURIComponent(url)}` },
    ],
  });
}
