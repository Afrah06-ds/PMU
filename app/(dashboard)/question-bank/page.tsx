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
  Edit3,
  Eye,
  FileQuestion,
  FileUp,
  Filter,
  Layers3,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
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
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [allCourseQuestions, setAllCourseQuestions] = useState<Question[]>([]);
  const [questionSearchInput, setQuestionSearchInput] = useState('');
  const deferredQuestionSearch = useDeferredValue(questionSearchInput);
  const [selectedMarkFilter, setSelectedMarkFilter] = useState<number | ''>('');
  const [selectedKLevelFilter, setSelectedKLevelFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>();
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

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
        const defaultCourse = courseList.find((course) => course.code === 'CS8392') || courseList[0];
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
      mark_value: selectedMarkFilter !== '' ? Number(selectedMarkFilter) : undefined,
      search_query: deferredQuestionSearch || undefined,
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
  }, [selectedCourseId, selectedModuleId, selectedMarkFilter, selectedKLevelFilter, deferredQuestionSearch]);

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
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">Search and manage questions for the selected course.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/question-bank/import">
            <Button size="sm" variant="outline"><FileUp className="h-4 w-4" /> Bulk import</Button>
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

              <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={questionSearchInput}
                    onChange={(event) => setQuestionSearchInput(event.target.value)}
                    placeholder="Search the question library..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-medium outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"><Filter className="h-3.5 w-3.5" /> Filters</div>
                  <DropdownSelect value={selectedModuleId} onChange={setSelectedModuleId} options={[{ value: 'ALL', label: `All modules (${allCourseQuestions.length})` }, ...modules.map((module) => ({ value: module.id, label: `Module ${module.module_number} · ${getModuleQuestionCount(module.id)}` }))]} className="w-[190px] [&>button]:bg-white" />
                  <DropdownSelect value={selectedMarkFilter === '' ? '' : String(selectedMarkFilter)} onChange={(value) => setSelectedMarkFilter(value ? Number(value) : '')} options={[{ value: '', label: 'All marks' }, { value: '1', label: '1 mark' }, { value: '2', label: '2 marks' }, { value: '5', label: '5 marks' }, { value: '10', label: '10 marks' }, { value: '15', label: '15 marks' }, { value: '20', label: '20 marks' }]} className="w-[125px] [&>button]:bg-white" />
                  <DropdownSelect value={selectedKLevelFilter} onChange={setSelectedKLevelFilter} options={[{ value: '', label: 'All K-levels' }, ...klevels.map((level) => ({ value: level.code, label: `${level.code} · ${level.name}` }))]} className="w-[140px] [&>button]:bg-white" />
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button type="button" onClick={() => setSelectedModuleId('ALL')} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${selectedModuleId === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  <Layers3 className="h-3.5 w-3.5" /> All modules
                </button>
                {modules.map((module) => <button key={module.id} type="button" onClick={() => setSelectedModuleId(module.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${selectedModuleId === module.id ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  <span>Mod {module.module_number}</span><span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{getModuleQuestionCount(module.id)}</span>
                </button>)}
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
                    {visibleQuestions.map((question, index) => (
                      <div key={question.id} className="group grid gap-3 px-4 py-4 transition hover:bg-slate-50/70 md:grid-cols-[52px_minmax(0,1fr)_auto] md:items-center md:gap-4">
                        <span className="font-mono text-xs font-bold text-slate-300">{String((page - 1) * pageSize + index + 1).padStart(2, '0')}</span>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            <Badge variant="primary" className="text-[10px]">{question.mark_value} mark{question.mark_value > 1 ? 's' : ''}</Badge>
                            <Badge variant="warning" className="font-mono text-[10px]">{question.course_outcome?.code || 'CO1'}</Badge>
                            <Badge variant="info" className="font-mono text-[10px]">{question.k_level?.code || 'K1'}</Badge>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">{question.question_type?.code || (question.options?.length ? 'MCQ' : 'Subjective')}</span>
                          </div>
                          <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-800"><LatexContent content={question.question_text} /></p>
                          <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{question.module ? `Module ${question.module.module_number} · ${question.module.title}` : 'Unmapped module'}</p>
                        </div>
                        <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3 md:border-0 md:pt-0">
                          {question.options && question.options.length > 0 && <button type="button" onClick={() => setViewQuestion(question)} title={`View ${question.options.length} answer options`} className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"><Eye className="h-4 w-4" /></button>}
                          <button type="button" onClick={() => handleOpenEditForm(question.id)} title="Edit question" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><Edit3 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => setDeleteQuestionId(question.id)} title="Delete question" className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
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