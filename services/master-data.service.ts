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
const COURSES_CACHE_KEY = 'pmu_courses_cache';
const MODULES_CACHE_KEY = 'pmu_modules_cache';
const COS_CACHE_KEY = 'pmu_cos_cache';
const KLEVELS_CACHE_KEY = 'pmu_klevels_cache';
const TYPES_CACHE_KEY = 'pmu_types_cache';
const MARKS_CACHE_KEY = 'pmu_marks_cache';

const DELETED_COURSES_KEY = 'pmu_deleted_courses_ids';
const DELETED_MODULES_KEY = 'pmu_deleted_modules_ids';
const DELETED_COS_KEY = 'pmu_deleted_cos_ids';
const DELETED_DEPTS_KEY = 'pmu_deleted_depts_ids';
const DELETED_FACULTY_KEY = 'pmu_deleted_faculty_ids';

export class MasterDataService {
  private static memoryStore: Record<string, any[]> = {};

  static getDeletedIds(key: string): Set<string> {
    const list = this.getLocal<string>(key);
    return new Set(list || []);
  }

  static addDeletedId(key: string, id: string): void {
    const ids = this.getDeletedIds(key);
    ids.add(id);
    this.saveLocal(key, Array.from(ids));
  }

  static removeDeletedId(key: string, id: string): void {
    const ids = this.getDeletedIds(key);
    ids.delete(id);
    this.saveLocal(key, Array.from(ids));
  }

  private static getLocal<T>(key: string): T[] {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(key);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.warn(`Failed to parse cache for ${key}:`, e);
      }
    }
    return (this.memoryStore[key] as T[]) || [];
  }

  private static saveLocal<T>(key: string, items: T[]): void {
    this.memoryStore[key] = items;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(items));
      } catch (e) {
        console.warn(`Failed to set cache for ${key}:`, e);
      }
    }
  }

  // DEPARTMENTS
  static async getDepartments(): Promise<Department[]> {
    let dbDepts: Department[] = [];
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('code', { ascending: true });

      if (!error && data && data.length > 0) {
        dbDepts = data as Department[];
      }
    } catch (e) {
      console.warn('Supabase depts fetch error, using local fallback:', e);
    }

    const deletedIds = this.getDeletedIds(DELETED_DEPTS_KEY);
    const localDepts = this.getLocal<Department>(DEPTS_CACHE_KEY).filter(d => !deletedIds.has(d.id));
    const map = new Map<string, Department>();
    INITIAL_DEPARTMENTS.filter(d => !deletedIds.has(d.id)).forEach(d => map.set(d.id, d));
    dbDepts.filter(d => !deletedIds.has(d.id)).forEach(d => map.set(d.id, d));
    localDepts.forEach(d => map.set(d.id, d));

    const result = Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
    if (result.length > 0 && typeof window !== 'undefined') {
      this.saveLocal(DEPTS_CACHE_KEY, result);
    }
    return result;
  }

  static async saveDepartment(dept: Partial<Department>): Promise<Department> {
    const supabase = createClient();
    const payload = {
      id: dept.id || crypto.randomUUID(),
      code: dept.code?.toUpperCase() || 'NEW',
      name: dept.name || 'New Department'
    };

    this.removeDeletedId(DELETED_DEPTS_KEY, payload.id);

    try {
      const { data, error } = await supabase
        .from('departments')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        payload.id = data.id;
        payload.code = data.code;
        payload.name = data.name;
      }
    } catch (e) {
      console.error('Save department exception:', e);
    }

    const current = await this.getDepartments();
    const index = current.findIndex(d => d.id === payload.id);
    let updated: Department[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = payload as Department;
    } else {
      updated = [...current, payload as Department];
    }
    this.saveLocal(DEPTS_CACHE_KEY, updated);

    return payload as Department;
  }

  static async deleteDepartment(id: string): Promise<void> {
    this.addDeletedId(DELETED_DEPTS_KEY, id);

    const current = this.getLocal<Department>(DEPTS_CACHE_KEY);
    const updated = current.filter(d => d.id !== id);
    this.saveLocal(DEPTS_CACHE_KEY, updated);

    try {
      const supabase = createClient();
      await supabase.from('departments').delete().eq('id', id);
    } catch (e) {
      console.error('Delete department exception:', e);
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
    let dbCourses: Course[] = [];
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
      if (!error && data && data.length > 0) {
        dbCourses = data as Course[];
      }
    } catch (e) {
      console.warn('Supabase courses fetch exception:', e);
    }

    const deletedIds = this.getDeletedIds(DELETED_COURSES_KEY);
    const localCourses = this.getLocal<Course>(COURSES_CACHE_KEY).filter(c => !deletedIds.has(c.id));
    const map = new Map<string, Course>();
    INITIAL_COURSES.filter(c => !deletedIds.has(c.id)).forEach(c => map.set(c.id, c));
    dbCourses.filter(c => !deletedIds.has(c.id)).forEach(c => map.set(c.id, c));
    localCourses.forEach(c => map.set(c.id, c));

    let allCourses = Array.from(map.values());
    if (departmentId) {
      allCourses = allCourses.filter(c => c.department_id === departmentId);
    }
    return allCourses.sort((a, b) => a.code.localeCompare(b.code));
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

    this.removeDeletedId(DELETED_COURSES_KEY, payload.id);

    try {
      const { data, error } = await supabase
        .from('courses')
        .upsert(payload)
        .select('*, department:departments(*)')
        .single();

      if (!error && data) {
        const full = data as Course;
        const current = this.getLocal<Course>(COURSES_CACHE_KEY);
        const map = new Map<string, Course>();
        INITIAL_COURSES.forEach(c => map.set(c.id, c));
        current.forEach(c => map.set(c.id, c));
        map.set(full.id, full);
        this.saveLocal(COURSES_CACHE_KEY, Array.from(map.values()));
        return full;
      }
    } catch (e) {
      console.error('Save course exception:', e);
    }

    const current = this.getLocal<Course>(COURSES_CACHE_KEY);
    const map = new Map<string, Course>();
    INITIAL_COURSES.forEach(c => map.set(c.id, c));
    current.forEach(c => map.set(c.id, c));
    map.set(payload.id, payload as Course);
    this.saveLocal(COURSES_CACHE_KEY, Array.from(map.values()));

    return payload as Course;
  }

  static async deleteCourse(id: string): Promise<void> {
    // 1. Mark course as permanently deleted
    this.addDeletedId(DELETED_COURSES_KEY, id);

    // 2. Remove course from local cache
    const current = this.getLocal<Course>(COURSES_CACHE_KEY);
    const updated = current.filter(c => c.id !== id);
    this.saveLocal(COURSES_CACHE_KEY, updated);

    // 3. Mark all dependent modules and COs as deleted and remove from cache
    const currentModules = this.getLocal<Module>(MODULES_CACHE_KEY);
    const removedModuleIds = currentModules.filter(m => m.course_id === id).map(m => m.id);
    removedModuleIds.forEach(mId => this.addDeletedId(DELETED_MODULES_KEY, mId));
    this.saveLocal(MODULES_CACHE_KEY, currentModules.filter(m => m.course_id !== id));

    const currentCOs = this.getLocal<CourseOutcome>(COS_CACHE_KEY);
    const removedCOIds = currentCOs.filter(c => c.course_id === id).map(c => c.id);
    removedCOIds.forEach(coId => this.addDeletedId(DELETED_COS_KEY, coId));
    this.saveLocal(COS_CACHE_KEY, currentCOs.filter(c => c.course_id !== id));

    // 4. Cascade delete in Supabase in correct dependency order
    try {
      const supabase = createClient();
      await supabase.from('questions').delete().eq('course_id', id);
      await supabase.from('generated_papers').delete().eq('course_id', id);
      await supabase.from('exam_templates').delete().eq('course_id', id);
      await supabase.from('course_outcomes').delete().eq('course_id', id);
      await supabase.from('modules').delete().eq('course_id', id);
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) console.warn('Supabase delete course returned error:', error);
    } catch (e) {
      console.warn('Delete course database exception:', e);
    }
  }

  // MODULES
  static async getModules(courseId?: string): Promise<Module[]> {
    let dbModules: Module[] = [];
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
      if (!error && data && data.length > 0) {
        dbModules = data as Module[];
      }
    } catch (e) {
      console.warn('Supabase modules fetch exception:', e);
    }

    const deletedIds = this.getDeletedIds(DELETED_MODULES_KEY);
    const deletedCourseIds = this.getDeletedIds(DELETED_COURSES_KEY);
    const isModuleValid = (m: Module) => !deletedIds.has(m.id) && !deletedCourseIds.has(m.course_id);

    const localModules = this.getLocal<Module>(MODULES_CACHE_KEY).filter(isModuleValid);
    const map = new Map<string, Module>();
    INITIAL_MODULES.filter(isModuleValid).forEach(m => map.set(m.id, m));
    dbModules.filter(isModuleValid).forEach(m => map.set(m.id, m));
    localModules.forEach(m => map.set(m.id, m));

    let allModules = Array.from(map.values());
    if (courseId) {
      allModules = allModules.filter(m => m.course_id === courseId);
    }
    return allModules.sort((a, b) => a.module_number - b.module_number);
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

    this.removeDeletedId(DELETED_MODULES_KEY, payload.id);

    try {
      const { data, error } = await supabase
        .from('modules')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        const full = data as Module;
        const current = this.getLocal<Module>(MODULES_CACHE_KEY);
        const map = new Map<string, Module>();
        INITIAL_MODULES.forEach(m => map.set(m.id, m));
        current.forEach(m => map.set(m.id, m));
        map.set(full.id, full);
        this.saveLocal(MODULES_CACHE_KEY, Array.from(map.values()));
        return full;
      }
    } catch (e) {
      console.error('Save module exception:', e);
    }

    const current = this.getLocal<Module>(MODULES_CACHE_KEY);
    const map = new Map<string, Module>();
    INITIAL_MODULES.forEach(m => map.set(m.id, m));
    current.forEach(m => map.set(m.id, m));
    map.set(payload.id, payload as Module);
    this.saveLocal(MODULES_CACHE_KEY, Array.from(map.values()));

    return payload as Module;
  }

  static async deleteModule(id: string): Promise<void> {
    this.addDeletedId(DELETED_MODULES_KEY, id);

    const current = this.getLocal<Module>(MODULES_CACHE_KEY);
    const updated = current.filter(m => m.id !== id);
    this.saveLocal(MODULES_CACHE_KEY, updated);

    try {
      const supabase = createClient();
      await supabase.from('questions').delete().eq('module_id', id);
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) console.warn('Supabase delete module error:', error);
    } catch (e) {
      console.warn('Delete module exception:', e);
    }
  }

  // COURSE OUTCOMES (CO)
  static async getCourseOutcomes(courseId?: string): Promise<CourseOutcome[]> {
    let dbCos: CourseOutcome[] = [];
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
      if (!error && data && data.length > 0) {
        dbCos = data as CourseOutcome[];
      }
    } catch (e) {
      console.warn('Supabase CO fetch exception:', e);
    }

    const deletedIds = this.getDeletedIds(DELETED_COS_KEY);
    const deletedCourseIds = this.getDeletedIds(DELETED_COURSES_KEY);
    const isCOValid = (c: CourseOutcome) => !deletedIds.has(c.id) && !deletedCourseIds.has(c.course_id);

    const localCos = this.getLocal<CourseOutcome>(COS_CACHE_KEY).filter(isCOValid);
    const map = new Map<string, CourseOutcome>();
    INITIAL_COS.filter(isCOValid).forEach(c => map.set(c.id, c));
    dbCos.filter(isCOValid).forEach(c => map.set(c.id, c));
    localCos.forEach(c => map.set(c.id, c));

    let allCos = Array.from(map.values());
    if (courseId) {
      allCos = allCos.filter(c => c.course_id === courseId);
    }
    return allCos.sort((a, b) => a.code.localeCompare(b.code));
  }

  static async saveCourseOutcome(co: Partial<CourseOutcome>): Promise<CourseOutcome> {
    const supabase = createClient();
    const id = co.id || crypto.randomUUID();
    const courseId = co.course_id || INITIAL_COURSES[0].id;
    const code = co.code || `CO${co.co_number || 1}`;
    const description = co.description || 'Course outcome description';

    this.removeDeletedId(DELETED_COS_KEY, id);

    const dbPayload = {
      id,
      course_id: courseId,
      code,
      description
    };

    const fullCO: CourseOutcome = {
      ...co,
      id,
      course_id: courseId,
      code,
      description,
      co_number: co.co_number || 1,
      k_level_code: co.k_level_code || 'K1',
      k_level_id: co.k_level_id
    };

    try {
      const { data, error } = await supabase
        .from('course_outcomes')
        .upsert(dbPayload)
        .select()
        .single();

      if (!error && data) {
        const merged = { ...fullCO, ...data };
        const current = this.getLocal<CourseOutcome>(COS_CACHE_KEY);
        const map = new Map<string, CourseOutcome>();
        INITIAL_COS.forEach(c => map.set(c.id, c));
        current.forEach(c => map.set(c.id, c));
        map.set(merged.id, merged);
        this.saveLocal(COS_CACHE_KEY, Array.from(map.values()));
        return merged;
      }
    } catch (e) {
      console.error('Save CO exception:', e);
    }

    const current = this.getLocal<CourseOutcome>(COS_CACHE_KEY);
    const map = new Map<string, CourseOutcome>();
    INITIAL_COS.forEach(c => map.set(c.id, c));
    current.forEach(c => map.set(c.id, c));
    map.set(id, fullCO);
    this.saveLocal(COS_CACHE_KEY, Array.from(map.values()));

    return fullCO;
  }

  static async deleteCourseOutcome(id: string): Promise<void> {
    this.addDeletedId(DELETED_COS_KEY, id);

    const current = this.getLocal<CourseOutcome>(COS_CACHE_KEY);
    const updated = current.filter(c => c.id !== id);
    this.saveLocal(COS_CACHE_KEY, updated);

    try {
      const supabase = createClient();
      await supabase.from('questions').delete().eq('course_outcome_id', id);
      const { error } = await supabase.from('course_outcomes').delete().eq('id', id);
      if (error) console.warn('Supabase delete CO error:', error);
    } catch (e) {
      console.warn('Delete CO exception:', e);
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
