/**
 * Generic localStorage history manager with favorites support.
 * Kept side-effect free at module scope — components read/write in handlers
 * (or lazy state initializers) so there are no setState-in-effect lint issues.
 */

export interface HistoryEntry<T = unknown> {
  id: string;
  label: string;
  sublabel?: string;
  favorite?: boolean;
  data: T;
}

const MAX_ENTRIES = 12;

function read<T>(key: string): HistoryEntry<T>[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, entries: HistoryEntry<T>[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
  } catch {
    // Storage may be full or blocked — history is a nice-to-have, never fatal.
  }
}

/** Read history (latest first), with favorites sorted to the top. */
export function loadHistory<T>(key: string): HistoryEntry<T>[] {
  const entries = read<T>(key);
  return [...entries].sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false));
}

/** Push a new entry, dedupe by id, cap the list, and persist. Returns the new list. */
export function pushHistory<T>(key: string, entry: HistoryEntry<T>): HistoryEntry<T>[] {
  const entries = [entry, ...read<T>(key).filter((e) => e.id !== entry.id)].slice(0, MAX_ENTRIES);
  write(key, entries);
  return [...entries].sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false));
}

/** Toggle favorite on an entry id. Returns the new list. */
export function toggleFavorite<T>(key: string, id: string): HistoryEntry<T>[] {
  const entries = read<T>(key).map((e) =>
    e.id === id ? { ...e, favorite: !e.favorite } : e
  );
  write(key, entries);
  return [...entries].sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false));
}

/** Remove a single entry. Returns the new list. */
export function removeHistoryEntry<T>(key: string, id: string): HistoryEntry<T>[] {
  const entries = read<T>(key).filter((e) => e.id !== id);
  write(key, entries);
  return entries;
}

/** Clear all history for a key. */
export function clearHistory(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
