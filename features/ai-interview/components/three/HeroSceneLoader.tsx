"use client";

import dynamic from "next/dynamic";

import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Lazy-loads the 3D hero scene only when it makes sense:
 * desktop + no reduced-motion preference. Everywhere else (mobile,
 * reduced motion, first paint) a lightweight CSS orb is shown so the
 * hero never depends on WebGL.
 */

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <StaticOrb />,
});

function StaticOrb() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      <div className="absolute inset-8 animate-glow-pulse rounded-full bg-gradient-to-br from-primary via-sky-500 to-indigo-600 shadow-[0_0_80px_20px_rgba(59,130,246,0.35)]" />
      <div className="absolute inset-0 rounded-full border border-primary/40 animate-[spin_14s_linear_infinite]" />
      <div className="absolute inset-5 rounded-full border border-sky-400/30 animate-[spin_22s_linear_infinite_reverse]" />
    </div>
  );
}

export function HeroSceneLoader() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Matches the `hidden lg:block` gate in HeroSection — don't load the
  // WebGL bundle on screens where the canvas is CSS-hidden anyway.
  const small = useMediaQuery("(max-width: 1023px)");

  if (reduced || small) return <StaticOrb />;
  return <HeroScene />;
}
