import { create } from "zustand";

import type { SessionStatus } from "../types";

/**
 * Interview room state (master spec §15, §79).
 *
 * `status` mirrors the §79 state machine. Phase 5/6 will drive LISTENING →
 * PROCESSING → ASKING; Phase 4 drives idle → preparing → ready → active →
 * ending → completed. Failures are surfaced via the error message string
 * with the room returning to a retryable state.
 */

export type RoomStatus = SessionStatus;

export interface TranscriptEntry {
  id: string;
  speaker: "interviewer" | "candidate";
  text: string;
  /** Elapsed room seconds when the entry was added (display only). */
  at: number;
}

interface InterviewRoomState {
  /** Server session id — null until the session is created. */
  sessionId: string | null;
  status: RoomStatus;
  error: string | null;
  transcript: TranscriptEntry[];
  /** The interviewer's current line (question / welcome). */
  currentQuestion: string | null;
  /** Explicit recording consent (§31) — gates the Start action. */
  recordingConsent: boolean;
  /** Room seconds elapsed while ACTIVE (drives the timer). */
  elapsedSeconds: number;

  setSessionId: (sessionId: string | null) => void;
  setStatus: (status: RoomStatus) => void;
  setError: (message: string | null) => void;
  setRecordingConsent: (consent: boolean) => void;
  setCurrentQuestion: (question: string | null) => void;
  addTranscriptEntry: (entry: Omit<TranscriptEntry, "id" | "at">) => void;
  tick: () => void;
  reset: () => void;
}

let entryId = 0;

export const useInterviewRoomStore = create<InterviewRoomState>((set) => ({
  sessionId: null,
  status: "idle",
  error: null,
  transcript: [],
  currentQuestion: null,
  recordingConsent: false,
  elapsedSeconds: 0,

  setSessionId: (sessionId) => set({ sessionId }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setRecordingConsent: (recordingConsent) => set({ recordingConsent }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  addTranscriptEntry: (entry) =>
    set((s) => ({
      transcript: [
        ...s.transcript,
        { ...entry, id: `e${entryId++}`, at: s.elapsedSeconds },
      ],
    })),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  reset: () =>
    set({
      sessionId: null,
      status: "idle",
      error: null,
      transcript: [],
      currentQuestion: null,
      recordingConsent: false,
      elapsedSeconds: 0,
    }),
}));

/** Seconds the timer should show — derived, so components don't drift. */
export function remainingSeconds(durationMinutes: number, elapsedSeconds: number): number {
  return Math.max(0, durationMinutes * 60 - elapsedSeconds);
}
