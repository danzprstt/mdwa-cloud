import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, username, password } = req.body;

  if (!name || !username || !password)
    return res.json({ ok: false, error: 'Semua field wajib diisi' });

  if (password.length < 6)
    return res.json({ ok: false, error: 'Password minimal 6 karakter' });

  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return res.json({ ok: false, error: 'Username hanya boleh huruf, angka, underscore' });

  const db = supabaseAdmin();

  // Check existing username
  const { data: existing } = await db
    .from('users')
    .select('id')
    .eq('username', username.toLowerCase())
    .single();

  if (existing) return res.json({ ok: false, error: 'Username sudah dipakai' });

  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await db.from('users').insert({
    name,
    username: username.toLowerCase(),
    password_hash,
  });

  if (error) return res.json({ ok: false, error: error.message });

  return res.json({ ok: true });
}
