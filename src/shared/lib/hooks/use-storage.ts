import { useState, useEffect, useCallback } from 'react';
import {
  Word,
  UserProgress,
  BlockingSettings,
  AppSettings,
  StudySession,
} from 'shared/lib/types';
import { Filter } from 'shared/lib/configs';
import storageService from 'shared/lib/storage';
import { wordDataService } from 'shared/lib/data';

export const useStorage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [blockingSettings, setBlockingSettings] = useState<BlockingSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize words if needed
      await wordDataService.initializeWords();

      // Load all data in parallel
      const [wordsData, progressData, blockingData, settingsData, sessionsData] = await Promise.all([
        storageService.getWords(),
        storageService.getProgress(),
        storageService.getBlockingSettings(),
        storageService.getAppSettings(),
        storageService.getStudySessions(),
      ]);

      setWords(wordsData);
      setProgress(progressData);
      setBlockingSettings(blockingData);
      setAppSettings(settingsData);
      setStudySessions(sessionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Word management
  const addWord = useCallback(async (wordData: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>) => {
    try {
      const newWord = await storageService.addWord(wordData);
      setWords(prev => [...prev, newWord]);
      return newWord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add word');
      throw err;
    }
  }, []);

  const updateWord = useCallback(async (id: string, updates: Partial<Word>) => {
    try {
      const updatedWord = await storageService.updateWord(id, updates);
      if (updatedWord) {
        setWords(prev => prev.map(word => word.id === id ? updatedWord : word));
      }
      return updatedWord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update word');
      throw err;
    }
  }, []);

  const deleteWord = useCallback(async (id: string) => {
    try {
      const success = await storageService.deleteWord(id);
      if (success) {
        setWords(prev => prev.filter(word => word.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete word');
      throw err;
    }
  }, []);

  const markWordAsLearned = useCallback(async (id: string) => {
    try {
      await storageService.markWordAsLearned(id);
      setWords(prev => prev.map(word => 
        word.id === id ? { ...word, isLearned: true, lastReviewed: Date.now() } : word
      ));
      
      // Update progress
      if (progress) {
        setProgress(prev => prev ? { ...prev, learnedWords: prev.learnedWords + 1 } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark word as learned');
      throw err;
    }
  }, [progress]);

  const searchWords = useCallback(async (query: string) => {
    try {
      return await storageService.searchWords(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search words');
      throw err;
    }
  }, []);

  const getWordsByFilter = useCallback(async (filter: Filter) => {
    try {
      return await storageService.getWordsByFilter(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter words');
      throw err;
    }
  }, []);

  // Progress management
  const updateProgress = useCallback(async (updates: Partial<UserProgress>) => {
    try {
      const updatedProgress = await storageService.updateProgress(updates);
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    }
  }, []);

  // Blocking settings
  const updateBlockingSettings = useCallback(async (updates: Partial<BlockingSettings>) => {
    try {
      const updatedSettings = await storageService.updateBlockingSettings(updates);
      setBlockingSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blocking settings');
      throw err;
    }
  }, []);

  const incrementBlockCount = useCallback(async () => {
    try {
      await storageService.incrementBlockCount();
      setBlockingSettings(prev => prev ? {
        ...prev,
        totalBlocksTriggered: prev.totalBlocksTriggered + 1,
        lastBlockTime: Date.now(),
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment block count');
      throw err;
    }
  }, []);

  // App settings
  const updateAppSettings = useCallback(async (updates: Partial<AppSettings>) => {
    try {
      const updatedSettings = await storageService.updateAppSettings(updates);
      setAppSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update app settings');
      throw err;
    }
  }, []);

  // Study sessions
  const startStudySession = useCallback(async () => {
    try {
      return await storageService.startStudySession();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start study session');
      throw err;
    }
  }, []);

  const endStudySession = useCallback(async (sessionId: string, wordsStudied: string[], wordsLearned: string[]) => {
    try {
      await storageService.endStudySession(sessionId, wordsStudied, wordsLearned);
      
      // Reload sessions and progress
      const [sessionsData, progressData] = await Promise.all([
        storageService.getStudySessions(),
        storageService.getProgress(),
      ]);
      
      setStudySessions(sessionsData);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end study session');
      throw err;
    }
  }, []);

  // Statistics
  const getStatistics = useCallback(async () => {
    try {
      return await storageService.getStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get statistics');
      throw err;
    }
  }, []);

  // Data management
  const clearAllData = useCallback(async () => {
    try {
      await storageService.clearAllData();
      setWords([]);
      setProgress(null);
      setBlockingSettings(null);
      setAppSettings(null);
      setStudySessions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
      throw err;
    }
  }, []);

  const exportData = useCallback(async () => {
    try {
      return await storageService.exportData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    }
  }, []);

  const importData = useCallback(async (data: any) => {
    try {
      await storageService.importData(data);
      await loadAllData(); // Reload all data after import
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      throw err;
    }
  }, [loadAllData]);

  // Word data service methods
  const getRandomWords = useCallback(async (count: number, filter?: 'learned' | 'unlearned') => {
    try {
      return await wordDataService.getRandomWords(count, filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get random words');
      throw err;
    }
  }, []);

  const getWordsForStudy = useCallback(async (count?: number) => {
    try {
      return await wordDataService.getWordsForStudy(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get words for study');
      throw err;
    }
  }, []);

  const getWordsForReview = useCallback(async (count?: number) => {
    try {
      return await wordDataService.getWordsForReview(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get words for review');
      throw err;
    }
  }, []);

  const incrementReviewCount = useCallback(async (wordId: string) => {
    try {
      await wordDataService.incrementReviewCount(wordId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment review count');
      throw err;
    }
  }, []);

  const getWordStats = useCallback(async () => {
    try {
      return await wordDataService.getWordStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get word stats');
      throw err;
    }
  }, []);

  return {
    // State
    words,
    progress,
    blockingSettings,
    appSettings,
    studySessions,
    loading,
    error,
    
    // Actions
    loadAllData,
    addWord,
    updateWord,
    deleteWord,
    markWordAsLearned,
    searchWords,
    getWordsByFilter,
    updateProgress,
    updateBlockingSettings,
    incrementBlockCount,
    updateAppSettings,
    startStudySession,
    endStudySession,
    getStatistics,
    clearAllData,
    exportData,
    importData,
    getRandomWords,
    getWordsForStudy,
    getWordsForReview,
    incrementReviewCount,
    getWordStats,
  };
};
