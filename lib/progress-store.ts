'use client';

import { KnotData } from '@/types';

const PROGRESS_KEY = 'knots_question_progress';
const JOURNAL_KEY = 'knots_journal_entries';

export interface KnotProgress {
  completedTruth: boolean;
  usedIndices: number[]; // flat indices 0–20 (0-6=why, 7-13=what, 14-20=where)
}

export interface SavedEntry {
  id: string;
  knotId: number;
  knotName: string;
  flatIndex: number;
  type: 'truth' | 'why' | 'what' | 'where';
  question: string;
  isFromBook: boolean;
  response: string;
  createdAt: string;
}

// ── Reading ──────────────────────────────────────────────────────────────────

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

export function getJournalEntries(): SavedEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Writing ──────────────────────────────────────────────────────────────────

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

export function saveJournalEntry(entry: SavedEntry) {
  const entries = getJournalEntries();
  entries.unshift(entry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
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

export function getRandomUnusedQuestion(knotId: number, knot: KnotData): ResolvedQuestion | null {
  const { usedIndices } = getKnotProgress(knotId);
  const available = Array.from({ length: 21 }, (_, i) => i).filter((i) => !usedIndices.includes(i));
  if (available.length === 0) return null;
  const pick = available[Math.floor(Math.random() * available.length)];
  return getQuestionByFlatIndex(knot, pick);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getOverallStats() {
  const all = getAllProgress();
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

  return { totalDone, knotsStarted, knotsFinished };
}
