'use client';

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Course, Module, CourseOutcome, Question } from '@/types';
import { Button } from '@/components/ui/button';
import { LatexContent } from '@/components/ui/latex-content';
import { Printer, Download, X, FileText } from 'lucide-react';

interface QuestionBankDocumentModalProps {
  course: Course;
  modules: Module[];
  cos: CourseOutcome[];
  questions: Question[];
  onClose: () => void;
}

export function QuestionBankDocumentModal({
  course,
  modules,
  cos,
  questions,
  onClose
}: QuestionBankDocumentModalProps) {
  const docRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!docRef.current) return;
    try {
      const element = docRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${course.code}_Question_Bank_PMIST.pdf`);
    } catch (e) {
      console.error('PDF Generation Error', e);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-2 sm:p-4 backdrop-blur-sm flex justify-center items-start">
      <div className="bg-white w-full max-w-5xl my-4 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Floating Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                PMIST Official Question Bank Document Preview
              </h2>
              <p className="text-[11px] text-slate-300">
                {course.code} · {course.name} ({questions.length} questions across {modules.length} units)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 text-xs border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print (Ctrl+P)</span>
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleDownloadPDF}
              className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content View */}
        <div className="p-4 sm:p-8 overflow-x-auto bg-slate-100 flex justify-center">
          <div
            ref={docRef}
            className="bg-white text-black p-8 sm:p-12 shadow-md w-full max-w-[210mm] min-h-[297mm] font-serif text-[12px] leading-relaxed border border-slate-300"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Header with PMIST Logo */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
              <img src="/logo.png" alt="PMIST Logo" className="h-16 w-16 object-contain" />
              <div className="text-center flex-1 px-4 font-serif">
                <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                  PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY
                </h1>
                <p className="text-[11px] font-sans text-slate-700">
                  (Deemed to be University) · Periyar Nagar, Vallam, Thanjavur - 613403. Tamil Nadu, India.
                </p>
                <p className="text-[11px] font-sans font-semibold text-slate-900 mt-1">
                  Faculty of Computing Science and Applications (FCSA) · DEPARTMENT OF INFORMATICS
                </p>
              </div>
              <div className="w-16 text-right text-[10px] font-mono text-slate-500">
                PMIST QMS
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-3">
              <span className="text-base font-bold uppercase tracking-widest border-b border-black pb-0.5">
                QUESTION BANK
              </span>
            </div>

            {/* Course Details Table */}
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase font-sans mb-1 text-slate-900">
                Course Details
              </h2>
              <table className="w-full border-collapse border border-black text-[11px] font-sans">
                <tbody>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50 w-28">Programme Code</td>
                    <td className="border border-black p-1.5 w-24">{course.programme_code || '172'}</td>
                    <td className="border border-black p-1.5 font-bold bg-slate-50 w-28">Programme Name</td>
                    <td className="border border-black p-1.5">{course.programme_name || 'B.Sc. Data Science'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Code</td>
                    <td className="border border-black p-1.5 font-mono font-bold">{course.code}</td>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Name</td>
                    <td className="border border-black p-1.5 font-bold">{course.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Category</td>
                    <td className="border border-black p-1.5">{course.course_category || 'Programme Core Courses'}</td>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Type</td>
                    <td className="border border-black p-1.5">{course.course_type || 'Theory Course'}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Batch</td>
                    <td className="border border-black p-1.5">{course.batch || '2023 - 2026'}</td>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Academic Year / Sem</td>
                    <td className="border border-black p-1.5">{course.academic_year} · Semester {course.semester}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Learning Hours</td>
                    <td className="border border-black p-1.5">{course.learning_hours || 45} Hrs</td>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">L T P C | CA / ESE</td>
                    <td className="border border-black p-1.5 font-mono font-semibold">
                      {course.l_hours ?? 3} {course.t_hours ?? 0} {course.p_hours ?? 0} {course.c_credits ?? 3} | {course.ca_marks ?? 40} / {course.ese_marks ?? 60}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Coordinator</td>
                    <td colSpan={3} className="border border-black p-1.5">
                      {course.course_coordinator || 'Dr. A. MUTHAMIZH SELVAN, Associate Professor, Department of Informatics'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5 font-bold bg-slate-50">Course Teacher</td>
                    <td colSpan={3} className="border border-black p-1.5">
                      {course.course_teacher || 'Mr. N. SENTHIL KUMAR, Assistant Professor (SS), Department of Informatics'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Course Outcomes Table */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase font-sans mb-1 text-slate-900">
                Course Outcomes
              </h2>
              <table className="w-full border-collapse border border-black text-[11px] font-sans">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-black p-1.5 w-14">COs</th>
                    <th className="border border-black p-1.5 text-left">Course Outcome Description</th>
                    <th className="border border-black p-1.5 w-20">RBT Level</th>
                  </tr>
                </thead>
                <tbody>
                  {cos.map((co) => (
                    <tr key={co.id || co.code}>
                      <td className="border border-black p-1.5 text-center font-bold font-mono">{co.code}</td>
                      <td className="border border-black p-1.5">{co.description}</td>
                      <td className="border border-black p-1.5 text-center font-mono font-semibold">
                        {co.k_level_code || co.k_level?.code || 'K2'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Units / Modules */}
            {modules.map((module) => {
              const modQuestions = questions.filter(
                (q) => q.module_id === module.id || q.unit_name === module.title
              );

              const secA = modQuestions.filter(
                (q) => q.section_type === 'SECTION_A' || q.mark_value === 1 || (q.options && q.options.length > 0)
              );
              const secB = modQuestions.filter(
                (q) => (q.section_type === 'SECTION_B' || q.mark_value === 2) && (!q.options || q.options.length === 0)
              );
              const secC = modQuestions.filter(
                (q) => (q.section_type === 'SECTION_C' || q.mark_value >= 5) && (!q.options || q.options.length === 0)
              );

              return (
                <div key={module.id} className="mt-8 pt-4 border-t-2 border-black space-y-4">
                  {/* Unit Title & Syllabus Line */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-slate-950">
                      UNIT {module.module_number}: {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-[10.5px] text-slate-700 italic mt-0.5 leading-relaxed font-sans">
                        {module.description}
                      </p>
                    )}
                  </div>

                  {/* Section A. Objective Type Questions */}
                  {secA.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-sans text-slate-900 uppercase">
                        A. Objective Type Questions (1 Mark Each)
                      </h4>
                      <table className="w-full border-collapse border border-black text-[11px] font-sans">
                        <thead>
                          <tr className="bg-slate-100 font-bold text-center">
                            <th className="border border-black p-1.5 w-10">Q.No</th>
                            <th className="border border-black p-1.5 text-left">Questions & Options</th>
                            <th className="border border-black p-1.5 w-12">COs</th>
                            <th className="border border-black p-1.5 w-14">RBTL</th>
                            <th className="border border-black p-1.5 w-16">Key Answers</th>
                            <th className="border border-black p-1.5 w-12">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secA.map((q, idx) => (
                            <tr key={q.id}>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.q_no || idx + 1}
                              </td>
                              <td className="border border-black p-1.5">
                                <div className="font-medium text-slate-900">
                                  <LatexContent content={q.question_text} />
                                </div>
                                {q.options && q.options.length > 0 && (
                                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px] mt-1 text-slate-800">
                                    {q.options.map((opt) => (
                                      <span key={opt.option_letter} className={opt.is_correct ? 'font-bold underline text-emerald-800' : ''}>
                                        ({opt.option_letter}) <LatexContent content={opt.option_text} />
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono">
                                {q.course_outcome?.code || 'CO1'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.k_level?.code || 'K1'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-bold text-slate-900 font-mono">
                                {q.key_answer || (q.options?.find((o) => o.is_correct) ? `(${q.options?.find((o) => o.is_correct)?.option_letter})` : '-')}
                              </td>
                              <td className="border border-black p-1.5 text-center font-bold font-mono">1</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Section B. Short Answers Questions */}
                  {secB.length > 0 && (
                    <div className="space-y-1 mt-4">
                      <h4 className="text-xs font-bold font-sans text-slate-900 uppercase">
                        B. Short Answers Questions (2 Marks Each)
                      </h4>
                      <table className="w-full border-collapse border border-black text-[11px] font-sans">
                        <thead>
                          <tr className="bg-slate-100 font-bold text-center">
                            <th className="border border-black p-1.5 w-10">Q.No</th>
                            <th className="border border-black p-1.5 text-left">Question</th>
                            <th className="border border-black p-1.5 w-12">COs</th>
                            <th className="border border-black p-1.5 w-14">RBTL</th>
                            <th className="border border-black p-1.5 text-left">Key Answer</th>
                            <th className="border border-black p-1.5 w-12">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secB.map((q, idx) => (
                            <tr key={q.id}>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.q_no || idx + 1}
                              </td>
                              <td className="border border-black p-1.5 font-medium text-slate-900">
                                <LatexContent content={q.question_text} />
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono">
                                {q.course_outcome?.code || 'CO1'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.k_level?.code || 'K1'}
                              </td>
                              <td className="border border-black p-1.5 text-slate-800 text-[10.5px] leading-snug">
                                {q.key_answer || '-'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-bold font-mono">2</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Section C. Descriptive Questions */}
                  {secC.length > 0 && (
                    <div className="space-y-1 mt-4">
                      <h4 className="text-xs font-bold font-sans text-slate-900 uppercase">
                        C. Descriptive Questions (Evaluation Scheme Included)
                      </h4>
                      <table className="w-full border-collapse border border-black text-[11px] font-sans">
                        <thead>
                          <tr className="bg-slate-100 font-bold text-center">
                            <th className="border border-black p-1.5 w-10">Q.No</th>
                            <th className="border border-black p-1.5 text-left">Question</th>
                            <th className="border border-black p-1.5 w-12">COs</th>
                            <th className="border border-black p-1.5 w-14">RBTL</th>
                            <th className="border border-black p-1.5 text-left">Evaluation Scheme</th>
                            <th className="border border-black p-1.5 w-12">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {secC.map((q, idx) => (
                            <tr key={q.id}>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.q_no || idx + 1}
                              </td>
                              <td className="border border-black p-1.5 font-medium text-slate-900">
                                <LatexContent content={q.question_text} />
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono">
                                {q.course_outcome?.code || 'CO1'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-mono font-semibold">
                                {q.k_level?.code || 'K2'}
                              </td>
                              <td className="border border-black p-1.5 text-slate-800 text-[10.5px] whitespace-pre-line leading-relaxed font-sans">
                                {q.evaluation_scheme || '-'}
                              </td>
                              <td className="border border-black p-1.5 text-center font-bold font-mono">
                                {q.mark_value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
