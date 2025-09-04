import { WORD_DIFFICULTY } from "entities/words";
import { BLOCKING_INTERVAL, BlockingSettings, UserProgress } from "../model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  defaults: {
    progress: UserProgress;
    blockingSettings: BlockingSettings;
  };
  study: {
    defaultSessionSize: number;
    defaultReviewSize: number;
    minStudyTime: number;
    reviewThreshold: number;
  };
  difficultyWeights: Record<string, WORD_DIFFICULTY>;
  // Actions
  updateProgress: (updates: Partial<UserProgress>) => void;
  updateBlockingSettings: (updates: Partial<BlockingSettings>) => void;
  resetToDefaults: () => void;
}

const initialState = {
  defaults: {
    progress: {
      totalWords: 0,
      learnedWords: 0,
      totalTimeSpent: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    blockingSettings: {
      intervalMinutes: BLOCKING_INTERVAL.FIFTEEN,
      isEnabled: true,
      totalBlocksTriggered: 0,
    },
  },

  study: {
    defaultSessionSize: 10,
    defaultReviewSize: 20,
    minStudyTime: 30 * 1000,
    reviewThreshold: 24 * 60 * 60 * 1000,
  },

  difficultyWeights: {
    easy: WORD_DIFFICULTY.EASY,
    medium: WORD_DIFFICULTY.MEDIUM,
    hard: WORD_DIFFICULTY.HARD,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      
      updateProgress: (updates: Partial<UserProgress>) => {
        set(state => ({
          defaults: {
            ...state.defaults,
            progress: { ...state.defaults.progress, ...updates }
          }
        }));
      },

      updateBlockingSettings: (updates: Partial<BlockingSettings>) => {
        set(state => ({
          defaults: {
            ...state.defaults,
            blockingSettings: { ...state.defaults.blockingSettings, ...updates }
          }
        }));
      },

      resetToDefaults: () => {
        set(initialState);
      },
    }),
    {
      name: 'wordblock-settings', // storage key
      // Only persist the defaults, not the study config or difficulty weights
      partialize: (state) => ({
        defaults: state.defaults,
      }),
      // Optional: migrate old storage format if needed
      onRehydrateStorage: () => (state) => {
        console.log('Settings rehydrated:', state);
      },
    }
  )
);