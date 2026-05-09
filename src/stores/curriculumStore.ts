import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subjectAPI, type Subject } from '@/services/subject';
import { levelAPI, type LevelItem } from '@/services/level';

interface CurriculumState {
  subjects: Subject[];
  levels: LevelItem[];
  currentSubjectId: number | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;

  fetchSubjects: () => Promise<void>;
  fetchLevels: (subjectId?: number) => Promise<void>;
  setCurrentSubject: (subjectId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const pickDefaultSubjectId = (subjects: Subject[], persistedId: number | null): number | null => {
  if (persistedId && subjects.some((s) => s.id === persistedId && s.status === 'active')) {
    return persistedId;
  }
  const active = subjects.find((s) => s.status === 'active') ?? subjects[0];
  return active?.id ?? null;
};

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set, get) => ({
      subjects: [],
      levels: [],
      currentSubjectId: null,
      loading: false,
      loaded: false,
      error: null,

      fetchSubjects: async () => {
        set({ loading: true, error: null });
        try {
          const response = await subjectAPI.list();
          const subjects = response.data?.subjects ?? [];
          const currentSubjectId = pickDefaultSubjectId(subjects, get().currentSubjectId);
          set({ subjects, currentSubjectId, loading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : '加载学科失败';
          set({ loading: false, error: message });
        }
      },

      fetchLevels: async (subjectId) => {
        const targetId = subjectId ?? get().currentSubjectId;
        if (!targetId) {
          set({ levels: [], loaded: true });
          return;
        }
        set({ loading: true, error: null });
        try {
          const response = await levelAPI.list({ subjectId: targetId });
          set({ levels: response.data?.levels ?? [], loading: false, loaded: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : '加载等级失败';
          set({ loading: false, error: message });
        }
      },

      setCurrentSubject: async (subjectId) => {
        set({ currentSubjectId: subjectId });
        await get().fetchLevels(subjectId);
      },

      refresh: async () => {
        await get().fetchSubjects();
        await get().fetchLevels();
      },
    }),
    {
      name: 'gesp-curriculum-storage',
      partialize: (state) => ({ currentSubjectId: state.currentSubjectId }),
    },
  ),
);
