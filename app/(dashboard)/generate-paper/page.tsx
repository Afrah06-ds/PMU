'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Department, Course, Module, CourseOutcome, KLevel, PaperSectionConfig } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionService } from '@/services/question.service';
import { QuestionGeneratorEngine, SectionValidationResult } from '@/lib/question-generator/generator-engine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { Modal } from '@/components/ui/modal';
import { AlertCircle, BookOpen, Building2, CalendarDays, Check, CheckCircle2, Clock3, FileText, GripVertical, Plus, Sparkles, Trash2, WandSparkles } from 'lucide-react';

const typeOptions = [
  { value: 'MCQ', label: 'MCQ · 1 mark' },
  { value: 'SHORT', label: 'Short answer · 2 marks' },
  { value: 'LONG', label: 'Long answer' },
];

const markOptions = [1, 2, 5, 10, 15, 20].map((mark) => ({ value: String(mark), label: `${mark} mark${mark > 1 ? 's' : ''}` }));

export default function GeneratePaperPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [collegeName, setCollegeName] = useState('PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY');
  const [examNameLine1, setExamNameLine1] = useState('ARTS & SCIENCE DEGREE EXAMINATIONS, APRIL / MAY 2026');
  const [examNameLine2, setExamNameLine2] = useState('End Semester Examinations : III Semester');
  const [targetBranchClass, setTargetBranchClass] = useState('COMMON TO ALL');
  const [semester, setSemester] = useState(5);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [dateOfExam, setDateOfExam] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [sections, setSections] = useState<PaperSectionConfig[]>([
    { id: 'sec-1', section_name: 'PART - A', section_order: 1, question_type_code: 'MCQ', num_questions: 10, marks_per_question: 1, has_or_pattern: false },
    { id: 'sec-2', section_name: 'PART - B', section_order: 2, question_type_code: 'SHORT', num_questions: 5, marks_per_question: 2, has_or_pattern: false },
    { id: 'sec-3', section_name: 'PART - C', section_order: 3, question_type_code: 'LONG', num_questions: 4, marks_per_question: 15, has_or_pattern: true },
  ]);
  const [validations, setValidations] = useState<SectionValidationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [removeSectionId, setRemoveSectionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [bankAlignmentWarning, setBankAlignmentWarning] = useState<string | null>(null);

  const selectedCourse = courses.find((course) => course.id === courseId);

  useEffect(() => {
    Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getKLevels(),
      MasterDataService.getCourses()
    ]).then(([departmentList, levelList, allCourses]) => {
      setDepartments(departmentList);
      setKlevels(levelList);

      let savedMeta: any = null;
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('pmu_active_course_metadata');
        if (raw) {
          try {
            savedMeta = JSON.parse(raw);
          } catch (e) {}
        }
      }

      const savedCourseId = (typeof window !== 'undefined' ? localStorage.getItem('pmu_active_course_id') : null) || savedMeta?.course_id;
      const savedCourse = (savedCourseId ? allCourses.find((c) => c.id === savedCourseId) : null) ||
        (savedMeta?.course_code ? allCourses.find((c) => c.code.toUpperCase() === savedMeta.course_code.toUpperCase()) : null);

      if (savedMeta) {
        if (savedMeta.college_name) setCollegeName(savedMeta.college_name);
        if (savedMeta.exam_name_line1) setExamNameLine1(savedMeta.exam_name_line1);
        if (savedMeta.exam_name_line2) setExamNameLine2(savedMeta.exam_name_line2);
        if (savedMeta.target_branch_class) setTargetBranchClass(savedMeta.target_branch_class);
        if (typeof savedMeta.semester === 'number') setSemester(savedMeta.semester);
        if (savedMeta.academic_year) setAcademicYear(savedMeta.academic_year);
      }

      if (savedCourse) {
        setDepartmentId(savedCourse.department_id);
        const deptCourses = allCourses.filter((c) => !savedCourse.department_id || c.department_id === savedCourse.department_id);
        setCourses(deptCourses.length > 0 ? deptCourses : allCourses);
        setCourseId(savedCourse.id);
        setSemester(savedCourse.semester || savedMeta?.semester || 2);
        setAcademicYear(savedCourse.academic_year || savedMeta?.academic_year || '2025-2026');
      } else if (departmentList[0]) {
        setDepartmentId(departmentList[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!departmentId) return;
    MasterDataService.getCourses(departmentId).then((courseList) => {
      setCourses(courseList);
      setCourseId((prev) => {
        if (courseList.some((c) => c.id === prev)) return prev;
        if (courseList[0]) {
          setSemester(courseList[0].semester);
          setAcademicYear(courseList[0].academic_year);
          return courseList[0].id;
        }
        return '';
      });
    });
  }, [departmentId]);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      MasterDataService.getModules(courseId),
      MasterDataService.getCourseOutcomes(courseId),
      QuestionService.getQuestions({ course_id: courseId })
    ]).then(async ([moduleList, outcomeList, questions]) => {
      let finalModules = moduleList;
      if (finalModules.length === 0) {
        // Auto-create modules 1 to 5 from questions or units!
        const unitMap = new Map<number, string>();
        questions.forEach((q) => {
          const modNum = q.module?.module_number || (q as any).module_number;
          if (modNum && (q as any).unit_name && !unitMap.has(modNum)) {
            unitMap.set(modNum, (q as any).unit_name);
          }
        });
        const created: Module[] = [];
        for (let n = 1; n <= 5; n++) {
          const title = unitMap.get(n) || (selectedCourse ? `Unit ${n} - ${selectedCourse.name}` : `Module ${n}`);
          const saved = await MasterDataService.saveModule({
            course_id: courseId,
            module_number: n,
            title
          });
          created.push(saved);
        }
        finalModules = created;
      }
      setModules(finalModules);
      setCos(outcomeList);

      const hasMCQ = questions.some(q => Number(q.mark_value) === 1 || q.question_type?.code === 'MCQ' || q.section_type === 'SECTION_A');
      const hasShort = questions.some(q => Number(q.mark_value) === 2 || q.question_type?.code === 'SHORT' || q.section_type === 'SECTION_B');
      const hasLong = questions.some(q => Number(q.mark_value) >= 5 || q.question_type?.code === 'LONG' || q.section_type === 'SECTION_C');

      if (questions.length === 0) {
        setBankAlignmentWarning('The question bank for this course is empty. Need a proper alignment or else the question paper will not generate properly.');
      } else if (!hasMCQ || !hasShort || !hasLong) {
        const missing: string[] = [];
        if (!hasMCQ) missing.push('Part A (1-Mark MCQs)');
        if (!hasShort) missing.push('Part B (2-Mark Short Answers)');
        if (!hasLong) missing.push('Part C (15-Mark Long Questions)');
        setBankAlignmentWarning(`The question bank is not aligned properly (Missing: ${missing.join(', ')}). Need a proper alignment or else the question paper will not generate properly.`);
      } else {
        setBankAlignmentWarning(null);
      }
    });
  }, [courseId, selectedCourse]);

  useEffect(() => {
    if (departmentId && courseId) QuestionGeneratorEngine.validateAvailability({ department_id: departmentId, course_id: courseId, sections }).then(setValidations);
  }, [departmentId, courseId, sections]);

  const totalMarks = sections.reduce((sum, section) => sum + section.num_questions * section.marks_per_question, 0);
  const requiredQuestions = sections.reduce((sum, section) => sum + section.num_questions * (section.has_or_pattern ? 2 : 1), 0);
  const readySections = validations.filter((result) => result.isValid).length;

  const updateSection = (id: string, updates: Partial<PaperSectionConfig>) => setSections((current) => current.map((section) => section.id === id ? { ...section, ...updates } : section));

  const addSection = () => {
    const letter = String.fromCharCode(65 + sections.length);
    setSections((current) => [...current, { id: crypto.randomUUID(), section_name: `PART - ${letter}`, section_order: current.length + 1, question_type_code: 'LONG', num_questions: 2, marks_per_question: 10, has_or_pattern: false }]);
  };

  const removeSection = () => {
    if (!removeSectionId) return;
    setSections((current) => current.filter((section) => section.id !== removeSectionId));
    setRemoveSectionId(null);
  };

  const generate = async () => {
    if (!departmentId || !courseId) {
      setErrorMessage('Select a department and course before generating the paper.');
      return;
    }
    setIsGenerating(true);
    for (let step = 1; step <= 4; step += 1) {
      setLoadingStep(step);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    const result = await QuestionGeneratorEngine.generatePaper({
      department_id: departmentId,
      department_name: departments.find((d) => d.id === departmentId)?.name,
      course_id: courseId,
      course_code: selectedCourse?.code,
      course_name: selectedCourse?.name,
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
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsGenerating(false);
    if (!result.success || !result.paper) {
      setErrorMessage(result.errorMessage || 'The paper could not be generated.');
      return;
    }
    sessionStorage.setItem('pmu_temp_paper', JSON.stringify(result.paper));
    sessionStorage.setItem('pmu_temp_config', JSON.stringify({ department_id: departmentId, course_id: courseId, sections }));
    router.push('/generate-paper/preview/new');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-16">
      <header className="flex flex-col gap-5 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600"><WandSparkles className="h-3.5 w-3.5" /> Paper studio</div><h1 className="font-poppins text-3xl font-bold tracking-tight text-slate-950">Compose an examination paper.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Set the academic context, shape the paper pattern, and preview the result before it leaves the studio.</p></div>
        <Button size="lg" onClick={generate} disabled={isGenerating || !selectedCourse}><WandSparkles className="h-4 w-4" />{isGenerating ? 'Building paper...' : 'Generate paper'}</Button>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          {bankAlignmentWarning && (
            <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/90 text-amber-900 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-amber-950">Question Bank Alignment Alert</p>
                  <p className="text-amber-900 leading-relaxed">{bankAlignmentWarning}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 border-amber-300 bg-white hover:bg-amber-100 text-amber-900 text-xs font-semibold"
                onClick={() => router.push('/question-bank/import')}
              >
                Import / Align Bank
              </Button>
            </div>
          )}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">01</span><div><h2 className="font-poppins text-base font-bold text-slate-900">Academic context</h2><p className="mt-1 text-xs text-slate-500">Choose the source course for this paper.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><DropdownSelect label="Department" required value={departmentId} onChange={setDepartmentId} options={departments.map((department) => ({ value: department.id, label: `${department.code} · ${department.name}` }))} /><DropdownSelect label="Course" required value={courseId} onChange={setCourseId} options={courses.map((course) => ({ value: course.id, label: `${course.code} · ${course.name}` }))} /><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Academic year</span><input value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white" /></label><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Date of exam</span><input type="date" value={dateOfExam} onChange={(event) => setDateOfExam(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white" /></label></div></section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">02</span><div><h2 className="font-poppins text-base font-bold text-slate-900">Paper identity</h2><p className="mt-1 text-xs text-slate-500">Set the information printed on the paper header.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Institution name</span><input value={collegeName} onChange={(event) => setCollegeName(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white" /></label><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Exam title · line 1</span><input value={examNameLine1} onChange={(event) => setExamNameLine1(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white" /></label><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Exam subtitle · line 2</span><input value={examNameLine2} onChange={(event) => setExamNameLine2(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-indigo-500 focus:bg-white" /></label><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Target class / branch</span><input value={targetBranchClass} onChange={(event) => setTargetBranchClass(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white" /></label><div className="grid grid-cols-2 gap-3"><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Semester</span><input type="number" min="1" max="8" value={semester} onChange={(event) => setSemester(Number(event.target.value))} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white" /></label><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Duration</span><input type="number" min="30" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white" /></label></div></div></section>

          <section className="space-y-4"><div className="flex items-end justify-between gap-4"><div className="flex items-start gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">03</span><div><h2 className="font-poppins text-base font-bold text-slate-900">Paper pattern</h2><p className="mt-1 text-xs text-slate-500">Configure question count, marks, mapping, and internal choice.</p></div></div><Button size="sm" variant="outline" onClick={addSection}><Plus className="h-4 w-4" /> Add section</Button></div>
            {sections.map((section, index) => { const validation = validations.find((item) => item.section_name === section.section_name); const sectionMarks = section.num_questions * section.marks_per_question; return <div key={section.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4"><div className="flex min-w-0 items-start gap-3"><GripVertical className="mt-1 h-4 w-4 shrink-0 text-slate-300" /><div><div className="flex flex-wrap items-center gap-2"><input value={section.section_name} onChange={(event) => updateSection(section.id, { section_name: event.target.value })} className="w-32 border-b border-transparent font-poppins text-sm font-bold text-slate-900 outline-none hover:border-slate-300 focus:border-indigo-500" /><Badge variant="neutral">Section {index + 1}</Badge></div><p className="mt-1 text-xs text-slate-400">{section.num_questions} questions · {sectionMarks} marks {validation?.message ? `· ${validation.message}` : ''}</p></div></div><div className="flex items-center gap-2"><span className={`hidden items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold sm:flex ${validation?.isValid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}><CheckCircle2 className="h-3.5 w-3.5" />{validation?.isValid ? 'Ready' : 'Review'}</span><button type="button" onClick={() => setRemoveSectionId(section.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><DropdownSelect label="Question type" value={section.question_type_code} onChange={(value) => updateSection(section.id, { question_type_code: value as PaperSectionConfig['question_type_code'] })} options={typeOptions} /><label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Questions</span><input type="number" min="1" value={section.num_questions} onChange={(event) => updateSection(section.id, { num_questions: Math.max(1, Number(event.target.value)) })} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white" /></label><DropdownSelect label="Marks / question" value={String(section.marks_per_question)} onChange={(value) => updateSection(section.id, { marks_per_question: Number(value) })} options={markOptions} /><DropdownSelect label="Module filter" value={section.module_id || ''} onChange={(value) => updateSection(section.id, { module_id: value || undefined })} options={[{ value: '', label: 'Any module' }, ...modules.map((module) => ({ value: module.id, label: `Module ${module.module_number} · ${module.title}` }))]} /></div><div className="mt-4 border-t border-slate-100 pt-4"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Course outcomes</span><span className="text-[10px] font-semibold text-slate-400">Select one or more</span></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => updateSection(section.id, { course_outcome_ids: [] })} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${!section.course_outcome_ids?.length ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>All COs</button>{cos.map((co) => { const selected = section.course_outcome_ids?.includes(co.id); return <button type="button" key={co.id} onClick={() => { const current = section.course_outcome_ids || []; updateSection(section.id, { course_outcome_ids: selected ? current.filter((id) => id !== co.id) : [...current, co.id] }); }} className={`rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold ${selected ? 'bg-amber-500 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>{co.code}{selected && <Check className="ml-1 inline h-3 w-3" />}</button>; })}</div></div><div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={section.has_or_pattern} onChange={(event) => updateSection(section.id, { has_or_pattern: event.target.checked })} className="h-4 w-4 rounded border-slate-300 text-indigo-600" /> Enable internal OR choice</label>{section.has_or_pattern && <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700">Requires {section.num_questions * 2} questions</span>}</div></div>; })}
          </section>
        </div>

        <aside className="lg:sticky lg:top-6"><div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-sm"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600"><Sparkles className="h-3.5 w-3.5" /> Paper summary</div><h2 className="mt-3 font-poppins text-lg font-bold text-slate-900">{selectedCourse?.code || 'Select a course'}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{selectedCourse?.name || 'Choose a course to begin.'}</p><div className="mt-6 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/80 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">Marks</p><p className="mt-1 text-2xl font-bold text-indigo-700">{totalMarks}</p></div><div className="rounded-xl bg-white/80 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">Sections</p><p className="mt-1 text-2xl font-bold text-slate-900">{sections.length}</p></div></div><div className="mt-5 space-y-3 border-t border-indigo-100 pt-5"><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-slate-600"><FileText className="h-3.5 w-3.5 text-indigo-500" />Required questions</span><b>{requiredQuestions}</b></div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-slate-600"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Sections ready</span><b>{readySections}/{sections.length}</b></div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-slate-600"><Clock3 className="h-3.5 w-3.5 text-indigo-500" />Duration</span><b>{durationMinutes} min</b></div></div><Button className="mt-6 w-full" size="lg" onClick={generate} disabled={isGenerating || !selectedCourse}><WandSparkles className="h-4 w-4" />Generate & preview</Button></div></aside>
      </div>

      <Modal open={Boolean(removeSectionId)} onClose={() => setRemoveSectionId(null)} title="Remove this section?" description="The section and its question pattern will be removed from this paper draft."><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setRemoveSectionId(null)}>Keep section</Button><Button variant="danger" onClick={removeSection}><Trash2 className="h-4 w-4" />Remove section</Button></div></Modal>
      <Modal open={Boolean(errorMessage)} onClose={() => setErrorMessage('')} title="Paper needs attention" description={errorMessage}><div className="flex justify-end"><Button onClick={() => setErrorMessage('')}>Got it</Button></div></Modal>
      {isGenerating && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><WandSparkles className="h-5 w-5 animate-pulse" /></div><div><h2 className="font-poppins text-base font-bold text-slate-900">Building your paper</h2><p className="mt-1 text-xs text-slate-500">Randomizing questions and preparing the preview.</p></div></div><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${loadingStep * 20}%` }} /></div><div className="mt-5 space-y-2 text-xs font-semibold">{['Validating academic mapping', 'Reading the question library', 'Removing duplicate questions', 'Shuffling MCQ options', 'Preparing the A4 preview'].map((step, index) => <div key={step} className={`flex items-center gap-2 ${loadingStep > index ? 'text-emerald-600' : 'text-slate-400'}`}><CheckCircle2 className="h-4 w-4" />{step}</div>)}</div></div></div>}
    </div>
  );
}