'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, CheckSquare, FileText, X, ArrowRight } from 'lucide-react';
import { storage } from '@/lib/storage';
import { LearningItemWithProgress, Note, Syllabus } from '@/types';
import { clsx } from 'clsx';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<LearningItemWithProgress[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setItems(storage.getJoinedItems());
      setNotes(storage.getNotes());
      setSyllabi(storage.getSyllabi());
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = query.trim()
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.topic_title?.toLowerCase().includes(query.toLowerCase()) ||
          i.syllabus_title?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredNotes = query.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.markdown_content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredSyllabi = query.trim()
    ? syllabi.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults = filteredItems.length + filteredNotes.length + filteredSyllabi.length;

  const navigateTo = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animation-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border gap-3 h-14">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search syllabi, topics, learning items, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-accent rounded text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-accent rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Search Results Content */}
        <div className="overflow-y-auto p-3 space-y-4">
          {!query.trim() ? (
            <div className="py-12 text-center text-muted-foreground text-sm space-y-2">
              <p>Type to search across all syllabi, learning items, and notes...</p>
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground/70">
                <span>Try searching:</span>
                <button onClick={() => setQuery('JWT')} className="underline hover:text-foreground">JWT</button>
                <span>•</span>
                <button onClick={() => setQuery('Two Sum')} className="underline hover:text-foreground">Two Sum</button>
                <span>•</span>
                <button onClick={() => setQuery('TCP')} className="underline hover:text-foreground">TCP</button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No results found matching &quot;<span className="text-foreground font-medium">{query}</span>&quot;
            </div>
          ) : (
            <div className="space-y-4">
              {/* Syllabi Results */}
              {filteredSyllabi.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                    Syllabi
                  </h4>
                  <div className="space-y-1">
                    {filteredSyllabi.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigateTo(`/syllabus/${s.id}`)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{s.title}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Results */}
              {filteredItems.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                    Learning Items ({filteredItems.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredItems.slice(0, 10).map((i) => (
                      <button
                        key={i.id}
                        onClick={() => navigateTo(`/item/${i.id}`)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{i.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {i.syllabus_title} → {i.topic_title}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-accent text-accent-foreground">
                            {i.item_type}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Results */}
              {filteredNotes.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                    Notes Knowledge Base ({filteredNotes.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredNotes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => navigateTo(`/notes?id=${n.id}`)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{n.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {n.category || 'General'}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
