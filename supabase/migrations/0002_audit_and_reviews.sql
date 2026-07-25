-- KKTC Taksi: admin audit log + public reviews

create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null,
  taxi_id uuid,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx
  on admin_audit_log (created_at desc);

grant usage on schema public to anon, authenticated, service_role;
grant insert on table admin_audit_log to anon;
grant select, insert on table admin_audit_log to authenticated;
grant all on table admin_audit_log to service_role;

alter table admin_audit_log enable row level security;

drop policy if exists "admin read audit log" on admin_audit_log;
create policy "admin read audit log"
  on admin_audit_log for select
  to authenticated
  using (true);

drop policy if exists "admin write audit log" on admin_audit_log;
create policy "admin write audit log"
  on admin_audit_log for insert
  to authenticated
  with check (true);

-- Failed-login attempts are logged pre-auth (anon role). Scoped narrowly so
-- an anonymous writer can only ever record that one action, with no taxi_id.
drop policy if exists "anon write login-failed audit" on admin_audit_log;
create policy "anon write login-failed audit"
  on admin_audit_log for insert
  to anon
  with check (action = 'login_failed' and taxi_id is null);

-- Reviews: visitors submit unmoderated, only admin-approved reviews are
-- shown publicly. Admin can read/approve/delete everything.
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  taxi_id uuid not null references taxis (id) on delete cascade,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_taxi_id_idx on reviews (taxi_id);
create index if not exists reviews_approved_idx on reviews (approved);

grant select, insert on table reviews to anon;
grant select, insert, update, delete on table reviews to authenticated;
grant all on table reviews to service_role;

alter table reviews enable row level security;

drop policy if exists "public read approved reviews" on reviews;
create policy "public read approved reviews"
  on reviews for select
  to anon
  using (approved = true);

drop policy if exists "public submit review" on reviews;
create policy "public submit review"
  on reviews for insert
  to anon
  with check (approved = false);

drop policy if exists "admin full access reviews" on reviews;
create policy "admin full access reviews"
  on reviews for all
  to authenticated
  using (true)
  with check (true);
