import { createClient } from '@/lib/supabase/client';
import { Question } from '@/types';
import { INITIAL_QUESTIONS } from '@/lib/mock-data';
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
}

const QUESTIONS_CACHE_KEY = 'pmu_questions_cache';

export class QuestionService {
  private static getLocalQuestions(): Question[] {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem(QUESTIONS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse local questions cache:', e);
    }
    return [];
  }

  private static saveLocalQuestions(questions: Question[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions));
    } catch (e) {
      console.warn('Failed to set local questions cache:', e);
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
    
    // Add initial mock questions if DB fetch wasn't performed or returned 0 records and local cache is empty
    if (!fetchedFromDb && localQuestions.length === 0) {
      INITIAL_QUESTIONS.forEach(q => combinedMap.set(q.id, q));
    }

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
      if (filters.search_query) {
        const query = filters.search_query.toLowerCase();
        const matchesText = q.question_text.toLowerCase().includes(query);
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

    const payload = {
      id: qId,
      department_id: questionData.department_id,
      course_id: questionData.course_id,
      module_id: questionData.module_id,
      course_outcome_id: questionData.course_outcome_id,
      k_level_id: questionData.k_level_id,
      question_type_id: questionData.question_type_id,
      marks_id: questionData.marks_id,
      mark_value: Number(questionData.mark_value) || 1,
      question_text: questionData.question_text || '',
      updated_at: new Date().toISOString()
    };

    let savedQuestion: Partial<Question> = { ...payload, options: questionData.options || [] };

    try {
      const { data, error } = await supabase
        .from('questions')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        savedQuestion = { ...data, options: questionData.options || [] };
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
      }
    } catch (e) {
      console.error('Save question Supabase error:', e);
    }

    // Hydrate relations
    const [depts, courses, modules, cos, klevels, types] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getModules(),
      MasterDataService.getCourseOutcomes(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes()
    ]);

    const fullQuestion: Question = {
      ...savedQuestion,
      id: qId,
      department_id: questionData.department_id || '',
      course_id: questionData.course_id || '',
      module_id: questionData.module_id || '',
      course_outcome_id: questionData.course_outcome_id || '',
      k_level_id: questionData.k_level_id || '',
      question_type_id: questionData.question_type_id || '',
      mark_value: Number(questionData.mark_value) || 1,
      question_text: questionData.question_text || '',
      department: depts.find(d => d.id === questionData.department_id),
      course: courses.find(c => c.id === questionData.course_id),
      module: modules.find(m => m.id === questionData.module_id),
      course_outcome: cos.find(co => co.id === questionData.course_outcome_id),
      k_level: klevels.find(k => k.id === questionData.k_level_id),
      question_type: types.find(t => t.id === questionData.question_type_id),
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

  static async bulkImport(importedQuestions: Partial<Question>[]): Promise<number> {
    let count = 0;
    for (const raw of importedQuestions) {
      if (!raw.question_text) continue;
      await this.saveQuestion(raw);
      count++;
    }
    return count;
  }
}
