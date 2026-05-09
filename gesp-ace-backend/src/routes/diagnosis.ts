import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { diagnosisController } from '../controllers/diagnosisController.js';

const router = Router();

router.get('/', authMiddleware, diagnosisController.getDiagnosis.bind(diagnosisController));
router.get('/weak-points', authMiddleware, diagnosisController.getWeakPoints.bind(diagnosisController));

export default router;
