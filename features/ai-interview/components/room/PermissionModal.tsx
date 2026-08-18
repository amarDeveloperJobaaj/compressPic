"use client";

import { useState } from "react";
import { Camera, Loader2, Mic, MessageSquareText, ShieldAlert, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  MediaGrant,
  MediaStatus,
} from "@/features/ai-interview/hooks/useMediaDevices";

/**
 * Permission modal — the ONLY place camera/mic are requested (§30). It
 * explains why the devices are needed, then requests them on the user's
 * action. Any denial degrades gracefully: audio-only → text-only (§75).
 */

interface PermissionModalProps {
  open: boolean;
  cameraStatus: MediaStatus;
  micStatus: MediaStatus;
  error: string | null;
  onRequest: (opts?: { video?: boolean; audio?: boolean }) => Promise<MediaGrant>;
  onGranted: (grant: MediaGrant) => void;
  onSkip: () => void;
  /** Dismissed (X / Escape) or "Not now" — leave the room. */
  onNotNow: () => void;
}

export function PermissionModal({
  open,
  cameraStatus,
  micStatus,
  error,
  onRequest,
  onGranted,
  onSkip,
  onNotNow,
}: PermissionModalProps) {
  const [requesting, setRequesting] = useState(false);

  const request = async (opts?: { video?: boolean; audio?: boolean }) => {
    setRequesting(true);
    try {
      const grant = await onRequest(opts);
      onGranted(grant);
    } finally {
      setRequesting(false);
    }
  };

  const anyRequesting = requesting || cameraStatus === "requesting" || micStatus === "requesting";

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) onNotNow();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Camera &amp; microphone</DialogTitle>
          <DialogDescription>
            Your mock interview is a live conversation with the AI interviewer. The camera and
            microphone make it feel like a real video interview — and they&apos;re only used while
            the interview is running.
          </DialogDescription>
        </DialogHeader>

        {/* Device status chips */}
        <div className="space-y-2">
          <DeviceRow
            icon={Camera}
            label="Camera"
            status={cameraStatus}
            grantedText="Camera enabled"
          />
          <DeviceRow
            icon={Mic}
            label="Microphone"
            status={micStatus}
            grantedText="Microphone enabled"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-error/30 bg-error-light px-4 py-3 text-sm text-error"
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          <Button
            size="lg"
            onClick={() => request()}
            disabled={anyRequesting || (cameraStatus === "granted" && micStatus === "granted")}
          >
            {anyRequesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Requesting devices…
              </>
            ) : (
              <>
                <Video className="h-4 w-4" />
                Enable camera &amp; microphone
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={() => request({ video: false, audio: true })} disabled={anyRequesting}>
              <Mic className="h-4 w-4" />
              Audio only
            </Button>
            <Button variant="ghost" onClick={onSkip} disabled={anyRequesting}>
              <MessageSquareText className="h-4 w-4" />
              Text only
            </Button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-text-muted">
          Nothing is recorded until you give separate consent on the next step. You can turn the
          camera or microphone off at any time during the interview.
        </p>

        <button
          type="button"
          onClick={onNotNow}
          className="mx-auto mt-2 text-xs font-medium text-text-muted underline-offset-2 transition-colors hover:text-text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Not now — back to AI Interview
        </button>
      </DialogContent>
    </Dialog>
  );
}

function DeviceRow({
  icon: Icon,
  label,
  status,
  grantedText,
}: {
  icon: typeof Camera;
  label: string;
  status: MediaStatus;
  grantedText: string;
}) {
  const stateText =
    status === "granted" ? grantedText : status === "requesting" ? "Requesting…" : status === "denied" ? "Not available" : "Not requested yet";
  const ok = status === "granted";
  const busy = status === "requesting";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          ok ? "bg-success-light text-success" : busy ? "bg-primary-light text-primary" : "bg-border/60 text-text-muted"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-muted">{stateText}</p>
      </div>
      <span
        className={`h-2 w-2 rounded-full ${ok ? "bg-success" : busy ? "animate-pulse bg-primary" : "bg-text-muted/50"}`}
      />
    </div>
  );
}
