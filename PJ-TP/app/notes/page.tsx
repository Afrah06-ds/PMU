'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Note, LearningItemWithProgress } from '@/types';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Link as LinkIcon,
  CheckCircle2,
  Tag,
  Search,
  BookOpen,
  Upload
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { NotesImportModal } from '@/components/notes/NotesImportModal';

function NotesContent() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState<'preview' | 'markdown'>('preview');
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [markdownContent, setMarkdownContent] = useState('');

  // Curriculum Matching Modal
  const [matchingMatches, setMatchingMatches] = useState<LearningItemWithProgress[]>([]);
  const [matchingOpen, setMatchingOpen] = useState(false);

  const searchParams = useSearchParams();
  const noteParamId = searchParams.get('id');

  const loadData = () => {
    const list = storage.getNotes();
    setNotes(list);

    const targetId = noteParamId || selectedNoteId;
    const target = list.find((n) => n.id === targetId) || list[0];

    if (target) {
      setSelectedNoteId(target.id);
      setTitle(target.title);
      setCategory(target.category || 'General');
      setMarkdownContent(target.markdown_content);
    }
  };

  useEffect(() => {
    loadData();
    return storage.subscribe(loadData);
  }, [noteParamId]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const selectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setCategory(note.category || 'General');
    setMarkdownContent(note.markdown_content);
    setEditMode('preview');
  };

  const handleCreateNewNote = () => {
    const newNote = storage.addNote(
      'Untitled Note',
      '# New Note\n\nStart typing your markdown notes here...',
      'General'
    );
    selectNote(newNote);
    setEditMode('markdown');

    // Trigger auto-match detector
    checkMatches(newNote.title);
  };

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    storage.updateNote(selectedNoteId, {
      title,
      category,
      markdown_content: markdownContent,
    });
    // Trigger auto-match detector
    checkMatches(title);
  };

  const handleDeleteNote = (id: string) => {
    setDeleteNoteId(id);
  };

  const confirmDeleteNote = () => {
    if (deleteNoteId) {
      storage.deleteNote(deleteNoteId);
      if (selectedNoteId === deleteNoteId) setSelectedNoteId(null);
      setDeleteNoteId(null);
    }
  };

  const checkMatches = (noteTitle: string) => {
    const matches = storage.findCurriculumMatchesForNote(noteTitle);
    if (matches.length > 0) {
      setMatchingMatches(matches);
      setMatchingOpen(true);
    }
  };

  const handleConfirmLink = (itemId: string) => {
    if (selectedNoteId) {
      storage.linkNoteToItem(selectedNoteId, itemId);
    }
    setMatchingOpen(false);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Get currently linked items for selected note
  const currentLinks = selectedNoteId
    ? storage.getNoteLinks().filter((l) => l.note_id === selectedNoteId)
    : [];

  const linkedItems = storage.getJoinedItems().filter((i) => currentLinks.some((l) => l.item_id === i.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Notes Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Personal Markdown documentation system linked to curricula.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-semibold hover:bg-accent transition-colors"
          >
            <Upload className="w-4 h-4 text-primary" />
            <span>Import Markdown Notes</span>
          </button>

          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* TWO-PANE NOTION-STYLE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* LEFT PANE: NOTES NAVIGATION & CATEGORIES */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="text-xs font-mono uppercase text-muted-foreground tracking-wider font-semibold pt-1">
              All Notes ({notes.length})
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[500px]">
              {filteredNotes.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">No notes found.</p>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors space-y-1 ${
                        isSelected
                          ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                          : 'border-border hover:bg-accent/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm truncate">{note.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-accent text-accent-foreground shrink-0">
                          {note.category || 'General'}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 text-[11px] font-normal">
                        {note.markdown_content.replace(/[#*`]/g, '')}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: DOCUMENT EDITOR & RENDERER */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-6 space-y-5 flex flex-col justify-between">
          {!selectedNote ? (
            <div className="py-20 text-center text-muted-foreground text-xs">
              Select or create a note to begin documentation.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Document Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSaveNote}
                    placeholder="Note Title"
                    className="font-bold text-xl bg-transparent border-none focus:outline-none text-foreground w-full"
                  />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={handleSaveNote}
                    placeholder="Category"
                    className="text-xs font-mono px-2 py-1 rounded border border-border bg-accent text-accent-foreground w-28 shrink-0 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-accent rounded-lg p-0.5 border border-border flex">
                    <button
                      onClick={() => setEditMode('preview')}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        editMode === 'preview' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      Render Preview
                    </button>
                    <button
                      onClick={() => setEditMode('markdown')}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        editMode === 'markdown' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      Markdown Edit
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-2 rounded-lg border border-border hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Linked Curricula Indicator */}
              {linkedItems.length > 0 && (
                <div className="bg-accent/40 rounded-lg p-2.5 border border-border flex items-center gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Linked Curriculum Items:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {linkedItems.map((item) => (
                      <span
                        key={item.id}
                        className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold text-[11px]"
                      >
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Document Content */}
              {editMode === 'markdown' ? (
                <textarea
                  rows={18}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  onBlur={handleSaveNote}
                  className="w-full bg-background border border-border rounded-lg p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  placeholder="Type Markdown content here..."
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none p-4 bg-background border border-border rounded-lg min-h-[450px] overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CURRICULUM AUTOMATIC MATCHING MODAL */}
      {matchingOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border w-full max-w-md rounded-xl p-6 space-y-4 shadow-2xl animation-fade-in">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-base text-foreground">Curriculum Match Detected</h3>
            </div>

            <p className="text-xs text-muted-foreground">
              We detected possible learning item matches for this note. Would you like to link them?
            </p>

            <div className="space-y-2">
              {matchingMatches.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background text-xs"
                >
                  <div>
                    <div className="font-semibold text-foreground">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.syllabus_title} → {item.topic_title}
                    </div>
                  </div>
                  <button
                    onClick={() => handleConfirmLink(item.id)}
                    className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold"
                  >
                    Link Note
                  </button>
                </div>
              ))}
            </div>

              <button
                onClick={() => setMatchingOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-accent"
              >
                Ignore
              </button>
          </div>
        </div>
      )}

      <NotesImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={loadData}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteNoteId}
        onClose={() => setDeleteNoteId(null)}
        onConfirm={confirmDeleteNote}
        title="Delete Note?"
        description="Are you sure you want to delete this note? Any links between this note and curriculum topics will also be removed."
        confirmText="Delete Note"
      />
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-muted-foreground">Loading Notes...</div>}>
      <NotesContent />
    </Suspense>
  );
}
