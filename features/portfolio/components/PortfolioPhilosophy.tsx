"use client";
import { ScrollReveal } from "./ScrollReveal";

const principles = [
  { number: "01", title: "BUILD FOR USERS", subtitle: "not just features.", description: "Every line of code should serve someone. If a feature doesn't make someone's life easier, it doesn't ship." },
  { number: "02", title: "KEEP IT SIMPLE", subtitle: "until complexity is necessary.", description: "Simple solutions are easier to maintain, debug, and scale. Add complexity only when the problem demands it." },
  { number: "03", title: "AUTOMATE", subtitle: "what should not be manual.", description: "Repetitive tasks are bugs in the workflow. If it can be scripted, it should be." },
  { number: "04", title: "MEASURE", subtitle: "before optimizing.", description: "Don't guess at performance problems. Profile, measure, and let data guide every optimization decision." },
];

export function PortfolioPhilosophy() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16">
          <ScrollReveal>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">05 / PHILOSOPHY</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">How I Think</h2>
              <p className="mt-3 max-w-xs text-sm text-[var(--pf-text-2)]">Engineering principles that guide every decision.</p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {principles.map((p, i) => (
              <ScrollReveal key={p.number} delay={i * 0.1}>
                <div className="group relative rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 transition-all duration-300 hover:border-[var(--pf-accent)]/20 sm:p-8">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--pf-accent)]/[0.04] blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start gap-6">
                    <span className="font-[var(--pf-mono)] text-3xl font-bold text-[var(--pf-accent)]/20 sm:text-4xl">{p.number}</span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-[var(--pf-text)] sm:text-2xl">{p.title}</h3>
                      <p className="mt-1 font-[var(--pf-mono)] text-sm text-[var(--pf-accent)]">{p.subtitle}</p>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--pf-text-2)]">{p.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
