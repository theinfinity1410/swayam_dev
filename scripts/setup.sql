-- ═══════════════════════════════════════════════
-- PORTFOLIO CMS — Supabase Setup SQL
-- Run this in your Supabase SQL Editor (one time)
-- ═══════════════════════════════════════════════

-- 1. Create the single-row content table
create table if not exists site_content (
  id          int primary key default 1,
  hero        jsonb,
  stats       jsonb,
  about       jsonb,
  skills      jsonb,
  experience  jsonb,
  currently_building jsonb,
  projects    jsonb,
  also_built  jsonb,
  contact     jsonb,
  resume      jsonb,
  seo         jsonb,
  updated_at  timestamptz default now()
);

-- 2. Ensure only one row can ever exist
create or replace function enforce_single_row()
returns trigger language plpgsql as $$
begin
  if (select count(*) from site_content) >= 1 and new.id != 1 then
    raise exception 'only one row allowed in site_content';
  end if;
  return new;
end;
$$;

create or replace trigger enforce_single_row_trigger
  before insert on site_content
  for each row execute function enforce_single_row();

-- 3. Seed with empty row (seed.js will fill it in)
insert into site_content (id) values (1) on conflict (id) do nothing;

-- 4. Enable Row Level Security
alter table site_content enable row level security;

-- 5. Public read policy (everyone can see the content)
drop policy if exists "Public read" on site_content;
create policy "Public read"
  on site_content for select
  using (true);

-- 6. Admin update policy
-- IMPORTANT: Replace 'YOUR-USER-UUID' with your actual Supabase auth UID.
-- Find it at: Supabase Dashboard → Authentication → Users → your account → User UID
-- Or run: select auth.uid(); after signing in via the app.
drop policy if exists "Admin update" on site_content;
create policy "Admin update"
  on site_content for update
  using (auth.uid() = 'YOUR-USER-UUID'::uuid);

-- 7. Create the resume storage bucket
insert into storage.buckets (id, name, public)
values ('resume', 'resume', true)
on conflict (id) do update set public = true;

-- 8. Storage policy: anyone can read files in 'resume' bucket
drop policy if exists "Resume public read" on storage.objects;
create policy "Resume public read"
  on storage.objects for select
  using (bucket_id = 'resume');

-- 9. Storage policy: only admin can upload/replace resume
drop policy if exists "Resume admin upload" on storage.objects;
create policy "Resume admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'resume'
    and auth.uid() = 'YOUR-USER-UUID'::uuid
  );

drop policy if exists "Resume admin update" on storage.objects;
create policy "Resume admin update"
  on storage.objects for update
  using (
    bucket_id = 'resume'
    and auth.uid() = 'YOUR-USER-UUID'::uuid
  );
