'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Department, Course, Module, CourseOutcome, KLevel, QuestionType, Mark, QuestionOption } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionService } from '@/services/question.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Modal } from '@/components/ui/modal';
import { LatexContent } from '@/components/ui/latex-content';
import { ArrowLeft, Save, CheckCircle2, X } from 'lucide-react';

export interface QuestionFormProps {
  editId?: string;
  initialDepartmentId?: string;
  initialCourseId?: string;
  initialModuleId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QuestionForm({
  editId,
  initialDepartmentId,
  initialCourseId,
  initialModuleId,
  onSuccess,
  onCancel
}: QuestionFormProps) {
  const router = useRouter();

  // Master lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);
  const [types, setTypes] = useState<QuestionType[]>([]);
  const [marksList, setMarksList] = useState<Mark[]>([]);

  // Form states
  const [departmentId, setDepartmentId] = useState(initialDepartmentId || '');
  const [courseId, setCourseId] = useState(initialCourseId || '');
  const [moduleId, setModuleId] = useState(initialModuleId || '');
  const [coId, setCoId] = useState('');
  const [klevelId, setKlevelId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [marksId, setMarksId] = useState('');
  const [markValue, setMarkValue] = useState<number>(1);
  const [questionText, setQuestionText] = useState('');

  // MCQ Options
  const [options, setOptions] = useState<QuestionOption[]>([
    { option_letter: 'a', option_text: '', is_correct: true },
    { option_letter: 'b', option_text: '', is_correct: false },
    { option_letter: 'c', option_text: '', is_correct: false },
    { option_letter: 'd', option_text: '', is_correct: false }
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Load master data
  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes(),
      MasterDataService.getMarks()
    ]).then(async ([dList, kList, tList, mList]) => {
      setDepartments(dList);
      setKlevels(kList);
      setTypes(tList);
      setMarksList(mList);

      if (!departmentId && dList.length > 0) setDepartmentId(dList[0].id);
      if (kList.length > 0) setKlevelId(kList[0].id);
      if (tList.length > 0) setTypeId(tList[0].id);
      if (mList.length > 0) {
        setMarksId(mList[0].id);
        setMarkValue(mList[0].mark_value);
      }

      // If editing existing question, load details
      if (editId) {
        const existing = await QuestionService.getQuestionById(editId);
        if (existing) {
          setDepartmentId(existing.department_id);
          setCourseId(existing.course_id);
          setModuleId(existing.module_id);
          setCoId(existing.course_outcome_id);
          setKlevelId(existing.k_level_id);
          setTypeId(existing.question_type_id);
          setMarksId(existing.marks_id);
          setMarkValue(existing.mark_value);
          setQuestionText(existing.question_text);
          if (existing.options && existing.options.length > 0) {
            setOptions(existing.options);
          }
        }
      }
      setLoading(false);
    });
  }, [editId]);

  // Cascading courses when department changes (if dept selection enabled)
  useEffect(() => {
    if (departmentId) {
      MasterDataService.getCourses(departmentId).then(cList => {
        setCourses(cList);
        if (cList.length > 0 && (!courseId || !cList.some(c => c.id === courseId))) {
          setCourseId(cList[0].id);
        }
      });
    }
  }, [departmentId]);

  // Auto-fetch department from course if course is provided
  useEffect(() => {
    if (courseId && (!departmentId || initialCourseId)) {
      MasterDataService.getCourses().then(cList => {
        const found = cList.find(c => c.id === courseId);
        if (found && found.department_id) {
          setDepartmentId(found.department_id);
        }
      });
    }
  }, [courseId, initialCourseId]);

  // Cascading modules & COs when course changes
  useEffect(() => {
    if (courseId) {
      MasterDataService.getModules(courseId).then(mList => {
        setModules(mList);
        if (mList.length > 0 && (!moduleId || !mList.some(m => m.id === moduleId))) {
          setModuleId(initialModuleId && mList.some(m => m.id === initialModuleId) ? initialModuleId : mList[0].id);
        }
      });

      MasterDataService.getCourseOutcomes(courseId).then(coList => {
        setCos(coList);
        if (coList.length > 0 && (!coId || !coList.some(c => c.id === coId))) {
          setCoId(coList[0].id);
        }
      });
    }
  }, [courseId]);

  // Auto-sync question type & mark value when mark changes
  const handleMarkChange = (mId: string) => {
    setMarksId(mId);
    const m = marksList.find(item => item.id === mId);
    if (m) {
      setMarkValue(m.mark_value);
      if (m.mark_value === 1) {
        const mcqType = types.find(t => t.code === 'MCQ');
        if (mcqType) setTypeId(mcqType.id);
      } else if (m.mark_value === 2) {
        const shortType = types.find(t => t.code === 'SHORT');
        if (shortType) setTypeId(shortType.id);
      } else {
        const longType = types.find(t => t.code === 'LONG');
        if (longType) setTypeId(longType.id);
      }
    }
  };

  const selectedType = types.find(t => t.id === typeId);
  const isMCQ = selectedType?.code === 'MCQ' || markValue === 1;

  const handleOptionChange = (idx: number, text: string) => {
    const next = [...options];
    next[idx].option_text = text;
    setOptions(next);
  };

  const handleSetCorrectOption = (idx: number) => {
    const next = options.map((opt, i) => ({
      ...opt,
      is_correct: i === idx
    }));
    setOptions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (isMCQ) {
      const hasEmpty = options.some(o => !o.option_text.trim());
      if (hasEmpty) {
        setFormError('Please fill out text for all four MCQ options before saving.');
        setSaving(false);
        return;
      }
    }

    try {
      await QuestionService.saveQuestion({
        id: editId,
        department_id: departmentId,
        course_id: courseId,
        module_id: moduleId,
        course_outcome_id: coId,
        k_level_id: klevelId,
        question_type_id: typeId,
        marks_id: marksId,
        mark_value: markValue,
        question_text: questionText,
        options: isMCQ ? options : []
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/question-bank');
      }
    } catch (err) {
      console.error('Error saving question:', err);
      setFormError('Failed to save the question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 font-medium">Loading form metadata...</div>;
  }

  const hideCourseDeptSelectors = Boolean(initialCourseId);

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {onCancel ? <X className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {editId ? 'Edit Question' : 'Create New Question'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Associate question metadata with academic standards.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={handleCancelClick}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Question'}</span>
          </Button>
        </div>
      </div>

      {/* Metadata Configuration Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
          Academic Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department & Course (only if not auto-fetched by initialCourseId) */}
          {!hideCourseDeptSelectors ? (
            <>
              {/* Department */}
              <DropdownSelect
                required
                label="Department"
                value={departmentId}
                onChange={setDepartmentId}
                options={departments.map((department) => ({ value: department.id, label: `${department.code} - ${department.name}` }))}
              />

              {/* Course */}
              <DropdownSelect
                required
                label="Course"
                value={courseId}
                onChange={setCourseId}
                options={courses.map((course) => ({ value: course.id, label: `${course.code} - ${course.name}` }))}
              />
            </>
          ) : null}

          {/* Module / Unit Select */}
          <DropdownSelect
            required
            label="Module / Unit"
            value={moduleId}
            onChange={setModuleId}
            options={modules.map((module) => ({ value: module.id, label: `Module ${module.module_number}: ${module.title}` }))}
          />

          {/* Course Outcome (CO) */}
          <DropdownSelect
            required
            label="Course Outcome (CO)"
            value={coId}
            onChange={setCoId}
            options={cos.map((co) => ({ value: co.id, label: `${co.code} - ${co.description.slice(0, 30)}...` }))}
          />

          {/* K-Level */}
          <DropdownSelect
            required
            label="K-Level (Bloom's)"
            value={klevelId}
            onChange={setKlevelId}
            options={klevels.map((level) => ({ value: level.id, label: `${level.code} - ${level.name}` }))}
          />

          {/* Marks */}
          <DropdownSelect
            required
            label="Marks Weightage"
            value={marksId}
            onChange={handleMarkChange}
            options={marksList.map((mark) => ({ value: mark.id, label: `${mark.mark_value} Mark${mark.mark_value > 1 ? 's' : ''}` }))}
          />
        </div>
      </Card>

      {/* Question Text Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
          Question Content
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Question Text *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Write the full question statement clearly..."
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
          />
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {'LaTeX is supported. Use $...$ for inline math, $$...$$ for display math, and commands such as \\textbf{...} or \\begin{align*}.'}
          </p>
          {questionText && (
            <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm leading-6 text-slate-800">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-500">Preview</p>
              <LatexContent content={questionText} displayBlock />
            </div>
          )}
        </div>

        {/* Dynamic MCQ Options Builder */}
        {isMCQ && (
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  MCQ Answer Options (Select Correct Answer A, B, C, or D)
                </label>
                <p className="text-[11px] text-slate-500">
                  Click radio button or &quot;Set Correct&quot; on any option to mark it as the correct answer.
                </p>
              </div>
              <Badge variant="success" className="text-xs">MCQ Mode</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.option_letter}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    opt.is_correct
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={opt.is_correct}
                      onChange={() => handleSetCorrectOption(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center uppercase transition-colors ${
                      opt.is_correct ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                    }`}>
                      {opt.option_letter}
                    </span>
                  </label>

                  <input
                    type="text"
                    required
                    placeholder={`Option ${opt.option_letter.toUpperCase()} text...`}
                    value={opt.option_text}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />

                  {opt.is_correct ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCorrectOption(idx)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer"
                    >
                      Set Correct
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      </form>

      <Modal
        open={Boolean(formError)}
        onClose={() => setFormError('')}
        title="Review the question details"
        description={formError}
      >
        <div className="flex justify-end">
          <Button type="button" onClick={() => setFormError('')}>Got it</Button>
        </div>
      </Modal>
    </>
  );
}
