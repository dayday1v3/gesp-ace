import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 429,
      message: '请求过于频繁，请稍后再试',
    });
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    code: 429,
    message: '登录尝试次数过多，请15分钟后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 429,
      message: '登录尝试次数过多，请15分钟后再试',
    });
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    code: 429,
    message: '注册请求过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 429,
      message: '注册请求过于频繁，请稍后再试',
    });
  },
});

export const codeSubmitRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    code: 429,
    message: '代码提交过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 429,
      message: '代码提交过于频繁，请稍后再试',
    });
  },
});

export const practiceRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    code: 429,
    message: '练习请求过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      code: 429,
      message: '练习请求过于频繁，请稍后再试',
    });
  },
});
