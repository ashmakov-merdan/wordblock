import { IStudySession } from "entities/sessions";
import { IWord } from "entities/words";

export enum BLOCKING_INTERVAL {
  FIFTEEN=15,
  TWENTY=20,
  THIRTY=30,
  ONE_HOUR=60,
};

export interface BlockingSettings {
  intervalMinutes: BLOCKING_INTERVAL;
  isEnabled: boolean;
  lastBlockTime?: number;
  totalBlocksTriggered: number;
};

export interface UserProgress {
  totalWords: number;
  learnedWords: number;
  totalTimeSpent: number;
  totalSessions: number;
  lastStudyDate?: number;
  currentStreak: number;
  longestStreak: number;
}

export interface IStorage {
  words: IWord[];
  progress: UserProgress;
  blockingSettings: BlockingSettings;
  studySessions: IStudySession[];
  lastSyncTime?: number;
}