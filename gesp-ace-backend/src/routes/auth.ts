import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimit.js';

const router = Router();

// authController.register/login already runs registerSchema/loginSchema.parse,
// so no extra validateBody middleware is needed here. The previous
// `validateBody(null as never)` passed a null schema and threw 500.
router.post('/register', registerRateLimiter, authController.register.bind(authController));
router.post('/login', loginRateLimiter, authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.put('/password', authController.changePassword.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

export default router;
