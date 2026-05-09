import { Request, Response } from 'express';
import { judgeCodeService } from '../services/judgeService.js';
import { successResponse } from '../utils/response.js';

export class CodeController {
  async runCode(req: Request, res: Response): Promise<void> {
    const { code, questionId } = req.body;
    const result = await judgeCodeService.runCode(code, questionId);
    successResponse(res, result);
  }

  async submitCode(req: Request, res: Response): Promise<void> {
    const { code, questionId, practiceId } = req.body;
    const result = await judgeCodeService.submitCode(code, questionId, practiceId);
    successResponse(res, result, '代码已提交');
  }
}

export const codeController = new CodeController();
