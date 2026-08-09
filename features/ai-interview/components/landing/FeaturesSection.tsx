import {
  FileText,
  GitBranch,
  Keyboard,
  Mic,
  Type,
  Video,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "../motion/TiltCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Video,
    title: "Realistic interview room",
    description:
      "A Zoom-style video meeting with your camera, microphone, and an AI interviewer that listens, thinks, and responds.",
  },
  {
    icon: FileText,
    title: "Resume-based questions",
    description:
      "Questions built from your actual resume — skills, projects, and experience — with deep-dives on what you mention.",
  },
  {
    icon: GitBranch,
    title: "Adaptive follow-ups",
    description:
      "Every answer changes the interview. Strong answers get harder questions; weak areas get clarifications and concept checks.",
  },
  {
    icon: Mic,
    title: "Voice-first interaction",
    description:
      "Hear questions read aloud and answer with your voice — just like a real online interview.",
  },
  {
    icon: Type,
    title: "Instant transcript",
    description:
      "Every answer is transcribed live so you can review exactly what you said, question by question.",
  },
  {
    icon: Keyboard,
    title: "Text fallback always",
    description:
      "No microphone or quiet surroundings? Type your answers instead — the interview never stops.",
  },
];

/** Meet the AI interviewer + what the experience feels like (spec §84 sections). */
export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-surface py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="primary" sm dot className="mb-4">
            Meet Your AI Interviewer
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            A realistic interview, not a chatbot
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            The AI interviewer behaves like a professional interviewer — one
            question at a time, with natural follow-ups and honest feedback.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.08} className="h-full">
            <TiltCard maxTilt={7} className="h-full">
            <div className="group h-full rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
            </div>
            </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
