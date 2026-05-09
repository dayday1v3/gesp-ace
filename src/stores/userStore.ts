import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, userAPI, type UserInfo, type LevelProgressInfo } from '@/services/auth';

export type LevelStatus = 'mastered' | 'in_progress' | 'weak' | 'locked';

export interface LevelProgress {
  correctRate: number;
  practicedCount: number;
  status: LevelStatus;
}

interface UserState {
  userId: string;
  username: string;
  avatar: string;
  currentLevel: number;
  totalScore: number;
  streakDays: number;
  totalPracticeDays: number;
  achievements: string[];
  levelProgress: Record<number, LevelProgress>;
  examDate: string;
  isLoggedIn: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  fetchLevelProgress: () => Promise<void>;
  updateProgress: (level: number, correctRate: number, practicedCount: number) => void;
  addStreak: () => void;
  resetStreak: () => void;
  addAchievement: (id: string) => void;
  setUsername: (name: string) => void;
}

const defaultLevelProgress: Record<number, LevelProgress> = {
  1: { correctRate: 0, practicedCount: 0, status: 'in_progress' },
  2: { correctRate: 0, practicedCount: 0, status: 'locked' },
  3: { correctRate: 0, practicedCount: 0, status: 'locked' },
  4: { correctRate: 0, practicedCount: 0, status: 'locked' },
  5: { correctRate: 0, practicedCount: 0, status: 'locked' },
  6: { correctRate: 0, practicedCount: 0, status: 'locked' },
  7: { correctRate: 0, practicedCount: 0, status: 'locked' },
  8: { correctRate: 0, practicedCount: 0, status: 'locked' },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: '',
      username: '',
      avatar: '/avatars/default.png',
      currentLevel: 1,
      totalScore: 0,
      streakDays: 0,
      totalPracticeDays: 0,
      achievements: [],
      levelProgress: { ...defaultLevelProgress },
      examDate: '2026-06-15',
      isLoggedIn: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ username, password });
          localStorage.setItem('token', response.data.token);
          const userData = response.data.user;
          set({
            userId: userData.id,
            username: userData.username,
            avatar: userData.avatar,
            currentLevel: userData.currentLevel,
            totalScore: userData.totalScore,
            streakDays: userData.streakDays,
            totalPracticeDays: userData.totalPracticeDays || 0,
            achievements: userData.achievements || [],
            examDate: userData.examDate || '2026-06-15',
            isLoggedIn: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (username: string, password: string, email?: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register({ username, password, email });
          localStorage.setItem('token', response.data.token);
          const userData = response.data.user;
          set({
            userId: userData.id,
            username: userData.username,
            avatar: userData.avatar,
            currentLevel: userData.currentLevel,
            totalScore: userData.totalScore,
            streakDays: userData.streakDays,
            isLoggedIn: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          userId: '',
          username: '',
          avatar: '/avatars/default.png',
          currentLevel: 1,
          totalScore: 0,
          streakDays: 0,
          totalPracticeDays: 0,
          achievements: [],
          levelProgress: { ...defaultLevelProgress },
          isLoggedIn: false,
        });
      },

      fetchUserInfo: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await userAPI.getMe();
          const userData = response.data;
          set({
            userId: userData.id,
            username: userData.username,
            avatar: userData.avatar,
            currentLevel: userData.currentLevel,
            totalScore: userData.totalScore,
            streakDays: userData.streakDays,
            totalPracticeDays: userData.totalPracticeDays || 0,
            achievements: userData.achievements || [],
            examDate: userData.examDate || '2026-06-15',
            isLoggedIn: true,
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({ isLoggedIn: false });
        }
      },

      fetchLevelProgress: async () => {
        try {
          const response = await userAPI.getLevelProgress();
          const levels = response.data.levels;
          const progress: Record<number, LevelProgress> = { ...defaultLevelProgress };

          for (let i = 1; i <= 8; i++) {
            if (levels[i]) {
              progress[i] = {
                correctRate: levels[i].correctRate,
                practicedCount: levels[i].practicedCount,
                status: levels[i].status,
              };
            }
          }

          set({ levelProgress: progress });
        } catch (error) {
          console.error('Failed to fetch level progress:', error);
        }
      },

      updateProgress: (level, correctRate, practicedCount) =>
        set((state) => ({
          levelProgress: {
            ...state.levelProgress,
            [level]: {
              correctRate,
              practicedCount,
              status:
                correctRate >= 0.8
                  ? 'mastered'
                  : correctRate >= 0.4
                  ? 'in_progress'
                  : 'weak',
            },
          },
        })),

      addStreak: () =>
        set((state) => ({
          streakDays: state.streakDays + 1,
          totalPracticeDays: state.totalPracticeDays + 1,
        })),

      resetStreak: () => set({ streakDays: 0 }),

      addAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.includes(id)
            ? state.achievements
            : [...state.achievements, id],
        })),

      setUsername: (name) => set({ username: name }),
    }),
    {
      name: 'gesp-user-storage',
      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        avatar: state.avatar,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
