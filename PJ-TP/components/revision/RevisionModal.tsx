'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { storage } from '@/lib/storage';
import { LearningItemWithProgress, ConfidenceLevel, LearningStatus, Note } from '@/types';
import { ConfidenceBadge, StatusBadge } from '../common/Badges';
import ReactMarkdown from 'react-markdown';

interface RevisionModalProps {
  item: LearningItemWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const FAILURE_REASONS = [
  "Didn't understand the concept",
  "Forgot the concept from memory",
  "Couldn't explain or articulate it",
  "Couldn't apply to a practical scenario",
  "Needed a hint to proceed",
  "Confused it with another concept",
  "Missed an edge case / exception",
];

export function RevisionModal({ item, isOpen, onClose, onComplete }: RevisionModalProps) {
  const [revealNotes, setRevealNotes] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LearningStatus>('revised');
  const [failureReason, setFailureReason] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (isOpen && item) {
      setRevealNotes(false);
      setSelectedConfidence(null);
      setSelectedStatus(item.progress.status || 'revised');
      setFailureReason('');
      setStartTime(Date.now());
      setElapsedSeconds(0);

      // Fetch linked notes
      const links = storage.getNoteLinks().filter((l) => l.item_id === item.id);
      const notes = storage.getNotes().filter((n) => links.some((l) => l.note_id === n.id));
      setLinkedNotes(notes);
    }
  }, [isOpen, item]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, startTime]);

  if (!isOpen || !item) return null;

  const handleFinishReview = (level: ConfidenceLevel) => {
    const isStruggled = level === 'orange' || level === 'yellow';

    storage.recordReview({
      item_id: item.id,
      new_confidence: level,
      new_status: selectedStatus,
      result: isStruggled ? 'struggled' : 'success',
      failure_reason: failureReason || null,
      duration_seconds: elapsedSeconds || 60,
    });

    onComplete?.();
    onClose();
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}m ${remainder < 10 ? '0' : ''}${remainder}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animation-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-accent/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                REVISION PRACTICE SESSION
              </span>
              <span className="text-xs font-mono text-muted-foreground/80 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatSeconds(elapsedSeconds)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground mt-0.5">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata context */}
          <div className="bg-accent/40 rounded-lg p-3 border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Context: </span>
              <span className="font-medium">{item.syllabus_title} → {item.topic_title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Current Confidence:</span>
              <ConfidenceBadge level={item.progress.confidence} />
            </div>
          </div>

          {item.description && (
            <p className="text-xs text-muted-foreground bg-background p-3 rounded-lg border border-border">
              {item.description}
            </p>
          )}

          {/* Reveal Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider">
                Reference Notes ({linkedNotes.length})
              </h4>
              <button
                onClick={() => setRevealNotes(!revealNotes)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-accent border border-border transition-colors"
              >
                {revealNotes ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hide Notes
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Reveal Notes
                  </>
                )}
              </button>
            </div>

            {revealNotes && (
              <div className="bg-background rounded-lg border border-border p-4 text-sm space-y-4 max-h-60 overflow-y-auto">
                {linkedNotes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No notes currently linked to this item. You can link or add notes from the Notes tab.
                  </p>
                ) : (
                  linkedNotes.map((note) => (
                    <div key={note.id} className="space-y-2 border-b border-border last:border-0 pb-3 last:pb-0">
                      <h5 className="font-semibold text-xs text-foreground">{note.title}</h5>
                      <div className="prose dark:prose-invert prose-xs text-xs">
                        <ReactMarkdown>{note.markdown_content}</ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Target Learning Status Selector */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider">
                Set Item Learning Status
              </h4>
              <StatusBadge status={selectedStatus} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['new', 'learned', 'revised', 'mastered'] as LearningStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all ${
                    selectedStatus === st
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-background border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Options */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase text-muted-foreground tracking-wider text-center">
              How well did you know this?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  setSelectedConfidence('orange');
                  handleFinishReview('orange');
                }}
                className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/20 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">Orange</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Understand pattern but couldn&apos;t apply
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedConfidence('yellow');
                  handleFinishReview('yellow');
                }}
                className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/20 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="font-semibold text-xs text-yellow-600 dark:text-yellow-400">Yellow</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Applied/explained with hints
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedConfidence('green');
                  handleFinishReview('green');
                }}
                className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/20 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Green</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Solved / explained independently
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedConfidence('blue');
                  handleFinishReview('blue');
                }}
                className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-xs text-blue-600 dark:text-blue-400">Blue</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Handled new scenario / variation
                </p>
              </button>

              <button
                onClick={() => {
                  setSelectedConfidence('gold');
                  handleFinishReview('gold');
                }}
                className="p-3 rounded-lg border border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/20 text-left transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="font-semibold text-xs text-amber-500">Gold ⭐</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Interview-ready mastery
                </p>
              </button>
            </div>
          </div>

          {/* Optional Failure Reason selector */}
          <div className="pt-2">
            <label className="block text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">
              Optional: Struggled? Log reason for analysis
            </label>
            <select
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">None (Smooth recall)</option>
              {FAILURE_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
