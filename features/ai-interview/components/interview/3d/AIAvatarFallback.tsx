/**
 * Premium static AI interviewer visual — pure CSS, no WebGL.
 *
 * Shown when: WebGL is unavailable, the device is low-power, the user prefers
 * reduced motion, or while the 3D chunk loads. Deliberately abstract (a soft
 * luminous head silhouette + shoulders) so it reads as a calm AI presence
 * rather than a cartoon robot — never a broken canvas.
 */
export function AIAvatarFallback({
  loading = false,
}: {
  /** Show a subtle "Preparing your AI interviewer…" pulse. */
  loading?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/5] w-full max-w-[340px]"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 rounded-[50%] bg-primary/15 blur-3xl" />

      {/* Shoulders / bust silhouette */}
      <div className="absolute bottom-[6%] left-1/2 h-[38%] w-[68%] -translate-x-1/2 rounded-t-[48%] bg-gradient-to-b from-surface to-border/60 shadow-inner" />

      {/* Neck */}
      <div className="absolute bottom-[36%] left-1/2 h-[12%] w-[16%] -translate-x-1/2 rounded-full bg-border/70" />

      {/* Head — smooth luminous shell */}
      <div className="absolute bottom-[42%] left-1/2 h-[46%] w-[52%] -translate-x-1/2 rounded-[48%] bg-gradient-to-b from-white via-surface to-border/50 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.35)] dark:from-slate-200 dark:via-slate-300 dark:to-slate-500" />

      {/* Face hint — subtle nose */}
      <div className="absolute bottom-[46%] left-1/2 h-[9%] w-[9%] -translate-x-1/2 rounded-full bg-border/50" />

      {/* Glowing eyes */}
      <div className="absolute bottom-[56%] left-[44%] h-[5%] w-[6%] rounded-full bg-cyan-400 shadow-[0_0_14px_4px_rgba(34,211,238,0.6)]" />
      <div className="absolute bottom-[56%] right-[44%] h-[5%] w-[6%] rounded-full bg-cyan-400 shadow-[0_0_14px_4px_rgba(34,211,238,0.6)]" />

      {/* Subtle temple light lines */}
      <div className="absolute bottom-[54%] left-[24%] h-[16%] w-[1.5px] rotate-[24deg] rounded-full bg-sky-300/60" />
      <div className="absolute bottom-[54%] right-[24%] h-[16%] w-[1.5px] -rotate-[24deg] rounded-full bg-sky-300/60" />

      {/* Orbit hint */}
      <div className="absolute bottom-[18%] left-1/2 h-[86%] w-[86%] -translate-x-1/2 rounded-full border border-primary/20" />

      {loading && (
        <div className="absolute bottom-[-8%] left-1/2 -translate-x-1/2 animate-pulse rounded-full bg-primary/15 px-4 py-1.5 text-[11px] font-medium text-primary">
          Preparing your AI interviewer…
        </div>
      )}
    </div>
  );
}
