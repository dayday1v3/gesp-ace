import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { practiceRateLimiter } from '../middlewares/rateLimit.js';
import { practiceController } from '../controllers/practiceController.js';

const router = Router();

router.post('/start', authMiddleware, practiceRateLimiter, practiceController.startPractice.bind(practiceController));
router.post('/answer', authMiddleware, practiceRateLimiter, practiceController.submitAnswer.bind(practiceController));
router.post('/complete', authMiddleware, practiceRateLimiter, practiceController.completePractice.bind(practiceController));
router.get('/history', authMiddleware, practiceController.getHistory.bind(practiceController));

export default router;
