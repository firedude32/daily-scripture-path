// Lectio — CSV export. Two files: per-session log and aggregate summary.

import type { AppState } from "@/state/store";
import { bookById } from "@/data/books";
import { getRank, RANKS } from "@/data/ranks";

function csvEscape(v: string | number): string {
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function fmtTime(ms: number): string {
  return new Date(ms).toISOString().slice(11, 19);
}

export function exportSessionsCsv(state: AppState) {
  // Walk sessions in chronological order to reconstruct streak_at_time
  // and rank_at_time without mutating the store.
  const ordered = [...state.sessions].sort((a, b) => a.completedAt - b.completedAt);
  let xpRunning = 0;
  let lastDate: string | null = null;
  let streak = 0;

  const header = [
    "date",
    "started_at",
    "completed_at",
    "duration_minutes",
    "book",
    "chapter",
    "translation",
    "quiz_passed",
    "quiz_attempts",
    "xp_earned",
    "streak_at_time",
    "rank_at_time",
  ];

  const rows: string[] = [header.join(",")];

  for (const s of ordered) {
    const startedMs = s.completedAt - s.durationSec * 1000;
    const date = fmtDate(s.completedAt);

    if (lastDate !== date) {
      if (lastDate) {
        const diff = Math.round(
          (new Date(date).getTime() - new Date(lastDate).getTime()) / 86400000,
        );
        streak = diff === 1 ? streak + 1 : 1;
      } else {
        streak = 1;
      }
      lastDate = date;
    }

    xpRunning += s.xpEarned;
    const rankAtTime = getRank(xpRunning).name;
    const book = bookById(s.bookId);

    const row = [
      date,
      fmtTime(startedMs),
      fmtTime(s.completedAt),
      (s.durationSec / 60).toFixed(2),
      book?.name ?? s.bookId,
      s.chapter,
      state.user.translation,
      "true",
      "1",
      s.xpEarned,
      streak,
      rankAtTime,
    ].map(csvEscape);

    rows.push(row.join(","));
  }

  downloadBlob(rows.join("\n"), "lectio-sessions.csv");
}

export function exportSummaryCsv(state: AppState) {
  const totalChapters = Object.values(state.dailyCounts).reduce((a, b) => a + b, 0);
  const totalSeconds = state.sessions.reduce((a, s) => a + s.durationSec, 0);
  const totalHours = (totalSeconds / 3600).toFixed(2);

  const tierCounts = { green: 0, silver: 0, gold: 0 };
  for (const bp of Object.values(state.bookProgress)) {
    if (bp.readThroughs >= 3) tierCounts.gold += 1;
    else if (bp.readThroughs === 2) tierCounts.silver += 1;
    else if (bp.readThroughs === 1) tierCounts.green += 1;
  }

  const rank = getRank(state.xp).name;
  const rows = [
    ["metric", "value"].join(","),
    ["total_chapters", totalChapters].join(","),
    ["total_hours", totalHours].join(","),
    ["books_completed_total", tierCounts.green + tierCounts.silver + tierCounts.gold].join(","),
    ["books_completed_green", tierCounts.green].join(","),
    ["books_completed_silver", tierCounts.silver].join(","),
    ["books_completed_gold", tierCounts.gold].join(","),
    ["current_streak", state.currentStreak].join(","),
    ["longest_streak", state.longestStreak].join(","),
    ["current_rank", csvEscape(rank)].join(","),
    ["total_xp", state.xp].join(","),
    [
      "rank_ladder",
      csvEscape(RANKS.map((r) => `${r.name}@${r.xp}`).join("; ")),
    ].join(","),
  ];

  downloadBlob(rows.join("\n"), "lectio-summary.csv");
}

export function exportAll(state: AppState) {
  exportSessionsCsv(state);
  // small delay so the browser fires both downloads
  setTimeout(() => exportSummaryCsv(state), 250);
}
