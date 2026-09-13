'use client';

import { useState } from 'react';
import { X, FileText, Upload, Sparkles, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { storage } from '@/lib/storage';
import { LearningItemWithProgress } from '@/types';

interface NotesImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

interface ParsedNote {
  title: string;
  category: string;
  markdown_content: string;
  matchedItems?: LearningItemWithProgress[];
}

export function NotesImportModal({ isOpen, onClose, onImportComplete }: NotesImportModalProps) {
  const [markdown, setMarkdown] = useState<string>('');
  const [parsedNotes, setParsedNotes] = useState<ParsedNote[]>([]);
  const [step, setStep] = useState<'edit' | 'preview'>('edit');

  if (!isOpen) return null;

  // Strict Heading & Code Block Parser
  const parseMarkdownNotes = (rawMarkdown: string): ParsedNote[] => {
    const lines = rawMarkdown.split('\n');
    const notes: ParsedNote[] = [];

    let mainCategory = 'General';
    let inCodeBlock = false;
    let currentNote: { title: string; category: string; lines: string[] } | null = null;

    // Scan for top-level # header for main Category/Suite title
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (!inCodeBlock && trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        mainCategory = trimmed.replace(/^#\s+/, '').trim();
        break;
      }
    }

    inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check code block boundary toggle
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (currentNote) {
          currentNote.lines.push(line);
        }
        continue;
      }

      // If inside code block, append as raw content (ignore any # symbols inside code block)
      if (inCodeBlock) {
        if (currentNote) {
          currentNote.lines.push(line);
        }
        continue;
      }

      // Check for ## Level 2 Heading (Defines a new Topic Note)
      if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        const topicTitle = trimmed.replace(/^##\s+/, '').trim();

        // Save previous note if exists
        if (currentNote && currentNote.lines.join('\n').trim().length > 0) {
          const content = currentNote.lines.join('\n').trim();
          const matches = storage.findCurriculumMatchesForNote(currentNote.title);
          notes.push({
            title: currentNote.title,
            category: currentNote.category || mainCategory,
            markdown_content: content,
            matchedItems: matches,
          });
        }

        // Start new note
        currentNote = {
          title: topicTitle,
          category: mainCategory,
          lines: [`# ${topicTitle}\n`],
        };
        continue;
      }

      // Check for # Level 1 Heading (Suite overview note or Category)
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        const suiteTitle = trimmed.replace(/^#\s+/, '').trim();
        mainCategory = suiteTitle;

        // If no notes created yet, start a suite overview note
        if (!currentNote && notes.length === 0) {
          currentNote = {
            title: suiteTitle,
            category: suiteTitle,
            lines: [`# ${suiteTitle}\n`],
          };
        }
        continue;
      }

      // All other lines (### subheadings, text, quotes, lists, etc.) go to current note content
      if (currentNote) {
        currentNote.lines.push(line);
      }
    }

    // Flush last note
    if (currentNote && currentNote.lines.join('\n').trim().length > 0) {
      const content = currentNote.lines.join('\n').trim();
      const matches = storage.findCurriculumMatchesForNote(currentNote.title);
      notes.push({
        title: currentNote.title,
        category: currentNote.category || mainCategory,
        markdown_content: content,
        matchedItems: matches,
      });
    }

    return notes;
  };

  const handleParse = () => {
    if (!markdown.trim()) return;
    const parsed = parseMarkdownNotes(markdown);
    setParsedNotes(parsed);
    setStep('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedNotes.length === 0) return;

    parsedNotes.forEach((parsed) => {
      const newNote = storage.addNote(parsed.title, parsed.markdown_content, parsed.category);
      // Auto link matches if found
      if (parsed.matchedItems && parsed.matchedItems.length > 0) {
        parsed.matchedItems.forEach((item) => {
          storage.linkNoteToItem(newNote.id, item.id);
        });
      }
    });

    if (onImportComplete) onImportComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animation-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-accent/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground">Import Markdown Notes</h3>
                <span className="text-[10px] font-mono uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                  Topic Detector
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste structured Markdown notes or cheat-sheets to automatically detect & split topic pages.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'edit' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Paste Markdown Content
                </label>
                <label className="cursor-pointer flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .md file</span>
                  <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <textarea
                rows={14}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Git & GitHub — Cheat Sheet&#10;&#10;## 1. Git Basics&#10;&#10;### Git Workflow&#10;- git add&#10;- git commit&#10;&#10;## 2. Branching&#10;- git branch&#10;- git merge"
                className="w-full bg-background border border-border rounded-lg p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Detected {parsedNotes.length} Topic Notes:</span>
                </div>
                <button
                  onClick={() => setStep('edit')}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Edit Markdown Text
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {parsedNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-lg border border-border bg-background space-y-2 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{note.title}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-accent font-mono text-[10px] text-accent-foreground">
                        Category: {note.category}
                      </span>
                      {note.matchedItems && note.matchedItems.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          Matched {note.matchedItems.length} Curriculum Item(s)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-accent/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
          >
            Cancel
          </button>
          {step === 'edit' ? (
            <button
              onClick={handleParse}
              disabled={!markdown.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50"
            >
              <span>Parse & Detect Topics</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {parsedNotes.length} Notes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
