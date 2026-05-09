import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { favoriteController } from '../controllers/favoriteController.js';

const router = Router();

router.get('/', authMiddleware, favoriteController.getFavorites.bind(favoriteController));
router.post('/', authMiddleware, favoriteController.addFavorite.bind(favoriteController));
router.delete('/:questionId', authMiddleware, favoriteController.deleteFavorite.bind(favoriteController));

export default router;
