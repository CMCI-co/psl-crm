-- ============================================================================
-- Phi Sigma Lambda CRM — Row Level Security
-- Run AFTER schema.sql. Roles: national_staff & campus_director are "editors"
-- (is_editor()); member, candidate, applicant, alumni are read-mostly.
-- ============================================================================

-- Enable RLS everywhere.
alter table chapters           enable row level security;
alter table profiles           enable row level security;
alter table members            enable row level security;
alter table roles_history      enable row level security;
alter table stage_transitions  enable row level security;
alter table applications       enable row level security;
alter table interview_scores   enable row level security;
alter table interactions       enable row level security;
alter table tasks              enable row level security;
alter table life_areas         enable row level security;
alter table prayer_requests    enable row level security;
alter table giving             enable row level security;
alter table ways_to_help       enable row level security;
alter table notifications      enable row level security;
alter table resources          enable row level security;
alter table modules            enable row level security;
alter table slides             enable row level security;
alter table questions          enable row level security;
alter table attempts           enable row level security;

-- Helper: a single editor-write policy is applied to most tables below.

-- ── Chapters ────────────────────────────────────────────────────────────────
drop policy if exists chapters_read on chapters;
create policy chapters_read on chapters for select to authenticated using (true);
drop policy if exists chapters_write on chapters;
create policy chapters_write on chapters for all to authenticated using (is_editor()) with check (is_editor());

-- ── Profiles ────────────────────────────────────────────────────────────────
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select to authenticated using (true);
drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_update_editor on profiles;
create policy profiles_update_editor on profiles for update to authenticated
  using (is_editor()) with check (is_editor());

-- ── Members (everyone reads; editors write) ──────────────────────────────────
drop policy if exists members_read on members;
create policy members_read on members for select to authenticated using (true);
drop policy if exists members_write on members;
create policy members_write on members for all to authenticated using (is_editor()) with check (is_editor());

-- ── Member-scoped child tables: read for all, write for editors ──────────────
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'roles_history','stage_transitions','applications','interview_scores',
    'interactions','life_areas','prayer_requests','giving','ways_to_help','resources'
  ] loop
    execute format('drop policy if exists %I_read on %I;', tbl, tbl);
    execute format('create policy %I_read on %I for select to authenticated using (true);', tbl, tbl);
    execute format('drop policy if exists %I_write on %I;', tbl, tbl);
    execute format('create policy %I_write on %I for all to authenticated using (is_editor()) with check (is_editor());', tbl, tbl);
  end loop;
end $$;

-- ── Tasks: editors manage; the assigned owner may read & update their own ────
drop policy if exists tasks_read on tasks;
create policy tasks_read on tasks for select to authenticated using (true);
drop policy if exists tasks_write_editor on tasks;
create policy tasks_write_editor on tasks for all to authenticated using (is_editor()) with check (is_editor());
drop policy if exists tasks_update_owner on tasks;
create policy tasks_update_owner on tasks for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ── Notifications: a user sees and updates only their own ─────────────────────
drop policy if exists notifications_own on notifications;
create policy notifications_own on notifications for select to authenticated using (to_id = auth.uid());
drop policy if exists notifications_update_own on notifications;
create policy notifications_update_own on notifications for update to authenticated
  using (to_id = auth.uid()) with check (to_id = auth.uid());
drop policy if exists notifications_insert on notifications;
create policy notifications_insert on notifications for insert to authenticated with check (is_editor());

-- ── Training: published modules readable by all; editors author ──────────────
drop policy if exists modules_read on modules;
create policy modules_read on modules for select to authenticated using (published or is_editor());
drop policy if exists modules_write on modules;
create policy modules_write on modules for all to authenticated using (is_editor()) with check (is_editor());

do $$
declare tbl text;
begin
  foreach tbl in array array['slides','questions'] loop
    execute format('drop policy if exists %I_read on %I;', tbl, tbl);
    execute format('create policy %I_read on %I for select to authenticated using (true);', tbl, tbl);
    execute format('drop policy if exists %I_write on %I;', tbl, tbl);
    execute format('create policy %I_write on %I for all to authenticated using (is_editor()) with check (is_editor());', tbl, tbl);
  end loop;
end $$;

-- Attempts: a learner manages their own; editors can read all.
drop policy if exists attempts_own on attempts;
create policy attempts_own on attempts for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists attempts_read_editor on attempts;
create policy attempts_read_editor on attempts for select to authenticated using (is_editor());

-- ── Storage: module-media readable by all, writable by editors ───────────────
drop policy if exists module_media_read on storage.objects;
create policy module_media_read on storage.objects for select to authenticated
  using (bucket_id = 'module-media');
drop policy if exists module_media_write on storage.objects;
create policy module_media_write on storage.objects for all to authenticated
  using (bucket_id = 'module-media' and is_editor())
  with check (bucket_id = 'module-media' and is_editor());
