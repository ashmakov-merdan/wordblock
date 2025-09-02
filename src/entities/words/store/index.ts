import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IWord, WORD_DIFFICULTY } from '../model';
import { search, study } from '../configs';

interface WordsState {
  words: IWord[];
  // Actions
  addWord: (word: Omit<IWord, 'id' | 'createdAt' | 'reviewCount'>) => void;
  updateWord: (id: string, updates: Partial<IWord>) => void;
  deleteWord: (id: string) => void;
  markWordAsLearned: (id: string) => void;
  incrementReviewCount: (id: string) => void;
  clearAllWords: () => void;
  setWords: (words: IWord[]) => void;
  // Selectors
  getWordById: (id: string) => IWord | undefined;
  getWordsByFilter: (filter: 'all' | 'learned' | 'unlearned') => IWord[];
  getWordsByDifficulty: (difficulty: WORD_DIFFICULTY) => IWord[];
  searchWords: (query: string) => IWord[];
  getWordsForStudy: (count?: number) => IWord[];
  getWordsForReview: (count?: number) => IWord[];
  getWordStats: () => {
    total: number;
    learned: number;
    unlearned: number;
    byDifficulty: Record<WORD_DIFFICULTY, number>;
  };
}

const initialState = {
  words: [],
};

export const useWordsStore = create<WordsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      addWord: (wordData) => {
        const newWord: IWord = {
          ...wordData,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          createdAt: Date.now(),
          reviewCount: 0,
        };
        
        set(state => ({
          words: [...state.words, newWord]
        }));
      },

      updateWord: (id, updates) => {
        set(state => ({
          words: state.words.map(word => 
            word.id === id ? { ...word, ...updates } : word
          )
        }));
      },

      deleteWord: (id) => {
        set(state => ({
          words: state.words.filter(word => word.id !== id)
        }));
      },

      markWordAsLearned: (id) => {
        get().updateWord(id, { 
          isLearned: true, 
          lastReviewed: Date.now() 
        });
      },

      incrementReviewCount: (id) => {
        const word = get().getWordById(id);
        if (word) {
          get().updateWord(id, {
            reviewCount: word.reviewCount + 1,
            lastReviewed: Date.now(),
          });
        }
      },

      clearAllWords: () => {
        set(initialState);
      },

      setWords: (words) => {
        set({ words });
      },

      // Selectors
      getWordById: (id) => {
        return get().words.find(word => word.id === id);
      },

      getWordsByFilter: (filter) => {
        const { words } = get();
        switch (filter) {
          case 'learned':
            return words.filter(w => w.isLearned);
          case 'unlearned':
            return words.filter(w => !w.isLearned);
          default:
            return words;
        }
      },

      getWordsByDifficulty: (difficulty) => {
        return get().words.filter(word => word.difficulty === difficulty);
      },

      searchWords: (query) => {
        const { words } = get();
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.length < search.min_query_length) {
          return [];
        }
        
        const results = words.filter(word => 
          word.word.toLowerCase().includes(lowerQuery) ||
          word.definition.toLowerCase().includes(lowerQuery)
        );
        
        return results.slice(0, search.max_results);
      },

      getWordsForStudy: (count = study.defaultSessionSize) => {
        const unlearnedWords = get().getWordsByFilter('unlearned');
        
        // Sort by difficulty (easy first) and review count (least reviewed first)
        const sortedWords = unlearnedWords.sort((a, b) => {
          const difficultyDiff = a.difficulty - b.difficulty;
          if (difficultyDiff !== 0) return difficultyDiff;
          return a.reviewCount - b.reviewCount;
        });
        
        return sortedWords.slice(0, count);
      },

      getWordsForReview: (count = study.defaultReviewSize) => {
        const learnedWords = get().getWordsByFilter('learned');
        const now = Date.now();
        
        // Sort by last review time (oldest first) and review count
        const sortedWords = learnedWords.sort((a, b) => {
          const aLastReview = a.lastReviewed || 0;
          const bLastReview = b.lastReviewed || 0;
          
          // Prioritize words that haven't been reviewed in over the threshold
          const aNeedsReview = now - aLastReview > study.reviewThreshold;
          const bNeedsReview = now - bLastReview > study.reviewThreshold;
          
          if (aNeedsReview && !bNeedsReview) return -1;
          if (!aNeedsReview && bNeedsReview) return 1;
          
          // If both need review or both don't, sort by review count
          return a.reviewCount - b.reviewCount;
        });
        
        return sortedWords.slice(0, count);
      },

      getWordStats: () => {
        const { words } = get();
        const learned = words.filter(w => w.isLearned).length;
        const unlearned = words.filter(w => !w.isLearned).length;
        
        const byDifficulty = {
          [WORD_DIFFICULTY.EASY]: words.filter(w => w.difficulty === WORD_DIFFICULTY.EASY).length,
          [WORD_DIFFICULTY.MEDIUM]: words.filter(w => w.difficulty === WORD_DIFFICULTY.MEDIUM).length,
          [WORD_DIFFICULTY.HARD]: words.filter(w => w.difficulty === WORD_DIFFICULTY.HARD).length,
        };
        
        return {
          total: words.length,
          learned,
          unlearned,
          byDifficulty,
        };
      },
    }),
    {
      name: 'wordblock-words', // storage key
      partialize: (state) => ({
        words: state.words,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Words rehydrated:', state);
      },
    }
  )
);
