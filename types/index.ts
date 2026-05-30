export interface AnchorQuestions {
  why: string[];
  what: string[];
  where: string[];
}

export interface KnotData {
  id: number;
  name: string;
  fullName: string;
  theme: string;
  movement: string;
  movementNumber: number;
  knotsTruth: string;
  openingQuote?: string;
  anchorQuestions: AnchorQuestions;
}

export type DayType = 'truth' | 'why' | 'what' | 'where';

export interface DayContent {
  day: number;
  type: DayType;
  question: string;
  knotId: number;
  knotName: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  knotId: number;
  day: number;
  dayType: DayType;
  question: string;
  response: string;
  createdAt: string;
}

export interface UserProgress {
  currentKnotId: number;
  currentDay: number;
  streak: number;
  totalDaysCompleted: number;
  completedKnots: number[];
  lastCompletedDate?: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  progress: UserProgress;
  journalEntries: JournalEntry[];
}
