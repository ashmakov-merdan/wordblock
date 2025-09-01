import { WORD_DIFFICULTY } from 'entities/words';
import { Word } from '../types/storage';
import { DIFFICULTIES, Difficulty } from 'shared/lib/configs';

// Interface for word data sources
export interface WordDataSource {
  name: string;
  loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]>;
}

// Sample word data source
export class SampleWordDataSource implements WordDataSource {
  name = 'Sample Words'

  async loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    return [
      {
        word: 'Serendipity',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
      {
        word: 'Ephemeral',
        definition: 'Lasting for a very short time; transitory.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
      {
        word: 'Ubiquitous',
        definition: 'Present, appearing, or found everywhere.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.HARD,
      },
      {
        word: 'Eloquent',
        definition: 'Fluent or persuasive in speaking or writing.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
      {
        word: 'Resilient',
        definition: 'Able to withstand or recover quickly from difficult conditions.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
      {
        word: 'Perseverance',
        definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
      {
        word: 'Innovation',
        definition: 'A new method, idea, product, etc.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.EASY,
      },
      {
        word: 'Authentic',
        definition: 'Of undisputed origin and not a copy; genuine.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.EASY,
      },
      {
        word: 'Empathy',
        definition: 'The ability to understand and share the feelings of another.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.EASY,
      },
      {
        word: 'Tenacity',
        definition: 'The quality or fact of being very determined; determination.',
        isLearned: false,
        difficulty: WORD_DIFFICULTY.MEDIUM,
      },
    ];
  }
}

// JSON file data source (for future use)
export class JsonFileDataSource implements WordDataSource {
  name = 'JSON File';

  constructor(private filePath: string) {}

  async loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    try {
      // In a real implementation, this would load from a JSON file
      // For now, return empty array
      return [];
    } catch (error) {
      throw new Error('Failed to load words from JSON file');
    }
  }
}

// API data source (for future backend integration)
export class ApiDataSource implements WordDataSource {
  name = 'API';

  constructor(private apiUrl: string) {}

  async loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    try {
      // In a real implementation, this would fetch from an API
      return [];
    } catch (error) {
      throw new Error('Failed to load words from API');
    }
  }
}

// Word data provider that manages multiple sources
export class WordDataProvider {
  private sources: WordDataSource[] = [];
  private currentSource: WordDataSource | null = null;

  constructor() {
    // Add default sample source
    this.addSource(new SampleWordDataSource());
  }

  addSource(source: WordDataSource): void {
    this.sources.push(source);
  }

  setCurrentSource(sourceName: string): boolean {
    const source = this.sources.find(s => s.name === sourceName);
    if (source) {
      this.currentSource = source;
      return true;
    }
    return false;
  }

  getCurrentSource(): WordDataSource | null {
    return this.currentSource;
  }

  getAvailableSources(): WordDataSource[] {
    return [...this.sources];
  }

  async loadWordsFromCurrentSource(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    if (!this.currentSource) {
      throw new Error('No word data source selected');
    }

    try {
      return await this.currentSource.loadWords();
    } catch (error) {
      throw new Error(`Failed to load words from ${this.currentSource.name}`);
    }
  }

  async loadWordsFromSource(sourceName: string): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    const source = this.sources.find(s => s.name === sourceName);
    if (!source) {
      throw new Error(`Word data source '${sourceName}' not found`);
    }

    try {
      return await source.loadWords();
    } catch (error) {
      throw new Error(`Failed to load words from ${source.name}`);
    }
  }

  // Utility method to get words by difficulty
  async getWordsByDifficulty(
    words: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[],
    difficulty: WORD_DIFFICULTY
  ): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    return words.filter(word => word.difficulty === difficulty);
  }

  // Validate word data
  validateWordData(wordData: any): boolean {
    return (
      wordData &&
      typeof wordData.word === 'string' &&
      wordData.word.trim().length > 0 &&
      typeof wordData.definition === 'string' &&
      wordData.definition.trim().length > 0 &&
      typeof wordData.isLearned === 'boolean' &&
      Object.values(DIFFICULTIES).includes(wordData.difficulty)
    );
  }

  // Clean word data
  cleanWordData(wordData: any): Omit<Word, 'id' | 'createdAt' | 'reviewCount'> {
    return {
      word: wordData.word.trim(),
      definition: wordData.definition.trim(),
      isLearned: wordData.isLearned,
      difficulty: wordData.difficulty,
    };
  }

  // Get statistics about word data
  getWordDataStats(words: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]): {
    total: number;
    byDifficulty: Record<Difficulty, number>;
  } {
    const byDifficulty = {
      easy: words.filter(w => w.difficulty === WORD_DIFFICULTY.EASY).length,
      medium: words.filter(w => w.difficulty === WORD_DIFFICULTY.MEDIUM).length,
      hard: words.filter(w => w.difficulty === WORD_DIFFICULTY.HARD).length,
    };

    return {
      total: words.length,
      byDifficulty,
    };
  }
}

// Export singleton instance
const wordDataProvider = new WordDataProvider();
export default wordDataProvider;
