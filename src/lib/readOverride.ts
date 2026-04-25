// Lightweight session-scoped override for the next reading session.
// When set, the Read screen reads this chapter instead of the path's auto-pick.
// Cleared automatically when consumed (on session record / cancel) or manually.

const KEY = "brt:readOverride";

export interface ReadOverride {
  bookId: string;
  chapter: number;
}

export function setReadOverride(bookId: string, chapter: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ bookId, chapter }));
  } catch {
    /* ignore */
  }
}

export function getReadOverride(): ReadOverride | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReadOverride;
    if (!parsed?.bookId || typeof parsed.chapter !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearReadOverride() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
