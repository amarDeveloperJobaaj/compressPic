"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Star,
  Diamond,
  Circle,
  Triangle,
  Hexagon,
  Sparkles,
  Hexagon as Hex,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SHAPES: LucideIcon[] = [
  Zap,
  Star,
  Diamond,
  Circle,
  Triangle,
  Hexagon,
  Sparkles,
];

const COLORS = [
  "#14b8a6",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#f43f5e",
  "#22c55e",
  "#fbbf24",
];

interface Spark {
  id: number;
  Icon: LucideIcon;
  color: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

let nextId = 0;

export function ClickSparkle() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const onClick = useCallback((e: MouseEvent) => {
    // Don't spark on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, textarea, select, [role='button']")) return;

    const count = 2 + Math.floor(Math.random() * 3); // 2-4 sparks
    const newSparks: Spark[] = [];

    for (let i = 0; i < count; i++) {
      newSparks.push({
        id: nextId++,
        Icon: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: e.clientX + (Math.random() - 0.5) * 60,
        y: e.clientY + (Math.random() - 0.5) * 40,
        rotation: Math.random() * 360,
        size: 12 + Math.floor(Math.random() * 8),
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);

    // Auto-remove after animation
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 1200);
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if ("ontouchstart" in window) return;
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [onClick]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden="true">
      <AnimatePresence>
        {sparks.map((spark) => {
          const SparkIcon = spark.Icon;
          return (
            <motion.div
              key={spark.id}
              initial={{ opacity: 1, scale: 0.3, x: spark.x, y: spark.y, rotate: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                y: spark.y - 80 - Math.random() * 60,
                x: spark.x + (Math.random() - 0.5) * 80,
                rotate: spark.rotation + 180,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ color: spark.color }}
            >
              <SparkIcon className="drop-shadow-sm" style={{ width: spark.size, height: spark.size }} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
