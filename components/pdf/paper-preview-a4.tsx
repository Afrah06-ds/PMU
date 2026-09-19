'use client';

import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedPaperSnapshot, GeneratedPaperSection } from '@/types';
import { Button } from '@/components/ui/button';
import { LatexContent } from '@/components/ui/latex-content';
import { Printer, Download, Save, RefreshCw } from 'lucide-react';

interface PaperPreviewA4Props {
  paper: GeneratedPaperSnapshot;
  onSave?: () => void;
  onRegenerate?: () => void;
  isSaved?: boolean;
}

interface PageConfig {
  pageNumber: number;
  isFirstPage: boolean;
  sections: GeneratedPaperSection[];
}

export function PaperPreviewA4({ paper, onSave, onRegenerate, isSaved = false }: PaperPreviewA4Props) {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const pageElements = pageRefs.current.filter((el): el is HTMLDivElement => !!el);
    if (pageElements.length === 0) return;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }

      pdf.save(`${paper.course_code}_Examination_Paper.pdf`);
    } catch (e) {
      console.error('PDF Generation Error', e);
      window.print();
    }
  };

  const cleanText = (text?: string): string => {
    if (!text) return '';
    return text.replace(/\s+([.,!?:;])/g, '$1').trim();
  };

  // Height estimator for sections when DOM measurements are not yet ready
  const estimateSectionHeight = (sec: GeneratedPaperSection): number => {
    let h = 42; // Header + padding
    const questions = sec.questions || [];

    for (const q of questions) {
      if (q.is_or_choice) {
        const textA = q.question_text || '';
        const linesA = Math.max(1, Math.ceil(textA.length / 80));
        const heightA = linesA * 18 + 6;
        const heightOR = 22;
        const textB = q.alternative_question_text || textA;
        const linesB = Math.max(1, Math.ceil(textB.length / 80));
        const heightB = linesB * 18 + 6;
        h += heightA + heightOR + heightB + 14;
      } else {
        const text = q.question_text || '';
        const lines = Math.max(1, Math.ceil(text.length / 85));
        let qHeight = lines * 18 + 6;
        if (q.options && q.options.length > 0) {
          const maxOptLen = Math.max(...q.options.map(o => (o.option_text || '').length));
          const numRows = maxOptLen <= 22 ? 1 : maxOptLen <= 50 ? 2 : 4;
          qHeight += numRows * 18 + 6;
        }
        h += qHeight;
      }
    }
    return h;
  };

  // Measure actual DOM heights once mounted
  useLayoutEffect(() => {
    const newHeights: Record<string, number> = {};
    let hasChanged = false;

    paper.sections?.forEach(sec => {
      const el = sectionRefs.current[sec.id];
      if (el) {
        const h = el.offsetHeight;
        if (Math.abs((measuredHeights[sec.id] || 0) - h) > 10) {
          newHeights[sec.id] = h;
          hasChanged = true;
        } else {
          newHeights[sec.id] = measuredHeights[sec.id] || h;
        }
      }
    });

    if (hasChanged) {
      setMeasuredHeights(newHeights);
    }
  }, [paper, measuredHeights]);

  // Paginate sections across A4 pages:
  // RULE: If the complete section does not fit in the remaining space of the current page,
  // do not render even the first question of that section; move the entire section to the next page.
  const pages = useMemo<PageConfig[]>(() => {
    const sections = paper.sections || [];
    if (sections.length === 0) return [];

    // Usable height inside 297mm page (minus 32mm top/bottom padding and footer):
    // 297mm * 3.7795px/mm = ~1122px. Total inner padding = 120px. Footer = 30px.
    const PAGE_1_USABLE = 690; // Page 1 has ~270px top exam header
    const SUBSEQUENT_PAGE_USABLE = 950; // Page 2+ has no header, full usable space

    const resultPages: PageConfig[] = [];
    let currentSections: GeneratedPaperSection[] = [];
    let currentPageIndex = 0;
    let currentHeightUsed = 0;

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const secHeight = measuredHeights[sec.id] || estimateSectionHeight(sec);
      const maxAllowed = currentPageIndex === 0 ? PAGE_1_USABLE : SUBSEQUENT_PAGE_USABLE;

      if (currentHeightUsed + secHeight <= maxAllowed) {
        // Entire section fits on current page!
        currentSections.push(sec);
        currentHeightUsed += secHeight;
      } else {
        // Complete section does NOT fit in remaining space!
        // Move the ENTIRE section to the next page.
        if (currentSections.length > 0) {
          resultPages.push({
            pageNumber: resultPages.length + 1,
            isFirstPage: resultPages.length === 0,
            sections: currentSections
          });
          currentPageIndex++;
        }

        currentSections = [sec];
        currentHeightUsed = secHeight;
      }
    }

    if (currentSections.length > 0) {
      resultPages.push({
        pageNumber: resultPages.length + 1,
        isFirstPage: resultPages.length === 0,
        sections: currentSections
      });
    }

    return resultPages;
  }, [paper.sections, measuredHeights]);

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Hidden during print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            A4 Examination Paper Preview (PMU Format · {pages.length} Page{pages.length > 1 ? 's' : ''})
          </span>
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

      {/* Discrete Multi-Page A4 Preview Container */}
      <div className="overflow-x-auto pb-8 flex flex-col items-center gap-8">
        {pages.map((page, pageIdx) => (
          <div
            key={page.pageNumber}
            ref={el => { pageRefs.current[pageIdx] = el; }}
            className="a4-page-sheet print-sheet font-serif text-black leading-snug bg-white border shadow-lg relative flex flex-col justify-between"
            style={{
              width: '210mm',
              minHeight: '297mm',
              maxHeight: '297mm',
              padding: '16mm 18mm',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <div>
              {/* PAGE 1 ONLY: Full PMU Examination Header */}
              {page.isFirstPage && (
                <>
                  {/* Top Register No & Logo Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-sans">Register No.:</span>
                      <div className="flex border-t border-b border-l border-black">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-5 h-6 border-r border-black flex items-center justify-center text-xs font-mono"></div>
                        ))}
                      </div>
                    </div>

                    {/* PMU Crest Emblem */}
                    <div className="flex items-center justify-end text-right">
                      <img src="/logo.png" alt="PMIST QMS" className="paper-header-logo object-contain object-right" />
                    </div>
                  </div>

                  {/* Exam Header Titles */}
                  <div className="text-center space-y-0.5 mb-3">
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
                  <div className="flex items-center justify-between text-xs font-bold py-1 mb-1 border-b border-black/20 pb-1">
                    <span>Time: {Math.floor(paper.duration_minutes / 60)} Hours</span>
                    <span>Maximum Marks: {paper.total_marks}</span>
                  </div>

                  {/* Instructions */}
                  <div className="mb-3 text-xs">
                    <p className="font-bold">Instructions to the Candidates</p>
                    <p className="italic font-medium text-[11px]">Answer all the Questions</p>
                  </div>
                </>
              )}

              {/* Sections for this Page */}
              <div className="space-y-4">
                {page.sections.map(sec => {
                  const numQ = sec.num_questions ?? sec.questions?.length ?? 0;
                  const marksPerQ = sec.marks_per_question ?? sec.questions?.[0]?.marks ?? 0;
                  const secTotal = sec.total_section_marks || (numQ * marksPerQ);
                  const isMCQSec = marksPerQ === 1 || sec.section_name.toUpperCase().includes('PART - A') || sec.section_order === 1;

                  return (
                    <div
                      key={sec.id}
                      ref={el => { sectionRefs.current[sec.id] = el; }}
                      className="space-y-2.5"
                    >
                      {/* Section Title Header */}
                      <div className="text-center py-0.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          {sec.section_name} ({numQ} × {marksPerQ} = {secTotal} MARKS)
                        </h4>
                      </div>

                      {/* Section Questions */}
                      <div className="space-y-2.5">
                        {sec.questions?.map((q) => (
                          <div key={q.id} className="text-[11px] font-serif leading-snug">
                            {q.is_or_choice ? (
                              /* OR Pattern Question Rendering (Part C / Descriptive) */
                              <div className="space-y-1.5 py-1">
                                {/* Choice A */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                    <span className="font-bold shrink-0 w-6 text-right font-serif">{q.question_number}.</span>
                                    <span className="font-bold shrink-0 font-serif">(a)</span>
                                    <div className="flex-1 min-w-0 font-serif whitespace-pre-line text-justify leading-relaxed">
                                      <LatexContent content={cleanText(q.question_text)} />
                                    </div>
                                  </div>
                                  <span className="font-bold shrink-0 font-serif text-[11px] pl-2 text-right pt-0.5">
                                    ({q.marks || marksPerQ})
                                  </span>
                                </div>

                                {/* OR Separator */}
                                <div className="text-center font-bold text-xs uppercase py-0.5 tracking-widest text-slate-800 font-serif">
                                  (OR)
                                </div>

                                {/* Choice B */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                    <span className="shrink-0 w-6"></span>
                                    <span className="font-bold shrink-0 font-serif">(b)</span>
                                    <div className="flex-1 min-w-0 font-serif whitespace-pre-line text-justify leading-relaxed">
                                      <LatexContent content={cleanText(q.alternative_question_text || q.question_text)} />
                                    </div>
                                  </div>
                                  <span className="font-bold shrink-0 font-serif text-[11px] pl-2 text-right pt-0.5">
                                    ({q.marks || marksPerQ})
                                  </span>
                                </div>
                              </div>
                            ) : (
                              /* Single Question Rendering (Part A or Part B) */
                              <div className="py-0.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                                    <span className="font-bold shrink-0 w-6 text-right font-serif">{q.question_number}.</span>
                                    <div className="flex-1 min-w-0 font-serif whitespace-pre-line text-justify leading-snug">
                                      <LatexContent content={cleanText(q.question_text)} />
                                    </div>
                                  </div>
                                  {!isMCQSec && (
                                    <span className="font-bold shrink-0 font-serif text-[11px] pl-2 text-right pt-0.5">
                                      ({q.marks || marksPerQ})
                                    </span>
                                  )}
                                </div>

                                {/* MCQ Options: Adaptive grid layout with pristine alignment, never truncated */}
                                {isMCQSec && q.options && q.options.length > 0 && (() => {
                                  const maxOptLen = Math.max(...q.options.map(o => (cleanText(o.option_text) || '').length));
                                  const gridColsClass = maxOptLen <= 22 ? 'grid-cols-4 gap-x-2' : maxOptLen <= 50 ? 'grid-cols-2 gap-x-4 gap-y-1' : 'grid-cols-1 gap-y-1';

                                  return (
                                    <div className={`grid ${gridColsClass} pl-8 pt-1 pb-0.5 text-[11px] font-serif leading-snug`}>
                                      {q.options.map((opt) => (
                                        <div key={opt.option_letter} className="flex items-start gap-1 min-w-0">
                                          <span className="font-bold shrink-0 w-4 font-serif">({opt.option_letter.toLowerCase()})</span>
                                          <div className="flex-1 min-w-0 font-serif">
                                            <LatexContent content={cleanText(opt.option_text)} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Page Bottom Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans pt-2 border-t border-slate-200 mt-auto">
              <span>{paper.course_code} · {paper.exam_name_line1 || paper.exam_name}</span>
              <span className="font-semibold">Page {page.pageNumber} of {pages.length}</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-page-sheet {
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 16mm 18mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .a4-page-sheet:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

