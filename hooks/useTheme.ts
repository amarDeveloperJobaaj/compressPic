"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "vizotool-theme";
// Legacy key from the pre-rebrand days — read once and migrate so users who
// explicitly chose "light" don't silently flip back to the default dark theme.
const LEGACY_STORAGE_KEY = "compresspix-theme";

/**
 * Module-level theme store shared by every ThemeToggle instance (desktop nav,
 * mobile header row, mobile drawer footer) so they all stay in sync even
 * though each one mounts its own useTheme() hook.
 */
let currentTheme: Theme | null = null;
const listeners = new Set<() => void>();

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      // One-time migration from the legacy rebrand key — only propagate a
      // value that's actually a valid theme choice.
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy === "light" || legacy === "dark") {
        stored = legacy;
        localStorage.setItem(STORAGE_KEY, legacy);
      }
    }
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Resolve the current theme: explicit choice → stored preference → dark.
 * Dark is the product default (the site ships dark-first); users can still
 * switch to light and their choice is persisted.
 */
function resolveTheme(): Theme {
  return currentTheme ?? getStoredTheme() ?? "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function setTheme(next: Theme) {
  currentTheme = next;
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage not available
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot(): Theme {
  // Dark is the product default, matching the pre-hydration script so there
  // is no flash or hydration mismatch for first-time visitors.
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, resolveTheme, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    setTheme(resolveTheme() === "dark" ? "light" : "dark");
  }, []);

  const setThemeCallback = useCallback((next: Theme) => setTheme(next), []);

  return {
    theme,
    mounted: true,
    setTheme: setThemeCallback,
    toggleTheme,
    isDark: theme === "dark",
  };
}
