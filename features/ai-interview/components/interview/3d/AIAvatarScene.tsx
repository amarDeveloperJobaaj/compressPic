"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { AIAvatarLights } from "./AIAvatarLights";
import { AIAvatarModel } from "./AIAvatarModel";
import { AIAvatarParticles } from "./AIAvatarParticles";
import type { AvatarSceneProps, QualityTier } from "./types";

/**
 * 3D scene for the AI interviewer avatar.
 *
 * Framing: bust composition — chest/shoulder up, face as the visual focus.
 * A subtle pointer rig rotates the avatar 2–5° max (never a full spin).
 * Decorative only — no critical information lives in the canvas (§31).
 */

/** Subtle mouse-driven rig — 2–5 degrees max, desktop only. */
function Rig({
  children,
  quality,
}: {
  children: React.ReactNode;
  quality: QualityTier;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (quality === "low") return;
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [quality]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    // Small, springy rotation (±2–5°).
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.x * 0.09, delta * 1.8);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.y * 0.05, delta * 1.8);
  });

  return <group ref={group}>{children}</group>;
}

export function AIAvatarScene({ state, quality }: AvatarSceneProps) {
  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.4]}
      camera={{ position: [0, 0.5, 4.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
      onCreated={({ camera }) => camera.lookAt(0, -0.12, 0)}
    >
      <AIAvatarLights low={quality === "low"} />
      <Rig quality={quality}>
        <group position={[0, 0.1, 0]} scale={quality === "low" ? 0.86 : 1}>
          <Suspense fallback={null}>
            <AIAvatarModel state={state} />
          </Suspense>
          <AIAvatarParticles quality={quality} />
        </group>
      </Rig>
    </Canvas>
  );
}
