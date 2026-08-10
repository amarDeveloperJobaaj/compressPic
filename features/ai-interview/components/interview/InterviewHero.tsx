"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bot, PlayCircle } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { Capsule } from "@/components/ui/capsule";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AIInterviewer3D } from "./AIInterviewer3D";
import { Aurora } from "./Aurora";

/**
 * Premium AI-first hero (§5, §12, §40).
 *
 * Desktop: 45% copy left / 55% 3D avatar right. Mobile: badge → heading →
 * description → CTAs → avatar → status card → stats (dedicated composition,
 * not a shrunk desktop).
 *
 * Advanced scroll: the backdrop orbs parallax at different rates, the 3D
 * stage sinks + tilts back slightly, and the copy fades as you scroll away.
 * Everything is inert for reduced-motion users.
 */

const stats = [
  { value: "20+", label: "roles covered" },
  { value: "6", label: "interview types" },
  { value: "100%", label: "free to practice" },
];

export function InterviewHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 46]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Cinematic backdrop: layered parallax glows + drifting aurora */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 via-background to-background" />
        <Aurora />
        <motion.div
          style={reduced ? undefined : { y: orbY }}
          className="absolute -top-32 left-1/4 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          style={reduced ? undefined : { y: orbY2 }}
          className="absolute right-0 top-1/3 h-80 w-80 translate-x-1/3 rounded-full bg-sky-500/10 blur-3xl"
        />
        <motion.div
          style={reduced ? undefined : { y: orbY }}
          className="absolute bottom-0 left-0 h-72 w-96 -translate-x-1/3 rounded-full bg-indigo-500/10 blur-3xl"
        />
        {/* Slow rotating conic glow behind the avatar */}
        <div className="absolute left-[58%] top-[42%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite] rounded-full bg-[conic-gradient(from_90deg,rgba(56,189,248,0),rgba(56,189,248,0.12),rgba(139,92,246,0.12),rgba(56,189,248,0))] blur-2xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[45%_55%] lg:gap-6 lg:py-24">
        {/* ─── Copy ─── */}
        <motion.div
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          className="order-1 text-center lg:text-left"
        >
          <Capsule variant="primary" dot className="mb-6">
            AI-Powered Interview Preparation
          </Capsule>

          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-5xl xl:text-6xl">
            Practice Smarter.
            <span className="mt-1 block bg-gradient-to-r from-primary via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Interview Better.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-text-secondary lg:mx-0">
            Experience realistic AI mock interviews tailored to your resume, role,
            experience, and target company — with instant feedback after every answer.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <ShimmerButton href="/ai-mock-interview/setup" className="group">
              <Bot className="h-4 w-4" />
              Start Free Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ShimmerButton>

            <Link
              href="#how-it-works"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-7 text-sm font-semibold text-text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary-light/40 hover:text-primary active:scale-[0.98]"
            >
              <PlayCircle className="h-4 w-4 text-primary" />
              Explore How It Works
            </Link>
          </div>

          {/* Trust stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-2xl font-bold tracking-tight text-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── 3D AI interviewer (parallax sink + tilt) ─── */}
        <motion.div
          style={
            reduced
              ? undefined
              : { y: stageY, rotateX: stageRotate, transformStyle: "preserve-3d" }
          }
          className="order-2 lg:order-none"
        >
          <div style={{ perspective: 1000 }}>
            <AIInterviewer3D />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
