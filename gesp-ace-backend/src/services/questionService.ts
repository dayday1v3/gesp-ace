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

  /**
   * Pick today's three questions (one of each type) using a layered strategy:
   *   1. Unmastered mistakes the user already has for that type (review-first).
   *   2. Questions on the user's weak knowledge points (knowledgePoints with
   *      pending unmastered mistakes), preferring lower-than-current levels too.
   *   3. Fallback: an unanswered (or rarely-answered) question at the user's
   *      currentLevel — the original behaviour.
   * Within slots we deduplicate against questions chosen in this batch and
   * questions the user has answered in the last 7 days.
   */
  private async fetchDailyQuestions(userId: string) {
    const today = getDateString();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });
    const targetLevel = user?.currentLevel || 1;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = await prisma.answer.findMany({
      where: {
        practice: { userId },
        submittedAt: { gte: sevenDaysAgo },
        userAnswer: { not: null },
      },
      select: { questionId: true },
    });
    const recentIds = Array.from(new Set(recent.map((a) => a.questionId)));

    const mistakes = await prisma.mistake.findMany({
      where: { userId, mastered: false },
      include: {
        question: {
          include: {
            knowledgePoint: { select: { code: true, name: true } },
          },
        },
      },
      orderBy: [
        { errorCount: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    const activeMistakes = mistakes.filter((m) => m.question.status === 'active');
    const mistakeByType: Record<string, (typeof activeMistakes)[number]['question'] | undefined> = {};
    for (const m of activeMistakes) {
      const type = m.question.type as unknown as string;
      if (!mistakeByType[type]) {
        mistakeByType[type] = m.question;
      }
    }

    const weakKnowledgePointIds = Array.from(
      new Set(
        activeMistakes
          .map((m) => m.question.knowledgePointId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );

    type QuestionWithKp = {
      id: string;
      type: QuestionType;
      content: string;
      options: unknown;
      difficulty: number;
      points: number;
      status: string;
      knowledgePoint: { code: string; name: string } | null;
    };

    const types: Array<QuestionType> = [QuestionType.choice, QuestionType.judgment, QuestionType.coding];
    const chosen: Array<{ question: QuestionWithKp; source: 'mistake' | 'weak' | 'level' }> = [];
    const chosenIds = new Set<string>();

    const includeKp = {
      knowledgePoint: { select: { code: true, name: true } },
    };

    for (const type of types) {
      let picked: QuestionWithKp | null = null;
      let source: 'mistake' | 'weak' | 'level' = 'level';

      const mistakeQ = mistakeByType[type as unknown as string];
      if (mistakeQ && !chosenIds.has(mistakeQ.id)) {
        picked = mistakeQ as unknown as QuestionWithKp;
        source = 'mistake';
      }

      if (!picked && weakKnowledgePointIds.length > 0) {
        const excludeIds = Array.from(new Set([...chosenIds, ...recentIds]));
        const found = await prisma.question.findFirst({
          where: {
            type,
            status: 'active',
            knowledgePointId: { in: weakKnowledgePointIds },
            levelId: { lte: targetLevel },
            id: { notIn: excludeIds },
          },
          orderBy: { answers: { _count: 'asc' } },
          include: includeKp,
        });
        if (found) {
          picked = found as unknown as QuestionWithKp;
          source = 'weak';
        }
      }

      if (!picked) {
        const excludeIds = Array.from(new Set([...chosenIds, ...recentIds]));
        const found = await prisma.question.findFirst({
          where: {
            type,
            status: 'active',
            levelId: targetLevel,
            id: { notIn: excludeIds },
          },
          orderBy: { answers: { _count: 'asc' } },
          include: includeKp,
        });
        if (found) {
          picked = found as unknown as QuestionWithKp;
          source = 'level';
        }
      }

      // Last-resort: relax the "not recently answered" filter so the slot is filled.
      if (!picked) {
        const found = await prisma.question.findFirst({
          where: {
            type,
            status: 'active',
            levelId: targetLevel,
            id: { notIn: Array.from(chosenIds) },
          },
          orderBy: { answers: { _count: 'asc' } },
          include: includeKp,
        });
        if (found) {
          picked = found as unknown as QuestionWithKp;
          source = 'level';
        }
      }

      if (picked) {
        chosen.push({ question: picked, source });
        chosenIds.add(picked.id);
      }
    }

    return {
      date: today,
      questions: chosen.map(({ question, source }) => ({
        id: question.id,
        type: question.type,
        content: question.content,
        options: question.options,
        knowledgePoint: question.knowledgePoint,
        difficulty: question.difficulty,
        points: question.points,
        source,
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
