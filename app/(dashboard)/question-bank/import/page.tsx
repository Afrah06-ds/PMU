'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { QuestionService } from '@/services/question.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, Download, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportQuestionsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        question_text: 'What is the default header size of an IPv4 packet without options?',
        mark_value: 1,
        co_code: 'CO1',
        k_code: 'K1',
        option_a: '16 Bytes',
        option_b: '20 Bytes',
        option_c: '32 Bytes',
        option_d: '40 Bytes',
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
        alert('Failed to parse file. Please upload a valid CSV or Excel file.');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileUp className="w-6 h-6 text-brand-600" />
              Bulk Question Importer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Upload questions in bulk via CSV or Microsoft Excel spreadsheets.</p>
          </div>
        </div>

        <Button variant="outline" onClick={handleDownloadTemplate}>
          <Download className="w-4 h-4" />
          <span>Download Sample Template</span>
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="p-8 text-center border-2 border-dashed border-slate-300 hover:border-brand-500 transition-all bg-slate-50/50">
        <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Choose CSV or Excel Spreadsheet</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Supports .xlsx, .xls, and .csv files up to 10MB.</p>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-all">
          <FileUp className="w-4 h-4" />
          <span>Browse File</span>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {file && (
          <p className="mt-3 text-xs font-semibold text-brand-700 bg-brand-50 inline-block px-3 py-1 rounded-full border border-brand-200">
            Selected: {file.name} ({parsedData.length} records detected)
          </p>
        )}
      </Card>

      {/* Preview Table */}
      {parsedData.length > 0 && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Parsed Preview ({parsedData.length} Questions Ready)
            </h3>
            <Button
              variant="primary"
              onClick={handleConfirmImport}
              disabled={importing}
            >
              {importing ? 'Importing...' : `Import ${parsedData.length} Questions`}
            </Button>
          </div>

          {successCount !== null && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Successfully imported {successCount} questions into question bank! Redirecting...
            </div>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-500">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Question Statement</th>
                  <th className="p-2.5">Marks</th>
                  <th className="p-2.5">CO</th>
                  <th className="p-2.5">K-Level</th>
                  <th className="p-2.5">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-2.5 font-medium text-slate-900 line-clamp-1">{row.question_text}</td>
                    <td className="p-2.5 font-bold">{row.mark_value} m</td>
                    <td className="p-2.5 font-mono">{row.co_code || 'CO1'}</td>
                    <td className="p-2.5 font-mono">{row.k_code || 'K1'}</td>
                    <td className="p-2.5 text-slate-500">
                      {row.option_a ? `a) ${row.option_a.slice(0, 10)}...` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
