-- ─── Deadlines Table ─────────────────────────────────────────────────────────
-- Stores per-user learning deadlines (quizzes, project submissions, module starts, etc.).
-- The UpcomingDeadlines dashboard widget queries the next 5 approaching deadlines.

CREATE TABLE IF NOT EXISTS deadlines (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  type       TEXT        NOT NULL,           -- e.g. 'quiz', 'project', 'module'
  due_date   DATE        NOT NULL,
  priority   TEXT        NOT NULL DEFAULT 'medium',  -- 'high', 'medium', 'low'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast per-user lookups sorted by due date
CREATE INDEX IF NOT EXISTS idx_deadlines_user_due
  ON deadlines (user_id, due_date);

-- ─── Row-Level Security ─────────────────────────────────────────────────────
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

-- Users can read their own deadlines
CREATE POLICY "Users can view own deadlines"
  ON deadlines FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own deadlines
CREATE POLICY "Users can insert own deadlines"
  ON deadlines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own deadlines
CREATE POLICY "Users can update own deadlines"
  ON deadlines FOR UPDATE
  USING (auth.uid() = user_id);
