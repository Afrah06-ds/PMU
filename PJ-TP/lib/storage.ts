import {
  Syllabus,
  Topic,
  Subtopic,
  LearningItem,
  ItemProgress,
  RevisionEvent,
  Note,
  NoteLink,
  StudySession,
  UserSettings,
  LearningItemWithProgress,
  ReviewQueueCounts,
  DashboardAnalytics,
  ConfidenceLevel,
  LearningStatus,
  Difficulty,
  ItemType
} from '@/types';

// Default initial data for Tracker Pro
const INITIAL_SETTINGS: UserSettings = {
  theme: 'system',
  rev_1_days: 2,
  rev_2_days: 7,
  rev_3_days: 14,
  rev_4_days: 30,
};

const SAMPLE_SYLLABI: Syllabus[] = [
  {
    id: 'syll-backend',
    title: 'Backend Development',
    description: 'Mastering REST APIs, Networking, Authentication, and Databases',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'syll-dsa',
    title: 'Data Structures & Algorithms',
    description: 'Core problem-solving patterns, algorithms, and technical interview prep',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_TOPICS: Topic[] = [
  // Backend Topics
  {
    id: 'top-rest',
    syllabus_id: 'syll-backend',
    title: 'REST APIs',
    description: 'HTTP Methods, Status Codes, API Architecture',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'top-auth',
    syllabus_id: 'syll-backend',
    title: 'Authentication',
    description: 'JWT, Sessions, OAuth 2.0, Tokens',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'top-net',
    syllabus_id: 'syll-backend',
    title: 'Networking',
    description: 'Transport & Application layer protocols',
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // DSA Topics
  {
    id: 'top-arrays',
    syllabus_id: 'syll-dsa',
    title: 'Arrays',
    description: 'Array patterns, two-pointers, sliding window',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'top-bs',
    syllabus_id: 'syll-dsa',
    title: 'Binary Search',
    description: 'Logarithmic search algorithms and variations',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_SUBTOPICS: Subtopic[] = [
  {
    id: 'sub-http-methods',
    topic_id: 'top-rest',
    title: 'HTTP Methods',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-http-status',
    topic_id: 'top-rest',
    title: 'Status Codes',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-net-fundamentals',
    topic_id: 'top-net',
    title: 'Fundamentals',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-two-pointers',
    topic_id: 'top-arrays',
    title: 'Two Pointers',
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-sliding-window',
    topic_id: 'top-arrays',
    title: 'Sliding Window',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_ITEMS: LearningItem[] = [
  // REST API items
  {
    id: 'item-get',
    syllabus_id: 'syll-backend',
    topic_id: 'top-rest',
    subtopic_id: 'sub-http-methods',
    title: 'GET',
    description: 'Retrieves data from a server. Idempotent and safe.',
    item_type: 'concept',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-post',
    syllabus_id: 'syll-backend',
    topic_id: 'top-rest',
    subtopic_id: 'sub-http-methods',
    title: 'POST',
    description: 'Submits data to be processed by a specified resource.',
    item_type: 'concept',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-status-200',
    syllabus_id: 'syll-backend',
    topic_id: 'top-rest',
    subtopic_id: 'sub-http-status',
    title: '200 OK',
    description: 'Standard HTTP response for successful requests.',
    item_type: 'definition',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Auth items
  {
    id: 'item-jwt',
    syllabus_id: 'syll-backend',
    topic_id: 'top-auth',
    subtopic_id: null,
    title: 'JWT Authentication',
    description: 'JSON Web Token stateless authentication mechanism.',
    item_type: 'concept',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-oauth',
    syllabus_id: 'syll-backend',
    topic_id: 'top-auth',
    subtopic_id: null,
    title: 'OAuth 2.0',
    description: 'Industry-standard protocol for authorization delegation.',
    item_type: 'protocol',
    difficulty: 'medium',
    created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Networking items
  {
    id: 'item-tcp',
    syllabus_id: 'syll-backend',
    topic_id: 'top-net',
    subtopic_id: 'sub-net-fundamentals',
    title: 'TCP vs UDP',
    description: 'Connection-oriented reliable protocol vs connectionless fast protocol.',
    item_type: 'protocol',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-dns',
    syllabus_id: 'syll-backend',
    topic_id: 'top-net',
    subtopic_id: 'sub-net-fundamentals',
    title: 'DNS Resolution Flow',
    description: 'Domain Name System hierarchical resolution process.',
    item_type: 'concept',
    difficulty: 'not_set',
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  // DSA items
  {
    id: 'item-twosum',
    syllabus_id: 'syll-dsa',
    topic_id: 'top-arrays',
    subtopic_id: 'sub-two-pointers',
    title: 'Two Sum',
    description: 'Find two indices that sum to target value using Hash Map or Sorting.',
    item_type: 'problem',
    difficulty: 'easy',
    created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-max-subarray',
    syllabus_id: 'syll-dsa',
    topic_id: 'top-arrays',
    subtopic_id: 'sub-sliding-window',
    title: 'Maximum Sum Subarray',
    description: 'Kadane algorithm or sliding window for contiguous subarray sum.',
    item_type: 'problem',
    difficulty: 'medium',
    created_at: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-binary-search',
    syllabus_id: 'syll-dsa',
    topic_id: 'top-bs',
    subtopic_id: null,
    title: 'Binary Search',
    description: 'Find index of target in sorted array in O(log n) time.',
    item_type: 'technique',
    difficulty: 'easy',
    created_at: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_PROGRESS: ItemProgress[] = [
  {
    id: 'prog-get',
    item_id: 'item-get',
    status: 'confident',
    confidence: 'green',
    learned_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    revision_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-post',
    item_id: 'item-post',
    status: 'revising',
    confidence: 'yellow',
    learned_at: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), // DUE TODAY
    revision_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-status-200',
    item_id: 'item-status-200',
    status: 'mastered',
    confidence: 'gold',
    learned_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() + 29 * 24 * 3600 * 1000).toISOString(),
    revision_count: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-jwt',
    item_id: 'item-jwt',
    status: 'revising',
    confidence: 'yellow',
    learned_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // OVERDUE
    revision_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-oauth',
    item_id: 'item-oauth',
    status: 'revising',
    confidence: 'orange',
    learned_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // OVERDUE
    revision_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-tcp',
    item_id: 'item-tcp',
    status: 'revising',
    confidence: 'orange',
    learned_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // OVERDUE
    revision_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-dns',
    item_id: 'item-dns',
    status: 'new',
    confidence: 'orange',
    learned_at: null,
    last_reviewed_at: null,
    next_review_at: null,
    revision_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-twosum',
    item_id: 'item-twosum',
    status: 'confident',
    confidence: 'blue',
    learned_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() + 13 * 24 * 3600 * 1000).toISOString(),
    revision_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-max-subarray',
    item_id: 'item-max-subarray',
    status: 'revising',
    confidence: 'yellow',
    learned_at: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    revision_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prog-binary-search',
    item_id: 'item-binary-search',
    status: 'mastered',
    confidence: 'gold',
    learned_at: new Date(Date.now() - 22 * 24 * 3600 * 1000).toISOString(),
    last_reviewed_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    next_review_at: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
    revision_count: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_REVISION_EVENTS: RevisionEvent[] = [
  {
    id: 'rev-1',
    item_id: 'item-jwt',
    previous_confidence: 'orange',
    new_confidence: 'yellow',
    previous_status: 'learned',
    new_status: 'revising',
    result: 'struggled',
    failure_reason: 'Needed a hint',
    duration_seconds: 120,
    reviewed_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    item_id: 'item-twosum',
    previous_confidence: 'green',
    new_confidence: 'blue',
    previous_status: 'revising',
    new_status: 'confident',
    result: 'success',
    duration_seconds: 180,
    reviewed_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

const SAMPLE_NOTES: Note[] = [
  {
    id: 'note-jwt',
    title: 'JWT Authentication',
    category: 'Backend',
    tags: ['auth', 'jwt', 'security'],
    markdown_content: `# JWT Authentication

## What is JWT?
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

## Structure
A JWT consists of three parts separated by dots (\`.\`):
1. **Header**: Contains algorithm (\`HS256\`, \`RS256\`) and token type.
2. **Payload**: Contains claims (user info, expiration time \`exp\`).
3. **Signature**: Cryptographic signature generated with secret key.

\`\`\`javascript
// Example Authorization Header
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## Important
> **Security Warning**: JWTs are signed to ensure integrity, but by default they are NOT encrypted. Do not store sensitive secrets (passwords, credit cards) inside the payload!
`,
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'note-tcp',
    title: 'TCP vs UDP Protocols',
    category: 'Networking',
    tags: ['networking', 'tcp', 'udp'],
    markdown_content: `# TCP vs UDP Fundamentals

## Transmission Control Protocol (TCP)
- **Connection-oriented**: Requires 3-way handshake (\`SYN\` -> \`SYN-ACK\` -> \`ACK\`).
- **Reliable**: Guarantees delivery and sequence order with packet acknowledgments.
- **Use cases**: Web (HTTP/HTTPS), Email (SMTP), File transfer (FTP).

## User Datagram Protocol (UDP)
- **Connectionless**: No handshake needed; send and forget.
- **Fast & Lightweight**: Minimal header overhead without guarantee of arrival order.
- **Use cases**: Live video streaming, Gaming, DNS queries, VoIP.
`,
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SAMPLE_NOTE_LINKS: NoteLink[] = [
  {
    id: 'link-jwt',
    note_id: 'note-jwt',
    item_id: 'item-jwt',
    created_at: new Date().toISOString(),
  },
  {
    id: 'link-tcp',
    note_id: 'note-tcp',
    item_id: 'item-tcp',
    created_at: new Date().toISOString(),
  },
];

const SAMPLE_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'session-1',
    started_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    ended_at: new Date().toISOString(),
    duration_seconds: 2820, // 47 min
    items_reviewed: 8,
    items_learned: 2,
  },
];

// LOCAL STORAGE PERSISTENCE ENGINE WITH REACTIVE LISTENERS
const STORAGE_KEYS = {
  IS_WIPED: 'tracker_pro_is_wiped',
  SETTINGS: 'tracker_pro_settings',
  SYLLABI: 'tracker_pro_syllabi',
  TOPICS: 'tracker_pro_topics',
  SUBTOPICS: 'tracker_pro_subtopics',
  ITEMS: 'tracker_pro_items',
  PROGRESS: 'tracker_pro_progress',
  REVISION_EVENTS: 'tracker_pro_revision_events',
  NOTES: 'tracker_pro_notes',
  NOTE_LINKS: 'tracker_pro_note_links',
  SESSIONS: 'tracker_pro_sessions',
};

class StorageEngine {
  private isBrowser: boolean;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.isBrowser = typeof window !== 'undefined';
    if (this.isBrowser) {
      this.initDefaultData();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private getItem<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (err) {
      console.error('Failed saving to localStorage', err);
    }
  }

  public initDefaultData(force: boolean = false) {
    if (!this.isBrowser) return;
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }
  }

  public wipeOutAllData(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.IS_WIPED, 'true');
    this.setItem(STORAGE_KEYS.SYLLABI, []);
    this.setItem(STORAGE_KEYS.TOPICS, []);
    this.setItem(STORAGE_KEYS.SUBTOPICS, []);
    this.setItem(STORAGE_KEYS.ITEMS, []);
    this.setItem(STORAGE_KEYS.PROGRESS, []);
    this.setItem(STORAGE_KEYS.REVISION_EVENTS, []);
    this.setItem(STORAGE_KEYS.NOTES, []);
    this.setItem(STORAGE_KEYS.NOTE_LINKS, []);
    this.setItem(STORAGE_KEYS.SESSIONS, []);
    this.notify();
  }

  // --- SETTINGS ---
  public getSettings(): UserSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- SYLLABI ---
  public getSyllabi(): Syllabus[] {
    return this.getItem(STORAGE_KEYS.SYLLABI, []);
  }

  public addSyllabus(title: string, description?: string): Syllabus {
    const list = this.getSyllabi();
    const newSyllabus: Syllabus = {
      id: `syll-${Date.now()}`,
      title,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.SYLLABI, [newSyllabus, ...list]);
    return newSyllabus;
  }

  public updateSyllabus(id: string, title: string, description?: string): void {
    const list = this.getSyllabi();
    const updated = list.map((s) => (s.id === id ? { ...s, title, description, updated_at: new Date().toISOString() } : s));
    this.setItem(STORAGE_KEYS.SYLLABI, updated);
  }

  public deleteSyllabus(id: string): void {
    const list = this.getSyllabi().filter((s) => s.id !== id);
    this.setItem(STORAGE_KEYS.SYLLABI, list);
    // Cascade delete topics & items
    const topics = this.getTopics().filter((t) => t.syllabus_id === id);
    topics.forEach((t) => this.deleteTopic(t.id));
  }

  // --- TOPICS ---
  public getTopics(syllabusId?: string): Topic[] {
    const list = this.getItem<Topic[]>(STORAGE_KEYS.TOPICS, []);
    return syllabusId ? list.filter((t) => t.syllabus_id === syllabusId) : list;
  }

  public addTopic(syllabus_id: string, title: string, description?: string): Topic {
    const list = this.getTopics();
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      syllabus_id,
      title,
      description,
      order_index: list.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.TOPICS, [...list, newTopic]);
    return newTopic;
  }

  public deleteTopic(id: string): void {
    const list = this.getTopics().filter((t) => t.id !== id);
    this.setItem(STORAGE_KEYS.TOPICS, list);
    // Cascade delete items
    const items = this.getItems().filter((i) => i.topic_id === id);
    items.forEach((i) => this.deleteItem(i.id));
  }

  // --- SUBTOPICS ---
  public getSubtopics(topicId?: string): Subtopic[] {
    const list = this.getItem<Subtopic[]>(STORAGE_KEYS.SUBTOPICS, []);
    return topicId ? list.filter((s) => s.topic_id === topicId) : list;
  }

  public addSubtopic(topic_id: string, title: string, description?: string): Subtopic {
    const list = this.getSubtopics();
    const newSubtopic: Subtopic = {
      id: `sub-${Date.now()}`,
      topic_id,
      title,
      description,
      order_index: list.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.SUBTOPICS, [...list, newSubtopic]);
    return newSubtopic;
  }

  // --- ITEMS & PROGRESS ---
  public getItems(): LearningItem[] {
    return this.getItem(STORAGE_KEYS.ITEMS, []);
  }

  public getProgressList(): ItemProgress[] {
    const list = this.getItem<ItemProgress[]>(STORAGE_KEYS.PROGRESS, []);
    return list.map((p) => {
      let status = p.status;
      if ((status as string) === 'revising') status = 'revised';
      if ((status as string) === 'confident') status = 'mastered';
      return { ...p, status };
    });
  }

  public getJoinedItems(): LearningItemWithProgress[] {
    const items = this.getItems();
    const progressList = this.getProgressList();
    const syllabi = this.getSyllabi();
    const topics = this.getTopics();
    const subtopics = this.getSubtopics();
    const links = this.getNoteLinks();

    return items.map((item) => {
      let progress = progressList.find((p) => p.item_id === item.id);
      if (!progress) {
        // Create initial default progress
        progress = {
          id: `prog-${item.id}`,
          item_id: item.id,
          status: 'new',
          confidence: 'orange',
          learned_at: null,
          last_reviewed_at: null,
          next_review_at: null,
          revision_count: 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }
      const syll = syllabi.find((s) => s.id === item.syllabus_id);
      const top = topics.find((t) => t.id === item.topic_id);
      const sub = subtopics.find((s) => s.id === item.subtopic_id);
      const linkedNotes = links.filter((l) => l.item_id === item.id);

      return {
        ...item,
        progress,
        syllabus_title: syll?.title || 'Unknown Syllabus',
        topic_title: top?.title || 'Unknown Topic',
        subtopic_title: sub?.title,
        linked_notes_count: linkedNotes.length,
      };
    });
  }

  public addItem(data: {
    syllabus_id: string;
    topic_id: string;
    subtopic_id?: string | null;
    title: string;
    description?: string;
    item_type: ItemType;
    difficulty?: Difficulty;
  }): LearningItemWithProgress {
    const items = this.getItems();
    const progressList = this.getProgressList();

    const newItem: LearningItem = {
      id: `item-${Date.now()}`,
      syllabus_id: data.syllabus_id,
      topic_id: data.topic_id,
      subtopic_id: data.subtopic_id || null,
      title: data.title,
      description: data.description || '',
      item_type: data.item_type || 'concept',
      difficulty: data.difficulty || 'not_set',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newProgress: ItemProgress = {
      id: `prog-${newItem.id}`,
      item_id: newItem.id,
      status: 'new',
      confidence: 'orange',
      learned_at: null,
      last_reviewed_at: null,
      next_review_at: null,
      revision_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.setItem(STORAGE_KEYS.ITEMS, [...items, newItem]);
    this.setItem(STORAGE_KEYS.PROGRESS, [...progressList, newProgress]);

    return this.getJoinedItems().find((i) => i.id === newItem.id)!;
  }

  public updateItem(id: string, updates: Partial<LearningItem>): void {
    const items = this.getItems();
    const updated = items.map((i) => (i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i));
    this.setItem(STORAGE_KEYS.ITEMS, updated);
  }

  public deleteItem(id: string): void {
    const items = this.getItems().filter((i) => i.id !== id);
    const progress = this.getProgressList().filter((p) => p.item_id !== id);
    const links = this.getNoteLinks().filter((l) => l.item_id !== id);

    this.setItem(STORAGE_KEYS.ITEMS, items);
    this.setItem(STORAGE_KEYS.PROGRESS, progress);
    this.setItem(STORAGE_KEYS.NOTE_LINKS, links);
  }

  // --- REVISION ENGINE ---
  public calculateNextReviewDate(revisionCount: number): Date {
    const settings = this.getSettings();
    let daysToAdd = settings.rev_1_days;
    if (revisionCount === 1) daysToAdd = settings.rev_2_days;
    else if (revisionCount === 2) daysToAdd = settings.rev_3_days;
    else if (revisionCount >= 3) daysToAdd = settings.rev_4_days;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
  }

  public recordReview(data: {
    item_id: string;
    new_confidence: ConfidenceLevel;
    result?: 'success' | 'struggled' | 'failed';
    failure_reason?: string | null;
    duration_seconds?: number;
  }): void {
    const progressList = this.getProgressList();
    const progress = progressList.find((p) => p.item_id === data.item_id);
    if (!progress) return;

    const prevConfidence = progress.confidence;
    const prevStatus = progress.status;

    // Derive new Status based on confidence progression (new, learned, revised, mastered)
    let newStatus: LearningStatus = 'revised';
    if (data.new_confidence === 'blue' || data.new_confidence === 'gold') newStatus = 'mastered';
    else if (progress.status === 'new') newStatus = 'learned';

    const now = new Date();
    const newRevCount = progress.revision_count + 1;
    const nextReviewDate = this.calculateNextReviewDate(newRevCount);

    const updatedProgress: ItemProgress = {
      ...progress,
      status: newStatus,
      confidence: data.new_confidence,
      learned_at: progress.learned_at || now.toISOString(),
      last_reviewed_at: now.toISOString(),
      next_review_at: nextReviewDate.toISOString(),
      revision_count: newRevCount,
      updated_at: now.toISOString(),
    };

    const updatedList = progressList.map((p) => (p.item_id === data.item_id ? updatedProgress : p));
    this.setItem(STORAGE_KEYS.PROGRESS, updatedList);

    // Create Revision Event
    const events = this.getItem<RevisionEvent[]>(STORAGE_KEYS.REVISION_EVENTS, []);
    const newEvent: RevisionEvent = {
      id: `rev-${Date.now()}`,
      item_id: data.item_id,
      previous_confidence: prevConfidence,
      new_confidence: data.new_confidence,
      previous_status: prevStatus,
      new_status: newStatus,
      result: data.result || 'success',
      failure_reason: data.failure_reason || null,
      duration_seconds: data.duration_seconds || 60,
      reviewed_at: now.toISOString(),
    };
    this.setItem(STORAGE_KEYS.REVISION_EVENTS, [...events, newEvent]);
  }

  public getRevisionEvents(itemId?: string): RevisionEvent[] {
    const events = this.getItem<RevisionEvent[]>(STORAGE_KEYS.REVISION_EVENTS, []);
    return itemId ? events.filter((e) => e.item_id === itemId) : events;
  }

  // --- BULK ACTIONS ---
  public bulkUpdateProgress(
    itemIds: string[],
    updates: { status?: LearningStatus; confidence?: ConfidenceLevel }
  ): void {
    const list = this.getProgressList();
    const now = new Date().toISOString();
    const updated = list.map((p) => {
      if (itemIds.includes(p.item_id)) {
        return {
          ...p,
          status: updates.status || p.status,
          confidence: updates.confidence || p.confidence,
          learned_at: p.learned_at || (updates.status ? now : p.learned_at),
          updated_at: now,
        };
      }
      return p;
    });
    this.setItem(STORAGE_KEYS.PROGRESS, updated);
  }

  public bulkDeleteItems(itemIds: string[]): void {
    itemIds.forEach((id) => this.deleteItem(id));
  }

  // --- NOTES & KNOWLEDGE BASE ---
  public getNotes(): Note[] {
    return this.getItem(STORAGE_KEYS.NOTES, []);
  }

  public getNoteById(id: string): Note | undefined {
    return this.getNotes().find((n) => n.id === id);
  }

  public addNote(title: string, markdown_content: string, category?: string, tags: string[] = []): Note {
    const list = this.getNotes();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      markdown_content,
      category: category || 'General',
      tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.NOTES, [newNote, ...list]);
    return newNote;
  }

  public updateNote(id: string, updates: Partial<Note>): void {
    const list = this.getNotes();
    const updated = list.map((n) => (n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));
    this.setItem(STORAGE_KEYS.NOTES, updated);
  }

  public deleteNote(id: string): void {
    const list = this.getNotes().filter((n) => n.id !== id);
    const links = this.getNoteLinks().filter((l) => l.note_id !== id);
    this.setItem(STORAGE_KEYS.NOTES, list);
    this.setItem(STORAGE_KEYS.NOTE_LINKS, links);
  }

  // --- NOTE LINKS & MATCHING ---
  public getNoteLinks(): NoteLink[] {
    return this.getItem(STORAGE_KEYS.NOTE_LINKS, []);
  }

  public linkNoteToItem(note_id: string, item_id: string): void {
    const links = this.getNoteLinks();
    if (links.some((l) => l.note_id === note_id && l.item_id === item_id)) return;
    const newLink: NoteLink = {
      id: `link-${Date.now()}`,
      note_id,
      item_id,
      created_at: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.NOTE_LINKS, [...links, newLink]);
  }

  public unlinkNoteFromItem(note_id: string, item_id: string): void {
    const links = this.getNoteLinks().filter((l) => !(l.note_id === note_id && l.item_id === item_id));
    this.setItem(STORAGE_KEYS.NOTE_LINKS, links);
  }

  public findCurriculumMatchesForNote(noteTitle: string): LearningItemWithProgress[] {
    const items = this.getJoinedItems();
    const cleanTitle = noteTitle.toLowerCase().trim();
    return items.filter((item) => {
      const itemTitle = item.title.toLowerCase().trim();
      return (
        itemTitle === cleanTitle ||
        itemTitle.includes(cleanTitle) ||
        cleanTitle.includes(itemTitle)
      );
    });
  }

  // --- REVIEW QUEUE CALCULATOR ---
  public getReviewQueue(): {
    overdue: LearningItemWithProgress[];
    dueToday: LearningItemWithProgress[];
    newItems: LearningItemWithProgress[];
    variations: LearningItemWithProgress[];
    counts: ReviewQueueCounts;
  } {
    const items = this.getJoinedItems();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue: LearningItemWithProgress[] = [];
    const dueToday: LearningItemWithProgress[] = [];
    const newItems: LearningItemWithProgress[] = [];
    const variations: LearningItemWithProgress[] = [];

    items.forEach((item) => {
      if (item.progress.status === 'new') {
        newItems.push(item);
      } else if (item.progress.status === 'mastered') {
        variations.push(item);
      } else if (item.progress.next_review_at) {
        const reviewDate = new Date(item.progress.next_review_at);
        if (reviewDate < startOfToday) {
          overdue.push(item);
        } else if (reviewDate <= now || reviewDate.toDateString() === now.toDateString()) {
          dueToday.push(item);
        }
      }
    });

    return {
      overdue,
      dueToday,
      newItems,
      variations,
      counts: {
        overdue: overdue.length,
        dueToday: dueToday.length,
        newItems: newItems.length,
        variations: variations.length,
      },
    };
  }

  // --- ADVANCED ANALYTICS CALCULATOR ---
  public getDashboardAnalytics(): DashboardAnalytics {
    const joined = this.getJoinedItems();
    const syllabi = this.getSyllabi();
    const events = this.getRevisionEvents();

    const newItems = joined.filter((i) => i.progress.status === 'new').length;
    const learnedItems = joined.filter((i) => i.progress.status === 'learned').length;
    const revisedItems = joined.filter((i) => i.progress.status === 'revised').length;
    const masteredItems = joined.filter((i) => i.progress.status === 'mastered').length;

    const confidenceDistribution: Record<ConfidenceLevel, number> = {
      orange: 0,
      yellow: 0,
      green: 0,
      blue: 0,
      gold: 0,
    };

    joined.forEach((i) => {
      confidenceDistribution[i.progress.confidence] = (confidenceDistribution[i.progress.confidence] || 0) + 1;
    });

    // Syllabus Progress
    const syllabusProgress = syllabi.map((s) => {
      const sItems = joined.filter((i) => i.syllabus_id === s.id);
      const total = sItems.length;
      const learned = sItems.filter((i) => i.progress.status !== 'new').length;
      return {
        id: s.id,
        title: s.title,
        total,
        learned,
        percentage: total > 0 ? Math.round((learned / total) * 100) : 0,
      };
    });

    // Weak Areas (Orange & Yellow confidence items)
    const weakAreas = joined
      .filter((i) => i.progress.confidence === 'orange' || i.progress.confidence === 'yellow')
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        topicTitle: `${i.topic_title} → ${i.title}`,
        syllabusTitle: i.syllabus_title || '',
        confidence: i.progress.confidence,
      }));

    // Strong Areas (Green, Blue, Gold items)
    const strongAreas = joined
      .filter((i) => i.progress.confidence === 'green' || i.progress.confidence === 'blue' || i.progress.confidence === 'gold')
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        topicTitle: `${i.topic_title} → ${i.title}`,
        syllabusTitle: i.syllabus_title || '',
        confidence: i.progress.confidence,
      }));

    let reviewsCompletedOnTime = 0;
    let reviewsCompletedLate = 0;

    events.forEach((e) => {
      if (e.result === 'success') reviewsCompletedOnTime++;
      else reviewsCompletedLate++;
    });

    const queue = this.getReviewQueue();

    return {
      totalItems: joined.length,
      newItems,
      learnedItems,
      revisedItems,
      masteredItems,
      confidenceDistribution,
      syllabusProgress,
      weakAreas,
      strongAreas,
      reviewsCompletedOnTime,
      reviewsCompletedLate,
      overdueReviews: queue.counts.overdue,
      totalStudySeconds: 47 * 60 + 120, // Sample study session time sum
    };
  }
}

export const storage = new StorageEngine();
