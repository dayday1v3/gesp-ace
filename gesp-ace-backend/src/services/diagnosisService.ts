import prisma from '../config/database.js';
import { cacheService } from '../config/redis.js';
import { CACHE_KEYS, CACHE_TTL } from '../constants/config.js';
import {
  WeakPoint,
  DiagnosisRecommendation,
  PredictedScore,
  DiagnosisReport
} from '../models/types.js';

export class DiagnosisService {
  async analyzeUserPerformance(userId: string): Promise<DiagnosisReport> {
    const cacheKey = CACHE_KEYS.diagnosis(userId);
    const cached = await cacheService.get<DiagnosisReport>(cacheKey);

    if (cached) {
      return cached;
    }

    const [weakPoints, recommendations, predictedScore] = await Promise.all([
      this.identifyWeakPoints(userId),
      this.generateRecommendations(userId, weakPoints),
      this.predictScore(userId),
    ]);

    const report: DiagnosisReport = {
      weakPoints,
      recommendations,
      predictedScore,
    };

    await cacheService.set(cacheKey, report, CACHE_TTL.diagnosis);

    return report;
  }

  private async identifyWeakPoints(userId: string): Promise<WeakPoint[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const answers = await prisma.answer.findMany({
      where: {
        practice: { userId },
        submittedAt: { gte: thirtyDaysAgo },
      },
      include: {
        question: {
          include: {
            knowledgePoint: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const knowledgeStats = new Map<string, {
      total: number;
      correct: number;
      recentTotal: number;
      recentCorrect: number;
    }>();

    for (const answer of answers) {
      const kp = answer.question.knowledgePoint;
      if (!kp) continue;

      const code = kp.code;
      if (!knowledgeStats.has(code)) {
        knowledgeStats.set(code, {
          total: 0,
          correct: 0,
          recentTotal: 0,
          recentCorrect: 0,
        });
      }

      const stat = knowledgeStats.get(code)!;
      stat.total++;
      if (answer.isCorrect) stat.correct++;

      if (answer.submittedAt >= sevenDaysAgo) {
        stat.recentTotal++;
        if (answer.isCorrect) stat.recentCorrect++;
      }
    }

    const weakPoints: WeakPoint[] = [];

    for (const [code, stat] of knowledgeStats) {
      const errorRate = stat.total > 0 ? 1 - stat.correct / stat.total : 0;
      const recentErrorRate = stat.recentTotal > 0 ? 1 - stat.recentCorrect / stat.recentTotal : errorRate;

      if (errorRate > 0.3 || (stat.recentTotal > 3 && recentErrorRate > errorRate * 1.2)) {
        const kp = await prisma.knowledgePoint.findUnique({
          where: { code },
          select: { name: true },
        });

        weakPoints.push({
          knowledgeCode: code,
          knowledgeName: kp?.name || code,
          errorRate: Math.round(errorRate * 100) / 100,
          recentMistakes: stat.recentTotal - stat.recentCorrect,
          trend: this.determineTrend(errorRate, recentErrorRate),
        });
      }
    }

    return weakPoints.sort((a, b) => b.errorRate - a.errorRate).slice(0, 10);
  }

  private determineTrend(baseRate: number, recentRate: number): 'improving' | 'stable' | 'worsening' {
    const diff = recentRate - baseRate;

    if (diff < -0.1) return 'improving';
    if (diff > 0.1) return 'worsening';
    return 'stable';
  }

  private async generateRecommendations(userId: string, weakPoints: WeakPoint[]): Promise<DiagnosisRecommendation[]> {
    const recommendations: DiagnosisRecommendation[] = [];

    if (weakPoints.length > 0) {
      recommendations.push({
        type: 'topic',
        title: '薄弱知识点专项练习',
        description: `针对${weakPoints.slice(0, 3).map(w => w.knowledgeName).join('、')}进行针对性训练`,
        knowledgeCodes: weakPoints.slice(0, 3).map(w => w.knowledgeCode),
        priority: 1,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true },
    });

    if (!user || user.streakDays < 3) {
      recommendations.push({
        type: 'daily',
        title: '坚持每日一练',
        description: '连续练习是提高的关键，建议每天完成每日一练',
        knowledgeCodes: [],
        priority: 2,
      });
    }

    recommendations.push({
      type: 'exam',
      title: '定期模拟考试',
      description: '通过模拟考试检验学习效果，查漏补缺',
      knowledgeCodes: [],
      priority: 3,
    });

    return recommendations;
  }

  private async predictScore(userId: string): Promise<PredictedScore> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const answers = await prisma.answer.findMany({
      where: {
        practice: { userId },
        submittedAt: { gte: thirtyDaysAgo },
        question: { type: { not: 'coding' } },
      },
    });

    if (answers.length === 0) {
      return { low: 60, mid: 75, high: 90 };
    }

    const correctCount = answers.filter(a => a.isCorrect).length;
    const baseRate = correctCount / answers.length;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true },
    });

    const streakBonus = user?.streakDays ? Math.min(user.streakDays * 0.5, 10) : 0;
    const adjustedRate = Math.min(baseRate + streakBonus / 100, 1);

    return {
      low: Math.round(adjustedRate * 80),
      mid: Math.round(adjustedRate * 90),
      high: Math.round(Math.min(adjustedRate * 100, 100)),
    };
  }

  async getWeakPoints(userId: string): Promise<WeakPoint[]> {
    return this.identifyWeakPoints(userId);
  }
}

export const diagnosisService = new DiagnosisService();
