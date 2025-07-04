export interface GameScore {
  correct: number;
  total: number;
  percentage: number;
}

export interface Phoneme {
  id: string;
  sound: string;
  word: string;
  image: string;
  audioUrl?: string;
}

export interface WordPart {
  id: string;
  text: string;
  type: 'syllable' | 'letter';
  order: number;
}

export interface Word {
  id: string;
  text: string;
  parts: WordPart[];
  image: string;
  audioUrl?: string;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  timeLimit: number;
  customPhonemes: Phoneme[];
  customWords: Word[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  notes: string;
  progress: {
    phonemeGame: GameScore[];
    associationGame: GameScore[];
    wordBuildingGame: GameScore[];
  };
}