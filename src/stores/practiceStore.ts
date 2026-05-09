import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { practiceAPI, type StartPracticeResponse, type SubmitAnswerResponse } from '@/services/practice';

export type QuestionType = 'choice' | 'judgment' | 'coding';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  knowledgePoint?: {
    code: string;
    name: string;
  };
  difficulty: 1 | 2 | 3;
  points: number;
  analysis?: string;
}

interface PracticeState {
  dailyQuestions: Question[];
  dailyCompleted: number;
  dailyAnswers: Record<string, string>;
  currentQuestionIndex: number;
  mistakes: Question[];
  favorites: string[];
  todayCompleted: boolean;
  practiceId: string | null;
  isLoading: boolean;

  fetchDailyQuestions: () => Promise<void>;
  startPractice: (type: 'daily' | 'topic' | 'exam' | 'timed', targetLevel?: number) => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => Promise<SubmitAnswerResponse>;
  nextQuestion: () => void;
  resetDailyPractice: () => void;
  addToMistakes: (question: Question) => void;
  removeFromMistakes: (questionId: string) => void;
  toggleFavorite: (questionId: string) => void;
  markTodayCompleted: () => void;
  completePractice: () => Promise<void>;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      dailyQuestions: [],
      dailyCompleted: 0,
      dailyAnswers: {},
      currentQuestionIndex: 0,
      mistakes: [],
      favorites: [],
      todayCompleted: false,
      practiceId: null,
      isLoading: false,

      fetchDailyQuestions: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await practiceAPI.start({ type: 'daily' });
          const data = response.data;
          set({
            dailyQuestions: data.questions,
            practiceId: data.practiceId,
            currentQuestionIndex: 0,
            dailyCompleted: 0,
            dailyAnswers: {},
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to fetch daily questions:', error);
        }
      },

      startPractice: async (type, targetLevel) => {
        set({ isLoading: true });
        try {
          const response = await practiceAPI.start({
            type,
            targetLevel,
            count: type === 'daily' ? 3 : 10,
          });
          const data = response.data;
          set({
            dailyQuestions: data.questions,
            practiceId: data.practiceId,
            currentQuestionIndex: 0,
            dailyCompleted: 0,
            dailyAnswers: {},
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      submitAnswer: async (questionId: string, answer: string) => {
        const { practiceId, dailyQuestions } = get();
        if (!practiceId) throw new Error('No active practice');

        const response = await practiceAPI.submitAnswer({
          practiceId,
          questionId,
          answer,
        });

        set((state) => ({
          dailyAnswers: { ...state.dailyAnswers, [questionId]: answer },
          dailyCompleted: state.dailyCompleted + 1,
        }));

        const question = dailyQuestions.find((q) => q.id === questionId);
        if (question && !response.data.isCorrect) {
          get().addToMistakes(question);
        }

        return response.data;
      },

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),

      resetDailyPractice: () =>
        set({
          dailyCompleted: 0,
          dailyAnswers: {},
          currentQuestionIndex: 0,
          practiceId: null,
        }),

      addToMistakes: (question) =>
        set((state) => {
          if (state.mistakes.find((m) => m.id === question.id)) {
            return state;
          }
          return { mistakes: [...state.mistakes, question] };
        }),

      removeFromMistakes: (questionId) =>
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.id !== questionId),
        })),

      toggleFavorite: (questionId) =>
        set((state) => ({
          favorites: state.favorites.includes(questionId)
            ? state.favorites.filter((id) => id !== questionId)
            : [...state.favorites, questionId],
        })),

      markTodayCompleted: () => set({ todayCompleted: true }),

      completePractice: async () => {
        const { practiceId } = get();
        if (!practiceId) return;

        try {
          await practiceAPI.complete(practiceId);
          set({ todayCompleted: true, practiceId: null });
        } catch (error) {
          console.error('Failed to complete practice:', error);
        }
      },
    }),
    {
      name: 'gesp-practice-storage',
      partialize: (state) => ({
        todayCompleted: state.todayCompleted,
        favorites: state.favorites,
      }),
    }
  )
);
