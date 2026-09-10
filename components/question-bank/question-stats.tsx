'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsService, AnalyticsSummary } from '@/services/analytics.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileQuestion, BookOpen, Boxes, Layers, PieChart } from 'lucide-react';

export function QuestionStats({ courseId }: { courseId?: string }) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    AnalyticsService.getSummary(courseId).then(setSummary);
  }, [courseId]);

  if (!summary) return null;

  return (
    <div className="space-y-4">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-brand-600 to-indigo-700 text-white border-0 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">Total Questions</p>
            <FileQuestion className="w-5 h-5 text-brand-200" />
          </div>
          <p className="text-3xl font-extrabold mt-2 tracking-tight">{summary.totalQuestions}</p>
          <p className="text-[11px] text-brand-200 mt-1">Available in question bank</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</p>
            <BookOpen className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{summary.totalCourses}</p>
          <p className="text-[11px] text-slate-400 mt-1">Mapped degree courses</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modules</p>
            <Boxes className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{summary.totalModules}</p>
          <p className="text-[11px] text-slate-400 mt-1">Syllabus units</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Papers</p>
            <Layers className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{summary.totalGeneratedPapers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Saved in database</p>
        </Card>
      </div>

      {/* Distribution Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* By Marks */}
        <Card className="p-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Questions by Mark Scheme</h4>
          <div className="space-y-2">
            {summary.byMarks.map(item => {
              const pct = summary.totalQuestions ? Math.round((item.count / summary.totalQuestions) * 100) : 0;
              return (
                <div key={item.mark} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{item.mark} Mark Question{item.mark > 1 ? 's' : ''}</span>
                    <span className="text-slate-500">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By CO Outcome */}
        <Card className="p-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Questions by Course Outcome (CO)</h4>
          <div className="space-y-2">
            {summary.byCO.map(item => {
              const pct = summary.totalQuestions ? Math.round((item.count / summary.totalQuestions) * 100) : 0;
              return (
                <div key={item.co} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700 font-mono font-semibold">{item.co}</span>
                    <span className="text-slate-500">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By K-Level */}
        <Card className="p-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Questions by K-Level (Bloom's)</h4>
          <div className="space-y-2">
            {summary.byKLevel.map(item => {
              const pct = summary.totalQuestions ? Math.round((item.count / summary.totalQuestions) * 100) : 0;
              return (
                <div key={item.klevel} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{item.klevel}</span>
                    <span className="text-slate-500">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
