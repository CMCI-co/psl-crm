-- ============================================================================
-- Phi Sigma Lambda CRM — schema
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh
-- project, then policies.sql, then seed.sql.
--
-- It merges two sources:
--   • the CRM core (chapters, members, offices, lifecycle, relationships) from
--     the README data model, and
--   • the training tables + profile mirror from the original Supabase setup
--     guide.
-- Column names match src/types/database.ts so the live read path works as-is.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('national_staff','campus_director','member','candidate','applicant','alumni');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_stage as enum ('applicant','candidate','member','alumni');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_status as enum ('active','inactive');
exception when duplicate_object then null; end $$;

-- ── updated_at helper ───────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ── Chapters ────────────────────────────────────────────────────────────────
create table if not exists chapters (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  campus      text,
  created_at  timestamptz not null default now()
);

-- ── Profiles (mirrors auth.users; one row per signed-in user) ────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        user_role not null default 'member',
  campus      text,
  chapter_id  uuid references chapters (id) on delete set null,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user appears.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Is the current user an editor (staff or campus director)?
create or replace function is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('national_staff','campus_director')
  );
$$;

-- ── Members (the person record across all four lifecycle stages) ─────────────
create table if not exists members (
  id              uuid primary key default gen_random_uuid(),
  chapter_id      uuid references chapters (id) on delete set null,
  first_name      text not null,
  last_name       text not null,
  middle          text,
  stage           member_stage not null default 'applicant',
  status          member_status not null default 'active',
  email           text,
  phone           text,
  address         text,
  birthday        text,
  school          text,
  major           text,
  minor           text,
  class_year      text not null default 'Freshman',
  hometown        text,
  church          text,
  employer        text,
  relationship    text,
  cohort          text,
  member_no       text,
  grad_year       text,
  work            text,
  location        text,
  marital         text,
  kids            int,
  open_to_connect boolean,
  -- Constraint name is referenced by the PostgREST embed in src/data/members.ts
  owner_id        uuid references profiles (id) on delete set null
                    constraint members_owner_id_fkey,
  avatar_url      text,
  submitted       text,
  interview_score numeric(3,1),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists members_chapter_idx on members (chapter_id);
create index if not exists members_stage_idx   on members (stage);
create index if not exists members_owner_idx   on members (owner_id);
drop trigger if exists members_updated_at on members;
create trigger members_updated_at before update on members
  for each row execute function set_updated_at();

-- ── Offices held (current + historic) ────────────────────────────────────────
create table if not exists roles_history (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  title       text not null,
  term        text,
  is_current  boolean not null default false
);
create index if not exists roles_history_member_idx on roles_history (member_id);

-- ── Lifecycle audit trail ────────────────────────────────────────────────────
create table if not exists stage_transitions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  from_stage  member_stage,
  to_stage    member_stage not null,
  by_id       uuid references profiles (id) on delete set null,
  occurred_at timestamptz not null default now()
);
create index if not exists stage_transitions_member_idx on stage_transitions (member_id);

-- ── Applications & interview scoring (applicant pipeline) ─────────────────────
create table if not exists applications (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members (id) on delete cascade,
  submitted_at  timestamptz not null default now(),
  answers       jsonb not null default '{}'::jsonb,
  status        text not null default 'pending'
);
create table if not exists interview_scores (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members (id) on delete cascade,
  reviewer_id   uuid references profiles (id) on delete set null,
  score         numeric(3,1),
  notes         text,
  created_at    timestamptz not null default now()
);

-- ── Relationship tracker: interactions, tasks, life areas, prayer ────────────
create table if not exists interactions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  by_id       uuid references profiles (id) on delete set null,
  channel     text not null default 'Call',
  note        text,
  occurred_at timestamptz not null default now()
);
create index if not exists interactions_member_idx on interactions (member_id);

create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid references members (id) on delete cascade,
  title       text not null,
  owner_id    uuid references profiles (id) on delete set null,
  created_by  uuid references profiles (id) on delete set null,
  channel     text not null default 'Call',
  priority    text not null default 'med',
  due         date,
  status      text not null default 'todo',
  created_at  timestamptz not null default now()
);
create index if not exists tasks_owner_idx on tasks (owner_id);

create table if not exists life_areas (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  area        text not null,
  tone        text not null default 'steady',
  note        text,
  updated_by  uuid references profiles (id) on delete set null,
  updated_at  timestamptz not null default now()
);

create table if not exists prayer_requests (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  text        text not null,
  answered    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Alumni engagement: giving & ways to help ─────────────────────────────────
create table if not exists giving (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  amount      numeric(10,2) not null default 0,
  fund        text,
  given_at    date not null default now()
);
create table if not exists ways_to_help (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members (id) on delete cascade,
  label       text not null,
  active      boolean not null default true
);

-- ── Notifications ────────────────────────────────────────────────────────────
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  to_id       uuid not null references profiles (id) on delete cascade,
  text        text not null,
  sub         text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists notifications_to_idx on notifications (to_id);

-- ── Resources (chapter documents / curriculum) ───────────────────────────────
create table if not exists resources (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid references chapters (id) on delete cascade,
  title       text not null,
  kind        text not null default 'doc',
  url         text,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- Training (modules → slides / questions → attempts) — from the setup guide
-- ============================================================================
create table if not exists modules (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text,
  published   boolean not null default false,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);
create table if not exists slides (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  sort        int not null default 0,
  kind        text not null default 'text',
  body        jsonb not null default '{}'::jsonb
);
create table if not exists questions (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  prompt      text not null,
  choices     jsonb not null default '[]'::jsonb,
  answer      int
);
create table if not exists attempts (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references modules (id) on delete cascade,
  user_id     uuid references profiles (id) on delete cascade,
  score       numeric(5,2),
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Storage bucket for training media.
insert into storage.buckets (id, name, public)
values ('module-media', 'module-media', true)
on conflict (id) do nothing;
