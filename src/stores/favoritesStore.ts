import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from './practiceStore';

interface FavoritesState {
  favorites: Question[];
  addFavorite: (question: Question) => void;
  removeFavorite: (questionId: string) => void;
  isFavorite: (questionId: string) => boolean;
  toggleFavorite: (question: Question) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (question) =>
        set((state) => {
          if (state.favorites.find((q) => q.id === question.id)) {
            return state;
          }
          return { favorites: [...state.favorites, question] };
        }),

      removeFavorite: (questionId) =>
        set((state) => ({
          favorites: state.favorites.filter((q) => q.id !== questionId),
        })),

      isFavorite: (questionId) => {
        return get().favorites.some((q) => q.id === questionId);
      },

      toggleFavorite: (question) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.find((q) => q.id === question.id)) {
          removeFavorite(question.id);
        } else {
          addFavorite(question);
        }
      },
    }),
    {
      name: 'gesp-favorites-storage',
    }
  )
);
