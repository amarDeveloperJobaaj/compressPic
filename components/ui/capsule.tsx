import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CapsuleVariant =
  | "success"
  | "primary"
  | "purple"
  | "sky"
  | "rose"
  | "amber"
  | "violet"
  | "teal"
  | "fuchsia"
  | "cyan"
  | "lime"
  | "orange";

interface CapsuleProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: CapsuleVariant;
  /** Optional leading icon. */
  icon?: LucideIcon;
  /** Shows a soft colored glow shadow (default true). */
  glow?: boolean;
  /** Small colored dot before the label. */
  dot?: boolean;
  /** Hover micro-interaction: lift + shine sweep. */
  interactive?: boolean;
  /** Smaller size variant for tight spaces (tool card badges). */
  sm?: boolean;
}

/**
 * Modern glowing capsule/badge. Each variant carries its own tinted
 * background, colored border, matching glow shadow and a shine sweep on hover.
 * All classes are static per variant so Tailwind can see them at build time.
 */
export function Capsule({
  variant = "primary",
  icon: Icon,
  glow = true,
  dot = false,
  interactive = true,
  sm = false,
  className,
  children,
  ...props
}: CapsuleProps) {
  return (
    <span
      className={cn(
        "group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border font-medium",
        sm ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1.5 text-xs",
        VARIANT_STYLES[variant].pill,
        glow && VARIANT_STYLES[variant].glow,
        interactive && "transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.04]",
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            VARIANT_STYLES[variant].dot
          )}
        />
      )}
      {Icon && <Icon className={cn("h-3.5 w-3.5 shrink-0", VARIANT_STYLES[variant].text)} />}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      {/* Shine sweep on hover */}
      {interactive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-[180%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[180%]"
        />
      )}
    </span>
  );
}

const VARIANT_STYLES: Record<CapsuleVariant, { pill: string; dot: string; glow: string; text: string }> = {
  success: {
    pill: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
    glow: "shadow-[0_0_14px_rgba(16,185,129,0.28)] hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]",
  },
  primary: {
    pill: "border-blue-400/40 bg-blue-500/10 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-300",
    glow: "shadow-[0_0_14px_rgba(59,130,246,0.28)] hover:shadow-[0_0_24px_rgba(59,130,246,0.5)]",
  },
  purple: {
    pill: "border-purple-400/40 bg-purple-500/10 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-300",
    glow: "shadow-[0_0_14px_rgba(168,85,247,0.28)] hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]",
  },
  sky: {
    pill: "border-sky-400/40 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
    glow: "shadow-[0_0_14px_rgba(14,165,233,0.28)] hover:shadow-[0_0_24px_rgba(14,165,233,0.5)]",
  },
  rose: {
    pill: "border-rose-400/40 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-300",
    glow: "shadow-[0_0_14px_rgba(244,63,94,0.28)] hover:shadow-[0_0_24px_rgba(244,63,94,0.5)]",
  },
  amber: {
    pill: "border-amber-400/40 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    glow: "shadow-[0_0_14px_rgba(245,158,11,0.3)] hover:shadow-[0_0_24px_rgba(245,158,11,0.55)]",
  },
  violet: {
    pill: "border-violet-400/40 bg-violet-500/10 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-300",
    glow: "shadow-[0_0_14px_rgba(139,92,246,0.28)] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]",
  },
  teal: {
    pill: "border-teal-400/40 bg-teal-500/10 text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300",
    dot: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-300",
    glow: "shadow-[0_0_14px_rgba(20,184,166,0.28)] hover:shadow-[0_0_24px_rgba(20,184,166,0.5)]",
  },
  fuchsia: {
    pill: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-700 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    glow: "shadow-[0_0_14px_rgba(217,70,239,0.28)] hover:shadow-[0_0_24px_rgba(217,70,239,0.5)]",
  },
  cyan: {
    pill: "border-cyan-400/40 bg-cyan-500/10 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-300",
    glow: "shadow-[0_0_14px_rgba(6,182,212,0.28)] hover:shadow-[0_0_24px_rgba(6,182,212,0.5)]",
  },
  lime: {
    pill: "border-lime-500/40 bg-lime-500/10 text-lime-700 dark:border-lime-500/30 dark:bg-lime-500/10 dark:text-lime-300",
    dot: "bg-lime-500",
    text: "text-lime-600 dark:text-lime-300",
    glow: "shadow-[0_0_14px_rgba(101,163,13,0.28)] hover:shadow-[0_0_24px_rgba(101,163,13,0.5)]",
  },
  orange: {
    pill: "border-orange-400/40 bg-orange-500/10 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-300",
    glow: "shadow-[0_0_14px_rgba(249,115,22,0.3)] hover:shadow-[0_0_24px_rgba(249,115,22,0.55)]",
  },
};
