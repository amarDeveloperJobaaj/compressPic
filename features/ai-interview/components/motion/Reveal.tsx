"use client";

import { motion } from "framer-motion";

import { useMediaQuery } from "../../hooks/useMediaQuery";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Fade-and-rise on scroll into view; inert for reduced-motion users. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
