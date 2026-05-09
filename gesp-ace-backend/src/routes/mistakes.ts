import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { mistakeController } from '../controllers/mistakeController.js';

const router = Router();

router.get('/', authMiddleware, mistakeController.getMistakes.bind(mistakeController));
router.put('/:id/master', authMiddleware, mistakeController.markAsMastered.bind(mistakeController));
router.delete('/:id', authMiddleware, mistakeController.deleteMistake.bind(mistakeController));

export default router;
