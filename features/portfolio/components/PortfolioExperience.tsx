"use client";
import { ScrollReveal } from "./ScrollReveal";
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react";

const experiences = [
  { role: "SOFTWARE ENGINEER", company: "Jobaaj", location: "India", period: "Feb 2026 — Present", current: true,
    responsibilities: ["Full-stack development — React, Next.js, Node.js", "AI-powered systems — mock interviews, adaptive engines", "Payment & credit system integration", "Admin & management dashboards", "API design & third-party integrations", "Real-time features — WebSocket, live state"] },
  { role: "FULL STACK DEVELOPER", company: "Arema Technology", location: "India", period: "2024 — 2025", current: false,
    responsibilities: ["End-to-end web application development", "REST API design & database modeling", "Frontend architecture with React & Next.js", "Server-side rendering & performance optimization", "Cross-functional collaboration with design teams"] },
];

export function PortfolioExperience() {
  return (
    <section className="relative border-t border-[var(--pf-border)] bg-[var(--pf-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <ScrollReveal>
          <div className="mb-12">
            <span className="font-[var(--pf-mono)] text-[10px] tracking-[0.25em] text-[var(--pf-text-3)]">03 / EXPERIENCE</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--pf-text)] sm:text-3xl">Experience</h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-[var(--pf-accent)]/40 via-[var(--pf-accent)]/20 to-transparent sm:left-8" />
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.company} delay={i * 0.15}>
                <div className="relative pl-12 sm:pl-20">
                  <div className="absolute left-2.5 top-1 flex h-4 w-4 -translate-x-1/2 items-center justify-center sm:left-7">
                    <span className={`block h-3 w-3 rounded-full ring-4 ring-[var(--pf-bg)] ${exp.current ? "bg-[var(--pf-accent)] shadow-lg shadow-[var(--pf-accent)]/30" : "bg-[var(--pf-text-3)]"}`} />
                  </div>
                  <div className={`rounded-2xl border p-6 transition-all duration-300 sm:p-8 ${exp.current ? "border-[var(--pf-accent)]/30 bg-[var(--pf-surface)] shadow-lg shadow-[var(--pf-accent)]/5" : "border-[var(--pf-border)] bg-[var(--pf-surface)]/60 hover:border-[var(--pf-accent)]/20"}`}>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--pf-text-3)]">
                      {exp.current && <span className="rounded-full bg-[var(--pf-accent)]/10 px-2.5 py-1 font-[var(--pf-mono)] text-[10px] font-medium text-[var(--pf-accent)]">CURRENT</span>}
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{exp.period}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>
                    </div>
                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--pf-accent)]/10 text-[var(--pf-accent)]">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-[var(--pf-text)]">{exp.role}</h3>
                        <p className="mt-0.5 font-[var(--pf-mono)] text-sm text-[var(--pf-accent)]">{exp.company}</p>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {exp.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--pf-text-2)]">
                          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pf-accent)]" />{r}
                        </li>
                      ))}
                    </ul>
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
