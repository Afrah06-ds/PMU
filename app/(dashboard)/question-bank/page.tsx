'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Question, Department, Course, Module, CourseOutcome, KLevel, QuestionType, Mark } from '@/types';
import { QuestionService, QuestionFilter } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionForm } from '@/components/question-bank/question-form';
import { QuestionStats } from '@/components/question-bank/question-stats';
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
  ArrowLeft
} from 'lucide-react';

export default function SingleQuestionModulePage() {
  const [loading, setLoading] = useState(true);

  // Master lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);

  // Selection states
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('ALL'); // 'ALL' or specific module.id
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSearchQuery, setQuestionSearchQuery] = useState<string>('');
  const [selectedMarkFilter, setSelectedMarkFilter] = useState<number | ''>('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | undefined>(undefined);
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);

  // Load Initial Master Data
  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getKLevels()
    ]).then(([dList, cList, kList]) => {
      setDepartments(dList);
      setCourses(cList);
      setKlevels(kList);
      
      // Auto-select first course if available
      if (cList.length > 0) {
        setSelectedCourseId(cList[0].id);
        if (cList[0].department_id) {
          setSelectedDeptId(cList[0].department_id);
        }
      }
      setLoading(false);
    });
  }, []);

  // Update available courses when department changes
  useEffect(() => {
    MasterDataService.getCourses(selectedDeptId || undefined).then(cList => {
      setCourses(cList);
      // If active course is not in new filtered list, select first available
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
        setSelectedModuleId('ALL'); // Reset to all modules when course changes
      });
      MasterDataService.getCourseOutcomes(selectedCourseId).then(setCos);
    } else {
      setModules([]);
      setCos([]);
    }
  }, [selectedCourseId]);

  // Load questions for the selected course
  const loadQuestions = async () => {
    if (!selectedCourseId) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    const filter: QuestionFilter = {
      course_id: selectedCourseId,
      module_id: selectedModuleId !== 'ALL' ? selectedModuleId : undefined,
      mark_value: selectedMarkFilter !== '' ? Number(selectedMarkFilter) : undefined,
      search_query: questionSearchQuery || undefined
    };
    const data = await QuestionService.getQuestions(filter);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCourseId, selectedModuleId, selectedMarkFilter, questionSearchQuery]);

  // Selected Course Metadata
  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const selectedDepartment = useMemo(() => {
    if (selectedCourse?.department) return selectedCourse.department;
    return departments.find(d => d.id === (selectedCourse?.department_id || selectedDeptId));
  }, [departments, selectedCourse, selectedDeptId]);

  // Filtered Course Catalog for Selection Grid / Dropdown
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

  // Handlers
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
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-poppins">
            <FileQuestion className="w-7 h-7 text-brand-600" />
            Question Module
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select department & course to manage syllabus questions module-wise, create MCQ/Subjective questions, and edit options.
          </p>
        </div>

        {selectedCourseId && (
          <Button variant="primary" size="lg" onClick={handleOpenAddForm} className="shadow-md shadow-brand-600/20">
            <Plus className="w-5 h-5" />
            <span>Add Question</span>
          </Button>
        )}
      </div>

      {/* Course & Department Selection Bar */}
      <Card className="p-5 space-y-4 border-brand-100 bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-brand-600" />
            Select Department & Available Courses
          </div>
          {selectedCourse && (
            <Badge variant="primary" className="font-mono text-xs">
              Active Course: {selectedCourse.code}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Department
            </label>
            <select
              value={selectedDeptId}
              onChange={e => setSelectedDeptId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Search Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Search Course List
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search course code or name..."
                value={courseSearchQuery}
                onChange={e => setCourseSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Course Dropdown Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Select Available Course
            </label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-semibold text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {filteredCourses.length === 0 ? (
                <option value="">No courses match filters</option>
              ) : (
                filteredCourses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} (Sem {c.semester})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Available Course Pills / Cards List */}
        {filteredCourses.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto scrollbar-thin py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Quick Pick:
            </span>
            {filteredCourses.map(c => {
              const isSelected = c.id === selectedCourseId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{c.code}</span>
                  <span className="font-normal opacity-80 truncate max-w-[140px]">({c.name})</span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Main Selected Course Questions Repository Section */}
      {selectedCourse ? (
        <div className="space-y-6">
          {/* Active Course Banner */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">{selectedCourse.code}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedCourse.name}</span>
                  {selectedDepartment && (
                    <Badge variant="neutral" className="text-xs">
                      {selectedDepartment.code}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semester {selectedCourse.semester} • Academic Year {selectedCourse.academic_year} • {modules.length} Syllabus Modules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={handleOpenAddForm}>
                <Plus className="w-4 h-4" />
                <span>Add Question in {selectedCourse.code}</span>
              </Button>
            </div>
          </div>

          {/* Module-Wise Filter Tabs */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Boxes className="w-4 h-4 text-brand-600" />
                Module-Wise View
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Questions Available: {questions.length}
              </span>
            </div>

            {/* Module Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
              <button
                type="button"
                onClick={() => setSelectedModuleId('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedModuleId === 'ALL'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Modules ({modules.length})
              </button>

              {modules.map(mod => {
                const isSelected = selectedModuleId === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Module {mod.module_number}</span>
                    <span className="text-[11px] font-normal opacity-80 max-w-[120px] truncate">
                      ({mod.title})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Filter & Search Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions by statement..."
                  value={questionSearchQuery}
                  onChange={e => setQuestionSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={selectedMarkFilter}
                  onChange={e => setSelectedMarkFilter(e.target.value !== '' ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">All Marks Weightage</option>
                  <option value="1">1 Mark (MCQ)</option>
                  <option value="2">2 Marks (Short)</option>
                  <option value="5">5 Marks</option>
                  <option value="10">10 Marks</option>
                  <option value="16">16 Marks</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Question Cards List */}
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <Card className="p-12 text-center space-y-3">
                <FileQuestion className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No questions found for this selection</h3>
                <p className="text-xs text-slate-500">
                  {selectedModuleId !== 'ALL'
                    ? 'No questions added under this module yet.'
                    : 'Start adding questions for this course.'}
                </p>
                <Button variant="primary" size="sm" onClick={handleOpenAddForm}>
                  <Plus className="w-4 h-4" />
                  <span>Add First Question</span>
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
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Course Selected</h3>
          <p className="text-xs text-slate-500">
            Please select a department and available course from the selector bar above to view questions.
          </p>
        </Card>
      )}

      {/* Add / Edit Question Modal */}
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

      {/* MCQ Options Viewer Modal */}
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
