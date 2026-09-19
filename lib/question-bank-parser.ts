import * as XLSX from 'xlsx';
import { QuestionOption } from '@/types';

export interface ParsedQuestionBankRow {
  q_no?: number | string;
  question_text: string;
  mark_value: number;
  co_code: string;
  k_code: string;
  key_answer?: string;
  evaluation_scheme?: string;
  unit_name?: string;
  module_number?: number;
  unit_syllabus?: string;
  section_type: 'SECTION_A' | 'SECTION_B' | 'SECTION_C';
  options?: QuestionOption[];
  question_type_code: 'MCQ' | 'SHORT' | 'LONG';
}

export interface ParsedCourseMetadata {
  programme_code?: string;
  programme_name?: string;
  course_code?: string;
  course_name?: string;
  department_code?: string;
  course_category?: string;
  course_type?: string;
  batch?: string;
  academic_year?: string;
  semester?: string | number;
  learning_hours?: number;
  no_of_learners?: number;
  course_coordinator?: string;
  course_teacher?: string;
  modules?: Array<{ module_number: number; title: string; syllabus?: string }>;
  course_outcomes?: Array<{ code: string; description: string; rbt_level: string }>;
}

export class QuestionBankParser {
  /**
   * Extract course metadata and course outcomes from raw document text.
   */
  static extractCourseMetadata(rawText: string): ParsedCourseMetadata {
    const cleanText = rawText || '';

    // Extract Course Code (e.g. P24DS151, XDS601, CS8591, etc.)
    let courseCode = '';
    const courseCodeMatch = cleanText.match(/Course\s*Code\s*[:\s]*([A-Z0-9]+)/i)
      || cleanText.match(/\b([A-Z][0-9]{2}[A-Z]{2}[0-9]{3}|[A-Z]{2,4}\d{3,5}|X[A-Z0-9]{5}|[A-Z][A-Z0-9]{5,8})\b/);
    if (courseCodeMatch) {
      const candidate = (courseCodeMatch[1] || '').trim();
      if (!['PERIYAR', 'SCIENCE', 'FACULTY', 'PROGRAMME', 'QUESTION', 'COLLEGE'].includes(candidate.toUpperCase())) {
        courseCode = candidate;
      }
    }

    // Extract Course Name
    let courseName = '';
    const courseNameMatch = cleanText.match(/Course\s*Name\s*[:\s]*([A-Za-z\s]+?)(?=Course\s*Category|Batch|Programme|Learning|L\s*T|$|\n)/i)
      || cleanText.match(/Course\s*Name[\s\S]*?([A-Z][A-Za-z\s]{3,40})(?=\s*Course\s*Category|\s*Batch|$)/i);
    if (courseNameMatch) {
      courseName = courseNameMatch[1].trim();
    }

    const progCodeMatch = cleanText.match(/Programme\s*Code\s*[:\s]*(\d+)/i) || cleanText.match(/Code\s*[:\s]*(\d{2,4})\s+.*?M\.Sc|B\.Sc/i);
    const progNameMatch = cleanText.match(/Programme\s*Name\s*[:\s]*([A-Za-z\.\s]+?)(?=Course|$|\n)/i) || cleanText.match(/(?:M\.Sc|B\.Sc|B\.Tech|M\.Tech|B\.E|BCA|MCA)[\.\sA-Za-z]+/i);
    const semMatch = cleanText.match(/Semester\s*[:\s]*([A-Za-z0-9]+)/i);
    const deptMatch = cleanText.match(/DEPARTMENT\s*OF\s*([A-Z\s]+?)(?=Course|\n|$)/i);
    const batchMatch = cleanText.match(/Batch\s*[:\s]*(\d{4}\s*-\s*\d{4})/i);
    const ayMatch = cleanText.match(/Academic\s*Year\s*[:\s]*(\d{4}\s*-\s*\d{4})/i) || cleanText.match(/(\d{4}\s*-\s*\d{4})/);

    // Extract COs (CO1 to CO6)
    const cos: Array<{ code: string; description: string; rbt_level: string }> = [];
    const coRegex = /\b(CO[1-6])\b\s+([^\n]+?)\s+(K[1-6])/gi;
    let m;
    while ((m = coRegex.exec(cleanText)) !== null) {
      if (!cos.some(c => c.code.toUpperCase() === m[1].toUpperCase())) {
        cos.push({
          code: m[1].toUpperCase(),
          description: m[2].trim(),
          rbt_level: m[3].toUpperCase()
        });
      }
    }

    // Default 6 COs if text didn't match cleanly
    if (cos.length === 0) {
      cos.push(
        { code: 'CO1', description: `Understand fundamental concepts of ${courseName || 'the course'}`, rbt_level: 'K2' },
        { code: 'CO2', description: `Apply core analytical techniques and principles`, rbt_level: 'K3' },
        { code: 'CO3', description: `Implement algorithms and practical methodologies`, rbt_level: 'K3' },
        { code: 'CO4', description: `Analyze problems and evaluate solution outcomes`, rbt_level: 'K4' },
        { code: 'CO5', description: `Design and optimize models for complex scenarios`, rbt_level: 'K4' },
        { code: 'CO6', description: `Propose innovative real-world solutions`, rbt_level: 'K3' }
      );
    }

    let parsedSem: number = 2;
    if (semMatch) {
      const s = semMatch[1].toUpperCase();
      if (s === 'EVEN') parsedSem = 2;
      else if (s === 'ODD') parsedSem = 1;
      else parsedSem = parseInt(s, 10) || 2;
    }

    return {
      course_code: courseCode || 'P24DS151',
      course_name: courseName || 'Machine Learning Techniques',
      department_code: deptMatch ? deptMatch[1].trim() : 'Informatics',
      programme_code: progCodeMatch ? progCodeMatch[1].trim() : '366',
      programme_name: progNameMatch ? (typeof progNameMatch === 'string' ? progNameMatch : progNameMatch[0] || progNameMatch[1]).trim() : 'M.Sc. Data Science',
      batch: batchMatch ? batchMatch[1].trim() : '2025 - 2027',
      academic_year: ayMatch ? ayMatch[1].trim() : '2025-2026',
      semester: parsedSem,
      course_category: 'Programme Core Courses',
      course_type: 'Theory Course',
      learning_hours: 45,
      no_of_learners: 20,
      course_coordinator: 'Dr. A. MUTHAMIZH SELVAN, Associate Professor, Department of Informatics',
      course_teacher: 'Mr. N. SENTHIL KUMAR, Assistant Professor (SS), Department of Informatics',
      modules: [],
      course_outcomes: cos
    };
  }

  /**
   * Parse embedded options from a question text string.
   * Matches both single line and multiline: (a) opt1 (b) opt2 (c) opt3 (d) opt4
   */
  static extractOptionsFromText(text: string): { cleanText: string; options: QuestionOption[] } {
    const optionRegex = /(?:\(a\)|\ba\))\s*([\s\S]*?)(?=(?:\(b\)|\bb\))|$)(?:\(b\)|\bb\))\s*([\s\S]*?)(?=(?:\(c\)|\bc\))|$)(?:\(c\)|\bc\))\s*([\s\S]*?)(?=(?:\(d\)|\bd\))|$)(?:\(d\)|\bd\))\s*([\s\S]*?)$/i;
    
    const match = text.match(optionRegex);
    if (!match) {
      return { cleanText: text.trim(), options: [] };
    }

    const cleanText = text.substring(0, text.search(/(?:\(a\)|\ba\))/i)).trim();
    const optA = match[1]?.trim() || '';
    const optB = match[2]?.trim() || '';
    const optC = match[3]?.trim() || '';
    const optD = match[4]?.trim() || '';

    const options: QuestionOption[] = [
      { option_letter: 'a', option_text: optA, is_correct: false },
      { option_letter: 'b', option_text: optB, is_correct: false },
      { option_letter: 'c', option_text: optC, is_correct: false },
      { option_letter: 'd', option_text: optD, is_correct: false }
    ];

    return { cleanText: cleanText || text, options };
  }

  /**
   * Clean key answer string to get option letter (e.g. "(c)" -> "c", "b" -> "b").
   */
  static extractCorrectLetter(keyAnswer?: string): 'a' | 'b' | 'c' | 'd' | null {
    if (!keyAnswer) return null;
    const cleaned = String(keyAnswer).toLowerCase().trim().replace(/[\(\)\[\]\.\s]/g, '');
    if (['a', 'b', 'c', 'd'].includes(cleaned)) {
      return cleaned as 'a' | 'b' | 'c' | 'd';
    }
    return null;
  }

  /**
   * Normalize Bloom's Taxonomy / RBTL values:
   * e.g. "Remember" -> "K1", "Understand" -> "K2", "Apply" -> "K3", "Analyze" -> "K4", "RBTL1" -> "K1"
   */
  static normalizeRBTCode(rbt?: string): string {
    if (!rbt) return 'K1';
    const val = String(rbt).trim().toUpperCase();
    if (val === 'K1' || val === 'K2' || val === 'K3' || val === 'K4' || val === 'K5' || val === 'K6') return val;
    if (val.startsWith('RBTL')) {
      const num = val.replace('RBTL', '').trim();
      return `K${num || '1'}`;
    }
    if (val.startsWith('K') && val.length <= 3) return val;
    if (val.includes('REMEMBER')) return 'K1';
    if (val.includes('UNDERSTAND')) return 'K2';
    if (val.includes('APPLY') || val.includes('APPLICATION')) return 'K3';
    if (val.includes('ANALYZE') || val.includes('ANALYSIS')) return 'K4';
    if (val.includes('EVALUATE') || val.includes('EVALUATION')) return 'K5';
    if (val.includes('CREATE') || val.includes('CREATION') || val.includes('DESIGN')) return 'K6';
    return 'K1';
  }

  /**
   * Normalize Course Outcome code (e.g. "1" -> "CO1", "co 2" -> "CO2", "CO3" -> "CO3").
   */
  static normalizeCOCode(co?: string): string {
    if (!co) return 'CO1';
    const clean = String(co).trim().toUpperCase().replace(/\s+/g, '');
    if (clean.startsWith('CO')) return clean;
    const num = clean.replace(/[^0-9]/g, '');
    return num ? `CO${num}` : 'CO1';
  }

  /**
   * Parse a single row from an Excel or JSON import into a standardized ParsedQuestionBankRow.
   */
  static parseRow(
    row: Record<string, any>,
    currentUnit: string = 'Unit 1',
    currentSection: 'SECTION_A' | 'SECTION_B' | 'SECTION_C' = 'SECTION_A',
    currentSyllabus?: string,
    currentModuleNumber?: number
  ): ParsedQuestionBankRow | null {
    const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const mappedRow: Record<string, any> = {};
    Object.keys(row).forEach(k => {
      mappedRow[normalizeKey(k)] = row[k];
    });

    const qNo = mappedRow['qno'] || mappedRow['questionno'] || mappedRow['qnumber'] || mappedRow['no'];
    const rawQuestion = mappedRow['questions'] || mappedRow['question'] || mappedRow['questionstatement'] || mappedRow['text'] || '';
    const rawMarks = mappedRow['marks'] || mappedRow['mark'] || mappedRow['markvalue'];
    const rawCO = mappedRow['cos'] || mappedRow['co'] || mappedRow['courseoutcome'] || 'CO1';
    const rawRBTL = mappedRow['rbtl'] || mappedRow['rbtlevel'] || mappedRow['kcode'] || mappedRow['klevel'] || 'K1';
    const rawKey = mappedRow['keyanswers'] || mappedRow['keyanswer'] || mappedRow['key'] || mappedRow['correctoption'] || '';
    const rawScheme = mappedRow['evaluationscheme'] || mappedRow['scheme'] || mappedRow['rubric'] || '';
    const rawSection = mappedRow['section'] || mappedRow['sectiontype'] || mappedRow['part'];

    if (!rawQuestion || String(rawQuestion).trim().length === 0) {
      return null;
    }

    let questionText = String(rawQuestion).trim();

    // Determine section and mark value
    let sectionType = currentSection;
    if (rawSection) {
      const s = String(rawSection).toUpperCase();
      if (s.includes('A') || s.includes('OBJECTIVE')) sectionType = 'SECTION_A';
      else if (s.includes('B') || s.includes('SHORT')) sectionType = 'SECTION_B';
      else if (s.includes('C') || s.includes('DESCRIPTIVE')) sectionType = 'SECTION_C';
    }

    let markValue = rawMarks !== undefined && rawMarks !== null ? Number(rawMarks) : 0;
    if (!markValue) {
      if (sectionType === 'SECTION_A') markValue = 1;
      else if (sectionType === 'SECTION_B') markValue = 2;
      else markValue = 15;
    }

    if (markValue === 1 && sectionType !== 'SECTION_A') sectionType = 'SECTION_A';
    if (markValue === 2 && sectionType !== 'SECTION_B') sectionType = 'SECTION_B';
    if (markValue >= 5 && sectionType !== 'SECTION_C') sectionType = 'SECTION_C';

    const coCode = this.normalizeCOCode(String(rawCO));
    const kCode = this.normalizeRBTCode(String(rawRBTL));

    let options: QuestionOption[] = [];
    let keyAnswer = String(rawKey || '').trim();
    let evaluationScheme = String(rawScheme || '').trim();

    // Check separate option columns
    const optA = mappedRow['optiona'] || mappedRow['a'];
    const optB = mappedRow['optionb'] || mappedRow['b'];
    const optC = mappedRow['optionc'] || mappedRow['c'];
    const optD = mappedRow['optiond'] || mappedRow['d'];

    if (optA && optB) {
      const correctLetter = this.extractCorrectLetter(keyAnswer);
      options = [
        { option_letter: 'a', option_text: String(optA).trim(), is_correct: correctLetter === 'a' },
        { option_letter: 'b', option_text: String(optB).trim(), is_correct: correctLetter === 'b' },
        { option_letter: 'c', option_text: String(optC || '').trim(), is_correct: correctLetter === 'c' },
        { option_letter: 'd', option_text: String(optD || '').trim(), is_correct: correctLetter === 'd' }
      ].filter(o => o.option_text.length > 0);
    } else if (sectionType === 'SECTION_A' || markValue === 1) {
      // Extract inline options from question text
      const extracted = this.extractOptionsFromText(questionText);
      if (extracted.options.length > 0) {
        questionText = extracted.cleanText;
        const correctLetter = this.extractCorrectLetter(keyAnswer);
        options = extracted.options.map(opt => ({
          ...opt,
          is_correct: correctLetter ? opt.option_letter === correctLetter : opt.is_correct
        }));
      }
    }

    let typeCode: 'MCQ' | 'SHORT' | 'LONG' = 'LONG';
    if (sectionType === 'SECTION_A' || markValue === 1 || options.length > 0) {
      typeCode = 'MCQ';
    } else if (sectionType === 'SECTION_B' || markValue === 2) {
      typeCode = 'SHORT';
    } else {
      typeCode = 'LONG';
    }

    return {
      q_no: qNo,
      question_text: questionText,
      mark_value: markValue,
      co_code: coCode,
      k_code: kCode,
      key_answer: keyAnswer,
      evaluation_scheme: evaluationScheme,
      unit_name: currentUnit,
      module_number: currentModuleNumber,
      unit_syllabus: currentSyllabus,
      section_type: sectionType,
      options,
      question_type_code: typeCode
    };
  }

  /**
   * Parse full spreadsheet rows into categorized questions and unit structures.
   */
  static parseSpreadsheetData(data: Record<string, any>[]): {
    questions: ParsedQuestionBankRow[];
    metadata?: ParsedCourseMetadata;
  } {
    const questions: ParsedQuestionBankRow[] = [];
    let currentUnit = 'Unit 1';
    let currentModuleNumber = 1;
    let currentSyllabus = '';
    let currentSection: 'SECTION_A' | 'SECTION_B' | 'SECTION_C' = 'SECTION_A';

    for (const row of data) {
      const values = Object.values(row).map(v => String(v || '').trim());
      const rowString = values.join(' ').toUpperCase();

      // Check for Section headers
      if (rowString.includes('A. OBJECTIVE') || rowString.includes('OBJECTIVE TYPE')) {
        currentSection = 'SECTION_A';
        continue;
      }
      if (rowString.includes('B. SHORT ANSWER') || rowString.includes('SHORT ANSWERS')) {
        currentSection = 'SECTION_B';
        continue;
      }
      if (rowString.includes('C. DESCRIPTIVE') || rowString.includes('DESCRIPTIVE QUESTION')) {
        currentSection = 'SECTION_C';
        continue;
      }

      // Check for Unit / Module headers
      if (
        values[0] &&
        (values[0].toUpperCase().startsWith('UNIT') ||
         values[0].toUpperCase().startsWith('MODULE') ||
         (values[0].length > 4 && values[0] === values[0].toUpperCase() && !values[0].includes('QUESTION') && !values[0].includes('MARKS')))
      ) {
        currentUnit = values[0].replace(/^(UNIT|MODULE)\s*\d*[:\-\s]*/i, '').trim() || values[0];
        const numMatch = values[0].match(/(?:UNIT|MODULE)\s*(\d+)/i);
        if (numMatch) {
          currentModuleNumber = parseInt(numMatch[1], 10);
        } else if (questions.length > 0) {
          currentModuleNumber++;
        }
        if (values[1] && values[1].length > 15) {
          currentSyllabus = values[1];
        }
        currentSection = 'SECTION_A';
        continue;
      }

      const parsed = this.parseRow(row, currentUnit, currentSection, currentSyllabus, currentModuleNumber);
      if (parsed) {
        questions.push(parsed);
      }
    }

    return { questions };
  }

  /**
   * Parse plain text / OCR text copied directly from a PDF or Word document.
   */
  static parseText(rawText: string): {
    questions: ParsedQuestionBankRow[];
    metadata?: ParsedCourseMetadata;
  } {
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const questions: ParsedQuestionBankRow[] = [];

    let currentUnit = 'Unit 1';
    let currentModuleNumber = 1;
    let currentSyllabus = '';
    let currentSection: 'SECTION_A' | 'SECTION_B' | 'SECTION_C' = 'SECTION_A';

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const upper = line.toUpperCase();

      // Detect Section Headers
      if (upper.includes('A. OBJECTIVE') || upper.includes('OBJECTIVE TYPE QUESTIONS')) {
        currentSection = 'SECTION_A';
        i++;
        continue;
      }
      if (upper.includes('B. SHORT ANSWER') || upper.includes('SHORT ANSWERS QUESTIONS')) {
        currentSection = 'SECTION_B';
        i++;
        continue;
      }
      if (upper.includes('C. DESCRIPTIVE') || upper.includes('DESCRIPTIVE QUESTIONS')) {
        currentSection = 'SECTION_C';
        i++;
        continue;
      }

      // Detect Unit Titles
      if (
        upper.startsWith('UNIT -') ||
        upper.startsWith('UNIT ') ||
        upper.startsWith('MODULE ') ||
        (i + 1 < lines.length && lines[i + 1].toUpperCase().includes('A. OBJECTIVE')) ||
        (upper.length > 5 && upper === line && !upper.startsWith('Q.NO') && !upper.includes('QUESTION BANK') && !upper.includes('INSTITUTE') && !upper.includes('DEPARTMENT') && !upper.startsWith('A.') && !upper.startsWith('B.') && !upper.startsWith('C.'))
      ) {
        currentUnit = line.replace(/^(UNIT|MODULE)\s*\d*[:\-\s]*/i, '').trim() || line;
        const numMatch = line.match(/(?:UNIT|MODULE)\s*(\d+)/i);
        if (numMatch) {
          currentModuleNumber = parseInt(numMatch[1], 10);
        } else if (questions.length > 0) {
          currentModuleNumber++;
        }
        currentSection = 'SECTION_A';
        if (i + 1 < lines.length && !lines[i + 1].startsWith('A.') && !lines[i + 1].startsWith('Q.') && !lines[i + 1].startsWith('B.') && !lines[i + 1].startsWith('C.')) {
          currentSyllabus = lines[i + 1];
          i++;
        }
        i++;
        continue;
      }

      // Skip table headers
      if (upper.includes('Q.NO') && upper.includes('QUESTIONS') && upper.includes('COS')) {
        i++;
        continue;
      }

      // Check if line begins with a Question Number (e.g. "1", "1.", "14", etc.)
      const qNumMatch = line.match(/^(\d+)[\.\s]+([\s\S]*)/);
      if (qNumMatch) {
        const qNo = Number(qNumMatch[1]);
        let remaining = qNumMatch[2].trim();

        // Accumulate lines until next number or section header
        let fullQuestionBlock = remaining;
        let j = i + 1;
        while (
          j < lines.length &&
          !lines[j].match(/^\d+[\.\s]/) &&
          !lines[j].toUpperCase().startsWith('A.') &&
          !lines[j].toUpperCase().startsWith('B.') &&
          !lines[j].toUpperCase().startsWith('C.') &&
          !lines[j].toUpperCase().startsWith('Q.NO')
        ) {
          fullQuestionBlock += '\n' + lines[j];
          j++;
        }
        i = j - 1; // will advance at end of loop

        // Extract CO (e.g. CO1, CO2)
        const coMatch = fullQuestionBlock.match(/\b(CO[1-6])\b/i);
        const coCode = coMatch ? coMatch[1].toUpperCase() : 'CO1';

        // Extract RBTL (e.g. K1, K2, K3, K4, Remember, Understand, Analyze, Apply)
        const rbtlMatch = fullQuestionBlock.match(/\b(K[1-6]|RBTL\d|Remember|Understand|Apply|Analyze|Evaluate|Create)\b/i);
        const kCode = this.normalizeRBTCode(rbtlMatch ? rbtlMatch[1] : 'K1');

        if (currentSection === 'SECTION_A') {
          // Objective Type Question
          // Clean question text and extract key answer like (c), (a), (b), (d)
          const keyMatch = fullQuestionBlock.match(/\(([a-d])\)\s*(?:1)?$/i) || fullQuestionBlock.match(/\bKey\s*Answers?[:\s]*\(?([a-d])\)?/i);
          const keyAnswer = keyMatch ? `(${keyMatch[1].toLowerCase()})` : '';

          let qClean = fullQuestionBlock
            .replace(/\b(CO[1-6])\b/i, '')
            .replace(/\b(K[1-6]|RBTL\d|Remember|Understand|Apply|Analyze)\b/i, '')
            .replace(/\(([a-d])\)\s*(?:1)?$/i, '')
            .replace(/\s+1\s*$/, '')
            .trim();

          const extracted = this.extractOptionsFromText(qClean);
          const correctLetter = this.extractCorrectLetter(keyAnswer);

          questions.push({
            q_no: qNo,
            question_text: extracted.cleanText || qClean,
            mark_value: 1,
            co_code: coCode,
            k_code: kCode,
            key_answer: keyAnswer,
            evaluation_scheme: '',
            unit_name: currentUnit,
            module_number: currentModuleNumber,
            unit_syllabus: currentSyllabus,
            section_type: 'SECTION_A',
            options: extracted.options.map(opt => ({
              ...opt,
              is_correct: correctLetter ? opt.option_letter === correctLetter : opt.is_correct
            })),
            question_type_code: 'MCQ'
          });
        } else if (currentSection === 'SECTION_B') {
          // Short Answers Questions (2 Marks)
          let text = fullQuestionBlock
            .replace(/\b(CO[1-6])\b/i, '')
            .replace(/\b(K[1-6]|RBTL\d|Remember|Understand|Apply|Analyze)\b/i, '')
            .replace(/\s+2\s*$/, '')
            .trim();

          // Check if there is a Key Answer / definition embedded
          let qText = text;
          let keyAnswer = '';
          const keySplit = text.split(/\bKey\s*Answer[:\s]*/i);
          if (keySplit.length > 1) {
            qText = keySplit[0].trim();
            keyAnswer = keySplit[1].trim();
          }

          questions.push({
            q_no: qNo,
            question_text: qText,
            mark_value: 2,
            co_code: coCode,
            k_code: kCode,
            key_answer: keyAnswer,
            evaluation_scheme: '',
            unit_name: currentUnit,
            module_number: currentModuleNumber,
            unit_syllabus: currentSyllabus,
            section_type: 'SECTION_B',
            question_type_code: 'SHORT'
          });
        } else {
          // Descriptive Questions (5-15 Marks)
          const markMatch = fullQuestionBlock.match(/\b(7|8|10|15|16|20)\s*$/);
          const marks = markMatch ? Number(markMatch[1]) : 15;

          let scheme = '';
          let qText = fullQuestionBlock
            .replace(/\b(CO[1-6])\b/i, '')
            .replace(/\b(K[1-6]|RBTL\d|Remember|Understand|Apply|Analyze)\b/i, '')
            .replace(/\b(7|8|10|15|16|20)\s*$/, '')
            .trim();

          // Check for Evaluation Scheme rubric (e.g. K2 (60% = 5 Marks))
          const schemeIndex = qText.search(/\b(?:Evaluation\s*Scheme|K[1-6]\s*\(\d+%\s*=\s*\d+\s*Marks?\))/i);
          if (schemeIndex !== -1) {
            scheme = qText.substring(schemeIndex).replace(/^Evaluation\s*Scheme[:\s]*/i, '').trim();
            qText = qText.substring(0, schemeIndex).trim();
          }

          questions.push({
            q_no: qNo,
            question_text: qText,
            mark_value: marks,
            co_code: coCode,
            k_code: kCode,
            key_answer: '',
            evaluation_scheme: scheme,
            unit_name: currentUnit,
            module_number: currentModuleNumber,
            unit_syllabus: currentSyllabus,
            section_type: 'SECTION_C',
            question_type_code: 'LONG'
          });
        }
      }
      i++;
    }

    return { questions };
  }

  /**
   * Generates an official PMIST Question Bank Excel Workbook template.
   */
  static generateTemplateWorkbook(): XLSX.WorkBook {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Course Info & Outcomes
    const courseInfoData = [
      { 'Field': 'PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY', 'Value': 'DEPARTMENT OF INFORMATICS (FCSA)' },
      { 'Field': 'Programme Code', 'Value': 172 },
      { 'Field': 'Programme Name', 'Value': 'B.Sc. Data Science' },
      { 'Field': 'Course Code', 'Value': 'XDS601' },
      { 'Field': 'Course Name', 'Value': 'Big Data Analytics' },
      { 'Field': 'Course Category', 'Value': 'Programme Core Courses' },
      { 'Field': 'Course Type', 'Value': 'Theory Course' },
      { 'Field': 'Batch', 'Value': '2023 - 2026' },
      { 'Field': 'Academic Year', 'Value': '2025-2026' },
      { 'Field': 'Semester', 'Value': 'EVEN' },
      { 'Field': 'Learning Hours', 'Value': 45 },
      { 'Field': 'No. of Learners', 'Value': 58 },
      { 'Field': 'L-T-P-C', 'Value': '3-0-0-3' },
      { 'Field': 'CA / ESE Marks', 'Value': '40 / 60' },
      { 'Field': 'Course Coordinator', 'Value': 'Dr. A. MUTHAMIZH SELVAN, Associate Professor' },
      { 'Field': 'Course Teacher', 'Value': 'Mr. N. SENTHIL KUMAR, Assistant Professor (SS)' }
    ];

    const cosData = [
      { 'COs': 'CO1', 'Course Outcome': 'Describe the fundamentals, terminologies, and life cycle of Big Data', 'RBT Level': 'K2' },
      { 'COs': 'CO2', 'Course Outcome': 'Explain storage models and NoSQL databases for managing Big Data', 'RBT Level': 'K2' },
      { 'COs': 'CO3', 'Course Outcome': 'Demonstrate the use of Hadoop and its ecosystem for distributed data storage and processing', 'RBT Level': 'K3' },
      { 'COs': 'CO4', 'Course Outcome': 'Apply MapReduce, Hive, and Pig for efficient data processing and querying', 'RBT Level': 'K3' },
      { 'COs': 'CO5', 'Course Outcome': 'Analyze Big Data using advanced techniques, including statistical and machine learning methods', 'RBT Level': 'K4' },
      { 'COs': 'CO6', 'Course Outcome': 'Propose data-driven solutions for real-world problems', 'RBT Level': 'K3' }
    ];

    const wsInfo = XLSX.utils.json_to_sheet(courseInfoData);
    XLSX.utils.sheet_add_json(wsInfo, cosData, { origin: 'D1' });
    XLSX.utils.book_append_sheet(wb, wsInfo, 'Course_Details_and_COs');

    // Sheet 2: Question Bank (Unit-wise, Section A, B, C)
    const questionBankData = [
      // Unit 1 - Section A
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'A. Objective Type Questions',
        'Q.No': 1,
        'Questions': 'Big Data is mainly characterized by: (a) Small size (b) Structured format only (c) Large, complex datasets (d) Manual processing',
        'COs': 'CO1',
        'RBTL': 'K1',
        'Key Answers': '(c)',
        'Evaluation Scheme': '',
        'Marks': 1
      },
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'A. Objective Type Questions',
        'Q.No': 2,
        'Questions': 'The original 3Vs of Big Data are: (a) Volume, Velocity, Variety (b) Value, Veracity, Volume (c) Velocity, Validity, Variety (d) Volume, Visualization, Value',
        'COs': 'CO1',
        'RBTL': 'K1',
        'Key Answers': '(a)',
        'Evaluation Scheme': '',
        'Marks': 1
      },
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'A. Objective Type Questions',
        'Q.No': 3,
        'Questions': 'Which V refers to speed of data generation? (a) Volume (b) Velocity (c) Variety (d) Value',
        'COs': 'CO1',
        'RBTL': 'K1',
        'Key Answers': '(b)',
        'Evaluation Scheme': '',
        'Marks': 1
      },
      // Unit 1 - Section B
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'B. Short Answers Questions',
        'Q.No': 1,
        'Questions': 'Define Big Data.',
        'COs': 'CO1',
        'RBTL': 'K1',
        'Key Answers': 'Very large and complex data sets that require advanced tools for storage and processing.',
        'Evaluation Scheme': '',
        'Marks': 2
      },
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'B. Short Answers Questions',
        'Q.No': 2,
        'Questions': 'What are the 3Vs of Big Data?',
        'COs': 'CO1',
        'RBTL': 'K1',
        'Key Answers': 'Volume, Velocity, Variety.',
        'Evaluation Scheme': '',
        'Marks': 2
      },
      // Unit 1 - Section C
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'C. Descriptive Questions',
        'Q.No': 1,
        'Questions': 'Explain the 3Vs of Big Data with examples.',
        'COs': 'CO1',
        'RBTL': 'K2',
        'Key Answers': '',
        'Evaluation Scheme': 'K2 (60% = 5 Marks)\nConcept of 3Vs: Volume, Velocity, Variety\nK2 (40% = 2 Marks)\nExamples illustrating 3Vs',
        'Marks': 8
      },
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'C. Descriptive Questions',
        'Q.No': 2,
        'Questions': 'Describe different types of data in Big Data.',
        'COs': 'CO1',
        'RBTL': 'K2',
        'Key Answers': '',
        'Evaluation Scheme': 'K2 (60% = 4 Marks)\nStructured, Semi-structured, Unstructured data\nK2 (40% = 3 Marks)\nExamples and characteristics',
        'Marks': 7
      },
      {
        'Unit Name': 'FUNDAMENTALS OF BIG DATA',
        'Section': 'C. Descriptive Questions',
        'Q.No': 3,
        'Questions': 'Explain Big Data infrastructure components.',
        'COs': 'CO2',
        'RBTL': 'K3',
        'Key Answers': '',
        'Evaluation Scheme': 'K2 (40% = 5 Marks)\nHardware and software framework\nK3 (60% = 10 Marks)\nMajor components: storage, distributed computing, processing tools',
        'Marks': 15
      },
      // Unit 2 - Section A, B, C
      {
        'Unit Name': 'BIG DATA STORAGE CONCEPTS',
        'Section': 'A. Objective Type Questions',
        'Q.No': 1,
        'Questions': 'Cluster computing refers to: (a) Single computer (b) Group of interconnected computers working together (c) Cloud storage (d) Database clustering',
        'COs': 'CO2',
        'RBTL': 'K1',
        'Key Answers': '(b)',
        'Evaluation Scheme': '',
        'Marks': 1
      },
      {
        'Unit Name': 'BIG DATA STORAGE CONCEPTS',
        'Section': 'B. Short Answers Questions',
        'Q.No': 1,
        'Questions': 'State the CAP theorem.',
        'COs': 'CO2',
        'RBTL': 'K1',
        'Key Answers': 'A distributed system can guarantee only two of the three: Consistency, Availability, and Partition Tolerance.',
        'Evaluation Scheme': '',
        'Marks': 2
      },
      {
        'Unit Name': 'BIG DATA STORAGE CONCEPTS',
        'Section': 'C. Descriptive Questions',
        'Q.No': 1,
        'Questions': 'Compare relational and NoSQL databases with advantages and limitations.',
        'COs': 'CO2',
        'RBTL': 'K4',
        'Key Answers': '',
        'Evaluation Scheme': 'K2 (40% = 6 Marks)\nConcept of relational and NoSQL databases\nK4 (40% = 6 Marks)\nComparison: Data structure, Scalability\nK4 (20% = 3 Marks)\nAdvantages and limitations',
        'Marks': 15
      }
    ];

    const wsQB = XLSX.utils.json_to_sheet(questionBankData);
    XLSX.utils.book_append_sheet(wb, wsQB, 'Question_Bank');

    return wb;
  }
}

