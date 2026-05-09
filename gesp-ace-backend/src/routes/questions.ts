import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { questionController } from '../controllers/questionController.js';

const router = Router();

router.get('/daily', authMiddleware, questionController.getDailyQuestions.bind(questionController));
router.get('/', authMiddleware, questionController.getQuestionList.bind(questionController));
router.get('/knowledge', authMiddleware, questionController.getKnowledgeTree.bind(questionController));
router.get('/:id', authMiddleware, questionController.getQuestionById.bind(questionController));

export default router;
