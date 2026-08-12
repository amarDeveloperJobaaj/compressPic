"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Bot, Send, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useInterviewRoomStore } from "@/features/ai-interview/store/interview-room-store";

/**
 * Transcript panel (§17, §28) — every spoken/typed line lands here. The
 * candidate answers via the text fallback (voice lands in Phase 6); the line
 * is appended locally for instant feedback and the room persists it through
 * the question engine (Phase 5) before the next question arrives.
 */
export function TranscriptPanel({
  onSubmitAnswer,
  submitting = false,
}: {
  onSubmitAnswer: (text: string) => void;
  submitting?: boolean;
}) {
  const transcript = useInterviewRoomStore((s) => s.transcript);
  const status = useInterviewRoomStore((s) => s.status);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript]);

  const canAnswer = status === "active" || status === "listening";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !canAnswer || submitting) return;
    onSubmitAnswer(text);
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-[220px] flex-col rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Transcript</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4" aria-live="polite">
        {transcript.length === 0 ? (
          <p className="pt-6 text-center text-sm text-text-muted">
            The conversation will appear here.
          </p>
        ) : (
          transcript.map((entry) =>
            entry.speaker === "interviewer" ? (
              <div key={entry.id} className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-primary/20 bg-primary-light/40 px-3.5 py-2.5 text-sm leading-relaxed text-text-primary">
                  {entry.text}
                </p>
              </div>
            ) : (
              <div key={entry.id} className="flex items-start justify-end gap-2.5">
                <p className="max-w-[85%] rounded-2xl rounded-tr-sm border border-border bg-background px-3.5 py-2.5 text-sm leading-relaxed text-text-secondary">
                  {entry.text}
                </p>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted">
                  <User className="h-4 w-4" />
                </div>
              </div>
            )
          )
        )}
      </div>

      {canAnswer && (
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your answer (voice comes later)…"
            aria-label="Your answer"
            className="h-10 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <button
            type="submit"
            aria-label="Send answer"
            disabled={!draft.trim() || submitting}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors",
              "hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
