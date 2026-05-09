import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { codeSubmitRateLimiter } from '../middlewares/rateLimit.js';
import { codeController } from '../controllers/codeController.js';

const router = Router();

router.post('/run', authMiddleware, codeSubmitRateLimiter, codeController.runCode.bind(codeController));
router.post('/submit', authMiddleware, codeSubmitRateLimiter, codeController.submitCode.bind(codeController));

export default router;
