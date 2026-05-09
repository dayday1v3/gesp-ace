import api from './api';
import { Question } from './question';

export interface StartPracticeRequest {
  type: 'daily' | 'topic' | 'exam' | 'timed';
  targetLevel?: number;
  targetKnowledge?: string;
  count?: number;
}

export interface StartPracticeResponse {
  practiceId: string;
  questions: Question[];
}

export interface SubmitAnswerRequest {
  practiceId: string;
  questionId: string;
  answer: string;
  timeSpent?: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  analysis?: string;
  score: number;
}

export interface CompletePracticeResponse {
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  streakDays: number;
  newAchievements: string[];
}

export interface PracticeHistory {
  id: string;
  type: string;
  status: string;
  targetLevel?: number;
  startedAt: string;
  completedAt?: string;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  timeSpent: number;
}

export const practiceAPI = {
  start: (data: StartPracticeRequest) =>
    api.post<StartPracticeResponse>('/practice/start', data),

  submitAnswer: (data: SubmitAnswerRequest) =>
    api.post<SubmitAnswerResponse>('/practice/answer', data),

  complete: (practiceId: string) =>
    api.post<CompletePracticeResponse>('/practice/complete', { practiceId }),

  getHistory: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get<{ total: number; page: number; limit: number; data: PracticeHistory[] }>(
      '/practice/history',
      { params }
    ),
};
