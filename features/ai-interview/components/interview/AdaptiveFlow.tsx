"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Brain,
  ChevronRight,
  Gauge,
  MessageSquare,
  RefreshCw,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Adaptive AI section (§18): the interviewer is an engine, not a question
 * generator. A scroll-triggered flow animates each stage in sequence.
 */

interface FlowStage {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const FLOW: FlowStage[] = [
  { icon: AudioLines, label: "AI listens", detail: "Hears every answer with voice or text input" },
  { icon: Brain, label: "Evaluates", detail: "Scores accuracy, relevance, clarity, depth" },
  { icon: RefreshCw, label: "Adapts", detail: "Adjusts difficulty to your performance" },
  { icon: MessageSquare, label: "Asks follow-up", detail: "Digs into weak spots like a real interviewer" },
  { icon: Gauge, label: "Changes difficulty", detail: "Harder when strong, clearer when stuck" },
  { icon: Zap, label: "Generates feedback", detail: "Instant, specific, and actionable" },
];

export function AdaptiveFlow() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section className="border-t border-border bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="cyan" sm dot className="mb-4">
            Adaptive AI
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            An interviewer that thinks, not a question generator
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Every answer reshapes the interview — the AI evaluates, adapts, and
            follows up the way a senior interviewer would.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.label}
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                className="group relative rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{stage.label}</p>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                  {stage.detail}
                </p>
                {index < FLOW.length - 1 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary/40 lg:block"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
