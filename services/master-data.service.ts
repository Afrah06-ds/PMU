import { createClient } from '@/lib/supabase/client';
import {
  Department,
  FacultyProfile,
  Course,
  Module,
  CourseOutcome,
  KLevel,
  QuestionType,
  Mark,
  ExamTemplate
} from '@/types';
const DEFAULT_KLEVELS: KLevel[] = [
  { id: 'e1111111-1111-1111-1111-111111111111', code: 'K1', name: 'Remember', description: 'Recall basic facts, terms, concepts and answers' },
  { id: 'e2222222-2222-2222-2222-222222222222', code: 'K2', name: 'Understand', description: 'Demonstrate understanding of facts and ideas' },
  { id: 'e3333333-3333-3333-3333-333333333333', code: 'K3', name: 'Apply', description: 'Solve problems in new situations by applying acquired knowledge' },
  { id: 'e4444444-4444-4444-4444-444444444444', code: 'K4', name: 'Analyze', description: 'Examine and break information into parts' },
  { id: 'e5555555-5555-5555-5555-555555555555', code: 'K5', name: 'Evaluate', description: 'Present and defend opinions by making judgments' },
  { id: 'e6666666-6666-6666-6666-666666666666', code: 'K6', name: 'Create', description: 'Compile information together in a different way' }
];

const DEFAULT_QUESTION_TYPES: QuestionType[] = [
  { id: 'd1111111-1111-1111-1111-111111111111', code: 'MCQ', name: 'Multiple Choice Question', default_marks: 1 },
  { id: 'd2222222-2222-2222-2222-222222222222', code: 'SHORT', name: 'Short Answer Question', default_marks: 2 },
  { id: 'd3333333-3333-3333-3333-333333333333', code: 'LONG', name: 'Long Answer Question', default_marks: 15 }
];

const DEFAULT_MARKS: Mark[] = [
  { id: 'e0000001-0000-0000-0000-000000000001', mark_value: 1 },
  { id: 'e0000002-0000-0000-0000-000000000002', mark_value: 2 },
  { id: 'e0000007-0000-0000-0000-000000000007', mark_value: 7 },
  { id: 'e0000008-0000-0000-0000-000000000008', mark_value: 8 },
  { id: 'e0000010-0000-0000-0000-000000000010', mark_value: 10 },
  { id: 'e0000015-0000-0000-0000-000000000015', mark_value: 15 },
  { id: 'e0000020-0000-0000-0000-000000000020', mark_value: 20 }
];

// Clear legacy mock caches from localStorage if present
if (typeof window !== 'undefined') {
  const legacyKeys = [
    'pmu_courses_cache',
    'pmu_modules_cache',
    'pmu_cos_cache',
    'pmu_questions_cache',
    'pmu_depts_cache',
    'pmu_deleted_courses_ids',
    'pmu_deleted_course_codes',
    'pmu_deleted_modules_ids',
    'pmu_deleted_cos_ids',
    'pmu_deleted_depts_ids',
    'pmu_deleted_faculty_ids'
  ];
  legacyKeys.forEach(k => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
}

export class MasterDataService {
  // DEPARTMENTS
  static async getDepartments(): Promise<Department[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Department[];
      }
    } catch (e) {
      console.warn('Supabase depts fetch error:', e);
    }
    return [];
  }

  static async saveDepartment(dept: Partial<Department>): Promise<Department> {
    const supabase = createClient();
    const payload = {
      id: dept.id || crypto.randomUUID(),
      code: dept.code?.toUpperCase() || 'NEW',
      name: dept.name || 'New Department'
    };

    const { data, error } = await supabase
      .from('departments')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Save department error:', error);
      throw error;
    }
    return data as Department;
  }

  static async deleteDepartment(id: string): Promise<void> {
    const supabase = createClient();
    try {
      // Find and delete any courses belonging to this department first
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('department_id', id);

      if (courses && courses.length > 0) {
        for (const c of courses) {
          await this.deleteCourse(c.id);
        }
      }

      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) {
        console.error('Delete department error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete department exception:', e);
      throw e;
    }
  }

  // FACULTY PROFILES
  static async getFaculty(): Promise<FacultyProfile[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faculty_profiles')
        .select('*, department:departments(*)')
        .order('full_name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as FacultyProfile[];
      }
    } catch (e) {
      console.warn('Supabase faculty fetch exception:', e);
    }
    return [];
  }

  static async saveFaculty(profile: Partial<FacultyProfile>): Promise<FacultyProfile> {
    const supabase = createClient();
    const payload = {
      id: profile.id || crypto.randomUUID(),
      full_name: profile.full_name || 'New Faculty',
      email: profile.email || 'faculty@pmu.edu',
      password: profile.password || 'password123',
      role: profile.role || 'faculty',
      department_id: profile.department_id,
      status: profile.status || 'active',
      can_create_faculty: profile.can_create_faculty ?? false,
      can_create_courses: profile.can_create_courses ?? true,
      can_create_questions: profile.can_create_questions ?? true
    };

    const { data, error } = await supabase
      .from('faculty_profiles')
      .upsert(payload)
      .select('*, department:departments(*)')
      .single();

    if (error) {
      console.error('Save faculty error:', error);
      throw error;
    }
    return data as FacultyProfile;
  }

  static async deleteFaculty(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('faculty_profiles').delete().eq('id', id);
      if (error) {
        console.error('Delete faculty error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete faculty exception:', e);
      throw e;
    }
  }

  // COURSES
  static async getCourses(departmentId?: string): Promise<Course[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from('courses')
        .select('*, department:departments(*)')
        .order('code', { ascending: true });

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Course[];
      }
      if (error) console.error('Supabase courses fetch error:', error);
    } catch (e) {
      console.warn('Supabase courses fetch exception:', e);
    }
    return [];
  }

  static async saveCourse(course: Partial<Course>): Promise<Course> {
    const supabase = createClient();
    const payload = {
      id: course.id || crypto.randomUUID(),
      code: course.code?.toUpperCase() || 'CS000',
      name: course.name || 'New Course',
      department_id: course.department_id,
      semester: course.semester || 1,
      academic_year: course.academic_year || '2025-2026'
    };

    const { data, error } = await supabase
      .from('courses')
      .upsert(payload)
      .select('*, department:departments(*)')
      .single();

    if (error) {
      console.error('Save course error:', error);
      throw error;
    }
    return data as Course;
  }

  static async deleteCourse(id: string): Promise<void> {
    const supabase = createClient();
    try {
      // 1. Delete questions linked to this course
      await supabase.from('questions').delete().eq('course_id', id);
      // 2. Delete generated papers
      await supabase.from('generated_papers').delete().eq('course_id', id);
      // 3. Delete exam templates
      await supabase.from('exam_templates').delete().eq('course_id', id);
      // 4. Delete course outcomes
      await supabase.from('course_outcomes').delete().eq('course_id', id);
      // 5. Delete modules
      await supabase.from('modules').delete().eq('course_id', id);
      // 6. Delete course
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete course returned error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete course exception:', e);
      throw e;
    }
  }

  // MODULES
  static async getModules(courseId?: string): Promise<Module[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from('modules')
        .select('*, course:courses(*)')
        .order('module_number', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as Module[];
      }
      if (error) console.error('Supabase modules fetch error:', error);
    } catch (e) {
      console.warn('Supabase modules fetch exception:', e);
    }
    return [];
  }

  static async saveModule(mod: Partial<Module>): Promise<Module> {
    const supabase = createClient();
    const payload = {
      id: mod.id || crypto.randomUUID(),
      course_id: mod.course_id,
      module_number: mod.module_number || 1,
      title: mod.title || 'New Module',
      description: mod.description || ''
    };

    const { data, error } = await supabase
      .from('modules')
      .upsert(payload)
      .select('*, course:courses(*)')
      .single();

    if (error) {
      console.error('Save module error:', error);
      throw error;
    }
    return data as Module;
  }

  static async deleteModule(id: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('questions').delete().eq('module_id', id);
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) {
        console.error('Delete module error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete module exception:', e);
      throw e;
    }
  }

  // COURSE OUTCOMES (CO)
  static async getCourseOutcomes(courseId?: string): Promise<CourseOutcome[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from('course_outcomes')
        .select('*')
        .order('code', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as CourseOutcome[];
      }
      if (error) console.error('Supabase getCourseOutcomes error:', error);
    } catch (e) {
      console.warn('Supabase CO fetch exception:', e);
    }
    return [];
  }

  static async saveCourseOutcome(co: Partial<CourseOutcome>): Promise<CourseOutcome> {
    const supabase = createClient();
    const payload = {
      id: co.id || crypto.randomUUID(),
      course_id: co.course_id,
      code: co.code || `CO${co.co_number || 1}`,
      description: co.description || 'Course outcome description',
      co_number: co.co_number || 1,
      k_level_code: co.k_level_code || 'K1',
      k_level_id: co.k_level_id
    };

    const { data, error } = await supabase
      .from('course_outcomes')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Save CO error:', error);
      throw error;
    }
    return data as CourseOutcome;
  }

  static async deleteCourseOutcome(id: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('questions').delete().eq('course_outcome_id', id);
      const { error } = await supabase.from('course_outcomes').delete().eq('id', id);
      if (error) {
        console.error('Delete CO error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete CO exception:', e);
      throw e;
    }
  }

  // K-LEVELS
  static async getKLevels(): Promise<KLevel[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('k_levels').select('*').order('code');
      if (!error && data && data.length > 0) {
        return data as KLevel[];
      }
    } catch (e) {
      console.warn('Supabase KLevels fetch exception:', e);
    }
    return DEFAULT_KLEVELS;
  }

  // QUESTION TYPES & MARKS
  static async getQuestionTypes(): Promise<QuestionType[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('question_types').select('*').order('code');
      if (!error && data && data.length > 0) {
        return data as QuestionType[];
      }
    } catch (e) {
      console.warn('Supabase QuestionTypes fetch exception:', e);
    }
    return DEFAULT_QUESTION_TYPES;
  }

  static async getMarks(): Promise<Mark[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('marks').select('*').order('mark_value');
      if (!error && data && data.length > 0) {
        return data as Mark[];
      }
    } catch (e) {
      console.warn('Supabase Marks fetch exception:', e);
    }
    return DEFAULT_MARKS;
  }

  // EXAM TEMPLATES
  static async getExamTemplates(courseId?: string): Promise<ExamTemplate[]> {
    try {
      const supabase = createClient();
      let query = supabase
        .from('exam_templates')
        .select('*, sections:exam_template_sections(*)');

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as ExamTemplate[];
      }
    } catch (e) {
      console.warn('Supabase templates fetch exception:', e);
    }
    return [];
  }

  static async saveExamTemplate(template: Partial<ExamTemplate>): Promise<ExamTemplate> {
    const supabase = createClient();
    const payload = {
      id: template.id || crypto.randomUUID(),
      title: template.title || 'Custom Exam Template',
      department_id: template.department_id,
      course_id: template.course_id,
      total_marks: template.total_marks || 100,
      duration_minutes: template.duration_minutes || 180,
      instructions: template.instructions || ['Answer all questions.']
    };

    const { data, error } = await supabase
      .from('exam_templates')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Save template error:', error);
      throw error;
    }
    return data as ExamTemplate;
  }

  static async deleteExamTemplate(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('exam_templates').delete().eq('id', id);
      if (error) {
        console.error('Delete template error:', error);
        throw error;
      }
    } catch (e) {
      console.error('Delete template exception:', e);
      throw e;
    }
  }
}
