'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Syllabus, Topic, Subtopic, ItemType, Difficulty } from '@/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSyllabusId?: string;
  defaultTopicId?: string;
  defaultSubtopicId?: string;
  onItemAdded?: () => void;
}

export function AddItemModal({
  isOpen,
  onClose,
  defaultSyllabusId,
  defaultTopicId,
  defaultSubtopicId,
  onItemAdded,
}: AddItemModalProps) {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);

  const [syllabusId, setSyllabusId] = useState(defaultSyllabusId || '');
  const [topicId, setTopicId] = useState(defaultTopicId || '');
  const [subtopicId, setSubtopicId] = useState(defaultSubtopicId || '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<ItemType>('concept');
  const [difficulty, setDifficulty] = useState<Difficulty>('not_set');

  useEffect(() => {
    if (isOpen) {
      const allSyllabi = storage.getSyllabi();
      setSyllabi(allSyllabi);

      const targetSyllabus = defaultSyllabusId || allSyllabi[0]?.id || '';
      setSyllabusId(targetSyllabus);

      if (targetSyllabus) {
        const topList = storage.getTopics(targetSyllabus);
        setTopics(topList);
        const targetTopic = defaultTopicId || topList[0]?.id || '';
        setTopicId(targetTopic);

        if (targetTopic) {
          const subList = storage.getSubtopics(targetTopic);
          setSubtopics(subList);
          setSubtopicId(defaultSubtopicId || '');
        }
      }
    }
  }, [isOpen, defaultSyllabusId, defaultTopicId, defaultSubtopicId]);

  useEffect(() => {
    if (syllabusId) {
      const topList = storage.getTopics(syllabusId);
      setTopics(topList);
      if (!topList.some((t) => t.id === topicId)) {
        setTopicId(topList[0]?.id || '');
      }
    }
  }, [syllabusId, topicId]);

  useEffect(() => {
    if (topicId) {
      const subList = storage.getSubtopics(topicId);
      setSubtopics(subList);
      if (!subList.some((s) => s.id === subtopicId)) {
        setSubtopicId('');
      }
    }
  }, [topicId, subtopicId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !syllabusId || !topicId) return;

    storage.addItem({
      syllabus_id: syllabusId,
      topic_id: topicId,
      subtopic_id: subtopicId || null,
      title: title.trim(),
      description: description.trim(),
      item_type: itemType,
      difficulty,
    });

    setTitle('');
    setDescription('');
    onItemAdded?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animation-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-base text-foreground">Add Learning Item</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Location Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Syllabus *</label>
              <select
                value={syllabusId}
                onChange={(e) => setSyllabusId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                {syllabi.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Topic *</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {subtopics.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Subtopic (Optional)</label>
              <select
                value={subtopicId}
                onChange={(e) => setSubtopicId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">None</option>
                {subtopics.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
            <input
              type="text"
              placeholder="e.g. GET, Two Sum, TCP vs UDP, JWT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Type & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Item Type</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ItemType)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="concept">Concept</option>
                <option value="problem">Problem</option>
                <option value="technique">Technique</option>
                <option value="definition">Definition</option>
                <option value="api">API</option>
                <option value="protocol">Protocol</option>
                <option value="command">Command</option>
                <option value="architecture">Architecture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Difficulty (Optional)</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="not_set">Not Set</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description / Short Context</label>
            <textarea
              rows={3}
              placeholder="Brief explanation or key context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
