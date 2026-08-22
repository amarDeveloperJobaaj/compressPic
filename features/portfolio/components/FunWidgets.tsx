"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Code2,
  Zap,
  Coffee,
  Moon,
  Sun,
  Terminal,
  Headphones,
  Globe,
  Radio,
  Disc3,
  Music2,
  Play,
  Pause,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Live Coding Activity — counts up like a real IDE                   */
/* ------------------------------------------------------------------ */

export function LiveCodingActivity() {
  const [lines, setLines] = useState(42847);
  const [commits, setCommits] = useState(1203);
  const [cups, setCups] = useState(0);

  useEffect(() => {
    setCups(Math.floor(Math.random() * 5) + 3);

    const interval = setInterval(() => {
      setLines((l) => l + Math.floor(Math.random() * 3));
      if (Math.random() > 0.85) setCommits((c) => c + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5">
        <Code2 className="h-3 w-3 text-[var(--pf-accent)]" />
        <span className="text-[var(--pf-text-2)]">{lines.toLocaleString()}</span> lines of code
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5">
        <Zap className="h-3 w-3 text-[var(--pf-warm)]" />
        <span className="text-[var(--pf-text-2)]">{commits.toLocaleString()}</span> commits
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5">
        <Coffee className="h-3 w-3 text-[var(--pf-warm)]" />
        <span className="text-[var(--pf-text-2)]">{cups}</span> cups today
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fake Spotify / Music Player                                         */
/* ------------------------------------------------------------------ */

const songs = [
  { title: "Lo-Fi Beats to Code To", artist: "ChillHop Radio", Icon: Headphones },
  { title: "Interstellar Main Theme", artist: "Hans Zimmer", Icon: Globe },
  { title: "Blade Runner 2049", artist: "Hans Zimmer", Icon: Radio },
  { title: "Synthwave Coding", artist: "Lazerhawk", Icon: Disc3 },
  { title: "Dova Syndrome", artist: "Background Music", Icon: Music2 },
];

export function MusicPlayer() {
  const [playing, setPlaying] = useState(true);
  const [songIdx, setSongIdx] = useState(0);
  const song = songs[songIdx];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSongIdx((i) => (i + 1) % songs.length), 8000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-2.5">
      <button
        onClick={() => setPlaying(!playing)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pf-accent)]/10 text-[var(--pf-accent)] transition-colors hover:bg-[var(--pf-accent)]/20"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <div className="min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={song.title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 truncate text-xs font-medium text-[var(--pf-text)]"
          >
            <song.Icon className="h-3.5 w-3.5 shrink-0 text-[var(--pf-accent)]" />
            {song.title}
          </motion.div>
        </AnimatePresence>
        <p className="truncate text-[10px] text-[var(--pf-text-3)]">{song.artist}</p>
      </div>
      {/* Fake equalizer bars */}
      {playing && (
        <div className="ml-auto flex items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12 + Math.random() * 6, 4] }}
              transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              className="w-0.5 rounded-full bg-[var(--pf-accent)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status Badges — live status indicators                              */
/* ------------------------------------------------------------------ */

export function StatusBadges() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const hour = parseInt(time.split(":")[0]);
  const isDay = hour >= 6 && hour < 20;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
        </span>
        Available for work
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
        {isDay ? <Sun className="h-3 w-3 text-[var(--pf-warm)]" /> : <Moon className="h-3 w-3 text-[var(--pf-accent)]" />}
        {time} IST
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-1.5 font-[var(--pf-mono)] text-[10px] text-[var(--pf-text-3)]">
        <Terminal className="h-3 w-3 text-[var(--pf-accent)]" />
        vim &gt; vscode (fight me)
      </span>
    </div>
  );
}
