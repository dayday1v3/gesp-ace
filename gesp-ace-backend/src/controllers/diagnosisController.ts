import { Request, Response } from 'express';
import { diagnosisService } from '../services/diagnosisService.js';
import { successResponse } from '../utils/response.js';

export class DiagnosisController {
  async getDiagnosis(req: Request, res: Response): Promise<void> {
    const report = await diagnosisService.analyzeUserPerformance(req.user!.id);
    successResponse(res, report);
  }

  async getWeakPoints(req: Request, res: Response): Promise<void> {
    const weakPoints = await diagnosisService.getWeakPoints(req.user!.id);
    successResponse(res, { weakPoints });
  }
}

export const diagnosisController = new DiagnosisController();
