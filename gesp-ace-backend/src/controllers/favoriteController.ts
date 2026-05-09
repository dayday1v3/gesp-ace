import { Request, Response } from 'express';
import { successResponse, paginatedResponse } from '../utils/response.js';
import prisma from '../config/database.js';
import { NotFoundError, ConflictError } from '../middlewares/errorHandler.js';

export class FavoriteController {
  async addFavorite(req: Request, res: Response): Promise<void> {
    const { questionId } = req.body;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('题目不存在');
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_questionId: {
          userId: req.user!.id,
          questionId,
        },
      },
    });

    if (existing) {
      throw new ConflictError('已收藏该题目');
    }

    await prisma.favorite.create({
      data: {
        userId: req.user!.id,
        questionId,
      },
    });

    successResponse(res, null, '收藏成功', 201);
  }

  async getFavorites(req: Request, res: Response): Promise<void> {
    const { page = '1', limit = '20' } = req.query;

    const [total, favorites] = await Promise.all([
      prisma.favorite.count({
        where: { userId: req.user!.id },
      }),
      prisma.favorite.findMany({
        where: { userId: req.user!.id },
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
      favorites.map((f) => ({
        id: f.id,
        question: {
          id: f.question.id,
          type: f.question.type,
          content: f.question.content,
          difficulty: f.question.difficulty,
          points: f.question.points,
          knowledgePoint: f.question.knowledgePoint,
          level: f.question.level,
        },
        createdAt: f.createdAt,
      })),
      total,
      parseInt(page as string),
      parseInt(limit as string)
    );
  }

  async deleteFavorite(req: Request, res: Response): Promise<void> {
    const { questionId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_questionId: {
          userId: req.user!.id,
          questionId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundError('收藏不存在');
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    successResponse(res, null, '取消收藏成功');
  }
}

export const favoriteController = new FavoriteController();
