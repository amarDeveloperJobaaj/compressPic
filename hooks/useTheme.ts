"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "compresspix-theme";

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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage not available
  }
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Resolve the current theme: explicit choice → stored → system preference. */
function resolveTheme(): Theme {
  return currentTheme ?? getStoredTheme() ?? getSystemTheme();
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
  return "light";
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
