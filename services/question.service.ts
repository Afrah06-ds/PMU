import { createClient } from '@/lib/supabase/client';
import { Question } from '@/types';
import { MasterDataService } from './master-data.service';

export interface QuestionFilter {
  department_id?: string;
  course_id?: string;
  module_id?: string;
  course_outcome_id?: string;
  course_outcome_ids?: string[];
  k_level_id?: string;
  k_level_ids?: string[];
  question_type_id?: string;
  mark_value?: number;
  search_query?: string;
  section_type?: 'ALL' | 'A' | 'B' | 'C' | 'SECTION_A' | 'SECTION_B' | 'SECTION_C';
}

const QUESTIONS_CACHE_KEY = 'pmu_questions_cache';

export class QuestionService {
  private static memoryStore: Question[] = [];

  private static getLocalQuestions(): Question[] {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(QUESTIONS_CACHE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        console.warn('Failed to parse local questions cache:', e);
      }
    }
    return this.memoryStore || [];
  }

  private static saveLocalQuestions(questions: Question[]): void {
    this.memoryStore = questions;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions));
      } catch (e) {
        console.warn('Failed to set local questions cache:', e);
      }
    }
  }

  static async getQuestions(filters?: QuestionFilter): Promise<Question[]> {
    let rawQuestions: Question[] = [];
    let fetchedFromDb = false;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          department:departments(*),
          course:courses(*),
          module:modules(*),
          course_outcome:course_outcomes(*),
          k_level:k_levels(*),
          question_type:question_types(*),
          options:question_options(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        rawQuestions = data as Question[];
        fetchedFromDb = true;
      }
    } catch (e) {
      console.warn('Supabase questions fetch error, using local fallback:', e);
    }

    const localQuestions = this.getLocalQuestions();

    // Merge DB questions with local cache questions (deduped by ID)
    const combinedMap = new Map<string, Question>();

    rawQuestions.forEach(q => combinedMap.set(q.id, q));
    localQuestions.forEach(q => combinedMap.set(q.id, q));

    let allQuestions = Array.from(combinedMap.values());

    // Hydrate missing relation objects using MasterDataService
    const [depts, courses, modules, cos, klevels, types] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getModules(),
      MasterDataService.getCourseOutcomes(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes()
    ]);

    allQuestions = allQuestions.map(q => ({
      ...q,
      department: q.department || depts.find(d => d.id === q.department_id),
      course: q.course || courses.find(c => c.id === q.course_id),
      module: q.module || modules.find(m => m.id === q.module_id),
      course_outcome: q.course_outcome || cos.find(co => co.id === q.course_outcome_id),
      k_level: q.k_level || klevels.find(k => k.id === q.k_level_id),
      question_type: q.question_type || types.find(t => t.id === q.question_type_id)
    }));

    if (!filters) return allQuestions;

    return allQuestions.filter(q => {
      if (filters.department_id && q.department_id !== filters.department_id) return false;
      if (filters.course_id && q.course_id !== filters.course_id) return false;
      if (filters.module_id && q.module_id !== filters.module_id) return false;
      
      if (filters.course_outcome_ids && filters.course_outcome_ids.length > 0) {
        if (!filters.course_outcome_ids.includes(q.course_outcome_id)) return false;
      } else if (filters.course_outcome_id && q.course_outcome_id !== filters.course_outcome_id) {
        return false;
      }

      if (filters.k_level_ids && filters.k_level_ids.length > 0) {
        if (!filters.k_level_ids.includes(q.k_level_id)) return false;
      } else if (filters.k_level_id && q.k_level_id !== filters.k_level_id) {
        return false;
      }

      if (filters.question_type_id && q.question_type_id !== filters.question_type_id) return false;
      if (filters.mark_value !== undefined && Number(q.mark_value) !== Number(filters.mark_value)) return false;

      if (filters.section_type && filters.section_type !== 'ALL') {
        const sec = filters.section_type.replace('SECTION_', '');
        if (sec === 'A') {
          // Section A: Objective / MCQ / 1 Mark
          const isSecA = q.section_type === 'A' || q.section_type === 'SECTION_A' || q.mark_value === 1 || q.question_type?.code === 'MCQ' || (q.options && q.options.length > 0);
          if (!isSecA) return false;
        } else if (sec === 'B') {
          // Section B: Short Answers / 2 Marks
          const isSecB = q.section_type === 'B' || q.section_type === 'SECTION_B' || q.mark_value === 2 || q.question_type?.code === 'SHORT';
          if (!isSecB) return false;
        } else if (sec === 'C') {
          // Section C: Descriptive / 5+ Marks
          const isSecC = q.section_type === 'C' || q.section_type === 'SECTION_C' || q.mark_value >= 5 || q.question_type?.code === 'LONG';
          if (!isSecC) return false;
        }
      }

      if (filters.search_query) {
        const query = filters.search_query.toLowerCase();
        const matchesText = q.question_text.toLowerCase().includes(query) || (q.key_answer && q.key_answer.toLowerCase().includes(query)) || (q.evaluation_scheme && q.evaluation_scheme.toLowerCase().includes(query));
        if (!matchesText) return false;
      }
      return true;
    });
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          department:departments(*),
          course:courses(*),
          module:modules(*),
          course_outcome:course_outcomes(*),
          k_level:k_levels(*),
          question_type:question_types(*),
          options:question_options(*)
        `)
        .eq('id', id)
        .single();

      if (!error && data) return data as Question;
    } catch (e) {
      console.warn('Supabase getQuestionById error:', e);
    }

    const questions = await this.getQuestions();
    return questions.find(q => q.id === id) || null;
  }

  static async saveQuestion(questionData: Partial<Question>): Promise<Question> {
    const supabase = createClient();
    const qId = questionData.id || crypto.randomUUID();

    const marks = Number(questionData.mark_value) || 1;
    let secType = questionData.section_type;
    if (!secType) {
      if (marks === 1 || (questionData.options && questionData.options.length > 0)) {
        secType = 'SECTION_A';
      } else if (marks === 2) {
        secType = 'SECTION_B';
      } else {
        secType = 'SECTION_C';
      }
    }

    // Hydrate relations and ensure valid foreign keys for DB insert
    const [depts, courses, modules, cos, klevels, types, marksList] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getModules(),
      MasterDataService.getCourseOutcomes(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes(),
      MasterDataService.getMarks()
    ]);

    let marksId = questionData.marks_id;
    if (!marksId || !marksList.some(m => m.id === marksId)) {
      const matchedMark = marksList.find(m => Number(m.mark_value) === marks);
      marksId = matchedMark ? matchedMark.id : (marksList[0]?.id || 'e0000001-0000-0000-0000-000000000001');
    }

    let qTypeId = questionData.question_type_id;
    if (!qTypeId || !types.some(t => t.id === qTypeId)) {
      let matchedType = types.find(t => t.code === qTypeId);
      if (!matchedType) {
        if (marks === 1 || (questionData.options && questionData.options.length > 0)) matchedType = types.find(t => t.code === 'MCQ');
        else if (marks === 2) matchedType = types.find(t => t.code === 'SHORT');
        else matchedType = types.find(t => t.code === 'LONG');
      }
      qTypeId = matchedType ? matchedType.id : (types[0]?.id || 'd1111111-1111-1111-1111-111111111111');
    }

    let kLevelId = questionData.k_level_id;
    if (!kLevelId || !klevels.some(k => k.id === kLevelId)) {
      const matchedK = klevels.find(k => k.code === kLevelId);
      kLevelId = matchedK ? matchedK.id : (klevels[0]?.id || 'e1111111-1111-1111-1111-111111111111');
    }

    let deptId = questionData.department_id;
    if (!deptId) {
      const matchedCourse = courses.find(c => c.id === questionData.course_id);
      deptId = matchedCourse?.department_id || depts[0]?.id;
    }

    const dbPayload = {
      id: qId,
      department_id: deptId,
      course_id: questionData.course_id,
      module_id: questionData.module_id,
      course_outcome_id: questionData.course_outcome_id,
      k_level_id: kLevelId,
      question_type_id: qTypeId,
      marks_id: marksId,
      mark_value: marks,
      question_text: questionData.question_text || '',
      updated_at: new Date().toISOString()
    };

    let savedQuestion: Partial<Question> = { ...questionData, id: qId, mark_value: marks, section_type: secType, options: questionData.options || [] };

    try {
      const { data, error } = await supabase
        .from('questions')
        .upsert(dbPayload)
        .select()
        .single();

      if (!error && data) {
        savedQuestion = { ...savedQuestion, ...data, options: questionData.options || [] };
        if (questionData.options && questionData.options.length > 0) {
          await supabase.from('question_options').delete().eq('question_id', qId);
          const optionsPayload = questionData.options.map(opt => ({
            id: opt.id || crypto.randomUUID(),
            question_id: qId,
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          }));
          await supabase.from('question_options').insert(optionsPayload);
        }
      } else if (error) {
        console.error('Save question Supabase error:', error);
      }
    } catch (e) {
      console.error('Save question Supabase error:', e);
    }

    const fullQuestion: Question = {
      ...savedQuestion,
      id: qId,
      department_id: deptId || '',
      course_id: questionData.course_id || '',
      module_id: questionData.module_id || '',
      course_outcome_id: questionData.course_outcome_id || '',
      k_level_id: kLevelId,
      question_type_id: qTypeId,
      marks_id: marksId,
      mark_value: marks,
      question_text: questionData.question_text || '',
      key_answer: questionData.key_answer || '',
      evaluation_scheme: questionData.evaluation_scheme || '',
      unit_name: questionData.unit_name || '',
      unit_syllabus: questionData.unit_syllabus || '',
      section_type: secType,
      q_no: questionData.q_no,
      department: depts.find(d => d.id === deptId),
      course: courses.find(c => c.id === questionData.course_id),
      module: modules.find(m => m.id === questionData.module_id),
      course_outcome: cos.find(co => co.id === questionData.course_outcome_id),
      k_level: klevels.find(k => k.id === kLevelId),
      question_type: types.find(t => t.id === qTypeId),
      options: questionData.options || []
    } as Question;

    // Update local cache
    const currentLocal = this.getLocalQuestions();
    const index = currentLocal.findIndex(q => q.id === qId);
    let updatedLocal: Question[];
    if (index >= 0) {
      updatedLocal = [...currentLocal];
      updatedLocal[index] = fullQuestion;
    } else {
      updatedLocal = [fullQuestion, ...currentLocal];
    }
    this.saveLocalQuestions(updatedLocal);

    return fullQuestion;
  }

  static async deleteQuestion(id: string): Promise<void> {
    try {
      const supabase = createClient();
      await supabase.from('questions').delete().eq('id', id);
    } catch (e) {
      console.error('Delete question error:', e);
    }

    const currentLocal = this.getLocalQuestions();
    const updatedLocal = currentLocal.filter(q => q.id !== id);
    this.saveLocalQuestions(updatedLocal);
  }

  static async countAvailableQuestions(filter: {
    course_id: string;
    mark_value: number;
    module_id?: string;
    course_outcome_id?: string;
    k_level_id?: string;
    question_type_code?: string;
  }): Promise<number> {
    const questions = await this.getQuestions();
    return questions.filter(q => {
      if (q.course_id !== filter.course_id) return false;
      if (Number(q.mark_value) !== Number(filter.mark_value)) return false;
      if (filter.module_id && q.module_id !== filter.module_id) return false;
      if (filter.course_outcome_id && q.course_outcome_id !== filter.course_outcome_id) return false;
      if (filter.k_level_id && q.k_level_id !== filter.k_level_id) return false;
      if (filter.question_type_code && q.question_type?.code !== filter.question_type_code) return false;
      return true;
    }).length;
  }

  static async bulkImport(
    importedQuestions: Partial<Question>[],
    onProgress?: (current: number, total: number, percentage: number) => void
  ): Promise<number> {
    const valid = importedQuestions.filter(q => !!q.question_text);
    const total = valid.length;
    if (total === 0) return 0;

    const [depts, courses, modules, cos, klevels, types, marksList] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getModules(),
      MasterDataService.getCourseOutcomes(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes(),
      MasterDataService.getMarks()
    ]);

    const supabase = createClient();
    let count = 0;
    const batchSize = 25;
    const allFullQuestions: Question[] = [];

    for (let i = 0; i < total; i += batchSize) {
      const batch = valid.slice(i, i + batchSize);
      const dbRows: any[] = [];
      const optionsRows: any[] = [];
      const batchFullQuestions: Question[] = [];

      for (const raw of batch) {
        const qId = raw.id || crypto.randomUUID();
        const marks = Number(raw.mark_value) || 1;

        let marksId = raw.marks_id;
        if (!marksId || !marksList.some(m => m.id === marksId)) {
          const matchedMark = marksList.find(m => Number(m.mark_value) === marks);
          marksId = matchedMark ? matchedMark.id : (marksList[0]?.id || 'e0000001-0000-0000-0000-000000000001');
        }

        let qTypeId = raw.question_type_id;
        if (!qTypeId || !types.some(t => t.id === qTypeId)) {
          let matchedType = types.find(t => t.code === qTypeId);
          if (!matchedType) {
            if (marks === 1 || (raw.options && raw.options.length > 0)) matchedType = types.find(t => t.code === 'MCQ');
            else if (marks === 2) matchedType = types.find(t => t.code === 'SHORT');
            else matchedType = types.find(t => t.code === 'LONG');
          }
          qTypeId = matchedType ? matchedType.id : (types[0]?.id || 'd1111111-1111-1111-1111-111111111111');
        }

        let kLevelId = raw.k_level_id;
        if (!kLevelId || !klevels.some(k => k.id === kLevelId)) {
          const matchedK = klevels.find(k => k.code === kLevelId);
          kLevelId = matchedK ? matchedK.id : (klevels[0]?.id || 'e1111111-1111-1111-1111-111111111111');
        }

        let deptId = raw.department_id;
        if (!deptId) {
          const matchedCourse = courses.find(c => c.id === raw.course_id);
          deptId = matchedCourse?.department_id || depts[0]?.id;
        }

        let secType = raw.section_type;
        if (!secType) {
          if (marks === 1 || (raw.options && raw.options.length > 0)) secType = 'SECTION_A';
          else if (marks === 2) secType = 'SECTION_B';
          else secType = 'SECTION_C';
        }

        dbRows.push({
          id: qId,
          department_id: deptId,
          course_id: raw.course_id,
          module_id: raw.module_id,
          course_outcome_id: raw.course_outcome_id,
          k_level_id: kLevelId,
          question_type_id: qTypeId,
          marks_id: marksId,
          mark_value: marks,
          question_text: raw.question_text || '',
          updated_at: new Date().toISOString()
        });

        if (raw.options && raw.options.length > 0) {
          raw.options.forEach(opt => {
            optionsRows.push({
              id: opt.id || crypto.randomUUID(),
              question_id: qId,
              option_letter: opt.option_letter,
              option_text: opt.option_text,
              is_correct: opt.is_correct
            });
          });
        }

        batchFullQuestions.push({
          ...raw,
          id: qId,
          department_id: deptId,
          course_id: raw.course_id || '',
          module_id: raw.module_id || '',
          course_outcome_id: raw.course_outcome_id || '',
          k_level_id: kLevelId,
          question_type_id: qTypeId,
          marks_id: marksId,
          mark_value: marks,
          question_text: raw.question_text || '',
          section_type: secType,
          department: depts.find(d => d.id === deptId),
          course: courses.find(c => c.id === raw.course_id),
          module: modules.find(m => m.id === raw.module_id),
          course_outcome: cos.find(co => co.id === raw.course_outcome_id),
          k_level: klevels.find(k => k.id === kLevelId),
          question_type: types.find(t => t.id === qTypeId),
          options: raw.options || []
        } as Question);
      }

      // Upsert batch to Supabase
      try {
        const { error: qErr } = await supabase.from('questions').upsert(dbRows);
        if (qErr) {
          console.error('Batch questions upsert error:', qErr);
        } else if (optionsRows.length > 0) {
          const qIds = dbRows.map(r => r.id);
          await supabase.from('question_options').delete().in('question_id', qIds);
          const { error: optErr } = await supabase.from('question_options').insert(optionsRows);
          if (optErr) console.error('Batch options insert error:', optErr);
        }
      } catch (e) {
        console.error('Batch import Supabase exception:', e);
      }

      allFullQuestions.push(...batchFullQuestions);
      count += batch.length;
      if (onProgress) {
        const pct = Math.min(100, Math.round((count / total) * 100));
        onProgress(count, total, pct);
      }
    }

    // Update local cache with all saved questions
    const currentLocal = this.getLocalQuestions();
    const map = new Map<string, Question>();
    currentLocal.forEach(q => map.set(q.id, q));
    allFullQuestions.forEach(q => map.set(q.id, q));
    this.saveLocalQuestions(Array.from(map.values()));

    return count;
  }
}
