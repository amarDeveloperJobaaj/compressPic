"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  offset?: number;
}

const directionMap = {
  up: (o: number) => ({ y: o }),
  down: (o: number) => ({ y: -o }),
  left: (o: number) => ({ x: o }),
  right: (o: number) => ({ x: -o }),
  none: () => ({}),
};

export function ScrollReveal({ children, className, delay = 0, direction = "up", offset = 24 }: ScrollRevealProps) {
  const hidden = directionMap[direction](offset);
  const variants: Variants = {
    hidden: { opacity: 0, ...hidden },
    visible: { opacity: 1, x: 0, y: 0 },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
