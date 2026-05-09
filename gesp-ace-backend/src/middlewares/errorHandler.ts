import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorCode } from '../constants/errorCode.js';
import { logger } from '../utils/logger.js';

export class AppError extends Error {
  public statusCode: number;
  public code: number;
  public isOperational: boolean;

  constructor(statusCode: number, code: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(400, 400, message);
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权') {
    super(401, 401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(403, 403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = '资源不存在') {
    super(404, 404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = '资源冲突') {
    super(409, 409, message);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(e.message);
    });

    res.status(400).json({
      code: 400,
      message: '参数校验失败',
      errors,
    });
    return;
  }

  if (err.name === 'SyntaxError' && 'body' in err) {
    res.status(400).json({
      code: 400,
      message: '无效的 JSON 格式',
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    code: 404,
    message: `路由 ${req.method} ${req.path} 不存在`,
  });
}
