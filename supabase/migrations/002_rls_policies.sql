-- Migration 002: Row Level Security (RLS) Policies (Full Permissive Access)

-- Run this SQL in your Supabase SQL Editor to ensure full access for all operations (SELECT, INSERT, UPDATE, DELETE)

-- Option 1: Disable Row Level Security on all tables so REST API requests succeed immediately
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_outcomes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.k_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_template_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_papers DISABLE ROW LEVEL SECURITY;

-- Option 2: Grant permissions to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, postgres, service_role;

