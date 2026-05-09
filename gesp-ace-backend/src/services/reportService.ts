import prisma from '../config/database.js';
import { cacheService } from '../config/redis.js';
import { CACHE_KEYS, CACHE_TTL, getDateString, getWeekString, getMonthString } from '../constants/config.js';
import { WeeklyReport } from '../models/types.js';

export class ReportService {
  async getWeeklyReport(userId: string): Promise<WeeklyReport> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStr = getWeekString();
    const cacheKey = CACHE_KEYS.weekly_report(userId, weekStr);
    const cached = await cacheService.get<WeeklyReport>(cacheKey);

    if (cached) {
      return cached;
    }

    const practices = await prisma.practice.findMany({
      where: {
        userId,
        status: 'completed',
        startedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        answers: true,
      },
    });

    const practiceDays = new Set(practices.map(p => getDateString(p.startedAt))).size;
    const totalQuestions = practices.reduce((sum, p) => sum + p.answers.length, 0);
    const correctCount = practices.reduce((sum, p) => sum + p.correctCount, 0);
    const correctRate = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const timeSpent = practices.reduce((sum, p) => sum + p.timeSpent, 0);

    const improvedTopics = await this.getImprovedTopics(userId, weekStart);

    const report: WeeklyReport = {
      period: `${getDateString(weekStart)} ~ ${getDateString(weekEnd)}`,
      stats: {
        practiceDays,
        totalQuestions,
        correctRate: Math.round(correctRate * 100) / 100,
        timeSpent,
        improvedTopics,
      },
    };

    await cacheService.set(cacheKey, report, 60 * 60);

    return report;
  }

  async getMonthlyReport(userId: string): Promise<{
    period: string;
    stats: {
      practiceDays: number;
      totalQuestions: number;
      correctRate: number;
      timeSpent: number;
      levelProgress: Record<number, { correctRate: number; change: number }>;
      weakPoints: string[];
    };
  }> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthStr = getMonthString();
    const cacheKey = CACHE_KEYS.monthly_report(userId, monthStr);

    const monthStartPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthEndPrev = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

    const [currentMonth, prevMonth] = await Promise.all([
      prisma.practice.findMany({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: monthStart, lte: monthEnd },
        },
        include: { answers: true },
      }),
      prisma.practice.findMany({
        where: {
          userId,
          status: 'completed',
          startedAt: { gte: monthStartPrev, lte: monthEndPrev },
        },
        include: { answers: true },
      }),
    ]);

    const practiceDays = new Set(currentMonth.map(p => getDateString(p.startedAt))).size;
    const totalQuestions = currentMonth.reduce((sum, p) => sum + p.answers.length, 0);
    const correctCount = currentMonth.reduce((sum, p) => sum + p.correctCount, 0);
    const correctRate = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const timeSpent = currentMonth.reduce((sum, p) => sum + p.timeSpent, 0);

    const prevCorrectRate = prevMonth.length > 0
      ? prevMonth.reduce((sum, p) => sum + p.correctCount, 0) / prevMonth.reduce((sum, p) => sum + p.answers.length, 0)
      : 0;

    const levelProgress = await this.getLevelProgressComparison(userId, monthStart);

    const weakPoints = await this.getWeakPoints(userId, monthStart);

    return {
      period: `${getDateString(monthStart)} ~ ${getDateString(monthEnd)}`,
      stats: {
        practiceDays,
        totalQuestions,
        correctRate: Math.round(correctRate * 100) / 100,
        timeSpent,
        levelProgress,
        weakPoints,
      },
    };
  }

  private async getImprovedTopics(userId: string, since: Date): Promise<string[]> {
    const practices = await prisma.practice.findMany({
      where: {
        userId,
        status: 'completed',
        startedAt: { gte: since },
      },
      include: {
        answers: {
          where: { isCorrect: true },
          include: {
            question: {
              include: {
                knowledgePoint: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    const knowledgeCounts = new Map<string, number>();

    for (const practice of practices) {
      for (const answer of practice.answers) {
        const kp = answer.question.knowledgePoint;
        if (kp) {
          knowledgeCounts.set(kp.name, (knowledgeCounts.get(kp.name) || 0) + 1);
        }
      }
    }

    return Array.from(knowledgeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }

  private async getLevelProgressComparison(
    userId: string,
    since: Date
  ): Promise<Record<number, { correctRate: number; change: number }>> {
    const progress = await prisma.userLevelProgress.findMany({
      where: { userId },
      include: { level: { select: { level: true } } },
    });

    const result: Record<number, { correctRate: number; change: number }> = {};

    for (const p of progress) {
      const currentRate = Number(p.correctRate);

      result[p.level.level] = {
        correctRate: Math.round(currentRate * 100) / 100,
        change: Math.round((currentRate - 0.5) * 100) / 100,
      };
    }

    return result;
  }

  private async getWeakPoints(userId: string, since: Date): Promise<string[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const answers = await prisma.answer.findMany({
      where: {
        practice: { userId },
        isCorrect: false,
        submittedAt: { gte: thirtyDaysAgo },
      },
      include: {
        question: {
          include: {
            knowledgePoint: { select: { name: true } },
          },
        },
      },
    });

    const knowledgeCounts = new Map<string, number>();

    for (const answer of answers) {
      const kp = answer.question.knowledgePoint;
      if (kp) {
        knowledgeCounts.set(kp.name, (knowledgeCounts.get(kp.name) || 0) + 1);
      }
    }

    return Array.from(knowledgeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }
}

export const reportService = new ReportService();
