export enum WORD_DIFFICULTY {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
};

export interface WordData {
  word: string;
  definition: string;
  difficulty: WORD_DIFFICULTY;
  isLearned: boolean;
};

export interface WordDifficulties {
  value: WORD_DIFFICULTY;
  label: string;
  color: string;
}
