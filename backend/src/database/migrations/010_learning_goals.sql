-- ─── Migration 010: learning_goals ──────────────────────────────────────────
-- Creates the learning_goals catalogue table.
-- Each goal maps to a skill_path by name (see migration 004).

-- ── learning_goals: catalogue of selectable learning goals ──────────────────
CREATE TABLE IF NOT EXISTS learning_goals (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT ''
);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read learning_goals"
  ON learning_goals FOR SELECT USING (true);
