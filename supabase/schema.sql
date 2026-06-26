-- supabase/schema.sql
-- Phi Sigma Lambda CRM — database schema.
-- Apply in the Supabase SQL editor (or `supabase db push`) BEFORE policies.sql
-- and seed.sql. Column names are snake_case and line up 1:1 with the camelCase
-- domain model mapped in src/data/supabaseDataSource.ts.
--
-- Run order:  schema.sql  →  policies.sql  →  seed.sql

-- ── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ── Enums ──────────────────────────────────────────────────────────────────
do $$ begin
  create type stage as enum ('applicant', 'candidate', 'member', 'alumni');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_status as enum ('active', 'inactive');
exception when duplicate_object then null; end $$;

do $$ begin
  create type class_year as enum ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Super Senior', 'Alumni');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_role as enum ('national_staff', 'campus_director', 'member', 'candidate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_channel as enum ('Call', 'Text', 'Email', 'Visit');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('high', 'med', 'low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('todo', 'doing', 'done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type life_area_status as enum ('thriving', 'steady', 'watch', 'struggling');
exception when duplicate_object then null; end $$;

do $$ begin
  create type prayer_status as enum ('open', 'answered');
exception when duplicate_object then null; end $$;

do $$ begin
  create type milestone_kind as enum ('app', 'interview', 'stage', 'personal', 'next');
exception when duplicate_object then null; end $$;

-- ── updated_at helper ──────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── Chapters ───────────────────────────────────────────────────────────────
create table if not exists chapters (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  school      text,
  created_at  timestamptz not null default now()
);

-- ── Profiles (1:1 with auth.users) ─────────────────────────────────────────
-- Holds the app role used by RLS. A row should be created for every signed-in
-- user (see the handle_new_user trigger below).
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  role        app_role not null default 'campus_director',
  chapter_id  uuid references chapters(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Members (people in the lifecycle) ──────────────────────────────────────
create table if not exists members (
  id              uuid primary key default gen_random_uuid(),
  chapter_id      uuid references chapters(id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  middle          text,
  stage           stage not null default 'applicant',
  status          member_status not null default 'active',
  -- identity
  email           text,
  phone           text,
  address         text,
  birthday        text,
  school          text,
  major           text,
  minor           text,
  class_year      class_year,
  hometown        text,
  church          text,
  employer        text,
  relationship    text,
  cohort          text,
  member_no       text unique,
  -- applicant
  submitted       text,
  interview_score numeric(3,1),
  -- cadence (Relationship Tracker)
  owner_id        text,            -- leader display name in this pass
  due             text,            -- 'overdue' | 'due' | 'ok'
  next            text,
  cadence         text,
  -- alumni
  grad_year       text,
  work            text,
  location        text,
  marital         text,
  kids            int,
  open_to_connect boolean default false,
  -- misc
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_members_stage on members(stage);
create index if not exists idx_members_chapter on members(chapter_id);
create index if not exists idx_members_class_year on members(class_year);
drop trigger if exists trg_members_updated on members;
create trigger trg_members_updated before update on members
  for each row execute function set_updated_at();

-- ── Roles / offices history ────────────────────────────────────────────────
create table if not exists roles_history (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  title       text not null,
  term        text,
  is_current  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_roles_member on roles_history(member_id);

-- ── Applications + interview scores ────────────────────────────────────────
create table if not exists applications (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  submitted_at  text,
  essay         text,
  status        text default 'submitted',
  created_at    timestamptz not null default now()
);

create table if not exists interview_scores (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid not null references members(id) on delete cascade,
  reviewer     text,
  criterion    text not null,
  score        numeric(3,1) not null,
  note         text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_scores_member on interview_scores(member_id);

-- ── Interactions (logged contact) ──────────────────────────────────────────
create table if not exists interactions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references members(id) on delete cascade,
  type        text not null,         -- Call | Text | Email | Visit | Note
  by_id       text,                  -- leader display name
  note        text,
  occurred_at timestamptz not null default now()
);
create index if not exists idx_interactions_member on interactions(member_id);

-- ── Tasks / follow-ups ─────────────────────────────────────────────────────
create table if not exists tasks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  about_member  uuid references members(id) on delete set null,
  about_who     text,                -- denormalized display name
  owner_id      text,                -- assignee display name in this pass
  channel       task_channel default 'Call',
  priority      task_priority default 'med',
  status        task_status default 'todo',
  due           text,
  bucket        text,                -- overdue | today | week
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_tasks_owner on tasks(owner_id);
drop trigger if exists trg_tasks_updated on tasks;
create trigger trg_tasks_updated before update on tasks
  for each row execute function set_updated_at();

-- ── Life areas ("How they're doing") ───────────────────────────────────────
create table if not exists life_areas (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  area        text not null,         -- Spiritual | Academic | Relational | ...
  status      life_area_status not null default 'steady',
  note        text,
  updated_at  timestamptz not null default now()
);
create index if not exists idx_life_member on life_areas(member_id);

-- ── Prayer requests ────────────────────────────────────────────────────────
create table if not exists prayer_requests (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  text        text not null,
  status      prayer_status not null default 'open',
  praise      text,
  date        text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_prayer_member on prayer_requests(member_id);

-- ── Giving ─────────────────────────────────────────────────────────────────
create table if not exists giving (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  amount      numeric(10,2) not null default 0,
  fund        text,
  date        text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_giving_member on giving(member_id);

-- ── Ways to help ───────────────────────────────────────────────────────────
create table if not exists ways_to_help (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  label       text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists idx_help_member on ways_to_help(member_id);

-- ── Milestones ─────────────────────────────────────────────────────────────
create table if not exists milestones (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  date        text,
  title       text not null,
  kind        milestone_kind not null default 'stage',
  done        boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists idx_milestones_member on milestones(member_id);

-- ── Notifications ──────────────────────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  to_id       text not null,         -- recipient display name in this pass
  text        text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_notifications_to on notifications(to_id);

-- ── Stage transitions (audit log) ──────────────────────────────────────────
create table if not exists stage_transitions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  from_stage  stage,
  to_stage    stage not null,
  by_id       text,                  -- actor display name in this pass
  occurred_at timestamptz not null default now()
);
create index if not exists idx_transitions_member on stage_transitions(member_id);

-- ── Resources (shared library) ─────────────────────────────────────────────
create table if not exists resources (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid references chapters(id) on delete cascade,
  title       text not null,
  category    text,
  url         text,                  -- Supabase Storage path / external URL
  uploaded_by text,
  created_at  timestamptz not null default now()
);

-- ── Training ───────────────────────────────────────────────────────────────
create table if not exists training_lessons (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text,
  body        jsonb,
  sort        int default 0,
  created_at  timestamptz not null default now()
);

create table if not exists training_progress (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  lesson_id   uuid not null references training_lessons(id) on delete cascade,
  completed   boolean not null default false,
  completed_at timestamptz,
  unique (member_id, lesson_id)
);
