"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Camera + microphone management for the interview room (§30, §75).
 *
 * Permissions are requested ONLY when the room starts. If the full
 * camera+mic request fails, it degrades to audio-only, then video-only, then
 * none — the UI always knows exactly what was granted so it can offer the
 * text fallback instead of dead-ending.
 */

export type MediaStatus = "idle" | "requesting" | "granted" | "denied";

export interface MediaGrant {
  video: boolean;
  audio: boolean;
  /** Reason when something was denied — shown as friendly guidance (§75). */
  note?: string;
}

export interface UseMediaDevicesResult {
  stream: MediaStream | null;
  videoEnabled: boolean;
  audioEnabled: boolean;
  cameraStatus: MediaStatus;
  micStatus: MediaStatus;
  error: string | null;
  requestMedia: (opts?: { video?: boolean; audio?: boolean }) => Promise<MediaGrant>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  stop: () => void;
}

function friendlyMediaError(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  switch (name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Camera or microphone permission was denied. Allow access in your browser, then try again — or continue with text.";
    case "NotFoundError":
      return "No camera or microphone was found on this device. You can still practice with text answers.";
    case "NotReadableError":
    case "AbortError":
      return "Your camera or microphone is busy in another app. Close it, then try again.";
    default:
      return "Could not access your camera or microphone. You can still practice with text answers.";
  }
}

export function useMediaDevices(): UseMediaDevicesResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraStatus, setCameraStatus] = useState<MediaStatus>("idle");
  const [micStatus, setMicStatus] = useState<MediaStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const adoptStream = useCallback((s: MediaStream) => {
    streamRef.current = s;
    setStream(s);
    setVideoEnabled(s.getVideoTracks().length > 0);
    setAudioEnabled(s.getAudioTracks().length > 0);
    // Device unplugged / browser stops the track → surface it (§75).
    s.getVideoTracks().forEach((t) =>
      t.addEventListener("ended", () => setCameraStatus("denied"))
    );
    s.getAudioTracks().forEach((t) =>
      t.addEventListener("ended", () => setMicStatus("denied"))
    );
  }, []);

  const requestMedia = useCallback(
    async ({ video = true, audio = true }: { video?: boolean; audio?: boolean } = {}) => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setError(null);
      setCameraStatus(video ? "requesting" : "denied");
      setMicStatus(audio ? "requesting" : "denied");

      // Full request → audio-only → video-only (§75 fallback chain), only
      // attempting combinations the user actually asked for.
      const attempts: Array<[boolean, boolean]> = (
        [
          [true, true],
          [false, true],
          [true, false],
        ] as Array<[boolean, boolean]>
      ).filter(([v, a]) => (v ? video : true) && (a ? audio : true));
      let lastError: unknown = null;
      for (const [v, a] of attempts) {
        if (!v && !a) break;
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: v, audio: a });
          adoptStream(s);
          setCameraStatus(v ? "granted" : "denied");
          setMicStatus(a ? "granted" : "denied");
          const grant: MediaGrant = {
            video: v,
            audio: a,
            note: !v || !a ? "Some devices weren't available — continuing with what was granted." : undefined,
          };
          return grant;
        } catch (e) {
          lastError = e;
        }
      }

      setCameraStatus(video ? "denied" : "denied");
      setMicStatus(audio ? "denied" : "denied");
      setError(friendlyMediaError(lastError));
      return { video: false, audio: false, note: friendlyMediaError(lastError) };
    },
    [adoptStream]
  );

  const toggleVideo = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    const track = s.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setVideoEnabled(track.enabled);
  }, []);

  const toggleAudio = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    const track = s.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setAudioEnabled(track.enabled);
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  return {
    stream,
    videoEnabled,
    audioEnabled,
    cameraStatus,
    micStatus,
    error,
    requestMedia,
    toggleVideo,
    toggleAudio,
    stop,
  };
}
