-- ─── Resources Table ─────────────────────────────────────────────────────────
-- Run this migration in the Supabase SQL Editor to create the resources table.

create table if not exists resources (
  id         uuid    default gen_random_uuid() primary key,
  title      text    not null,
  topic      text    not null,
  type       text    not null,
  difficulty text    not null default 'Beginner',
  duration   text    not null default '10 min',
  rating     numeric not null default 0,
  author     text    not null default '',
  url        text    not null default ''
);

alter table resources enable row level security;
create policy "Anyone can read resources" on resources for select using (true);
