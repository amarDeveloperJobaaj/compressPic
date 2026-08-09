"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AIAvatarFallback } from "./3d/AIAvatarFallback";
import { AIAvatarUIOverlay } from "./3d/AIAvatarUIOverlay";
import { AVATAR_STATES, type AvatarState } from "./3d/types";

/**
 * AI interviewer stage.
 *
 * The visual is a Sketchfab-hosted 3D model ("Character Axio Robot") embedded
 * as an iframe — Sketchfab handles the viewer, lighting and its own loading
 * state (with built-in attribution). The embed is fully client-side and never
 * blocks first paint.
 *
 * Around it: a state machine cycles idle → listening → thinking → speaking →
 * analyzing → success so the floating product-UI cards visibly "work" through
 * the interview loop (§39). Reduced-motion / no-WebGL users get the premium
 * static CSS avatar instead of the embed (§30).
 */

const SKETCHFAB_EMBED_URL =
  "https://sketchfab.com/models/170e2b3f540642c2bcec9d80a1bc2fc0/embed?ui_theme=dark";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

// One-time WebGL capability check — memoized so the useSyncExternalStore
// snapshot stays stable across reads (no effect, no hydration warning).
let webglCache: boolean | null = null;
function getWebGlSnapshot(): boolean {
  if (webglCache === null) webglCache = detectWebGL();
  return webglCache;
}
function subscribeWebGl(): () => void {
  return () => undefined;
}

const STATE_DURATION_MS: Record<AvatarState, number> = {
  idle: 3600,
  listening: 3200,
  thinking: 2800,
  speaking: 3400,
  analyzing: 3600,
  success: 3000,
};

export function AIInterviewer3D() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [state, setState] = useState<AvatarState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SSR-safe WebGL support flag (false on the server; resolved on the client).
  const webgl = useSyncExternalStore(subscribeWebGl, getWebGlSnapshot, () => false);

  // State machine — cycles through the interview loop (setState only inside
  // the timeout callback, never synchronously in the effect body).
  useEffect(() => {
    if (reduced) return; // static for reduced-motion users
    let index = 0;
    const tick = () => {
      setState(AVATAR_STATES[index % AVATAR_STATES.length]);
      index += 1;
      timerRef.current = setTimeout(
        tick,
        STATE_DURATION_MS[AVATAR_STATES[index % AVATAR_STATES.length]]
      );
    };
    tick();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduced]);

  const showEmbed = webgl && !reduced;

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] select-none">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[6%] -z-10 rounded-[50%] bg-primary/12 blur-3xl"
        />

        {/* Sketchfab embed (or static fallback) — clipped inside rounded stage.
            The overflow/rounded clip lives here so the floating cards can
            still hang outside the stage edges. */}
        <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-border/60 bg-[#0a0a0f] shadow-2xl shadow-primary/10">
          {showEmbed ? (
            <iframe
              title="Character Axio Robot — AI interviewer"
              src={SKETCHFAB_EMBED_URL}
              className="h-full w-full"
              style={{ border: 0 }}
              frameBorder={0}
              scrolling="no"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
            />
          ) : (
            <AIAvatarFallback />
          )}
        </div>

        {/* Floating product-UI cards */}
        <AIAvatarUIOverlay state={state} showScores={state === "success"} />
      </div>
    </div>
  );
}
