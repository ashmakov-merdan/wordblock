import { WORD_DIFFICULTY } from "entities/words";

export interface Word {
  id: string;
  word: string;
  definition: string;
  isLearned: boolean;
  createdAt: number;
  lastReviewed?: number;
  reviewCount: number;
  difficulty: WORD_DIFFICULTY;
}

export interface UserProgress {
  totalWords: number;
  learnedWords: number;
  totalTimeSpent: number; // in milliseconds
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: number;
}

export interface BlockingSettings {
  intervalMinutes: 15 | 20 | 30 | 60 | 1440; // 1440 = 1 day
  isEnabled: boolean;
  lastBlockTime?: number;
  totalBlocksTriggered: number;
}

export interface AppSettings {
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  wordsStudied: string[]; // word IDs
  wordsLearned: string[]; // word IDs
  duration: number; // in milliseconds
}

export interface StorageData {
  words: Word[];
  progress: UserProgress;
  blockingSettings: BlockingSettings;
  appSettings: AppSettings;
  studySessions: StudySession[];
  lastSyncTime?: number;
}

// Storage keys
export const STORAGE_KEYS = {
  WORDS: 'words',
  PROGRESS: 'progress',
  BLOCKING_SETTINGS: 'blocking_settings',
  APP_SETTINGS: 'app_settings',
  STUDY_SESSIONS: 'study_sessions',
  LAST_SYNC: 'last_sync',
} as const;
