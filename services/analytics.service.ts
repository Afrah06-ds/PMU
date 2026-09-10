import { QuestionService } from './question.service';
import { MasterDataService } from './master-data.service';
import { PaperService } from './paper.service';

export interface AnalyticsSummary {
  totalQuestions: number;
  totalCourses: number;
  totalModules: number;
  totalGeneratedPapers: number;
  byMarks: { mark: number; count: number }[];
  byCO: { co: string; count: number }[];
  byKLevel: { klevel: string; count: number }[];
  byModule: { moduleTitle: string; count: number }[];
  byType: { typeName: string; count: number }[];
}

export class AnalyticsService {
  static async getSummary(courseId?: string): Promise<AnalyticsSummary> {
    const questions = await QuestionService.getQuestions(courseId ? { course_id: courseId } : undefined);
    const courses = await MasterDataService.getCourses();
    const modules = await MasterDataService.getModules(courseId);
    const cos = await MasterDataService.getCourseOutcomes(courseId);
    const klevels = await MasterDataService.getKLevels();
    const papers = await PaperService.getPapers();

    // 1. By Marks
    const markCountsMap: Record<number, number> = {};
    questions.forEach(q => {
      const val = Number(q.mark_value);
      markCountsMap[val] = (markCountsMap[val] || 0) + 1;
    });

    const byMarks = [1, 2, 10, 15, 20].map(m => ({
      mark: m,
      count: markCountsMap[m] || 0
    }));

    // 2. By CO
    const coCountsMap: Record<string, number> = {};
    questions.forEach(q => {
      const code = q.course_outcome?.code || 'CO1';
      coCountsMap[code] = (coCountsMap[code] || 0) + 1;
    });

    const byCO = cos.map(co => ({
      co: co.code,
      count: coCountsMap[co.code] || 0
    }));

    // 3. By K-Level
    const kCountsMap: Record<string, number> = {};
    questions.forEach(q => {
      const code = q.k_level?.code || 'K1';
      kCountsMap[code] = (kCountsMap[code] || 0) + 1;
    });

    const byKLevel = klevels.map(k => ({
      klevel: `${k.code} (${k.name})`,
      count: kCountsMap[k.code] || 0
    }));

    // 4. By Module
    const modCountsMap: Record<string, number> = {};
    questions.forEach(q => {
      const title = q.module ? `Mod ${q.module.module_number}: ${q.module.title.slice(0, 15)}...` : 'Unassigned';
      modCountsMap[title] = (modCountsMap[title] || 0) + 1;
    });

    const byModule = modules.map(m => {
      const title = `Mod ${m.module_number}: ${m.title.slice(0, 15)}...`;
      return {
        moduleTitle: title,
        count: modCountsMap[title] || 0
      };
    });

    // 5. By Question Type
    const typeCountsMap: Record<string, number> = {};
    questions.forEach(q => {
      const typeName = q.question_type?.name || 'MCQ';
      typeCountsMap[typeName] = (typeCountsMap[typeName] || 0) + 1;
    });

    const byType = Object.entries(typeCountsMap).map(([typeName, count]) => ({
      typeName,
      count
    }));

    return {
      totalQuestions: questions.length,
      totalCourses: courses.length,
      totalModules: modules.length,
      totalGeneratedPapers: papers.length,
      byMarks,
      byCO,
      byKLevel,
      byModule,
      byType
    };
  }
}
