"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import type { AvatarState } from "./types";

/**
 * AI interviewer — the "Cute Robot Mascot" model (CC BY 4.0) loaded from
 * /models/ai-bot.glb. Attribution: "Cute Robot Mascot" by hoangvt1403,
 * https://sketchfab.com/3d-models/cute-robot-mascot-2b3c7c0b2bce4f0e813c4d85221ea17d
 * (see docs/3D_ASSET_LICENSE.md).
 *
 * The GLB ships without animation clips, so the avatar stays alive through
 * procedural motion (§ AI states):
 *   idle      — gentle float + sway, subtle glow breathing
 *   listening — cyan emissive pulse
 *   thinking  — brighter scanning tint
 *   speaking  — soft rhythmic pulse + slight nod
 *   analyzing — steady glow + orbital progress ring fills around the bust
 *   success   — warm, calm glow
 */

const MODEL_URL = "/models/ai-bot.glb";

// Preload the model when this chunk loads (client-only — the scene is
// dynamically imported, so this never blocks first paint).
useGLTF.preload(MODEL_URL);

/** State-driven glow: intensity multiplier + emissive tint. */
const STATE_GLOW: Record<AvatarState, { intensity: number; color: string }> = {
  idle: { intensity: 1.0, color: "#FFFFFF" },
  listening: { intensity: 1.22, color: "#CFF2FF" },
  thinking: { intensity: 1.3, color: "#D6E8FF" },
  speaking: { intensity: 1.24, color: "#E4F7FF" },
  analyzing: { intensity: 1.34, color: "#CAEDFF" },
  success: { intensity: 1.12, color: "#FFEED8" },
};

export function AIAvatarModel({ state }: { state: AvatarState }) {
  const { scene } = useGLTF(MODEL_URL);

  const root = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringArc = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshStandardMaterial | null>(null);

  // Clone the cached scene once — and give it its own material — so the
  // per-state glow never mutates the useGLTF cache shared across mounts.
  const model = useMemo(() => {
    const clone = scene.clone(true) as THREE.Group;
    let shared: THREE.MeshStandardMaterial | null = null;
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mat = (
        Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      ) as THREE.MeshStandardMaterial;
      if (!mat.isMeshStandardMaterial) return;
      if (!shared) {
        shared = mat.clone();
        shared.needsUpdate = true;
      }
      mesh.material = shared;
    });
    return clone;
  }, [scene]);

  // Capture the (cloned) material for the state glow — ref set in an effect.
  useEffect(() => {
    let found: THREE.MeshStandardMaterial | null = null;
    modelRef.current?.traverse((obj) => {
      if (found || !(obj as THREE.Mesh).isMesh) return;
      const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (mat?.isMeshStandardMaterial) found = mat;
    });
    glowMat.current = found;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Gentle idle motion — slow float + sway, never a spin.
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.4) * 0.05;
      root.current.rotation.y = Math.sin(t * 0.4) * 0.05;
      root.current.rotation.x =
        Math.sin(t * 0.3 + 1) * 0.018 + (state === "speaking" ? Math.sin(t * 3.2) * 0.012 : 0);
    }

    // State-driven emissive glow.
    if (glowMat.current) {
      const cfg = STATE_GLOW[state];
      let pulse = 1;
      if (state === "listening") pulse = 1 + Math.sin(t * 5) * 0.09;
      else if (state === "thinking") pulse = 1 + Math.sin(t * 3.5) * 0.07;
      else if (state === "speaking") pulse = 1 + Math.sin(t * 6) * 0.11;
      else if (state === "idle") pulse = 1 + Math.sin(t * 2) * 0.05;
      glowMat.current.emissiveIntensity = cfg.intensity * pulse;
      glowMat.current.emissive.set(cfg.color);
    }

    // Slow orbit + analyzing progress arc (fills 0 → full over ~3s).
    if (ring.current) ring.current.rotation.z += delta * 0.25;
    if (ringArc.current && ringMat.current) {
      if (state === "analyzing") {
        const progress = (t % 3.2) / 3.2;
        ringArc.current.rotation.z = -Math.PI / 2 + progress * Math.PI * 2;
        ringMat.current.opacity = 0.85;
        ringMat.current.color.setHSL(0.58, 0.9, 0.45 + progress * 0.2);
      } else {
        ringMat.current.opacity = 0.3;
      }
    }
  });

  return (
    <group ref={root}>
      {/* The model's origin sits at its feet — shift it up so the head lands
          in the upper third of the frame, scaled to a bust-sized hero fill. */}
      <group position={[0, -3.0, 0]}>
        <primitive ref={modelRef} object={model} scale={0.85} />

        {/* Orbital ring + progress arc at bust height */}
        <mesh ref={ring} position={[0, 3.55, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[1.15, 0.008, 12, 96]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.28} />
        </mesh>
        <mesh ref={ringArc} position={[0, 3.55, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[1.24, 0.018, 12, 64, Math.PI * 0.66]} />
          <meshBasicMaterial ref={ringMat} color="#22D3EE" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
