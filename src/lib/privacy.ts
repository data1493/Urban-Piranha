import type { HistoryItem, Settings } from "./types";

const HISTORY_KEY = "metah4:history";
const SETTINGS_KEY = "metah4:settings";

export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  safeSearch: false,
  newTab: true,
  saveHistory: true,
  region: "us",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getSettings(): Settings {
  if (!canUseStorage()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setSettings(next: Partial<Settings>): Settings {
  const merged = { ...getSettings(), ...next };
  if (canUseStorage()) localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  applyTheme(merged.theme);
  return merged;
}

export function applyTheme(theme: Settings["theme"]) {
  if (typeof document === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function getHistory(): HistoryItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(q: string) {
  if (!canUseStorage() || !getSettings().saveHistory) return;
  const trimmed = q.trim();
  if (!trimmed) return;
  const next = [
    { q: trimmed, at: Date.now() },
    ...getHistory().filter((h) => h.q.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, 40);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearHistory() {
  if (canUseStorage()) localStorage.removeItem(HISTORY_KEY);
}

export function historyCount() {
  return getHistory().length;
}
