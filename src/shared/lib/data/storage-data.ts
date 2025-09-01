import { Word } from 'shared/lib/types';
import { Difficulty, STORAGE_CONFIG } from 'shared/lib/configs';
import storageService from 'shared/lib/storage';
import wordDataProvider from './storage-data-provider';
import { WORD_DIFFICULTY } from 'entities/words';

class WordDataService {
  async initializeWords(): Promise<void> {
    try {
      const existingWords = await storageService.getWords();

      // Only add words if no words exist
      if (existingWords.length === 0) {
        const words = await wordDataProvider.loadWordsFromCurrentSource();

        for (const wordData of words) {
          // Validate and clean word data before adding
          if (wordDataProvider.validateWordData(wordData)) {
            const cleanedWord = wordDataProvider.cleanWordData(wordData);
            await storageService.addWord(cleanedWord);
          }
        }
      }
    } catch (error) {
      throw new Error('Failed to initialize word data');
    }
  }

  async loadWordsFromSource(sourceName: string): Promise<void> {
    try {
      const words = await wordDataProvider.loadWordsFromSource(sourceName);

      // Clear existing words and add new ones
      await storageService.clearAllData();

      for (const wordData of words) {
        if (wordDataProvider.validateWordData(wordData)) {
          const cleanedWord = wordDataProvider.cleanWordData(wordData);
          await storageService.addWord(cleanedWord);
        }
      }
    } catch (error) {
      throw new Error(`Failed to load words from ${sourceName}`);
    }
  }

  async getRandomWords(
    count: number,
    filter?: 'learned' | 'unlearned',
  ): Promise<Word[]> {
    const words = filter
      ? await storageService.getWordsByFilter(filter)
      : await storageService.getWords();

    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getWordsByDifficulty(difficulty: WORD_DIFFICULTY): Promise<Word[]> {
    const words = await storageService.getWords();
    return words.filter(word => word.difficulty === difficulty);
  }

  async getWordsForStudy(
    count: number = STORAGE_CONFIG.STUDY.DEFAULT_SESSION_SIZE,
  ): Promise<Word[]> {
    // Get unlearned words, prioritizing by difficulty
    const unlearnedWords = await storageService.getWordsByFilter('unlearned');

    // Sort by difficulty (easy first) and review count (least reviewed first)
    const sortedWords = unlearnedWords.sort((a, b) => {
      const difficultyDiff =
        STORAGE_CONFIG.DIFFICULTY_WEIGHTS[a.difficulty] -
        STORAGE_CONFIG.DIFFICULTY_WEIGHTS[b.difficulty];

      if (difficultyDiff !== 0) return difficultyDiff;
      return a.reviewCount - b.reviewCount;
    });

    return sortedWords.slice(0, count);
  }

  async getWordsForReview(
    count: number = STORAGE_CONFIG.STUDY.DEFAULT_REVIEW_SIZE,
  ): Promise<Word[]> {
    // Get learned words that haven't been reviewed recently
    const learnedWords = await storageService.getWordsByFilter('learned');

    const now = Date.now();

    // Sort by last review time (oldest first) and review count
    const sortedWords = learnedWords.sort((a, b) => {
      const aLastReview = a.lastReviewed || 0;
      const bLastReview = b.lastReviewed || 0;

      // Prioritize words that haven't been reviewed in over the threshold
      const aNeedsReview =
        now - aLastReview > STORAGE_CONFIG.STUDY.REVIEW_THRESHOLD;
      const bNeedsReview =
        now - bLastReview > STORAGE_CONFIG.STUDY.REVIEW_THRESHOLD;

      if (aNeedsReview && !bNeedsReview) return -1;
      if (!aNeedsReview && bNeedsReview) return 1;

      // If both need review or both don't, sort by review count
      return a.reviewCount - b.reviewCount;
    });

    return sortedWords.slice(0, count);
  }

  async incrementReviewCount(wordId: string): Promise<void> {
    const word = await storageService.getWords();
    const targetWord = word.find(w => w.id === wordId);

    if (targetWord) {
      await storageService.updateWord(wordId, {
        reviewCount: targetWord.reviewCount + 1,
        lastReviewed: Date.now(),
      });
    }
  }

  async getWordStats(): Promise<{
    total: number;
    learned: number;
    unlearned: number;
    byDifficulty: Record<Difficulty, number>;
  }> {
    const words = await storageService.getWords();

    const learned = words.filter(w => w.isLearned).length;
    const unlearned = words.filter(w => !w.isLearned).length;

    const byDifficulty = {
      easy: words.filter(w => w.difficulty === WORD_DIFFICULTY.EASY).length,
      medium: words.filter(w => w.difficulty === WORD_DIFFICULTY.MEDIUM).length,
      hard: words.filter(w => w.difficulty === WORD_DIFFICULTY.HARD).length,
    } as Record<WORD_DIFFICULTY, number>;

    return {
      total: words.length,
      learned,
      unlearned,
      byDifficulty,
    };
  }
}

export const wordDataService = new WordDataService();
export default wordDataService;
