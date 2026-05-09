import { Router } from 'express';
import { subjectController } from '../controllers/subjectController.js';
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalAuthMiddleware, subjectController.list.bind(subjectController));
router.get('/:id', optionalAuthMiddleware, subjectController.getOne.bind(subjectController));

router.post('/', authMiddleware, adminMiddleware, subjectController.create.bind(subjectController));
router.put('/:id', authMiddleware, adminMiddleware, subjectController.update.bind(subjectController));
router.delete('/:id', authMiddleware, adminMiddleware, subjectController.remove.bind(subjectController));

export default router;
