import { Question, PaperSectionConfig, GeneratedPaperSnapshot, GeneratedPaperSection, GeneratedPaperQuestion } from '@/types';
import { QuestionService } from '@/services/question.service';
import { MasterDataService } from '@/services/master-data.service';

export interface GenerationRequest {
  department_id: string;
  course_id: string;
  title?: string;
  college_name?: string;
  exam_name?: string;
  semester?: number;
  academic_year?: string;
  date_of_exam?: string;
  duration_minutes?: number;
  instructions?: string[];
  sections: PaperSectionConfig[];
}

export interface SectionValidationResult {
  section_name: string;
  required_questions: number;
  available_questions: number;
  isValid: boolean;
  message?: string;
}

export interface GenerationResult {
  success: boolean;
  paper?: GeneratedPaperSnapshot;
  validationResults?: SectionValidationResult[];
  errorMessage?: string;
}

export class QuestionGeneratorEngine {
  private static matchesQuestionType(q: Question, targetCode?: string): boolean {
    if (!targetCode) return true;
    if (q.question_type?.code === targetCode) return true;
    const marks = Number(q.mark_value);
    if (targetCode === 'MCQ') return marks === 1;
    if (targetCode === 'SHORT') return marks === 2;
    if (targetCode === 'LONG') return marks >= 5;
    return true;
  }

  /**
   * Validate availability of questions across all requested sections prior to generation.
   */
  static async validateAvailability(request: GenerationRequest): Promise<SectionValidationResult[]> {
    const allQuestions = await QuestionService.getQuestions({
      department_id: request.department_id,
      course_id: request.course_id
    });

    const results: SectionValidationResult[] = [];

    for (const sec of request.sections) {
      // Calculate how many questions this section requires (double if OR pattern)
      const multiplier = sec.has_or_pattern ? 2 : 1;
      const totalNeeded = sec.num_questions * multiplier;

      // Filter matching questions
      const matching = allQuestions.filter(q => {
        if (Number(q.mark_value) !== Number(sec.marks_per_question)) return false;
        
        if (sec.module_ids && sec.module_ids.length > 0) {
          if (!sec.module_ids.includes(q.module_id)) return false;
        } else if (sec.module_id && q.module_id !== sec.module_id) {
          return false;
        }

        if (sec.course_outcome_ids && sec.course_outcome_ids.length > 0) {
          if (!sec.course_outcome_ids.includes(q.course_outcome_id)) return false;
        } else if (sec.course_outcome_id && q.course_outcome_id !== sec.course_outcome_id) {
          return false;
        }

        if (sec.k_level_ids && sec.k_level_ids.length > 0) {
          if (!sec.k_level_ids.includes(q.k_level_id)) return false;
        } else if (sec.k_level_id && q.k_level_id !== sec.k_level_id) {
          return false;
        }

        if (!this.matchesQuestionType(q, sec.question_type_code)) return false;
        return true;
      });

      const isValid = matching.length >= totalNeeded;
      results.push({
        section_name: sec.section_name,
        required_questions: totalNeeded,
        available_questions: matching.length,
        isValid,
        message: isValid
          ? `✓ Ready (${matching.length} available)`
          : `✕ Required: ${totalNeeded} questions. Available: ${matching.length} matching criteria.`
      });
    }

    return results;
  }

  /**
   * Main paper generation algorithm guaranteeing 0 duplicates and correct section structure.
   */
  static async generatePaper(request: GenerationRequest): Promise<GenerationResult> {
    // 1. Validate section availability
    const validationResults = await this.validateAvailability(request);
    const failedSection = validationResults.find(v => !v.isValid);

    if (failedSection) {
      return {
        success: false,
        validationResults,
        errorMessage: `Cannot generate paper: ${failedSection.section_name} does not have enough matching questions. (${failedSection.message})`
      };
    }

    // 2. Load Master Data metadata
    const [departments, courses] = await Promise.all([
      MasterDataService.getDepartments(),
      MasterDataService.getCourses()
    ]);

    const dept = departments.find(d => d.id === request.department_id);
    const course = courses.find(c => c.id === request.course_id);

    const allQuestions = await QuestionService.getQuestions({
      department_id: request.department_id,
      course_id: request.course_id
    });

    // Track used question IDs across the entire paper to guarantee 0 duplicates
    const usedQuestionIds = new Set<string>();
    const generatedSections: GeneratedPaperSection[] = [];

    let overallQuestionCounter = 1;
    let computedTotalMarks = 0;

    // 3. Process each section in order
    const sortedSections = [...request.sections].sort((a, b) => a.section_order - b.section_order);

    for (const sec of sortedSections) {
      const sectionQuestions: GeneratedPaperQuestion[] = [];
      const sectionTotalMarks = sec.num_questions * sec.marks_per_question;
      computedTotalMarks += sectionTotalMarks;

      // Eligible questions for this section excluding already used IDs
      let eligible = allQuestions.filter(q => {
        if (usedQuestionIds.has(q.id)) return false;
        if (Number(q.mark_value) !== Number(sec.marks_per_question)) return false;
        if (sec.module_ids && sec.module_ids.length > 0) {
          if (!sec.module_ids.includes(q.module_id)) return false;
        } else if (sec.module_id && q.module_id !== sec.module_id) {
          return false;
        }

        if (sec.course_outcome_ids && sec.course_outcome_ids.length > 0) {
          if (!sec.course_outcome_ids.includes(q.course_outcome_id)) return false;
        } else if (sec.course_outcome_id && q.course_outcome_id !== sec.course_outcome_id) {
          return false;
        }

        if (sec.k_level_ids && sec.k_level_ids.length > 0) {
          if (!sec.k_level_ids.includes(q.k_level_id)) return false;
        } else if (sec.k_level_id && q.k_level_id !== sec.k_level_id) {
          return false;
        }
        if (!this.matchesQuestionType(q, sec.question_type_code)) return false;
        return true;
      });

      // Shuffle eligible questions using Fisher-Yates randomizer
      eligible = this.shuffleArray(eligible);

      for (let qIdx = 0; qIdx < sec.num_questions; qIdx++) {
        if (sec.has_or_pattern) {
          // Need TWO distinct questions for OR choice
          if (eligible.length < 2) {
            return {
              success: false,
              errorMessage: `Insufficient unique questions remaining for OR choices in ${sec.section_name}.`
            };
          }

          const mainQ = eligible.shift()!;
          const altQ = eligible.shift()!;

          usedQuestionIds.add(mainQ.id);
          usedQuestionIds.add(altQ.id);

          sectionQuestions.push({
            id: mainQ.id,
            question_number: overallQuestionCounter,
            question_text: mainQ.question_text,
            marks: mainQ.mark_value,
            course_outcome_code: mainQ.course_outcome?.code || 'CO1',
            k_level_code: mainQ.k_level?.code || 'K1',
            question_type_code: mainQ.question_type?.code || 'LONG',
            options: mainQ.options,
            is_or_choice: true,
            alternative_question_text: altQ.question_text,
            alternative_options: altQ.options
          });
        } else {
          // Single question
          if (eligible.length < 1) {
            return {
              success: false,
              errorMessage: `Insufficient unique questions remaining for ${sec.section_name}.`
            };
          }

          const mainQ = eligible.shift()!;
          usedQuestionIds.add(mainQ.id);

          sectionQuestions.push({
            id: mainQ.id,
            question_number: overallQuestionCounter,
            question_text: mainQ.question_text,
            marks: mainQ.mark_value,
            course_outcome_code: mainQ.course_outcome?.code || 'CO1',
            k_level_code: mainQ.k_level?.code || 'K1',
            question_type_code: mainQ.question_type?.code || 'MCQ',
            options: mainQ.options,
            is_or_choice: false
          });
        }

        overallQuestionCounter++;
      }

      generatedSections.push({
        id: crypto.randomUUID(),
        section_name: sec.section_name,
        section_order: sec.section_order,
        instructions: `Answer all questions in this section (${sec.num_questions} × ${sec.marks_per_question} = ${sectionTotalMarks} Marks)`,
        total_section_marks: sectionTotalMarks,
        questions: sectionQuestions
      });
    }

    // 4. Construct complete snapshot object
    const snapshot: GeneratedPaperSnapshot = {
      college_name: request.college_name || 'PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY',
      department_name: dept?.name || 'Department of Computer Science & Engineering',
      course_code: course?.code || 'CS8591',
      course_name: course?.name || 'Computer Networks',
      exam_name: request.exam_name || 'END SEMESTER EXAMINATIONS - APRIL / MAY 2026',
      semester: request.semester || course?.semester || 5,
      academic_year: request.academic_year || course?.academic_year || '2025-2026',
      date_of_exam: request.date_of_exam || new Date().toISOString().split('T')[0],
      duration_minutes: request.duration_minutes || 180,
      total_marks: computedTotalMarks,
      instructions: request.instructions || [
        'Answer all questions.',
        'Read each question carefully before attempting.',
        'Assume suitable additional data if required.'
      ],
      sections: generatedSections
    };

    return {
      success: true,
      paper: snapshot,
      validationResults
    };
  }

  /**
   * Utility Fisher-Yates array shuffling algorithm for true random distribution.
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
