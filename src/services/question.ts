import api, { PaginatedResponse } from './api';

export interface Question {
  id: string;
  type: 'choice' | 'judgment' | 'coding';
  content: string;
  options?: string[];
  knowledgePoint?: {
    code: string;
    name: string;
  };
  difficulty: 1 | 2 | 3;
  points: number;
  year?: number;
}

export interface QuestionDetail extends Question {
  answer: string;
  analysis?: string;
  level?: {
    level: number;
    name: string;
  };
}

export interface DailyQuestionsResponse {
  date: string;
  questions: Question[];
}

export interface QuestionListParams {
  level?: number;
  type?: 'choice' | 'judgment' | 'coding';
  knowledge?: string;
  difficulty?: number;
  year?: number;
  page?: number;
  limit?: number;
}

export interface KnowledgeNode {
  id: string;
  name: string;
  description?: string;
  count?: number;
  correctRate?: number;
}

export interface KnowledgeLevel {
  level: number;
  name: string;
  topics: KnowledgeNode[];
}

export const questionAPI = {
  getDaily: () => api.get<DailyQuestionsResponse>('/questions/daily'),

  getList: (params: QuestionListParams) =>
    api.get<PaginatedResponse<Question>>('/questions', { params }),

  getDetail: (id: string) => api.get<QuestionDetail>(`/questions/${id}`),

  getKnowledgeTree: (level?: number) =>
    api.get<{ levels: KnowledgeLevel[] }>('/questions/knowledge', {
      params: level ? { level } : {},
    }),
};
