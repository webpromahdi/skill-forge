-- ─── Notifications Table ─────────────────────────────────────────────────────
-- Stores user notifications (lesson completions, recommendations, reminders,
-- achievements).  The NotificationPanel on the frontend reads from this table.

create table if not exists notifications (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        not null,
  type       text        not null default 'reminder',
  title      text        not null,
  message    text        not null default '',
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table notifications enable row level security;

create policy "Users can read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on notifications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);
