'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnalyticsService, AnalyticsSummary } from '@/services/analytics.service';
import { QuestionService } from '@/services/question.service';
import { PaperService } from '@/services/paper.service';
import { Question, GeneratedPaper } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wand2,
  FileQuestion,
  FileUp,
  BookOpen,
  Boxes,
  Plus,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [recentPapers, setRecentPapers] = useState<GeneratedPaper[]>([]);

  useEffect(() => {
    AnalyticsService.getSummary().then(setSummary);
    QuestionService.getQuestions().then(qs => setRecentQuestions(qs.slice(0, 5)));
    PaperService.getPapers().then(ps => setRecentPapers(ps.slice(0, 5)));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-6 md:p-8 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="primary" className="bg-brand-500/20 text-brand-300 border-brand-400/30">
              <Sparkles className="w-3 h-3 text-brand-400 mr-1" /> PMU Examination Management SaaS
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Question Paper Generator System
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Maintain structured question banks mapped with COs & K-levels, perform zero-duplicate randomization, and render print-ready A4 examination papers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/generate-paper">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30">
                <Wand2 className="w-4 h-4" />
                <span>Generate Paper</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Questions</span>
            <FileQuestion className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary?.totalQuestions || 0}</p>
          <Link href="/question-bank" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">
            View Question Bank <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Mapped</span>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary?.totalCourses || 0}</p>
          <Link href="/courses" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">
            Manage Catalog <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Syllabus Modules</span>
            <Boxes className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary?.totalModules || 0}</p>
          <Link href="/modules" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">
            View Units <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Papers</span>
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary?.totalGeneratedPapers || 0}</p>
          <Link href="/generated-papers" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">
            Paper History <ArrowRight className="w-3 h-3" />
          </Link>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/question-bank">
          <Card className="p-5 hover:border-brand-500 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add Question</h3>
                <p className="text-xs text-slate-500">Create MCQ, Short, or Long question</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/question-bank/import">
          <Card className="p-5 hover:border-brand-500 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Bulk Import</h3>
                <p className="text-xs text-slate-500">Upload CSV or Excel spreadsheets</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/generate-paper">
          <Card className="p-5 hover:border-brand-500 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Exam Generator</h3>
                <p className="text-xs text-slate-500">Configure pattern & pick questions</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <Card className="p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Recently Added Questions</h3>
            <Link href="/question-bank" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentQuestions.map((q, idx) => (
              <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="text-[10px]">{q.mark_value} Mark{q.mark_value > 1 ? 's' : ''}</Badge>
                    <Badge variant="warning" className="text-[10px] font-mono">{q.course_outcome?.code || 'CO1'}</Badge>
                    <Badge variant="info" className="text-[10px] font-mono">{q.k_level?.code || 'K1'}</Badge>
                  </div>
                  <p className="font-medium text-slate-900 line-clamp-1">{q.question_text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Generated Papers */}
        <Card className="p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Recent Generated Papers</h3>
            <Link href="/generated-papers" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentPapers.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-medium">
                No saved papers yet. Generate a paper to see history.
              </div>
            ) : (
              recentPapers.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-brand-700 block">{p.paper_code}</span>
                    <p className="font-bold text-slate-900 mt-0.5">{p.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{p.date_of_exam} • {p.total_marks} Marks</p>
                  </div>

                  <Link href={`/generate-paper/preview/${p.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
