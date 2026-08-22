"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(dotX, { stiffness: 80, damping: 18, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 80, damping: 18, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    // Skip on touch devices
    if ("ontouchstart" in window) return;
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement | null;
      if (!target || !target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [dotX, dotY]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Outer ring — follows with lag */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: hovering ? 48 : 28,
            height: hovering ? 48 : 28,
            opacity: hovering ? 0.35 : 0.2,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-full border border-[var(--pf-accent)]"
        />
      </motion.div>

      {/* Inner dot — snappy follow */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: hovering ? 6 : 4,
            height: hovering ? 6 : 4,
            backgroundColor: hovering ? "var(--pf-accent)" : "var(--pf-text)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="rounded-full"
        />
      </motion.div>
    </div>
  );
}
