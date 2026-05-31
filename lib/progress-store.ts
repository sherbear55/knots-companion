'use client';

import { KnotData } from '@/types';

const PROGRESS_KEY = 'knots_question_progress';
const JOURNAL_KEY  = 'knots_journal_entries';
const MOVEMENT_KEY = 'knots_movement_progress';
const TIER_KEY     = 'knots_user_tier';

export type UserTier = 'demo' | 'free' | 'builder';

/** Flat indices that correspond to the 3 "from book" questions per knot */
export const BOOK_QUESTION_INDICES = [0, 7, 14]; // why[0], what[0], where[0]
export const DEMO_SAVE_LIMIT = 3;

export interface KnotProgress {
  completedTruth: boolean;
  usedIndices: number[]; // flat indices 0–20 (0-6=why, 7-13=what, 14-20=where)
}

export interface MovementProgress {
  usedQuestionIds: string[]; // e.g. ['awareness-1', 'awareness-2']
}

export interface SavedEntry {
  id: string;
  knotId: number | null;       // null for movement-level entries
  knotName: string;
  flatIndex: number;
  type: 'truth' | 'why' | 'what' | 'where' | 'movement';
  question: string;
  isFromBook: boolean;
  movementName?: string;
  questionLabel?: string;
  response: string;
  createdAt: string;
}

// ── Tier management ───────────────────────────────────────────────────────────

export function getUserTier(): UserTier {
  if (typeof window === 'undefined') return 'demo';
  return (localStorage.getItem(TIER_KEY) as UserTier) ?? 'demo';
}

export function setUserTier(tier: UserTier) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TIER_KEY, tier);
}

// ── Knot progress ─────────────────────────────────────────────────────────────

export function getAllProgress(): Record<number, KnotProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getKnotProgress(knotId: number): KnotProgress {
  const all = getAllProgress();
  return all[knotId] ?? { completedTruth: false, usedIndices: [] };
}

function saveAllProgress(all: Record<number, KnotProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}

export function markQuestionUsed(knotId: number, flatIndex: number) {
  const all = getAllProgress();
  const kp = all[knotId] ?? { completedTruth: false, usedIndices: [] };
  if (!kp.usedIndices.includes(flatIndex)) kp.usedIndices.push(flatIndex);
  all[knotId] = kp;
  saveAllProgress(all);
}

export function markTruthCompleted(knotId: number) {
  const all = getAllProgress();
  const kp = all[knotId] ?? { completedTruth: false, usedIndices: [] };
  kp.completedTruth = true;
  all[knotId] = kp;
  saveAllProgress(all);
}

// ── Movement progress ─────────────────────────────────────────────────────────

export function getAllMovementProgress(): Record<string, MovementProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MOVEMENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getMovementProgress(movementName: string): MovementProgress {
  const all = getAllMovementProgress();
  return all[movementName] ?? { usedQuestionIds: [] };
}

export function markMovementQuestionUsed(movementName: string, questionId: string) {
  if (typeof window === 'undefined') return;
  const all = getAllMovementProgress();
  const mp = all[movementName] ?? { usedQuestionIds: [] };
  if (!mp.usedQuestionIds.includes(questionId)) mp.usedQuestionIds.push(questionId);
  all[movementName] = mp;
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(all));
}

// ── Journal ───────────────────────────────────────────────────────────────────

export function getJournalEntries(): SavedEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveJournalEntry(entry: SavedEntry) {
  const entries = getJournalEntries();
  entries.unshift(entry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

/** Total number of journal entries saved (used to enforce demo limit) */
export function getDemoSaveCount(): number {
  return getJournalEntries().length;
}

// ── Question helpers ──────────────────────────────────────────────────────────

export interface ResolvedQuestion {
  flatIndex: number;
  type: 'why' | 'what' | 'where';
  question: string;
  isFromBook: boolean; // index 0 of each type = from the book
}

export function getQuestionByFlatIndex(knot: KnotData, flatIndex: number): ResolvedQuestion {
  if (flatIndex < 7) {
    return {
      flatIndex,
      type: 'why',
      question: knot.anchorQuestions.why[flatIndex],
      isFromBook: flatIndex === 0,
    };
  } else if (flatIndex < 14) {
    const i = flatIndex - 7;
    return {
      flatIndex,
      type: 'what',
      question: knot.anchorQuestions.what[i],
      isFromBook: i === 0,
    };
  } else {
    const i = flatIndex - 14;
    return {
      flatIndex,
      type: 'where',
      question: knot.anchorQuestions.where[i],
      isFromBook: i === 0,
    };
  }
}

export function getRandomUnusedQuestion(
  knotId: number,
  knot: KnotData,
  /** If true, only pick from the 3 book questions (free tier) */
  bookOnly = false
): ResolvedQuestion | null {
  const { usedIndices } = getKnotProgress(knotId);
  const pool = bookOnly ? BOOK_QUESTION_INDICES : Array.from({ length: 21 }, (_, i) => i);
  const available = pool.filter((i) => !usedIndices.includes(i));
  if (available.length === 0) return null;
  const pick = available[Math.floor(Math.random() * available.length)];
  return getQuestionByFlatIndex(knot, pick);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getOverallStats() {
  const all = getAllProgress();
  const movementAll = getAllMovementProgress();
  const knotIds = Object.keys(all).map(Number);
  let totalDone = 0;
  let knotsStarted = 0;
  let knotsFinished = 0;

  for (const id of knotIds) {
    const kp = all[id];
    const done = kp.usedIndices.length + (kp.completedTruth ? 1 : 0);
    if (done > 0) knotsStarted++;
    if (kp.usedIndices.length === 21 && kp.completedTruth) knotsFinished++;
    totalDone += done;
  }

  // Add movement reflection completions
  for (const mp of Object.values(movementAll)) {
    totalDone += mp.usedQuestionIds.length;
  }

  return { totalDone, knotsStarted, knotsFinished };
}
