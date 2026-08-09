import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Cinematic final CTA (§25) — subtle AI glow behind, one clear action. */
export function InterviewCta() {
  return (
    <section className="border-t border-border py-16 sm:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-sky-600 px-6 py-16 text-center shadow-2xl shadow-primary/25 sm:px-12 sm:py-20">
          {/* Subtle AI visual: soft avatar silhouette + glows (§25) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-72 w-72 animate-glow-pulse rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -left-24 -top-24 h-72 w-72 animate-[aurora-drift_18s_ease-in-out_infinite] rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-56 w-56 animate-[hue-pulse_9s_ease-in-out_infinite] rounded-full bg-violet-300/15 blur-3xl" />
            {/* Abstract head silhouette */}
            <div className="absolute right-[12%] top-1/2 hidden h-44 w-36 -translate-y-1/2 rounded-t-full border border-white/15 bg-white/5 lg:block" />
            <div className="absolute right-[15%] top-[22%] hidden h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_12px_3px_rgba(34,211,238,0.5)] lg:block" />
            <div className="absolute right-[26%] top-[22%] hidden h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_12px_3px_rgba(34,211,238,0.5)] lg:block" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your next interview starts here.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-white/85">
              Practice with AI. Improve with feedback. Walk into your interview
              with confidence.
            </p>
            <div className="mt-9 flex justify-center">
              <Button
                asChild
                size="lg"
                className="group bg-white text-primary shadow-xl hover:bg-white hover:text-primary-dark"
              >
                <Link href="/ai-mock-interview/setup">
                  <Bot className="h-4 w-4" />
                  Start Free Interview
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-white/60">
              No sign-up required · Free to practice
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
