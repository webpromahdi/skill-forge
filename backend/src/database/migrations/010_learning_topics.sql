-- ─── Learning Topics & Recommendations Tables ───────────────────────────────
-- Run this migration in the Supabase SQL Editor.

-- learning_topics: stores valid recommendation topics per learning goal
CREATE TABLE IF NOT EXISTS learning_topics (
  id              uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id         uuid    NOT NULL REFERENCES learning_goals(id) ON DELETE CASCADE,
  title           text    NOT NULL,
  difficulty      text    NOT NULL DEFAULT 'Beginner',
  estimated_time  integer NOT NULL DEFAULT 30,
  xp              integer NOT NULL DEFAULT 50
);

ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read learning_topics" ON learning_topics FOR SELECT USING (true);
CREATE INDEX idx_learning_topics_goal_id ON learning_topics(goal_id);

-- recommendations: stores AI-generated recommendations per user
CREATE TABLE IF NOT EXISTS recommendations (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL,
  topic       text        NOT NULL,
  reason      text        NOT NULL DEFAULT '',
  match_score integer     NOT NULL DEFAULT 85,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
