-- Migration 001: Initial Schema for Question Paper Generator System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Faculty Profiles Table (Links to Supabase auth.users or internal users)
CREATE TABLE IF NOT EXISTS public.faculty_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'faculty')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL CHECK (module_number >= 1),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, module_number)
);

-- 5. Course Outcomes (CO) Table
CREATE TABLE IF NOT EXISTS public.course_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL, -- e.g. CO1, CO2
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, code)
);

-- 6. K-Levels (Bloom's Taxonomy) Table
CREATE TABLE IF NOT EXISTS public.k_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE, -- e.g. K1, K2, K3
    name VARCHAR(100) NOT NULL, -- Remember, Understand, Apply
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Question Types Table
CREATE TABLE IF NOT EXISTS public.question_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE, -- MCQ, SHORT, LONG
    name VARCHAR(100) NOT NULL, -- Multiple Choice Question, Short Answer, Long Answer
    default_marks INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Marks Table
CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mark_value INTEGER NOT NULL UNIQUE CHECK (mark_value > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    course_outcome_id UUID NOT NULL REFERENCES public.course_outcomes(id) ON DELETE CASCADE,
    k_level_id UUID NOT NULL REFERENCES public.k_levels(id) ON DELETE CASCADE,
    question_type_id UUID NOT NULL REFERENCES public.question_types(id) ON DELETE CASCADE,
    marks_id UUID NOT NULL REFERENCES public.marks(id) ON DELETE CASCADE,
    mark_value INTEGER NOT NULL CHECK (mark_value > 0),
    question_text TEXT NOT NULL,
    created_by UUID REFERENCES public.faculty_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Question Options Table (for MCQs)
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_letter VARCHAR(2) NOT NULL, -- a, b, c, d
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (question_id, option_letter)
);

-- 11. Exam Templates Table
CREATE TABLE IF NOT EXISTS public.exam_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    total_marks INTEGER NOT NULL CHECK (total_marks > 0),
    duration_minutes INTEGER NOT NULL DEFAULT 180,
    instructions TEXT[] DEFAULT ARRAY['Answer all questions.', 'Assume suitable data if required.'],
    created_by UUID REFERENCES public.faculty_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Exam Template Sections Table
CREATE TABLE IF NOT EXISTS public.exam_template_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.exam_templates(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL, -- PART - A, PART - B, etc.
    section_order INTEGER NOT NULL DEFAULT 1,
    num_questions INTEGER NOT NULL CHECK (num_questions > 0),
    marks_per_question INTEGER NOT NULL CHECK (marks_per_question > 0),
    question_type_id UUID NOT NULL REFERENCES public.question_types(id) ON DELETE CASCADE,
    course_outcome_id UUID REFERENCES public.course_outcomes(id) ON DELETE SET NULL,
    k_level_id UUID REFERENCES public.k_levels(id) ON DELETE SET NULL,
    has_or_pattern BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Generated Papers Table (Snapshots generated exams)
CREATE TABLE IF NOT EXISTS public.generated_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    paper_code VARCHAR(50) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    college_name VARCHAR(255) NOT NULL DEFAULT 'PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY',
    exam_name VARCHAR(255) NOT NULL DEFAULT 'END SEMESTER EXAMINATIONS - APRIL / MAY 2026',
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    date_of_exam DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL DEFAULT 180,
    total_marks INTEGER NOT NULL CHECK (total_marks > 0),
    instructions TEXT[] DEFAULT ARRAY['Answer all questions.', 'Assume suitable data if required.'],
    status VARCHAR(20) NOT NULL DEFAULT 'saved' CHECK (status IN ('draft', 'saved', 'archived')),
    snapshot_json JSONB NOT NULL, -- Complete immutable snapshot of questions and layout
    created_by UUID REFERENCES public.faculty_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Indexes for high-performance random selection & filtering
CREATE INDEX IF NOT EXISTS idx_questions_department_id ON public.questions(department_id);
CREATE INDEX IF NOT EXISTS idx_questions_course_id ON public.questions(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_module_id ON public.questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_course_outcome_id ON public.questions(course_outcome_id);
CREATE INDEX IF NOT EXISTS idx_questions_k_level_id ON public.questions(k_level_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_type_id ON public.questions(question_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_marks_id ON public.questions(marks_id);
CREATE INDEX IF NOT EXISTS idx_questions_mark_value ON public.questions(mark_value);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_generated_papers_course_id ON public.generated_papers(course_id);
