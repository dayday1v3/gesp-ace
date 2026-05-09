import prisma from '../config/database.js';
import { cacheService } from '../config/redis.js';
import { CACHE_KEYS, CACHE_TTL, LEVEL_STATUS, MASTERY_THRESHOLD, WEAK_THRESHOLD } from '../constants/config.js';
import { LevelProgressInfo, KnowledgeProgressInfo } from '../models/types.js';
import { NotFoundError } from '../middlewares/errorHandler.js';

export class UserService {
  async getUserById(userId: string) {
    const cacheKey = `user:${userId}`;
    const cached = await cacheService.get<Awaited<ReturnType<typeof this.getUserFullInfo>>>(cacheKey);

    if (cached) {
      return cached;
    }

    const user = await this.getUserFullInfo(userId);

    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    await cacheService.set(cacheKey, user, CACHE_TTL.user_stats);

    return user;
  }

  private async getUserFullInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatar: true,
        currentLevel: true,
        totalScore: true,
        streakDays: true,
        totalPracticeDays: true,
        examDate: true,
        achievements: {
          select: {
            achievementId: true,
          },
        },
      },
    });

    if (!user) return null;

    const levelProgress = await this.getLevelProgress(userId);

    return {
      ...user,
      achievements: user.achievements.map((a) => a.achievementId),
      levelProgress,
    };
  }

  async getLevelProgress(userId: string): Promise<Record<number, LevelProgressInfo>> {
    const progressList = await prisma.userLevelProgress.findMany({
      where: { userId },
      include: {
        level: {
          select: {
            level: true,
            name: true,
          },
        },
      },
    });

    const progressMap: Record<number, LevelProgressInfo> = {};

    for (let level = 1; level <= 8; level++) {
      const existing = progressList.find((p) => p.level.level === level);

      if (existing) {
        const correctRate = Number(existing.correctRate);
        let status: LevelProgressInfo['status'] = LEVEL_STATUS.IN_PROGRESS;

        if (correctRate >= MASTERY_THRESHOLD) {
          status = LEVEL_STATUS.MASTERED;
        } else if (correctRate < WEAK_THRESHOLD && existing.totalCount > 0) {
          status = LEVEL_STATUS.WEAK;
        }

        progressMap[level] = {
          level,
          name: existing.level.name,
          correctRate,
          practicedCount: existing.totalCount,
          status,
        };
      } else {
        progressMap[level] = {
          level,
          name: `等级${level}`,
          correctRate: 0,
          practicedCount: 0,
          status: level === 1 ? LEVEL_STATUS.IN_PROGRESS : LEVEL_STATUS.LOCKED,
        };
      }
    }

    return progressMap;
  }

  async getKnowledgeProgress(userId: string, level: number) {
    const knowledgeStats = await prisma.answer.groupBy({
      by: ['questionId'],
      where: {
        practice: {
          userId,
          targetLevel: level,
        },
        isCorrect: true,
      },
      _count: true,
    });

    const questions = await prisma.question.findMany({
      where: {
        id: { in: knowledgeStats.map((s) => s.questionId) },
        levelId: level,
      },
      include: {
        knowledgePoint: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    const knowledgeMap = new Map<string, KnowledgeProgressInfo>();

    for (const q of questions) {
      if (q.knowledgePoint) {
        const existing = knowledgeMap.get(q.knowledgePoint.code);
        if (existing) {
          existing.correctRate += 1;
        } else {
          knowledgeMap.set(q.knowledgePoint.code, {
            code: q.knowledgePoint.code,
            name: q.knowledgePoint.name,
            correctRate: 1,
          });
        }
      }
    }

    return Array.from(knowledgeMap.values());
  }

  async updateStreak(userId: string): Promise<{ streakDays: number; isNewStreak: boolean }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streakDays: true, lastPracticeDate: true },
    });

    if (!user) {
      throw new NotFoundError('用户不存在');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPractice = user.lastPracticeDate;
    let newStreak = user.streakDays;
    let isNewStreak = false;

    if (!lastPractice) {
      newStreak = 1;
      isNewStreak = true;
    } else {
      const lastDate = new Date(lastPractice);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
      } else if (diffDays === 1) {
        newStreak = user.streakDays + 1;
        isNewStreak = true;
      } else {
        newStreak = 1;
        isNewStreak = true;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        streakDays: newStreak,
        lastPracticeDate: today,
        totalPracticeDays: user.totalPracticeDays + (isNewStreak ? 1 : 0),
      },
    });

    return { streakDays: newStreak, isNewStreak };
  }

  async addScore(userId: string, score: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalScore: { increment: score },
      },
    });

    await cacheService.del(`user:${userId}`);
  }

  async updateLevelProgress(
    userId: string,
    level: number,
    isCorrect: boolean
  ): Promise<{ status: string; newAchievements: string[] }> {
    const progress = await prisma.userLevelProgress.findUnique({
      where: {
        userId_levelId: { userId, levelId: level },
      },
    });

    if (progress) {
      await prisma.userLevelProgress.update({
        where: { id: progress.id },
        data: {
          totalCount: { increment: 1 },
          correctCount: { increment: isCorrect ? 1 : 0 },
          correctRate: isCorrect
            ? (progress.correctCount + 1) / (progress.totalCount + 1)
            : progress.correctCount / (progress.totalCount + 1),
        },
      });
    } else {
      await prisma.userLevelProgress.create({
        data: {
          userId,
          levelId: level,
          totalCount: 1,
          correctCount: isCorrect ? 1 : 0,
          correctRate: isCorrect ? 1 : 0,
        },
      });
    }

    const newProgress = await prisma.userLevelProgress.findUnique({
      where: { userId_levelId: { userId, levelId: level } },
    });

    if (!newProgress) {
      return { status: LEVEL_STATUS.IN_PROGRESS, newAchievements: [] };
    }

    const correctRate = Number(newProgress.correctRate);
    let status = LEVEL_STATUS.IN_PROGRESS;

    if (correctRate >= MASTERY_THRESHOLD) {
      status = LEVEL_STATUS.MASTERED;
    } else if (correctRate < WEAK_THRESHOLD) {
      status = LEVEL_STATUS.WEAK;
    }

    if (status !== newProgress.status) {
      await prisma.userLevelProgress.update({
        where: { id: newProgress.id },
        data: { status },
      });
    }

    await cacheService.del(`user:${userId}`);

    return { status, newAchievements: [] };
  }
}

export const userService = new UserService();
