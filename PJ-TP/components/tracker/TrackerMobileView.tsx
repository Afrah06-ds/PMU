'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LearningItemWithProgress,
  Syllabus,
  Topic,
  LearningStatus,
  ConfidenceLevel,
} from '@/types';
import { StatusBadge, ConfidenceBadge, DifficultyBadge, ItemTypeBadge } from '@/components/common/Badges';
import {
  Search,
  SlidersHorizontal,
  X,
  Play,
  CheckCircle2,
  Trash2,
  Clock,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

interface TrackerMobileViewProps {
  items: LearningItemWithProgress[];
  filteredItems: LearningItemWithProgress[];
  syllabi: Syllabus[];
  topics: Topic[];
  search: string;
  setSearch: (s: string) => void;
  selectedSyllabus: string;
  setSelectedSyllabus: (s: string) => void;
  selectedTopic: string;
  setSelectedTopic: (t: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedConfidence: string;
  setSelectedConfidence: (c: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (d: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  selectedReviewStatus: string;
  setSelectedReviewStatus: (r: string) => void;
  selectedItemIds: Set<string>;
  toggleSelectAll: () => void;
  toggleSelectItem: (id: string) => void;
  handleBulkStatusChange: (status: LearningStatus) => void;
  handleBulkConfidenceChange: (confidence: ConfidenceLevel) => void;
  handleBulkDelete: () => void;
  onOpenReview: (item: LearningItemWithProgress) => void;
  onQuickStatusChange: (itemId: string, status: LearningStatus) => void;
}

export function TrackerMobileView({
  items,
  filteredItems,
  syllabi,
  topics,
  search,
  setSearch,
  selectedSyllabus,
  setSelectedSyllabus,
  selectedTopic,
  setSelectedTopic,
  selectedStatus,
  setSelectedStatus,
  selectedConfidence,
  setSelectedConfidence,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedType,
  setSelectedType,
  selectedReviewStatus,
  setSelectedReviewStatus,
  selectedItemIds,
  toggleSelectAll,
  toggleSelectItem,
  handleBulkStatusChange,
  handleBulkDelete,
  onOpenReview,
  onQuickStatusChange,
}: TrackerMobileViewProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [statusMenuOpenItemId, setStatusMenuOpenItemId] = useState<string | null>(null);

  // Active filters counter
  let activeFilterCount = 0;
  if (selectedSyllabus !== 'all') activeFilterCount++;
  if (selectedTopic !== 'all') activeFilterCount++;
  if (selectedConfidence !== 'all') activeFilterCount++;
  if (selectedDifficulty !== 'all') activeFilterCount++;
  if (selectedType !== 'all') activeFilterCount++;
  if (selectedReviewStatus !== 'all') activeFilterCount++;

  // Counts for status pills
  const statusCounts = {
    all: items.length,
    new: items.filter((i) => i.progress.status === 'new').length,
    learned: items.filter((i) => i.progress.status === 'learned').length,
    revised: items.filter((i) => i.progress.status === 'revised').length,
    mastered: items.filter((i) => i.progress.status === 'mastered').length,
  };

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: statusCounts.all },
    { id: 'new', label: 'New', count: statusCounts.new },
    { id: 'learned', label: 'Learned', count: statusCounts.learned },
    { id: 'revised', label: 'Revised', count: statusCounts.revised },
    { id: 'mastered', label: 'Mastered', count: statusCounts.mastered },
  ];

  const resetAllFilters = () => {
    setSelectedSyllabus('all');
    setSelectedTopic('all');
    setSelectedStatus('all');
    setSelectedConfidence('all');
    setSelectedDifficulty('all');
    setSelectedType('all');
    setSelectedReviewStatus('all');
    setSearch('');
  };

  return (
    <div className="space-y-4 pb-24 md:hidden">
      {/* MOBILE SEARCH & FILTER BAR */}
      <div className="space-y-3 sticky top-0 z-30 bg-background/95 backdrop-blur-md pt-1 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          {/* Touch-Friendly Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search learning items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs placeholder:text-muted-foreground/70"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Bottom Sheet Trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
              activeFilterCount > 0
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-card border-border text-foreground hover:bg-accent'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary-foreground text-primary">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* HORIZONTAL SWIPEABLE STATUS SEGMENTS */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${
                  isActive
                    ? 'bg-primary/15 border-primary/40 text-primary font-bold shadow-2xs'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SELECT ALL TOGGLE BAR */}
        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            {filteredItems.length > 0 && selectedItemIds.size === filteredItems.length ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-medium">
              {selectedItemIds.size > 0 ? `${selectedItemIds.size} Selected` : 'Select All'}
            </span>
          </button>
          <span className="font-mono text-[11px]">{filteredItems.length} items</span>
        </div>
      </div>

      {/* MOBILE CARDS LIST */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border rounded-2xl space-y-3">
            <Filter className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-xs text-muted-foreground">No learning items match your search or filter.</p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedItemIds.has(item.id);
            const isOverdue =
              item.progress.next_review_at &&
              new Date(item.progress.next_review_at) < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={item.id}
                className={`bg-card border rounded-2xl p-4 space-y-3 transition-all relative ${
                  isSelected
                    ? 'border-primary/50 bg-primary/5 shadow-xs'
                    : 'border-border hover:border-border/80'
                }`}
              >
                {/* Header Row: Checkbox, Title & Link */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    className="pt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/item/${item.id}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </Link>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {item.syllabus_title} <span className="opacity-50">›</span> {item.topic_title}
                    </div>
                  </div>

                  <DifficultyBadge difficulty={item.difficulty} />
                </div>

                {/* Metadata & Badges Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
                  <ItemTypeBadge type={item.item_type} />
                  <ConfidenceBadge level={item.progress.confidence} showLabel={false} />

                  {/* Due Date Indicator */}
                  {item.progress.next_review_at && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                        isOverdue
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold'
                          : 'bg-accent/60 text-muted-foreground border-border'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isOverdue
                        ? 'Overdue'
                        : new Date(item.progress.next_review_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                    </span>
                  )}
                </div>

                {/* Card Action Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                  {/* Status Dropdown Trigger */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setStatusMenuOpenItemId(statusMenuOpenItemId === item.id ? null : item.id)
                      }
                      className="flex items-center gap-1.5 focus:outline-none"
                    >
                      <StatusBadge status={item.progress.status} />
                      <span className="text-[10px] text-muted-foreground">▼</span>
                    </button>

                    {/* Popover Status Menu */}
                    {statusMenuOpenItemId === item.id && (
                      <div className="absolute left-0 bottom-full mb-1 z-30 bg-card border border-border rounded-xl shadow-xl p-1 w-32 space-y-0.5 animation-fade-in">
                        {(['new', 'learned', 'revised', 'mastered'] as LearningStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              onQuickStatusChange(item.id, st);
                              setStatusMenuOpenItemId(null);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono uppercase font-semibold transition-colors flex items-center justify-between ${
                              item.progress.status === st
                                ? 'bg-primary/15 text-primary'
                                : 'hover:bg-accent text-foreground'
                            }`}
                          >
                            <span>{st}</span>
                            {item.progress.status === st && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary Review Button */}
                  <button
                    onClick={() => onOpenReview(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-2xs active:scale-95 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-primary-foreground" />
                    <span>Review</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FLOATING MOBILE BULK ACTIONS BOTTOM BAR */}
      {selectedItemIds.size > 0 && (
        <div className="fixed bottom-5 left-4 right-4 z-40 bg-card/95 border border-primary/30 backdrop-blur-lg shadow-2xl rounded-2xl p-3 flex flex-col gap-2 animation-slide-up">
          <div className="flex items-center justify-between text-xs font-bold text-foreground border-b border-border pb-2 px-1">
            <span>{selectedItemIds.size} Items Selected</span>
            <button
              onClick={() => toggleSelectAll()}
              className="text-[11px] text-muted-foreground hover:text-foreground font-normal"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleBulkStatusChange('learned')}
              className="px-2 py-2 rounded-xl bg-accent hover:bg-accent/80 text-[11px] font-semibold text-foreground text-center"
            >
              Learned
            </button>
            <button
              onClick={() => handleBulkStatusChange('revised')}
              className="px-2 py-2 rounded-xl bg-accent hover:bg-accent/80 text-[11px] font-semibold text-foreground text-center"
            >
              Revised
            </button>
            <button
              onClick={() => handleBulkStatusChange('mastered')}
              className="px-2 py-2 rounded-xl bg-accent hover:bg-accent/80 text-[11px] font-semibold text-foreground text-center"
            >
              Mastered
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[11px] font-semibold text-center flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FILTER BOTTOM SHEET MODAL */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animation-fade-in">
          <div className="bg-card text-card-foreground border-t border-border w-full max-h-[85vh] rounded-t-3xl p-5 space-y-4 shadow-2xl overflow-y-auto animation-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base text-foreground">Filter Learning Items</h3>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 hover:bg-accent rounded-full text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Syllabus Select */}
              <div className="space-y-1">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                  Syllabus
                </label>
                <select
                  value={selectedSyllabus}
                  onChange={(e) => setSelectedSyllabus(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="all">All Syllabi</option>
                  {syllabi.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Select */}
              <div className="space-y-1">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="all">All Topics</option>
                  {topics
                    .filter((t) => selectedSyllabus === 'all' || t.syllabus_id === selectedSyllabus)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>

              {/* Confidence Select */}
              <div className="space-y-1">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                  Confidence Level
                </label>
                <select
                  value={selectedConfidence}
                  onChange={(e) => setSelectedConfidence(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="all">All Confidence Levels</option>
                  <option value="orange">Orange 🟠 (Needs hints)</option>
                  <option value="yellow">Yellow 🟡 (Explained with hints)</option>
                  <option value="green">Green 🟢 (Independent recall)</option>
                  <option value="blue">Blue 🔵 (Variations mastered)</option>
                  <option value="gold">Gold ⭐ (Interview ready)</option>
                </select>
              </div>

              {/* Difficulty & Type Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                    Item Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="concept">Concept</option>
                    <option value="problem">Problem</option>
                    <option value="technique">Technique</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Review Status */}
              <div className="space-y-1">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground font-semibold">
                  Spaced Repetition Schedule
                </label>
                <select
                  value={selectedReviewStatus}
                  onChange={(e) => setSelectedReviewStatus(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="all">All Schedule States</option>
                  <option value="overdue">Overdue Items</option>
                  <option value="due_today">Due Today</option>
                  <option value="no_review">No Schedule</option>
                </select>
              </div>
            </div>

            {/* Bottom Sheet Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
              >
                Apply Filters ({filteredItems.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
