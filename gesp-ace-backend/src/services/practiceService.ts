import { z } from 'zod';
import prisma from '../config/database.js';
import { questionService } from './questionService.js';
import { userService } from './userService.js';
import { achievementService } from './achievementService.js';
import { PRACTICE_CONFIG } from '../constants/config.js';
import { NotFoundError, ConflictError } from '../middlewares/errorHandler.js';

export class PracticeService {
  async startPractice(userId: string, input: { type: string; targetLevel?: number; targetKnowledge?: string; count?: number }) {
    if (input.type === 'daily') {
      return this.startDailyPractice(userId);
    }

    return this.startGeneralPractice(userId, input);
  }

  private async startDailyPractice(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingPractice = await prisma.practice.findFirst({
      where: {
        userId,
        type: 'daily',
        startedAt: {
          gte: today,
        },
      },
    });

    if (existingPractice) {
      throw new ConflictError('今日已完成每日一练');
    }

    const { questions } = await questionService.getDailyQuestions(userId);

    if (questions.length === 0) {
      throw new NotFoundError('暂无可用题目');
    }

    const practice = await prisma.practice.create({
      data: {
        userId,
        type: 'daily',
        targetLevel: 1,
      },
    });

    for (const q of questions) {
      await prisma.answer.create({
        data: {
          practiceId: practice.id,
          questionId: q.id,
        },
      });
    }

    return {
      practiceId: practice.id,
      questions,
    };
  }

  private async startGeneralPractice(
    userId: string,
    input: { type: string; targetLevel?: number; targetKnowledge?: string; count?: number }
  ) {
    const count = input.count || PRACTICE_CONFIG.DAILY_QUESTION_COUNT;

    const where: Record<string, unknown> = { status: 'active' };

    if (input.targetLevel) {
      where.levelId = input.targetLevel;
    }

    if (input.targetKnowledge) {
      const kp = await prisma.knowledgePoint.findUnique({
        where: { code: input.targetKnowledge },
      });
      if (kp) {
        where.knowledgePointId = kp.id;
      }
    }

    const questions = await prisma.question.findMany({
      where,
      take: count,
      orderBy: {
        answers: {
          _count: 'asc',
        },
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

    if (questions.length === 0) {
      throw new NotFoundError('暂无可用题目');
    }

    const practice = await prisma.practice.create({
      data: {
        userId,
        type: input.type as 'topic' | 'exam' | 'timed',
        targetLevel: input.targetLevel,
        targetKnowledge: input.targetKnowledge,
      },
    });

    for (const q of questions) {
      await prisma.answer.create({
        data: {
          practiceId: practice.id,
          questionId: q.id,
        },
      });
    }

    return {
      practiceId: practice.id,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        content: q.content,
        options: q.options,
        knowledgePoint: q.knowledgePoint,
        difficulty: q.difficulty,
        points: q.points,
      })),
    };
  }

  async submitAnswer(
    userId: string,
    input: { practiceId: string; questionId: string; answer: string; timeSpent?: number }
  ) {
    const practice = await prisma.practice.findUnique({
      where: { id: input.practiceId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!practice) {
      throw new NotFoundError('练习记录不存在');
    }

    if (practice.userId !== userId) {
      throw new ConflictError('无权操作此练习');
    }

    if (practice.status === 'completed') {
      throw new ConflictError('练习已完成');
    }

    const answerRecord = practice.answers.find((a) => a.questionId === input.questionId);

    if (!answerRecord) {
      throw new NotFoundError('答题记录不存在');
    }

    if (answerRecord.userAnswer !== null) {
      throw new ConflictError('已提交过答案');
    }

    const question = answerRecord.question;
    const isCorrect = question.type === 'coding'
      ? this.checkCodingAnswer(question.answer, input.answer)
      : input.answer === question.answer;

    await prisma.answer.update({
      where: { id: answerRecord.id },
      data: {
        userAnswer: input.answer,
        isCorrect,
        score: isCorrect ? question.points : 0,
        timeSpent: input.timeSpent || 0,
      },
    });

    if (!isCorrect) {
      await this.addToMistakes(userId, question);
    }

    if (question.type !== 'coding') {
      await userService.updateLevelProgress(userId, question.levelId, isCorrect);
    }

    return {
      isCorrect,
      correctAnswer: question.answer,
      analysis: question.analysis,
      score: isCorrect ? question.points : 0,
    };
  }

  private checkCodingAnswer(expected: string, actual: string): boolean {
    const normalize = (s: string) => s.replace(/\s+/g, '').trim();
    return normalize(expected) === normalize(actual);
  }

  private async addToMistakes(userId: string, question: { id: string; knowledgePoint?: { code: string } | null }) {
    const existing = await prisma.mistake.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: question.id,
        },
      },
    });

    if (existing) {
      await prisma.mistake.update({
        where: { id: existing.id },
        data: {
          errorCount: { increment: 1 },
          lastReviewedAt: new Date(),
          mastered: false,
        },
      });
    } else {
      await prisma.mistake.create({
        data: {
          userId,
          questionId: question.id,
          errorType: 'unknown',
          errorCount: 1,
        },
      });
    }
  }

  async completePractice(userId: string, practiceId: string) {
    const practice = await prisma.practice.findUnique({
      where: { id: practiceId },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!practice) {
      throw new NotFoundError('练习记录不存在');
    }

    if (practice.userId !== userId) {
      throw new ConflictError('无权操作此练习');
    }

    if (practice.status === 'completed') {
      throw new ConflictError('练习已完成');
    }

    const totalScore = practice.answers.reduce((sum, a) => sum + a.score, 0);
    const correctCount = practice.answers.filter((a) => a.isCorrect).length;
    const wrongCount = practice.answers.length - correctCount;
    const timeSpent = practice.answers.reduce((sum, a) => sum + a.timeSpent, 0);

    await prisma.practice.update({
      where: { id: practiceId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        totalScore,
        correctCount,
        wrongCount,
        timeSpent,
      },
    });

    let streakDays = 0;
    let newAchievements: string[] = [];

    if (practice.type === 'daily') {
      const streakResult = await userService.updateStreak(userId);
      streakDays = streakResult.streakDays;

      if (correctCount === practice.answers.length) {
        await userService.addScore(userId, 5);
      }
    }

    newAchievements = await achievementService.checkAndAwardAchievements(userId, {
      practiceType: practice.type,
      totalQuestions: correctCount + wrongCount,
      dailyPerfect: correctCount === practice.answers.length && practice.type === 'daily',
      streakDays,
    });

    return {
      totalScore,
      correctCount,
      wrongCount,
      streakDays,
      newAchievements,
    };
  }

  async getPracticeHistory(
    userId: string,
    params: { type?: string; page: number; limit: number }
  ) {
    const where: Record<string, unknown> = { userId };

    if (params.type) {
      where.type = params.type;
    }

    const [total, practices] = await Promise.all([
      prisma.practice.count({ where }),
      prisma.practice.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        select: {
          id: true,
          type: true,
          status: true,
          targetLevel: true,
          startedAt: true,
          completedAt: true,
          totalScore: true,
          correctCount: true,
          wrongCount: true,
          timeSpent: true,
        },
      }),
    ]);

    return {
      total,
      page: params.page,
      limit: params.limit,
      practices,
    };
  }
}

export const practiceService = new PracticeService();

export const startPracticeSchema = z.object({
  type: z.enum(['daily', 'topic', 'exam', 'timed']),
  targetLevel: z.number().int().min(1).max(8).optional(),
  targetKnowledge: z.string().optional(),
  count: z.number().int().min(1).max(50).optional(),
});

export const submitAnswerSchema = z.object({
  practiceId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string(),
  timeSpent: z.number().optional(),
});

export const completePracticeSchema = z.object({
  practiceId: z.string().uuid(),
});
