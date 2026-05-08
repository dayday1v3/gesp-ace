import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  updateProgress: (level: number, correctRate: number, practicedCount: number) => void;
  addStreak: () => void;
  resetStreak: () => void;
  addAchievement: (id: string) => void;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: 'user_001',
      username: '张同学',
      avatar: '/avatars/default.png',
      currentLevel: 2,
      totalScore: 1250,
      streakDays: 7,
      totalPracticeDays: 45,
      achievements: ['first_practice', 'streak_3', 'streak_7'],
      examDate: '2026-06-15',
      levelProgress: {
        1: { correctRate: 0.85, practicedCount: 120, status: 'mastered' },
        2: { correctRate: 0.62, practicedCount: 85, status: 'in_progress' },
        3: { correctRate: 0.31, practicedCount: 30, status: 'weak' },
        4: { correctRate: 0, practicedCount: 0, status: 'locked' },
        5: { correctRate: 0, practicedCount: 0, status: 'locked' },
        6: { correctRate: 0, practicedCount: 0, status: 'locked' },
        7: { correctRate: 0, practicedCount: 0, status: 'locked' },
        8: { correctRate: 0, practicedCount: 0, status: 'locked' },
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
    }
  )
);
