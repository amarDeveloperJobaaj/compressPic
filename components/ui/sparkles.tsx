"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  className?: string;
  /** Hex color of the particles. */
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
  /** Horizontal drift speed (px/frame). */
  speed?: number;
  /** Roughly how many particles per 10k px² of area (auto-clamped 20–160). */
  particleDensity?: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
}

/**
 * Aceternity-style sparkles rendered on a lightweight canvas.
 * A dependency-free alternative to the @tsparticles-based SparklesCore.
 */
export function Sparkles({
  className,
  particleColor = "#3B82F6",
  minSize = 1,
  maxSize = 2.4,
  speed = 0.5,
  particleDensity = 60,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = (w * h) / 10000;
      const count = Math.max(20, Math.min(160, Math.round(area * (particleDensity / 10))));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: minSize + Math.random() * Math.max(0.1, maxSize - minSize),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed - speed * 0.15,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(t / 900 + p.phase));
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    sizeCanvas();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [particleColor, minSize, maxSize, speed, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
