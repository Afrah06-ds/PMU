import { ConfidenceLevel, LearningStatus, Difficulty, ItemType } from '@/types';
import { clsx } from 'clsx';
import { Star } from 'lucide-react';

export function ConfidenceBadge({ level, showLabel = true }: { level: ConfidenceLevel; showLabel?: boolean }) {
  const config = {
    orange: {
      dot: 'bg-amber-500',
      bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      label: 'Understand concept (Needs hints)',
    },
    yellow: {
      dot: 'bg-yellow-500',
      bg: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      label: 'Can apply with hints',
    },
    green: {
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      label: 'Independent recall/apply',
    },
    blue: {
      dot: 'bg-blue-500',
      bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      label: 'Can handle variations',
    },
    gold: {
      dot: 'bg-amber-400 text-amber-500',
      bg: 'bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-400/30',
      label: 'Interview ready',
    },
  }[level];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs',
        config.bg
      )}
    >
      {level === 'gold' ? (
        <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
      ) : (
        <span className={clsx('w-2 h-2 rounded-full shrink-0', config.dot)} />
      )}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export function StatusBadge({ status }: { status: LearningStatus }) {
  const config = ({
    new: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    learned: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    revised: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    mastered: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  } as Record<string, string>)[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

  return (
    <span className={clsx('inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-semibold border', config)}>
      {status}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty?: Difficulty }) {
  if (!difficulty || difficulty === 'not_set') return null;

  const config = {
    easy: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    hard: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[difficulty];

  return (
    <span className={clsx('inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium border', config)}>
      {difficulty}
    </span>
  );
}

export function ItemTypeBadge({ type }: { type: ItemType }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-medium bg-accent text-accent-foreground border border-border">
      {type}
    </span>
  );
}
