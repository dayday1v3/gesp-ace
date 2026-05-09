import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { TokenPayload, AuthUser } from '../models/types.js';
import { ErrorCode } from '../constants/errorCode.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        code: 401,
        message: '未登录',
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({
        code: 401,
        message: '用户不存在',
      });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({
        code: 403,
        message: '账户已被禁用',
      });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        code: 401,
        message: 'Token 已过期',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        code: 401,
        message: 'Token 无效',
      });
      return;
    }

    res.status(401).json({
      code: 401,
      message: '认证失败',
    });
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      code: 403,
      message: '需要管理员权限',
    });
    return;
  }
  next();
}

export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  authMiddleware(req, res, next as NextFunction);
}
