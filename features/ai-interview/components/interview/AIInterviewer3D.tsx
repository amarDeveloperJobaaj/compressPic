"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AIAvatarFallback } from "./3d/AIAvatarFallback";
import { AIAvatarUIOverlay } from "./3d/AIAvatarUIOverlay";
import { AVATAR_STATES, type AvatarState, type QualityTier } from "./3d/types";

/**
 * AI interviewer 3D container.
 *
 * - Quality tier: high (desktop), medium (tablet), low (small mobile).
 * - WebGL check: if unsupported → premium static fallback, never a broken
 *   canvas (§30).
 * - State machine: cycles idle → listening → thinking → speaking → analyzing
 *   → success so the avatar visibly "works" through the interview loop (§39).
 * - The 3D bundle is lazy-loaded (ssr:false) so it never blocks first paint;
 *   the CSS fallback renders during load (§29).
 */

const AIAvatarScene = dynamic(
  () => import("./3d/AIAvatarScene").then((m) => m.AIAvatarScene),
  { ssr: false, loading: () => <AIAvatarFallback loading /> }
);

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
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1023px)");

  const [state, setState] = useState<AvatarState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SSR-safe WebGL support flag (false on the server; resolved on the client).
  const webgl = useSyncExternalStore(subscribeWebGl, getWebGlSnapshot, () => false);

  const quality: QualityTier = isMobile ? "low" : isTablet ? "medium" : "high";

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

  // Mobile keeps the avatar (at low quality) per §29 — the low tier already
  // drops particles, simplifies lighting, and scales the model down. The
  // static fallback is reserved for no-WebGL / reduced-motion / still loading.
  const showScene = webgl && !reduced;

  return (
    <div className="relative">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] select-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[6%] -z-10 rounded-[50%] bg-primary/12 blur-3xl"
        />
        {/* Scene (or static fallback) fills the stage */}
        <div className="absolute inset-0">
          {showScene ? (
            <AIAvatarScene state={state} quality={quality} />
          ) : (
            <AIAvatarFallback />
          )}
        </div>
        {/* Floating product-UI cards */}
        <AIAvatarUIOverlay state={state} showScores={state === "success"} />
      </div>
      {/* CC BY 4.0 attribution for the hero 3D model */}
      <p className="mt-1 text-center text-[10px] leading-tight text-text-muted/70">
        3D model “Cute Robot Mascot” by hoangvt1403 · CC BY 4.0
      </p>
    </div>
  );
}
