import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../lib/supabase';
import { signToken, setCookieHeader } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ ok: false, error: 'Isi username dan password' });

  const db = supabaseAdmin();
  const { data: user } = await db
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  if (!user) return res.json({ ok: false, error: 'Username atau password salah' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.json({ ok: false, error: 'Username atau password salah' });

  const token = signToken({ userId: user.id, username: user.username, name: user.name });

  res.setHeader('Set-Cookie', setCookieHeader(token));
  return res.json({ ok: true });
}
