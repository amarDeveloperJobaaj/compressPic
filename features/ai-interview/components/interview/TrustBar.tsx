import { Code2, FileText, Landmark, MessageSquare, Users, BrainCircuit, type LucideIcon } from "lucide-react";

/** Trust bar items (§14). */
const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Code2, label: "Technical" },
  { icon: MessageSquare, label: "HR" },
  { icon: Users, label: "Behavioral" },
  { icon: BrainCircuit, label: "Coding" },
  { icon: Landmark, label: "Company Interviews" },
  { icon: FileText, label: "Resume-Based" },
];

/** Minimal trust bar — "Built for modern interview preparation". */
export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface/60 py-8">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Built for modern interview preparation
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {ITEMS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              <Icon className="h-4 w-4 text-primary/70" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
