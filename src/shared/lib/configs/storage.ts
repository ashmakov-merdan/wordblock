import { WORD_DIFFICULTY } from "entities/words";

export const STORAGE_CONFIG = {
  DEFAULTS: {
    PROGRESS: {
      totalWords: 0,
      learnedWords: 0,
      totalTimeSpent: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    BLOCKING_SETTINGS: {
      intervalMinutes: 30,
      isEnabled: true,
      totalBlocksTriggered: 0,
    },
    APP_SETTINGS: {
      notifications: true,
      soundEnabled: true,
      autoSave: true,
    },
  },

  STUDY: {
    DEFAULT_SESSION_SIZE: 10,
    DEFAULT_REVIEW_SIZE: 20,
    MIN_STUDY_TIME: 20 * 1000, // 20 seconds in milliseconds
    REVIEW_THRESHOLD: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  },

  DIFFICULTY_WEIGHTS: {
    easy: WORD_DIFFICULTY.EASY,
    medium: WORD_DIFFICULTY.MEDIUM,
    hard: WORD_DIFFICULTY.HARD,
  },

  SEARCH: {
    MIN_QUERY_LENGTH: 1,
    MAX_RESULTS: 50,
  },

  STATS: {
    STREAK_THRESHOLD: 24 * 60 * 60 * 1000, // 1 day
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export const BLOCKING_INTERVALS = {
  FIFTEEN_MINUTES: 15,
  TWENTY_MINUTES: 20,
  THIRTY_MINUTES: 30,
  ONE_HOUR: 60,
  ONE_DAY: 1440,
} as const;

export type BlockingInterval = typeof BLOCKING_INTERVALS[keyof typeof BLOCKING_INTERVALS];

export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type Difficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES];

// Filter options
export const FILTERS = {
  ALL: 'all',
  LEARNED: 'learned',
  UNLEARNED: 'unlearned',
} as const;

export type Filter = typeof FILTERS[keyof typeof FILTERS];
