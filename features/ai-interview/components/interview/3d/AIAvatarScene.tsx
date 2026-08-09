"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from "three";

import { AIAvatarFallback } from "./AIAvatarFallback";
import { AIAvatarLights } from "./AIAvatarLights";
import { AIAvatarModel } from "./AIAvatarModel";
import { AIAvatarParticles } from "./AIAvatarParticles";
import type { AvatarSceneProps, QualityTier } from "./types";

/**
 * 3D scene for the AI interviewer avatar (glTF model — see AIAvatarModel).
 *
 * Framing: the model's head sits in the upper third of the frame, scaled to
 * a bust-sized hero fill. A subtle pointer rig rotates it 2–5° max (never a
 * full spin). Decorative only — no critical information lives in the canvas.
 *
 * While the model streams in, the premium CSS avatar (AIAvatarFallback)
 * overlays the canvas so the stage is never blank (§30).
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

/** Shows the premium CSS avatar while the glTF model streams in. */
function ModelLoadingOverlay() {
  const { active } = useProgress();
  // Start hidden when the model is already cached (no 250ms flash on remount).
  const [visible, setVisible] = useState(() => useProgress.getState().active);

  useEffect(() => {
    // Hide shortly after the load finishes; re-show instantly when one starts.
    const id = window.setTimeout(() => setVisible(active), active ? 0 : 250);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <AIAvatarFallback loading />
    </div>
  );
}

export function AIAvatarScene({ state, quality }: AvatarSceneProps) {
  return (
    <div className="relative h-full w-full">
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

      <ModelLoadingOverlay />
    </div>
  );
}
