import { createClient } from '@/lib/supabase/client';
import { GeneratedPaper, GeneratedPaperSnapshot } from '@/types';
import { MasterDataService } from './master-data.service';

export class PaperService {
  static async getPapers(): Promise<GeneratedPaper[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('generated_papers')
        .select('*, department:departments(*), course:courses(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as GeneratedPaper[];
      }
    } catch (e) {
      console.warn('Supabase getPapers error:', e);
    }

    return [];
  }

  static async getPaperById(id: string): Promise<GeneratedPaper | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('generated_papers')
        .select('*, department:departments(*), course:courses(*)')
        .eq('id', id)
        .single();

      if (!error && data) return data as GeneratedPaper;
    } catch (e) {
      console.warn('Supabase getPaperById error:', e);
    }

    const papers = await this.getPapers();
    return papers.find(p => p.id === id) || null;
  }

  static async savePaper(paperData: {
    id?: string;
    title: string;
    department_id: string;
    course_id: string;
    semester: number;
    academic_year: string;
    date_of_exam: string;
    duration_minutes: number;
    total_marks: number;
    snapshot_json: GeneratedPaperSnapshot;
    created_by?: string;
  }): Promise<GeneratedPaper> {
    const supabase = createClient();
    const paperCode = `QP-${Date.now().toString().slice(-6)}`;
    const pId = paperData.id || crypto.randomUUID();

    const payload = {
      id: pId,
      title: paperData.title,
      paper_code: paperCode,
      department_id: paperData.department_id,
      course_id: paperData.course_id,
      college_name: paperData.snapshot_json.college_name,
      exam_name: paperData.snapshot_json.exam_name,
      semester: paperData.semester,
      academic_year: paperData.academic_year,
      date_of_exam: paperData.date_of_exam,
      duration_minutes: paperData.duration_minutes,
      total_marks: paperData.total_marks,
      instructions: paperData.snapshot_json.instructions,
      status: 'saved',
      snapshot_json: paperData.snapshot_json,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('generated_papers')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) return data as GeneratedPaper;
    } catch (e) {
      console.error('Save paper error:', e);
    }

    return payload as unknown as GeneratedPaper;
  }

  static async deletePaper(id: string): Promise<void> {
    try {
      const supabase = createClient();
      await supabase.from('generated_papers').delete().eq('id', id);
    } catch (e) {
      console.error('Delete paper error:', e);
    }
  }
}
