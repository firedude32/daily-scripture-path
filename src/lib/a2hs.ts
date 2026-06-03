// Gating + beforeinstallprompt capture for the Add-to-Home-Screen flow.
import { isStandalone } from "./platform";

const STORAGE_KEY = "lectio.a2hs.v1";
const MAX_SHOWS = 3;

interface State {
  shownCount: number;
  lastShownDate: string | null; // YYYY-MM-DD
  dismissed: boolean;
  installedDetected: boolean;
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function read(): State {
  if (typeof window === "undefined") {
    return { shownCount: 0, lastShownDate: null, dismissed: false, installedDetected: false };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { shownCount: 0, lastShownDate: null, dismissed: false, installedDetected: false };
    return { shownCount: 0, lastShownDate: null, dismissed: false, installedDetected: false, ...JSON.parse(raw) };
  } catch {
    return { shownCount: 0, lastShownDate: null, dismissed: false, installedDetected: false };
  }
}

function write(s: State) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function canShowA2HS(): boolean {
  if (typeof window === "undefined") return false;
  if (isStandalone()) return false;
  const s = read();
  if (s.installedDetected || s.dismissed) return false;
  if (s.shownCount >= MAX_SHOWS) return false;
  if (s.lastShownDate === todayKey()) return false;
  return true;
}

export function markShown() {
  const s = read();
  write({ ...s, shownCount: s.shownCount + 1, lastShownDate: todayKey() });
}

export function dismissForever() {
  const s = read();
  write({ ...s, dismissed: true });
}

// ---- beforeinstallprompt capture ----

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BIPEvent | null = null;
const listeners = new Set<() => void>();
let initialized = false;

export function initA2HS() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BIPEvent;
    listeners.forEach((fn) => fn());
  });

  window.addEventListener("appinstalled", () => {
    const s = read();
    write({ ...s, installedDetected: true });
    deferredPrompt = null;
    listeners.forEach((fn) => fn());
  });

  if (isStandalone()) {
    const s = read();
    if (!s.installedDetected) write({ ...s, installedDetected: true });
  }
}

export function hasNativeInstallPrompt(): boolean {
  return deferredPrompt !== null;
}

export async function triggerNativeInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    listeners.forEach((fn) => fn());
    return choice.outcome;
  } catch {
    return "dismissed";
  }
}

export function subscribeA2HS(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
