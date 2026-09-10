'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeneratedPaper } from '@/types';
import { PaperService } from '@/services/paper.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Printer, Download, Trash2, Wand2, Search } from 'lucide-react';

export default function GeneratedPapersDashboardPage() {
  const [papers, setPapers] = useState<GeneratedPaper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPapers = async () => {
    setLoading(true);
    const list = await PaperService.getPapers();
    setPapers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this saved paper record?')) {
      await PaperService.deletePaper(id);
      loadPapers();
    }
  };

  const filteredPapers = papers.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.paper_code.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.course?.name.toLowerCase().includes(q) ||
      p.course?.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            Generated Papers Dashboard & History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access, preview, print, export PDF, or regenerate historical examination papers.
          </p>
        </div>

        <Link href="/generate-paper">
          <Button variant="primary">
            <Wand2 className="w-4 h-4" />
            <span>Generate New Paper</span>
          </Button>
        </Link>
      </div>

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved papers by code, course name, or title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </Card>

      {/* Papers Table */}
      <Card className="overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">Paper Code</th>
                <th className="p-3">Course & Examination</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total Marks</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium animate-pulse">
                    Loading paper history...
                  </td>
                </tr>
              ) : filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No generated papers found. Click "Generate New Paper" to create your first paper snapshot.
                  </td>
                </tr>
              ) : (
                filteredPapers.map(paper => (
                  <tr key={paper.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{paper.paper_code}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 text-xs">{paper.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {paper.course?.code} - {paper.course?.name} ({paper.academic_year})
                      </p>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{paper.date_of_exam}</td>
                    <td className="p-3 font-bold font-mono text-slate-900">{paper.total_marks} Marks</td>
                    <td className="p-3">
                      <Badge variant="success">Saved Snapshot</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/generate-paper/preview/${paper.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview / Print</span>
                          </Button>
                        </Link>

                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
