-- ─── user_progress table ─────────────────────────────────────────────────────
-- Stores per-topic learning progress for each user.
-- Run this migration in the Supabase SQL Editor to create the table.

create table if not exists user_progress (
  id             uuid          default gen_random_uuid() primary key,
  user_id        uuid          not null,
  topic          text          not null,
  progress_percentage integer  not null default 0,
  status         text          not null default 'not-started',
  lessons_completed  integer   not null default 0,
  study_time     float         not null default 0,
  xp             integer       not null default 0,
  last_updated   timestamptz   not null default now(),

  -- Each user can only have one row per topic
  unique (user_id, topic)
);

-- Enable Row Level Security so only authenticated users see their own data
alter table user_progress enable row level security;

create policy "Users can read own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress for update
  using (auth.uid() = user_id);
