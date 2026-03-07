-- =====================================================
-- MDWA Cloud — Supabase SQL Schema
-- Jalankan ini di Supabase SQL Editor
-- https://supabase.com/dashboard → SQL Editor
-- =====================================================

-- USERS TABLE
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- FILES TABLE
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text,
  original_name text not null,
  ext text,
  size bigint default 0,
  size_formatted text,
  file_type text default 'file',
  folder text default 'Umum',
  catbox_url text,
  uguu_url text,
  supabase_url text,
  thumb_url text,
  uploaded_at timestamptz default now()
);

-- INDEXES
create index if not exists files_user_id_idx on files(user_id);
create index if not exists files_uploaded_at_idx on files(uploaded_at desc);

-- ROW LEVEL SECURITY (RLS)
alter table users enable row level security;
alter table files enable row level security;

-- RLS Policies (service role bypasses these, public can't read)
create policy "users_service_only" on users
  for all using (false);

create policy "files_service_only" on files
  for all using (false);

-- =====================================================
-- STORAGE BUCKET
-- Buat manual di Supabase Dashboard:
-- Storage → New Bucket → nama: "mdwa-files" → Public: ON
-- =====================================================
