-- ─── Migration 011: recommendation_resources ────────────────────────────────
-- Stores AI-generated learning resources organized by skill and phase.
-- Each phase contains a YouTube video resource and a blog/tutorial guide.

CREATE TABLE IF NOT EXISTS recommendation_resources (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  skill          text        NOT NULL,
  phase_title    text        NOT NULL,
  resource_type  text        NOT NULL,
  source         text        NOT NULL DEFAULT '',
  title          text        NOT NULL,
  url            text        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(skill, phase_title, resource_type)
);

ALTER TABLE recommendation_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recommendation_resources"
  ON recommendation_resources FOR SELECT USING (true);

CREATE POLICY "Service can insert recommendation_resources"
  ON recommendation_resources FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can delete recommendation_resources"
  ON recommendation_resources FOR DELETE USING (true);

CREATE INDEX idx_recommendation_resources_skill
  ON recommendation_resources(skill);
