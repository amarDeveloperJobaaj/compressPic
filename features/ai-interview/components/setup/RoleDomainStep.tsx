"use client";

import {
  BarChart3,
  Brain,
  Briefcase,
  Check,
  Code2,
  Layers,
  Layout,
  Server,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { DOMAINS } from "@/features/ai-interview/data/domains";
import { ROLES } from "@/features/ai-interview/data/roles";
import { useInterviewStore } from "@/features/ai-interview/store/interview-store";
import { SelectableChip } from "./SelectableChip";

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

/** Step 1 — target role (cards) + domain (chips). */
export function RoleDomainStep() {
  const roleId = useInterviewStore((s) => s.roleId);
  const domainId = useInterviewStore((s) => s.domainId);
  const setRoleId = useInterviewStore((s) => s.setRoleId);
  const setDomainId = useInterviewStore((s) => s.setDomainId);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Target role</h3>
        <p className="mt-1 text-sm text-text-secondary">
          The AI interviewer generates questions for this role.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = roleIcons[role.id] ?? Code2;
            const selected = roleId === role.id;
            return (
              <button
                key={role.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setRoleId(role.id)}
                className={cn(
                  "group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-primary bg-primary-light/60 shadow-lg shadow-primary/10"
                    : "border-border bg-surface hover:border-primary/40 hover:bg-primary-light/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    selected ? "bg-primary text-white" : "bg-primary-light text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">{role.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    {role.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected ? "border-primary bg-primary text-white" : "border-border text-transparent"
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-primary">Domain</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Pick the technology stack your questions should focus on.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {DOMAINS.map((domain) => (
            <SelectableChip
              key={domain.id}
              selected={domainId === domain.id}
              onSelect={() => setDomainId(domain.id)}
            >
              {domain.name}
            </SelectableChip>
          ))}
        </div>
      </div>
    </div>
  );
}
