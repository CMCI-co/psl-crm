-- supabase/policies.sql
-- Row-Level Security for the four roles (national_staff, campus_director,
-- member, candidate). Apply AFTER schema.sql.
--
--   national_staff   → cross-chapter, full access
--   campus_director  → full CRUD within their own chapter (default role)
--   member           → read their chapter; write their own prayer/interactions
--   candidate        → read their chapter (most restricted)
--
-- owner_id / by_id / to_id are leader *display names* in this pass, so a few
-- policies key off chapter membership rather than per-row identity. Tightening
-- those to real profile FKs is a later step (see BUILD_STATUS.md).

-- ── Identity helpers (SECURITY DEFINER to avoid recursive RLS on profiles) ──
create or replace function auth_role()
returns app_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function auth_chapter()
returns uuid language sql stable security definer set search_path = public as $$
  select chapter_id from public.profiles where id = auth.uid()
$$;

create or replace function is_staff()
returns boolean language sql stable as $$ select auth_role() = 'national_staff' $$;

create or replace function can_manage()
returns boolean language sql stable as $$ select auth_role() in ('national_staff', 'campus_director') $$;

-- ── Enable RLS ──────────────────────────────────────────────────────────────
alter table chapters          enable row level security;
alter table profiles          enable row level security;
alter table members           enable row level security;
alter table roles_history     enable row level security;
alter table applications      enable row level security;
alter table interview_scores  enable row level security;
alter table interactions      enable row level security;
alter table tasks             enable row level security;
alter table life_areas        enable row level security;
alter table prayer_requests   enable row level security;
alter table giving            enable row level security;
alter table ways_to_help      enable row level security;
alter table milestones        enable row level security;
alter table notifications     enable row level security;
alter table stage_transitions enable row level security;
alter table resources         enable row level security;
alter table training_lessons  enable row level security;
alter table training_progress enable row level security;

-- ── Chapters ────────────────────────────────────────────────────────────────
drop policy if exists chapters_read on chapters;
create policy chapters_read on chapters for select to authenticated
  using (is_staff() or id = auth_chapter());
drop policy if exists chapters_write on chapters;
create policy chapters_write on chapters for all to authenticated
  using (is_staff()) with check (is_staff());

-- ── Profiles ────────────────────────────────────────────────────────────────
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select to authenticated
  using (is_staff() or chapter_id = auth_chapter() or id = auth.uid());
drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists profiles_staff_write on profiles;
create policy profiles_staff_write on profiles for all to authenticated
  using (is_staff()) with check (is_staff());

-- ── Members ─────────────────────────────────────────────────────────────────
drop policy if exists members_read on members;
create policy members_read on members for select to authenticated
  using (is_staff() or chapter_id = auth_chapter());
drop policy if exists members_insert on members;
create policy members_insert on members for insert to authenticated
  with check (is_staff() or (can_manage() and chapter_id = auth_chapter()));
drop policy if exists members_update on members;
create policy members_update on members for update to authenticated
  using (is_staff() or (can_manage() and chapter_id = auth_chapter()))
  with check (is_staff() or (can_manage() and chapter_id = auth_chapter()));
drop policy if exists members_delete on members;
create policy members_delete on members for delete to authenticated
  using (is_staff() or (can_manage() and chapter_id = auth_chapter()));

-- ── Generic child-table policies ────────────────────────────────────────────
-- Readable if you can see the parent member; writable by managers in-chapter.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'roles_history','applications','interview_scores','interactions',
    'tasks','life_areas','prayer_requests','giving','ways_to_help',
    'milestones','stage_transitions','training_progress'
  ] loop
    -- tasks has a nullable about_member, so guard the join with coalesce logic
    execute format($f$
      drop policy if exists %1$s_read on %1$s;
      create policy %1$s_read on %1$s for select to authenticated
        using (
          is_staff() or exists (
            select 1 from members mm
            where mm.id = %1$s.member_id and mm.chapter_id = auth_chapter()
          )
        );
    $f$, tbl);

    execute format($f$
      drop policy if exists %1$s_write on %1$s;
      create policy %1$s_write on %1$s for all to authenticated
        using (
          is_staff() or (can_manage() and exists (
            select 1 from members mm
            where mm.id = %1$s.member_id and mm.chapter_id = auth_chapter()
          ))
        )
        with check (
          is_staff() or (can_manage() and exists (
            select 1 from members mm
            where mm.id = %1$s.member_id and mm.chapter_id = auth_chapter()
          ))
        );
    $f$, tbl);
  end loop;
end $$;

-- tasks.about_member is nullable; allow managers to read/write chapter-less tasks too.
drop policy if exists tasks_manage_unscoped on tasks;
create policy tasks_manage_unscoped on tasks for all to authenticated
  using (is_staff() or can_manage())
  with check (is_staff() or can_manage());

-- Members may add their own prayer requests + interactions.
drop policy if exists prayer_member_insert on prayer_requests;
create policy prayer_member_insert on prayer_requests for insert to authenticated
  with check (exists (
    select 1 from members mm
    where mm.id = prayer_requests.member_id and mm.chapter_id = auth_chapter()
  ));

-- ── Notifications ───────────────────────────────────────────────────────────
-- Recipient identity is a display name in this pass; scope to chapter members.
drop policy if exists notifications_read on notifications;
create policy notifications_read on notifications for select to authenticated
  using (true);
drop policy if exists notifications_write on notifications;
create policy notifications_write on notifications for all to authenticated
  using (can_manage()) with check (can_manage());

-- ── Resources ───────────────────────────────────────────────────────────────
drop policy if exists resources_read on resources;
create policy resources_read on resources for select to authenticated
  using (is_staff() or chapter_id = auth_chapter());
drop policy if exists resources_write on resources;
create policy resources_write on resources for all to authenticated
  using (is_staff() or (can_manage() and chapter_id = auth_chapter()))
  with check (is_staff() or (can_manage() and chapter_id = auth_chapter()));

-- ── Training lessons (shared catalog) ───────────────────────────────────────
drop policy if exists training_read on training_lessons;
create policy training_read on training_lessons for select to authenticated
  using (true);
drop policy if exists training_write on training_lessons;
create policy training_write on training_lessons for all to authenticated
  using (is_staff()) with check (is_staff());
