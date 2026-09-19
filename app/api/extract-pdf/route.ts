import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { ParsedCourseMetadata, ParsedQuestionBankRow, QuestionBankParser } from '@/lib/question-bank-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // In Node.js / Vercel serverless environments, initialize the PDF worker in-process
    // so PDF.js does not attempt to locate or dynamically import external worker files from disk.
    if (!(globalThis as any).pdfjsWorker) {
      try {
        const pdfWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
        (globalThis as any).pdfjsWorker = pdfWorker;
      } catch (workerErr) {
        console.warn('Failed to initialize pdfjs worker in-process:', workerErr);
      }
    }

    // Load PDF using pdfjs legacy build for Node.js
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const publicWorker = path.join(process.cwd(), 'public/pdf.worker.mjs');
    const srcWorker = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    if (pdfjs.GlobalWorkerOptions) {
      if (fs.existsSync(publicWorker)) {
        pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(publicWorker).href;
      } else if (fs.existsSync(srcWorker)) {
        pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(srcWorker).href;
      }
    }

    const doc = await pdfjs.getDocument({
      data: buffer,
      useSystemFonts: true,
      disableFontFace: true,
      isEvalSupported: false
    }).promise;

    const numPages = doc.numPages;
    const pageTexts: string[] = [];

    // 1. Extract Page 1: Course Metadata & Course Outcomes
    // 1. Extract Page 1: Course Metadata & Course Outcomes
    let metadata: ParsedCourseMetadata = {
      course_code: '',
      course_name: '',
      department_code: 'Informatics',
      programme_code: '366',
      programme_name: 'M.Sc. Data Science',
      academic_year: '2025-2026',
      batch: '2025 - 2027',
      semester: 2,
      course_category: 'Programme Core Courses',
      course_type: 'Theory Course',
      learning_hours: 45,
      no_of_learners: 20,
      course_coordinator: 'Dr. A. MUTHAMIZH SELVAN, Associate Professor, Department of Informatics',
      course_teacher: 'Mr. N. SENTHIL KUMAR, Assistant Professor (SS), Department of Informatics',
      modules: [],
      course_outcomes: []
    };

    if (numPages >= 1) {
      const page1 = await doc.getPage(1);
      const content1 = await page1.getTextContent();
      const items1 = (content1.items || []).filter((it: any) => it.str && it.str.trim());

      const leftItems = items1.filter((it: any) => it.transform[4] < 420);
      const rightItems = items1.filter((it: any) => it.transform[4] >= 420);

      // Group left items into rows
      const sortedLeft = [...leftItems].sort((a: any, b: any) => b.transform[5] - a.transform[5]);
      const leftRows: Array<{ y: number; items: any[] }> = [];
      for (const it of sortedLeft) {
        let r = leftRows.find(row => Math.abs(row.y - it.transform[5]) <= 8);
        if (!r) {
          r = { y: it.transform[5], items: [] };
          leftRows.push(r);
        }
        r.items.push(it);
      }
      leftRows.sort((a, b) => b.y - a.y);
      leftRows.forEach(r => r.items.sort((a, b) => a.transform[4] - b.transform[4]));

      const fullLeftText = leftRows.map(r => r.items.map(it => it.str.trim()).join(' ')).join('\n');

      const deptMatch = fullLeftText.match(/DEPARTMENT\s*OF\s*([A-Za-z\s]+?)(?:\n|Course|$)/i);
      if (deptMatch) metadata.department_code = deptMatch[1].trim();

      for (const r of leftRows) {
        const text = r.items.map(i => i.str.trim()).join(' ');

        if (/366|\bProgramme\b|\bM\.Sc\b|\bB\.Sc\b/i.test(text)) {
          const codeIt = r.items.find(i => i.transform[4] >= 110 && i.transform[4] <= 180 && /^\d+$/.test(i.str.trim()));
          if (codeIt) metadata.programme_code = codeIt.str.trim();
          const nameIts = r.items.filter(i => i.transform[4] >= 240);
          if (nameIts.length > 0 && !metadata.programme_name) metadata.programme_name = nameIts.map(i => i.str.trim()).join(' ');
        }

        const codeIt = r.items.find(i => /^[A-Z][A-Z0-9]{5,8}$/.test(i.str.trim()) && !['PERIYAR', 'SCIENCE', 'FACULTY', 'PROGRAMME'].includes(i.str.trim()));
        if (codeIt) {
          metadata.course_code = codeIt.str.trim();
          const nameIts = r.items.filter(i => i.transform[4] >= 240);
          if (nameIts.length > 0) metadata.course_name = nameIts.map(i => i.str.trim()).join(' ');
        }
      }

      // Fallbacks
      if (!metadata.course_code) {
        const cMatch = fullLeftText.match(/\b([A-Z][0-9]{2}[A-Z]{2}[0-9]{3}|[A-Z]{2,4}\d{3,5}|X[A-Z0-9]{5})\b/i);
        if (cMatch) metadata.course_code = cMatch[1];
      }
      if (!metadata.course_name) {
        const nMatch = fullLeftText.match(/Course\s*Name[\s:]*([A-Za-z\s]+?)(?=\n|Course|Batch|$)/i);
        if (nMatch) metadata.course_name = nMatch[1].trim();
      }

      const batchMatch = fullLeftText.match(/Batch[\s:]*(\d{4}\s*-\s*\d{4})/i);
      if (batchMatch) metadata.batch = batchMatch[1].trim();

      const ayMatch = fullLeftText.match(/Academic\s*Year[\s:]*(\d{4}\s*-\s*\d{4})/i) || fullLeftText.match(/(\d{4}\s*-\s*\d{4})/);
      if (ayMatch) metadata.academic_year = ayMatch[1].trim();

      const semMatch = fullLeftText.match(/Semester[\s:]*([A-Za-z0-9]+)/i);
      if (semMatch) {
        const sStr = semMatch[1].toUpperCase();
        if (sStr === 'EVEN') metadata.semester = 2;
        else if (sStr === 'ODD') metadata.semester = 1;
        else metadata.semester = parseInt(sStr, 10) || 6;
      }

      // Extract COs from Right Column (x >= 420)
      const coItems = rightItems
        .filter((it: any) => it.transform[4] >= 425 && it.transform[4] <= 455 && it.str.trim().match(/^CO[1-6]$/))
        .sort((a: any, b: any) => b.transform[5] - a.transform[5]);

      if (coItems.length > 0) {
        const extractedCOs: Array<{ code: string; description: string; rbt_level: string }> = [];
        for (let k = 0; k < coItems.length; k++) {
          const cItem = coItems[k];
          const cY = cItem.transform[5];
          const topY = k === 0 ? cY + 30 : (cY + coItems[k - 1].transform[5]) / 2;
          const bottomY = k === coItems.length - 1 ? 40 : (cY + coItems[k + 1].transform[5]) / 2;

          const rowItems = rightItems
            .filter((it: any) => it.transform[5] < topY && it.transform[5] >= bottomY)
            .sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

          let desc = '';
          let rbt = 'K2';
          for (const it of rowItems) {
            const x = it.transform[4];
            const s = it.str.trim();
            if (x >= 455 && x <= 720) {
              desc += (desc ? ' ' : '') + s;
            } else if (x > 720 && s.match(/^K[1-6]$/)) {
              rbt = s;
            }
          }

          extractedCOs.push({
            code: cItem.str.trim(),
            description: desc || `Course Outcome ${cItem.str.trim()}`,
            rbt_level: rbt
          });
        }
        if (extractedCOs.length > 0) {
          metadata.course_outcomes = extractedCOs;
        }
      }
    }

    if (!metadata.course_code) metadata.course_code = 'P24DS151';
    if (!metadata.course_name) metadata.course_name = 'Machine Learning Techniques';

    // 2. Discover Units / Modules across Pages 2 to numPages
    const discoveredModules: Array<{ module_number: number; title: string; syllabus: string; page: number }> = [];

    for (let p = 2; p <= numPages; p++) {
      const page = await doc.getPage(p);
      const textContent = await page.getTextContent();
      const items = (textContent.items || []).filter((it: any) => it.str && it.str.trim());

      const objItem = items.find((it: any) => it.str.toUpperCase().includes('A. OBJECTIVE') || it.str.toUpperCase().includes('OBJECTIVE TYPE QUESTIONS'));
      if (objItem) {
        const objY = objItem.transform[5];
        const aboveItems = items
          .filter((it: any) => it.transform[5] > objY + 5)
          .sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

        const lines: string[] = [];
        let curLine = '';
        let lastY: number | null = null;
        for (const it of aboveItems) {
          if (lastY !== null && Math.abs(it.transform[5] - lastY) > 6) {
            if (curLine.trim()) lines.push(curLine.trim());
            curLine = '';
          }
          curLine += (curLine ? ' ' : '') + it.str.trim();
          lastY = it.transform[5];
        }
        if (curLine.trim()) lines.push(curLine.trim());

        const unitLines = lines.filter(l => l.toUpperCase() !== 'QUESTION BANK');
        const title = unitLines[0] || `Module ${discoveredModules.length + 1}`;
        const syllabus = unitLines.slice(1).join(' ');

        discoveredModules.push({
          module_number: discoveredModules.length + 1,
          title,
          syllabus,
          page: p
        });
      }
    }

    // Fallback if no modules detected via A. Objective
    if (discoveredModules.length === 0) {
      for (let mNum = 1; mNum <= 5; mNum++) {
        discoveredModules.push({
          module_number: mNum,
          title: `Module ${mNum}`,
          syllabus: '',
          page: 2 + (mNum - 1) * Math.max(1, Math.floor((numPages - 1) / 5))
        });
      }
    }

    metadata.modules = discoveredModules;

    // 3. Extract Questions Across Pages 2 to numPages
    let currentModuleIdx = 0;
    let currentSection: 'SECTION_A' | 'SECTION_B' | 'SECTION_C' = 'SECTION_A';
    const parsedQuestions: ParsedQuestionBankRow[] = [];

    for (let p = 1; p <= numPages; p++) {
      const page = await doc.getPage(p);
      const textContent = await page.getTextContent();
      const items = (textContent.items || []).filter((it: any) => it.str && it.str.trim());

      // Generate page line text for pageTexts and fullText
      const sortedByY = [...items].sort((a: any, b: any) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) > 3) return yDiff;
        return a.transform[4] - b.transform[4];
      });

      const pageLines: string[] = [];
      let currentLine = '';
      let lastY: number | null = null;
      let lastX: number | null = null;

      for (const item of sortedByY) {
        const y = item.transform[5];
        const x = item.transform[4];
        if (lastY !== null && Math.abs(y - lastY) > 3) {
          if (currentLine.trim().length > 0) pageLines.push(currentLine.trim());
          currentLine = '';
          lastX = null;
        } else if (lastX !== null && x - lastX > 3) {
          currentLine += ' ';
        }
        currentLine += item.str;
        lastY = y;
        lastX = x + (item.width || (item.str.length * 4));
      }
      if (currentLine.trim().length > 0) pageLines.push(currentLine.trim());
      pageTexts.push(pageLines.join('\n'));

      // Skip Page 1 for question extraction
      if (p === 1) continue;

      // Check if this page marks the start of a discovered module
      const foundModIdx = discoveredModules.findIndex(m => m.page === p);
      if (foundModIdx !== -1) {
        currentModuleIdx = foundModIdx;
        currentSection = 'SECTION_A';
      }

      const activeModule = discoveredModules[currentModuleIdx] || { module_number: 1, title: 'Module 1', syllabus: '' };

      // Section switch events on this page
      const events: Array<{ type: 'SECTION_A' | 'SECTION_B' | 'SECTION_C'; y: number }> = [];
      for (const it of items) {
        const s = it.str.trim().toUpperCase();
        const y = it.transform[5];
        if (s.includes('A. OBJECTIVE')) events.push({ type: 'SECTION_A', y });
        if (s.includes('B. SHORT ANSWER') || s.includes('B. SHORT ANSWERS')) events.push({ type: 'SECTION_B', y });
        if (s.includes('C. DESCRIPTIVE')) events.push({ type: 'SECTION_C', y });
      }
      events.sort((a, b) => b.y - a.y);

      // Find all Q.No items in column x in [60, 95]
      const qnoItems = items
        .filter((it: any) => {
          const x = it.transform[4];
          return x >= 60 && x <= 95 && it.str.trim().match(/^\d+[\.]?$/);
        })
        .sort((a: any, b: any) => b.transform[5] - a.transform[5]);

      if (qnoItems.length === 0) continue;

      for (let k = 0; k < qnoItems.length; k++) {
        const qItem = qnoItems[k];
        const qY = qItem.transform[5];
        const qNo = parseInt(qItem.str.trim().replace('.', ''), 10);

        // Update currentSection based on events above this question
        for (const ev of events) {
          if (qY <= ev.y) {
            currentSection = ev.type;
          }
        }

        // Calculate vertical boundaries
        let topY: number;
        if (k === 0) {
          topY = qY + 18;
          const evAbove = events.filter((e) => e.y > qY).sort((a, b) => a.y - b.y)[0];
          if (evAbove && evAbove.y < topY + 30) topY = evAbove.y - 10;
        } else {
          const secBetween = events.find((e) => e.y < qnoItems[k - 1].transform[5] && e.y > qY);
          if (secBetween) {
            topY = secBetween.y - 10;
          } else {
            topY = (qY + qnoItems[k - 1].transform[5]) / 2;
          }
        }

        let bottomY: number;
        if (k === qnoItems.length - 1) {
          bottomY = 0;
        } else {
          const secBetween = events.find((e) => e.y > qnoItems[k + 1].transform[5] && e.y < qY);
          if (secBetween) {
            bottomY = secBetween.y;
          } else {
            bottomY = (qY + qnoItems[k + 1].transform[5]) / 2;
          }
        }

        // Continuation items from previous page (before the first question of this page)
        if (k === 0 && parsedQuestions.length > 0) {
          const lastQ = parsedQuestions[parsedQuestions.length - 1];
          const headerItem = items.find((it: any) => it.transform[4] >= 60 && it.transform[4] <= 95 && it.str.toUpperCase().includes('Q.NO'));
          const headerY = headerItem ? headerItem.transform[5] : 500;

          const contItems = items
            .filter((it: any) => it.transform[5] > topY && it.transform[5] < headerY - 3)
            .sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

          let hasAppended = false;
          for (const it of contItems) {
            const x = Math.round(it.transform[4]);
            const str = it.str.trim();
            if (['Q.NO', 'QUESTIONS', 'COS', 'RBTL', 'KEY', 'ANSWERS', 'MARKS', 'QUESTION', 'KEY ANSWER', 'EVALUATION SCHEME'].includes(str.toUpperCase())) continue;
            if (lastQ.section_type === 'SECTION_A' && x >= 95 && x <= 590) {
              lastQ.question_text += ' ' + str;
              hasAppended = true;
            } else if (lastQ.section_type === 'SECTION_B' && x > 385 && x <= 725) {
              lastQ.key_answer += ' ' + str;
            } else if (lastQ.section_type === 'SECTION_C' && x > 385 && x <= 725) {
              lastQ.evaluation_scheme += '\n' + str;
            }
          }

          if (hasAppended && lastQ.section_type === 'SECTION_A') {
            const extracted = QuestionBankParser.extractOptionsFromText(lastQ.question_text);
            if (extracted.options.length > 0) {
              lastQ.question_text = extracted.cleanText || lastQ.question_text;
              const correctLetter = QuestionBankParser.extractCorrectLetter(lastQ.key_answer);
              lastQ.options = extracted.options.map((opt) => ({
                ...opt,
                is_correct: correctLetter ? opt.option_letter === correctLetter : false
              }));
            }
          }
        }

        // Collect all items in this question's vertical band
        const rowItems = items
          .filter((it: any) => it.transform[5] < topY && it.transform[5] >= bottomY)
          .sort((a: any, b: any) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

        let qText = '';
        let co = 'CO1';
        let kCode = 'K1';
        let key = '';
        let scheme = '';
        let marks = currentSection === 'SECTION_A' ? 1 : currentSection === 'SECTION_B' ? 2 : 15;

        for (const it of rowItems) {
          const x = Math.round(it.transform[4]);
          const str = it.str.trim();
          if (x < 95) continue;
          if (['Q.NO', 'QUESTIONS', 'COS', 'RBTL', 'KEY', 'ANSWERS', 'MARKS', 'QUESTION', 'KEY ANSWER', 'EVALUATION SCHEME'].includes(str.toUpperCase())) continue;

          if (currentSection === 'SECTION_A') {
            if (x >= 95 && x <= 590) qText += (qText ? ' ' : '') + str;
            else if (x > 590 && x <= 630) co = QuestionBankParser.normalizeCOCode(str);
            else if (x > 630 && x <= 675) kCode = QuestionBankParser.normalizeRBTCode(str);
            else if (x > 675 && x <= 725) key = str;
            else if (x > 725) {
              const mv = parseInt(str, 10);
              if (!isNaN(mv)) marks = mv;
            }
          } else if (currentSection === 'SECTION_B') {
            if (x >= 95 && x <= 310) qText += (qText ? ' ' : '') + str;
            else if (x > 310 && x <= 350) co = QuestionBankParser.normalizeCOCode(str);
            else if (x > 350 && x <= 385) kCode = QuestionBankParser.normalizeRBTCode(str);
            else if (x > 385 && x <= 725) key += (key ? ' ' : '') + str;
            else if (x > 725) {
              const mv = parseInt(str, 10);
              if (!isNaN(mv)) marks = mv;
            }
          } else {
            // SECTION_C
            if (x >= 95 && x <= 310) qText += (qText ? ' ' : '') + str;
            else if (x > 310 && x <= 350) co = QuestionBankParser.normalizeCOCode(str);
            else if (x > 350 && x <= 385) kCode = QuestionBankParser.normalizeRBTCode(str);
            else if (x > 385 && x <= 725) scheme += (scheme ? '\n' : '') + str;
            else if (x > 725) {
              const mv = parseInt(str, 10);
              if (!isNaN(mv)) marks = mv;
            }
          }
        }

        // Section A MCQ options processing
        let options = undefined;
        let cleanQuestionText = qText.trim();
        let questionTypeCode: 'MCQ' | 'SHORT' | 'LONG' = 'LONG';

        if (currentSection === 'SECTION_A') {
          questionTypeCode = 'MCQ';
          marks = 1;
          const extracted = QuestionBankParser.extractOptionsFromText(cleanQuestionText);
          cleanQuestionText = extracted.cleanText || cleanQuestionText;
          const correctLetter = QuestionBankParser.extractCorrectLetter(key);
          options = extracted.options.map((opt) => ({
            ...opt,
            is_correct: correctLetter ? opt.option_letter === correctLetter : false
          }));
        } else if (currentSection === 'SECTION_B') {
          questionTypeCode = 'SHORT';
          marks = 2;
        } else {
          questionTypeCode = 'LONG';
          if (!marks || marks <= 2) marks = 15;
        }

        parsedQuestions.push({
          q_no: qNo,
          unit_name: activeModule.title,
          module_number: activeModule.module_number,
          section_type: currentSection,
          question_text: cleanQuestionText,
          co_code: co,
          k_code: kCode,
          key_answer: key.trim(),
          evaluation_scheme: scheme.trim(),
          mark_value: marks,
          question_type_code: questionTypeCode,
          options
        });
      }
    }

    const fullText = pageTexts.join('\n');

    return NextResponse.json({
      numPages,
      metadata,
      questions: parsedQuestions,
      fullText
    });
  } catch (err: any) {
    console.error('PDF extraction error:', err);
    return NextResponse.json({ error: err.message || 'Failed to extract text from PDF' }, { status: 500 });
  }
}
