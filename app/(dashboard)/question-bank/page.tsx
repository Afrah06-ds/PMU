'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Question, Department, Course, Module, CourseOutcome, KLevel } from '@/types';
import { QuestionService, QuestionFilter } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionForm } from '@/components/question-bank/question-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileQuestion,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  X,
  BookOpen,
  Building2,
  Boxes,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  FileUp,
  GraduationCap,
  Target,
  Layers,
  HelpCircle,
  Filter,
  Check
} from 'lucide-react';

export default function RefinedQuestionModulePage() {
  const [loading, setLoading] = useState(true);

  // Master data state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);

  // Filter selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('ALL');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');

  // Questions state & filters
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allCourseQuestions, setAllCourseQuestions] = useState<Question[]>([]);
  const [questionSearchQuery, setQuestionSearchQuery] = useState<string>('');
  const [selectedMarkFilter, setSelectedMarkFilter] = useState<number | ''>('');
  const [selectedKLevelFilter, setSelectedKLevelFilter] = useState<string>('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>(undefined);
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);

  // Load initial master data
  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getKLevels()
    ]).then(([dList, cList, kList]) => {
      setDepartments(dList);
      setCourses(cList);
      setKlevels(kList);

      if (cList.length > 0) {
        // Default to first course (CS8392 or first available)
        const defaultCourse = cList.find(c => c.code === 'CS8392') || cList[0];
        setSelectedCourseId(defaultCourse.id);
        if (defaultCourse.department_id) {
          setSelectedDeptId(defaultCourse.department_id);
        }
      }
      setLoading(false);
    });
  }, []);

  // Sync courses when department changes
  useEffect(() => {
    MasterDataService.getCourses(selectedDeptId || undefined).then(cList => {
      setCourses(cList);
      if (cList.length > 0 && (!selectedCourseId || !cList.some(c => c.id === selectedCourseId))) {
        setSelectedCourseId(cList[0].id);
      }
    });
  }, [selectedDeptId]);

  // Load modules & COs when selected course changes
  useEffect(() => {
    if (selectedCourseId) {
      MasterDataService.getModules(selectedCourseId).then(mList => {
        setModules(mList);
        setSelectedModuleId('ALL');
      });
      MasterDataService.getCourseOutcomes(selectedCourseId).then(setCos);
    } else {
      setModules([]);
      setCos([]);
    }
  }, [selectedCourseId]);

  // Fetch questions for active course & module
  const loadQuestions = async () => {
    if (!selectedCourseId) {
      setQuestions([]);
      setAllCourseQuestions([]);
      return;
    }
    setLoading(true);

    // Fetch all questions for course stats
    const allData = await QuestionService.getQuestions({ course_id: selectedCourseId });
    setAllCourseQuestions(allData);

    // Filtered query
    const filter: QuestionFilter = {
      course_id: selectedCourseId,
      module_id: selectedModuleId !== 'ALL' ? selectedModuleId : undefined,
      mark_value: selectedMarkFilter !== '' ? Number(selectedMarkFilter) : undefined,
      search_query: questionSearchQuery || undefined
    };
    let data = await QuestionService.getQuestions(filter);

    if (selectedKLevelFilter) {
      data = data.filter(q => q.k_level_id === selectedKLevelFilter || q.k_level?.code === selectedKLevelFilter);
    }

    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCourseId, selectedModuleId, selectedMarkFilter, selectedKLevelFilter, questionSearchQuery]);

  // Active Metadata
  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const selectedDepartment = useMemo(() => {
    if (selectedCourse?.department) return selectedCourse.department;
    return departments.find(d => d.id === (selectedCourse?.department_id || selectedDeptId));
  }, [departments, selectedCourse, selectedDeptId]);

  const selectedModule = useMemo(() => {
    if (selectedModuleId === 'ALL') return null;
    return modules.find(m => m.id === selectedModuleId);
  }, [modules, selectedModuleId]);

  // Filtered Courses List
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (selectedDeptId && c.department_id !== selectedDeptId) return false;
      if (courseSearchQuery) {
        const q = courseSearchQuery.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [courses, selectedDeptId, courseSearchQuery]);

  // Question Count per Module Helper
  const getModuleQuestionCount = (moduleId: string) => {
    if (moduleId === 'ALL') return allCourseQuestions.length;
    return allCourseQuestions.filter(q => q.module_id === moduleId).length;
  };

  // Action Handlers
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await QuestionService.deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleOpenAddForm = () => {
    setEditingQuestionId(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (id: string) => {
    setEditingQuestionId(id);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingQuestionId(undefined);
    loadQuestions();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingQuestionId(undefined);
  };

  return (
    <div className="space-y-6">
      {/* 1. Minimal Compact Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 px-4 py-3.5 sm:px-5 sm:py-4 text-white shadow-md border border-slate-800/80">
        {/* Ambient Radial Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-brand-500/20 text-brand-300 border-brand-400/30 text-[10px] py-0 px-2 font-medium">
                <Sparkles className="w-3 h-3 text-brand-400 mr-1" /> Syllabus Question Bank
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium">• PMIST EMS</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight font-poppins flex items-center gap-2 text-white">
              <FileQuestion className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Question Module & Bank Management</span>
            </h1>
            <p className="text-[11px] text-slate-300 leading-tight font-sans">
              Manage department syllabus questions module-wise mapped with COs & Bloom&apos;s Taxonomy.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/question-bank/import">
              <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium shadow-xs">
                <FileUp className="w-3 h-3 mr-1" />
                <span>Bulk Import</span>
              </Button>
            </Link>

            {selectedCourseId && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleOpenAddForm}
                className="h-7 px-3 text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-xs border border-brand-400/20"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Question</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Department & Course Selector Grid */}
      <Card className="p-6 space-y-5 border-slate-200 shadow-sm bg-white">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-brand-600" />
            1. Select Department & Course Catalog
          </div>
          {selectedDepartment && (
            <Badge variant="primary" className="font-semibold text-xs">
              {selectedDepartment.code} Department Selected
            </Badge>
          )}
        </div>

        {/* Department Pills / Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Academic Department
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDeptId('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                !selectedDeptId
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Departments</span>
            </button>

            {departments.map(d => {
              const isSelected = selectedDeptId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDeptId(d.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="font-mono font-extrabold">{d.code}</span>
                  <span className="font-normal text-[11px] opacity-90 hidden sm:inline">({d.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Search & Interactive Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Available Courses ({filteredCourses.length})
            </label>

            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search course code or title..."
                value={courseSearchQuery}
                onChange={e => setCourseSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Courses Quick Selector Cards Grid */}
          {filteredCourses.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No courses match your department or search query filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredCourses.map(c => {
                const isSelected = c.id === selectedCourseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">{c.code}</span>
                        <Badge variant="primary" className="text-[10px] py-0 px-1.5 font-sans">
                          Sem {c.semester}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{c.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {c.department?.code || 'CSE'} • AY {c.academic_year}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* 3. Selected Course & Module View */}
      {selectedCourse ? (
        <div className="space-y-6">
          {/* Active Course Overview Banner */}
          <Card className="p-5 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white border-none shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center font-bold text-xl text-white shrink-0 shadow-inner">
                  <BookOpen className="w-6 h-6 text-brand-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight font-mono text-brand-300">{selectedCourse.code}</span>
                    <span className="text-slate-400">•</span>
                    <h2 className="text-lg font-bold text-white">{selectedCourse.name}</h2>
                    {selectedDepartment && (
                      <Badge variant="neutral" className="bg-white/10 text-white border-white/20 text-xs">
                        {selectedDepartment.code}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Semester {selectedCourse.semester} • Academic Year {selectedCourse.academic_year} • {modules.length} Syllabus Modules Configured
                  </p>
                </div>
              </div>

              {/* Course Level Quick Metrics */}
              <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <div className="text-center px-3 border-r border-white/10">
                  <span className="text-lg font-extrabold text-white block leading-none">{allCourseQuestions.length}</span>
                  <span className="text-[10px] text-slate-300 font-semibold uppercase">Total Questions</span>
                </div>
                <div className="text-center px-3 border-r border-white/10">
                  <span className="text-lg font-extrabold text-brand-300 block leading-none">{modules.length}</span>
                  <span className="text-[10px] text-slate-300 font-semibold uppercase">Modules</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-lg font-extrabold text-indigo-300 block leading-none">{cos.length}</span>
                  <span className="text-[10px] text-slate-300 font-semibold uppercase">Course Outcomes</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Module-Wise Filter & Content Section */}
          <Card className="p-6 space-y-6 border-slate-200 shadow-sm bg-white">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
                <Boxes className="w-4 h-4 text-brand-600" />
                2. Module-Wise Question Selector
              </div>
              <Badge variant="info" className="text-xs font-bold self-start sm:self-auto">
                Questions Available: {questions.length}
              </Badge>
            </div>

            {/* Interactive Module Tabs Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Select Syllabus Module
              </label>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedModuleId('ALL')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    selectedModuleId === 'ALL'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>All Modules ({allCourseQuestions.length})</span>
                </button>

                {modules.map(mod => {
                  const isSelected = selectedModuleId === mod.id;
                  const count = getModuleQuestionCount(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[11px]">
                        Mod {mod.module_number}
                      </span>
                      <span className="truncate max-w-[130px] font-semibold">{mod.title}</span>
                      <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-white text-brand-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Module Details Card */}
            {selectedModule ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-brand-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="font-mono text-xs">
                      Module {selectedModule.module_number}
                    </Badge>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedModule.title}</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddForm}
                    className="bg-white text-brand-700 border-brand-300 hover:bg-brand-50 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Question to Module {selectedModule.module_number}</span>
                  </Button>
                </div>
                {selectedModule.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Syllabus Coverage: </span>
                    {selectedModule.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Viewing questions across <strong>All 5 Syllabus Modules</strong></span>
                <span className="font-semibold text-brand-600">{allCourseQuestions.length} Total Questions</span>
              </div>
            )}

            {/* Question Filter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {/* Question Text Search */}
              <div className="relative sm:col-span-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by question text..."
                  value={questionSearchQuery}
                  onChange={e => setQuestionSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Mark Filter */}
              <div>
                <select
                  value={selectedMarkFilter}
                  onChange={e => setSelectedMarkFilter(e.target.value !== '' ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">All Marks Weightage</option>
                  <option value="1">1 Mark (MCQ)</option>
                  <option value="2">2 Marks (Short Answer)</option>
                  <option value="5">5 Marks</option>
                  <option value="10">10 Marks</option>
                  <option value="15">15 Marks (Long Answer)</option>
                  <option value="20">20 Marks (Comprehensive)</option>
                </select>
              </div>

              {/* K-Level Filter */}
              <div>
                <select
                  value={selectedKLevelFilter}
                  onChange={e => setSelectedKLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">All K-Levels (Bloom Taxonomy)</option>
                  {klevels.map(k => (
                    <option key={k.id} value={k.code}>
                      {k.code} - {k.name} {k.description ? `(${k.description.slice(0, 30)}...)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 pt-2">
              {loading ? (
                <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
                  Loading module questions...
                </div>
              ) : questions.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No questions found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {selectedModule
                      ? `No questions added under Module ${selectedModule.module_number} yet.`
                      : 'No questions match the applied filters.'}
                  </p>
                  <Button variant="primary" size="sm" onClick={handleOpenAddForm}>
                    <Plus className="w-4 h-4 mr-1" />
                    <span>Add First Question</span>
                  </Button>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 transition-all bg-white hover:shadow-xs space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Badges Row */}
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
                          <Badge variant="neutral" className="uppercase font-semibold">
                            {q.question_type?.code || (q.options?.length ? 'MCQ' : 'SUBJECTIVE')}
                          </Badge>
                          {q.module && (
                            <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              Mod {q.module.module_number}: {q.module.title}
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          <span className="text-slate-400 font-mono mr-2">{idx + 1}.</span>
                          {q.question_text}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                        {q.options && q.options.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewQuestion(q)}
                            className="text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>Options ({q.options.length})</span>
                          </Button>
                        )}

                        <button
                          onClick={() => handleOpenEditForm(q.id)}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Course Selected</h3>
          <p className="text-xs text-slate-500">
            Please select a department and course above to view syllabus questions module-wise.
          </p>
        </Card>
      )}

      {/* 4. Add / Edit Question Modal */}
      {isFormOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                </h3>
                <p className="text-xs text-slate-500">
                  Course: <span className="font-bold text-slate-800">{selectedCourse.code} - {selectedCourse.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFormCancel}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <QuestionForm
              editId={editingQuestionId}
              initialCourseId={selectedCourse.id}
              initialDepartmentId={selectedCourse.department_id}
              initialModuleId={selectedModuleId !== 'ALL' ? selectedModuleId : undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* 5. MCQ Options Viewer Modal */}
      {viewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">MCQ Answer Options</h3>
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
