"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const SHORTCUTS = [
  { key: "1", action: "Go to Hero" },
  { key: "2", action: "Go to About" },
  { key: "3", action: "Go to Stack" },
  { key: "4", action: "Go to Experience" },
  { key: "5", action: "Go to Projects" },
  { key: "6", action: "Go to Play" },
  { key: "7", action: "Go to Contact" },
  { key: "?", action: "Toggle this panel" },
  { key: "Esc", action: "Close panel" },
];

const SECTION_MAP: Record<string, string> = {
  "1": "",
  "2": "about",
  "3": "stack",
  "4": "experience",
  "5": "projects",
  "6": "play",
  "7": "contact",
};

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "?") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // Section navigation
      const sectionId = SECTION_MAP[e.key];
      if (sectionId !== undefined) {
        e.preventDefault();
        if (sectionId === "") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Floating hint */}
      <div className="fixed bottom-4 left-4 z-30 hidden xl:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] px-2.5 py-1.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)] transition-colors hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]"
          >
            <Keyboard className="h-3 w-3" />
            Press <kbd className="mx-0.5 rounded border border-[var(--pf-border)] bg-[var(--pf-bg)] px-1 py-0.5 text-[8px]">?</kbd> for shortcuts
          </button>
        </motion.div>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-1/2 z-[101] mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-[var(--pf-accent)]" />
                  <h3 className="text-sm font-bold text-[var(--pf-text)]">Keyboard Shortcuts</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-[var(--pf-text-3)] transition-colors hover:text-[var(--pf-text)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {SHORTCUTS.map((s) => (
                  <div key={s.key} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-[var(--pf-bg)]">
                    <span className="text-sm text-[var(--pf-text-2)]">{s.action}</span>
                    <kbd className="rounded-md border border-[var(--pf-border)] bg-[var(--pf-bg)] px-2 py-0.5 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
                      {s.key}
                    </kbd>
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
