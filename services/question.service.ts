import { createClient } from '@/lib/supabase/client';
import { Question, QuestionOption } from '@/types';
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

export class QuestionService {
  static async getQuestions(filters?: QuestionFilter): Promise<Question[]> {
    try {
      const supabase = createClient();
      let query = supabase
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

      if (filters?.department_id) query = query.eq('department_id', filters.department_id);
      if (filters?.course_id) query = query.eq('course_id', filters.course_id);
      if (filters?.module_id) query = query.eq('module_id', filters.module_id);
      
      if (filters?.course_outcome_ids && filters.course_outcome_ids.length > 0) {
        query = query.in('course_outcome_id', filters.course_outcome_ids);
      } else if (filters?.course_outcome_id) {
        query = query.eq('course_outcome_id', filters.course_outcome_id);
      }

      if (filters?.k_level_ids && filters.k_level_ids.length > 0) {
        query = query.in('k_level_id', filters.k_level_ids);
      } else if (filters?.k_level_id) {
        query = query.eq('k_level_id', filters.k_level_id);
      }

      if (filters?.question_type_id) query = query.eq('question_type_id', filters.question_type_id);
      if (filters?.mark_value !== undefined) query = query.eq('mark_value', filters.mark_value);
      if (filters?.search_query) {
        query = query.ilike('question_text', `%${filters.search_query}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Question[];
      }
    } catch (e) {
      console.warn('Supabase questions fetch error, using local fallback:', e);
    }

    // Fallback filter
    let questions = INITIAL_QUESTIONS;
    const [depts, courses, modules, cos, klevels, types] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses(),
      MasterDataService.getModules(),
      MasterDataService.getCourseOutcomes(),
      MasterDataService.getKLevels(),
      MasterDataService.getQuestionTypes()
    ]);

    questions = questions.map(q => ({
      ...q,
      department: depts.find(d => d.id === q.department_id),
      course: courses.find(c => c.id === q.course_id),
      module: modules.find(m => m.id === q.module_id),
      course_outcome: cos.find(co => co.id === q.course_outcome_id),
      k_level: klevels.find(k => k.id === q.k_level_id),
      question_type: types.find(t => t.id === q.question_type_id)
    }));

    if (!filters) return questions;

    return questions.filter(q => {
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
      if (filters.mark_value && Number(q.mark_value) !== Number(filters.mark_value)) return false;
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

    try {
      const { data, error } = await supabase
        .from('questions')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        // Save MCQ options if present
        if (questionData.options && questionData.options.length > 0) {
          // Delete existing options
          await supabase.from('question_options').delete().eq('question_id', qId);
          // Insert new options
          const optionsPayload = questionData.options.map(opt => ({
            id: opt.id || crypto.randomUUID(),
            question_id: qId,
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          }));
          await supabase.from('question_options').insert(optionsPayload);
        }
        return data as Question;
      }
    } catch (e) {
      console.error('Save question Supabase error:', e);
    }

    return payload as unknown as Question;
  }

  static async deleteQuestion(id: string): Promise<void> {
    try {
      const supabase = createClient();
      await supabase.from('questions').delete().eq('id', id);
    } catch (e) {
      console.error('Delete question error:', e);
    }
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
