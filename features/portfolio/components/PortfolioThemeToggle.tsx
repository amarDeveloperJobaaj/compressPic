"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function PortfolioThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pf-theme");
    if (saved === "light") {
      setDark(false);
      document.querySelector(".portfolio-root")?.classList.remove("portfolio-dark");
      document.querySelector(".portfolio-root")?.classList.add("portfolio-light");
    }
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      const root = document.querySelector(".portfolio-root");
      if (next) {
        root?.classList.remove("portfolio-light");
        root?.classList.add("portfolio-dark");
        localStorage.setItem("pf-theme", "dark");
      } else {
        root?.classList.remove("portfolio-dark");
        root?.classList.add("portfolio-light");
        localStorage.setItem("pf-theme", "light");
      }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text-3)] transition-all hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]"
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
