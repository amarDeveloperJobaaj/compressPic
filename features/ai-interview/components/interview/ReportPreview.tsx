"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Aurora } from "./Aurora";
import { Reveal } from "../motion/Reveal";

/**
 * Report preview (§21): animated score rings + weak/strong areas +
 * recommended improvements. Values are demo/preview — clearly labeled, no
 * fabricated real-world success percentages (§39).
 */

interface RingProps {
  label: string;
  score: number;
  delay?: number;
}

function ScoreRing({ label, score, delay = 0 }: RingProps) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
          <circle cx="55" cy="55" r={r} fill="none" strokeWidth="8" className="stroke-border" />
          <motion.circle
            cx="55"
            cy="55"
            r={r}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={circumference}
            initial={reduced ? undefined : { strokeDashoffset: circumference }}
            whileInView={reduced ? undefined : { strokeDashoffset: circumference - filled }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text-primary">{score}</span>
          <span className="text-[10px] text-text-muted">/100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-text-secondary">{label}</p>
    </div>
  );
}

const RINGS = [
  { label: "Overall", score: 78 },
  { label: "Technical Accuracy", score: 82 },
  { label: "Communication", score: 80 },
  { label: "Problem Solving", score: 79 },
  { label: "Confidence", score: 72 },
];

const STRENGTHS = ["Clear project explanations", "Strong technical vocabulary", "Good answer structure"];
const WEAKNESSES = ["System design depth", "Behavioral STAR stories", "Pace under pressure"];
const IMPROVEMENTS = [
  "Practice system design walkthroughs",
  "Prepare 3 STAR stories for common behavioral questions",
  "Do a timed mock to improve pacing",
];

export function ReportPreview() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section className="relative overflow-hidden border-t border-border bg-surface py-16 sm:py-20">
      <Aurora />
      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="success" sm dot className="mb-4">
            Detailed AI Feedback
          </Capsule>
          <Reveal variant="blur">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Get a professional interview report
            </h2>
          </Reveal>
          <p className="mt-3 text-lg text-text-secondary">
            Overall score, category scores, strengths, weaknesses, and a
            prioritized improvement plan — after every interview.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-primary/10 sm:p-10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {RINGS.map((ring, i) => (
              <ScoreRing key={ring.label} {...ring} delay={i * 0.12} />
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-text-muted">
            Preview — sample report shown for demonstration. Your real report is
            generated from your actual interview.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-success/25 bg-success-light/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Strong Areas
              </p>
              <ul className="mt-3 space-y-2">
                {STRENGTHS.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-warning/25 bg-warning-light/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-warning">
                <AlertCircle className="h-3.5 w-3.5" /> Weak Areas
              </p>
              <ul className="mt-3 space-y-2">
                {WEAKNESSES.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary-light/30 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> Recommended
              </p>
              <ul className="mt-3 space-y-2">
                {IMPROVEMENTS.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!reduced && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 rounded-xl bg-surface px-4 py-3 text-center text-sm font-medium text-text-primary"
            >
              Interview #3 · Score trend: <span className="font-bold text-primary">62 → 68 → 74 → 78</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
