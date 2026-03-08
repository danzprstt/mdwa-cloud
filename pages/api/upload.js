import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getUserFromReq } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase';
import { uploadToCatbox, uploadToPixeldrain } from '../../lib/upload';

export const config = { api: { bodyParser: false } };

function formatSize(b) {
  if (!b) return '0 B';
  const k = 1024, s = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return (b / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
}

function getFileType(ext) {
  const e = ext.toLowerCase();
  if (['.jpg','.jpeg','.png','.gif','.webp','.svg','.bmp'].includes(e)) return 'image';
  if (['.mp4','.webm','.avi','.mkv','.mov','.flv'].includes(e)) return 'video';
  if (['.mp3','.wav','.flac','.ogg','.aac','.m4a'].includes(e)) return 'audio';
  if (e === '.pdf') return 'pdf';
  if (['.zip','.rar','.tar','.gz','.7z'].includes(e)) return 'archive';
  return 'file';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  const form = formidable({ maxFileSize: 200 * 1024 * 1024 });
  const [fields, files] = await form.parse(req);
  const uploadedFile = files.file?.[0];
  if (!uploadedFile) return res.json({ ok: false, error: 'Tidak ada file' });

  const folder = fields.folder?.[0] || 'Umum';
  const titleInput = fields.title?.[0] || '';
  const originalName = uploadedFile.originalFilename || 'file';
  const ext = path.extname(originalName).toLowerCase();
  const fileType = getFileType(ext);
  const size = uploadedFile.size;
  const title = titleInput || originalName.replace(/\.[^.]+$/, '');
  const buffer = fs.readFileSync(uploadedFile.filepath);

  const db = supabaseAdmin();
  let supabaseUrl = null, catboxUrl = null, pixeldrainUrl = null;
  let catboxError = null, pixeldrainError = null, supabaseError = null;

  // 1. Supabase Storage
  try {
    const storagePath = `${user.userId}/${Date.now()}_${originalName}`;
    const { error } = await db.storage.from('mdwa-files').upload(storagePath, buffer, { contentType: 'application/octet-stream', upsert: false });
    if (error) throw new Error(error.message);
    const { data: urlData } = db.storage.from('mdwa-files').getPublicUrl(storagePath);
    supabaseUrl = urlData.publicUrl;
  } catch(e) { supabaseError = e.message; }

  // 2. Catbox + Pixeldrain parallel
  const [catboxResult, pixeldrainResult] = await Promise.allSettled([
    uploadToCatbox(buffer, originalName),
    uploadToPixeldrain(buffer, originalName),
  ]);
  if (catboxResult.status === 'fulfilled') catboxUrl = catboxResult.value;
  else catboxError = catboxResult.reason?.message;
  if (pixeldrainResult.status === 'fulfilled') pixeldrainUrl = pixeldrainResult.value;
  else pixeldrainError = pixeldrainResult.reason?.message;

  let thumbUrl = null;
  if (fileType === 'image') thumbUrl = catboxUrl || supabaseUrl;

  const { data: record, error: dbError } = await db.from('files').insert({
    user_id: user.userId, title, original_name: originalName, ext, size,
    size_formatted: formatSize(size), file_type: fileType, folder,
    catbox_url: catboxUrl, pixeldrain_url: pixeldrainUrl, supabase_url: supabaseUrl, thumb_url: thumbUrl,
  }).select().single();

  try { fs.unlinkSync(uploadedFile.filepath); } catch(_) {}
  if (dbError) return res.json({ ok: false, error: 'DB error: ' + dbError.message });

  return res.json({ ok: true, file: record, catboxUrl, pixeldrainUrl, supabaseUrl, catboxError, pixeldrainError, supabaseError });
}
