import type { DurationOption } from "../types";

/** Interview durations (minutes) — values exactly from 03-tool-info.md. MVP default 20. */
export const DURATIONS: DurationOption[] = [
  { minutes: 10 },
  { minutes: 20, recommended: true },
  { minutes: 30 },
  { minutes: 45 },
  { minutes: 60 },
];

export const DEFAULT_DURATION_MINUTES = 20;
