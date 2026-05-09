import { z } from 'zod';
import prisma from '../config/database.js';
import { ConflictError, NotFoundError } from '../middlewares/errorHandler.js';

export const subjectCreateSchema = z.object({
  code: z.string().min(1).max(20).regex(/^[A-Za-z0-9_-]+$/, 'code 只能包含字母、数字、_ 和 -'),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const subjectUpdateSchema = subjectCreateSchema.partial();

export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>;

export class SubjectService {
  async list(includeInactive = false) {
    return prisma.subject.findMany({
      where: includeInactive ? {} : { status: 'active' },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: {
        _count: { select: { levels: true } },
      },
    });
  }

  async getById(id: number) {
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { _count: { select: { levels: true } } },
    });
    if (!subject) throw new NotFoundError('学科不存在');
    return subject;
  }

  async create(input: SubjectCreateInput) {
    const existing = await prisma.subject.findUnique({ where: { code: input.code } });
    if (existing) throw new ConflictError(`学科 code ${input.code} 已存在`);
    return prisma.subject.create({ data: input as any });
  }

  async update(id: number, input: SubjectUpdateInput) {
    await this.getById(id);
    if (input.code) {
      const conflict = await prisma.subject.findUnique({ where: { code: input.code } });
      if (conflict && conflict.id !== id) {
        throw new ConflictError(`学科 code ${input.code} 已被占用`);
      }
    }
    return prisma.subject.update({ where: { id }, data: input as any });
  }

  async remove(id: number) {
    const subject = await this.getById(id);
    const levelCount = await prisma.level.count({ where: { subjectId: id } });
    if (levelCount > 0) {
      // Soft delete: still has children, only archive.
      return prisma.subject.update({ where: { id }, data: { status: 'inactive' } });
    }
    await prisma.subject.delete({ where: { id } });
    return subject;
  }
}

export const subjectService = new SubjectService();
