-- ─── Migration 008: user_profiles ─────────────────────────────────────────
-- Stores extended profile data for each user.
-- Auth data (name, email) lives in Supabase auth.users —
-- only app-specific fields are stored here.

create table if not exists user_profiles (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id) on delete cascade unique not null,
  phone_number         text,
  learning_goal        text,
  daily_learning_time  integer,          -- minutes per day
  motivation           text,
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table user_profiles enable row level security;

-- Users may only read their own profile row
create policy "users can read own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

-- Users may only insert their own profile row
create policy "users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = user_id);

-- Users may only update their own profile row
create policy "users can update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);
