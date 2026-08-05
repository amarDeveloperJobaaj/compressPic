"use client";

const KEY = "vizotool-visitor";

/**
 * Stable per-browser visitor id used for blog likes / bookmarks / views.
 * Generated once and persisted in localStorage; falls back to a random id
 * in private mode. Only ever used as an anonymous engagement key — never
 * stored or exposed as PII.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "anon";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id || id.length < 8) {
      id = `vis_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `vis_${Math.random().toString(36).slice(2, 14)}`;
  }
}
