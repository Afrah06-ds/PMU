'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { LearningItemWithProgress, DashboardAnalytics } from '@/types';
import { ConfidenceBadge, StatusBadge } from '@/components/common/Badges';
import { RevisionModal } from '@/components/revision/RevisionModal';
import {
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [queue, setQueue] = useState<ReturnType<typeof storage.getReviewQueue>>({
    overdue: [],
    dueToday: [],
    newItems: [],
    variations: [],
    counts: { overdue: 0, dueToday: 0, newItems: 0, variations: 0 },
  });

  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeReviewItem, setActiveReviewItem] = useState<LearningItemWithProgress | null>(null);

  const loadDashboardData = () => {
    const currentQueue = storage.getReviewQueue();
    setQueue(currentQueue);
    setAnalytics(storage.getDashboardAnalytics());
  };

  useEffect(() => {
    loadDashboardData();
    return storage.subscribe(loadDashboardData);
  }, []);

  const handleStartReview = () => {
    // Priority order: Overdue -> Due Today -> Variations -> New
    const targetItem =
      queue.overdue[0] || queue.dueToday[0] || queue.variations[0] || queue.newItems[0];
    if (targetItem) {
      setActiveReviewItem(targetItem);
      setReviewModalOpen(true);
    }
  };

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      {/* SECTION 1: PRIORITY 1 — ACTION-FIRST SECTION */}
      <section className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground tracking-wider">
              <span>Good morning</span>
              <span>•</span>
              <span className="text-primary font-medium">Daily Revision Console</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Here&apos;s what needs your attention today
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Keep your spaced repetition schedule on track to maximize long-term retention.
            </p>
          </div>

          <button
            onClick={handleStartReview}
            disabled={
              queue.counts.overdue === 0 &&
              queue.counts.dueToday === 0 &&
              queue.counts.newItems === 0 &&
              queue.counts.variations === 0
            }
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 shrink-0"
          >
            <Play className="w-4 h-4 fill-primary-foreground" />
            <span>Review Now</span>
          </button>
        </div>

        <div className="h-px bg-border my-6" />

        {/* Revision Queue Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Overdue
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {queue.counts.overdue}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Needs immediate review</p>
          </div>

          <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Due Today
              </span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {queue.counts.dueToday}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Scheduled for today</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                New Items
              </span>
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {queue.counts.newItems}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ready for first learn</p>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Variations
              </span>
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {queue.counts.variations}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Mastered applications</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRIORITY 2 — ADVANCED ANALYTICS CONSOLE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Advanced Learning Analytics Console
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Synced with Spaced Repetition Engine
          </span>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card border border-border p-4 rounded-xl">
            <span className="text-xs font-mono uppercase text-muted-foreground">New</span>
            <div className="text-2xl font-bold text-slate-400 mt-1">{analytics.newItems}</div>
            <span className="text-[11px] text-muted-foreground">Not started</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl">
            <span className="text-xs font-mono uppercase text-muted-foreground">Learned</span>
            <div className="text-2xl font-bold text-sky-500 mt-1">{analytics.learnedItems}</div>
            <span className="text-[11px] text-muted-foreground">Initial learn done</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl">
            <span className="text-xs font-mono uppercase text-muted-foreground">Revised</span>
            <div className="text-2xl font-bold text-indigo-500 mt-1">{analytics.revisedItems}</div>
            <span className="text-[11px] text-muted-foreground">Active revisions</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl">
            <span className="text-xs font-mono uppercase text-muted-foreground">Mastered</span>
            <div className="text-2xl font-bold text-purple-500 mt-1">{analytics.masteredItems}</div>
            <span className="text-[11px] text-muted-foreground">High confidence</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl col-span-2 md:col-span-1">
            <span className="text-xs font-mono uppercase text-muted-foreground">Total Items</span>
            <div className="text-2xl font-bold text-foreground mt-1">{analytics.totalItems}</div>
            <span className="text-[11px] text-muted-foreground">Across all syllabi</span>
          </div>
        </div>

        {/* Charts & Visual Distribution Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confidence Distribution */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span>Confidence Level Distribution</span>
              <span className="text-xs font-mono text-muted-foreground">5 Levels</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    🟠 Orange — Understand pattern (Needs hints)
                  </span>
                  <span className="font-mono">{analytics.confidenceDistribution.orange} items</span>
                </div>
                <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.totalItems > 0
                          ? (analytics.confidenceDistribution.orange / analytics.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    🟡 Yellow — Can apply with hints
                  </span>
                  <span className="font-mono">{analytics.confidenceDistribution.yellow} items</span>
                </div>
                <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.totalItems > 0
                          ? (analytics.confidenceDistribution.yellow / analytics.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    🟢 Green — Can solve independently
                  </span>
                  <span className="font-mono">{analytics.confidenceDistribution.green} items</span>
                </div>
                <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.totalItems > 0
                          ? (analytics.confidenceDistribution.green / analytics.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    🔵 Blue — Can solve new variation
                  </span>
                  <span className="font-mono">{analytics.confidenceDistribution.blue} items</span>
                </div>
                <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.totalItems > 0
                          ? (analytics.confidenceDistribution.blue / analytics.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-500 font-medium">⭐ Gold — Interview Ready</span>
                  <span className="font-mono">{analytics.confidenceDistribution.gold} items</span>
                </div>
                <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.totalItems > 0
                          ? (analytics.confidenceDistribution.gold / analytics.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Progress Bars */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span>Syllabus Mastery Breakdown</span>
              <Link href="/syllabus" className="text-xs text-primary hover:underline flex items-center gap-1">
                View Syllabi <ChevronRight className="w-3 h-3" />
              </Link>
            </h3>

            <div className="space-y-4">
              {analytics.syllabusProgress.map((sp) => (
                <div key={sp.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">{sp.title}</span>
                    <span className="font-mono text-muted-foreground">
                      {sp.learned}/{sp.total} items ({sp.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-accent h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${sp.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weak vs Strong Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Areas */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">Weak Areas (Attention Required)</h3>
            </div>
            <div className="space-y-2">
              {analytics.weakAreas.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No weak areas identified!</p>
              ) : (
                analytics.weakAreas.map((w) => (
                  <Link
                    key={w.id}
                    href={`/item/${w.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-accent/50 transition-colors text-xs"
                  >
                    <div>
                      <div className="font-medium text-foreground">{w.topicTitle}</div>
                      <div className="text-[11px] text-muted-foreground">{w.syllabusTitle}</div>
                    </div>
                    <ConfidenceBadge level={w.confidence} showLabel={false} />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Strong Areas */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold text-foreground">Strong Areas (High Retention)</h3>
            </div>
            <div className="space-y-2">
              {analytics.strongAreas.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Keep reviewing to build strong areas!</p>
              ) : (
                analytics.strongAreas.map((s) => (
                  <Link
                    key={s.id}
                    href={`/item/${s.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-accent/50 transition-colors text-xs"
                  >
                    <div>
                      <div className="font-medium text-foreground">{s.topicTitle}</div>
                      <div className="text-[11px] text-muted-foreground">{s.syllabusTitle}</div>
                    </div>
                    <ConfidenceBadge level={s.confidence} showLabel={false} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Revision Modal trigger */}
      <RevisionModal
        item={activeReviewItem}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onComplete={loadDashboardData}
      />
    </div>
  );
}
