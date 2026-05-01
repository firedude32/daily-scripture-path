import type { AppState } from "@/state/store";
import { BOOKS, bookById } from "@/data/books";

export const GOSPEL_IDS = ["mat", "mrk", "luk", "jhn"];
export const NT_IDS = BOOKS.filter((b) => b.testament === "NT").map((b) => b.id);

/**
 * Chapters left to read across the given books on a first read-through.
 * Books already completed once contribute zero (re-reads aren't counted).
 */
export function chaptersRemainingIn(state: AppState, bookIds: string[]): number {
  let remaining = 0;
  for (const id of bookIds) {
    const book = bookById(id);
    if (!book) continue;
    const bp = state.bookProgress[id];
    if (!bp || bp.readThroughs === 0) {
      remaining += book.chapters - (bp?.inProgressChapters.length ?? 0);
    }
  }
  return Math.max(0, remaining);
}

/**
 * Average chapters per day across the last `days` window. Counts rest days
 * as zeros so the pace stays honest. Returns 0 when there's no history.
 */
export function recentChaptersPerDay(state: AppState, days = 14): number {
  const today = new Date();
  let total = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    total += state.dailyCounts[k] ?? 0;
  }
  if (total === 0) return 0;
  return total / days;
}

/** Effective per-day pace, falling back to the user's stated daily goal. */
export function effectivePace(state: AppState): number {
  const pace = recentChaptersPerDay(state, 14);
  return pace > 0 ? pace : Math.max(1, state.user.dailyGoal);
}

/** Days to finish the given chapter count at the user's current pace. */
export function daysToFinish(state: AppState, chapters: number): number {
  if (chapters <= 0) return 0;
  return Math.ceil(chapters / effectivePace(state));
}
