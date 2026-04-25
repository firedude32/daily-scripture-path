// Supabase-backed app state. Same public surface as the prototype's
// localStorage store so existing components keep working unchanged. The
// in-memory state is hydrated from Supabase on auth, and every mutation is
// mirrored back to the database so reads remain instant via useSyncExternalStore.

import { useEffect, useState, useSyncExternalStore } from "react";
import { BOOKS, NT_ORDER, bookById } from "@/data/books";
import { supabase } from "@/integrations/supabase/client";

export interface BookProgress {
  inProgressChapters: number[];
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
  hydrated: boolean;
  userId: string | null;
  onboarded: boolean;
  user: {
    name: string;
    email: string;
    translation: string;
    dailyGoal: number;
    reminderTime: string;
    pathBookId: string;
    progressView: "simple" | "detailed";
  };
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null; // YYYY-MM-DD
  dailyCounts: Record<string, number>;
  bookProgress: Record<string, BookProgress>;
  sessions: ReadingSession[];
  silverGoldUnlocked: boolean;
  silverGoldAcknowledged: boolean;
  pendingCelebration: null | {
    bookId: string;
    tier: "green" | "silver" | "gold";
    chapters: number;
    days: number;
  };
  pendingRankUp: null | { rankIndex: number };
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000,
  );
}

function emptyState(): AppState {
  return {
    hydrated: false,
    userId: null,
    onboarded: false,
    user: {
      name: "Friend",
      email: "",
      translation: "ESV",
      dailyGoal: 2,
      reminderTime: "07:00",
      pathBookId: "mrk",
      progressView: "simple",
    },
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: null,
    dailyCounts: {},
    bookProgress: {},
    sessions: [],
    silverGoldUnlocked: false,
    silverGoldAcknowledged: false,
    pendingCelebration: null,
    pendingRankUp: null,
  };
}

let memoryState: AppState = emptyState();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setState(updater: (s: AppState) => AppState | void) {
  const next = updater(memoryState);
  memoryState = next ?? memoryState;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): AppState {
  return memoryState;
}

function getServerSnapshot(): AppState {
  return emptyState();
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useClientReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

// ---------- Hydration ----------

function buildDailyCounts(sessions: ReadingSession[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of sessions) {
    const k = todayKey(new Date(s.completedAt));
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

let hydratingFor: string | null = null;

export async function hydrateFromSupabase(): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) {
    memoryState = { ...emptyState(), hydrated: true };
    emit();
    return;
  }
  const userId = session.user.id;
  if (hydratingFor === userId && memoryState.hydrated) return;
  hydratingFor = userId;

  const [profileRes, bpRes, sessRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("book_progress").select("*").eq("user_id", userId),
    supabase
      .from("reading_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1000),
  ]);

  const profile = profileRes.data;
  const bookProgress: Record<string, BookProgress> = {};
  for (const row of bpRes.data ?? []) {
    bookProgress[row.book_id] = {
      inProgressChapters: row.in_progress_chapters ?? [],
      readThroughs: row.read_throughs ?? 0,
    };
  }
  const sessions: ReadingSession[] = (sessRes.data ?? []).map((r) => ({
    id: r.id,
    bookId: r.book_id,
    chapter: r.chapter,
    durationSec: r.duration_sec ?? 0,
    completedAt: new Date(r.completed_at).getTime(),
    xpEarned: r.xp_earned ?? 10,
  }));

  memoryState = {
    hydrated: true,
    userId,
    onboarded: profile?.onboarded ?? false,
    user: {
      name: profile?.name ?? session.user.email?.split("@")[0] ?? "Friend",
      email: profile?.email ?? session.user.email ?? "",
      translation: profile?.translation ?? "ESV",
      dailyGoal: profile?.daily_goal ?? 2,
      reminderTime: profile?.reminder_time ?? "07:00",
      pathBookId: profile?.path_book_id ?? "mrk",
      progressView: (profile?.progress_view as "simple" | "detailed") ?? "simple",
    },
    xp: profile?.xp ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    lastReadDate: profile?.last_read_date ?? null,
    dailyCounts: buildDailyCounts(sessions),
    bookProgress,
    sessions,
    silverGoldUnlocked: profile?.silver_gold_unlocked ?? false,
    silverGoldAcknowledged: profile?.silver_gold_acknowledged ?? false,
    pendingCelebration: null,
    pendingRankUp: null,
  };
  emit();
}

export function useHydrateStore() {
  useEffect(() => {
    hydrateFromSupabase();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      hydratingFor = null;
      hydrateFromSupabase();
    });
    return () => sub.subscription.unsubscribe();
  }, []);
}

// ---------- Persistence helpers ----------

type ProfilePatch = Partial<{
  name: string;
  email: string;
  translation: string;
  daily_goal: number;
  reminder_time: string;
  path_book_id: string;
  progress_view: string;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_read_date: string | null;
  silver_gold_unlocked: boolean;
  silver_gold_acknowledged: boolean;
  onboarded: boolean;
}>;

async function persistProfile(patch: ProfilePatch) {
  const userId = memoryState.userId;
  if (!userId) return;
  await supabase.from("profiles").update(patch).eq("id", userId);
}

async function persistBookProgress(bookId: string, bp: BookProgress) {
  const userId = memoryState.userId;
  if (!userId) return;
  await supabase.from("book_progress").upsert(
    {
      user_id: userId,
      book_id: bookId,
      in_progress_chapters: bp.inProgressChapters,
      read_throughs: bp.readThroughs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,book_id" },
  );
}

// ---------- Domain helpers ----------

import { RANKS, getRankIndex } from "@/data/ranks";

export function nextChapterFor(state: AppState): { bookId: string; chapter: number } {
  const bp = state.bookProgress[state.user.pathBookId];
  const next = (bp?.inProgressChapters.length ?? 0) + 1;
  const book = bookById(state.user.pathBookId)!;
  if (next <= book.chapters) {
    return { bookId: state.user.pathBookId, chapter: next };
  }
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
  const userId = memoryState.userId;

  let nextBp: BookProgress | null = null;
  let profilePatch: ProfilePatch = {};
  let sessionRow: ReadingSession | null = null;

  setState((s) => {
    const before = s.xp;
    const beforeRank = getRankIndex(before);

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
      bookCelebration = { bookId, tier, chapters: book.chapters, days: Math.max(1, Math.ceil(book.chapters / Math.max(1, s.user.dailyGoal))) };
    }

    nextBp = { inProgressChapters: newInProg, readThroughs: newReadThroughs };
    s.bookProgress = { ...s.bookProgress, [bookId]: nextBp };

    let streak = s.currentStreak;
    if (s.lastReadDate !== today) {
      if (s.lastReadDate && daysBetween(s.lastReadDate, today) === 1) streak += 1;
      else if (!s.lastReadDate || daysBetween(s.lastReadDate, today) > 1) streak = 1;
      xpEarned += 5;
    }
    s.currentStreak = streak;
    s.longestStreak = Math.max(s.longestStreak, streak);
    s.lastReadDate = today;
    s.dailyCounts = { ...s.dailyCounts, [today]: (s.dailyCounts[today] ?? 0) + 1 };
    s.xp = before + xpEarned;
    const afterRank = getRankIndex(s.xp);

    sessionRow = {
      id: `s-${Date.now()}`,
      bookId,
      chapter,
      durationSec,
      completedAt: Date.now(),
      xpEarned,
    };
    s.sessions = [sessionRow, ...s.sessions];

    const totalCompleted = Object.values(s.bookProgress).filter((b) => b.readThroughs >= 1).length;
    if (!s.silverGoldUnlocked && totalCompleted >= 33) {
      s.silverGoldUnlocked = true;
    }

    if (bookCelebration) s.pendingCelebration = bookCelebration;
    if (afterRank > beforeRank) s.pendingRankUp = { rankIndex: afterRank };

    profilePatch = {
      xp: s.xp,
      current_streak: s.currentStreak,
      longest_streak: s.longestStreak,
      last_read_date: s.lastReadDate,
      silver_gold_unlocked: s.silverGoldUnlocked,
    };

    result = {
      bookCompleted: bookCelebration,
      rankUp: afterRank > beforeRank ? { rankIndex: afterRank } : null,
      streak,
      xpEarned,
    };
    return s;
  });

  // Fire-and-forget Supabase writes
  if (userId && sessionRow && nextBp) {
    const sr = sessionRow;
    const np = nextBp;
    void (async () => {
      const { data: inserted } = await supabase
        .from("reading_sessions")
        .insert({
          user_id: userId,
          book_id: bookId,
          chapter,
          duration_sec: sr.durationSec,
          xp_earned: sr.xpEarned,
        })
        .select("id")
        .single();
      if (inserted?.id) {
        // Replace temp id with real id
        setState((s) => {
          s.sessions = s.sessions.map((x) => (x.id === sr.id ? { ...x, id: inserted.id } : x));
          return s;
        });
      }
      await persistBookProgress(bookId, np);
      await persistProfile(profilePatch);
    })();
  }

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
  void persistProfile({
    onboarded: true,
    name: updates.name,
    translation: updates.translation,
    daily_goal: updates.dailyGoal,
    reminder_time: updates.reminderTime,
    path_book_id: updates.pathBookId,
  });
}

export function resetAll() {
  // No-op kept for backwards compatibility. Sign-out is handled via supabase.auth.signOut().
  memoryState = { ...emptyState(), hydrated: true };
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
  setState((s) => { s.user = { ...s.user, progressView: view }; return s; });
  void persistProfile({ progress_view: view });
}

export function setDailyGoal(goal: number) {
  const clamped = Math.max(1, Math.min(20, Math.round(goal)));
  setState((s) => { s.user = { ...s.user, dailyGoal: clamped }; return s; });
  void persistProfile({ daily_goal: clamped });
}

export function setReminder(time: string) {
  setState((s) => { s.user = { ...s.user, reminderTime: time }; return s; });
  void persistProfile({ reminder_time: time });
}

export function setTranslation(translation: string) {
  setState((s) => { s.user = { ...s.user, translation }; return s; });
  void persistProfile({ translation });
}

export function setUserName(name: string) {
  setState((s) => { s.user = { ...s.user, name }; return s; });
  void persistProfile({ name });
}

export function setUserEmail(email: string) {
  setState((s) => { s.user = { ...s.user, email }; return s; });
  void persistProfile({ email });
}

export function acknowledgeSilverGold() {
  setState((s) => { s.silverGoldAcknowledged = true; return s; });
  void persistProfile({ silver_gold_acknowledged: true });
}

// ---- Analytics helpers ----

import { avgVersesPerChapter } from "@/data/verses";

export function firstSessionDate(state: AppState): number | null {
  if (state.sessions.length === 0) return null;
  return Math.min(...state.sessions.map((s) => s.completedAt));
}

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
