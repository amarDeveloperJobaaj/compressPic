"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  /** When provided, the button renders as a next/link anchor. */
  href?: string;
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * Aceternity-style shimmer button — a moving light sweep across the surface.
 * Renders as a next/link anchor when `href` is provided, otherwise a <button>.
 * The shimmer keyframes are scoped per instance via an inline <style> tag.
 */
export function ShimmerButton({
  shimmerColor = "#ffffff",
  borderRadius = "9999px",
  shimmerDuration = "2.5s",
  background = "rgba(37, 99, 235, 1)",
  className,
  children,
  href,
  onClick,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: ShimmerButtonProps) {
  const classes = cn(
    "group relative z-0 inline-flex h-12 items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-7 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 will-change-transform hover:shadow-xl hover:shadow-primary/35 active:translate-y-[1px] active:scale-[0.98]",
    className
  );
  const style = { backgroundColor: background, borderRadius };

  const content = (
    <>
      {/* Moving shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}99, transparent)`,
          transform: "translateX(-150%) skewX(-20deg)",
          animation: `shimmer-sweep ${shimmerDuration} infinite`,
        }}
      />
      {/* Soft inner top-light */}
      <span
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
      <style>{`@keyframes shimmer-sweep { 100% { transform: translateX(250%) skewX(-20deg); } }`}</style>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={classes} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        classes,
        disabled && "pointer-events-none opacity-50"
      )}
      style={style}
    >
      {content}
    </button>
  );
}
