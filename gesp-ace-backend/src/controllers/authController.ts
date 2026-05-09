import { Request, Response } from 'express';
import { authService, registerSchema, loginSchema, changePasswordSchema } from '../services/authService.js';
import { successResponse, createdResponse } from '../utils/response.js';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    createdResponse(res, result, '注册成功');
  }

  async login(req: Request, res: Response): Promise<void> {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    successResponse(res, result, '登录成功');
  }

  async logout(req: Request, res: Response): Promise<void> {
    successResponse(res, null, '退出登录成功');
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const input = changePasswordSchema.parse(req.body);
    const result = await authService.changePassword(req.user!.id, input);
    successResponse(res, result, '密码修改成功');
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    successResponse(res, result, '刷新成功');
  }
}

export const authController = new AuthController();
