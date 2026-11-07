export interface Student {
  id: string;
  name: string;
  avatarId?: string;
  scoreToday?: number;
}

export interface CharacterInfo {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  primaryPath: string;
  secondaryPath: string;
  fallbackDataUri: string;
  color: string;
  borderColor: string;
}

export interface WordItem {
  id: string;
  word: string;
  emoji: string;
  hint: string;
  missingIndex: 0 | 1; // 0 for first syllable, 1 for second syllable
  targetChar: string;
  givenChar: string;
  distractors: string[];
}

export interface SwimmingFish {
  id: string;
  char: string;
  isTarget: boolean;
  x: number; // percentage 5% to 85%
  y: number; // percentage 15% to 85%
  speed: number;
  direction: 1 | -1; // 1 = right, -1 = left
  color: string;
  size: number;
  caught: boolean;
  wobbling: boolean;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  score: number;
  avatarId: string;
  avatarImg: string;
  date: string;
}

export interface GameSession {
  studentName: string;
  avatarId: string;
  avatarImg: string;
}

export type ScreenState = 'SELECTION' | 'PLAYING' | 'RESULT';
