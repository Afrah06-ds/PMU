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
import {
  INITIAL_DEPARTMENTS,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_COS,
  INITIAL_KLEVELS,
  INITIAL_QUESTION_TYPES,
  INITIAL_MARKS,
  INITIAL_EXAM_TEMPLATES
} from '@/lib/mock-data';

const DEPTS_CACHE_KEY = 'pmu_depts_cache';

export class MasterDataService {
  // DEPARTMENTS
  static async getDepartments(): Promise<Department[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('code', { ascending: true });

      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(DEPTS_CACHE_KEY, JSON.stringify(data));
        }
        return data as Department[];
      }
    } catch (e) {
      console.warn('Supabase fetch error, using local fallback:', e);
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(DEPTS_CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return INITIAL_DEPARTMENTS;
  }

  static async saveDepartment(dept: Partial<Department>): Promise<Department> {
    const supabase = createClient();
    const payload = {
      id: dept.id || crypto.randomUUID(),
      code: dept.code?.toUpperCase() || 'NEW',
      name: dept.name || 'New Department'
    };

    try {
      const { data, error } = await supabase
        .from('departments')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error('Save department error:', error);
      } else if (data) {
        payload.id = data.id;
        payload.code = data.code;
        payload.name = data.name;
      }
    } catch (e) {
      console.error('Save department exception:', e);
    }

    if (typeof window !== 'undefined') {
      const current = await this.getDepartments();
      const index = current.findIndex(d => d.id === payload.id);
      let updated: Department[];
      if (index >= 0) {
        updated = [...current];
        updated[index] = payload as Department;
      } else {
        updated = [...current, payload as Department];
      }
      localStorage.setItem(DEPTS_CACHE_KEY, JSON.stringify(updated));
    }

    return payload as Department;
  }

  static async deleteDepartment(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) console.error('Delete department error:', error);
    } catch (e) {
      console.error('Delete department exception:', e);
    }

    if (typeof window !== 'undefined') {
      const current = await this.getDepartments();
      const updated = current.filter(d => d.id !== id);
      localStorage.setItem(DEPTS_CACHE_KEY, JSON.stringify(updated));
    }
  }

  // FACULTY PROFILES
  static async getFaculty(): Promise<FacultyProfile[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faculty_profiles')
        .select('*, department:departments(*)');

      if (error) {
        console.error('Supabase faculty error:', error);
      } else if (data) {
        return data as FacultyProfile[];
      }
    } catch (e) {
      console.warn('Supabase faculty fetch exception:', e);
    }
    return INITIAL_FACULTY;
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

    try {
      const { data, error } = await supabase
        .from('faculty_profiles')
        .upsert(payload)
        .select('*, department:departments(*)')
        .single();

      if (error) console.error('Save faculty error:', error);
      else if (data) return data as FacultyProfile;
    } catch (e) {
      console.error('Save faculty exception:', e);
    }
    return payload as FacultyProfile;
  }

  static async deleteFaculty(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('faculty_profiles').delete().eq('id', id);
      if (error) console.error('Delete faculty error:', error);
    } catch (e) {
      console.error('Delete faculty exception:', e);
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
      if (error) {
        console.error('Supabase courses fetch error:', error);
      } else if (data) {
        return data as Course[];
      }
    } catch (e) {
      console.warn('Supabase courses fetch exception:', e);
    }

    if (departmentId) {
      return INITIAL_COURSES.filter(c => c.department_id === departmentId);
    }
    return INITIAL_COURSES;
  }

  static async saveCourse(course: Partial<Course>): Promise<Course> {
    const supabase = createClient();
    const payload = {
      id: course.id || crypto.randomUUID(),
      code: course.code?.toUpperCase() || 'CS000',
      name: course.name || 'New Course',
      department_id: course.department_id || INITIAL_DEPARTMENTS[0].id,
      semester: course.semester || 1,
      academic_year: course.academic_year || '2025-2026'
    };

    try {
      const { data, error } = await supabase
        .from('courses')
        .upsert(payload)
        .select('*, department:departments(*)')
        .single();

      if (error) console.error('Save course error:', error);
      else if (data) return data as Course;
    } catch (e) {
      console.error('Save course exception:', e);
    }
    return payload as Course;
  }

  static async deleteCourse(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) console.error('Delete course error:', error);
    } catch (e) {
      console.error('Delete course exception:', e);
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
      if (error) {
        console.error('Supabase modules fetch error:', error);
      } else if (data) {
        return data as Module[];
      }
    } catch (e) {
      console.warn('Supabase modules fetch exception:', e);
    }

    if (courseId) {
      return INITIAL_MODULES.filter(m => m.course_id === courseId);
    }
    return INITIAL_MODULES;
  }

  static async saveModule(mod: Partial<Module>): Promise<Module> {
    const supabase = createClient();
    const payload = {
      id: mod.id || crypto.randomUUID(),
      course_id: mod.course_id || INITIAL_COURSES[0].id,
      module_number: mod.module_number || 1,
      title: mod.title || 'New Module',
      description: mod.description || ''
    };

    try {
      const { data, error } = await supabase
        .from('modules')
        .upsert(payload)
        .select()
        .single();

      if (error) console.error('Save module error:', error);
      else if (data) return data as Module;
    } catch (e) {
      console.error('Save module exception:', e);
    }
    return payload as Module;
  }

  static async deleteModule(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) console.error('Delete module error:', error);
    } catch (e) {
      console.error('Delete module exception:', e);
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
      if (error) {
        console.error('Supabase CO fetch error:', error);
      } else if (data) {
        return data as CourseOutcome[];
      }
    } catch (e) {
      console.warn('Supabase CO fetch exception:', e);
    }

    if (courseId) {
      return INITIAL_COS.filter(c => c.course_id === courseId);
    }
    return INITIAL_COS;
  }

  static async saveCourseOutcome(co: Partial<CourseOutcome>): Promise<CourseOutcome> {
    const supabase = createClient();
    const payload = {
      id: co.id || crypto.randomUUID(),
      course_id: co.course_id || INITIAL_COURSES[0].id,
      co_number: co.co_number || 1,
      code: co.code || `CO${co.co_number || 1}`,
      description: co.description || 'Course outcome description',
      k_level_code: co.k_level_code || 'K1',
      k_level_id: co.k_level_id
    };

    try {
      const { data, error } = await supabase
        .from('course_outcomes')
        .upsert(payload)
        .select()
        .single();

      if (error) console.error('Save CO error:', error);
      else if (data) return data as CourseOutcome;
    } catch (e) {
      console.error('Save CO exception:', e);
    }
    return payload as CourseOutcome;
  }

  static async deleteCourseOutcome(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('course_outcomes').delete().eq('id', id);
      if (error) console.error('Delete CO error:', error);
    } catch (e) {
      console.error('Delete CO exception:', e);
    }
  }

  // K-LEVELS
  static async getKLevels(): Promise<KLevel[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('k_levels').select('*').order('code');
      if (error) {
        console.error('Supabase KLevels fetch error:', error);
      } else if (data) {
        return data as KLevel[];
      }
    } catch (e) {
      console.warn('Supabase KLevels fetch exception:', e);
    }
    return INITIAL_KLEVELS;
  }

  // QUESTION TYPES & MARKS
  static async getQuestionTypes(): Promise<QuestionType[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('question_types').select('*').order('code');
      if (error) {
        console.error('Supabase QuestionTypes fetch error:', error);
      } else if (data) {
        return data as QuestionType[];
      }
    } catch (e) {
      console.warn('Supabase QuestionTypes fetch exception:', e);
    }
    return INITIAL_QUESTION_TYPES;
  }

  static async getMarks(): Promise<Mark[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('marks').select('*').order('mark_value');
      if (error) {
        console.error('Supabase Marks fetch error:', error);
      } else if (data) {
        return data as Mark[];
      }
    } catch (e) {
      console.warn('Supabase Marks fetch exception:', e);
    }
    return INITIAL_MARKS;
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
      if (error) {
        console.error('Supabase templates fetch error:', error);
      } else if (data) {
        return data as ExamTemplate[];
      }
    } catch (e) {
      console.warn('Supabase templates fetch exception:', e);
    }

    if (courseId) {
      return INITIAL_EXAM_TEMPLATES.filter(t => t.course_id === courseId);
    }
    return INITIAL_EXAM_TEMPLATES;
  }

  static async saveExamTemplate(template: Partial<ExamTemplate>): Promise<ExamTemplate> {
    const supabase = createClient();
    const payload = {
      id: template.id || crypto.randomUUID(),
      title: template.title || 'Custom Exam Template',
      department_id: template.department_id || INITIAL_DEPARTMENTS[0].id,
      course_id: template.course_id || INITIAL_COURSES[0].id,
      total_marks: template.total_marks || 100,
      duration_minutes: template.duration_minutes || 180,
      instructions: template.instructions || ['Answer all questions.']
    };

    try {
      const { data, error } = await supabase
        .from('exam_templates')
        .upsert(payload)
        .select()
        .single();

      if (error) console.error('Save template error:', error);
      else if (data) return data as ExamTemplate;
    } catch (e) {
      console.error('Save template exception:', e);
    }
    return payload as ExamTemplate;
  }

  static async deleteExamTemplate(id: string): Promise<void> {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('exam_templates').delete().eq('id', id);
      if (error) console.error('Delete template error:', error);
    } catch (e) {
      console.error('Delete template exception:', e);
    }
  }
}
