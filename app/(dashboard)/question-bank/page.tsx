'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Question, Department, Course, Module, CourseOutcome, KLevel, QuestionType, Mark } from '@/types';
import { QuestionService, QuestionFilter } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionStats } from '@/components/question-bank/question-stats';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileQuestion,
  Plus,
  FileUp,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  X,
  SlidersHorizontal
} from 'lucide-react';

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Master options
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);
  const [types, setTypes] = useState<QuestionType[]>([]);
  const [marksList, setMarksList] = useState<Mark[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedMark, setSelectedMark] = useState<number | ''>('');
  const [selectedCOIds, setSelectedCOIds] = useState<string[]>([]);
  const [selectedKLevelIds, setSelectedKLevelIds] = useState<string[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState('');

  // MCQ Options Modal
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);

  // Load master data on mount
  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes(),
      MasterDataService.getMarks()
    ]).then(([dList, cList, kList, tList, mList]) => {
      setDepartments(dList);
      setCourses(cList);
      setKlevels(kList);
      setTypes(tList);
      setMarksList(mList);
    });
  }, []);

  // Cascading update for courses when department changes
  useEffect(() => {
    if (selectedDeptId) {
      MasterDataService.getCourses(selectedDeptId).then(setCourses);
    } else {
      MasterDataService.getCourses().then(setCourses);
    }
  }, [selectedDeptId]);

  // Cascading update for modules & COs when course changes
  useEffect(() => {
    if (selectedCourseId) {
      MasterDataService.getModules(selectedCourseId).then(setModules);
      MasterDataService.getCourseOutcomes(selectedCourseId).then(setCos);
    } else {
      setModules([]);
      setCos([]);
    }
  }, [selectedCourseId]);

  // Load questions based on active filters
  const loadQuestions = async () => {
    setLoading(true);
    const filter: QuestionFilter = {
      department_id: selectedDeptId || undefined,
      course_id: selectedCourseId || undefined,
      module_id: selectedModuleId || undefined,
      course_outcome_ids: selectedCOIds.length > 0 ? selectedCOIds : undefined,
      k_level_ids: selectedKLevelIds.length > 0 ? selectedKLevelIds : undefined,
      question_type_id: selectedTypeId || undefined,
      mark_value: selectedMark !== '' ? Number(selectedMark) : undefined,
      search_query: searchQuery || undefined
    };

    const data = await QuestionService.getQuestions(filter);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [
    selectedDeptId,
    selectedCourseId,
    selectedModuleId,
    selectedMark,
    selectedCOIds,
    selectedKLevelIds,
    selectedTypeId,
    searchQuery
  ]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await QuestionService.deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleResetFilters = () => {
    setSelectedDeptId('');
    setSelectedCourseId('');
    setSelectedModuleId('');
    setSelectedMark('');
    setSelectedCOIds([]);
    setSelectedKLevelIds([]);
    setSelectedTypeId('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-brand-600" />
            Question Bank Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, and manage structured questions mapped with COs and K-levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/question-bank/import">
            <Button variant="outline">
              <FileUp className="w-4 h-4" />
              <span>Bulk Import (CSV/Excel)</span>
            </Button>
          </Link>

          <Link href="/question-bank/add">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Header Component */}
      <QuestionStats courseId={selectedCourseId || undefined} />

      {/* Multi-faceted Search & Cascading Filter Drawer */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Multi-Faceted Filter Drawer
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Available Matching Questions: {questions.length}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-800 font-medium underline"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Search Query */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by keywords, CO, or K-level..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Cascading Filter Bar Order: Department -> Course -> Module -> Marks -> CO -> K-Level -> Question Type */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Department</label>
            <select
              value={selectedDeptId}
              onChange={e => setSelectedDeptId(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Depts</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.code}</option>
              ))}
            </select>
          </div>

          {/* 2. Course */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Course</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          {/* 3. Module */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Module</label>
            <select
              value={selectedModuleId}
              onChange={e => setSelectedModuleId(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Modules</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>Mod {m.module_number}</option>
              ))}
            </select>
          </div>

          {/* 4. Marks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Marks</label>
            <select
              value={selectedMark}
              onChange={e => setSelectedMark(e.target.value !== '' ? Number(e.target.value) : '')}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Marks</option>
              {marksList.map(m => (
                <option key={m.id} value={m.mark_value}>{m.mark_value} Mark{m.mark_value > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* 5. CO (Multi-Select) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Course Outcomes (Multi-Select COs)
            </label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-50 border border-slate-300 rounded-lg min-h-[34px] items-center">
              <button
                type="button"
                onClick={() => setSelectedCOIds([])}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all ${
                  selectedCOIds.length === 0
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All COs
              </button>
              {cos.map(co => {
                const isSelected = selectedCOIds.includes(co.id);
                return (
                  <button
                    key={co.id}
                    type="button"
                    onClick={() => {
                      setSelectedCOIds(
                        isSelected ? selectedCOIds.filter(id => id !== co.id) : [...selectedCOIds, co.id]
                      );
                    }}
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {co.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. K-Level (Multi-Select) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              K-Levels (Multi-Select K1-K6)
            </label>
            <div className="flex flex-wrap gap-1 p-1 bg-slate-50 border border-slate-300 rounded-lg min-h-[34px] items-center">
              <button
                type="button"
                onClick={() => setSelectedKLevelIds([])}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all ${
                  selectedKLevelIds.length === 0
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All K-Levels
              </button>
              {klevels.map(k => {
                const isSelected = selectedKLevelIds.includes(k.id);
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => {
                      setSelectedKLevelIds(
                        isSelected ? selectedKLevelIds.filter(id => id !== k.id) : [...selectedKLevelIds, k.id]
                      );
                    }}
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {k.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Question Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Question Type</label>
            <select
              value={selectedTypeId}
              onChange={e => setSelectedTypeId(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Types</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.code}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Question Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium animate-pulse">Loading question bank...</div>
        ) : questions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No questions found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or creating a new question.</p>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
              Reset Filters
            </Button>
          </Card>
        ) : (
          questions.map((q, idx) => (
            <Card key={q.id} className="hover:border-slate-300 transition-all p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="primary" className="font-bold">
                      {q.mark_value} Mark{q.mark_value > 1 ? 's' : ''}
                    </Badge>
                    <Badge variant="warning" className="font-mono">
                      {q.course_outcome?.code || 'CO1'}
                    </Badge>
                    <Badge variant="info" className="font-mono">
                      {q.k_level?.code || 'K1'}
                    </Badge>
                    <Badge variant="neutral">
                      {q.question_type?.code || 'MCQ'}
                    </Badge>
                    {q.module && (
                      <span className="text-slate-500 font-medium">
                        Mod {q.module.module_number}: {q.module.title}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    <span className="text-slate-400 font-mono mr-2">{idx + 1}.</span>
                    {q.question_text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                  {q.options && q.options.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setViewQuestion(q)}>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Options ({q.options.length})</span>
                    </Button>
                  )}

                  <Link href={`/question-bank/edit/${q.id}`}>
                    <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MCQ Options Modal */}
      {viewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">MCQ Options View</h3>
              <button onClick={() => setViewQuestion(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-900">{viewQuestion.question_text}</p>

            <div className="space-y-2">
              {viewQuestion.options?.map(opt => (
                <div
                  key={opt.option_letter}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                    opt.is_correct
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold uppercase">
                      {opt.option_letter}
                    </span>
                    <span>{opt.option_text}</span>
                  </div>

                  {opt.is_correct && (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
