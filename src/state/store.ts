// localStorage-backed app state for the prototype.
// One global store, accessed via useAppState().

import { useEffect, useState, useSyncExternalStore } from "react";
import { BOOKS, NT_ORDER, bookById } from "@/data/books";

export interface BookProgress {
  // chapters completed in the CURRENT (in-progress) read-through
  inProgressChapters: number[];
  // number of full read-throughs completed (0, 1, 2, 3+)
  readThroughs: number;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  chapter: number;
  durationSec: number;
  completedAt: number; // epoch ms
  xpEarned: number;
}

export interface AppState {
  onboarded: boolean;
  user: {
    name: string;
    email: string;
    translation: string;
    dailyGoal: number; // chapters per day
    reminderTime: string; // "07:00"
    pathBookId: string; // currently reading book
    progressView: "simple" | "detailed";
  };
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null; // YYYY-MM-DD
  // per-day chapter counts for heatmap, keyed YYYY-MM-DD
  dailyCounts: Record<string, number>;
  bookProgress: Record<string, BookProgress>;
  sessions: ReadingSession[];
  // celebration unlocks
  silverGoldUnlocked: boolean;
  silverGoldAcknowledged: boolean;
  // pending celebration to show after a session
  pendingCelebration: null | {
    bookId: string;
    tier: "green" | "silver" | "gold";
    chapters: number;
    days: number;
  };
  pendingRankUp: null | { rankIndex: number };
}

const STORAGE_KEY = "brt:state:v1";

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000,
  );
}

function buildSyntheticHistory(): {
  dailyCounts: Record<string, number>;
  sessions: ReadingSession[];
} {
  // 90 days of synthetic data with mostly 2-chapter days, a few skips,
  // a few heavier days. Current streak = 23 (last 23 days unbroken).
  const dailyCounts: Record<string, number> = {};
  const sessions: ReadingSession[] = [];
  const today = new Date();
  // seed: chapters of mark consumed up to ch 14 across recent days
  let markChapter = 0;

  for (let offset = 89; offset >= 0; offset--) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = todayKey(d);

    // last 23 days unbroken
    const inStreak = offset < 23;
    // before that, scattered skips
    const skip = !inStreak && (offset === 24 || offset === 30 || offset === 38 || offset === 47 || offset === 60 || offset === 73);
    if (skip) continue;

    // Heavy days
    let chapters = 2;
    if (offset === 12 || offset === 45 || offset === 70) chapters = 5;
    else if (offset === 3 || offset === 33) chapters = 4;
    else if (offset === 18) chapters = 1;

    dailyCounts[key] = chapters;
    for (let i = 0; i < chapters; i++) {
      markChapter++;
      sessions.push({
        id: `s-${key}-${i}`,
        bookId: "mrk",
        chapter: ((markChapter - 1) % 16) + 1,
        durationSec: 600 + Math.floor(Math.random() * 500),
        completedAt: d.getTime(),
        xpEarned: 10,
      });
    }
  }

  return { dailyCounts, sessions };
}

function defaultState(): AppState {
  const { dailyCounts, sessions } = buildSyntheticHistory();
  // 14 chapters into Mark
  const inProgress = Array.from({ length: 14 }, (_, i) => i + 1);
  return {
    onboarded: false,
    user: {
      name: "Friend",
      email: "you@example.com",
      translation: "ESV",
      dailyGoal: 2,
      reminderTime: "07:00",
      pathBookId: "mrk",
      progressView: "simple",
    },
    xp: 1840,
    currentStreak: 23,
    longestStreak: 47,
    lastReadDate: todayKey(new Date(Date.now() - 86400000)), // yesterday so today CTA active
    dailyCounts,
    bookProgress: {
      // Three completed books (Philippians at gold, James at silver, Jude at green)
      // demo the tier system. Plus 14 chapters into Mark.
      mrk: { inProgressChapters: inProgress, readThroughs: 0 },
      php: { inProgressChapters: [], readThroughs: 3 },
      jas: { inProgressChapters: [], readThroughs: 2 },
      jud: { inProgressChapters: [], readThroughs: 1 },
    },
    sessions,
    silverGoldUnlocked: false,
    silverGoldAcknowledged: false,
    pendingCelebration: null,
    pendingRankUp: null,
  };
}

let memoryState: AppState | null = null;
const listeners = new Set<() => void>();

function migrate(state: AppState): AppState {
  // Forward-compatibility shim: merge any new defaults onto stored state.
  const def = defaultState();
  const merged: AppState = {
    ...def,
    ...state,
    user: { ...def.user, ...state.user },
  };
  // Ensure new boolean field exists.
  if (typeof merged.silverGoldAcknowledged !== "boolean") {
    merged.silverGoldAcknowledged = false;
  }
  return merged;
}

function load(): AppState {
  if (memoryState) return memoryState;
  if (typeof window === "undefined") {
    memoryState = defaultState();
    return memoryState;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryState = migrate(JSON.parse(raw) as AppState);
      return memoryState;
    }
  } catch {
    // fall through
  }
  memoryState = defaultState();
  save();
  return memoryState;
}

function save() {
  if (typeof window === "undefined" || !memoryState) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
}

function emit() {
  listeners.forEach((l) => l());
}

export function setState(updater: (s: AppState) => AppState | void) {
  const s = load();
  const next = updater(s);
  memoryState = next ?? s;
  save();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): AppState {
  return load();
}

function getServerSnapshot(): AppState {
  return defaultState();
}

export function useAppState(): AppState {
  // Hydration-safe: useSyncExternalStore avoids mismatches.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Hook that ensures we only render real client state after mount.
export function useClientReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

// ---- Domain helpers ----

import { RANKS, getRankIndex } from "@/data/ranks";

export function nextChapterFor(state: AppState): { bookId: string; chapter: number } {
  const bp = state.bookProgress[state.user.pathBookId];
  const next = (bp?.inProgressChapters.length ?? 0) + 1;
  const book = bookById(state.user.pathBookId)!;
  if (next <= book.chapters) {
    return { bookId: state.user.pathBookId, chapter: next };
  }
  // book complete — advance to next NT book
  const idx = NT_ORDER.indexOf(state.user.pathBookId);
  const nextBookId = NT_ORDER[(idx + 1) % NT_ORDER.length];
  return { bookId: nextBookId, chapter: 1 };
}

export function chaptersReadToday(state: AppState): number {
  return state.dailyCounts[todayKey()] ?? 0;
}

export interface SessionResult {
  bookCompleted: null | { bookId: string; tier: "green" | "silver" | "gold"; chapters: number; days: number };
  rankUp: null | { rankIndex: number };
  streak: number;
  xpEarned: number;
}

export function recordSession(bookId: string, chapter: number, durationSec: number): SessionResult {
  const today = todayKey();
  let result: SessionResult = { bookCompleted: null, rankUp: null, streak: 0, xpEarned: 10 };

  setState((s) => {
    const before = s.xp;
    const beforeRank = getRankIndex(before);

    // Update book progress
    const bp = s.bookProgress[bookId] ?? { inProgressChapters: [], readThroughs: 0 };
    const inProg = Array.from(new Set([...bp.inProgressChapters, chapter])).sort((a, b) => a - b);
    const book = bookById(bookId)!;
    const completedBook = inProg.length >= book.chapters;

    let xpEarned = 10;
    let bookCelebration: SessionResult["bookCompleted"] = null;
    let newReadThroughs = bp.readThroughs;
    let newInProg = inProg;

    if (completedBook) {
      newReadThroughs = bp.readThroughs + 1;
      newInProg = [];
      const tier: "green" | "silver" | "gold" =
        newReadThroughs === 1 ? "green" : newReadThroughs === 2 ? "silver" : "gold";
      const bonus = tier === "green" ? 50 : tier === "silver" ? 25 : 15;
      xpEarned += bonus;
      // estimate days (not crucial in prototype)
      bookCelebration = { bookId, tier, chapters: book.chapters, days: Math.max(1, Math.ceil(book.chapters / Math.max(1, s.user.dailyGoal))) };
    }

    s.bookProgress = { ...s.bookProgress, [bookId]: { inProgressChapters: newInProg, readThroughs: newReadThroughs } };

    // Streak
    let streak = s.currentStreak;
    if (s.lastReadDate !== today) {
      if (s.lastReadDate && daysBetween(s.lastReadDate, today) === 1) streak += 1;
      else if (!s.lastReadDate || daysBetween(s.lastReadDate, today) > 1) streak = 1;
      xpEarned += 5; // small daily streak bonus
    }
    s.currentStreak = streak;
    s.longestStreak = Math.max(s.longestStreak, streak);
    s.lastReadDate = today;

    // Daily counts
    s.dailyCounts = { ...s.dailyCounts, [today]: (s.dailyCounts[today] ?? 0) + 1 };

    // XP
    s.xp = before + xpEarned;
    const afterRank = getRankIndex(s.xp);

    // Sessions list
    s.sessions = [
      {
        id: `s-${Date.now()}`,
        bookId,
        chapter,
        durationSec,
        completedAt: Date.now(),
        xpEarned,
      },
      ...s.sessions,
    ];

    // Half-bible silver/gold unlock
    const totalCompleted = Object.values(s.bookProgress).filter((b) => b.readThroughs >= 1).length;
    if (!s.silverGoldUnlocked && totalCompleted >= 33) {
      s.silverGoldUnlocked = true;
    }

    if (bookCelebration) s.pendingCelebration = bookCelebration;
    if (afterRank > beforeRank) s.pendingRankUp = { rankIndex: afterRank };

    result = {
      bookCompleted: bookCelebration,
      rankUp: afterRank > beforeRank ? { rankIndex: afterRank } : null,
      streak,
      xpEarned,
    };
    return s;
  });

  return result;
}

export function clearPendingCelebration() {
  setState((s) => {
    s.pendingCelebration = null;
    return s;
  });
}

export function clearPendingRankUp() {
  setState((s) => {
    s.pendingRankUp = null;
    return s;
  });
}

export function completeOnboarding(updates: Partial<AppState["user"]>) {
  setState((s) => {
    s.onboarded = true;
    s.user = { ...s.user, ...updates };
    return s;
  });
}

export function resetAll() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  memoryState = null;
  emit();
}

export function totalChaptersRead(state: AppState): number {
  return Object.values(state.dailyCounts).reduce((a, b) => a + b, 0);
}

export function booksCompleted(state: AppState): number {
  return Object.values(state.bookProgress).filter((b) => b.readThroughs >= 1).length;
}

export function bookTier(state: AppState, bookId: string): "none" | "in_progress" | "green" | "silver" | "gold" {
  const bp = state.bookProgress[bookId];
  if (!bp || (bp.readThroughs === 0 && bp.inProgressChapters.length === 0)) return "none";
  if (bp.readThroughs === 0) return "in_progress";
  if (bp.readThroughs === 1) return "green";
  if (bp.readThroughs === 2) return "silver";
  return "gold";
}

// ---- Settings setters ----

export function setProgressView(view: "simple" | "detailed") {
  setState((s) => {
    s.user = { ...s.user, progressView: view };
    return s;
  });
}

export function setDailyGoal(goal: number) {
  setState((s) => {
    s.user = { ...s.user, dailyGoal: Math.max(1, Math.min(20, Math.round(goal))) };
    return s;
  });
}

export function setReminder(time: string) {
  setState((s) => {
    s.user = { ...s.user, reminderTime: time };
    return s;
  });
}

export function setTranslation(translation: string) {
  setState((s) => {
    s.user = { ...s.user, translation };
    return s;
  });
}

export function setUserName(name: string) {
  setState((s) => {
    s.user = { ...s.user, name };
    return s;
  });
}

export function setUserEmail(email: string) {
  setState((s) => {
    s.user = { ...s.user, email };
    return s;
  });
}

export function acknowledgeSilverGold() {
  setState((s) => {
    s.silverGoldAcknowledged = true;
    return s;
  });
}

// ---- Analytics helpers ----

import { avgVersesPerChapter } from "@/data/verses";

export function firstSessionDate(state: AppState): number | null {
  if (state.sessions.length === 0) return null;
  return Math.min(...state.sessions.map((s) => s.completedAt));
}

/** Returns the daily chapter counts for the last `n` days (oldest → newest). */
export function lastNDayCounts(state: AppState, n: number): { date: string; count: number }[] {
  const out: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = todayKey(d);
    out.push({ date: k, count: state.dailyCounts[k] ?? 0 });
  }
  return out;
}

export function avgStartTimeLabel(state: AppState): string {
  const sessions = state.sessions;
  if (sessions.length === 0) return "—";
  let totalMin = 0;
  for (const s of sessions) {
    const start = new Date(s.completedAt - s.durationSec * 1000);
    totalMin += start.getHours() * 60 + start.getMinutes();
  }
  const avg = Math.round(totalMin / sessions.length);
  const h = Math.floor(avg / 60);
  const m = avg % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function avgSessionMinutes(state: AppState): number {
  if (state.sessions.length === 0) return 0;
  const totalSec = state.sessions.reduce((a, s) => a + s.durationSec, 0);
  return Math.round(totalSec / state.sessions.length / 60);
}

export function longestSessionMinutes(state: AppState): number {
  if (state.sessions.length === 0) return 0;
  return Math.max(...state.sessions.map((s) => Math.round(s.durationSec / 60)));
}

export function totalHoursRead(state: AppState): number {
  const totalSec = state.sessions.reduce((a, s) => a + s.durationSec, 0);
  return totalSec / 3600;
}

export function versesRead(state: AppState): number {
  // Count sessions per chapter; multiply by avg verse count.
  let total = 0;
  for (const s of state.sessions) {
    total += avgVersesPerChapter(s.bookId);
  }
  return total;
}

export function totalReadingDays(state: AppState): number {
  return Object.keys(state.dailyCounts).filter((k) => (state.dailyCounts[k] ?? 0) > 0).length;
}

export { todayKey, daysBetween };

