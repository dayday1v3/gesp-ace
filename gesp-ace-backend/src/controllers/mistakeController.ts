import { Request, Response } from 'express';
import { successResponse, paginatedResponse } from '../utils/response.js';
import prisma from '../config/database.js';
import { NotFoundError, ConflictError } from '../middlewares/errorHandler.js';

export class MistakeController {
  async getMistakes(req: Request, res: Response): Promise<void> {
    const { knowledge, mastered, page = '1', limit = '20' } = req.query;

    const where: Record<string, unknown> = { userId: req.user!.id };

    if (mastered !== undefined) {
      where.mastered = mastered === 'true';
    }

    const [total, mistakes] = await Promise.all([
      prisma.mistake.count({ where }),
      prisma.mistake.findMany({
        where,
        include: {
          question: {
            include: {
              knowledgePoint: {
                select: { code: true, name: true },
              },
              level: {
                select: { level: true, name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
    ]);

    paginatedResponse(
      res,
      mistakes.map((m) => ({
        id: m.id,
        question: {
          id: m.question.id,
          type: m.question.type,
          content: m.question.content,
          options: m.question.options,
          answer: m.question.answer,
          analysis: m.question.analysis,
          difficulty: m.question.difficulty,
          points: m.question.points,
          knowledgePoint: m.question.knowledgePoint,
          level: m.question.level,
        },
        errorType: m.errorType,
        errorCount: m.errorCount,
        mastered: m.mastered,
        lastReviewedAt: m.lastReviewedAt,
        createdAt: m.createdAt,
      })),
      total,
      parseInt(page as string),
      parseInt(limit as string)
    );
  }

  async markAsMastered(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const mistake = await prisma.mistake.findUnique({
      where: { id },
    });

    if (!mistake) {
      throw new NotFoundError('错题不存在');
    }

    if (mistake.userId !== req.user!.id) {
      throw new ConflictError('无权操作此错题');
    }

    await prisma.mistake.update({
      where: { id },
      data: {
        mastered: true,
        lastReviewedAt: new Date(),
      },
    });

    successResponse(res, null, '已标记为已掌握');
  }

  async deleteMistake(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const mistake = await prisma.mistake.findUnique({
      where: { id },
    });

    if (!mistake) {
      throw new NotFoundError('错题不存在');
    }

    if (mistake.userId !== req.user!.id) {
      throw new ConflictError('无权操作此错题');
    }

    await prisma.mistake.delete({
      where: { id },
    });

    successResponse(res, null, '错题已删除');
  }
}

export const mistakeController = new MistakeController();
