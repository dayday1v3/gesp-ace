import api from './api';

export interface WeakPoint {
  knowledgeCode: string;
  knowledgeName: string;
  errorRate: number;
  recentMistakes: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface DiagnosisRecommendation {
  type: 'daily' | 'topic' | 'exam';
  title: string;
  description: string;
  knowledgeCodes: string[];
  priority: number;
}

export interface PredictedScore {
  low: number;
  mid: number;
  high: number;
}

export interface DiagnosisReport {
  weakPoints: WeakPoint[];
  recommendations: DiagnosisRecommendation[];
  predictedScore: PredictedScore;
}

export const diagnosisAPI = {
  getReport: () => api.get<DiagnosisReport>('/diagnosis'),

  getWeakPoints: () => api.get<{ weakPoints: WeakPoint[] }>('/diagnosis/weak-points'),
};
