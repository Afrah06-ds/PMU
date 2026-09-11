-- SQL Migration: PMIST EMS Academic Setup & Course Outcomes Extension
-- Date: 2026-09-11

-- 1. Extend Faculty Profiles table with password & granular access flags
ALTER TABLE faculty_profiles 
ADD COLUMN IF NOT EXISTS password text DEFAULT 'password123',
ADD COLUMN IF NOT EXISTS can_create_faculty boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_create_courses boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS can_create_questions boolean DEFAULT true;

-- Update existing Admin profile to have full access permissions
UPDATE faculty_profiles 
SET can_create_faculty = true, can_create_courses = true, can_create_questions = true 
WHERE role = 'admin' OR email LIKE '%admin%';

-- 2. Extend Course Outcomes table with integer order (co_number) and K-Level reference
ALTER TABLE course_outcomes 
ADD COLUMN IF NOT EXISTS co_number integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS k_level_code text DEFAULT 'K1',
ADD COLUMN IF NOT EXISTS k_level_id uuid REFERENCES k_levels(id) ON DELETE SET NULL;

-- Index for ordering course outcomes
CREATE INDEX IF NOT EXISTS idx_course_outcomes_order ON course_outcomes(course_id, co_number);
