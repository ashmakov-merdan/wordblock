import { Word } from '../types/storage';
import { DIFFICULTIES, Difficulty } from 'shared/lib/configs';

// Interface for word data sources
export interface WordDataSource {
  name: string;
  loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]>;
}

// Sample word data source
export class SampleWordDataSource implements WordDataSource {
  name = 'Sample Words';

  async loadWords(): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    return [
      {
        word: 'Serendipity',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        isLearned: false,
        difficulty: DIFFICULTIES.MEDIUM,
      },
      {
        word: 'Ephemeral',
        definition: 'Lasting for a very short time; transitory.',
        isLearned: false,
        difficulty: DIFFICULTIES.MEDIUM,
      },
      {
        word: 'Ubiquitous',
        definition: 'Present, appearing, or found everywhere.',
        isLearned: false,
        difficulty: DIFFICULTIES.HARD,
      },
      {
        word: 'Eloquent',
        definition: 'Fluent or persuasive in speaking or writing.',
        isLearned: false,
        difficulty: DIFFICULTIES.MEDIUM,
      },
      {
        word: 'Resilient',
        definition: 'Able to withstand or recover quickly from difficult conditions.',
        isLearned: false,
        difficulty: DIFFICULTIES.MEDIUM,
      },
      {
        word: 'Perseverance',
        definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
        isLearned: false,
        difficulty: DIFFICULTIES.MEDIUM,
      },
      {
        word: 'Innovation',
        definition: 'A new method, idea, product, etc.',
        isLearned: false,
        difficulty: DIFFICULTIES.EASY,
      },
      {
        word: 'Authentic',
        definition: 'Of undisputed origin and not a copy; genuine.',
        isLearned: false,
        difficulty: DIFFICULTIES.EASY,
      },
      {
        word: 'Empathy',
        definition: 'The ability to understand and share the feelings of another.',
        isLearned: false,
        difficulty: DIFFICULTIES.EASY,
      },
      {
        word: 'Tenacity',
        definition: 'The quality or fact of being very determined; determination.',
        isLearned: false,
        difficulty: DIFFICULTIES.HARD,
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
      console.log(`Loading words from: ${this.filePath}`);
      return [];
    } catch (error) {
      console.error('Error loading words from JSON file:', error);
      throw error;
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
      console.log(`Loading words from API: ${this.apiUrl}`);
      return [];
    } catch (error) {
      console.error('Error loading words from API:', error);
      throw error;
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
      console.log(`Loading words from: ${this.currentSource.name}`);
      return await this.currentSource.loadWords();
    } catch (error) {
      console.error(`Error loading words from ${this.currentSource.name}:`, error);
      throw error;
    }
  }

  async loadWordsFromSource(sourceName: string): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    const source = this.sources.find(s => s.name === sourceName);
    if (!source) {
      throw new Error(`Word data source '${sourceName}' not found`);
    }

    try {
      console.log(`Loading words from: ${source.name}`);
      return await source.loadWords();
    } catch (error) {
      console.error(`Error loading words from ${source.name}:`, error);
      throw error;
    }
  }

  // Utility method to get words by difficulty
  async getWordsByDifficulty(
    words: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[],
    difficulty: Difficulty
  ): Promise<Omit<Word, 'id' | 'createdAt' | 'reviewCount'>[]> {
    return words.filter(word => word.difficulty === difficulty);
  }

  // Utility method to validate word data
  validateWordData(word: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>): boolean {
    return (
      word.word.trim().length > 0 &&
      word.definition.trim().length > 0 &&
      Object.values(DIFFICULTIES).includes(word.difficulty)
    );
  }

  // Utility method to clean word data
  cleanWordData(word: Omit<Word, 'id' | 'createdAt' | 'reviewCount'>): Omit<Word, 'id' | 'createdAt' | 'reviewCount'> {
    return {
      word: word.word.trim(),
      definition: word.definition.trim(),
      isLearned: word.isLearned || false,
      difficulty: word.difficulty,
    };
  }
}

// Export singleton instance
export const wordDataProvider = new WordDataProvider();
export default wordDataProvider;
