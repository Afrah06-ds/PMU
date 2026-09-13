'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Syllabus } from '@/types';
import { Plus, FileText, BookOpen, Trash2, Edit2, ChevronRight, Copy } from 'lucide-react';
import Link from 'next/link';
import { MarkdownImportModal } from '@/components/syllabus/MarkdownImportModal';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';

export default function SyllabusLandingPage() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [importOpen, setImportOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteSyllabusId, setDeleteSyllabusId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const loadData = () => {
    setSyllabi(storage.getSyllabi());
  };

  useEffect(() => {
    loadData();
    return storage.subscribe(loadData);
  }, []);

  const handleCreateSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    storage.addSyllabus(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setCreateOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteSyllabusId(id);
  };

  const confirmDeleteSyllabus = () => {
    if (deleteSyllabusId) {
      storage.deleteSyllabus(deleteSyllabusId);
      setDeleteSyllabusId(null);
    }
  };

  const itemsList = storage.getJoinedItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Syllabi & Curricula</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define what you need to learn. Structure your subjects, topics, and items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>Import Markdown</span>
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Create Syllabus</span>
          </button>
        </div>
      </div>

      {/* Grid of Syllabi */}
      {syllabi.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent text-muted-foreground flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">No syllabus yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Create a syllabus manually or import a structured Markdown curriculum to get started.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              Create Syllabus
            </button>
            <button
              onClick={() => setImportOpen(true)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold"
            >
              Import Markdown
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {syllabi.map((s) => {
            const sItems = itemsList.filter((i) => i.syllabus_id === s.id);
            const total = sItems.length;
            const learned = sItems.filter((i) => i.progress.status !== 'new').length;
            const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

            return (
              <Link
                key={s.id}
                href={`/syllabus/${s.id}`}
                className="bg-card border border-border hover:border-primary/40 rounded-xl p-5 shadow-xs transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      className="p-1.5 rounded text-muted-foreground hover:text-rose-500 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Syllabus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{s.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    {s.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-2 pt-4 border-t border-border/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">{total} items</span>
                    <span className="font-semibold text-foreground">{percentage}% learned</span>
                  </div>
                  <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Manual Create Syllabus Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground">Create New Syllabus</h3>
            <form onSubmit={handleCreateSyllabus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Syllabus Title *</label>
                <input
                  type="text"
                  placeholder="e.g. System Design, Operating Systems, DevOps"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Short description of this curriculum..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Markdown Importer Modal */}
      <MarkdownImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImportComplete={loadData}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteSyllabusId}
        onClose={() => setDeleteSyllabusId(null)}
        onConfirm={confirmDeleteSyllabus}
        title="Delete Syllabus?"
        description="Are you sure you want to delete this syllabus? All associated topics, subtopics, and learning items will be permanently removed."
        confirmText="Delete Syllabus"
      />
    </div>
  );
}
