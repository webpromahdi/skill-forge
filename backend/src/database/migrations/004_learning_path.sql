-- ─── Learning Path Tables ────────────────────────────────────────────────────
-- Run this migration in the Supabase SQL Editor to create the learning path
-- tables and seed them with the default Frontend Developer curriculum.

-- ── learning_modules: defines each module in the learning path ──────────────
create table if not exists learning_modules (
  id          uuid    default gen_random_uuid() primary key,
  title       text    not null,
  description text    not null default '',
  order_index integer not null default 0,
  difficulty  text    not null default 'Beginner'
);

-- ── lessons: individual lessons belonging to a module ────────────────────────
create table if not exists lessons (
  id        uuid    default gen_random_uuid() primary key,
  module_id uuid    not null references learning_modules(id) on delete cascade,
  title     text    not null,
  type      text    not null default 'reading',
  duration  integer not null default 10,
  xp        integer not null default 25
);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Modules and lessons are public catalogue data — any authenticated user can
-- read them, but only admins (or migrations) can insert/update.

alter table learning_modules enable row level security;
create policy "Anyone can read modules" on learning_modules for select using (true);

alter table lessons enable row level security;
create policy "Anyone can read lessons" on lessons for select using (true);

-- ── Seed: Frontend Developer Path ───────────────────────────────────────────
-- Insert the four default modules.  Using fixed UUIDs so lesson foreign keys
-- can reference them deterministically.

insert into learning_modules (id, title, description, order_index, difficulty) values
  ('a1000000-0000-0000-0000-000000000001', 'HTML Fundamentals',
   'Learn the building blocks of web pages — tags, attributes, forms, and semantic markup.',
   1, 'Beginner'),
  ('a1000000-0000-0000-0000-000000000002', 'CSS Fundamentals',
   'Master styling with selectors, layouts, Flexbox, Grid, and responsive design.',
   2, 'Beginner'),
  ('a1000000-0000-0000-0000-000000000003', 'JavaScript Basics',
   'Understand variables, functions, DOM manipulation, events, and async patterns.',
   3, 'Intermediate'),
  ('a1000000-0000-0000-0000-000000000004', 'React Basics',
   'Components, JSX, state, props, hooks, and building interactive UIs.',
   4, 'Intermediate')
on conflict (id) do nothing;

-- ── Seed: Lessons for each module ───────────────────────────────────────────

-- HTML Fundamentals lessons
insert into lessons (module_id, title, type, duration, xp) values
  ('a1000000-0000-0000-0000-000000000001', 'Introduction to HTML',  'video',    15, 50),
  ('a1000000-0000-0000-0000-000000000001', 'Tags & Elements',       'reading',  20, 40),
  ('a1000000-0000-0000-0000-000000000001', 'Forms & Inputs',        'practice', 30, 80),
  ('a1000000-0000-0000-0000-000000000001', 'Semantic HTML',          'video',    25, 60),
  ('a1000000-0000-0000-0000-000000000001', 'HTML Quiz',              'quiz',     15, 70);

-- CSS Fundamentals lessons
insert into lessons (module_id, title, type, duration, xp) values
  ('a1000000-0000-0000-0000-000000000002', 'CSS Selectors & Specificity', 'video',    20, 50),
  ('a1000000-0000-0000-0000-000000000002', 'Box Model Deep Dive',         'reading',  25, 40),
  ('a1000000-0000-0000-0000-000000000002', 'Flexbox Layout',              'practice', 35, 80),
  ('a1000000-0000-0000-0000-000000000002', 'CSS Grid Mastery',            'practice', 40, 90),
  ('a1000000-0000-0000-0000-000000000002', 'Responsive Design',           'video',    30, 60),
  ('a1000000-0000-0000-0000-000000000002', 'CSS Quiz',                    'quiz',     15, 70);

-- JavaScript Basics lessons
insert into lessons (module_id, title, type, duration, xp) values
  ('a1000000-0000-0000-0000-000000000003', 'Variables & Data Types',  'video',    20,  50),
  ('a1000000-0000-0000-0000-000000000003', 'Functions & Scope',       'reading',  30,  60),
  ('a1000000-0000-0000-0000-000000000003', 'DOM Manipulation',        'practice', 45, 100),
  ('a1000000-0000-0000-0000-000000000003', 'Events & Listeners',      'video',    25,  60),
  ('a1000000-0000-0000-0000-000000000003', 'Async JavaScript',        'practice', 40,  90),
  ('a1000000-0000-0000-0000-000000000003', 'Build a Todo App',        'practice', 60, 120),
  ('a1000000-0000-0000-0000-000000000003', 'JavaScript Quiz',         'quiz',     20,  70);

-- React Basics lessons
insert into lessons (module_id, title, type, duration, xp) values
  ('a1000000-0000-0000-0000-000000000004', 'Introduction to React', 'video',    20,  60),
  ('a1000000-0000-0000-0000-000000000004', 'JSX & Components',      'reading',  30,  70),
  ('a1000000-0000-0000-0000-000000000004', 'State & Props',         'practice', 35,  90),
  ('a1000000-0000-0000-0000-000000000004', 'React Hooks',           'video',    45, 100),
  ('a1000000-0000-0000-0000-000000000004', 'Build a Dashboard',     'practice', 90, 150),
  ('a1000000-0000-0000-0000-000000000004', 'React Quiz',            'quiz',     20,  80);
