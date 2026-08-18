"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Bot, Mic, MicOff, Send, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useInterviewRoomStore } from "@/features/ai-interview/store/interview-room-store";

/**
 * Transcript panel (§17, §28) — every spoken/typed line lands here. The
 * candidate answers by voice (STT, Phase 6) or by typing — the text fallback
 * is ALWAYS reachable (§75). While the mic is listening, the live caption
 * shows what SpeechRecognition hears; "Stop & send" or a short silence
 * submits the answer through the room's question engine.
 */
export function TranscriptPanel({
  onSubmitAnswer,
  submitting = false,
  voiceSupported = false,
  voiceListening = false,
  liveCaption = "",
  voiceError = null,
  onVoiceSend,
  onVoiceStop,
}: {
  onSubmitAnswer: (text: string) => void;
  submitting?: boolean;
  /** Browser SpeechRecognition available. */
  voiceSupported?: boolean;
  /** The mic is listening for an answer right now. */
  voiceListening?: boolean;
  /** What the mic currently hears (final + interim). */
  liveCaption?: string;
  /** Last speech error — shown inline so text mode is never blocked. */
  voiceError?: string | null;
  /** Stop the mic and submit what it heard. */
  onVoiceSend?: () => void;
  /** Stop the mic without submitting (user switched to typing). */
  onVoiceStop?: () => void;
}) {
  const transcript = useInterviewRoomStore((s) => s.transcript);
  const status = useInterviewRoomStore((s) => s.status);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, liveCaption]);

  const canAnswer = status === "active" || status === "listening";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !canAnswer || submitting) return;
    onSubmitAnswer(text);
    setDraft("");
  };

  return (
    <div className="flex h-full min-h-[260px] flex-col rounded-2xl border border-border bg-surface">
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

        {/* Live speech caption — what the mic hears right now (§28) */}
        {voiceListening && (
          <div className="flex items-start justify-end gap-2.5">
            <div className="max-w-[85%]">
              <p className="flex items-center gap-2 rounded-2xl rounded-tr-sm border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2.5 text-sm leading-relaxed text-text-primary">
                <Mic className="h-3.5 w-3.5 shrink-0 animate-pulse text-cyan-400" />
                {liveCaption || "Listening…"}
              </p>
              {onVoiceSend && (
                <button
                  type="button"
                  onClick={onVoiceSend}
                  className="mt-1.5 ml-auto flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <MicOff className="h-3 w-3" />
                  Stop &amp; send
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {canAnswer && (
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => {
              // Choosing to type stops the mic listener — text takes over.
              if (voiceListening) onVoiceStop?.();
            }}
            placeholder={voiceSupported ? "Speak your answer, or type here…" : "Type your answer…"}
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

      {/* Voice status notes — always a text alternative, never audio-only (§17) */}
      {!voiceSupported && canAnswer && (
        <p className="border-t border-border px-5 py-2.5 text-[11px] leading-relaxed text-text-muted">
          Voice input isn&apos;t supported in this browser — type your answers.
        </p>
      )}
      {voiceError && (
        <p
          role="alert"
          className="border-t border-border px-5 py-2.5 text-[11px] leading-relaxed text-error"
        >
          {voiceError}
        </p>
      )}
    </div>
  );
}
