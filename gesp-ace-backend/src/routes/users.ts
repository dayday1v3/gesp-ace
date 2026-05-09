import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { userController } from '../controllers/userController.js';

const router = Router();

router.get('/me', authMiddleware, userController.getMe.bind(userController));
router.get('/me/levels', authMiddleware, userController.getLevelProgress.bind(userController));
router.get('/me/knowledge', authMiddleware, userController.getKnowledgeProgress.bind(userController));

export default router;
