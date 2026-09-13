'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Syllabus, Topic, Subtopic, LearningItemWithProgress } from '@/types';
import { ConfidenceBadge, DifficultyBadge, ItemTypeBadge } from '@/components/common/Badges';
import { AddItemModal } from '@/components/item/AddItemModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FolderPlus,
  ArrowLeft,
  Trash2,
  Edit2,
  CheckSquare,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function SyllabusDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [items, setItems] = useState<LearningItemWithProgress[]>([]);

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);

  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set());

  // Modal triggers
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [addSubtopicTopicId, setAddSubtopicTopicId] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [addItemOpen, setAddItemOpen] = useState(false);

  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const loadData = () => {
    const s = storage.getSyllabi().find((item) => item.id === id);
    if (!s) return;
    setSyllabus(s);

    const topList = storage.getTopics(id);
    setTopics(topList);

    const subList = storage.getSubtopics();
    setSubtopics(subList);

    const joinedItems = storage.getJoinedItems().filter((item) => item.syllabus_id === id);
    setItems(joinedItems);

    if (!selectedTopicId && topList.length > 0) {
      setSelectedTopicId(topList[0].id);
      setExpandedTopicIds(new Set([topList[0].id]));
    }
  };

  useEffect(() => {
    loadData();
    return storage.subscribe(loadData);
  }, [id]);

  if (!syllabus) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Syllabus not found.</p>
        <Link href="/syllabus" className="text-primary hover:underline text-xs mt-2 inline-block">
          ← Back to Syllabi
        </Link>
      </div>
    );
  }

  const toggleExpand = (topicId: string) => {
    const next = new Set(expandedTopicIds);
    if (next.has(topicId)) next.delete(topicId);
    else next.add(topicId);
    setExpandedTopicIds(next);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    const t = storage.addTopic(syllabus.id, newTopicTitle.trim());
    setNewTopicTitle('');
    setAddTopicOpen(false);
    setSelectedTopicId(t.id);
  };

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim() || !addSubtopicTopicId) return;
    const st = storage.addSubtopic(addSubtopicTopicId, newSubtopicTitle.trim());
    setNewSubtopicTitle('');
    setAddSubtopicTopicId(null);
    setSelectedSubtopicId(st.id);
  };

  const handleDeleteTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTopicId(topicId);
  };

  const confirmDeleteTopic = () => {
    if (deleteTopicId) {
      storage.deleteTopic(deleteTopicId);
      if (selectedTopicId === deleteTopicId) setSelectedTopicId(null);
      setDeleteTopicId(null);
    }
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteItemId(itemId);
  };

  const confirmDeleteItem = () => {
    if (deleteItemId) {
      storage.deleteItem(deleteItemId);
      setDeleteItemId(null);
    }
  };

  // Filter items for right pane
  const currentTopic = topics.find((t) => t.id === selectedTopicId);
  const currentSubtopic = subtopics.find((s) => s.id === selectedSubtopicId);

  const displayItems = items.filter((i) => {
    if (selectedSubtopicId) return i.subtopic_id === selectedSubtopicId;
    if (selectedTopicId) return i.topic_id === selectedTopicId;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/syllabus"
            className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{syllabus.title}</h1>
            {syllabus.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{syllabus.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => setAddItemOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Learning Item</span>
        </button>
      </div>

      {/* TWO-PANE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* LEFT PANE: CURRICULUM TREE */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider font-semibold">
                Curriculum Structure
              </h3>
              <button
                onClick={() => setAddTopicOpen(true)}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <FolderPlus className="w-3.5 h-3.5" /> + Topic
              </button>
            </div>

            {/* Tree Navigation */}
            <div className="mt-3 space-y-1 overflow-y-auto max-h-[500px]">
              {topics.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">
                  No topics created yet. Click + Topic above.
                </p>
              ) : (
                topics.map((topic) => {
                  const tSubtopics = subtopics.filter((st) => st.topic_id === topic.id);
                  const isExpanded = expandedTopicIds.has(topic.id);
                  const isSelected = selectedTopicId === topic.id && !selectedSubtopicId;
                  const tItemsCount = items.filter((i) => i.topic_id === topic.id).length;

                  return (
                    <div key={topic.id} className="space-y-0.5">
                      {/* Topic Row */}
                      <div
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setSelectedSubtopicId(null);
                          toggleExpand(topic.id);
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors group ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground hover:bg-accent/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {tSubtopics.length > 0 ? (
                            isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )
                          ) : (
                            <span className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{topic.title}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 bg-accent rounded">
                            {tItemsCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddSubtopicTopicId(topic.id);
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                            title="Add Subtopic"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteTopic(topic.id, e)}
                            className="p-1 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subtopics List */}
                      {isExpanded && tSubtopics.length > 0 && (
                        <div className="pl-6 space-y-0.5">
                          {tSubtopics.map((subtopic) => {
                            const isSubSelected = selectedSubtopicId === subtopic.id;
                            const stItemsCount = items.filter((i) => i.subtopic_id === subtopic.id).length;

                            return (
                              <div
                                key={subtopic.id}
                                onClick={() => {
                                  setSelectedTopicId(topic.id);
                                  setSelectedSubtopicId(subtopic.id);
                                }}
                                className={`flex items-center justify-between p-1.5 px-2 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                                  isSubSelected
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                                }`}
                              >
                                <span className="truncate">{subtopic.title}</span>
                                <span className="text-[10px] font-mono text-muted-foreground px-1 bg-accent/60 rounded">
                                  {stItemsCount}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: SELECTED CONTENT ITEMS */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-5 space-y-5 flex flex-col justify-between">
          <div>
            {/* Topic Subheader */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  {currentSubtopic
                    ? `${currentTopic?.title} → ${currentSubtopic.title}`
                    : currentTopic?.title || 'All Curriculum Items'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {displayItems.length} Learning Items
                </p>
              </div>

              <button
                onClick={() => setAddItemOpen(true)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item Here
              </button>
            </div>

            {/* Items List */}
            <div className="mt-4 space-y-2">
              {displayItems.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                  <p>No items in this section yet.</p>
                  <button
                    onClick={() => setAddItemOpen(true)}
                    className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold"
                  >
                    + Add Item
                  </button>
                </div>
              ) : (
                displayItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/item/${item.id}`)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-md">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <ItemTypeBadge type={item.item_type} />
                      <DifficultyBadge difficulty={item.difficulty} />
                      <ConfidenceBadge level={item.progress.confidence} showLabel={false} />
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {addTopicOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-sm rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-foreground">Add New Topic</h3>
            <form onSubmit={handleAddTopic} className="space-y-3">
              <input
                type="text"
                placeholder="Topic Title (e.g. Authentication, TCP/IP)"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddTopicOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subtopic Modal */}
      {addSubtopicTopicId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-sm rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-foreground">Add Subtopic</h3>
            <form onSubmit={handleAddSubtopic} className="space-y-3">
              <input
                type="text"
                placeholder="Subtopic Title (e.g. HTTP Methods, Two Pointers)"
                value={newSubtopicTitle}
                onChange={(e) => setNewSubtopicTitle(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddSubtopicTopicId(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Add Subtopic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        defaultSyllabusId={syllabus.id}
        defaultTopicId={selectedTopicId || undefined}
        defaultSubtopicId={selectedSubtopicId || undefined}
        onItemAdded={loadData}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTopicId}
        onClose={() => setDeleteTopicId(null)}
        onConfirm={confirmDeleteTopic}
        title="Delete Topic?"
        description="Are you sure you want to delete this topic? All learning items under this topic will also be permanently deleted."
        confirmText="Delete Topic"
      />

      <ConfirmDeleteModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={confirmDeleteItem}
        title="Delete Learning Item?"
        description="Are you sure you want to delete this learning item? Its progress and revision records will be permanently removed."
        confirmText="Delete Item"
      />
    </div>
  );
}
