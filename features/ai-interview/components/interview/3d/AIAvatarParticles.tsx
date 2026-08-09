"use client";

import { Sparkles } from "@react-three/drei";

import type { QualityTier } from "./types";

/**
 * Ambient particles + subtle orbiting satellites around the avatar.
 * Particle counts are quality-aware (§34) and deliberately low — a sparse
 * "data field", never a starfield or explosion.
 */

const COUNTS: Record<QualityTier, number> = {
  high: 34,
  medium: 20,
  low: 0,
};

export function AIAvatarParticles({ quality }: { quality: QualityTier }) {
  const count = COUNTS[quality];

  return (
    <>
      {count > 0 && (
        <Sparkles
          count={count}
          scale={[5, 3.4, 3]}
          size={1.6}
          speed={0.25}
          opacity={0.55}
          color="#93C5FD"
          position={[0, 0.2, 0]}
        />
      )}
      {quality === "high" && (
        <>
          {/* Two faint wireframe satellites — barely-there orbital detail */}
          <mesh position={[-2.2, 1.4, -1.4]}>
            <icosahedronGeometry args={[0.28, 1]} />
            <meshBasicMaterial wireframe color="#38BDF8" transparent opacity={0.18} />
          </mesh>
          <mesh position={[2.4, 1.1, -1.8]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial wireframe color="#818CF8" transparent opacity={0.16} />
          </mesh>
        </>
      )}
    </>
  );
}
