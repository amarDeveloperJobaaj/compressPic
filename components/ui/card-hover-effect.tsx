"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardHoverEffectItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface CardHoverEffectProps {
  items: CardHoverEffectItem[];
  className?: string;
  gridClassName?: string;
}

/**
 * Aceternity-style card hover effect — a smooth "spotlight" highlight
 * that slides between cards as the cursor moves across the grid.
 */
export function CardHoverEffect({ items, className, gridClassName }: CardHoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        gridClassName
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative block h-full p-1"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-2xl bg-primary-light/70 dark:bg-primary/25"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.18 } }}
                exit={{ opacity: 0, transition: { duration: 0.18, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <div
            className={cn(
              "relative z-10 flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg",
              className
            )}
          >
            {item.icon && (
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                {item.icon}
              </div>
            )}
            <h3 className="font-semibold text-text-primary">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
