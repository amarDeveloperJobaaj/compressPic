import { ArrowRight, BarChart3, Bot, FileText, Mic, type LucideIcon } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: FileText,
    title: "Upload resume & pick a role",
    description:
      "Upload a PDF resume and choose your target role, domain, company, experience level, and interview type.",
  },
  {
    number: "02",
    icon: Bot,
    title: "Meet the AI interviewer",
    description:
      "A professional AI interviewer greets you in a realistic interview room with voice, video, and live follow-ups.",
  },
  {
    number: "03",
    icon: Mic,
    title: "Answer with your voice",
    description:
      "Hear questions out loud and answer with your microphone — or type when you prefer. The AI adapts to every answer.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Get your score report",
    description:
      "Receive a detailed AI report: overall score, category scores, strengths, weaknesses, and what to practice next.",
  },
];

/** How It Works — the single canonical flow, presented in 4 steps. */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="violet" sm dot className="mb-4">
            How It Works
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How an AI mock interview works
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            From setup to score report in four simple steps — one flow, no detours.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
              >
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 top-16 hidden h-px w-8 bg-gradient-to-r from-primary/30 to-transparent lg:block"
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                    {step.number}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 animate-glow-pulse rounded-xl bg-primary/40 blur-md"
                    />
                  </span>
                  <Icon className="h-5 w-5 text-text-muted transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <ShimmerButton href="/ai-mock-interview/setup">
            Start a free mock interview
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
