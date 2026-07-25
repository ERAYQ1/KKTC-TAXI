-- KKTC Taksi: taxis table, RLS, storage bucket

create type region as enum (
  'lefkosa',
  'girne',
  'gazimagusa',
  'iskele',
  'guzelyurt',
  'lefke',
  'diger'
);

create table if not exists taxis (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  whatsapp text not null,
  photo_url text,
  price_info text,
  region region not null,
  description text,
  is_24_7 boolean not null default false,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Matches the public listing filter (active, then optional region / is_24_7).
-- A leftmost-prefix scan also covers the plain `active = true` case, so no
-- separate single-column indexes are needed.
create index if not exists taxis_public_filter_idx
  on taxis (active, region, is_24_7);

-- Admin listing orders by newest first.
create index if not exists taxis_created_at_idx on taxis (created_at desc);

-- keep updated_at fresh on every update
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists taxis_set_updated_at on taxis;
create trigger taxis_set_updated_at
  before update on taxis
  for each row
  execute function set_updated_at();

-- Table-level privileges. RLS filters *rows*, but the role still needs the
-- underlying grant, otherwise PostgREST returns 42501 permission denied.
grant usage on schema public to anon, authenticated, service_role;
grant select on table taxis to anon;
grant select, insert, update, delete on table taxis to authenticated;
-- service_role bypasses RLS by design and is server-only; it is what admin
-- tooling, migrations and backups use.
grant all on table taxis to service_role;

-- RLS: public can only read active rows; only authenticated (admin) can write
alter table taxis enable row level security;

drop policy if exists "public read active taxis" on taxis;
create policy "public read active taxis"
  on taxis for select
  to anon
  using (active = true);

drop policy if exists "admin full access" on taxis;
create policy "admin full access"
  on taxis for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for taxi photos: public read, authenticated write
insert into storage.buckets (id, name, public)
values ('taxi-photos', 'taxi-photos', true)
on conflict (id) do nothing;

drop policy if exists "public read taxi photos" on storage.objects;
create policy "public read taxi photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'taxi-photos');

drop policy if exists "admin write taxi photos" on storage.objects;
create policy "admin write taxi photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'taxi-photos')
  with check (bucket_id = 'taxi-photos');
