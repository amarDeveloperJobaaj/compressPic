"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Layers,
  Briefcase,
  FolderKanban,
  MessageCircle,
  Gamepad2,
  Sun,
  Moon,
  ArrowUp,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: typeof Search;
  action: () => void;
  section?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = useCallback(() => {
    const root = document.querySelector(".portfolio-root");
    if (root) {
      root.classList.toggle("portfolio-light");
      root.classList.toggle("portfolio-dark");
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const commands: CommandItem[] = [
    { id: "about", label: "About", description: "Learn about Amar", icon: User, action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "stack", label: "Engineering Stack", description: "Technologies and tools", icon: Layers, action: () => document.getElementById("stack")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "experience", label: "Experience", description: "Work history as git commits", icon: Briefcase, action: () => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "projects", label: "Projects", description: "Featured case studies", icon: FolderKanban, action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "play", label: "Play Games", description: "Journey game & terminal", icon: Gamepad2, action: () => document.getElementById("play")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "contact", label: "Contact", description: "Get in touch", icon: MessageCircle, action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "theme", label: "Toggle Theme", description: "Switch light/dark mode", icon: Sun, action: toggleTheme },
    { id: "top", label: "Back to Top", description: "Scroll to top", icon: ArrowUp, action: scrollToTop },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-4 left-4 z-30 xl:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] px-2.5 py-1.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)] transition-colors hover:border-[var(--pf-accent)]/30 hover:text-[var(--pf-accent)]"
        >
          <Command className="h-3 w-3" />
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-x-4 top-[15%] z-[101] mx-auto max-w-lg overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-2xl"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-[var(--pf-border)] px-4 py-3">
                <Search className="h-4 w-4 text-[var(--pf-text-3)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-[var(--pf-text)] outline-none placeholder:text-[var(--pf-text-3)]"
                />
                <kbd className="rounded border border-[var(--pf-border)] bg-[var(--pf-bg)] px-1.5 py-0.5 font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[var(--pf-text-3)]">
                    No results found
                  </div>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          i === selectedIndex
                            ? "bg-[var(--pf-accent)]/10 text-[var(--pf-text)]"
                            : "text-[var(--pf-text-2)] hover:bg-[var(--pf-bg)]"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${i === selectedIndex ? "text-[var(--pf-accent)]" : "text-[var(--pf-text-3)]"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{cmd.label}</p>
                          <p className="truncate text-[10px] text-[var(--pf-text-3)]">{cmd.description}</p>
                        </div>
                        {i === selectedIndex && (
                          <kbd className="rounded border border-[var(--pf-border)] bg-[var(--pf-bg)] px-1.5 py-0.5 font-[var(--pf-mono)] text-[8px] text-[var(--pf-text-3)]">
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="border-t border-[var(--pf-border)] px-4 py-2 font-[var(--pf-mono)] text-[9px] text-[var(--pf-text-3)]">
                <span className="mr-3">↑↓ navigate</span>
                <span className="mr-3">↵ select</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
