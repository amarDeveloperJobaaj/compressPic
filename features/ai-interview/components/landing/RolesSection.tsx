import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Code2,
  Layers,
  Layout,
  Server,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { ROLES } from "@/features/ai-interview/data/roles";

/** Icon per role — extend when a new role is registered. */
const roleIcons: Record<string, LucideIcon> = {
  "software-engineer": Code2,
  "frontend-developer": Layout,
  "backend-developer": Server,
  "full-stack-developer": Layers,
  "data-analyst": BarChart3,
  "data-scientist": Brain,
  "product-manager": Briefcase,
};

/** Role cards — keyword-rich "AI mock interview for [role]" entry points. */
export function RolesSection() {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="success" sm dot className="mb-4">
            Choose Your Role
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            AI interview practice for multiple roles
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Pick the role you&apos;re targeting — the AI interviewer adapts every
            question to your job description.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = roleIcons[role.id] ?? Code2;
            return (
              <Link
                key={role.id}
                href="/ai-mock-interview/setup"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-text-primary">{role.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {role.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-1.5 border-t border-border/70 pt-4 text-sm font-semibold text-primary">
                  Practice {role.name.toLowerCase()} interview
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
