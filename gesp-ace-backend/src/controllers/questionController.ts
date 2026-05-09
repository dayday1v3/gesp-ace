import { Request, Response } from 'express';
import { questionService, questionQuerySchema } from '../services/questionService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export class QuestionController {
  async getDailyQuestions(req: Request, res: Response): Promise<void> {
    const questions = await questionService.getDailyQuestions(req.user!.id);
    successResponse(res, questions);
  }

  async getQuestionList(req: Request, res: Response): Promise<void> {
    const params = questionQuerySchema.parse(req.query);
    const result = await questionService.getQuestionList(params);
    paginatedResponse(
      res,
      result.questions,
      result.total,
      result.page,
      result.limit
    );
  }

  async getQuestionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const question = await questionService.getQuestionById(id);
    successResponse(res, question);
  }

  async getKnowledgeTree(req: Request, res: Response): Promise<void> {
    const level = req.query.level ? parseInt(req.query.level as string) : undefined;
    const tree = await questionService.getKnowledgeTree(level);
    successResponse(res, { levels: tree });
  }
}

export const questionController = new QuestionController();
