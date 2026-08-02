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
      {/* Smaller + cheaper on mobile: fewer beams, lower opacity, tighter blur.
          The heavy beam-slow animation is frozen below 640px via globals.css,
          and will-change is dropped there too (max-sm:will-change-auto) so it
          doesn't hold large GPU layers for animations that never run.
          On desktop, will-change-transform promotes each beam to its own layer
          so the translate/scale keyframes don't repaint the blurred surface
          every frame. */}
      <div className="animate-beam-slow will-change-transform max-sm:will-change-auto absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[120px] max-sm:h-[20rem] max-sm:w-[20rem] max-sm:bg-primary/10 max-sm:blur-[80px]" />
      <div className="animate-beam-slow-reverse will-change-transform max-sm:will-change-auto absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-[120px] max-sm:hidden" />
      <div className="animate-beam-slow will-change-transform max-sm:will-change-auto absolute bottom-0 left-1/3 h-[24rem] w-[36rem] rounded-full bg-indigo-400/15 blur-[140px] max-sm:h-[16rem] max-sm:w-[20rem] max-sm:bg-indigo-400/10 max-sm:blur-[80px]" />
      <div className="animate-beam-slow-reverse will-change-transform max-sm:will-change-auto absolute bottom-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full bg-primary/15 blur-[120px] max-sm:hidden" />
    </div>
  );
}
