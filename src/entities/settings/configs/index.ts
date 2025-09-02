import { BLOCKING_INTERVAL, UserProgress, BlockingSettings, AppSettings } from '../model';

export const BLOCKING_INTERVALS: { label: string; value: BLOCKING_INTERVAL }[] =
  [
    { label: '15 minutes', value: BLOCKING_INTERVAL.FIFTEEN },
    { label: '20 minutes', value: BLOCKING_INTERVAL.TWENTY },
    { label: '30 minutes', value: BLOCKING_INTERVAL.THIRTY },
    { label: '1 hour', value: BLOCKING_INTERVAL.ONE_HOUR },
  ];

export const STORAGE_KEYS = {
  WORDS: 'words',
  PROGRESS: 'progress',
  BLOCKING_SETTINGS: 'blocking_settings',
  APP_SETTINGS: 'app_settings',
  STUDY_SESSIONS: 'study_sessions',
  LAST_SYNC: 'last_sync',
} as const;

export const STORAGE_CONFIG = {
  DEFAULTS: {
    PROGRESS: {
      totalWords: 0,
      learnedWords: 0,
      totalTimeSpent: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
    } as UserProgress,
    BLOCKING_SETTINGS: {
      intervalMinutes: BLOCKING_INTERVAL.FIFTEEN,
      isEnabled: true,
      totalBlocksTriggered: 0,
    } as BlockingSettings,
    APP_SETTINGS: {
      notifications: true,
      soundEnabled: true,
      autoSave: true,
    } as AppSettings,
  }
} as const;
