"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global MotionConfig for every framer-motion animation in the app.
 *
 * - `reducedMotion="user"`: users with OS-level "reduce motion" get opacity-only
 *   animations (no transforms/layout shifts) — removes a major source of
 *   perceived jank on low-end and assistive setups.
 * - `transition` defaults tuned for snappy, low-duration feel everywhere.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
