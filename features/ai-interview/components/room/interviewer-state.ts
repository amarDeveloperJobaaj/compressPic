import type { RoomStatus } from "../../store/interview-room-store";

/**
 * Interviewer visual states (§15) — the room maps its §79 status machine onto
 * these so the AI interviewer visually communicates what is happening:
 * waiting / listening / thinking / speaking / processing / success.
 */
export type InterviewerVisual =
  | "waiting"
  | "listening"
  | "thinking"
  | "speaking"
  | "processing"
  | "success";

const VISUAL: Record<RoomStatus, InterviewerVisual> = {
  // active = the AI asked its line and is waiting for the answer; Phase 5/6
  // drives speaking/listening/thinking sub-states.
  idle: "waiting",
  preparing: "waiting",
  ready: "waiting",
  active: "waiting",
  listening: "listening",
  processing: "processing",
  asking: "thinking",
  speaking: "speaking", // Phase 6: TTS reads the question aloud
  ending: "processing",
  generating_report: "processing",
  completed: "success",
};

/** Human loading/status labels (§78 — never an unexplained spinner). */
const LABEL: Record<RoomStatus, string> = {
  idle: "Waiting",
  preparing: "Preparing interview…",
  ready: "Ready to begin",
  active: "Interview in progress",
  listening: "Listening…",
  processing: "Processing answer…",
  asking: "Generating question…",
  speaking: "Speaking…",
  ending: "Ending interview…",
  generating_report: "Generating report…",
  completed: "Interview complete",
};

export function interviewerVisualFor(status: RoomStatus): InterviewerVisual {
  return VISUAL[status];
}

export function roomStatusLabel(status: RoomStatus): string {
  return LABEL[status];
}

export const VISUAL_LABELS: Record<InterviewerVisual, string> = {
  waiting: "Waiting",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking",
  processing: "Processing…",
  success: "All set",
};

/** Tailwind accent classes per visual state (dot + ring). */
export const VISUAL_ACCENT: Record<InterviewerVisual, { dot: string; ring: string; text: string }> = {
  waiting: { dot: "bg-text-muted", ring: "border-border", text: "text-text-muted" },
  listening: { dot: "bg-cyan-400", ring: "border-cyan-400/50", text: "text-cyan-400" },
  thinking: { dot: "bg-indigo-400", ring: "border-indigo-400/50", text: "text-indigo-400" },
  speaking: { dot: "bg-sky-400", ring: "border-sky-400/50", text: "text-sky-400" },
  processing: { dot: "bg-violet-400", ring: "border-violet-400/50", text: "text-violet-400" },
  success: { dot: "bg-success", ring: "border-success/50", text: "text-success" },
};
