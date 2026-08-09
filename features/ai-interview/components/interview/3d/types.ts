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

/** Device quality tiers (§34) — drives particle counts & effects. */
export type QualityTier = "high" | "medium" | "low";

export interface AvatarSceneProps {
  state: AvatarState;
  quality: QualityTier;
}
