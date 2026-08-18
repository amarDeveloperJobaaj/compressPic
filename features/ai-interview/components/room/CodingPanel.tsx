"use client";

import { useMemo, useState } from "react";
import { Braces, CheckCircle2, Loader2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RoomStatus } from "@/features/ai-interview/store/interview-room-store";

/**
 * Coding problem panel (master spec §13 — Phase 13 coding interview mode).
 *
 * Left: the problem statement rendered from the question JSON
 * ({statement, examples, constraints}); right: a plain code editor (textarea
 * with line numbers — MVP per the design doc; no external judge). Submitting
 * stores the code as the answer transcript, then the existing evaluate loop
 * runs with the coding evaluation context.
 */
interface CodingProblem {
  statement: string;
  examples: string[];
  constraints: string[];
}

function parseProblem(raw: string | null): CodingProblem | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.statement !== "string") return null;
    return {
      statement: parsed.statement,
      examples: Array.isArray(parsed.examples) ? parsed.examples.map(String) : [],
      constraints: Array.isArray(parsed.constraints) ? parsed.constraints.map(String) : [],
    };
  } catch {
    return null;
  }
}

export function CodingPanel({
  status,
  question,
  onSubmitCode,
  submitting = false,
}: {
  status: RoomStatus;
  question: string | null;
  onSubmitCode: (code: string) => void;
  submitting?: boolean;
}) {
  const problem = useMemo(() => parseProblem(question), [question]);
  const [code, setCode] = useState("");
  const lines = code.split("\n").length;

  const canAnswer = status === "active" || status === "listening";
  const waiting = status === "asking" || status === "processing" || status === "speaking";

  const submit = () => {
    if (!code.trim() || !canAnswer || submitting) return;
    onSubmitCode(code);
    setCode("");
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white shadow-md shadow-primary/30">
          <Braces className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
            Coding Challenge
          </p>
          <p className="text-[11px] text-text-muted">Write your solution below</p>
        </div>
      </div>

      {waiting && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-medium text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          {status === "processing" ? "Reviewing your solution…" : "Preparing the next problem…"}
        </div>
      )}

      {problem ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Problem statement */}
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <p className="text-sm font-semibold text-text-primary">{problem.statement}</p>

            {problem.examples.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                  Examples
                </p>
                <ul className="mt-2 space-y-2">
                  {problem.examples.map((example, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border/70 bg-background px-3 py-2 font-mono text-[12px] leading-relaxed text-text-secondary"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {problem.constraints.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                  Constraints
                </p>
                <ul className="mt-2 space-y-1.5">
                  {problem.constraints.map((constraint, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-text-secondary">
                      <span className="text-primary">•</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {canAnswer && (
              <button
                type="button"
                onClick={submit}
                disabled={!code.trim() || submitting}
                className={cn(
                  "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                  "hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit solution
                  </>
                )}
              </button>
            )}
          </div>

          {/* Code editor (plain textarea + line numbers — MVP) */}
          <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <p className="font-mono text-[11px] text-white/50">solution.js</p>
              {canAnswer && (
                <span className="text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="mr-1 inline h-3 w-3" />
                  Ready
                </span>
              )}
            </div>
            <div className="flex max-h-[420px] min-h-[260px]">
              <div
                aria-hidden
                className="select-none border-r border-white/10 px-3 py-3 text-right font-mono text-[12px] leading-6 text-white/25"
              >
                {Array.from({ length: Math.max(lines, 12) }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={!canAnswer}
                spellCheck={false}
                placeholder="// Write your solution here…"
                aria-label="Your code solution"
                className={cn(
                  "w-full resize-none bg-transparent px-3 py-3 font-mono text-[13px] leading-6 text-sky-100",
                  "placeholder:text-white/25 focus-visible:outline-none",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">
          {question ?? "The next coding problem will appear here."}
        </p>
      )}
    </div>
  );
}
