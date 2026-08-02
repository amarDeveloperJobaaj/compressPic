"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

/**
 * Aceternity-style rotating word ticker.
 * Cycles through `words` with a smooth vertical flip animation.
 *
 * Perf: the ticker only runs while it's visible in the viewport and the tab is
 * focused, and never runs for users who prefer reduced motion — so it can't
 * burn CPU off-screen on a long landing page.
 */
export function FlipWords({ words, duration = 3000, className }: FlipWordsProps) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip the whole rotation loop for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let visible = true;

    const start = () => {
      if (intervalId !== null) return;
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % words.length);
      }, duration);
    };
    const stop = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Pause while scrolled out of view (with a small margin so it's already
    // rotating by the time the user scrolls back).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "80px" }
    );
    io.observe(el);

    // Pause while the tab is hidden (browser throttles timers anyway, but this
    // avoids the wake-up tick on every cycle).
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [duration, words.length]);

  return (
    <span ref={ref} className={cn("relative inline-flex overflow-hidden align-middle", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="inline-block whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
