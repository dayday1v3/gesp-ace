import { z } from 'zod';
import prisma from '../config/database.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError } from '../middlewares/errorHandler.js';
import { TokenPayload } from '../models/types.js';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文'),
  password: z
    .string()
    .min(8, '密码至少8位')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, '密码必须包含字母和数字'),
  email: z.string().email('无效的邮箱格式').optional().or(z.literal('')),
});

export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, '请输入原密码'),
  newPassword: z
    .string()
    .min(8, '新密码至少8位')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, '新密码必须包含字母和数字'),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  avatar: z.string().url().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { username: input.username },
    });

    if (existingUser) {
      throw new ConflictError('用户名已存在');
    }

    if (input.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingEmail) {
        throw new ConflictError('邮箱已被使用');
      }
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        password: hashedPassword,
        email: input.email || null,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        currentLevel: true,
        streakDays: true,
        totalScore: true,
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      role: 'student',
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      token,
      refreshToken,
      user,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { username: input.username },
      select: {
        id: true,
        username: true,
        password: true,
        avatar: true,
        currentLevel: true,
        streakDays: true,
        totalScore: true,
        examDate: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('用户名或密码错误');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('账户已被禁用');
    }

    const isValidPassword = await comparePassword(input.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('用户名或密码错误');
    }

    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new UnauthorizedError('用户不存在');
    }

    const isValidPassword = await comparePassword(input.oldPassword, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('原密码错误');
    }

    const passwordValidation = validatePasswordStrength(input.newPassword);
    if (!passwordValidation.valid) {
      throw new ConflictError(passwordValidation.message!);
    }

    const hashedPassword = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: '密码修改成功' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(
        refreshToken,
        process.env.JWT_SECRET!
      ) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedError('用户不存在');
      }

      const payload: TokenPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };

      const newToken = generateToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedError('Refresh token 无效或已过期');
    }
  }
}

export const authService = new AuthService();
