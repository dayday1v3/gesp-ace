import { Request, Response } from 'express';
import { subjectService, subjectCreateSchema, subjectUpdateSchema } from '../services/subjectService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export class SubjectController {
  async list(req: Request, res: Response): Promise<void> {
    const includeInactive = req.user?.role === 'admin' && req.query.includeInactive === 'true';
    const subjects = await subjectService.list(includeInactive);
    successResponse(res, { subjects });
  }

  async getOne(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id), 10);
    const subject = await subjectService.getById(id);
    successResponse(res, subject);
  }

  async create(req: Request, res: Response): Promise<void> {
    const input = subjectCreateSchema.parse(req.body);
    const subject = await subjectService.create(input);
    createdResponse(res, subject, '学科创建成功');
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id), 10);
    const input = subjectUpdateSchema.parse(req.body);
    const subject = await subjectService.update(id, input);
    successResponse(res, subject, '学科更新成功');
  }

  async remove(req: Request, res: Response): Promise<void> {
    const id = parseInt(String(req.params.id), 10);
    const result = await subjectService.remove(id);
    successResponse(res, result, '学科删除成功');
  }
}

export const subjectController = new SubjectController();
