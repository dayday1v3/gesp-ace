import { Request, Response } from 'express';
import { userService } from '../services/userService.js';
import { successResponse } from '../utils/response.js';

export class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    const user = await userService.getUserById(req.user!.id);
    successResponse(res, user);
  }

  async getLevelProgress(req: Request, res: Response): Promise<void> {
    const progress = await userService.getLevelProgress(req.user!.id);
    successResponse(res, { levels: progress });
  }

  async getKnowledgeProgress(req: Request, res: Response): Promise<void> {
    const level = parseInt(req.query.level as string) || 1;
    const progress = await userService.getKnowledgeProgress(req.user!.id, level);
    successResponse(res, { knowledgePoints: progress });
  }
}

export const userController = new UserController();
