'use client';

import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Question, Department, Course, Module, CourseOutcome, KLevel } from '@/types';
import { QuestionService, QuestionFilter } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionForm } from '@/components/question-bank/question-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Modal } from '@/components/ui/modal';
import { LatexContent } from '@/components/ui/latex-content';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Dices,
  Edit3,
  Eye,
  FileQuestion,
  FileUp,
  Filter,
  Layers3,
  Plus,
  Printer,
  RotateCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from 'lucide-react';

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function QuestionLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');
  const [selectedSectionTab, setSelectedSectionTab] = useState<'ALL' | 'SECTION_A' | 'SECTION_B' | 'SECTION_C'>('ALL');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [allCourseQuestions, setAllCourseQuestions] = useState<Question[]>([]);
  const [questionSearchInput, setQuestionSearchInput] = useState('');
  const deferredQuestionSearch = useDeferredValue(questionSearchInput);
  const [selectedKLevelFilter, setSelectedKLevelFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>();
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  // Random Question Generator Modal State
  const [isRandomGeneratorOpen, setIsRandomGeneratorOpen] = useState(false);
  const [genDeptId, setGenDeptId] = useState('');
  const [genCourseId, setGenCourseId] = useState('');
  const [genModuleId, setGenModuleId] = useState('ALL');
  const [genSection, setGenSection] = useState<'ALL' | 'SECTION_A' | 'SECTION_B' | 'SECTION_C'>('ALL');
  const [genCOs, setGenCOs] = useState<string[]>([]);
  const [genMark, setGenMark] = useState<string>('');
  const [genKLevels, setGenKLevels] = useState<string[]>([]);
  const [genCount, setGenCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getKLevels(),
    ]).then(([departmentList, courseList, kLevelList]) => {
      setDepartments(departmentList);
      setCourses(courseList);
      setKlevels(kLevelList);

      if (courseList.length > 0) {
        const defaultCourse =
          courseList.find((course) => course.code === 'XDS601') ||
          courseList.find((course) => course.code === 'CS8392') ||
          courseList[0];
        setSelectedCourseId(defaultCourse.id);
        setSelectedDeptId(defaultCourse.department_id || '');
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    MasterDataService.getCourses(selectedDeptId || undefined).then((courseList) => {
      setCourses(courseList);
      if (courseList.length > 0 && !courseList.some((course) => course.id === selectedCourseId)) {
        setSelectedCourseId(courseList[0].id);
      }
    });
  }, [selectedDeptId]);

  useEffect(() => {
    if (!selectedCourseId) {
      setModules([]);
      setCos([]);
      return;
    }

    MasterDataService.getModules(selectedCourseId).then((moduleList) => {
      setModules(moduleList);
      setSelectedModuleId('ALL');
    });
    MasterDataService.getCourseOutcomes(selectedCourseId).then(setCos);
  }, [selectedCourseId]);

  const loadQuestions = async () => {
    if (!selectedCourseId) {
      setQuestions([]);
      setAllCourseQuestions([]);
      return;
    }

    setLoading(true);
    const allData = await QuestionService.getQuestions({ course_id: selectedCourseId });
    setAllCourseQuestions(allData);

    const filter: QuestionFilter = {
      course_id: selectedCourseId,
      module_id: selectedModuleId !== 'ALL' ? selectedModuleId : undefined,
      search_query: deferredQuestionSearch || undefined,
      section_type: selectedSectionTab !== 'ALL' ? selectedSectionTab : undefined,
    };
    let filteredData = await QuestionService.getQuestions(filter);

    if (selectedKLevelFilter) {
      filteredData = filteredData.filter(
        (question) => question.k_level_id === selectedKLevelFilter || question.k_level?.code === selectedKLevelFilter,
      );
    }

    setQuestions(filteredData);
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCourseId, selectedModuleId, selectedKLevelFilter, deferredQuestionSearch, selectedSectionTab]);

  const countSecA = useMemo(
    () => allCourseQuestions.filter((q) => q.section_type === 'SECTION_A' || q.mark_value === 1).length,
    [allCourseQuestions]
  );
  const countSecB = useMemo(
    () => allCourseQuestions.filter((q) => q.section_type === 'SECTION_B' || q.mark_value === 2).length,
    [allCourseQuestions]
  );
  const countSecC = useMemo(
    () => allCourseQuestions.filter((q) => q.section_type === 'SECTION_C' || q.mark_value >= 5).length,
    [allCourseQuestions]
  );

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const selectedDepartment = useMemo(
    () => selectedCourse?.department || departments.find((department) => department.id === selectedDeptId),
    [departments, selectedCourse, selectedDeptId],
  );

  const selectedModule = useMemo(
    () => selectedModuleId === 'ALL' ? null : modules.find((module) => module.id === selectedModuleId),
    [modules, selectedModuleId],
  );

  const filteredCourses = useMemo(() => {
    const query = courseSearchQuery.toLowerCase().trim();
    return courses.filter((course) => {
      if (query && !course.code.toLowerCase().includes(query) && !course.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [courses, courseSearchQuery]);

  const pageCount = Math.max(1, Math.ceil(questions.length / pageSize));
  const visibleQuestions = useMemo(
    () => questions.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, questions],
  );
  const firstVisible = questions.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastVisible = Math.min(page * pageSize, questions.length);

  const getModuleQuestionCount = (moduleId: string) => {
    if (moduleId === 'ALL') return allCourseQuestions.length;
    return allCourseQuestions.filter((question) => question.module_id === moduleId).length;
  };

  // Random Question Generator Logic
  const matchingPoolCount = useMemo(() => {
    let pool = allCourseQuestions;
    if (genModuleId !== 'ALL') {
      pool = pool.filter((q) => q.module_id === genModuleId);
    }
    if (genSection !== 'ALL') {
      pool = pool.filter((q) => q.section_type === genSection);
    }
    if (genMark !== '') {
      pool = pool.filter((q) => Number(q.mark_value) === Number(genMark));
    }
    if (genCOs.length > 0) {
      pool = pool.filter(
        (q) =>
          genCOs.includes(q.course_outcome?.code || '') ||
          genCOs.includes(q.course_outcome_id || '')
      );
    }
    if (genKLevels.length > 0) {
      pool = pool.filter(
        (q) =>
          genKLevels.includes(q.k_level?.code || '') ||
          genKLevels.includes(q.k_level_id || '')
      );
    }
    return pool.length;
  }, [allCourseQuestions, genModuleId, genSection, genMark, genCOs, genKLevels]);

  const handleGenerateRandomQuestions = async () => {
    const targetCourse = genCourseId || selectedCourseId;
    if (!targetCourse) return;

    let pool = allCourseQuestions;
    if (genCourseId && genCourseId !== selectedCourseId) {
      pool = await QuestionService.getQuestions({ course_id: genCourseId });
    }

    let filtered = pool;
    if (genModuleId !== 'ALL') {
      filtered = filtered.filter((q) => q.module_id === genModuleId);
    }
    if (genSection !== 'ALL') {
      filtered = filtered.filter((q) => q.section_type === genSection);
    }
    if (genMark !== '') {
      filtered = filtered.filter((q) => Number(q.mark_value) === Number(genMark));
    }
    if (genCOs.length > 0) {
      filtered = filtered.filter(
        (q) =>
          genCOs.includes(q.course_outcome?.code || '') ||
          genCOs.includes(q.course_outcome_id || '')
      );
    }
    if (genKLevels.length > 0) {
      filtered = filtered.filter(
        (q) =>
          genKLevels.includes(q.k_level?.code || '') ||
          genKLevels.includes(q.k_level_id || '')
      );
    }

    // Shuffle using Fisher-Yates
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setGeneratedQuestions(shuffled.slice(0, genCount));
    setHasGenerated(true);
  };

  const handleCopyGeneratedQuestions = () => {
    if (generatedQuestions.length === 0) return;
    const text = generatedQuestions
      .map((q, idx) => {
        let block = `${idx + 1}. [${q.mark_value}M | ${q.course_outcome?.code || 'CO1'} | ${q.k_level?.code || 'K1'}] ${q.question_text}`;
        if (q.options && q.options.length > 0) {
          block += '\n' + q.options.map((o) => `   (${o.option_letter}) ${o.option_text}${o.is_correct ? ' [CORRECT]' : ''}`).join('\n');
          if (q.key_answer) block += `\n   Key Answer: ${q.key_answer}`;
        } else if (q.key_answer) {
          block += `\n   Key Answer: ${q.key_answer}`;
        } else if (q.evaluation_scheme) {
          block += `\n   Evaluation Scheme:\n   ${q.evaluation_scheme.replace(/\n/g, '\n   ')}`;
        }
        return block;
      })
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleDelete = async () => {
    if (!deleteQuestionId) return;
    await QuestionService.deleteQuestion(deleteQuestionId);
    setDeleteQuestionId(null);
    loadQuestions();
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
    <div className="space-y-4 pb-8">
      <header className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
            <FileQuestion className="h-3.5 w-3.5" />
            Question library
          </div>
          <h1 className="font-poppins text-2xl font-bold tracking-tight text-slate-950">Question library</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">Search, manage, and draw random questions for the selected course.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setGenDeptId(selectedDeptId);
              setGenCourseId(selectedCourseId);
              setGenModuleId('ALL');
              setGenSection('ALL');
              setGenCOs([]);
              setGenMark('');
              setGenKLevels([]);
              setGenCount(5);
              setHasGenerated(false);
              setGeneratedQuestions([]);
              setIsRandomGeneratorOpen(true);
            }}
            disabled={!selectedCourse}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <WandSparkles className="h-4 w-4" />
            <span>Generate Random Questions</span>
          </Button>
          <Link href="/question-bank/import">
            <Button size="sm" variant="outline"><FileUp className="h-4 w-4" /> Import PDF</Button>
          </Link>
          <Button size="sm" onClick={handleOpenAddForm} disabled={!selectedCourseId}><Plus className="h-4 w-4" /> Add question</Button>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Library context</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">Choose a course to work inside</p>
          </div>
          {selectedDepartment && <Badge variant="info">{selectedDepartment.code} department</Badge>}
        </div>

        <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr_1.6fr]">
          <DropdownSelect
            label="Department"
            value={selectedDeptId}
            onChange={setSelectedDeptId}
            options={[{ value: '', label: 'All departments' }, ...departments.map((department) => ({ value: department.id, label: `${department.code} · ${department.name}` }))]}
          />

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Find a course</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={courseSearchQuery}
                onChange={(event) => setCourseSearchQuery(event.target.value)}
                placeholder="Search code or course title"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </label>

          <DropdownSelect
            label="Active course"
            value={selectedCourseId}
            onChange={setSelectedCourseId}
            options={filteredCourses.map((course) => ({ value: course.id, label: `${course.code} · ${course.name}` }))}
            placeholder="No matching course"
            className="[&>button]:border-indigo-200 [&>button]:bg-indigo-50/50 [&>button]:text-indigo-800"
          />
        </div>
      </section>

      {selectedCourse ? (
        <>
          <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">In course</p>
              <p className="text-xl font-bold tracking-tight text-slate-900">{allCourseQuestions.length}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-500">Current view</p>
              <p className="text-xl font-bold tracking-tight text-indigo-700">{questions.length}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Structure</p>
              <p className="text-xl font-bold tracking-tight text-slate-900">{modules.length}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Mapping</p>
              <p className="text-xl font-bold tracking-tight text-slate-900">{cos.length}</p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <h2 className="font-poppins text-base font-bold text-slate-900">{selectedCourse.code} question set</h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{selectedCourse.name} · Semester {selectedCourse.semester} · {selectedCourse.academic_year}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Showing {firstVisible}-{lastVisible} of {questions.length}</span>
                  <DropdownSelect value={String(pageSize)} onChange={(value) => { setPageSize(Number(value)); setPage(1); }} options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: `${size} / page` }))} className="w-[92px] [&>button]:h-8 [&>button]:rounded-lg [&>button]:bg-slate-50 [&>button]:px-2 [&>button]:text-xs" />
                </div>
              </div>

              {/* Unified Clean Single Selection Toolbar */}
              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Bar */}
                <div className="relative min-w-0 flex-1 max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={questionSearchInput}
                    onChange={(event) => setQuestionSearchInput(event.target.value)}
                    placeholder="Search the question library..."
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Filter Controls: Single Module Dropdown + Single Section Selector */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Single Section Selector Field */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSectionTab('ALL')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedSectionTab === 'ALL'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>All Sections</span>
                      <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700">
                        {allCourseQuestions.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSectionTab('SECTION_A')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedSectionTab === 'SECTION_A'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      <span>Sec A · 1M</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedSectionTab === 'SECTION_A' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {countSecA}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSectionTab('SECTION_B')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedSectionTab === 'SECTION_B'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-indigo-700'
                      }`}
                    >
                      <span>Sec B · 2M</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedSectionTab === 'SECTION_B' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {countSecB}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSectionTab('SECTION_C')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedSectionTab === 'SECTION_C'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-purple-700'
                      }`}
                    >
                      <span>Sec C · Descriptive</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedSectionTab === 'SECTION_C' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {countSecC}
                      </span>
                    </button>
                  </div>

                  {/* Single Module Select Dropdown */}
                  <DropdownSelect
                    value={selectedModuleId}
                    onChange={setSelectedModuleId}
                    options={[
                      { value: 'ALL', label: `All modules (${allCourseQuestions.length})` },
                      ...modules.map((module) => ({
                        value: module.id,
                        label: `Module ${module.module_number} (${getModuleQuestionCount(module.id)})`
                      }))
                    ]}
                    className="w-[170px] [&>button]:h-8 [&>button]:text-xs [&>button]:bg-white"
                  />
                </div>
              </div>
            </div>

            {selectedModule && <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-xs sm:mx-5"><div><span className="font-bold text-indigo-700">Module {selectedModule.module_number} · {selectedModule.title}</span>{selectedModule.description && <span className="ml-2 hidden text-slate-500 md:inline">{selectedModule.description}</span>}</div><button type="button" onClick={handleOpenAddForm} className="shrink-0 font-bold text-indigo-600 hover:text-indigo-800">Add here +</button></div>}

            <div className="p-4 sm:p-5">
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-16 text-sm font-medium text-slate-400"><span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />Loading question library...</div>
              ) : visibleQuestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center"><FileQuestion className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 text-sm font-bold text-slate-800">No questions match this view</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">Try clearing a filter or add the first question for this course.</p><Button variant="primary" size="sm" className="mt-5" onClick={handleOpenAddForm}><Plus className="h-4 w-4" /> Add question</Button></div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="hidden grid-cols-[52px_minmax(0,1fr)_auto] gap-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:grid"><span>#</span><span>Question and mapping</span><span>Actions</span></div>
                  <div className="divide-y divide-slate-100">
                    {visibleQuestions.map((question, index) => {
                      const isSecA = question.section_type === 'SECTION_A' || question.mark_value === 1 || (question.options && question.options.length > 0);
                      const isSecB = question.section_type === 'SECTION_B' || question.mark_value === 2;
                      const isSecC = question.section_type === 'SECTION_C' || question.mark_value >= 5;

                      return (
                        <div key={question.id} className="group grid gap-3 px-4 py-4 transition hover:bg-slate-50/70 md:grid-cols-[52px_minmax(0,1fr)_auto] md:items-start md:gap-4">
                          <span className="font-mono text-xs font-bold text-slate-400 pt-1">
                            {question.q_no ? `Q.${question.q_no}` : String((page - 1) * pageSize + index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant="primary" className="text-[10px] font-bold">{question.mark_value} M</Badge>
                              <Badge variant="warning" className="font-mono text-[10px] font-bold">{question.course_outcome?.code || 'CO1'}</Badge>
                              <Badge variant="info" className="font-mono text-[10px] font-bold">{question.k_level?.code || 'K1'}</Badge>
                              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                isSecA ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
                                isSecB ? 'border-indigo-200 bg-indigo-50 text-indigo-800' :
                                'border-purple-200 bg-purple-50 text-purple-800'
                              }`}>
                                {isSecA ? 'Sec A · Objective' : isSecB ? 'Sec B · Short' : 'Sec C · Descriptive'}
                              </span>
                              {question.key_answer && isSecA && (
                                <span className="rounded border border-emerald-300 bg-emerald-100 text-emerald-900 px-1.5 py-0.5 text-[10px] font-bold">
                                  Key: {question.key_answer}
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-semibold leading-6 text-slate-900">
                              <LatexContent content={question.question_text} />
                            </p>

                            {/* Section A MCQ Options */}
                            {question.options && question.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                {question.options.map((opt) => (
                                  <div
                                    key={opt.option_letter}
                                    className={`flex items-start gap-2 p-2 rounded-lg text-xs border ${
                                      opt.is_correct
                                        ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950 font-semibold'
                                        : 'border-slate-200 bg-slate-50/60 text-slate-700'
                                    }`}
                                  >
                                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase ${
                                      opt.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {opt.option_letter}
                                    </span>
                                    <span className="leading-snug">
                                      <LatexContent content={opt.option_text} />
                                    </span>
                                    {opt.is_correct && <Check className="h-3.5 w-3.5 ml-auto text-emerald-600 shrink-0" />}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Section B Key Answer Box */}
                            {isSecB && question.key_answer && (
                              <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-slate-700 leading-relaxed">
                                <span className="font-bold text-slate-900 mr-1.5">Key Answer:</span>
                                <LatexContent content={question.key_answer} />
                              </div>
                            )}

                            {/* Section C Evaluation Scheme Box */}
                            {isSecC && question.evaluation_scheme && (
                              <div className="text-xs bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-amber-950 whitespace-pre-line leading-relaxed font-sans">
                                <span className="font-bold text-[10px] text-amber-800 uppercase block mb-1">
                                  Evaluation Scheme & Rubric:
                                </span>
                                <LatexContent content={question.evaluation_scheme} />
                              </div>
                            )}

                            <p className="truncate text-[11px] font-medium text-slate-400">
                              {question.module ? `Module ${question.module.module_number} · ${question.module.title}` : (question.unit_name ? `Unit: ${question.unit_name}` : 'Unmapped module')}
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3 md:border-0 md:pt-0">
                            {question.options && question.options.length > 0 && <button type="button" onClick={() => setViewQuestion(question)} title={`View ${question.options.length} answer options`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button>}
                            <button type="button" onClick={() => handleOpenEditForm(question.id)} title="Edit question" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Edit3 className="h-4 w-4" /></button>
                            <button type="button" onClick={() => setDeleteQuestionId(question.id)} title="Delete question" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {questions.length > 0 && <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-medium text-slate-400">Page {page} of {pageCount}</p><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /> Previous</button><button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight className="h-3.5 w-3.5" /></button></div></div>}
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center"><BookOpen className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 text-sm font-bold text-slate-800">Choose a course to begin</h3><p className="mt-2 text-xs text-slate-500">Your course question library will appear here.</p></div>
      )}

      {isFormOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-8 max-h-[90vh] w-full max-w-4xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3"><div><h3 className="font-bold text-slate-900">{editingQuestionId ? 'Edit question' : 'Add question'}</h3><p className="mt-1 text-xs text-slate-500">{selectedCourse.code} · {selectedCourse.name}</p></div><button type="button" onClick={handleFormCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div>
            <QuestionForm editId={editingQuestionId} initialCourseId={selectedCourse.id} initialDepartmentId={selectedCourse.department_id} initialModuleId={selectedModuleId !== 'ALL' ? selectedModuleId : undefined} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </div>
        </div>
      )}

      {/* Random Question Generator Modal */}
      {isRandomGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="my-8 max-h-[92vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <WandSparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Random Question Generator</span>
                    <Badge variant="primary" className="text-[10px] py-0 px-2">Question Bank</Badge>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filter by department, course, module, sections, COs, marks, and K-levels to draw random questions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRandomGeneratorOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!hasGenerated ? (
              /* Filter & Criteria Setup Screen */
              <div className="space-y-4">
                {/* 1. Academic Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  <DropdownSelect
                    label="Department"
                    value={genDeptId || selectedDeptId}
                    onChange={(val) => {
                      setGenDeptId(val);
                      const courseInDept = courses.find((c) => c.department_id === val);
                      if (courseInDept) setGenCourseId(courseInDept.id);
                    }}
                    options={[
                      { value: '', label: 'All Departments' },
                      ...departments.map((d) => ({ value: d.id, label: `${d.code} · ${d.name}` }))
                    ]}
                    className="[&>button]:bg-white"
                  />

                  <DropdownSelect
                    label="Course"
                    value={genCourseId || selectedCourseId}
                    onChange={(val) => setGenCourseId(val)}
                    options={courses
                      .filter((c) => !genDeptId || c.department_id === genDeptId)
                      .map((c) => ({
                        value: c.id,
                        label: `${c.code} · ${c.name}`
                      }))}
                    className="[&>button]:bg-white"
                  />
                </div>

                {/* 2. Module & Section Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DropdownSelect
                    label="Module / Unit"
                    value={genModuleId}
                    onChange={setGenModuleId}
                    options={[
                      { value: 'ALL', label: 'All Modules (Entire Syllabus)' },
                      ...modules.map((m) => ({
                        value: m.id,
                        label: `Module ${m.module_number} · ${m.title}`
                      }))
                    ]}
                    className="[&>button]:bg-white"
                  />

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Question Bank Section
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGenSection('ALL')}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition ${
                          genSection === 'ALL'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All Sections
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenSection('SECTION_A')}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition ${
                          genSection === 'SECTION_A'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-emerald-800 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        Sec A (1M Objective)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenSection('SECTION_B')}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition ${
                          genSection === 'SECTION_B'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-indigo-800 border-slate-200 hover:bg-indigo-50'
                        }`}
                      >
                        Sec B (2M Short)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenSection('SECTION_C')}
                        className={`px-2.5 py-2 rounded-lg text-xs font-bold border transition ${
                          genSection === 'SECTION_C'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-purple-800 border-slate-200 hover:bg-purple-50'
                        }`}
                      >
                        Sec C (15M / 20M)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Marks & Count Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Filter by Specific Mark
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['', '1', '2', '15', '20'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setGenMark(m)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            genMark === m
                              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {m === '' ? 'All Marks' : `${m} Mark${Number(m) > 1 ? 's' : ''}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Number of Questions to Draw Randomly
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={genCount}
                        onChange={(e) => setGenCount(Math.max(1, Number(e.target.value)))}
                        className="h-9 w-24 rounded-lg border border-slate-300 px-3 text-center text-sm font-bold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">questions</span>
                      <div className="flex items-center gap-1 ml-auto">
                        {[3, 5, 10, 15].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setGenCount(n)}
                            className={`px-2 py-1 text-xs rounded font-bold border transition ${
                              genCount === n
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Course Outcomes (COs) Multi-Select */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Course Outcomes (COs)
                    </label>
                    <span className="text-[10px] text-slate-400">Click to toggle CO filter</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGenCOs([])}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                        genCOs.length === 0
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      All COs
                    </button>
                    {['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'].map((co) => {
                      const isSelected = genCOs.includes(co);
                      return (
                        <button
                          key={co}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setGenCOs(genCOs.filter((c) => c !== co));
                            } else {
                              setGenCOs([...genCOs, co]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border transition ${
                            isSelected
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-white text-amber-900 border-slate-200 hover:bg-amber-50'
                          }`}
                        >
                          {co}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. K-Levels / Bloom's Multi-Select */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Bloom&apos;s Taxonomy (K-Levels)
                    </label>
                    <span className="text-[10px] text-slate-400">Click to toggle K-level</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGenKLevels([])}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                        genKLevels.length === 0
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      All K-Levels
                    </button>
                    {['K1', 'K2', 'K3', 'K4', 'K5', 'K6'].map((k) => {
                      const isSelected = genKLevels.includes(k);
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setGenKLevels(genKLevels.filter((lvl) => lvl !== k));
                            } else {
                              setGenKLevels([...genKLevels, k]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-indigo-900 border-slate-200 hover:bg-indigo-50'
                          }`}
                        >
                          {k}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Availability Bar */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dices className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-950">
                      <strong>{matchingPoolCount} questions</strong> match your criteria in the question bank.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={matchingPoolCount === 0}
                    onClick={handleGenerateRandomQuestions}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-600/20"
                  >
                    <WandSparkles className="w-4 h-4 mr-1.5" />
                    <span>Draw {Math.min(genCount, matchingPoolCount)} Random Questions</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Generated Questions Result Screen */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        {generatedQuestions.length} Questions Drawn Randomly
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        Selected randomly according to your specified criteria.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleGenerateRandomQuestions}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Re-shuffle</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyGeneratedQuestions}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs cursor-pointer"
                    >
                      {copiedToast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToast ? 'Copied!' : 'Copy All'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasGenerated(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition"
                    >
                      Change Filters
                    </button>
                  </div>
                </div>

                {/* List of Randomly Drawn Questions */}
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {generatedQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <Badge variant="primary" className="text-[10px] font-bold">{q.mark_value} Mark{q.mark_value > 1 ? 's' : ''}</Badge>
                          <Badge variant="warning" className="font-mono text-[10px] font-bold">{q.course_outcome?.code || 'CO1'}</Badge>
                          <Badge variant="info" className="font-mono text-[10px] font-bold">{q.k_level?.code || 'K1'}</Badge>
                          <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                            {q.section_type || (q.options?.length ? 'SECTION_A' : 'SECTION_B')}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-semibold leading-relaxed text-slate-900">
                        <LatexContent content={q.question_text} />
                      </p>

                      {/* Options for MCQ */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt) => (
                            <div
                              key={opt.option_letter}
                              className={`flex items-start gap-2 p-2 rounded-lg text-xs border ${
                                opt.is_correct
                                  ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950 font-semibold'
                                  : 'border-slate-200 bg-slate-50/60 text-slate-700'
                              }`}
                            >
                              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase ${
                                opt.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt.option_letter}
                              </span>
                              <span className="leading-snug">
                                <LatexContent content={opt.option_text} />
                              </span>
                              {opt.is_correct && <Check className="h-3.5 w-3.5 ml-auto text-emerald-600 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Answer */}
                      {q.key_answer && (
                        <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 mr-1.5">Key Answer:</span>
                          <LatexContent content={q.key_answer} />
                        </div>
                      )}

                      {/* Evaluation Scheme */}
                      {q.evaluation_scheme && (
                        <div className="text-xs bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-amber-950 whitespace-pre-line leading-relaxed font-sans">
                          <span className="font-bold text-[10px] text-amber-800 uppercase block mb-0.5">
                            Evaluation Scheme / Rubric:
                          </span>
                          <LatexContent content={q.evaluation_scheme} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {viewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 pb-3"><h3 className="font-bold text-slate-900">Answer options</h3><button type="button" onClick={() => setViewQuestion(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></div><p className="text-sm font-semibold leading-6 text-slate-900"><LatexContent content={viewQuestion.question_text} /></p><div className="space-y-2">{viewQuestion.options?.map((option) => <div key={option.option_letter} className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-xs ${option.is_correct ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><div className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-bold uppercase text-slate-700">{option.option_letter}</span><span><LatexContent content={option.option_text} /></span></div>{option.is_correct && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}</div>)}</div></div>
        </div>
      )}

      <Modal
        open={Boolean(deleteQuestionId)}
        onClose={() => setDeleteQuestionId(null)}
        title="Delete this question?"
        description="This removes the question from the library and local cache. This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteQuestionId(null)}>Keep question</Button>
          <Button type="button" variant="danger" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Delete question</Button>
        </div>
      </Modal>
    </div>
  );
}