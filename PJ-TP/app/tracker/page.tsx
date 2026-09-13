'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import {
  LearningItemWithProgress,
  Syllabus,
  Topic,
  LearningStatus,
  ConfidenceLevel,
  Difficulty,
  ItemType
} from '@/types';
import { ConfidenceBadge, StatusBadge, DifficultyBadge, ItemTypeBadge } from '@/components/common/Badges';
import { Search, Filter, CheckSquare, Trash2, Edit, Play } from 'lucide-react';
import Link from 'next/link';
import { RevisionModal } from '@/components/revision/RevisionModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';

export default function TrackerPage() {
  const [items, setItems] = useState<LearningItemWithProgress[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState<string>('all');

  // Bulk Selection
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Review Modal State
  const [reviewItem, setReviewItem] = useState<LearningItemWithProgress | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const loadData = () => {
    setItems(storage.getJoinedItems());
    setSyllabi(storage.getSyllabi());
    setTopics(storage.getTopics());
  };

  useEffect(() => {
    loadData();
    return storage.subscribe(loadData);
  }, []);

  const filteredItems = items.filter((item) => {
    if (search.trim() && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedSyllabus !== 'all' && item.syllabus_id !== selectedSyllabus) return false;
    if (selectedTopic !== 'all' && item.topic_id !== selectedTopic) return false;
    if (selectedStatus !== 'all' && item.progress.status !== selectedStatus) return false;
    if (selectedConfidence !== 'all' && item.progress.confidence !== selectedConfidence) return false;
    if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && item.item_type !== selectedType) return false;

    if (selectedReviewStatus !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (selectedReviewStatus === 'overdue') {
        if (!item.progress.next_review_at || new Date(item.progress.next_review_at) >= startOfToday)
          return false;
      } else if (selectedReviewStatus === 'due_today') {
        if (!item.progress.next_review_at) return false;
        const reviewDate = new Date(item.progress.next_review_at);
        if (reviewDate < startOfToday || reviewDate.toDateString() !== now.toDateString()) return false;
      } else if (selectedReviewStatus === 'no_review') {
        if (item.progress.next_review_at) return false;
      }
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedItemIds.size === filteredItems.length) {
      setSelectedItemIds(new Set());
    } else {
      setSelectedItemIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedItemIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItemIds(next);
  };

  const handleBulkStatusChange = (status: LearningStatus) => {
    storage.bulkUpdateProgress(Array.from(selectedItemIds), { status });
    setSelectedItemIds(new Set());
  };

  const handleBulkConfidenceChange = (confidence: ConfidenceLevel) => {
    storage.bulkUpdateProgress(Array.from(selectedItemIds), { confidence });
    setSelectedItemIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedItemIds.size > 0) {
      setBulkDeleteOpen(true);
    }
  };

  const confirmBulkDelete = () => {
    storage.bulkDeleteItems(Array.from(selectedItemIds));
    setSelectedItemIds(new Set());
    setBulkDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Learning State Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Global view across all curricula. Monitor confidence, status, and revision schedule ({items.length} total items).
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search items by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
          {/* Syllabus */}
          <select
            value={selectedSyllabus}
            onChange={(e) => setSelectedSyllabus(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            <option value="all">Syllabus: All</option>
            {syllabi.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="new">NEW</option>
            <option value="learned">LEARNED</option>
            <option value="revised">REVISED</option>
            <option value="mastered">MASTERED</option>
          </select>

          {/* Confidence */}
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            <option value="all">Confidence: All</option>
            <option value="orange">Orange 🟠</option>
            <option value="yellow">Yellow 🟡</option>
            <option value="green">Green 🟢</option>
            <option value="blue">Blue 🔵</option>
            <option value="gold">Gold ⭐</option>
          </select>

          {/* Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            <option value="all">Type: All</option>
            <option value="concept">Concept</option>
            <option value="problem">Problem</option>
            <option value="technique">Technique</option>
            <option value="definition">Definition</option>
            <option value="api">API</option>
            <option value="protocol">Protocol</option>
            <option value="command">Command</option>
          </select>

          {/* Difficulty */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
          >
            <option value="all">Difficulty: All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="not_set">Not Set</option>
          </select>

          {/* Review Status */}
          <select
            value={selectedReviewStatus}
            onChange={(e) => setSelectedReviewStatus(e.target.value)}
            className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none col-span-2 sm:col-span-1"
          >
            <option value="all">Review: All</option>
            <option value="overdue">Overdue</option>
            <option value="due_today">Due Today</option>
            <option value="no_review">No Review</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedItemIds.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-foreground">
            {selectedItemIds.size} items selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('learned')}
              className="px-2.5 py-1 rounded bg-accent hover:bg-accent/80 font-medium"
            >
              Mark Learned
            </button>
            <button
              onClick={() => handleBulkStatusChange('revised')}
              className="px-2.5 py-1 rounded bg-accent hover:bg-accent/80 font-medium"
            >
              Mark Revised
            </button>
            <button
              onClick={() => handleBulkStatusChange('mastered')}
              className="px-2.5 py-1 rounded bg-accent hover:bg-accent/80 font-medium"
            >
              Mark Mastered
            </button>
            <button
              onClick={() => handleBulkConfidenceChange('green')}
              className="px-2.5 py-1 rounded bg-accent hover:bg-accent/80 font-medium"
            >
              Set Green 🟢
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table List View */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-accent/40 text-muted-foreground font-mono uppercase">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredItems.length > 0 && selectedItemIds.size === filteredItems.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="p-3 font-semibold">Learning Item</th>
                <th className="p-3 font-semibold">Syllabus & Topic</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Confidence</th>
                <th className="p-3 font-semibold">Next Review</th>
                <th className="p-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground italic">
                    No items matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-accent/30 transition-colors group"
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/item/${item.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {item.title}
                        <DifficultyBadge difficulty={item.difficulty} />
                      </Link>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <div>{item.syllabus_title}</div>
                      <div className="text-[10px]">{item.topic_title}</div>
                    </td>
                    <td className="p-3">
                      <ItemTypeBadge type={item.item_type} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={item.progress.status} />
                    </td>
                    <td className="p-3">
                      <ConfidenceBadge level={item.progress.confidence} />
                    </td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">
                      {item.progress.next_review_at
                        ? new Date(item.progress.next_review_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setReviewItem(item);
                          setReviewModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Play className="w-3 h-3" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <RevisionModal
        item={reviewItem}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onComplete={loadData}
      />

      <ConfirmDeleteModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Items?"
        description={`Are you sure you want to delete ${selectedItemIds.size} selected items? Their progress and revision logs will be permanently deleted.`}
        confirmText="Delete Items"
      />
    </div>
  );
}
