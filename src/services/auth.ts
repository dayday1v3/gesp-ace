import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  currentLevel: number;
  totalScore: number;
  streakDays: number;
  totalPracticeDays: number;
  examDate?: string;
  achievements: string[];
  levelProgress: Record<number, LevelProgressInfo>;
  role?: 'student' | 'admin' | string;
}

export interface LevelProgressInfo {
  level: number;
  name: string;
  correctRate: number;
  practicedCount: number;
  status: 'locked' | 'in_progress' | 'mastered' | 'weak';
}

export const authAPI = {
  login: (data: LoginRequest) => api.post<{ token: string; user: UserInfo }>('/auth/login', data),

  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

export const userAPI = {
  getMe: () => api.get<UserInfo>('/users/me'),

  getLevelProgress: () => api.get<{ levels: Record<number, LevelProgressInfo> }>('/users/me/levels'),

  getKnowledgeProgress: (level: number) =>
    api.get<{ knowledgePoints: KnowledgeProgress[] }>('/users/me/knowledge', {
      params: { level },
    }),
};

export interface KnowledgeProgress {
  code: string;
  name: string;
  correctRate: number;
}
