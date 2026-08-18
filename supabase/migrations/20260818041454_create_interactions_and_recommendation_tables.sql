/*
# Create interactions and recommendation history tables (single-tenant, no auth)

1. Purpose
   TechTrace AI is a hackathon demo with no sign-in flow. Multiple fictional student
   profiles share the same dataset. Interactions and recommendation history are
   persisted so the demo can be replayed and reviewed across sessions.

2. New Tables
   - `interactions`
     - `id` (uuid, primary key)
     - `student_id` (text, identifies which fictional student profile)
     - `reel_id` (text, references the static reel catalog)
     - `watch_percentage` (numeric 0-100, how much of the reel was watched)
     - `watch_duration` (numeric, seconds watched)
     - `replays` (integer, number of replays)
     - `liked` (boolean)
     - `saved` (boolean)
     - `shared` (boolean)
     - `commented` (boolean)
     - `skipped` (boolean)
     - `followed` (boolean)
     - `created_at` (timestamptz, default now)
   - `recommendation_history`
     - `id` (uuid, primary key)
     - `student_id` (text, identifies which fictional student profile)
     - `reel_id` (text, recommended reel)
     - `score` (numeric, recommendation score)
     - `interest_detected` (text, inferred latent interest)
     - `why` (text, evidence from interaction history)
     - `why_this_recommendation` (text, semantic connection explanation)
     - `difficulty` (text, Beginner/Intermediate/Advanced)
     - `confidence` (text, High/Medium/Low)
     - `hype_score` (integer, 0-100)
     - `educational_value` (integer, 0-100)
     - `strategy` (text, exploitation/adjacent/exploration)
     - `created_at` (timestamptz, default now)

3. Security
   - RLS enabled on both tables.
   - All CRUD open to anon + authenticated because this is a single-tenant demo
     with no sign-in and intentionally shared data.
*/

CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  reel_id text NOT NULL,
  watch_percentage numeric DEFAULT 0,
  watch_duration numeric DEFAULT 0,
  replays integer DEFAULT 0,
  liked boolean DEFAULT false,
  saved boolean DEFAULT false,
  shared boolean DEFAULT false,
  commented boolean DEFAULT false,
  skipped boolean DEFAULT false,
  followed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  reel_id text NOT NULL,
  score numeric DEFAULT 0,
  interest_detected text,
  why text,
  why_this_recommendation text,
  difficulty text,
  confidence text,
  hype_score integer,
  educational_value integer,
  strategy text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_interactions" ON interactions;
CREATE POLICY "anon_select_interactions" ON interactions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_interactions" ON interactions;
CREATE POLICY "anon_insert_interactions" ON interactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_interactions" ON interactions;
CREATE POLICY "anon_update_interactions" ON interactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_interactions" ON interactions;
CREATE POLICY "anon_delete_interactions" ON interactions FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_recommendation_history" ON recommendation_history;
CREATE POLICY "anon_select_recommendation_history" ON recommendation_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recommendation_history" ON recommendation_history;
CREATE POLICY "anon_insert_recommendation_history" ON recommendation_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recommendation_history" ON recommendation_history;
CREATE POLICY "anon_delete_recommendation_history" ON recommendation_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_interactions_student_id ON interactions(student_id);
CREATE INDEX IF NOT EXISTS idx_interactions_reel_id ON interactions(reel_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_history_student_id ON recommendation_history(student_id);
