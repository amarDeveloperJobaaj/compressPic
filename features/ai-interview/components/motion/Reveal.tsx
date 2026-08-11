"use client";

import { motion } from "framer-motion";

import { useMediaQuery } from "../../hooks/useMediaQuery";

export type RevealVariant = "up" | "left" | "right" | "blur";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Direction the element animates from. "blur" adds a de-blur reveal. */
  variant?: RevealVariant;
}

type RevealTarget = {
  opacity?: number;
  y?: number;
  x?: number;
  filter?: string;
};

const INITIAL: Record<RevealVariant, RevealTarget> = {
  up: { opacity: 0, y: 26 },
  left: { opacity: 0, x: -34 },
  right: { opacity: 0, x: 34 },
  blur: { opacity: 0, y: 18, filter: "blur(12px)" },
};

const VISIBLE: Record<RevealVariant, RevealTarget> = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  blur: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Fade-and-rise on scroll into view; inert for reduced-motion users. */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
}: RevealProps) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <motion.div
      initial={reduced ? false : INITIAL[variant]}
      whileInView={reduced ? undefined : VISIBLE[variant]}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
