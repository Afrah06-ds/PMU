'use client';

import React, { useState, useEffect } from 'react';
import { ExamTemplate } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Plus, Clock, Award, CheckCircle2 } from 'lucide-react';

export default function ExamTemplatesPage() {
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);

  useEffect(() => {
    MasterDataService.getExamTemplates().then(setTemplates);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-brand-600" />
            Examination Patterns & Templates
          </h1>
          <p className="text-sm text-slate-500 mt-1">Reusable examination blueprints specifying section breakdowns, mark rules, and OR patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map(tpl => (
          <Card key={tpl.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{tpl.title}</h2>
                  <Badge variant="primary">Active Blueprint</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Total Marks: {tpl.total_marks}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> Duration: {tpl.duration_minutes} Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Sections breakdown */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Section Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {tpl.sections?.map(sec => (
                  <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{sec.section_name}</span>
                      <Badge variant={sec.has_or_pattern ? 'warning' : 'neutral'}>
                        {sec.has_or_pattern ? 'OR Choice' : 'Direct'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <p><span className="font-semibold">Questions:</span> {sec.num_questions}</p>
                      <p><span className="font-semibold">Marks/Question:</span> {sec.marks_per_question} m</p>
                      <p><span className="font-semibold">Section Total:</span> {sec.num_questions * sec.marks_per_question} Marks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
