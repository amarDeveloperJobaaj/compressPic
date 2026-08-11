import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Brain,
  Briefcase,
  Building2,
  Code2,
  Coffee,
  Database,
  Figma,
  Globe,
  Layers,
  Layout,
  Megaphone,
  Server,
  Terminal,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { Capsule } from "@/components/ui/capsule";
import { ROLES } from "@/features/ai-interview/data/roles";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "../motion/TiltCard";

/** Icon per role — extend when a new role is registered. */
const roleIcons: Record<string, LucideIcon> = {
  "software-engineer": Code2,
  "frontend-developer": Layout,
  "backend-developer": Server,
  "full-stack-developer": Layers,
  "react-developer": Workflow,
  "node-js-developer": Terminal,
  "python-developer": Database,
  "java-developer": Coffee,
  "php-developer": Globe,
  "devops-engineer": Boxes,
  "data-analyst": BarChart3,
  "data-scientist": Brain,
  "product-manager": Briefcase,
  "ui-ux-designer": Figma,
  "hr-professional": Users,
  marketing: Megaphone,
  sales: Building2,
};

/** Role categories grid — keyword-rich "AI mock interview for [role]" entry points. */
export function RoleShowcase() {
  return (
    <section className="border-t border-border bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Capsule variant="success" sm dot className="mb-4">
            Choose Your Role
          </Capsule>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            AI interview practice for every role
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Pick the role you&apos;re targeting — the AI interviewer adapts every
            question to your job description.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ROLES.map((role, index) => {
            const Icon = roleIcons[role.id] ?? Code2;
            return (
              <Reveal key={role.id} delay={(index % 4) * 0.06} className="h-full">
                <TiltCard maxTilt={7} className="h-full">
                  <Link
                    href="/ai-mock-interview/setup"
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-text-primary">
                        {role.name}
                      </h3>
                    </div>
                    <p className="mt-3 flex-1 text-xs leading-relaxed text-text-secondary">
                      {role.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3.5 text-xs font-semibold text-primary">
                      Practice this role
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
