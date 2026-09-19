'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Course, Department, Module, CourseOutcome, KLevel, QuestionType, Question } from '@/types';
import { QuestionService } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';
import { QuestionBankParser, ParsedQuestionBankRow, ParsedCourseMetadata } from '@/lib/question-bank-parser';
import { extractPdfInBrowser } from '@/lib/client-pdf-extractor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { LatexContent } from '@/components/ui/latex-content';
import {
  FileUp,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Check,
  FileText,
  BookOpen,
  Layers3,
  AlertCircle,
  Loader2,
  FolderPlus,
  PlusCircle,
  X,
  Database
} from 'lucide-react';

export default function PDFImportQuestionsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [cos, setCos] = useState<CourseOutcome[]>([]);
  const [klevels, setKlevels] = useState<KLevel[]>([]);
  const [qtypes, setQtypes] = useState<QuestionType[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedQuestionBankRow[]>([]);
  const [previewFilter, setPreviewFilter] = useState<'ALL' | '1M' | '2M' | '15M' | '20M'>('ALL');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number; percentage: number } | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation Modal state for missing Course, Modules, and COs
  const [showCreateEntitiesModal, setShowCreateEntitiesModal] = useState(false);
  const [isCreatingEntities, setIsCreatingEntities] = useState(false);
  const [detectedMetadata, setDetectedMetadata] = useState<ParsedCourseMetadata | null>(null);
  const [pendingParsedQuestions, setPendingParsedQuestions] = useState<ParsedQuestionBankRow[]>([]);
  const [showAlignmentWarningModal, setShowAlignmentWarningModal] = useState(false);

  // Load master data
  useEffect(() => {
    Promise.all([
      MasterDataService.getCourses(),
      MasterDataService.getDepartments(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes()
    ]).then(([courseList, deptList, kList, typeList]) => {
      setCourses(courseList);
      setDepartments(deptList);
      setKlevels(kList);
      setQtypes(typeList);

      if (courseList.length > 0) {
        const defaultCourse =
          courseList.find((c) => c.code === 'XDS601') ||
          courseList.find((c) => c.code === 'CS8392') ||
          courseList[0];
        setSelectedCourseId(defaultCourse.id);
        setSelectedDeptId(defaultCourse.department_id || '');
      }
    });
  }, []);

  // Filter courses by department
  const filteredCourses = useMemo(() => {
    if (!selectedDeptId) return courses;
    return courses.filter((c) => c.department_id === selectedDeptId);
  }, [courses, selectedDeptId]);

  // Load modules & COs when selected course changes
  useEffect(() => {
    if (!selectedCourseId) {
      setModules([]);
      setCos([]);
      return;
    }
    MasterDataService.getModules(selectedCourseId).then(setModules);
    MasterDataService.getCourseOutcomes(selectedCourseId).then(setCos);
  }, [selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId),
    [courses, selectedCourseId]
  );

  // Handle PDF file upload and text extraction via API
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.toLowerCase().endsWith('.pdf') && uploadedFile.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF (.pdf) file.');
      return;
    }

    setFile(uploadedFile);
    setErrorMessage(null);
    setIsExtracting(true);
    setParsedRows([]);
    setSuccessCount(null);

    try {
      let data: any;

      // 1. Primary: Fast, in-browser PDF extraction (zero Vercel serverless dependency)
      try {
        data = await extractPdfInBrowser(uploadedFile);
      } catch (browserErr) {
        console.warn('In-browser extraction fallback to server API:', browserErr);

        // 2. Secondary fallback: Server-side API route
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const res = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to extract text from PDF file');
        }

        data = await res.json();
      }

      setPdfPageCount(data.numPages || 1);

      let extractedQuestions: ParsedQuestionBankRow[] = data.questions || [];
      if (extractedQuestions.length === 0 && data.fullText) {
        const fallback = QuestionBankParser.parseText(data.fullText);
        extractedQuestions = fallback.questions;
      }

      if (extractedQuestions.length === 0) {
        setErrorMessage(
          'No questions could be identified from this PDF. Please ensure the PDF contains numbered question entries with COs, RBTL, or section headers.'
        );
        setIsExtracting(false);
        return;
      }

      const meta: ParsedCourseMetadata = data.metadata || QuestionBankParser.extractCourseMetadata(data.fullText || '');

      if (typeof window !== 'undefined') {
        localStorage.setItem('pmu_active_course_metadata', JSON.stringify({
          course_code: meta.course_code || 'P24DS151',
          course_name: meta.course_name || 'Machine Learning Techniques',
          department_name: meta.department_code || 'Department of Informatics',
          target_branch_class: meta.programme_name || 'M.Sc. Data Science',
          programme_code: meta.programme_code || '366',
          semester: typeof meta.semester === 'number' ? meta.semester : 2,
          academic_year: meta.academic_year || '2025-2026',
          college_name: 'PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY',
          exam_name_line1: meta.programme_name ? `${meta.programme_name.toUpperCase()} DEGREE EXAMINATIONS, MAY 2026` : 'DEGREE EXAMINATIONS, MAY 2026',
          exam_name_line2: `End Semester Examinations : Semester ${meta.semester || 2}`,
          modules: meta.modules || meta.units || []
        }));
      }

      // Check if course already exists in DB
      const targetCode = (meta.course_code || 'XDS601').toUpperCase().trim();
      const existingCourse = courses.find((c) => c.code.toUpperCase().trim() === targetCode);

      if (existingCourse) {
        // Course exists: load modules and check if modules or COs exist
        setSelectedCourseId(existingCourse.id);
        if (existingCourse.department_id) setSelectedDeptId(existingCourse.department_id);

        const [currMods, currCos] = await Promise.all([
          MasterDataService.getModules(existingCourse.id),
          MasterDataService.getCourseOutcomes(existingCourse.id)
        ]);

        if (currMods.length === 0 || currCos.length === 0 || (meta.modules && meta.modules.length > 0 && currMods.length < meta.modules.length)) {
          // Course exists but modules or COs are missing -> prompt confirmation
          setDetectedMetadata({
            ...meta,
            course_code: existingCourse.code,
            course_name: existingCourse.name
          });
          setPendingParsedQuestions(extractedQuestions);
          setShowCreateEntitiesModal(true);
        } else {
          setModules(currMods);
          setCos(currCos);
          setParsedRows(extractedQuestions);
        }
      } else {
        // Course does not exist -> trigger confirmation dialog to create course, modules, COs
        setDetectedMetadata(meta);
        setPendingParsedQuestions(extractedQuestions);
        setShowCreateEntitiesModal(true);
      }
    } catch (err: any) {
      console.error('PDF parsing exception:', err);
      setErrorMessage(err.message || 'An error occurred while extracting the PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  // User confirms creation of detected Academic Entities (Course, Modules, COs)
  const handleConfirmCreateEntities = async () => {
    if (!detectedMetadata) return;
    setIsCreatingEntities(true);
    setErrorMessage(null);

    try {
      // 1. Identify or match Department
      let targetDeptId = selectedDeptId;
      if (!targetDeptId) {
        const matchedDept = departments.find(
          (d) =>
            d.name.toLowerCase().includes('informatic') ||
            d.code.toLowerCase().includes('info') ||
            d.name.toLowerCase().includes(detectedMetadata.department_code?.toLowerCase() || '')
        );
        targetDeptId = matchedDept ? matchedDept.id : (departments[0]?.id || '55555555-5555-5555-5555-555555555555');
      }

      // 2. Save Course in Database
      let targetCourse = courses.find(
        (c) => c.code.toUpperCase().trim() === (detectedMetadata.course_code || 'P24DS151').toUpperCase().trim()
      );

      if (!targetCourse) {
        targetCourse = await MasterDataService.saveCourse({
          code: detectedMetadata.course_code || 'P24DS151',
          name: detectedMetadata.course_name || 'Machine Learning Techniques',
          department_id: targetDeptId,
          semester: typeof detectedMetadata.semester === 'number' ? detectedMetadata.semester : 2,
          academic_year: detectedMetadata.academic_year || '2025-2026'
        });
        setCourses((prev) => [...prev.filter((c) => c.id !== targetCourse!.id), targetCourse!]);
      }

      // 3. Save Modules (1 to 5)
      const defaultModules = [
        { module_number: 1, title: 'Module 1' },
        { module_number: 2, title: 'Module 2' },
        { module_number: 3, title: 'Module 3' },
        { module_number: 4, title: 'Module 4' },
        { module_number: 5, title: 'Module 5' }
      ];
      const modulesToCreate = detectedMetadata.modules && detectedMetadata.modules.length > 0
        ? detectedMetadata.modules
        : defaultModules;

      const createdModules: Module[] = [];
      for (const m of modulesToCreate) {
        const saved = await MasterDataService.saveModule({
          course_id: targetCourse.id,
          module_number: m.module_number,
          title: m.title,
          description: m.syllabus || ''
        });
        createdModules.push(saved);
      }
      setModules(createdModules);

      // 4. Save Course Outcomes (CO1 to CO6)
      const defaultCOs = [
        { code: 'CO1', description: 'Describe the fundamentals, terminologies, and life cycle of Big Data', rbt_level: 'K2' },
        { code: 'CO2', description: 'Explain storage models and NoSQL databases for managing Big Data', rbt_level: 'K2' },
        { code: 'CO3', description: 'Demonstrate the use of Hadoop and its ecosystem for distributed data storage and processing', rbt_level: 'K3' },
        { code: 'CO4', description: 'Apply MapReduce, Hive, and Pig for efficient data processing and querying', rbt_level: 'K3' },
        { code: 'CO5', description: 'Analyze Big Data using advanced techniques, including statistical and machine learning methods', rbt_level: 'K4' },
        { code: 'CO6', description: 'Propose data-driven solutions for real-world problems', rbt_level: 'K3' }
      ];
      const cosToCreate = detectedMetadata.course_outcomes && detectedMetadata.course_outcomes.length > 0
        ? detectedMetadata.course_outcomes
        : defaultCOs;

      const createdCOs: CourseOutcome[] = [];
      for (const co of cosToCreate) {
        const matchedK = klevels.find((k) => k.code.toUpperCase() === co.rbt_level.toUpperCase());
        const saved = await MasterDataService.saveCourseOutcome({
          course_id: targetCourse.id,
          code: co.code,
          description: co.description,
          k_level_code: co.rbt_level,
          k_level_id: matchedK?.id
        });
        createdCOs.push(saved);
      }
      setCos(createdCOs);

      // 5. Select Course & Activate Parsed Questions
      setSelectedCourseId(targetCourse.id);
      setSelectedDeptId(targetDeptId);
      setParsedRows(pendingParsedQuestions);
      setShowCreateEntitiesModal(false);
    } catch (err: any) {
      console.error('Error creating academic entities:', err);
      setErrorMessage(err.message || 'Failed to create academic entities in the database.');
    } finally {
      setIsCreatingEntities(false);
    }
  };

  // Grouped questions by mark value: 1M, 2M, 15M, 20M
  const questions1M = useMemo(
    () => parsedRows.filter((r) => r.mark_value === 1 || r.section_type === 'SECTION_A'),
    [parsedRows]
  );
  const questions2M = useMemo(
    () => parsedRows.filter((r) => r.mark_value === 2 || r.section_type === 'SECTION_B'),
    [parsedRows]
  );
  const questions15M = useMemo(
    () => parsedRows.filter((r) => r.mark_value === 15 || (r.section_type === 'SECTION_C' && r.mark_value < 20)),
    [parsedRows]
  );
  const questions20M = useMemo(
    () => parsedRows.filter((r) => r.mark_value >= 20),
    [parsedRows]
  );

  const filteredDisplayRows = useMemo(() => {
    if (previewFilter === '1M') return questions1M;
    if (previewFilter === '2M') return questions2M;
    if (previewFilter === '15M') return questions15M;
    if (previewFilter === '20M') return questions20M;
    return parsedRows;
  }, [parsedRows, previewFilter, questions1M, questions2M, questions15M, questions20M]);

  // Question Bank Alignment Evaluation
  const alignmentStatus = useMemo(() => {
    if (parsedRows.length === 0) {
      return {
        isProperlyAligned: true,
        issues: [],
        mcqCount: 0,
        shortCount: 0,
        longCount: 0,
        missingModules: []
      };
    }

    const issues: string[] = [];
    const mcqs = parsedRows.filter(r => r.mark_value === 1 || r.section_type === 'SECTION_A' || (r.options && r.options.length > 0));
    const shorts = parsedRows.filter(r => r.mark_value === 2 || r.section_type === 'SECTION_B');
    const longs = parsedRows.filter(r => (r.mark_value >= 5 || r.section_type === 'SECTION_C') && !(r.options && r.options.length > 0));

    // 1. Part A (1 Mark MCQ) Check
    if (mcqs.length === 0) {
      issues.push('Part A (1-Mark MCQs): 0 questions found. At least 10 MCQs are required to generate Part A.');
    } else if (mcqs.length < 10) {
      issues.push(`Part A (1-Mark MCQs): Only ${mcqs.length} question(s) found (minimum 10 needed for standard exam papers).`);
    }

    // 2. Part B (2 Marks Short Answers) Check
    if (shorts.length === 0) {
      issues.push('Part B (2-Marks Short Answers): 0 questions found. At least 5 short questions are required to generate Part B.');
    } else if (shorts.length < 5) {
      issues.push(`Part B (2-Marks Short Answers): Only ${shorts.length} question(s) found (minimum 5 needed for standard exam papers).`);
    }

    // 3. Part C (15 Marks Long Answers) Check
    if (longs.length === 0) {
      issues.push('Part C (15-Marks Descriptive): 0 questions found. At least 8 questions are required to generate Part C with internal choice.');
    } else if (longs.length < 8) {
      issues.push(`Part C (15-Marks Descriptive): Only ${longs.length} question(s) found (minimum 8 needed for standard internal choice).`);
    }

    // 4. Module distribution (Modules 1 to 5)
    const modulesWithQuestions = new Set<number>();
    parsedRows.forEach(r => {
      if (r.module_number) modulesWithQuestions.add(r.module_number);
    });
    const missingModules: number[] = [];
    for (let m = 1; m <= 5; m++) {
      if (!modulesWithQuestions.has(m)) {
        missingModules.push(m);
      }
    }
    if (missingModules.length > 0 && modulesWithQuestions.size > 0) {
      issues.push(`Module Coverage: No questions found for Module(s) ${missingModules.join(', ')}.`);
    }

    // 5. MCQ options check
    const mcqsWithoutOptions = mcqs.filter(m => !m.options || m.options.length < 2);
    if (mcqsWithoutOptions.length > 0) {
      issues.push(`MCQ Choices: ${mcqsWithoutOptions.length} objective question(s) lack multiple-choice options.`);
    }

    return {
      isProperlyAligned: issues.length === 0,
      issues,
      mcqCount: mcqs.length,
      shortCount: shorts.length,
      longCount: longs.length,
      missingModules
    };
  }, [parsedRows]);

  // Intercept save if question bank is not aligned properly
  const handleSaveClick = () => {
    if (parsedRows.length === 0 || !selectedCourseId) return;
    if (!alignmentStatus.isProperlyAligned) {
      setShowAlignmentWarningModal(true);
      return;
    }
    handleConfirmImport();
  };

  // Save parsed questions into the Question Bank
  const handleConfirmImport = async () => {
    if (parsedRows.length === 0 || !selectedCourseId) return;
    setImporting(true);
    setErrorMessage(null);

    try {
      // Ensure the 5 modules exist for selectedCourseId in MasterDataService!
      let courseModules = await MasterDataService.getModules(selectedCourseId);
      if (courseModules.length === 0) {
        const unitMap = new Map<number, string>();
        if (detectedMetadata?.modules) {
          detectedMetadata.modules.forEach((m) => unitMap.set(m.module_number, m.title));
        }
        if (detectedMetadata?.units) {
          detectedMetadata.units.forEach((u) => unitMap.set(u.unit_number, u.unit_name));
        }
        parsedRows.forEach((r) => {
          if (r.module_number && r.unit_name && !unitMap.has(r.module_number)) {
            unitMap.set(r.module_number, r.unit_name);
          }
        });

        const createdMods: Module[] = [];
        for (let n = 1; n <= 5; n++) {
          const title = unitMap.get(n) || `Module ${n}`;
          const savedM = await MasterDataService.saveModule({
            course_id: selectedCourseId,
            module_number: n,
            title
          });
          createdMods.push(savedM);
        }
        courseModules = createdMods;
        setModules(createdMods);
      }

      const questionsToSave: Partial<Question>[] = parsedRows.map((row) => {
        // Module matching: match by module_number (1 to 5) first, then unit_name
        let matchedModuleId: string | undefined;
        if (row.module_number && courseModules.length > 0) {
          const modByNum = courseModules.find((m) => m.module_number === row.module_number);
          if (modByNum) matchedModuleId = modByNum.id;
        }
        if (!matchedModuleId && row.unit_name && courseModules.length > 0) {
          const uNorm = row.unit_name.toLowerCase();
          const matchedMod = courseModules.find((m) => {
            const mTitle = m.title.toLowerCase();
            return (
              uNorm.includes(mTitle) ||
              mTitle.includes(uNorm) ||
              (uNorm.includes('1') && m.module_number === 1) ||
              (uNorm.includes('2') && m.module_number === 2) ||
              (uNorm.includes('3') && m.module_number === 3) ||
              (uNorm.includes('4') && m.module_number === 4) ||
              (uNorm.includes('5') && m.module_number === 5)
            );
          });
          matchedModuleId = matchedMod?.id;
        }
        if (!matchedModuleId && courseModules.length > 0) {
          matchedModuleId = courseModules[0].id;
        }

        // CO matching
        const coNorm = (row.co_code || 'CO1').toUpperCase().replace(/\s+/g, '');
        const matchedCO =
          cos.find((c) => c.code.toUpperCase().replace(/\s+/g, '') === coNorm) ||
          cos[0];

        // K-level matching
        const kNorm = (row.k_code || 'K1').toUpperCase().trim();
        const matchedK =
          klevels.find((k) => k.code.toUpperCase() === kNorm) ||
          klevels[0];

        // Normalize mark and question type
        let finalMark = row.mark_value || 1;
        let secType = row.section_type;
        let qTypeCode: 'MCQ' | 'SHORT' | 'LONG' = 'LONG';

        if (finalMark === 1 || secType === 'SECTION_A' || (row.options && row.options.length > 0)) {
          finalMark = 1;
          secType = 'SECTION_A';
          qTypeCode = 'MCQ';
        } else if (finalMark === 2 || secType === 'SECTION_B') {
          finalMark = 2;
          secType = 'SECTION_B';
          qTypeCode = 'SHORT';
        } else {
          secType = 'SECTION_C';
          qTypeCode = 'LONG';
          if (!finalMark || finalMark <= 2) finalMark = 15;
        }

        const matchedType = qtypes.find((t) => t.code === qTypeCode);

        return {
          course_id: selectedCourseId,
          department_id: selectedCourse?.department_id,
          module_id: matchedModuleId,
          course_outcome_id: matchedCO?.id,
          k_level_id: matchedK?.id,
          question_type_id: matchedType?.id,
          mark_value: finalMark,
          question_text: row.question_text,
          key_answer: row.key_answer || '',
          evaluation_scheme: row.evaluation_scheme || '',
          unit_name: row.unit_name || '',
          unit_syllabus: row.unit_syllabus || '',
          section_type: secType,
          q_no: row.q_no,
          options: row.options || []
        };
      });

      setImportProgress({ current: 0, total: questionsToSave.length, percentage: 0 });
      const count = await QuestionService.bulkImport(questionsToSave, (current, total, percentage) => {
        setImportProgress({ current, total, percentage });
      });
      setImporting(false);
      setSuccessCount(count);

      if (typeof window !== 'undefined') {
        localStorage.setItem('pmu_active_course_id', selectedCourseId);
        const activeMeta = {
          course_id: selectedCourseId,
          course_code: detectedMetadata?.course_code || selectedCourse?.code || 'P24DS151',
          course_name: detectedMetadata?.course_name || selectedCourse?.name || 'Machine Learning Techniques',
          department_name: detectedMetadata?.department_code || selectedDept?.name || 'Department of Informatics',
          department_id: selectedDeptId || selectedCourse?.department_id,
          target_branch_class: detectedMetadata?.programme_name || 'M.Sc. Data Science',
          programme_code: detectedMetadata?.programme_code || '366',
          semester: typeof detectedMetadata?.semester === 'number' ? detectedMetadata.semester : selectedCourse?.semester || 2,
          academic_year: detectedMetadata?.academic_year || selectedCourse?.academic_year || '2025-2026',
          college_name: 'PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY',
          exam_name_line1: detectedMetadata?.programme_name ? `${detectedMetadata.programme_name.toUpperCase()} DEGREE EXAMINATIONS, MAY 2026` : 'DEGREE EXAMINATIONS, MAY 2026',
          exam_name_line2: `End Semester Examinations : Semester ${detectedMetadata?.semester || selectedCourse?.semester || 2}`
        };
        localStorage.setItem('pmu_active_course_metadata', JSON.stringify(activeMeta));
      }

      setTimeout(() => {
        router.push('/question-bank');
      }, 1800);
    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMessage(err.message || 'Error importing questions. Please try again.');
      setImporting(false);
      setImportProgress(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3.5 sm:px-5 sm:py-4 text-white shadow-md border border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Back to Question Bank"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 text-[10px] py-0 px-2 font-medium">
                  <Sparkles className="w-3 h-3 text-indigo-400 mr-1" /> PDF Question Bank Importer
                </Badge>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight font-poppins text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Import Question Bank from PDF</span>
              </h1>
              <p className="text-[11px] text-slate-300 leading-tight">
                Upload your PDF question bank to extract and categorize questions into 1 Mark, 2 Marks, 15 Marks, and 20 Marks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Target Course Selection */}
      <Card className="p-4 bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Academic Course</h3>
          </div>
          {selectedCourse && (
            <Badge variant="info" className="text-[10px] font-mono">
              Sem {selectedCourse.semester} · {selectedCourse.academic_year || '2025-2026'}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DropdownSelect
            label="Department"
            value={selectedDeptId}
            onChange={(val) => {
              setSelectedDeptId(val);
              const courseInDept = courses.find((c) => c.department_id === val);
              if (courseInDept) setSelectedCourseId(courseInDept.id);
            }}
            options={[
              { value: '', label: 'All Departments' },
              ...departments.map((d) => ({ value: d.id, label: `${d.code} · ${d.name}` }))
            ]}
            className="[&>button]:bg-white"
          />

          <DropdownSelect
            label="Course"
            value={selectedCourseId}
            onChange={setSelectedCourseId}
            options={filteredCourses.map((c) => ({
              value: c.id,
              label: `${c.code} · ${c.name}`
            }))}
            className="[&>button]:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers3 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              <strong>{modules.length} Modules</strong> & <strong>{cos.length} Course Outcomes</strong> active for auto-mapping.
            </span>
          </div>
        </div>
      </Card>

      {/* 3. PDF Upload Dropzone */}
      <Card className="p-8 text-center border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/10 transition-all rounded-2xl bg-white shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-xs">
          <FileUp className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Upload Question Bank PDF (.pdf)</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Extracts course details, outcomes, question statements, MCQ options, COs, Bloom&apos;s levels (K1–K6), key answers, and evaluation schemes directly from the PDF pages.
          </p>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/20 transition-all">
            <FileUp className="w-4 h-4" />
            <span>Select PDF File to Upload</span>
            <input
              type="file"
              accept=".pdf, application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
          </label>
        </div>

        {isExtracting && (
          <div className="pt-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Extracting and parsing course metadata and questions from PDF... Please wait...</span>
          </div>
        )}

        {file && !isExtracting && (
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{file.name}</span>
              <span className="text-[11px] font-normal opacity-80">
                ({(file.size / (1024 * 1024)).toFixed(2)} MB {pdfPageCount ? `· ${pdfPageCount} pages` : ''} · {parsedRows.length} questions detected)
              </span>
            </span>
          </div>
        )}
      </Card>

      {/* Error Display */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 4. Confirmation Modal: Create Missing Course, Modules, & COs */}
      {showCreateEntitiesModal && detectedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold">New Academic Entities Detected</h3>
                  <p className="text-xs text-slate-300">Confirmation required before parsing and saving questions</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateEntitiesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Course and Outcomes do not exist in the database yet.</span>
                  <p className="mt-0.5 text-[11px] text-amber-800">
                    The uploaded PDF contains Course <strong>{detectedMetadata.course_code} - {detectedMetadata.course_name}</strong> along with 5 Modules and 6 Course Outcomes. Do you confirm creating these entities in the database now?
                  </p>
                </div>
              </div>

              {/* Entity 1: Course Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Course Details
                  </span>
                  <Badge variant="primary" className="text-[10px] font-mono">
                    {detectedMetadata.course_code}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Course Name:</span>
                    <span className="font-semibold text-slate-800">{detectedMetadata.course_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Programme:</span>
                    <span className="font-semibold text-slate-800">{detectedMetadata.programme_name} ({detectedMetadata.programme_code})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Academic Year / Semester:</span>
                    <span className="font-semibold text-slate-800">{detectedMetadata.academic_year} · Sem {detectedMetadata.semester}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department:</span>
                    <span className="font-semibold text-slate-800">{detectedMetadata.department_code || 'Informatics'}</span>
                  </div>
                </div>
              </div>

              {/* Entity 2: 5 Modules */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers3 className="w-3.5 h-3.5 text-indigo-600" /> 5 Modules (Units)
                </span>
                <div className="space-y-1">
                  {(detectedMetadata.modules || [
                    { module_number: 1, title: 'FUNDAMENTALS OF BIG DATA' },
                    { module_number: 2, title: 'BIG DATA STORAGE CONCEPTS' },
                    { module_number: 3, title: 'HADOOP AND DISTRIBUTED FRAMEWORKS' },
                    { module_number: 4, title: 'MAP-REDUCE, HIVE AND PIG' },
                    { module_number: 5, title: 'BIG DATA ANALYSIS TECHNIQUES' }
                  ]).map((m) => (
                    <div key={m.module_number} className="flex items-center gap-2 text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-indigo-600 font-mono">M{m.module_number}</span>
                      <span className="font-medium text-slate-800">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entity 3: Course Outcomes */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 6 Course Outcomes (CO1 – CO6)
                </span>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {(detectedMetadata.course_outcomes || [
                    { code: 'CO1', description: 'Describe the fundamentals, terminologies, and life cycle of Big Data', rbt_level: 'K2' },
                    { code: 'CO2', description: 'Explain storage models and NoSQL databases for managing Big Data', rbt_level: 'K2' },
                    { code: 'CO3', description: 'Demonstrate the use of Hadoop and its ecosystem for distributed data storage and processing', rbt_level: 'K3' },
                    { code: 'CO4', description: 'Apply MapReduce, Hive, and Pig for efficient data processing and querying', rbt_level: 'K3' },
                    { code: 'CO5', description: 'Analyze Big Data using advanced techniques, including statistical and machine learning methods', rbt_level: 'K4' },
                    { code: 'CO6', description: 'Propose data-driven solutions for real-world problems', rbt_level: 'K3' }
                  ]).map((co) => (
                    <div key={co.code} className="flex items-start gap-2 text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                      <Badge variant="warning" className="font-mono text-[10px] shrink-0">{co.code}</Badge>
                      <Badge variant="info" className="font-mono text-[10px] shrink-0">{co.rbt_level}</Badge>
                      <span className="text-slate-700 leading-snug">{co.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateEntitiesModal(false)}
                disabled={isCreatingEntities}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmCreateEntities}
                disabled={isCreatingEntities}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {isCreatingEntities ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating Entities in Database...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" /> Confirm & Create Academic Entities
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Categorized Breakdown & Parsed Questions Preview */}
      {parsedRows.length > 0 && (
        <Card className="p-6 space-y-5 border-slate-200 shadow-sm bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Extracted Question Bank Summary ({parsedRows.length} Total Questions)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Questions are automatically categorized into 1 Mark, 2 Mark, 15 Mark, and 20 Mark formats.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveClick}
              disabled={importing || !selectedCourseId}
              className="h-8 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 shrink-0"
            >
              {importing && importProgress ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing {importProgress.percentage}% ({importProgress.current}/{importProgress.total})</span>
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1 stroke-[3]" />
                  <span>Save All {parsedRows.length} Questions</span>
                </>
              )}
            </Button>
          </div>

          {/* Progressing Percentage & Bar */}
          {importProgress !== null && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-indigo-50/60 to-purple-50 border border-indigo-200 shadow-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {importProgress.percentage < 100 ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="font-bold text-slate-800">
                    {importProgress.percentage < 100 ? 'Importing Questions into Database...' : 'Import Complete!'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {importProgress.current} / {importProgress.total} questions
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700 font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                    {importProgress.percentage}%
                  </span>
                </div>
              </div>

              {/* Animated Progress Track & Fill */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${importProgress.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Auto-categorizing into 1M, 2M, 15M, and 20M</span>
                <span>{importProgress.percentage < 100 ? 'Saving question statements, options & schemes...' : 'All questions successfully saved into database!'}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successCount !== null && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>Successfully saved all {successCount} questions into the Question Bank! Redirecting to Question Library...</span>
            </div>
          )}

          {/* 4 Separate Category Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => setPreviewFilter('1M')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                previewFilter === '1M'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-emerald-700">1 Mark (MCQ)</span>
                <Badge variant="primary" className="text-[10px]">Objective</Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{questions1M.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Options & Key Answer</p>
            </div>

            <div
              onClick={() => setPreviewFilter('2M')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                previewFilter === '2M'
                  ? 'border-indigo-500 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-indigo-700">2 Marks (Short)</span>
                <Badge variant="info" className="text-[10px]">Short Answer</Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{questions2M.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Model Definition</p>
            </div>

            <div
              onClick={() => setPreviewFilter('15M')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                previewFilter === '15M'
                  ? 'border-purple-500 bg-purple-50/70 shadow-xs ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-purple-700">15 Marks (Long)</span>
                <Badge variant="warning" className="text-[10px]">Descriptive</Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{questions15M.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Evaluation Rubric</p>
            </div>

            <div
              onClick={() => setPreviewFilter('20M')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                previewFilter === '20M'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-amber-700">20 Marks (Comp)</span>
                <Badge variant="neutral" className="text-[10px]">Case / Comp</Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{questions20M.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Comprehensive</p>
            </div>
          </div>

          {/* Question Bank Alignment Health Status */}
          {!alignmentStatus.isProperlyAligned ? (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-amber-950 shadow-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Question Bank Alignment Warning
                  </h4>
                  <p className="text-xs font-bold text-amber-950">
                    Need a proper alignment or else the question paper will not generate properly.
                  </p>
                </div>
              </div>
              <div className="pl-7 text-[11px] space-y-1">
                <p className="text-amber-800">Please review the following alignment requirements before saving:</p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-900 font-medium">
                  {alignmentStatus.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 shadow-xs flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>✓ Question bank is properly aligned with all examination sections and modules. Ready for generation!</span>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPreviewFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Questions ({parsedRows.length})
            </button>
            <button
              type="button"
              onClick={() => setPreviewFilter('1M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewFilter === '1M'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              1 Mark ({questions1M.length})
            </button>
            <button
              type="button"
              onClick={() => setPreviewFilter('2M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewFilter === '2M'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              2 Marks ({questions2M.length})
            </button>
            <button
              type="button"
              onClick={() => setPreviewFilter('15M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewFilter === '15M'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              15 Marks ({questions15M.length})
            </button>
            <button
              type="button"
              onClick={() => setPreviewFilter('20M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                previewFilter === '20M'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              20 Marks ({questions20M.length})
            </button>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10">Q.No</th>
                  <th className="p-3">Question Statement</th>
                  <th className="p-3 w-16">Marks</th>
                  <th className="p-3 w-16">CO</th>
                  <th className="p-3 w-16">RBTL</th>
                  <th className="p-3">Options / Key Answer / Evaluation Rubric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDisplayRows.slice(0, 35).map((row, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">{row.q_no || idx + 1}</td>
                      <td className="p-3 font-medium text-slate-900 max-w-xs">
                        <p className="line-clamp-3">
                          <LatexContent content={row.question_text || 'Untitled Question'} />
                        </p>
                        {row.unit_name && (
                          <span className="text-[10px] text-slate-400 font-normal block mt-1">
                            Unit: {row.unit_name}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="primary" className="text-[10px] font-bold">
                          {row.mark_value} M
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="warning" className="text-[10px] font-mono font-bold">
                          {row.co_code}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="info" className="text-[10px] font-mono font-bold">
                          {row.k_code}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-600 max-w-sm">
                        {row.options && row.options.length > 0 ? (
                          <div className="space-y-0.5 text-[11px]">
                            {row.options.map((opt) => (
                              <p
                                key={opt.option_letter}
                                className={opt.is_correct ? 'font-bold text-emerald-700' : ''}
                              >
                                ({opt.option_letter}) <LatexContent content={opt.option_text} />
                              </p>
                            ))}
                            {row.key_answer && (
                              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Key: {row.key_answer}
                              </span>
                            )}
                          </div>
                        ) : row.evaluation_scheme ? (
                          <div className="text-[11px] font-sans bg-amber-50/60 text-amber-900 border border-amber-200/60 p-2 rounded-lg whitespace-pre-line leading-relaxed">
                            <span className="font-bold text-[10px] text-amber-800 uppercase block mb-0.5">
                              Evaluation Scheme:
                            </span>
                            {row.evaluation_scheme}
                          </div>
                        ) : row.key_answer ? (
                          <div className="text-[11px] bg-slate-50 text-slate-800 p-1.5 rounded border border-slate-200">
                            <span className="font-bold text-slate-700">Key Answer: </span>
                            {row.key_answer}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Descriptive question</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredDisplayRows.length > 35 && (
            <p className="text-[11px] text-slate-400 text-center font-medium">
              Showing first 35 of {filteredDisplayRows.length} questions in this view. All {filteredDisplayRows.length} questions will be saved.
            </p>
          )}
        </Card>
      )}

      {/* Alignment Interception Modal before Saving */}
      {showAlignmentWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Proper Alignment Required</h3>
                  <p className="text-xs text-amber-100">Review question bank alignment before saving</p>
                </div>
              </div>
              <button
                onClick={() => setShowAlignmentWarningModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
                <p className="font-bold text-sm text-amber-900 mb-1">
                  Need a proper alignment or else the question paper will not generate properly.
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The uploaded question bank does not have complete distribution across required exam sections and syllabus modules. If saved in this state, Paper Studio may lack sufficient questions to fulfill the examination pattern.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                  Detected Alignment Issues ({alignmentStatus.issues.length}):
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {alignmentStatus.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="leading-snug">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                You can return to review and supplement your questions, or proceed to save if you plan to add the remaining questions later.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlignmentWarningModal(false)}
              >
                Review Alignment
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                onClick={() => {
                  setShowAlignmentWarningModal(false);
                  handleConfirmImport();
                }}
              >
                Proceed & Save Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
