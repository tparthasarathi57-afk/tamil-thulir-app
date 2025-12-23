export interface TamilLetter {
  char: string;
  transliteration: string;
  example?: string;
  color: string;
}

export interface SampleWord {
  word: string;
  transliteration: string;
  meaning: string;
  color: string;
}

export enum AppMode {
  HOME = 'HOME',
  LEARN_VOWELS = 'LEARN_VOWELS',
  LEARN_CONSONANTS = 'LEARN_CONSONANTS',
  SAMPLES = 'SAMPLES',
  QUIZ = 'QUIZ',
  DIAGNOSTICS = 'DIAGNOSTICS'
}

export interface QuizState {
  currentQuestion: TamilLetter | null;
  options: TamilLetter[];
  score: number;
  totalQuestions: number;
  isCorrect: boolean | null;
}

export interface TestResult {
  id: string;
  name: string;
  category: 'vowel' | 'consonant' | 'sample';
  status: 'pending' | 'running' | 'pass' | 'fail';
  error?: string;
}