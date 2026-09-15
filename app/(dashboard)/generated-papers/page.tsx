'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GeneratedPaper } from '@/types';
import { PaperService } from '@/services/paper.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Modal } from '@/components/ui/modal';
import { Archive, CalendarDays, ChevronLeft, ChevronRight, Clock3, Eye, FileText, Plus, Search, Trash2, WandSparkles } from 'lucide-react';

const PAGE_SIZES = [10, 25, 50];

export default function GeneratedPapersDashboardPage() {
  const [papers, setPapers] = useState<GeneratedPaper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deletePaperId, setDeletePaperId] = useState<string | null>(null);

  const loadPapers = async () => {
    setLoading(true);
    setPapers(await PaperService.getPapers());
    setLoading(false);
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const filteredPapers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return papers;
    return papers.filter((paper) => [paper.paper_code, paper.title, paper.course?.name, paper.course?.code].some((value) => value?.toLowerCase().includes(query)));
  }, [papers, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredPapers.length / pageSize));
  const visiblePapers = filteredPapers.slice((page - 1) * pageSize, page * pageSize);
  const firstVisible = filteredPapers.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastVisible = Math.min(page * pageSize, filteredPapers.length);

  const confirmDelete = async () => {
    if (!deletePaperId) return;
    await PaperService.deletePaper(deletePaperId);
    setDeletePaperId(null);
    loadPapers();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-10">
      <header className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600"><Archive className="h-3.5 w-3.5" /> Paper archive</div>
          <h1 className="font-poppins text-2xl font-bold tracking-tight text-slate-950">Generated papers</h1>
          <p className="mt-1 text-xs leading-5 text-slate-500">Review, print, and manage saved examination snapshots.</p>
        </div>
        <Link href="/generate-paper"><Button size="lg"><WandSparkles className="h-4 w-4" /> Generate new paper</Button></Link>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Saved papers</p><p className="text-xl font-bold tracking-tight text-slate-900">{papers.length}</p></div>
        <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">Current results</p><p className="text-xl font-bold tracking-tight text-indigo-700">{filteredPapers.length}</p></div>
        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Archive active</p><Archive className="h-4 w-4 text-emerald-500" /></div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setPage(1); }} placeholder="Search by paper code, course, or title" className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" /></div>
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500"><span>Showing {firstVisible}-{lastVisible} of {filteredPapers.length}</span><DropdownSelect value={String(pageSize)} onChange={(value) => { setPageSize(Number(value)); setPage(1); }} options={PAGE_SIZES.map((size) => ({ value: String(size), label: `${size} / page` }))} className="w-[92px] [&>button]:h-9 [&>button]:rounded-lg [&>button]:bg-white [&>button]:text-xs" /></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="hidden grid-cols-[150px_minmax(0,1fr)_130px_110px_150px_auto] gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:grid"><span>Paper code</span><span>Course & examination</span><span>Date</span><span>Marks</span><span>Status</span><span>Actions</span></div>
        {loading ? <div className="px-6 py-20 text-center text-sm font-medium text-slate-400">Loading paper archive...</div> : visiblePapers.length === 0 ? <div className="px-6 py-20 text-center"><FileText className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-sm font-bold text-slate-800">No saved papers found</h2><p className="mt-2 text-xs text-slate-500">Generate a paper or adjust your search to see archive records.</p><Link href="/generate-paper"><Button size="sm" className="mt-5"><Plus className="h-4 w-4" /> Generate paper</Button></Link></div> : <div className="divide-y divide-slate-100">{visiblePapers.map((paper) => <div key={paper.id} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50/70 lg:grid-cols-[150px_minmax(0,1fr)_130px_110px_150px_auto] lg:items-center lg:gap-4"><div><span className="font-mono text-sm font-bold text-indigo-700">{paper.paper_code}</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400 lg:hidden">Paper code</span></div><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{paper.title}</p><p className="mt-1 truncate text-xs font-medium text-slate-500">{paper.course?.code} · {paper.course?.name}</p><p className="mt-1 text-[11px] font-medium text-slate-400">Academic year {paper.academic_year}</p></div><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{paper.date_of_exam}</div><div className="text-sm font-bold text-slate-800">{paper.total_marks} <span className="text-[10px] font-medium text-slate-400">marks</span></div><div><Badge variant="success">Saved snapshot</Badge><p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400"><Clock3 className="h-3 w-3" /> Immutable record</p></div><div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3 lg:border-0 lg:pt-0"><Link href={`/generate-paper/preview/${paper.id}`}><Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5" /><span>Preview</span></Button></Link><button type="button" onClick={() => setDeletePaperId(paper.id)} title="Delete paper" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>}
        {filteredPapers.length > 0 && <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-medium text-slate-400">Page {page} of {pageCount}</p><div className="flex gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /> Previous</button><button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Next <ChevronRight className="h-3.5 w-3.5" /></button></div></div>}
      </section>

      <Modal open={Boolean(deletePaperId)} onClose={() => setDeletePaperId(null)} title="Delete saved paper?" description="This removes the saved paper record from the archive. The action cannot be undone."><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDeletePaperId(null)}>Keep paper</Button><Button variant="danger" onClick={confirmDelete}><Trash2 className="h-4 w-4" /> Delete paper</Button></div></Modal>
    </div>
  );
}