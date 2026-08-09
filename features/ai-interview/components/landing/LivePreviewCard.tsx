"use client";

import { motion } from "framer-motion";
import { Bot, Mic, Video, Volume2 } from "lucide-react";

/**
 * Floating glass preview of the live interview room — AI avatar orb,
 * question bubble, and room controls. Gently bobs in place.
 */
export function LivePreviewCard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="w-72 rounded-2xl border border-white/10 bg-surface/70 p-5 shadow-2xl shadow-primary/25 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-error">Live</span>
        </div>
        <span className="font-mono text-xs text-text-muted">18:42</span>
      </div>

      {/* AI interviewer avatar orb */}
      <div className="mt-5 flex justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-sky-500 to-indigo-600 shadow-lg shadow-primary/40">
            <Bot className="h-9 w-9 text-white" />
          </div>
          <span className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-primary/40 blur-lg" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface bg-success">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-text-primary">AI Interviewer</p>

      {/* Question bubble */}
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary-light/50 px-4 py-3 text-xs leading-relaxed text-text-primary">
        &ldquo;Tell me about a project you&apos;re proud of.&rdquo;
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {[
          { icon: Mic, label: "Mic" },
          { icon: Video, label: "Camera" },
          { icon: Volume2, label: "Speaker" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm"
          >
            <Icon className="h-4 w-4" />
          </span>
        ))}
      </div>
    </motion.div>
  );
}
