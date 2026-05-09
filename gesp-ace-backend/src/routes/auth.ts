import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimit.js';
import { validateBody } from '../middlewares/validator.js';

const router = Router();

router.post('/register', registerRateLimiter, validateBody(null as never), authController.register.bind(authController));
router.post('/login', loginRateLimiter, authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.put('/password', authController.changePassword.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

export default router;
