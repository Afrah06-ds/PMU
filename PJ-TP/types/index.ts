export type ItemType =
  | 'concept'
  | 'problem'
  | 'technique'
  | 'other';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'not_set';

export type LearningStatus =
  | 'new'
  | 'learned'
  | 'revised'
  | 'mastered';

export type ConfidenceLevel = 'orange' | 'yellow' | 'green' | 'blue' | 'gold';

export interface Syllabus {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  syllabus_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LearningItem {
  id: string;
  syllabus_id: string;
  topic_id: string;
  subtopic_id?: string | null;
  title: string;
  description?: string;
  item_type: ItemType;
  difficulty: Difficulty;
  created_at: string;
  updated_at: string;
}

export interface ItemProgress {
  id: string;
  item_id: string;
  status: LearningStatus;
  confidence: ConfidenceLevel;
  learned_at?: string | null;
  last_reviewed_at?: string | null;
  next_review_at?: string | null;
  revision_count: number;
  created_at: string;
  updated_at: string;
}

export interface RevisionEvent {
  id: string;
  item_id: string;
  previous_confidence?: ConfidenceLevel;
  new_confidence: ConfidenceLevel;
  previous_status?: LearningStatus;
  new_status: LearningStatus;
  result?: 'success' | 'struggled' | 'failed';
  failure_reason?: string | null;
  duration_seconds?: number;
  reviewed_at: string;
}

export interface Note {
  id: string;
  title: string;
  markdown_content: string;
  category?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NoteLink {
  id: string;
  note_id: string;
  syllabus_id?: string | null;
  topic_id?: string | null;
  item_id?: string | null;
  created_at: string;
}

export interface StudySession {
  id: string;
  started_at: string;
  ended_at?: string | null;
  duration_seconds: number;
  items_reviewed: number;
  items_learned: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  rev_1_days: number;
  rev_2_days: number;
  rev_3_days: number;
  rev_4_days: number;
}

// Joined View Types for UI Rendering
export interface LearningItemWithProgress extends LearningItem {
  progress: ItemProgress;
  syllabus_title?: string;
  topic_title?: string;
  subtopic_title?: string;
  linked_notes_count?: number;
}

export interface ReviewQueueCounts {
  overdue: number;
  dueToday: number;
  newItems: number;
  variations: number;
}

export interface DashboardAnalytics {
  totalItems: number;
  newItems: number;
  learnedItems: number;
  revisedItems: number;
  masteredItems: number;
  confidenceDistribution: Record<ConfidenceLevel, number>;
  syllabusProgress: { id: string; title: string; total: number; learned: number; percentage: number }[];
  weakAreas: { id: string; topicTitle: string; syllabusTitle: string; confidence: ConfidenceLevel }[];
  strongAreas: { id: string; topicTitle: string; syllabusTitle: string; confidence: ConfidenceLevel }[];
  reviewsCompletedOnTime: number;
  reviewsCompletedLate: number;
  overdueReviews: number;
  totalStudySeconds: number;
}
