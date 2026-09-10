-- Migration 003: PostgreSQL RPC function for Random Question Selection

CREATE OR REPLACE FUNCTION public.get_random_questions(
    p_course_id UUID,
    p_mark_value INT,
    p_num_questions INT,
    p_module_id UUID DEFAULT NULL,
    p_course_outcome_id UUID DEFAULT NULL,
    p_k_level_id UUID DEFAULT NULL,
    p_question_type_id UUID DEFAULT NULL,
    p_exclude_ids UUID[] DEFAULT '{}'
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    mark_value INT,
    course_id UUID,
    module_id UUID,
    course_outcome_id UUID,
    k_level_id UUID,
    question_type_id UUID,
    co_code VARCHAR,
    k_code VARCHAR,
    type_code VARCHAR,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.question_text,
        q.mark_value,
        q.course_id,
        q.module_id,
        q.course_outcome_id,
        q.k_level_id,
        q.question_type_id,
        co.code AS co_code,
        k.code AS k_code,
        qt.code AS type_code,
        q.created_at
    FROM public.questions q
    JOIN public.course_outcomes co ON q.course_outcome_id = co.id
    JOIN public.k_levels k ON q.k_level_id = k.id
    JOIN public.question_types qt ON q.question_type_id = qt.id
    WHERE q.course_id = p_course_id
      AND q.mark_value = p_mark_value
      AND (p_module_id IS NULL OR q.module_id = p_module_id)
      AND (p_course_outcome_id IS NULL OR q.course_outcome_id = p_course_outcome_id)
      AND (p_k_level_id IS NULL OR q.k_level_id = p_k_level_id)
      AND (p_question_type_id IS NULL OR q.question_type_id = p_question_type_id)
      AND (p_exclude_ids IS NULL OR q.id <> ALL(p_exclude_ids))
    ORDER BY RANDOM()
    LIMIT p_num_questions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
