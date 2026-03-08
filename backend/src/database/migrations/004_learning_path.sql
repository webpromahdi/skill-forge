-- ─── Migration 004: skill_paths ──────────────────────────────────────────────
-- Stores learning paths as a simple skill + duration + phases (JSONB array).
-- Each row maps 1-to-1 with a learning_goal by skill name.

CREATE TABLE IF NOT EXISTS skill_paths (
  id       uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  skill    text    NOT NULL UNIQUE,
  duration text    NOT NULL,
  phases   jsonb   NOT NULL DEFAULT '[]'
);

-- Row-level security — public read access
ALTER TABLE skill_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skill_paths"
  ON skill_paths FOR SELECT USING (true);
