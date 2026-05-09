import { Router } from 'express';
import { levelController } from '../controllers/levelController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/', levelController.list.bind(levelController));
router.get('/:id', levelController.getOne.bind(levelController));

router.post('/', authMiddleware, adminMiddleware, levelController.create.bind(levelController));
router.put('/:id', authMiddleware, adminMiddleware, levelController.update.bind(levelController));
router.delete('/:id', authMiddleware, adminMiddleware, levelController.remove.bind(levelController));

export default router;
