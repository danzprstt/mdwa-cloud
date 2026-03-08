-- =====================================================
-- MDWA Cloud v4 — Supabase SQL Schema
-- Jalankan di Supabase SQL Editor
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
  pixeldrain_url text,
  supabase_url text,
  thumb_url text,
  deleted_at timestamptz default null,
  uploaded_at timestamptz default now()
);

create index if not exists files_user_id_idx on files(user_id);
create index if not exists files_uploaded_at_idx on files(uploaded_at desc);
create index if not exists files_deleted_at_idx on files(deleted_at);

alter table users enable row level security;
alter table files enable row level security;

create policy "users_service_only" on users for all using (false);
create policy "files_service_only" on files for all using (false);

-- =====================================================
-- Kalau sudah punya tabel dari v3, jalankan ALTER ini:
-- =====================================================
-- alter table files add column if not exists pixeldrain_url text;
-- alter table files add column if not exists deleted_at timestamptz default null;
-- alter table files rename column uguu_url to pixeldrain_url;

-- =====================================================
-- STORAGE BUCKET
-- Storage → New Bucket → "mdwa-files" → Public: ON
-- =====================================================
