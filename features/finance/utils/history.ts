"use client";

/**
 * Lightweight client-side persistence for the finance section:
 * recent calculations (per calculator) + favorite calculator slugs.
 */

const RECENT_KEY = "compresspix:finance:recent";
const FAVS_KEY = "compresspix:finance:favorites";

export interface RecentEntry {
  slug: string;
  summary: string;
  timestamp: number;
  /** Input values snapshot so a saved calculation can be reloaded. */
  values?: Record<string, number>;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function getRecent(): RecentEntry[] {
  return readJson<RecentEntry[]>(RECENT_KEY, []);
}

export function addRecent(entry: RecentEntry) {
  const list = getRecent().filter((e) => e.slug !== entry.slug);
  list.unshift(entry);
  writeJson(RECENT_KEY, list.slice(0, 20));
}

export function getFavorites(): string[] {
  return readJson<string[]>(FAVS_KEY, []);
}

export function toggleFavorite(slug: string): string[] {
  const list = getFavorites();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  writeJson(FAVS_KEY, next);
  return next;
}
