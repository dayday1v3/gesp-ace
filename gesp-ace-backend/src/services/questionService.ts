import { z } from 'zod';
import prisma from '../config/database.js';
import { cacheService } from '../config/redis.js';
import { CACHE_KEYS, CACHE_TTL, PRACTICE_CONFIG, getDateString } from '../constants/config.js';
import { NotFoundError } from '../middlewares/errorHandler.js';
import { QuestionType, PracticeType } from '../models/types.js';

export const questionQuerySchema = z.object({
  level: z.coerce.number().int().min(1).max(8).optional(),
  type: z.enum(['choice', 'judgment', 'coding']).optional(),
  knowledge: z.string().optional(),
  difficulty: z.coerce.number().int().min(1).max(3).optional(),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const startPracticeSchema = z.object({
  type: z.enum(['daily', 'topic', 'exam', 'timed']),
  targetLevel: z.number().int().min(1).max(8).optional(),
  targetKnowledge: z.string().optional(),
  count: z.number().int().min(1).max(50).default(10),
});

export const submitAnswerSchema = z.object({
  practiceId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string(),
  timeSpent: z.number().int().min(0).default(0),
});

export const completePracticeSchema = z.object({
  practiceId: z.string().uuid(),
});

export type QuestionQueryInput = z.infer<typeof questionQuerySchema>;
export type StartPracticeInput = z.infer<typeof startPracticeSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type CompletePracticeInput = z.infer<typeof completePracticeSchema>;

export class QuestionService {
  async getDailyQuestions(userId: string) {
    const today = getDateString();
    const cacheKey = CACHE_KEYS.daily_questions(userId, today);

    const cached = await cacheService.get<Awaited<ReturnType<typeof this.fetchDailyQuestions>>>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.fetchDailyQuestions(userId);

    await cacheService.set(cacheKey, result, CACHE_TTL.daily_questions);

    return result;
  }

  private async fetchDailyQuestions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    const targetLevel = user?.currentLevel || 1;

    const questions = await prisma.$transaction(async (tx) => {
      const choiceQuestion = await tx.question.findFirst({
        where: {
          levelId: targetLevel,
          type: 'choice',
          status: 'active',
        },
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

      const judgmentQuestion = await tx.question.findFirst({
        where: {
          levelId: targetLevel,
          type: 'judgment',
          status: 'active',
        },
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

      const codingQuestion = await tx.question.findFirst({
        where: {
          levelId: targetLevel,
          type: 'coding',
          status: 'active',
        },
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

      return [choiceQuestion, judgmentQuestion, codingQuestion].filter(Boolean);
    });

    return {
      date: today,
      questions: questions.map((q) => ({
        id: q!.id,
        type: q!.type,
        content: q!.content,
        options: q!.options,
        knowledgePoint: q!.knowledgePoint,
        difficulty: q!.difficulty,
        points: q!.points,
      })),
    };
  }

  async getQuestionList(params: QuestionQueryInput) {
    const { level, type, knowledge, difficulty, year, page, limit } = params;

    const where: Record<string, unknown> = { status: 'active' };

    if (level) where.levelId = level;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (year) where.year = year;
    if (knowledge) {
      const kp = await prisma.knowledgePoint.findUnique({
        where: { code: knowledge },
        select: { id: true },
      });
      if (kp) {
        where.knowledgePointId = kp.id;
      }
    }

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          knowledgePoint: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        content: q.content,
        difficulty: q.difficulty,
        points: q.points,
        knowledgePoint: q.knowledgePoint,
        year: q.year,
      })),
    };
  }

  async getQuestionById(id: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        knowledgePoint: {
          select: {
            code: true,
            name: true,
          },
        },
        level: {
          select: {
            level: true,
            name: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundError('题目不存在');
    }

    return question;
  }

  async getKnowledgeTree(level?: number) {
    const cacheKey = CACHE_KEYS.knowledge_tree(level);
    const cached = await cacheService.get<Awaited<ReturnType<typeof this.fetchKnowledgeTree>>>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.fetchKnowledgeTree(level);

    await cacheService.set(cacheKey, result, CACHE_TTL.knowledge_tree);

    return result;
  }

  private async fetchKnowledgeTree(level?: number) {
    const where: Record<string, unknown> = {};
    if (level) {
      where.levelId = level;
    }

    const levels = await prisma.level.findMany({
      where,
      include: {
        knowledgePoints: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { level: 'asc' },
    });

    return levels.map((l) => ({
      level: l.level,
      name: l.name,
      topics: l.knowledgePoints.map((kp) => ({
        id: kp.code,
        name: kp.name,
        description: kp.description,
      })),
    }));
  }
}

export const questionService = new QuestionService();
