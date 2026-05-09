import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { reportController } from '../controllers/reportController.js';

const router = Router();

router.get('/weekly', authMiddleware, reportController.getWeeklyReport.bind(reportController));
router.get('/monthly', authMiddleware, reportController.getMonthlyReport.bind(reportController));

export default router;
