'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { LearningItemWithProgress, RevisionEvent, Note } from '@/types';
import { ConfidenceBadge, StatusBadge, DifficultyBadge, ItemTypeBadge } from '@/components/common/Badges';
import { ArrowLeft, Calendar, History, FileText, Play, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { RevisionModal } from '@/components/revision/RevisionModal';

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<LearningItemWithProgress | null>(null);
  const [history, setHistory] = useState<RevisionEvent[]>([]);
  const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const loadData = () => {
    const found = storage.getJoinedItems().find((i) => i.id === id);
    if (!found) return;
    setItem(found);

    setHistory(storage.getRevisionEvents(id));

    // Get linked notes
    const links = storage.getNoteLinks().filter((l) => l.item_id === id);
    const notes = storage.getNotes().filter((n) => links.some((l) => l.note_id === n.id));
    setLinkedNotes(notes);
  };

  useEffect(() => {
    loadData();
    return storage.subscribe(loadData);
  }, [id]);

  if (!item) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Learning item not found.</p>
        <Link href="/tracker" className="text-primary hover:underline text-xs mt-2 inline-block">
          ← Back to Tracker
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <Link
          href={`/syllabus/${item.syllabus_id}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {item.syllabus_title} / {item.topic_title}
          </span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{item.title}</h1>
              <ItemTypeBadge type={item.item_type} />
              <DifficultyBadge difficulty={item.difficulty} />
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 shadow-sm shrink-0"
          >
            <Play className="w-4 h-4 fill-primary-foreground" />
            <span>Practice Review Now</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEARNING STATUS CARD */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Learning Status & Confidence
          </h3>

          <div className="flex items-center justify-between p-3 bg-accent/40 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Current Status</span>
            <StatusBadge status={item.progress.status} />
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/40 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground">Confidence Level</span>
            <ConfidenceBadge level={item.progress.confidence} />
          </div>
        </div>

        {/* REVISION METADATA CARD */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Spaced Repetition Schedule
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 border-b border-border">
              <span className="text-muted-foreground">Learned Date</span>
              <span className="text-foreground">
                {item.progress.learned_at ? new Date(item.progress.learned_at).toLocaleDateString() : 'Not Yet'}
              </span>
            </div>

            <div className="flex justify-between p-2 border-b border-border">
              <span className="text-muted-foreground">Last Reviewed</span>
              <span className="text-foreground">
                {item.progress.last_reviewed_at
                  ? new Date(item.progress.last_reviewed_at).toLocaleDateString()
                  : 'Never'}
              </span>
            </div>

            <div className="flex justify-between p-2 border-b border-border">
              <span className="text-muted-foreground">Next Review Due</span>
              <span className="font-bold text-primary">
                {item.progress.next_review_at
                  ? new Date(item.progress.next_review_at).toLocaleDateString()
                  : 'Not Scheduled'}
              </span>
            </div>

            <div className="flex justify-between p-2">
              <span className="text-muted-foreground">Revision Count</span>
              <span className="text-foreground">{item.progress.revision_count} cycles completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVISION HISTORY TIMELINE */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          Revision History Timeline ({history.length} events)
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4">No reviews recorded yet for this item.</p>
        ) : (
          <div className="space-y-3">
            {history.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-background text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-muted-foreground">
                    {new Date(e.reviewed_at).toLocaleDateString()}
                  </span>
                  <ConfidenceBadge level={e.new_confidence} />
                  {e.failure_reason && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Reason: {e.failure_reason}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-muted-foreground text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{e.duration_seconds || 60}s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RELATED NOTES KNOWLEDGE BASE */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Related Knowledge Base Notes ({linkedNotes.length})
          </h3>
          <Link href="/notes" className="text-xs text-primary hover:underline font-medium">
            Manage Notes →
          </Link>
        </div>

        {linkedNotes.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            No notes currently linked to this item.
          </p>
        ) : (
          <div className="space-y-2">
            {linkedNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes?id=${note.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{note.title}</div>
                  <div className="text-muted-foreground text-[11px]">{note.category || 'General'}</div>
                </div>
                <span className="text-xs text-primary font-medium">View Note →</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Practice Modal */}
      <RevisionModal
        item={item}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onComplete={loadData}
      />
    </div>
  );
}
