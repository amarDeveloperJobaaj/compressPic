import { CalendarCheck, ClipboardList, ShieldCheck, Timer } from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { Reveal } from "../motion/Reveal";

/**
 * "Why candidates use AI Interview" (§22) — real product benefits.
 * No fabricated testimonials or fake social proof (§39).
 */

const BENEFITS = [
  {
    icon: Timer,
    title: "Practice anytime, anywhere",
    description: "No scheduling, no waiting rooms. Start a mock interview whenever you have 20 minutes.",
  },
  {
    icon: CalendarCheck,
    title: "Realistic pressure",
    description: "Voice answers, live follow-ups, and a countdown clock simulate real interview pressure.",
  },
  {
    icon: ClipboardList,
    title: "Feedback that actually helps",
    description: "Concrete scores and specific improvement notes — not generic 'good job' advice.",
  },
  {
    icon: ShieldCheck,
    title: "Private and judgment-free",
    description: "Your resume and answers stay private. Practice freely without anyone watching.",
  },
];

export function WhyCandidates() {
  return (
    <section className="border-t border-border bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="teal" sm dot className="mb-4">
            Why Candidates Use AI Interview
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Practice the way real interviews feel
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Purpose-built to make your preparation realistic, measurable, and
            repeatable.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 2) * 0.08}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
