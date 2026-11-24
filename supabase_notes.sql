-- ==============================================================
-- Jalankan script ini di Supabase SQL Editor:
-- ==============================================================

-- 1. Tambahkan kolom 'text' jika belum ada
alter table public.notes add column if not exists text text;

-- 2. Berikan izin akses penuh ke tabel notes untuk publik/anon & user login
grant all on table public.notes to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- 3. Buka izin RLS agar tidak memblokir saat live code
alter table public.notes disable row level security;
