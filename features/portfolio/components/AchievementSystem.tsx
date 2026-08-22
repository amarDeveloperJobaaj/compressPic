"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Eye } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "explorer", name: "Explorer", description: "Visited all sections", icon: "🗺", unlocked: false },
  { id: "terminal-hacker", name: "Terminal Hacker", description: "Typed a command in the terminal", icon: "💻", unlocked: false },
  { id: "game-player", name: "Game Player", description: "Started the Journey Game", icon: "🎮", unlocked: false },
  { id: "night-owl", name: "Night Owl", description: "Browsing after midnight", icon: "🦉", unlocked: false },
  { id: "speed-demon", name: "Speed Demon", description: "Scrolled through the whole page", icon: "⚡", unlocked: false },
  { id: "contact-seeker", name: "Contact Seeker", description: "Reached the contact section", icon: "📬", unlocked: false },
  { id: "theme-switcher", name: "Theme Switcher", description: "Toggled dark/light mode", icon: "🎨", unlocked: false },
  { id: "easter-egg", name: "Easter Egg", description: "Found the secret hint", icon: "🥚", unlocked: false },
];

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showPanel, setShowPanel] = useState(false);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);
  const [unlockQueue, setUnlockQueue] = useState<Achievement[]>([]);

  const unlock = useCallback((id: string) => {
    setAchievements((prev) => {
      const existing = prev.find((a) => a.id === id);
      if (!existing || existing.unlocked) return prev;

      const updated = prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a));

      // Queue the notification
      const achievement = updated.find((a) => a.id === id)!;
      setUnlockQueue((q) => [...q, achievement]);

      return updated;
    });
  }, []);

  // Process unlock queue
  useEffect(() => {
    if (newUnlock || unlockQueue.length === 0) return;
    const next = unlockQueue[0];
    setNewUnlock(next);
    setUnlockQueue((q) => q.slice(1));
    setTimeout(() => setNewUnlock(null), 3000);
  }, [newUnlock, unlockQueue]);

  // Track section visibility
  useEffect(() => {
    const sections = ["about", "stack", "experience", "projects", "play", "contact"];
    const visited = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id || "";
            if (sections.includes(id)) visited.add(id);
          }
        });

        // Check if all sections visited
        if (visited.size >= sections.length) {
          unlock("explorer");
        }
      },
      { rootMargin: "-30% 0px -30% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [unlock]);

  // Track terminal usage
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.key === "Enter") {
        unlock("terminal-hacker");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [unlock]);

  // Track game start
  useEffect(() => {
    const handler = () => unlock("game-player");
    window.addEventListener("game-started", handler);
    return () => window.removeEventListener("game-started", handler);
  }, [unlock]);

  // Track scrolling
  useEffect(() => {
    let scrolled = false;
    const handler = () => {
      if (!scrolled && window.scrollY > document.body.scrollHeight * 0.8) {
        scrolled = true;
        unlock("speed-demon");
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [unlock]);

  // Night owl check
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlock("night-owl");
  }, [unlock]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      {/* Achievement badge trigger */}
      <div className="fixed bottom-4 right-4 z-30">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            onClick={() => setShowPanel(true)}
            className="group flex items-center gap-1.5 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] px-2.5 py-1.5 transition-colors hover:border-[var(--pf-warm)]/30 hover:text-[var(--pf-warm)]"
          >
            <Trophy className="h-3 w-3 text-[var(--pf-warm)]" />
            <span className="font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)] group-hover:text-[var(--pf-warm)]">
              {unlockedCount}/{achievements.length}
            </span>
          </button>
        </motion.div>
      </div>

      {/* New unlock notification */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 left-1/2 z-[102] -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-xl border border-[var(--pf-warm)]/30 bg-[var(--pf-surface)] px-5 py-3 shadow-2xl shadow-[var(--pf-warm)]/10">
              <span className="text-2xl">{newUnlock.icon}</span>
              <div>
                <p className="text-xs font-bold text-[var(--pf-warm)]">Achievement Unlocked!</p>
                <p className="text-sm font-semibold text-[var(--pf-text)]">{newUnlock.name}</p>
                <p className="text-[10px] text-[var(--pf-text-3)]">{newUnlock.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 z-[101] mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[var(--pf-warm)]" />
                  <h3 className="text-sm font-bold text-[var(--pf-text)]">Achievements</h3>
                  <span className="rounded-full bg-[var(--pf-warm)]/10 px-2 py-0.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-warm)]">
                    {unlockedCount}/{achievements.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="rounded-lg p-1 text-[var(--pf-text-3)] transition-colors hover:text-[var(--pf-text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--pf-border)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--pf-accent)] to-[var(--pf-warm)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Badge grid */}
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 transition-all ${
                      a.unlocked
                        ? "border-[var(--pf-warm)]/20 bg-[var(--pf-warm)]/5"
                        : "border-[var(--pf-border)] bg-[var(--pf-bg)] opacity-40"
                    }`}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${a.unlocked ? "text-[var(--pf-text)]" : "text-[var(--pf-text-3)]"}`}>
                        {a.name}
                      </p>
                      <p className="truncate text-[9px] text-[var(--pf-text-3)]">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
