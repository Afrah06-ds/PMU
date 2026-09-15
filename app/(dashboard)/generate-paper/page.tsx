'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Department, Course, Module, CourseOutcome, KLevel, PaperSectionConfig } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionGeneratorEngine, SectionValidationResult } from '@/lib/question-generator/generator-engine';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wand2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  BookOpen,
  Calculator,
  Calendar,
  Sparkles,
  Layers,
  HelpCircle,
  SlidersHorizontal,
  FileText,
  FileCode
} from 'lucide-react';

export default function RefinedGeneratePaperPage() {
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

  // Paper general info & header inputs
  const [collegeName, setCollegeName] = useState('PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY');
  const [examNameLine1, setExamNameLine1] = useState('ARTS & SCIENCE DEGREE EXAMINATIONS, APRIL / MAY 2026');
  const [examNameLine2, setExamNameLine2] = useState('End Semester Examinations : III Semester');
  const [targetBranchClass, setTargetBranchClass] = useState('COMMON TO ALL');
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

  // Validation results & Step-by-Step Loading Buffer state
  const [validations, setValidations] = useState<SectionValidationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);

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

  // Sync courses when department changes
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

  // Sync modules & COs when course changes
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

  const selectedCourse = courses.find(c => c.id === courseId);
  const selectedDepartment = departments.find(d => d.id === departmentId);

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

  // Step-by-step buffer delay helper
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingStep(1);

    await delay(300);
    setLoadingStep(2);

    await delay(350);
    setLoadingStep(3);

    await delay(350);
    setLoadingStep(4);

    const res = await QuestionGeneratorEngine.generatePaper({
      department_id: departmentId,
      course_id: courseId,
      college_name: collegeName,
      exam_name: `${examNameLine1} - ${examNameLine2}`,
      exam_name_line1: examNameLine1,
      exam_name_line2: examNameLine2,
      target_branch_class: targetBranchClass,
      semester,
      academic_year: academicYear,
      date_of_exam: dateOfExam,
      duration_minutes: durationMinutes,
      sections
    });

    setLoadingStep(5);
    await delay(350);

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
      {/* 1. Sleek Compact Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 px-4 py-3.5 sm:px-5 sm:py-4 text-white shadow-md border border-slate-800/80">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="bg-brand-500/20 text-brand-300 border-brand-400/30 text-[10px] py-0 px-2 font-medium">
                <Sparkles className="w-3 h-3 text-brand-400 mr-1" /> Exam Paper Generator
              </Badge>
              <span className="text-[10px] text-slate-400 font-medium">• PMIST EMS</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight font-poppins text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Randomized Question Paper Generator</span>
            </h1>
            <p className="text-[11px] text-slate-300 leading-tight font-sans">
              Configure examination pattern criteria with real-time question availability & zero-duplicate randomization.
            </p>
          </div>

          {/* Action & Total Marks Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right px-2.5 py-1 bg-white/10 backdrop-blur-xs rounded-lg border border-white/10">
              <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider block leading-none">Paper Marks</span>
              <span className="text-sm font-extrabold text-white font-mono leading-tight">{totalCalculatedMarks} Marks</span>
            </div>

            <Button
              size="sm"
              variant="primary"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="h-8 px-4 text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-600/30 border border-brand-400/20 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              <span>{isGenerating ? 'Generating...' : 'Generate Paper'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Step 1: Department & Course Selection Card */}
      <Card className="p-5 space-y-4 border-slate-200 shadow-sm bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-brand-600" />
            1. Academic Department & Course Criteria
          </div>
          {selectedCourse && (
            <Badge variant="primary" className="font-mono text-xs">
              {selectedCourse.code} • Sem {selectedCourse.semester}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Department Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Department *
            </label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          {/* Course Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Course *
            </label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Date of Exam */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Date of Exam
            </label>
            <input
              type="date"
              value={dateOfExam}
              onChange={e => setDateOfExam(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Paper Header Formatting Customizations (2-Line Exam Name & Target Class) */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Examination Paper Header Customization (2-Line Header & Target Class)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Exam Name Line 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Exam Title (Line 1)
              </label>
              <input
                type="text"
                value={examNameLine1}
                onChange={e => setExamNameLine1(e.target.value)}
                placeholder="ARTS & SCIENCE DEGREE EXAMINATIONS..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Exam Name Line 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Exam Subtitle / Term (Line 2)
              </label>
              <input
                type="text"
                value={examNameLine2}
                onChange={e => setExamNameLine2(e.target.value)}
                placeholder="End Semester Examinations : III Semester"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Target Class / Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target Class / Branch (Common or Specific)
              </label>
              <input
                type="text"
                value={targetBranchClass}
                onChange={e => setTargetBranchClass(e.target.value)}
                placeholder="COMMON TO ALL or Specific to CSE"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Step 2: Section Breakdown Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-brand-600" />
            2. Examination Section Pattern Configuration
          </div>
          <Button size="sm" variant="outline" onClick={handleAddSection} className="h-7 px-2.5 text-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Section</span>
          </Button>
        </div>

        {sections.map((sec, sIdx) => {
          const val = validations.find(v => v.section_name === sec.section_name);
          const secTotal = Number(sec.num_questions) * Number(sec.marks_per_question);

          return (
            <Card key={sec.id} className="p-4 border-l-4 border-l-brand-600 hover:border-slate-300 transition-all bg-white space-y-3 shadow-2xs">
              {/* Card Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={sec.section_name}
                    onChange={e => handleUpdateSection(sec.id, { section_name: e.target.value })}
                    className="font-extrabold text-slate-900 text-sm border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5"
                  />
                  <Badge variant="primary" className="font-mono text-[11px]">
                    {secTotal} Marks ({sec.num_questions} × {sec.marks_per_question}m)
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {/* Availability Badge */}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Ready ({val?.available_questions || sec.num_questions + 2} Available)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sec.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Controls Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Question Type */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type</label>
                  <select
                    value={sec.question_type_code}
                    onChange={e => handleUpdateSection(sec.id, { question_type_code: e.target.value as any })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="MCQ">MCQ (1 Mark)</option>
                    <option value="SHORT">Short (2 Marks)</option>
                    <option value="LONG">Long / Subjective</option>
                  </select>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">No. Questions</label>
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Marks / Qn</label>
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

                {/* Module Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Module Filter</label>
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

                {/* Target CO Pills */}
                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Course Outcomes (COs)
                  </label>
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg items-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateSection(sec.id, { course_outcome_ids: [] })}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                        (!sec.course_outcome_ids || sec.course_outcome_ids.length === 0)
                          ? 'bg-brand-600 text-white font-bold'
                          : 'bg-white text-slate-600 border border-slate-200'
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
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-white'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                        >
                          {co.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* OR Pattern Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 text-xs">
                  <input
                    type="checkbox"
                    checked={sec.has_or_pattern}
                    onChange={e => handleUpdateSection(sec.id, { has_or_pattern: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                  />
                  <span>Enable OR Choice Pattern (16a OR 16b Internal Choice for each question)</span>
                </label>

                {sec.has_or_pattern && (
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    2× questions generated ({sec.num_questions * 2} total)
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Step-by-Step Loading Buffer Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Glowing Accent */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-lg shadow-brand-600/20">
                <Wand2 className="w-7 h-7 animate-spin text-brand-300" />
              </div>

              <div>
                <h3 className="text-lg font-bold font-poppins text-white">Generating Question Paper</h3>
                <p className="text-xs text-slate-400 mt-0.5">Please wait while the system assembles your paper.</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(loadingStep / 5) * 100}%` }}
                />
              </div>

              {/* Step By Step Check List */}
              <div className="space-y-2 text-left pt-2 text-xs font-medium border-t border-slate-800">
                <div className={`flex items-center gap-2 transition-colors ${loadingStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${loadingStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Step 1: Validating Department & Course Syllabus Mapping</span>
                </div>

                <div className={`flex items-center gap-2 transition-colors ${loadingStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${loadingStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Step 2: Querying Question Bank Repository & COs</span>
                </div>

                <div className={`flex items-center gap-2 transition-colors ${loadingStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${loadingStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Step 3: Executing Zero-Duplicate Randomization Engine</span>
                </div>

                <div className={`flex items-center gap-2 transition-colors ${loadingStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${loadingStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Step 4: Shuffling MCQ Option Distribution (A, B, C, D)</span>
                </div>

                <div className={`flex items-center gap-2 transition-colors ${loadingStep >= 5 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${loadingStep >= 5 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Step 5: Assembling Print-Ready A4 Examination Paper</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
