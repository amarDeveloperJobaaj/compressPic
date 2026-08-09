import { cn } from "@/lib/utils";

/**
 * Decorative aurora glow field — slow-drifting blurred gradient orbs that
 * give sections a colorful "AI energy" backdrop. Pure CSS animation (no JS),
 * so it is safe to use in server components. Decorative only: aria-hidden,
 * pointer-events-none, and nothing critical lives here.
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -left-24 top-8 h-80 w-80 animate-[aurora-drift_16s_ease-in-out_infinite] rounded-full bg-sky-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-[aurora-drift_18s_ease-in-out_infinite] rounded-full bg-cyan-400/12 blur-3xl" />
      {/* Heavier orbs only on larger screens — keeps low-end mobile cheap */}
      <div className="absolute -right-16 top-1/4 hidden h-96 w-96 animate-[aurora-drift_20s_ease-in-out_infinite_reverse] rounded-full bg-indigo-500/15 blur-3xl sm:block" />
      <div className="absolute bottom-1/4 right-1/4 hidden h-56 w-56 animate-[aurora-drift_22s_ease-in-out_infinite_reverse] rounded-full bg-violet-500/12 blur-3xl sm:block" />
    </div>
  );
}
