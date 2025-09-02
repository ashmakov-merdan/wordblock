import { IWord, WORD_DIFFICULTY } from './model';

export const mockWords: Omit<IWord, 'id' | 'createdAt' | 'reviewCount'>[] = [
  {
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Ephemeral',
    definition: 'Lasting for a very short time; transitory.',
    difficulty: WORD_DIFFICULTY.HARD,
    isLearned: false,
  },
  {
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Mellifluous',
    definition: 'Sweet or musical; pleasant to hear.',
    difficulty: WORD_DIFFICULTY.HARD,
    isLearned: false,
  },
  {
    word: 'Perspicacious',
    definition: 'Having a ready insight into and understanding of things.',
    difficulty: WORD_DIFFICULTY.HARD,
    isLearned: false,
  },
  {
    word: 'Eloquent',
    definition: 'Fluent or persuasive in speaking or writing.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Pragmatic',
    definition: 'Dealing with things sensibly and realistically.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Tenacious',
    definition: 'Tending to keep a firm hold of something; clinging or adhering closely.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Innovative',
    definition: 'Featuring new methods; advanced and original.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Perseverance',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Magnanimous',
    definition: 'Very generous or forgiving, especially toward a rival or someone less powerful.',
    difficulty: WORD_DIFFICULTY.HARD,
    isLearned: false,
  },
  {
    word: 'Diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Perspicuous',
    definition: 'Clearly expressed and easily understood; lucid.',
    difficulty: WORD_DIFFICULTY.HARD,
    isLearned: false,
  },
  {
    word: 'Adaptable',
    definition: 'Able to adjust to new conditions or environments.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Articulate',
    definition: 'Having or showing the ability to speak fluently and coherently.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Benevolent',
    definition: 'Well meaning and kindly; showing charity and goodwill.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
  {
    word: 'Courageous',
    definition: 'Not deterred by danger or pain; brave.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
    difficulty: WORD_DIFFICULTY.EASY,
    isLearned: false,
  },
  {
    word: 'Eloquent',
    definition: 'Fluent or persuasive in speaking or writing.',
    difficulty: WORD_DIFFICULTY.MEDIUM,
    isLearned: false,
  },
];

// Function to populate store with mock data
export const populateWithMockData = (addWord: (word: Omit<IWord, 'id' | 'createdAt' | 'reviewCount'>) => void) => {
  mockWords.forEach(word => {
    addWord(word);
  });
};
