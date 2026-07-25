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

create index if not exists taxis_region_idx on taxis (region);
create index if not exists taxis_active_idx on taxis (active);
create index if not exists taxis_featured_idx on taxis (featured);

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
