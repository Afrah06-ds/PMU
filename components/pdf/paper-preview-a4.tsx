'use client';

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedPaperSnapshot } from '@/types';
import { Button } from '@/components/ui/button';
import { Printer, Download, Save, RefreshCw } from 'lucide-react';

interface PaperPreviewA4Props {
  paper: GeneratedPaperSnapshot;
  onSave?: () => void;
  onRegenerate?: () => void;
  isSaved?: boolean;
}

export function PaperPreviewA4({ paper, onSave, onRegenerate, isSaved = false }: PaperPreviewA4Props) {
  const paperRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!paperRef.current) return;
    try {
      const element = paperRef.current;
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

      pdf.save(`${paper.course_code}_Examination_Paper.pdf`);
    } catch (e) {
      console.error('PDF Generation Error', e);
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">A4 Examination Paper Preview (PMU Format)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Questions</span>
            </Button>
          )}

          {onSave && !isSaved && (
            <Button variant="primary" size="sm" onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-3.5 h-3.5" />
              <span>Save Paper Snapshot</span>
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" />
            <span>Print (Ctrl+P)</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-3.5 h-3.5" />
            <span>Download A4 PDF</span>
          </Button>
        </div>
      </div>

      {/* A4 Paper Document Screen Preview */}
      <div className="overflow-x-auto pb-8 flex justify-center">
        <div
          ref={paperRef}
          className="a4-paper-preview print-container font-serif text-black leading-snug bg-white p-8 border shadow-lg"
          style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
          {/* Top Register No & Logo Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-sans">Register No.:</span>
              <div className="flex border-t border-b border-l border-black">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-5 h-6 border-r border-black flex items-center justify-center text-xs font-mono">
                    
                  </div>
                ))}
              </div>
            </div>

            {/* PMU Crest Emblem */}
            <div className="flex items-center gap-2 text-right">
              <img src="/logo.png" alt="PMU Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>

          {/* Exam Header Titles */}
          <div className="text-center space-y-1 mb-4">
            <h1 className="text-sm font-bold tracking-wide uppercase font-serif">
              {paper.exam_name_line1 || paper.exam_name || 'ARTS & SCIENCE DEGREE EXAMINATIONS, APRIL / MAY 2026'}
            </h1>
            <h2 className="text-xs font-bold tracking-wide text-slate-800">
              {paper.exam_name_line2 || 'End Semester Examinations : III Semester'}
            </h2>
            <h3 className="text-xs font-bold tracking-wide uppercase">
              {paper.target_branch_class || 'COMMON TO ALL'}
            </h3>
            <p className="text-[11px] font-semibold">Academic Year: {paper.academic_year}</p>
            <h3 className="text-xs font-extrabold tracking-wide uppercase pt-1">
              {paper.course_code} {paper.course_name.toUpperCase()}
            </h3>
          </div>

          {/* Time & Maximum Marks Row */}
          <div className="flex items-center justify-between text-xs font-bold py-1 mb-2">
            <span>Time: {Math.floor(paper.duration_minutes / 60)} Hours</span>
            <span>Maximum Marks: {paper.total_marks}</span>
          </div>

          {/* Instructions */}
          <div className="mb-4 text-xs">
            <p className="font-bold">Instructions to the Candidates</p>
            <p className="italic font-medium text-[11px]">Answer all the Questions</p>
          </div>

          {/* Sections Render Loop */}
          <div className="space-y-5">
            {paper.sections?.map(sec => (
              <div key={sec.id} className="space-y-3">
                {/* Section Title Header */}
                <div className="text-center py-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {sec.section_name} ({(sec.num_questions ?? sec.questions?.length ?? 0)} × {(sec.marks_per_question ?? sec.questions?.[0]?.marks ?? 0)} = {sec.total_section_marks || ((sec.num_questions ?? sec.questions?.length ?? 0) * (sec.marks_per_question ?? sec.questions?.[0]?.marks ?? 0))} Marks)
                  </h4>
                </div>

                {/* Section Questions */}
                <div className="space-y-3">
                  {sec.questions?.map(q => (
                    <div key={q.id} className="text-[11px] leading-normal">
                      {q.is_or_choice ? (
                        /* OR Pattern Question Rendering */
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="pr-4">
                              <span className="font-bold mr-1.5">{q.question_number}. (a)</span>
                              <span>{q.question_text}</span>
                            </div>
                            <span className="font-bold shrink-0">({q.marks})</span>
                          </div>

                          {/* MCQ options if any */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-4 gap-x-2 gap-y-1 pl-6 pt-1">
                              {q.options.map(opt => (
                                <div key={opt.option_letter}>
                                  <span className="font-bold mr-1">{opt.option_letter}.</span>
                                  <span>{opt.option_text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* OR Separator */}
                          <div className="text-center font-bold text-xs uppercase py-1">
                            (OR)
                          </div>

                          <div className="flex items-start justify-between">
                            <div className="pr-4 pl-4">
                              <span className="font-bold mr-1.5">(b)</span>
                              <span>{q.alternative_question_text || q.question_text}</span>
                            </div>
                            <span className="font-bold shrink-0">({q.marks})</span>
                          </div>
                        </div>
                      ) : (
                        /* Standard Single Question Rendering */
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <span className="font-bold mr-2 inline-block w-4">{q.question_number}</span>
                              <span>{q.question_text}</span>
                            </div>
                            {q.marks > 1 && (
                              <span className="font-bold shrink-0">({q.marks})</span>
                            )}
                          </div>

                          {/* MCQ Options 4-Column Grid exactly like PMU paper sample */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-4 gap-x-2 gap-y-1 pl-6 pt-1 mt-0.5">
                              {q.options.map(opt => (
                                <div key={opt.option_letter} className="truncate">
                                  <span className="font-bold mr-1">{opt.option_letter}.</span>
                                  <span>{opt.option_text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

