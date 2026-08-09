import Link from "next/link";
import { ArrowRight, BarChart3, Bot, CheckCircle2, FileText, Mic } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const highlights = [
  { icon: Mic, label: "Voice & video interview" },
  { icon: FileText, label: "Resume-based questions" },
  { icon: BarChart3, label: "Detailed AI score report" },
];

/** Landing hero — "Practice Interviews. Get Real Feedback." (master spec §83). */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-background to-background" />
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 animate-glow-pulse rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center sm:py-24">
        <div className="max-w-3xl animate-fade-in">
          <Capsule variant="primary" dot className="mb-6">
            Free AI Mock Interview Practice
          </Capsule>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
            Practice AI Interviews.
            <span className="mt-2 block bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">
              Get Real Feedback.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-text-secondary sm:text-xl">
            Practice personalized mock interviews with an AI interviewer based on
            your resume, role, domain, and career goals. Answer out loud, handle
            adaptive follow-ups, and get a detailed score report.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ShimmerButton href="/ai-mock-interview/setup">
              <Bot className="h-4 w-4" />
              Start Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ShimmerButton>

            <Link
              href="#how-it-works"
              className="group inline-flex h-12 items-center gap-2 rounded-full border-2 border-primary/20 bg-surface px-7 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary-light/50 active:scale-[0.98]"
            >
              See How It Works
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-sm text-text-secondary"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
