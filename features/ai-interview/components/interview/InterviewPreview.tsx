"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Mic, Sparkles, User } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Mock interview product preview (§16): a realistic question → answer →
 * analyzing → scores sequence. Runs on a loop; the whole card is labeled as
 * a product preview — values are demo, not real user data (§39).
 */

const SCORES = [
  { label: "Technical Accuracy", score: 92 },
  { label: "Communication", score: 87 },
  { label: "Confidence", score: 84 },
];

const STAGES = [
  { key: "question", ms: 3400 },
  { key: "answer", ms: 3400 },
  { key: "analyzing", ms: 2600 },
  { key: "scores", ms: 4200 },
] as const;

export function InterviewPreview() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [stage, setStage] = useState<(typeof STAGES)[number]["key"]>("question");
  const [stageIndex, setStageIndex] = useState(0);

  // Reduced motion: show the final scores statically (derived, no effect setState).
  const activeStage = reduced ? "scores" : stage;

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      const next = (stageIndex + 1) % STAGES.length;
      setStageIndex(next);
      setStage(STAGES[next].key);
    }, STAGES[stageIndex].ms);
    return () => clearTimeout(t);
  }, [stageIndex, reduced]);

  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="sky" sm dot className="mb-4">
            Live Interview Preview
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            What an AI interview looks like
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            A real product preview — question, your answer, instant evaluation.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-primary/10">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
            <span className="ml-3 text-xs font-medium text-text-muted">
              AI Mock Interview — Product Preview
            </span>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            {/* AI interviewer bubble */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white shadow-md shadow-primary/30">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-primary/20 bg-primary-light/40 px-4 py-3 text-sm leading-relaxed text-text-primary">
                “Tell me about a challenging project you worked on. What made it
                difficult and how did you handle it?”
              </div>
            </div>

            {/* Candidate answer bubble */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-text-secondary">
                “I built an HR management system with React and Node.js… the
                hardest part was keeping the payroll module consistent across
                time zones…”
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted">
                <User className="h-5 w-5" />
              </div>
            </div>

            {/* Analyzing + scores */}
            <div className="min-h-[120px] rounded-xl border border-border bg-surface p-5">
              <AnimatePresence mode="wait">
                {activeStage === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-sm font-medium text-text-primary"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Analyzing answer…
                  </motion.div>
                )}

                {activeStage === "scores" && (
                  <motion.div
                    key="scores"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Instant feedback (demo values)
                    </p>
                    {SCORES.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={reduced ? undefined : { opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.18 }}
                      >
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium text-text-primary">{s.label}</span>
                          <span className="text-text-secondary">{s.score}%</span>
                        </div>
                        <Progress value={s.score} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeStage !== "analyzing" && activeStage !== "scores" && (
                  <motion.p
                    key="mic-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-sm font-medium text-text-primary"
                  >
                    <Mic className="h-4 w-4 text-primary" />
                    Your turn — speak your answer…
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
