import api, { ApiResponse } from './api';

export interface LevelItem {
  id: number;
  subjectId: number;
  level: number;
  name: string;
  description: string | null;
  stage: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  unlockRequirement: number | string;
  status: string;
  createdAt: string;
  updatedAt: string;
  subject?: { id: number; code: string; name: string };
  _count?: { questions: number; knowledgePoints: number };
}

export interface LevelWriteInput {
  subjectId: number;
  level: number;
  name: string;
  description?: string | null;
  stage?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  unlockRequirement?: number;
  status?: string;
}

export const levelAPI = {
  list: (params?: { subjectId?: number; subjectCode?: string }) =>
    api.get<{ levels: LevelItem[] }>('/levels', { params }) as unknown as Promise<ApiResponse<{ levels: LevelItem[] }>>,

  getOne: (id: number) =>
    api.get<LevelItem>(`/levels/${id}`) as unknown as Promise<ApiResponse<LevelItem>>,

  create: (data: LevelWriteInput) =>
    api.post<LevelItem>('/levels', data) as unknown as Promise<ApiResponse<LevelItem>>,

  update: (id: number, data: Partial<LevelWriteInput>) =>
    api.put<LevelItem>(`/levels/${id}`, data) as unknown as Promise<ApiResponse<LevelItem>>,

  remove: (id: number) =>
    api.delete<LevelItem>(`/levels/${id}`) as unknown as Promise<ApiResponse<LevelItem>>,
};
