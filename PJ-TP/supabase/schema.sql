-- TRACKER PRO DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)

-- 1. Syllabi
CREATE TABLE IF NOT EXISTS syllabi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Topics
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id UUID NOT NULL REFERENCES syllabi(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subtopics (Optional)
CREATE TABLE IF NOT EXISTS subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Learning Items
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id UUID NOT NULL REFERENCES syllabi(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES subtopics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL DEFAULT 'concept', -- 'problem', 'concept', 'technique', 'definition', 'api', 'protocol', 'command', 'architecture', 'other'
  difficulty TEXT DEFAULT 'not_set', -- 'easy', 'medium', 'hard', 'not_set'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Item Progress (State & Confidence Separation)
CREATE TABLE IF NOT EXISTS item_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID UNIQUE NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'learned', 'revising', 'confident', 'mastered'
  confidence TEXT NOT NULL DEFAULT 'orange', -- 'orange', 'yellow', 'green', 'blue', 'gold'
  learned_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  revision_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Revision Events (Immutable Review Log)
CREATE TABLE IF NOT EXISTS revision_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  previous_confidence TEXT,
  new_confidence TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  result TEXT, -- 'success', 'struggled', 'failed'
  failure_reason TEXT, -- 'Didn\'t understand the concept', 'Forgot the concept', etc.
  duration_seconds INT DEFAULT 0,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notes Knowledge Base
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  markdown_content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Note Links (Note ↔ Syllabus/Topic/Item Relationships)
CREATE TABLE IF NOT EXISTS note_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  syllabus_id UUID REFERENCES syllabi(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Study Sessions (Automatic Time Tracking)
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INT DEFAULT 0,
  items_reviewed INT DEFAULT 0,
  items_learned INT DEFAULT 0
);

-- 10. User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  theme TEXT DEFAULT 'system',
  rev_1_days INT DEFAULT 2,
  rev_2_days INT DEFAULT 7,
  rev_3_days INT DEFAULT 14,
  rev_4_days INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_items_syllabus ON items(syllabus_id);
CREATE INDEX IF NOT EXISTS idx_items_topic ON items(topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_item ON item_progress(item_id);
CREATE INDEX IF NOT EXISTS idx_progress_next_review ON item_progress(next_review_at);
CREATE INDEX IF NOT EXISTS idx_revision_events_item ON revision_events(item_id);
CREATE INDEX IF NOT EXISTS idx_note_links_note ON note_links(note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_item ON note_links(item_id);
