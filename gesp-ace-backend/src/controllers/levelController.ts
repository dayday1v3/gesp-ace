import { Request, Response } from 'express';
import { levelService, levelCreateSchema, levelUpdateSchema } from '../services/levelService.js';
import { successResponse, createdResponse } from '../utils/response.js';

function parseId(value: string | string[] | undefined): number {
  return parseInt(String(value), 10);
}

export class LevelController {
  async list(req: Request, res: Response): Promise<void> {
    const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string, 10) : undefined;
    const subjectCode = typeof req.query.subjectCode === 'string' ? req.query.subjectCode : undefined;
    const levels = await levelService.list({ subjectId, subjectCode });
    successResponse(res, { levels });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    const level = await levelService.getById(parseId(req.params.id));
    successResponse(res, level);
  }

  async create(req: Request, res: Response): Promise<void> {
    const input = levelCreateSchema.parse(req.body);
    const level = await levelService.create(input);
    createdResponse(res, level, '等级创建成功');
  }

  async update(req: Request, res: Response): Promise<void> {
    const input = levelUpdateSchema.parse(req.body);
    const level = await levelService.update(parseId(req.params.id), input);
    successResponse(res, level, '等级更新成功');
  }

  async remove(req: Request, res: Response): Promise<void> {
    const result = await levelService.remove(parseId(req.params.id));
    successResponse(res, result, '等级删除成功');
  }
}

export const levelController = new LevelController();
