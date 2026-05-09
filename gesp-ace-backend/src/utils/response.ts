import { Response } from 'express';
import { ApiResponse } from '../models/types.js';

export function successResponse<T>(
  res: Response,
  data?: T,
  message: string = 'success',
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    code: statusCode,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  code: number = 500,
  statusCode: number = 500
): void {
  const response: ApiResponse = {
    code,
    message,
  };
  res.status(statusCode).json(response);
}

export function createdResponse<T>(
  res: Response,
  data?: T,
  message: string = '创建成功'
): void {
  successResponse(res, data, message, 201);
}

export function noContentResponse(res: Response): void {
  res.status(204).send();
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'success'
): void {
  successResponse(
    res,
    {
      total,
      page,
      limit,
      data,
    },
    message
  );
}

export function buildSuccessResponse<T>(data?: T, message: string = 'success'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data,
  };
}

export function buildErrorResponse(message: string, code: number = 500): ApiResponse {
  return {
    code,
    message,
  };
}
