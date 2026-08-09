"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  FileUp,
  Mic,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Interactive process section (§15): 6 steps with animated connecting lines.
 * Each step activates sequentially as the user scrolls (whileInView stagger).
 */

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: FileUp,
    title: "Upload Resume",
    description: "Drop a PDF resume — the AI builds your candidate profile instantly.",
  },
  {
    number: "02",
    icon: Target,
    title: "Choose Target Role",
    description: "Pick your role, domain, company, and experience level.",
  },
  {
    number: "03",
    icon: Bot,
    title: "Start AI Interview",
    description: "Meet your AI interviewer in a realistic live interview room.",
  },
  {
    number: "04",
    icon: Mic,
    title: "Answer Questions",
    description: "Respond with voice or text — the AI listens and adapts.",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Get AI Feedback",
    description: "Receive per-answer scores and a detailed interview report.",
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Improve",
    description: "Practice again with prioritized topics and watch your scores climb.",
  },
];

export function HowItWorks() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="violet" sm dot className="mb-4">
            How It Works
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            From resume to report in six steps
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            One focused flow — every step prepares you for the real interview.
          </p>
        </div>

        <ol className="relative mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Animated connecting line (desktop) */}
          <motion.span
            aria-hidden="true"
            initial={reduced ? undefined : { scaleX: 0 }}
            whileInView={reduced ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-gradient-to-r from-primary/15 via-primary/40 to-primary/15 lg:block"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.number}
                initial={reduced ? undefined : { opacity: 0, y: 26 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-background text-sm font-bold text-primary shadow-lg shadow-primary/15">
                  {step.number}
                  <Icon className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-md bg-primary p-1 text-white" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
                {index < STEPS.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-5 top-5 hidden h-4 w-4 text-primary/40 lg:block"
                  />
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
