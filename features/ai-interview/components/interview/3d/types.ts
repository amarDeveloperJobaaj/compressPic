/** AI interviewer visual states (§10–16 of the 3D spec). */
export type AvatarState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "analyzing"
  | "success";

export const AVATAR_STATES: AvatarState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "analyzing",
  "success",
];
