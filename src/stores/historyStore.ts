import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryItem {
  id: string;
  questionId: string;
  questionContent: string;
  questionType: 'choice' | 'judgment' | 'coding';
  answer: string;
  isCorrect: boolean;
  timestamp: number;
  timeSpent: number;
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  getHistoryByDate: (date: string) => HistoryItem[];
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [
        {
          id: 'h1',
          questionId: 'd1',
          questionContent: '在C++中，以下哪个是合法的变量名？',
          questionType: 'choice',
          answer: '_name',
          isCorrect: true,
          timestamp: Date.now() - 86400000,
          timeSpent: 45,
        },
        {
          id: 'h2',
          questionId: 'd2',
          questionContent: 'C++中，所有语句都必须以分号结束。',
          questionType: 'judgment',
          answer: '正确',
          isCorrect: true,
          timestamp: Date.now() - 86400000,
          timeSpent: 30,
        },
        {
          id: 'h3',
          questionId: 'm1',
          questionContent: '下列哪个选项不是C++的关键字？',
          questionType: 'choice',
          answer: 'String',
          isCorrect: false,
          timestamp: Date.now() - 172800000,
          timeSpent: 60,
        },
      ],

      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),

      getHistoryByDate: (date) => {
        const targetTime = new Date(date).getTime();
        const nextDay = targetTime + 86400000;
        return get().history.filter(
          (item) => item.timestamp >= targetTime && item.timestamp < nextDay
        );
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'gesp-history-storage',
    }
  )
);
