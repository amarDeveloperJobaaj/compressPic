"use client";

import { useEffect, useRef } from "react";
import { User, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MediaStatus } from "@/features/ai-interview/hooks/useMediaDevices";

/**
 * User camera panel (§12). Shows the live getUserMedia stream, or a clear
 * "camera off" placeholder when the user toggled it / it was denied.
 */
export function VideoPanel({
  stream,
  videoEnabled,
  cameraStatus,
}: {
  stream: MediaStream | null;
  videoEnabled: boolean;
  cameraStatus: MediaStatus;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keep the element's srcObject in sync with the granted stream (DOM write —
  // not React state, so no re-render churn).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.srcObject !== stream) el.srcObject = stream;
    if (stream) void el.play().catch(() => undefined);
  }, [stream]);

  const showVideo = Boolean(stream) && videoEnabled;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black/60">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          showVideo ? "opacity-100" : "opacity-0"
        )}
        aria-label="Your camera"
      />
      {!showVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-muted">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface/40">
            {cameraStatus === "granted" ? (
              <VideoOff className="h-7 w-7" />
            ) : (
              <User className="h-7 w-7" />
            )}
          </div>
          <p className="text-sm font-medium">
            {cameraStatus === "granted" ? "Camera off" : "Camera not available"}
          </p>
        </div>
      )}
    </div>
  );
}
