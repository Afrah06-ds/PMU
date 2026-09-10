'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Department, Course, Module, CourseOutcome, KLevel, QuestionType, Mark, QuestionOption } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionService } from '@/services/question.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, CheckCircle2, HelpCircle } from 'lucide-react';

export function QuestionForm({ editId }: { editId?: string }) {
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
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
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

      if (dList.length > 0) setDepartmentId(dList[0].id);
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

  // Cascading courses when department changes
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

  // Cascading modules & COs when course changes
  useEffect(() => {
    if (courseId) {
      MasterDataService.getModules(courseId).then(mList => {
        setModules(mList);
        if (mList.length > 0 && (!moduleId || !mList.some(m => m.id === moduleId))) {
          setModuleId(mList[0].id);
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

    if (isMCQ) {
      const hasEmpty = options.some(o => !o.option_text.trim());
      if (hasEmpty) {
        alert('Please fill out text for all 4 MCQ options (A, B, C, D).');
        return;
      }
    }

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

    router.push('/question-bank');
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 font-medium">Loading form metadata...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {editId ? 'Edit Question' : 'Create New Question'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Associate question metadata with academic standards.</p>
          </div>
        </div>

        <Button type="submit" variant="primary">
          <Save className="w-4 h-4" />
          <span>Save Question</span>
        </Button>
      </div>

      {/* Metadata Configuration Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
          Academic Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department *</label>
            <select
              required
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course *</label>
            <select
              required
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Module */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Module / Unit *</label>
            <select
              required
              value={moduleId}
              onChange={e => setModuleId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {modules.map(m => (
                <option key={m.id} value={m.id}>Module {m.module_number}: {m.title}</option>
              ))}
            </select>
          </div>

          {/* Course Outcome (CO) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Outcome (CO) *</label>
            <select
              required
              value={coId}
              onChange={e => setCoId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {cos.map(co => (
                <option key={co.id} value={co.id}>{co.code} - {co.description.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          {/* K-Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">K-Level (Bloom's) *</label>
            <select
              required
              value={klevelId}
              onChange={e => setKlevelId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {klevels.map(k => (
                <option key={k.id} value={k.id}>{k.code} - {k.name}</option>
              ))}
            </select>
          </div>

          {/* Marks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Marks Weightage *</label>
            <select
              required
              value={marksId}
              onChange={e => handleMarkChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {marksList.map(m => (
                <option key={m.id} value={m.id}>{m.mark_value} Mark{m.mark_value > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
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
        </div>

        {/* Dynamic MCQ Options Builder */}
        {isMCQ && (
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                MCQ Answer Options (Select Correct Answer)
              </label>
              <Badge variant="success">MCQ 1-Mark Scheme</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {options.map((opt, idx) => (
                <div
                  key={opt.option_letter}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    opt.is_correct ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={opt.is_correct}
                      onChange={() => handleSetCorrectOption(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-white font-bold text-xs flex items-center justify-center uppercase">
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

                  {opt.is_correct && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </form>
  );
}
