"use client";

import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]<>=/\\;:()const let var function return if else for while class import export default async await new this self void null undefined true false NaN Infinity".split("");

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let columns: number[] = [];
    const fontSize = 14;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const colCount = Math.floor(w / fontSize);
      columns = Array.from({ length: colCount }, () => Math.random() * h / fontSize);
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(var(--pf-bg-rgb, 5, 10, 18), 0.06)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        // Head of the column is brighter
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = "rgba(20, 184, 166, 0.9)"; // accent bright
        } else if (brightness > 0.8) {
          ctx.fillStyle = "rgba(20, 184, 166, 0.4)"; // accent medium
        } else {
          ctx.fillStyle = "rgba(20, 184, 166, 0.12)"; // accent dim
        }

        ctx.fillText(char, x, y);

        // Reset column when it goes off screen
        if (y > h && Math.random() > 0.975) {
          columns[i] = 0;
        }

        columns[i] += 0.5 + Math.random() * 0.5;
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 opacity-30"
      aria-hidden="true"
    />
  );
}
