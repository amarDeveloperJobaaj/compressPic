"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/**
 * Reactive media-query hook (SSR-safe, no effects).
 *
 * Built on useSyncExternalStore so reading matchMedia never calls setState
 * inside an effect (avoids react-hooks/set-state-in-effect) and stays in
 * sync when the query flips (e.g. device rotation, OS reduced-motion change).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  );
}
