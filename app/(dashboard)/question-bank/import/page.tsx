'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { QuestionService } from '@/services/question.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileUp,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  Layers,
  Check,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function RefinedImportQuestionsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        question_text: 'Which protocol layer is responsible for bit-level transmission across a physical medium?',
        mark_value: 1,
        co_code: 'CO1',
        k_code: 'K1',
        option_a: 'Data Link Layer',
        option_b: 'Physical Layer',
        option_c: 'Network Layer',
        option_d: 'Transport Layer',
        correct_option: 'b'
      },
      {
        question_text: 'Define bit stuffing and explain why it is required in data link framing.',
        mark_value: 2,
        co_code: 'CO1',
        k_code: 'K2',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: ''
      },
      {
        question_text: 'Explain Thread Synchronization in Java using Producer-Consumer pattern.',
        mark_value: 15,
        co_code: 'CO3',
        k_code: 'K4',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions_Template');
    XLSX.writeFile(wb, 'pmu_question_bank_template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws);
        setParsedData(data);
      } catch (err) {
        alert('Failed to parse file. Please upload a valid CSV or Excel spreadsheet file.');
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  const handleConfirmImport = async () => {
    if (parsedData.length === 0) return;
    setImporting(true);

    const questionsToSave = parsedData.map(row => {
      const isMCQ = Number(row.mark_value) === 1 || Boolean(row.option_a);
      const options = isMCQ
        ? [
            { option_letter: 'a' as const, option_text: String(row.option_a || 'Option A'), is_correct: String(row.correct_option).toLowerCase() === 'a' },
            { option_letter: 'b' as const, option_text: String(row.option_b || 'Option B'), is_correct: String(row.correct_option).toLowerCase() === 'b' },
            { option_letter: 'c' as const, option_text: String(row.option_c || 'Option C'), is_correct: String(row.correct_option).toLowerCase() === 'c' },
            { option_letter: 'd' as const, option_text: String(row.option_d || 'Option D'), is_correct: String(row.correct_option).toLowerCase() === 'd' }
          ]
        : [];

      return {
        question_text: String(row.question_text || ''),
        mark_value: Number(row.mark_value) || 1,
        options
      };
    });

    const count = await QuestionService.bulkImport(questionsToSave);
    setImporting(false);
    setSuccessCount(count);
    setTimeout(() => {
      router.push('/question-bank');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 px-4 py-3.5 sm:px-5 sm:py-4 text-white shadow-md border border-slate-800/80">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                <Badge variant="primary" className="bg-brand-500/20 text-brand-300 border-brand-400/30 text-[10px] py-0 px-2 font-medium">
                  <Sparkles className="w-3 h-3 text-brand-400 mr-1" /> Bulk Question Importer
                </Badge>
                <span className="text-[10px] text-slate-400 font-medium">• PMIST EMS</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight font-poppins text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-400" />
                <span>Spreadsheet Question Importer</span>
              </h1>
              <p className="text-[11px] text-slate-300 leading-tight font-sans">
                Upload question banks in bulk using Microsoft Excel (.xlsx) or CSV spreadsheets.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadTemplate}
            className="h-7 px-3 text-xs border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium shadow-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download Sample Template</span>
          </Button>
        </div>
      </div>

      {/* 2. File Upload Zone Card */}
      <Card className="p-8 text-center border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/10 transition-all rounded-2xl bg-white shadow-xs space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto shadow-xs">
          <FileUp className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Upload CSV or Excel Spreadsheet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Supports <span className="font-semibold text-slate-700">.xlsx, .xls</span>, and <span className="font-semibold text-slate-700">.csv</span> formatted question banks.
          </p>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-brand-600/20 transition-all">
            <FileUp className="w-4 h-4" />
            <span>Select File to Import</span>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{file.name}</span>
              <span className="text-[11px] font-normal opacity-80">({parsedData.length} questions detected)</span>
            </span>
          </div>
        )}
      </Card>

      {/* 3. Parsed Data Preview & Confirm Import Table */}
      {parsedData.length > 0 && (
        <Card className="p-6 space-y-5 border-slate-200 shadow-sm bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Parsed Spreadsheet Preview ({parsedData.length} Questions Ready)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Review question statement preview before completing bulk import.</p>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleConfirmImport}
              disabled={importing}
              className="h-8 px-4 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 shrink-0"
            >
              {importing ? (
                <span>Importing...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1 stroke-[3]" />
                  <span>Confirm & Import {parsedData.length} Questions</span>
                </>
              )}
            </Button>
          </div>

          {successCount !== null && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>Successfully imported {successCount} questions into syllabus question bank! Redirecting to Question Bank...</span>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Question Statement</th>
                  <th className="p-3 w-20">Marks</th>
                  <th className="p-3 w-20">CO</th>
                  <th className="p-3 w-20">K-Level</th>
                  <th className="p-3">Option Preview (MCQ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.slice(0, 15).map((row, idx) => {
                  const isMCQ = Number(row.mark_value) === 1 || Boolean(row.option_a);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3 font-medium text-slate-900 max-w-md">
                        <p className="line-clamp-2">{row.question_text || 'Untitled Question'}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="primary" className="text-[10px] font-bold">
                          {row.mark_value || 1} M
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="warning" className="text-[10px] font-mono">
                          {row.co_code || 'CO1'}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="info" className="text-[10px] font-mono">
                          {row.k_code || 'K1'}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-500">
                        {isMCQ ? (
                          <div className="space-y-0.5 text-[11px]">
                            <p className={row.correct_option?.toLowerCase() === 'a' ? 'font-bold text-emerald-700' : ''}>
                              a) {row.option_a || '—'}
                            </p>
                            <p className={row.correct_option?.toLowerCase() === 'b' ? 'font-bold text-emerald-700' : ''}>
                              b) {row.option_b || '—'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Subjective / Descriptive</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {parsedData.length > 15 && (
            <p className="text-[11px] text-slate-400 text-center font-medium">
              Showing first 15 records of {parsedData.length} total detected questions.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
