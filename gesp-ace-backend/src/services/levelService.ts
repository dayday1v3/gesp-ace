import { z } from 'zod';
import prisma from '../config/database.js';
import { ConflictError, NotFoundError } from '../middlewares/errorHandler.js';

export const levelCreateSchema = z.object({
  subjectId: z.number().int().positive(),
  level: z.number().int().min(1).max(99),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().nullable(),
  stage: z.string().max(20).optional().nullable(),
  icon: z.string().max(20).optional().nullable(),
  color: z.string().max(120).optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  unlockRequirement: z.number().min(0).max(1).default(0),
  status: z.enum(['locked', 'unlocked', 'in_progress', 'mastered', 'weak']).default('locked'),
});

export const levelUpdateSchema = levelCreateSchema.partial();

export type LevelCreateInput = z.infer<typeof levelCreateSchema>;
export type LevelUpdateInput = z.infer<typeof levelUpdateSchema>;

export class LevelService {
  async list(params: { subjectId?: number; subjectCode?: string }) {
    const where: Record<string, unknown> = {};
    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.subjectCode) where.subject = { code: params.subjectCode };

    return prisma.level.findMany({
      where,
      orderBy: [{ subjectId: 'asc' }, { sortOrder: 'asc' }, { level: 'asc' }],
      include: {
        subject: { select: { id: true, code: true, name: true } },
        _count: { select: { questions: true, knowledgePoints: true } },
      },
    });
  }

  async getById(id: number) {
    const level = await prisma.level.findUnique({
      where: { id },
      include: {
        subject: { select: { id: true, code: true, name: true } },
        _count: { select: { questions: true, knowledgePoints: true } },
      },
    });
    if (!level) throw new NotFoundError('等级不存在');
    return level;
  }

  private async assertSubjectExists(subjectId: number) {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) throw new NotFoundError(`学科 ${subjectId} 不存在`);
  }

  async create(input: LevelCreateInput) {
    await this.assertSubjectExists(input.subjectId);
    const existing = await prisma.level.findUnique({
      where: { subjectId_level: { subjectId: input.subjectId, level: input.level } },
    });
    if (existing) throw new ConflictError(`该学科下已存在 level=${input.level}`);

    return prisma.level.create({
      data: {
        ...input,
        unlockRequirement: input.unlockRequirement ?? 0,
      } as any,
    });
  }

  async update(id: number, input: LevelUpdateInput) {
    const current = await this.getById(id);
    if (input.subjectId) await this.assertSubjectExists(input.subjectId);

    const nextSubjectId = input.subjectId ?? current.subjectId;
    const nextLevel = input.level ?? current.level;
    if (nextSubjectId !== current.subjectId || nextLevel !== current.level) {
      const conflict = await prisma.level.findUnique({
        where: { subjectId_level: { subjectId: nextSubjectId, level: nextLevel } },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictError(`该学科下已存在 level=${nextLevel}`);
      }
    }

    return prisma.level.update({ where: { id }, data: input as any });
  }

  async remove(id: number) {
    const level = await this.getById(id);
    if (level._count.questions > 0 || level._count.knowledgePoints > 0) {
      // Soft delete to preserve foreign keys (questions, knowledge_points, etc.).
      return prisma.level.update({ where: { id }, data: { status: 'locked' } });
    }
    await prisma.level.delete({ where: { id } });
    return level;
  }
}

export const levelService = new LevelService();
