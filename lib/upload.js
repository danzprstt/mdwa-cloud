import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadToCatbox(buffer, filename) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  if (process.env.CATBOX_USERHASH) form.append('userhash', process.env.CATBOX_USERHASH);
  form.append('fileToUpload', buffer, { filename, contentType: 'application/octet-stream' });
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form, headers: form.getHeaders(), timeout: 60000 });
  const text = await res.text();
  const trimmed = text.trim();
  if (trimmed.startsWith('https://')) return trimmed;
  throw new Error('Catbox: ' + trimmed);
}

export async function uploadToPixeldrain(buffer, filename) {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: 'application/octet-stream' });
  const res = await fetch('https://pixeldrain.com/api/file', {
    method: 'POST',
    body: form,
    headers: { ...form.getHeaders(), 'User-Agent': 'MDWA-Cloud/4.0' },
    timeout: 120000,
  });
  const json = await res.json();
  if (json.id) return `https://pixeldrain.com/u/${json.id}`;
  throw new Error('Pixeldrain: ' + (json.message || JSON.stringify(json)));
}
