import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Final call to action — closes the funnel (spec §84, §117). */
export function FinalCtaSection() {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-sky-600 px-6 py-14 text-center shadow-2xl shadow-primary/25 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-glow-pulse rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Practice like it&apos;s real. Improve before the real interview.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-white/80">
            Your first AI mock interview takes less than a minute to set up —
            and it&apos;s completely free.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="bg-white text-primary shadow-xl hover:bg-white hover:text-primary-dark">
              <Link href="/ai-mock-interview/setup">
                <Bot className="h-4 w-4" />
                Start your first AI mock interview
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
