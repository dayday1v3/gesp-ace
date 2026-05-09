import api, { ApiResponse } from './api';

export interface Subject {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  _count?: { levels: number };
}

export interface SubjectWriteInput {
  code: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  status?: 'active' | 'inactive';
}

export const subjectAPI = {
  list: (includeInactive = false) =>
    api.get<{ subjects: Subject[] }>('/subjects', {
      params: includeInactive ? { includeInactive: 'true' } : undefined,
    }) as unknown as Promise<ApiResponse<{ subjects: Subject[] }>>,

  getOne: (id: number) =>
    api.get<Subject>(`/subjects/${id}`) as unknown as Promise<ApiResponse<Subject>>,

  create: (data: SubjectWriteInput) =>
    api.post<Subject>('/subjects', data) as unknown as Promise<ApiResponse<Subject>>,

  update: (id: number, data: Partial<SubjectWriteInput>) =>
    api.put<Subject>(`/subjects/${id}`, data) as unknown as Promise<ApiResponse<Subject>>,

  remove: (id: number) =>
    api.delete<Subject>(`/subjects/${id}`) as unknown as Promise<ApiResponse<Subject>>,
};
