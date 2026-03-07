import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Upload buffer to Catbox.moe
 * Returns direct URL like https://files.catbox.moe/xxxxxx.ext
 */
export async function uploadToCatbox(buffer, filename) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  if (process.env.CATBOX_USERHASH) {
    form.append('userhash', process.env.CATBOX_USERHASH);
  }
  form.append('fileToUpload', buffer, {
    filename,
    contentType: 'application/octet-stream',
  });

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
    timeout: 60000,
  });

  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith('https://')) return trimmed;
  throw new Error('Catbox: ' + trimmed);
}

/**
 * Upload buffer to Uguu.se (backup)
 * Returns direct URL
 */
export async function uploadToUguu(buffer, filename) {
  const form = new FormData();
  form.append('files[]', buffer, {
    filename,
    contentType: 'application/octet-stream',
  });

  const res = await fetch('https://uguu.se/upload', {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'MDWA-Cloud/3.0',
    },
    timeout: 60000,
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (json.success && json.files?.[0]?.url) return json.files[0].url;
    throw new Error(JSON.stringify(json));
  } catch (e) {
    const trimmed = text.trim();
    if (trimmed.startsWith('https://')) return trimmed;
    throw new Error('Uguu: ' + text.slice(0, 100));
  }
}
