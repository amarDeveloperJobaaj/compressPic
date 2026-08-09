import Link from "next/link";
import { ArrowRight, Bot, PlayCircle } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AIInterviewer3D } from "./AIInterviewer3D";

/**
 * Premium AI-first hero (§5, §12, §40).
 *
 * Desktop: 45% copy left / 55% 3D avatar right. Mobile: badge → heading →
 * description → CTAs → avatar → status card → stats (dedicated composition,
 * not a shrunk desktop).
 */

const stats = [
  { value: "20+", label: "roles covered" },
  { value: "6", label: "interview types" },
  { value: "100%", label: "free to practice" },
];

export function InterviewHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Cinematic backdrop: layered soft glows (§ background layers) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 via-background to-background" />
        <div className="absolute -top-32 left-1/4 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 translate-x-1/3 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-96 -translate-x-1/3 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[45%_55%] lg:gap-6 lg:py-24">
        {/* ─── Copy ─── */}
        <div className="order-1 text-center lg:text-left">
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
        </div>

        {/* ─── 3D AI interviewer ─── */}
        <div className="order-2 lg:order-none">
          <AIInterviewer3D />
        </div>
      </div>
    </section>
  );
}
