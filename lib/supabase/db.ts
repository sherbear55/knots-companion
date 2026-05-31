'use client';

/**
 * Cloud database functions — used when a user is authenticated.
 * Demo/no-account users fall back to localStorage (progress-store.ts).
 */

import { createClient } from './client';
import { SavedEntry, KnotProgress, MovementProgress } from '@/lib/progress-store';

// ── Auth helper ───────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// ── Journal entries ───────────────────────────────────────────────────────────

export async function saveJournalEntryCloud(entry: SavedEntry): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('journal_entries').insert({
    user_id:       user.id,
    knot_id:       entry.knotId,
    knot_name:     entry.knotName,
    flat_index:    entry.flatIndex,
    type:          entry.type,
    question:      entry.question,
    is_from_book:  entry.isFromBook,
    movement_name: entry.movementName ?? null,
    response:      entry.response,
    created_at:    entry.createdAt,
  });

  return !error;
}

export async function getJournalEntriesCloud(): Promise<SavedEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id:           row.id,
    knotId:       row.knot_id,
    knotName:     row.knot_name,
    flatIndex:    row.flat_index,
    type:         row.type,
    question:     row.question,
    isFromBook:   row.is_from_book,
    movementName: row.movement_name,
    response:     row.response,
    createdAt:    row.created_at,
  }));
}

export async function getJournalCountCloud(): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from('journal_entries')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

// ── Knot progress ─────────────────────────────────────────────────────────────

export async function getKnotProgressCloud(knotId: number): Promise<KnotProgress> {
  const supabase = createClient();
  const { data } = await supabase
    .from('knot_progress')
    .select('*')
    .eq('knot_id', knotId)
    .single();

  if (!data) return { completedTruth: false, usedIndices: [] };
  return {
    completedTruth: data.completed_truth,
    usedIndices:    data.used_indices ?? [],
  };
}

export async function markQuestionUsedCloud(knotId: number, flatIndex: number): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Upsert — create row if first visit to this knot, otherwise update array
  const { data: existing } = await supabase
    .from('knot_progress')
    .select('used_indices')
    .eq('user_id', user.id)
    .eq('knot_id', knotId)
    .single();

  const current: number[] = existing?.used_indices ?? [];
  if (current.includes(flatIndex)) return;

  await supabase.from('knot_progress').upsert({
    user_id:      user.id,
    knot_id:      knotId,
    used_indices: [...current, flatIndex],
    updated_at:   new Date().toISOString(),
  }, { onConflict: 'user_id,knot_id' });
}

export async function markTruthCompletedCloud(knotId: number): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('knot_progress').upsert({
    user_id:         user.id,
    knot_id:         knotId,
    completed_truth: true,
    updated_at:      new Date().toISOString(),
  }, { onConflict: 'user_id,knot_id' });
}

export async function getAllKnotProgressCloud(): Promise<Record<number, KnotProgress>> {
  const supabase = createClient();
  const { data, error } = await supabase.from('knot_progress').select('*');
  if (error || !data) return {};

  const result: Record<number, KnotProgress> = {};
  for (const row of data) {
    result[row.knot_id] = {
      completedTruth: row.completed_truth,
      usedIndices:    row.used_indices ?? [],
    };
  }
  return result;
}

// ── Movement progress ─────────────────────────────────────────────────────────

export async function getMovementProgressCloud(movementName: string): Promise<MovementProgress> {
  const supabase = createClient();
  const { data } = await supabase
    .from('movement_progress')
    .select('*')
    .eq('movement_name', movementName)
    .single();

  if (!data) return { usedQuestionIds: [] };
  return { usedQuestionIds: data.used_question_ids ?? [] };
}

export async function markMovementQuestionUsedCloud(movementName: string, questionId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from('movement_progress')
    .select('used_question_ids')
    .eq('user_id', user.id)
    .eq('movement_name', movementName)
    .single();

  const current: string[] = existing?.used_question_ids ?? [];
  if (current.includes(questionId)) return;

  await supabase.from('movement_progress').upsert({
    user_id:          user.id,
    movement_name:    movementName,
    used_question_ids: [...current, questionId],
    updated_at:       new Date().toISOString(),
  }, { onConflict: 'user_id,movement_name' });
}

export async function getAllMovementProgressCloud(): Promise<Record<string, MovementProgress>> {
  const supabase = createClient();
  const { data, error } = await supabase.from('movement_progress').select('*');
  if (error || !data) return {};

  const result: Record<string, MovementProgress> = {};
  for (const row of data) {
    result[row.movement_name] = { usedQuestionIds: row.used_question_ids ?? [] };
  }
  return result;
}

// ── Overall stats ─────────────────────────────────────────────────────────────

export async function getOverallStatsCloud() {
  const [knotData, movementData] = await Promise.all([
    getAllKnotProgressCloud(),
    getAllMovementProgressCloud(),
  ]);

  const knotIds = Object.keys(knotData).map(Number);
  let totalDone = 0, knotsStarted = 0, knotsFinished = 0;

  for (const id of knotIds) {
    const kp = knotData[id];
    const done = kp.usedIndices.length + (kp.completedTruth ? 1 : 0);
    if (done > 0) knotsStarted++;
    if (kp.usedIndices.length === 21 && kp.completedTruth) knotsFinished++;
    totalDone += done;
  }

  for (const mp of Object.values(movementData)) {
    totalDone += mp.usedQuestionIds.length;
  }

  return { totalDone, knotsStarted, knotsFinished };
}

// ── User profile ──────────────────────────────────────────────────────────────

export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}

export async function getFoundingSeatsTaken(): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase.rpc('get_founding_seats_taken');
  return data ?? 0;
}
