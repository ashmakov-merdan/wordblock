import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Word,
  UserProgress,
  BlockingSettings,
  AppSettings,
  StudySession,
  StorageData,
  STORAGE_KEYS,
} from 'shared/lib/types';
import { STORAGE_CONFIG } from 'shared/lib/configs';

class StorageService {
  private defaultProgress: UserProgress = STORAGE_CONFIG.DEFAULTS.PROGRESS;
  private defaultBlockingSettings: BlockingSettings = STORAGE_CONFIG.DEFAULTS.BLOCKING_SETTINGS;
  private defaultAppSettings: AppSettings = STORAGE_CONFIG.DEFAULTS.APP_SETTINGS;

  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new Error(`Failed to save data for key: ${key}`);
    }
  }

  private async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  // Words management
  async getWords(): Promise<Word[]> {
    return this.getItem<Word[]>(STORAGE_KEYS.WORDS, []);
  }

  async saveWords(words: Word[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.WORDS, words);
  }

  async addWord(word: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>): Promise<Word> {
    const words = await this.getWords();
    const newWord: Word = {
      ...word,
      id: this.generateId(),
      createdAt: Date.now(),
      reviewCount: 0,
    };
    
    words.push(newWord);
    await this.saveWords(words);
    
    // Update progress
    await this.updateProgress({ totalWords: words.length });
    
    return newWord;
  }

  async updateWord(id: string, updates: Partial<Word>): Promise<Word | null> {
    const words = await this.getWords();
    const index = words.findIndex(w => w.id === id);
    
    if (index === -1) return null;
    
    words[index] = { ...words[index], ...updates };
    await this.saveWords(words);
    
    return words[index];
  }

  async deleteWord(id: string): Promise<boolean> {
    const words = await this.getWords();
    const filteredWords = words.filter(w => w.id !== id);
    
    if (filteredWords.length === words.length) return false;
    
    await this.saveWords(filteredWords);
    await this.updateProgress({ totalWords: filteredWords.length });
    
    return true;
  }

  async searchWords(query: string): Promise<Word[]> {
    const words = await this.getWords();
    const lowerQuery = query.toLowerCase();
    
    // Check minimum query length
    if (lowerQuery.length < STORAGE_CONFIG.SEARCH.MIN_QUERY_LENGTH) {
      return [];
    }
    
    const results = words.filter(word => 
      word.word.toLowerCase().includes(lowerQuery) ||
      word.definition.toLowerCase().includes(lowerQuery)
    );
    
    // Limit results
    return results.slice(0, STORAGE_CONFIG.SEARCH.MAX_RESULTS);
  }

  async getWordsByFilter(filter: 'all' | 'learned' | 'unlearned'): Promise<Word[]> {
    const words = await this.getWords();
    
    switch (filter) {
      case 'learned':
        return words.filter(w => w.isLearned);
      case 'unlearned':
        return words.filter(w => !w.isLearned);
      default:
        return words;
    }
  }

  // Progress management
  async getProgress(): Promise<UserProgress> {
    return this.getItem<UserProgress>(STORAGE_KEYS.PROGRESS, this.defaultProgress);
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    const progress = await this.getProgress();
    const updatedProgress = { ...progress, ...updates };
    
    await this.setItem(STORAGE_KEYS.PROGRESS, updatedProgress);
    return updatedProgress;
  }

  async markWordAsLearned(wordId: string): Promise<void> {
    const word = await this.updateWord(wordId, { 
      isLearned: true, 
      lastReviewed: Date.now() 
    });
    
    if (word) {
      const progress = await this.getProgress();
      await this.updateProgress({
        learnedWords: progress.learnedWords + 1,
      });
    }
  }

  // Blocking settings
  async getBlockingSettings(): Promise<BlockingSettings> {
    return this.getItem<BlockingSettings>(
      STORAGE_KEYS.BLOCKING_SETTINGS, 
      this.defaultBlockingSettings
    );
  }

  async updateBlockingSettings(updates: Partial<BlockingSettings>): Promise<BlockingSettings> {
    const settings = await this.getBlockingSettings();
    const updatedSettings = { ...settings, ...updates };
    
    await this.setItem(STORAGE_KEYS.BLOCKING_SETTINGS, updatedSettings);
    return updatedSettings;
  }

  async incrementBlockCount(): Promise<void> {
    const settings = await this.getBlockingSettings();
    await this.updateBlockingSettings({
      totalBlocksTriggered: settings.totalBlocksTriggered + 1,
      lastBlockTime: Date.now(),
    });
  }

  // App settings
  async getAppSettings(): Promise<AppSettings> {
    return this.getItem<AppSettings>(STORAGE_KEYS.APP_SETTINGS, this.defaultAppSettings);
  }

  async updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const settings = await this.getAppSettings();
    const updatedSettings = { ...settings, ...updates };
    
    await this.setItem(STORAGE_KEYS.APP_SETTINGS, updatedSettings);
    return updatedSettings;
  }

  // Study sessions
  async getStudySessions(): Promise<StudySession[]> {
    return this.getItem<StudySession[]>(STORAGE_KEYS.STUDY_SESSIONS, []);
  }

  async saveStudySession(session: StudySession): Promise<void> {
    const sessions = await this.getStudySessions();
    sessions.push(session);
    await this.setItem(STORAGE_KEYS.STUDY_SESSIONS, sessions);
  }

  async startStudySession(): Promise<StudySession> {
    const session: StudySession = {
      id: this.generateId(),
      startTime: Date.now(),
      wordsStudied: [],
      wordsLearned: [],
      duration: 0,
    };
    
    return session;
  }

  async endStudySession(sessionId: string, wordsStudied: string[], wordsLearned: string[]): Promise<void> {
    const sessions = await this.getStudySessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) return;
    
    const endTime = Date.now();
    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      endTime,
      wordsStudied,
      wordsLearned,
      duration: endTime - sessions[sessionIndex].startTime,
    };
    
    await this.setItem(STORAGE_KEYS.STUDY_SESSIONS, sessions);
    
    // Update progress
    const progress = await this.getProgress();
    await this.updateProgress({
      totalTimeSpent: progress.totalTimeSpent + sessions[sessionIndex].duration,
      totalSessions: progress.totalSessions + 1,
      lastStudyDate: endTime,
    });
  }

  // Statistics
  async getStatistics() {
    const progress = await this.getProgress();
    const blockingSettings = await this.getBlockingSettings();
    const sessions = await this.getStudySessions();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessions.filter(s => 
      s.endTime && new Date(s.endTime) >= today
    );
    
    const averageSessionTime = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
      : 0;
    
    return {
      totalWords: progress.totalWords,
      learnedWords: progress.learnedWords,
      totalTimeSpent: progress.totalTimeSpent,
      totalSessions: progress.totalSessions,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      totalBlocksTriggered: blockingSettings.totalBlocksTriggered,
      todaySessions: todaySessions.length,
      averageSessionTime,
      learningRate: progress.totalWords > 0 
        ? (progress.learnedWords / progress.totalWords) * 100 
        : 0,
    };
  }

  // Data management
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      throw new Error('Failed to clear application data');
    }
  }

  async exportData(): Promise<StorageData> {
    const [words, progress, blockingSettings, appSettings, studySessions, lastSync] = await Promise.all([
      this.getWords(),
      this.getProgress(),
      this.getBlockingSettings(),
      this.getAppSettings(),
      this.getStudySessions(),
      AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
    ]);
    
    return {
      words,
      progress,
      blockingSettings,
      appSettings,
      studySessions,
      lastSyncTime: lastSync ? parseInt(lastSync) : undefined,
    };
  }

  async importData(data: StorageData): Promise<void> {
    await Promise.all([
      this.saveWords(data.words),
      this.setItem(STORAGE_KEYS.PROGRESS, data.progress),
      this.setItem(STORAGE_KEYS.BLOCKING_SETTINGS, data.blockingSettings),
      this.setItem(STORAGE_KEYS.APP_SETTINGS, data.appSettings),
      this.setItem(STORAGE_KEYS.STUDY_SESSIONS, data.studySessions),
      this.setItem(STORAGE_KEYS.LAST_SYNC, data.lastSyncTime || Date.now()),
    ]);
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async getLastSyncTime(): Promise<number | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return value ? parseInt(value) : null;
  }

  async setLastSyncTime(): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC, Date.now());
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
