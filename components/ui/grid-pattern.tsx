import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  size?: number;
  /** Stroke opacity (0–1). */
  opacity?: number;
}

/** Subtle SVG grid background with a radial fade-out mask. */
export function GridPattern({ className, size = 44, opacity = 0.12 }: GridPatternProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]",
        className
      )}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
            <path
              d={`M ${size} 0 H 0 V ${size}`}
              fill="none"
              stroke="currentColor"
              strokeOpacity={opacity}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}
