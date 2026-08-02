import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Icon size in px (the SVG uses a 48×48 viewBox). Default 36. */
  size?: number;
  /** Render the "Vizo Tool" wordmark next to the mark. */
  withWordmark?: boolean;
  className?: string;
  /** Override the wordmark text styles (only used with withWordmark). */
  wordmarkClassName?: string;
}

/**
 * Vizo Tool brand logo.
 *
 * A rounded gradient tile with a glass highlight, an animated sheen sweep
 * and a subtle twinkling spark beside a geometric "V" monogram. The motion
 * is pure CSS (transform/opacity only — cheap for the GPU) and is disabled
 * automatically by the global prefers-reduced-motion rules in globals.css.
 *
 * Gradient IDs are namespaced with useId so multiple instances on one page
 * (header, footer, drawer) never collide.
 */
export function Logo({
  size = 36,
  withWordmark = false,
  className,
  wordmarkClassName,
}: LogoProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const bgId = `vizo-bg-${uid}`;
  const strokeId = `vizo-stroke-${uid}`;
  const sheenId = `vizo-sheen-${uid}`;
  const clipId = `vizo-clip-${uid}`;

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vizo Tool logo"
      className="block"
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="1" y="1" width="46" height="46" rx="13.5" />
        </clipPath>
      </defs>

      {/* Gradient tile */}
      <rect x="1" y="1" width="46" height="46" rx="13.5" fill={`url(#${bgId})`} />

      {/* Glass highlight + animated sheen (clipped to the tile) */}
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M1 15 C1 7.3 7.3 1 15 1 H33 C40.7 1 47 7.3 47 15 V19 H1 Z"
          fill="rgba(255,255,255,0.16)"
        />
        <rect
          x="-24"
          y="0"
          width="24"
          height="48"
          fill={`url(#${sheenId})`}
          className="animate-logo-shine"
        />
      </g>

      {/* Hairline edge */}
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13.5"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />

      {/* V monogram */}
      <path
        d="M15.5 31 L24 17 L32.5 31"
        stroke={`url(#${strokeId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Twinkling spark above the V */}
      <path d="M24 8.5 l1.7 2.3 -1.7 2.3 -1.7 -2.3 Z" fill="#FDE047" className="animate-logo-spark" />
    </svg>
  );

  if (!withWordmark) return mark;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {mark}
      <span
        className={cn(
          "text-lg font-bold tracking-tight text-text-primary",
          wordmarkClassName
        )}
      >
        Vizo{" "}
        <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
          Tool
        </span>
      </span>
    </span>
  );
}
