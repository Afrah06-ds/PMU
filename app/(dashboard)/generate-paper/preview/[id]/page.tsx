'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GeneratedPaperSnapshot, PaperSectionConfig } from '@/types';
import { PaperPreviewA4 } from '@/components/pdf/paper-preview-a4';
import { QuestionGeneratorEngine } from '@/lib/question-generator/generator-engine';
import { PaperService } from '@/services/paper.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PaperPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [paper, setPaper] = useState<GeneratedPaperSnapshot | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedPaperId, setSavedPaperId] = useState<string | null>(null);

  useEffect(() => {
    // If viewing saved paper from DB
    if (id && id !== 'new') {
      PaperService.getPaperById(id).then(saved => {
        if (saved) {
          setPaper(saved.snapshot_json);
          setIsSaved(true);
          setSavedPaperId(saved.id);
        }
      });
      return;
    }

    // Otherwise load from temporary generation session
    const temp = sessionStorage.getItem('pmu_temp_paper');
    const tempConfig = sessionStorage.getItem('pmu_temp_config');
    if (temp) {
      setPaper(JSON.parse(temp));
    }
    if (tempConfig) {
      setConfig(JSON.parse(tempConfig));
    }
  }, [id]);

  const handleRegenerate = async () => {
    if (!config) return;
    const res = await QuestionGeneratorEngine.generatePaper({
      department_id: config.department_id,
      course_id: config.course_id,
      sections: config.sections
    });

    if (res.success && res.paper) {
      setPaper(res.paper);
      sessionStorage.setItem('pmu_temp_paper', JSON.stringify(res.paper));
    } else {
      alert(res.errorMessage || 'Regeneration failed.');
    }
  };

  const handleSave = async () => {
    if (!paper || !config) return;
    const saved = await PaperService.savePaper({
      title: `${paper.course_code} ${paper.exam_name}`,
      department_id: config.department_id,
      course_id: config.course_id,
      semester: paper.semester,
      academic_year: paper.academic_year,
      date_of_exam: paper.date_of_exam,
      duration_minutes: paper.duration_minutes,
      total_marks: paper.total_marks,
      snapshot_json: paper
    });

    setIsSaved(true);
    setSavedPaperId(saved.id);
    alert('Generated Paper Snapshot successfully saved to database!');
    router.push('/generated-papers');
  };

  if (!paper) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium">
        <p>No paper preview available.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/generate-paper')}>
          Return to Paper Generator
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => router.push('/generate-paper')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Configurator
        </button>
      </div>

      <PaperPreviewA4
        paper={paper}
        onSave={handleSave}
        onRegenerate={config ? handleRegenerate : undefined}
        isSaved={isSaved}
      />
    </div>
  );
}
