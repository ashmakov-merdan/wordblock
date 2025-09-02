export interface IStudySession {
  id: string;
  startTime: number;
  endTime?: number;
  wordsStudied: string[];
  wordsLearned: string[];
  duration: number;
};
