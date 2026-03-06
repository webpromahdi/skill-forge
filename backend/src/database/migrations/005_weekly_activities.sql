-- ─── Weekly Activities Table ─────────────────────────────────────────────────
-- Stores per-day activity snapshots for the weekly activity view on the
-- dashboard.  Each row represents one day's planned / completed activities
-- for a given user.

create table if not exists weekly_activities (
  id                  uuid        default gen_random_uuid() primary key,
  user_id             uuid        not null,
  day                 text        not null,
  lesson_name         text        not null default '',
  status              text        not null default 'not-started',
  reading_activities  integer     not null default 0,
  math_activities     integer     not null default 0,
  total_time          integer     not null default 0,
  completed           integer     not null default 0,
  total               integer     not null default 0,
  created_at          timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table weekly_activities enable row level security;

create policy "Users can read own weekly activities"
  on weekly_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own weekly activities"
  on weekly_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weekly activities"
  on weekly_activities for update
  using (auth.uid() = user_id);
