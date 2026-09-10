'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Department, Course, Module, CourseOutcome, KLevel, PaperSectionConfig } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionService } from '@/services/question.service';
import { QuestionGeneratorEngine, SectionValidationResult } from '@/lib/question-generator/generator-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Plus, Trash2, CheckCircle2, AlertTriangle, RefreshCw, Calculator, FileSpreadsheet } from 'lucide-react';

export default function GeneratePaperPage() {
  const router = useRouter();

  // Academic metadata
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);

  // Workflow selections
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');

  // Paper general info
  const [collegeName, setCollegeName] = useState('PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY');
  const [examName, setExamName] = useState('END SEMESTER EXAMINATIONS - APRIL / MAY 2026');
  const [semester, setSemester] = useState(5);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [dateOfExam, setDateOfExam] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(180);

  // Section Configurations
  const [sections, setSections] = useState<PaperSectionConfig[]>([
    { id: 'sec-1', section_name: 'PART - A', section_order: 1, question_type_code: 'MCQ', num_questions: 10, marks_per_question: 1, has_or_pattern: false },
    { id: 'sec-2', section_name: 'PART - B', section_order: 2, question_type_code: 'SHORT', num_questions: 5, marks_per_question: 2, has_or_pattern: false },
    { id: 'sec-3', section_name: 'PART - C', section_order: 3, question_type_code: 'LONG', num_questions: 4, marks_per_question: 15, has_or_pattern: true },
    { id: 'sec-4', section_name: 'PART - D', section_order: 4, question_type_code: 'LONG', num_questions: 1, marks_per_question: 20, has_or_pattern: false }
  ]);

  // Validation results & total marks
  const [validations, setValidations] = useState<SectionValidationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load initial departments & K-levels
  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getKLevels()
    ]).then(([dList, kList]) => {
      setDepartments(dList);
      setKlevels(kList);
      if (dList.length > 0) setDepartmentId(dList[0].id);
    });
  }, []);

  // Cascading courses when department changes
  useEffect(() => {
    if (departmentId) {
      MasterDataService.getCourses(departmentId).then(cList => {
        setCourses(cList);
        if (cList.length > 0) {
          setCourseId(cList[0].id);
          setSemester(cList[0].semester);
          setAcademicYear(cList[0].academic_year);
        }
      });
    }
  }, [departmentId]);

  // Cascading modules & COs when course changes
  useEffect(() => {
    if (courseId) {
      MasterDataService.getModules(courseId).then(setModules);
      MasterDataService.getCourseOutcomes(courseId).then(setCos);
    }
  }, [courseId]);

  // Real-time Availability calculation
  const checkAvailability = async () => {
    if (!departmentId || !courseId) return;
    const results = await QuestionGeneratorEngine.validateAvailability({
      department_id: departmentId,
      course_id: courseId,
      sections
    });
    setValidations(results);
  };

  useEffect(() => {
    checkAvailability();
  }, [departmentId, courseId, sections]);

  // Calculate Total Marks automatically
  const totalCalculatedMarks = sections.reduce(
    (sum, sec) => sum + Number(sec.num_questions) * Number(sec.marks_per_question),
    0
  );

  const isAllValid = validations.length > 0 && validations.every(v => v.isValid);

  const handleAddSection = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const nextLetter = letters[sections.length] || `SEC-${sections.length + 1}`;
    const newSec: PaperSectionConfig = {
      id: crypto.randomUUID(),
      section_name: `PART - ${nextLetter}`,
      section_order: sections.length + 1,
      question_type_code: 'LONG',
      num_questions: 2,
      marks_per_question: 10,
      has_or_pattern: false
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (id: string) => {
    if (sections.length <= 1) {
      alert('Paper must contain at least one section.');
      return;
    }
    setSections(sections.filter(s => s.id !== id));
  };

  const handleUpdateSection = (id: string, updates: Partial<PaperSectionConfig>) => {
    setSections(sections.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleGenerate = async () => {
    if (!isAllValid) return;
    setIsGenerating(true);

    const res = await QuestionGeneratorEngine.generatePaper({
      department_id: departmentId,
      course_id: courseId,
      college_name: collegeName,
      exam_name: examName,
      semester,
      academic_year: academicYear,
      date_of_exam: dateOfExam,
      duration_minutes: durationMinutes,
      sections
    });

    setIsGenerating(false);

    if (res.success && res.paper) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pmu_temp_paper', JSON.stringify(res.paper));
        sessionStorage.setItem('pmu_temp_config', JSON.stringify({
          department_id: departmentId,
          course_id: courseId,
          sections
        }));
      }
      router.push('/generate-paper/preview/new');
    } else {
      alert(res.errorMessage || 'Failed to generate paper.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-brand-600" />
            Randomized Question Paper Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure examination pattern criteria (Dept → Course → Section Config) with real-time question availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Marks</span>
            <span className="text-xl font-extrabold text-brand-700 font-mono">{totalCalculatedMarks} Marks</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={!isAllValid || isGenerating}
            onClick={handleGenerate}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-600/20"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? 'Selecting Questions...' : 'Generate Paper'}</span>
          </Button>
        </div>
      </div>

      {/* Step 1 & 2: Department & Course Selection Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
          Step 1: Department & Course Selection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Department *</label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course *</label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date of Exam</label>
            <input
              type="date"
              value={dateOfExam}
              onChange={e => setDateOfExam(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Step 3: Section Pattern Config Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-600" />
            Step 2: Section Breakdown Configuration
          </h3>
          <Button variant="outline" size="sm" onClick={handleAddSection}>
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </Button>
        </div>

        {sections.map((sec, sIdx) => {
          const val = validations.find(v => v.section_name === sec.section_name);
          const secTotal = Number(sec.num_questions) * Number(sec.marks_per_question);

          return (
            <Card key={sec.id} className="p-5 border-l-4 border-l-brand-600 hover:border-slate-300 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={sec.section_name}
                    onChange={e => handleUpdateSection(sec.id, { section_name: e.target.value })}
                    className="font-extrabold text-slate-900 text-base border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1"
                  />
                  <Badge variant="primary" className="font-mono">
                    {secTotal} Marks Total ({sec.num_questions} × {sec.marks_per_question}m)
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {/* Section Availability Status Indicator */}
                  {val && (
                    <div
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        val.isValid
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      }`}
                    >
                      {val.isValid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Required: {val.required_questions} | Available: {val.available_questions} | ✓ Ready
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> Required: {val.required_questions} | Available: {val.available_questions} | ✕ Not enough questions
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveSection(sec.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Question Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Question Type</label>
                  <select
                    value={sec.question_type_code}
                    onChange={e => handleUpdateSection(sec.id, { question_type_code: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="MCQ">MCQ (Multiple Choice)</option>
                    <option value="SHORT">Short Answer</option>
                    <option value="LONG">Long Answer</option>
                  </select>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">No. of Questions</label>
                  <input
                    type="number"
                    min="1"
                    value={sec.num_questions}
                    onChange={e => handleUpdateSection(sec.id, { num_questions: Math.max(1, Number(e.target.value)) })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Marks Per Question */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Marks / Question</label>
                  <select
                    value={sec.marks_per_question}
                    onChange={e => handleUpdateSection(sec.id, { marks_per_question: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value={1}>1 Mark</option>
                    <option value={2}>2 Marks</option>
                    <option value={10}>10 Marks</option>
                    <option value={15}>15 Marks</option>
                    <option value={20}>20 Marks</option>
                  </select>
                </div>

                {/* Target Module (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Module Filter</label>
                  <select
                    value={sec.module_id || ''}
                    onChange={e => handleUpdateSection(sec.id, { module_id: e.target.value || undefined })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">Any Module</option>
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>Mod {m.module_number}</option>
                    ))}
                  </select>
                </div>

                {/* Target CO (Multi-Select) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">
                      Target Course Outcomes (COs)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(!sec.course_outcome_ids || sec.course_outcome_ids.length === 0) ? 'All COs Selected' : `${sec.course_outcome_ids.length} Selected`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[42px] items-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateSection(sec.id, { course_outcome_ids: [] })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                        (!sec.course_outcome_ids || sec.course_outcome_ids.length === 0)
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      All COs
                    </button>
                    {cos.map(co => {
                      const isSelected = sec.course_outcome_ids?.includes(co.id);
                      return (
                        <button
                          key={co.id}
                          type="button"
                          onClick={() => {
                            const current = sec.course_outcome_ids || [];
                            const next = isSelected
                              ? current.filter(id => id !== co.id)
                              : [...current, co.id];
                            handleUpdateSection(sec.id, { course_outcome_ids: next });
                          }}
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {co.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target K-Level (Multi-Select) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">
                      Target K-Levels (Blooms Taxonomy)
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(!sec.k_level_ids || sec.k_level_ids.length === 0) ? 'All K-Levels Selected' : `${sec.k_level_ids.length} Selected`}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[42px] items-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateSection(sec.id, { k_level_ids: [] })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                        (!sec.k_level_ids || sec.k_level_ids.length === 0)
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      All K-Levels
                    </button>
                    {klevels.map(k => {
                      const isSelected = sec.k_level_ids?.includes(k.id);
                      return (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => {
                            const current = sec.k_level_ids || [];
                            const next = isSelected
                              ? current.filter(id => id !== k.id)
                              : [...current, k.id];
                            handleUpdateSection(sec.id, { k_level_ids: next });
                          }}
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {k.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* OR Pattern Toggle for Long Questions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={sec.has_or_pattern}
                    onChange={e => handleUpdateSection(sec.id, { has_or_pattern: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <span>Enable OR Pattern (16a OR 16b Internal Choice for each question)</span>
                </label>

                {sec.has_or_pattern && (
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Requires 2× unique questions ({sec.num_questions * 2} total needed)
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
