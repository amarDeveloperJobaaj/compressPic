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
 * a bust-sized hero fill. Gestures: drag anywhere on the stage to rotate the
 * avatar (up to ~40° yaw), plus a subtle pointer parallax (2–5°) on desktop.
 * Rotation eases back to rest after a moment idle. Decorative only — no
 * critical information lives in the canvas.
 *
 * While the model streams in, the premium CSS avatar (AIAvatarFallback)
 * overlays the canvas so the stage is never blank (§30).
 */

interface DragState {
  active: boolean;
  lastX: number;
  lastY: number;
  yaw: number;
  pitch: number;
  lastActive: number;
}

/** Pointer parallax + drag-to-rotate rig. */
function Rig({
  children,
  quality,
  drag,
}: {
  children: React.ReactNode;
  quality: QualityTier;
  drag: React.RefObject<DragState>;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  // Rig-owned decay state — the `drag` prop is only ever READ here (props are
  // immutable); the decayed rotation lives in our own refs.
  const decay = useRef({ yaw: 0, pitch: 0 });

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
    const d = drag.current;
    // Ease the drag rotation back to rest after ~1.6s idle — but never while
    // the pointer is still held down (even if it isn't moving).
    if (!d.active && performance.now() - d.lastActive > 1600) {
      decay.current.yaw *= 0.94;
      decay.current.pitch *= 0.94;
    } else {
      decay.current.yaw = d.yaw;
      decay.current.pitch = d.pitch;
    }
    // Springy combination: drag gesture (big) + pointer parallax (subtle).
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      decay.current.yaw + target.current.x * 0.09,
      delta * 2.4
    );
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      decay.current.pitch + target.current.y * 0.05,
      delta * 2.4
    );
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
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
    lastActive: 0,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.lastActive = performance.now();
    // Keep receiving drag events even when the pointer leaves the stage.
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.lastActive = performance.now();
    drag.current.yaw = THREE.MathUtils.clamp(
      drag.current.yaw + (e.clientX - drag.current.lastX) * 0.008,
      -0.75,
      0.75
    );
    drag.current.pitch = THREE.MathUtils.clamp(
      drag.current.pitch + (e.clientY - drag.current.lastY) * 0.005,
      -0.35,
      0.35
    );
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <div
      className="relative h-full w-full cursor-grab select-none [touch-action:pan-y] active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <Canvas
        dpr={quality === "high" ? [1, 1.75] : [1, 1.4]}
        camera={{ position: [0, 0.5, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        aria-hidden
        onCreated={({ camera }) => camera.lookAt(0, -0.12, 0)}
      >
        <AIAvatarLights low={quality === "low"} />
        <Rig quality={quality} drag={drag}>
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
