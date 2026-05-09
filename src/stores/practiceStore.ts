import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionType = 'choice' | 'judgment' | 'coding';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  correctAnswer: string;
  knowledgePoint: string;
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

  setDailyQuestions: (questions: Question[]) => void;
  submitAnswer: (questionId: string, answer: string) => boolean;
  nextQuestion: () => void;
  resetDailyPractice: () => void;
  addToMistakes: (question: Question) => void;
  removeFromMistakes: (questionId: string) => void;
  toggleFavorite: (questionId: string) => void;
  markTodayCompleted: () => void;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      dailyQuestions: [],
      dailyCompleted: 0,
      dailyAnswers: {},
      currentQuestionIndex: 0,
      mistakes: [
        {
          id: 'm1',
          type: 'choice',
          content: '下列哪个选项不是C++的关键字？',
          options: ['int', 'float', 'String', 'char'],
          correctAnswer: 'String',
          knowledgePoint: 'L1-T2',
          difficulty: 1,
          points: 2,
          analysis: 'C++的关键字包括int、float、char等，而String不是C++关键字。',
        },
        {
          id: 'm2',
          type: 'judgment',
          content: '在C++中，变量名可以包含数字。',
          correctAnswer: 'true',
          knowledgePoint: 'L1-T2',
          difficulty: 1,
          points: 2,
          analysis: '变量名可以包含数字，但不能以数字开头。',
        },
      ],
      favorites: [],
      todayCompleted: false,

      setDailyQuestions: (questions) =>
        set({
          dailyQuestions: questions,
          currentQuestionIndex: 0,
          dailyCompleted: 0,
          dailyAnswers: {},
        }),

      submitAnswer: (questionId, answer) => {
        const question = get().dailyQuestions.find((q) => q.id === questionId);
        if (!question) return false;

        const isCorrect = answer === question.correctAnswer;

        set((state) => ({
          dailyAnswers: { ...state.dailyAnswers, [questionId]: answer },
          dailyCompleted: state.dailyCompleted + 1,
        }));

        if (!isCorrect) {
          get().addToMistakes(question);
        }

        return isCorrect;
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
    }),
    {
      name: 'gesp-practice-storage',
    }
  )
);
