"use client";

import { Camera, CameraOff, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MediaStatus } from "@/features/ai-interview/hooks/useMediaDevices";

/**
 * Interview controls (§12): mic + camera toggles (live track state), a
 * speaker toggle (voice arrives with the Phase 6 TTS loop — shown disabled
 * so the layout is honest), and End with confirmation (dialog owned by the
 * room orchestrator).
 */
export function InterviewControls({
  videoEnabled,
  audioEnabled,
  cameraStatus,
  micStatus,
  onToggleVideo,
  onToggleAudio,
  onEnd,
  live,
  ending = false,
}: {
  videoEnabled: boolean;
  audioEnabled: boolean;
  cameraStatus: MediaStatus;
  micStatus: MediaStatus;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEnd: () => void;
  /** Room is live — toggles act on real tracks; before that they're preview. */
  live: boolean;
  /** End call in flight — disables the End button. */
  ending?: boolean;
}) {
  const hasVideo = cameraStatus === "granted";
  const hasAudio = micStatus === "granted";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ControlButton
        label={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        active={audioEnabled}
        disabled={!hasAudio}
        onClick={onToggleAudio}
      >
        {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </ControlButton>

      <ControlButton
        label={videoEnabled ? "Turn camera off" : "Turn camera on"}
        active={videoEnabled}
        disabled={!hasVideo}
        onClick={onToggleVideo}
      >
        {videoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
      </ControlButton>

      {/* Speaker — voice arrives with Phase 6; disabled until then. */}
      <button
        type="button"
        disabled
        title="Voice questions arrive with the voice update"
        aria-label="Speaker (coming soon)"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text-muted opacity-50",
          "focus-visible:outline-none"
        )}
      >
        <Volume2 className="h-5 w-5" />
      </button>

      <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

      <button
        type="button"
        onClick={onEnd}
        disabled={ending}
        className="flex h-12 items-center gap-2 rounded-full border border-error/40 bg-error/10 px-5 text-sm font-semibold text-error transition-colors hover:bg-error hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="End interview"
      >
        <PhoneOff className="h-4 w-4" />
        {ending ? "Ending…" : "End"}
      </button>
      {!live && <span className="text-xs text-text-muted">— preview, not live yet</span>}
    </div>
  );
}

function ControlButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        active
          ? "border-border bg-surface text-text-primary shadow-sm"
          : "border-error/40 bg-error/10 text-error",
        !disabled && "hover:border-primary/50 hover:text-primary active:scale-95",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      {children}
    </button>
  );
}
