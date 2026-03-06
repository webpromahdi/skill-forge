-- ─── Quiz System Tables ──────────────────────────────────────────────────────
-- Run this migration in the Supabase SQL Editor to create quiz tables.

-- ── quizzes: stores the quiz catalogue ───────────────────────────────────────
create table if not exists quizzes (
  id         uuid    default gen_random_uuid() primary key,
  title      text    not null,
  topic      text    not null,
  difficulty text    not null default 'Beginner',
  duration   integer not null default 10,
  xp         integer not null default 50
);

-- ── quiz_questions: stores questions per quiz ────────────────────────────────
create table if not exists quiz_questions (
  id             uuid default gen_random_uuid() primary key,
  quiz_id        uuid not null references quizzes(id) on delete cascade,
  question       text not null,
  option_a       text not null,
  option_b       text not null,
  option_c       text not null,
  option_d       text not null,
  correct_answer text not null
);

-- ── quiz_results: stores user attempt results ────────────────────────────────
create table if not exists quiz_results (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        not null,
  quiz_id      uuid        not null references quizzes(id) on delete cascade,
  score        integer     not null default 0,
  xp_earned    integer     not null default 0,
  completed_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table quizzes enable row level security;
create policy "Anyone can read quizzes" on quizzes for select using (true);

alter table quiz_questions enable row level security;
create policy "Anyone can read questions" on quiz_questions for select using (true);

alter table quiz_results enable row level security;
create policy "Users can read own results"  on quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert own results" on quiz_results for insert with check (auth.uid() = user_id);
