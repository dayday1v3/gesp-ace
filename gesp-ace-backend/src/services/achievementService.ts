import prisma from '../config/database.js';
import { Achievement, UserAchievement } from '../models/types.js';

interface AchievementContext {
  practiceType?: string;
  totalQuestions?: number;
  dailyPerfect?: boolean;
  streakDays?: number;
}

export class AchievementService {
  private achievementCache: Map<string, Achievement> | null = null;

  async getAllAchievements(): Promise<Achievement[]> {
    if (this.achievementCache) {
      return Array.from(this.achievementCache.values());
    }

    const achievements = await prisma.achievement.findMany();
    this.achievementCache = new Map(achievements.map(a => [a.id, a as unknown as Achievement]));

    return achievements as unknown as Achievement[];
  }

  async checkAndAwardAchievements(userId: string, context: AchievementContext): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: { select: { achievementId: true } },
      },
    });

    if (!user) return [];

    const allAchievements = await this.getAllAchievements();
    const earnedIds = user.achievements.map(a => a.achievementId);
    const newAchievementIds: string[] = [];

    for (const achievement of allAchievements) {
      if (earnedIds.includes(achievement.id)) continue;

      const earned = await this.checkCondition(user, achievement as unknown as { conditionType?: string; conditionValue?: number; id: string }, context);

      if (earned) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
        newAchievementIds.push(achievement.id);
      }
    }

    if (newAchievementIds.length > 0) {
      this.achievementCache = null;
    }

    return newAchievementIds;
  }

  private async checkCondition(
    user: { streakDays: number; totalPracticeDays: number; totalScore: number },
    achievement: { conditionType?: string; conditionValue?: number; id: string },
    context: AchievementContext
  ): Promise<boolean> {
    switch (achievement.conditionType) {
      case 'practice_count':
        return (context.totalQuestions || 0) >= (achievement.conditionValue || 0);

      case 'streak_days':
        return (context.streakDays || user.streakDays) >= (achievement.conditionValue || 0);

      case 'level_mastered': {
        const level = achievement.conditionValue;
        const progress = await prisma.userLevelProgress.findUnique({
          where: {
            userId_levelId: {
              userId: user as unknown as string,
              levelId: level || 1,
            },
          },
        });
        return progress?.status === 'mastered';
      }

      case 'daily_perfect':
        return context.dailyPerfect === true;

      case 'total_score': {
        return user.totalScore >= (achievement.conditionValue || 0);
      }

      case 'total_practice_days': {
        return user.totalPracticeDays >= (achievement.conditionValue || 0);
      }

      default:
        return false;
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    });

    return userAchievements.map(ua => ua.achievement as unknown as Achievement);
  }
}

export const achievementService = new AchievementService();
