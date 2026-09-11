export type UserRole = 'admin' | 'faculty';

export interface Department {
  id: string;
  code: string;
  name: string;
  created_at?: string;
}

export interface FacultyProfile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  password?: string;
  role: UserRole;
  department_id?: string;
  status: 'active' | 'inactive';
  can_create_faculty?: boolean;
  can_create_courses?: boolean;
  can_create_questions?: boolean;
  department?: Department;
  created_at?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department_id: string;
  semester: number;
  academic_year: string;
  department?: Department;
  created_at?: string;
}

export interface Module {
  id: string;
  course_id: string;
  module_number: number;
  title: string;
  description?: string;
  course?: Course;
  created_at?: string;
}

export interface CourseOutcome {
  id: string;
  course_id: string;
  co_number?: number;
  code: string; // e.g. CO1
  description: string;
  k_level_code?: string; // e.g. K1, K2
  k_level_id?: string;
  k_level?: KLevel;
  created_at?: string;
}

export interface KLevel {
  id: string;
  code: string; // e.g. K1, K2
  name: string; // Remember, Understand
  description?: string;
  created_at?: string;
}

export interface QuestionType {
  id: string;
  code: 'MCQ' | 'SHORT' | 'LONG';
  name: string;
  default_marks: number;
  created_at?: string;
}

export interface Mark {
  id: string;
  mark_value: number;
  created_at?: string;
}

export interface QuestionOption {
  id?: string;
  question_id?: string;
  option_letter: 'a' | 'b' | 'c' | 'd';
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  department_id: string;
  course_id: string;
  module_id: string;
  course_outcome_id: string;
  k_level_id: string;
  question_type_id: string;
  marks_id: string;
  mark_value: number;
  question_text: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Relations
  department?: Department;
  course?: Course;
  module?: Module;
  course_outcome?: CourseOutcome;
  k_level?: KLevel;
  question_type?: QuestionType;
  options?: QuestionOption[];
}

export interface ExamTemplateSection {
  id: string;
  template_id: string;
  section_name: string; // PART - A, etc.
  section_order: number;
  num_questions: number;
  marks_per_question: number;
  question_type_id: string;
  course_outcome_id?: string;
  k_level_id?: string;
  has_or_pattern: boolean;
}

export interface ExamTemplate {
  id: string;
  title: string;
  department_id: string;
  course_id: string;
  total_marks: number;
  duration_minutes: number;
  instructions: string[];
  sections?: ExamTemplateSection[];
  created_by?: string;
  created_at?: string;
}

export interface GeneratedPaperQuestion {
  id: string;
  question_number: number;
  question_text: string;
  marks: number;
  course_outcome_code: string;
  k_level_code: string;
  question_type_code: string;
  options?: QuestionOption[];
  is_or_choice?: boolean;
  alternative_question_text?: string;
  alternative_options?: QuestionOption[];
}

export interface GeneratedPaperSection {
  id: string;
  section_name: string; // PART - A
  section_order: number;
  instructions: string;
  total_section_marks: number;
  num_questions?: number;
  marks_per_question?: number;
  questions: GeneratedPaperQuestion[];
}

export interface GeneratedPaperSnapshot {
  college_name: string;
  department_name: string;
  course_code: string;
  course_name: string;
  exam_name: string;
  semester: number;
  academic_year: string;
  date_of_exam: string;
  duration_minutes: number;
  total_marks: number;
  instructions: string[];
  sections: GeneratedPaperSection[];
}

export interface GeneratedPaper {
  id: string;
  title: string;
  paper_code: string;
  department_id: string;
  course_id: string;
  college_name: string;
  exam_name: string;
  semester: number;
  academic_year: string;
  date_of_exam: string;
  duration_minutes: number;
  total_marks: number;
  instructions: string[];
  status: 'draft' | 'saved' | 'archived';
  snapshot_json: GeneratedPaperSnapshot;
  created_by?: string;
  created_at?: string;
  department?: Department;
  course?: Course;
}

export interface PaperSectionConfig {
  id: string;
  section_name: string; // "PART - A"
  section_order: number;
  question_type_code: 'MCQ' | 'SHORT' | 'LONG';
  num_questions: number;
  marks_per_question: number;
  module_id?: string;
  course_outcome_id?: string;
  k_level_id?: string;
  module_ids?: string[];
  course_outcome_ids?: string[];
  k_level_ids?: string[];
  has_or_pattern: boolean;
}
