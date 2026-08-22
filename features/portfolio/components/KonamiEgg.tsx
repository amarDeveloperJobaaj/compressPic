"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Gamepad2, Sparkles } from "lucide-react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const CONFETTI_COLORS = ["#14b8a6", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#22c55e"];

function Confetti({ count = 40 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 4 + Math.random() * 6,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: "110vh", opacity: 0, rotate: p.rotate + 720, scale: 0.5 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          className="absolute rounded-sm"
          style={{ backgroundColor: p.color, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

export function KonamiEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const buffer = useRef<string[]>([]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    buffer.current.push(e.key);
    if (buffer.current.length > KONAMI.length) {
      buffer.current.shift();
    }
    const match = buffer.current.join(",") === KONAMI.join(",");
    if (match) {
      buffer.current = [];
      setUnlocked(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5000);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <>
      {/* Confetti burst */}
      <AnimatePresence>
        {unlocked && <Confetti />}
      </AnimatePresence>

      {/* Celebration banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed inset-x-0 top-20 z-[10001] flex justify-center px-4"
          >
            <div className="rounded-2xl border border-[var(--pf-accent)]/30 bg-[var(--pf-surface)] px-8 py-5 shadow-2xl shadow-[var(--pf-accent)]/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <Trophy className="h-10 w-10 text-[var(--pf-warm)]" />
                <div>
                  <p className="text-lg font-bold text-[var(--pf-text)]">Konami Code Activated!</p>
                  <p className="text-sm text-[var(--pf-text-2)]">You found the secret! You&apos;re a true gamer.</p>
                </div>
                <Gamepad2 className="h-10 w-10 text-[var(--pf-accent)]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret hint — bottom right corner */}
      <div className="fixed bottom-4 right-4 z-30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 2 }}
          className="group cursor-default"
        >
          <span className="font-[var(--pf-mono)] text-[8px] text-[var(--pf-text-3)]/30 transition-colors group-hover:text-[var(--pf-accent)]/50">
            ↑↑↓↓←→←→BA
          </span>
        </motion.div>
      </div>
    </>
  );
}
