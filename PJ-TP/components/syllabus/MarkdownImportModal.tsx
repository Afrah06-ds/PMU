'use client';

import { useState } from 'react';
import { X, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { ItemType } from '@/types';

interface MarkdownImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

interface ParsedImportData {
  syllabuses: {
    title: string;
    topics: {
      title: string;
      subtopics: {
        title: string;
        items: string[];
      }[];
      items: string[];
    }[];
  }[];
}

const DEFAULT_SAMPLE_MD = `# Backend Development

## REST APIs

### HTTP Methods

- GET
- POST
- PUT
- PATCH
- DELETE

### Status Codes

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

## Authentication

- Session Authentication
- JWT
- Access Tokens
- Refresh Tokens
- OAuth 2.0

## Networking

### Fundamentals

- OSI Model
- TCP vs UDP
- IP Addressing
- DNS
- Ports

# DSA

## Arrays

### Two Pointers

- Two Sum
- 3Sum
- Container With Most Water

### Sliding Window

- Maximum Sum Subarray
- Longest Substring Without Repeating Characters

## Binary Search

- Binary Search
- Search in Rotated Sorted Array
- First and Last Position`;

export function MarkdownImportModal({ isOpen, onClose, onImportComplete }: MarkdownImportModalProps) {
  const [markdown, setMarkdown] = useState(DEFAULT_SAMPLE_MD);
  const [step, setStep] = useState<'edit' | 'preview'>('edit');
  const [parsed, setParsed] = useState<ParsedImportData | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    const lines = markdown.split('\n');
    const data: ParsedImportData = { syllabuses: [] };

    let currentSyllabus: any = null;
    let currentTopic: any = null;
    let currentSubtopic: any = null;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('# ')) {
        const title = trimmed.replace('# ', '').trim();
        currentSyllabus = { title, topics: [] };
        data.syllabuses.push(currentSyllabus);
        currentTopic = null;
        currentSubtopic = null;
      } else if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '').trim();
        if (!currentSyllabus) {
          currentSyllabus = { title: 'Imported Syllabus', topics: [] };
          data.syllabuses.push(currentSyllabus);
        }
        currentTopic = { title, subtopics: [], items: [] };
        currentSyllabus.topics.push(currentTopic);
        currentSubtopic = null;
      } else if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '').trim();
        if (!currentTopic) {
          if (!currentSyllabus) {
            currentSyllabus = { title: 'Imported Syllabus', topics: [] };
            data.syllabuses.push(currentSyllabus);
          }
          currentTopic = { title: 'General Topic', subtopics: [], items: [] };
          currentSyllabus.topics.push(currentTopic);
        }
        currentSubtopic = { title, items: [] };
        currentTopic.subtopics.push(currentSubtopic);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const title = trimmed.replace(/^[-*]\s+/, '').trim();
        if (currentSubtopic) {
          currentSubtopic.items.push(title);
        } else if (currentTopic) {
          currentTopic.items.push(title);
        } else if (currentSyllabus) {
          if (!currentTopic) {
            currentTopic = { title: 'General Topic', subtopics: [], items: [] };
            currentSyllabus.topics.push(currentTopic);
          }
          currentTopic.items.push(title);
        }
      }
    }

    setParsed(data);
    setStep('preview');
  };

  const handleConfirmImport = () => {
    if (!parsed) return;

    parsed.syllabuses.forEach((s) => {
      const newSyllabus = storage.addSyllabus(s.title);
      s.topics.forEach((t) => {
        const newTopic = storage.addTopic(newSyllabus.id, t.title);

        // Direct topic items
        t.items.forEach((itemTitle) => {
          storage.addItem({
            syllabus_id: newSyllabus.id,
            topic_id: newTopic.id,
            title: itemTitle,
            item_type: 'concept',
            difficulty: 'not_set',
          });
        });

        // Subtopic items
        t.subtopics.forEach((st) => {
          const newSubtopic = storage.addSubtopic(newTopic.id, st.title);
          st.items.forEach((itemTitle) => {
            storage.addItem({
              syllabus_id: newSyllabus.id,
              topic_id: newTopic.id,
              subtopic_id: newSubtopic.id,
              title: itemTitle,
              item_type: 'concept',
              difficulty: 'not_set',
            });
          });
        });
      });
    });

    onImportComplete?.();
    onClose();
  };

  // Count summaries
  let syllabusCount = parsed?.syllabuses.length || 0;
  let topicCount = 0;
  let subtopicCount = 0;
  let itemCount = 0;

  parsed?.syllabuses.forEach((s) => {
    topicCount += s.topics.length;
    s.topics.forEach((t) => {
      itemCount += t.items.length;
      subtopicCount += t.subtopics.length;
      t.subtopics.forEach((st) => {
        itemCount += st.items.length;
      });
    });
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animation-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">Import Markdown Curriculum</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'edit' ? (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="bg-accent/40 rounded-lg p-3 border border-border text-xs text-muted-foreground space-y-1">
              <p className="font-mono font-semibold text-foreground">Deterministic Structure Format:</p>
              <p># Syllabus Title | ## Topic | ### Subtopic | - Learning Item</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-2">
                Paste Markdown Content
              </label>
              <textarea
                rows={14}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParse}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Preview Structure <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-4">
            {/* Summary Banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Curriculum Preview Ready</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>{syllabusCount} Syllabi</span> •
                <span>{topicCount} Topics</span> •
                <span>{subtopicCount} Subtopics</span> •
                <span>{itemCount} Items</span>
              </div>
            </div>

            {/* Tree View Preview */}
            <div className="bg-background border border-border rounded-lg p-4 text-xs font-mono space-y-3 max-h-96 overflow-y-auto">
              {parsed?.syllabuses.map((s, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <div className="font-bold text-primary text-sm"># {s.title}</div>
                  {s.topics.map((t, tIdx) => (
                    <div key={tIdx} className="pl-4 space-y-1">
                      <div className="font-semibold text-foreground">├── {t.title}</div>

                      {t.items.map((i, iIdx) => (
                        <div key={iIdx} className="pl-8 text-muted-foreground">
                          ├── {i}
                        </div>
                      ))}

                      {t.subtopics.map((st, stIdx) => (
                        <div key={stIdx} className="pl-8 space-y-1">
                          <div className="font-semibold text-accent-foreground">└── {st.title}</div>
                          {st.items.map((sti, stiIdx) => (
                            <div key={stiIdx} className="pl-6 text-muted-foreground">
                              └── {sti}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('edit')}
                className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                Back / Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
              >
                Confirm & Import Curriculum
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
