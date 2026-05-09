import { Request, Response } from 'express';
import { reportService } from '../services/reportService.js';
import { successResponse } from '../utils/response.js';

export class ReportController {
  async getWeeklyReport(req: Request, res: Response): Promise<void> {
    const report = await reportService.getWeeklyReport(req.user!.id);
    successResponse(res, report);
  }

  async getMonthlyReport(req: Request, res: Response): Promise<void> {
    const report = await reportService.getMonthlyReport(req.user!.id);
    successResponse(res, report);
  }
}

export const reportController = new ReportController();
