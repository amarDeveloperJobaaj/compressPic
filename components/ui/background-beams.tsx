import { cn } from "@/lib/utils";

interface BackgroundBeamsProps {
  className?: string;
}

/**
 * Aurora-style animated background beams for the hero.
 * Uses the `beam-slow` / `beam-slow-reverse` keyframes defined in app/globals.css.
 */
export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="animate-beam-slow absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[120px]" />
      <div className="animate-beam-slow-reverse absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-[120px]" />
      <div className="animate-beam-slow absolute bottom-0 left-1/3 h-[24rem] w-[36rem] rounded-full bg-indigo-400/15 blur-[140px]" />
      <div className="animate-beam-slow-reverse absolute bottom-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full bg-primary/15 blur-[120px]" />
    </div>
  );
}
