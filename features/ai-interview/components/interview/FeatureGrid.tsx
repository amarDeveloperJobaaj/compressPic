import {
  AudioLines,
  Building2,
  FileText,
  GitBranch,
  Keyboard,
  MessageSquareQuote,
  Sparkles,
  Code2,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "../motion/TiltCard";

/** Feature cards (§17) — 8 concise, premium cards. */
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Resume-Based Interviews",
    description: "Questions built from your actual resume — skills, projects, and experience.",
  },
  {
    icon: Building2,
    title: "Company-Specific Interviews",
    description: "Practice patterns inspired by common interview styles and role expectations.",
  },
  {
    icon: GitBranch,
    title: "Adaptive AI Questions",
    description: "Strong answers lead to harder questions; weak areas get clarifications.",
  },
  {
    icon: Sparkles,
    title: "Instant AI Feedback",
    description: "Per-answer scores plus a detailed report with strengths and gaps.",
  },
  {
    icon: Code2,
    title: "Technical Interviews",
    description: "DSA, system design, and coding questions with structured evaluation.",
  },
  {
    icon: MessageSquareQuote,
    title: "HR & Behavioral Interviews",
    description: "Tell-me-about-yourself, situational, and STAR-format practice.",
  },
  {
    icon: AudioLines,
    title: "Voice Interviews",
    description: "Hear questions aloud and answer with your microphone, like a real call.",
  },
  {
    icon: Keyboard,
    title: "Coding Interviews",
    description: "Type your code and reasoning — the AI evaluates approach and output.",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="primary" sm dot className="mb-4">
            Everything You Need
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            One platform, every interview type
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Technical, HR, behavioral, coding, voice — the AI interviewer covers
            the formats real interviews use.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 4) * 0.07} className="h-full">
              <TiltCard maxTilt={7} className="h-full">
                <div className="group h-full rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {description}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
