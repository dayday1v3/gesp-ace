import { Request, Response } from 'express';
import { practiceService, startPracticeSchema, submitAnswerSchema, completePracticeSchema } from '../services/practiceService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/response.js';

export class PracticeController {
  async startPractice(req: Request, res: Response): Promise<void> {
    const input = startPracticeSchema.parse(req.body);
    const result = await practiceService.startPractice(req.user!.id, input);
    createdResponse(res, result, '练习已开始');
  }

  async submitAnswer(req: Request, res: Response): Promise<void> {
    const input = submitAnswerSchema.parse(req.body);
    const result = await practiceService.submitAnswer(req.user!.id, input);
    successResponse(res, result);
  }

  async completePractice(req: Request, res: Response): Promise<void> {
    const { practiceId } = completePracticeSchema.parse(req.body);
    const result = await practiceService.completePractice(req.user!.id, practiceId);
    successResponse(res, result, '练习完成');
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    const { type, page, limit } = req.query;
    const result = await practiceService.getPracticeHistory(req.user!.id, {
      type: type as string | undefined,
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 20,
    });
    paginatedResponse(
      res,
      result.practices,
      result.total,
      result.page,
      result.limit
    );
  }
}

export const practiceController = new PracticeController();
