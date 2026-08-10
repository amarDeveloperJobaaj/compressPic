"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import type { AvatarState } from "./types";

/**
 * AI interviewer — the "AI Kitchen 🧪 just a bit fun" model (CC BY 4.0) loaded
 * from /models/ai-bot2.glb. Attribution: "AI Kitchen 🧪 just a bit fun" by
 * smice, https://sketchfab.com/3d-models/ai-kitchen-just-a-bit-fun-afa0ca2339c14ff68c69b79db205690a
 * (see docs/3D_ASSET_LICENSE.md).
 *
 * The GLB ships with a walking loop, so the avatar plays it (slowed down to a
 * calm pace) plus procedural motion: gentle float, a state-driven emissive
 * glow, a hue-cycling aura halo, and an orbital progress ring that fills
 * while analyzing.
 *
 * Note: the model is skinned, so the cached scene is used directly (a plain
 * deep-clone would break the skeleton binding) and the animation is driven by
 * drei's useAnimations.
 */

const MODEL_URL = "/models/ai-bot2.glb";

// Preload the model when this chunk loads (client-only — the scene is
// dynamically imported, so this never blocks first paint).
useGLTF.preload(MODEL_URL);

/** State-driven glow: intensity multiplier + emissive hue (cyan family). */
const STATE_GLOW: Record<AvatarState, { intensity: number; hue: number }> = {
  idle: { intensity: 1.05, hue: 0.58 },
  listening: { intensity: 1.35, hue: 0.55 },
  thinking: { intensity: 1.45, hue: 0.62 },
  speaking: { intensity: 1.3, hue: 0.5 },
  analyzing: { intensity: 1.5, hue: 0.52 },
  success: { intensity: 1.2, hue: 0.09 },
};

export function AIAvatarModel({ state }: { state: AvatarState }) {
  const { scene, animations } = useGLTF(MODEL_URL);

  const root = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringArc = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const auraMat = useRef<THREE.MeshBasicMaterial>(null);

  // Play the model's walk loop at a calmer pace. Mutations go through an
  // owned ref so the compiler doesn't flag the hook-returned action. Deps are
  // stable values only (`actions` identity + clip name string) — drei rebuilds
  // `names` every render, so depending on it would restart the walk on every
  // AI state change.
  const clipName = animations[0]?.name;
  const { actions } = useAnimations(animations, root);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  useEffect(() => {
    const action = clipName ? actions[clipName] : null;
    if (!action) return;
    actionRef.current = action;
    actionRef.current.reset();
    actionRef.current.play();
    actionRef.current.timeScale = 0.75;
    return () => {
      actionRef.current?.stop();
      actionRef.current = null;
    };
  }, [actions, clipName]);

  // Soft radial "energy field" texture for the halo behind the model.
  const auraTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Capture the model material for the state glow — ref set in an effect.
  useEffect(() => {
    let found: THREE.MeshStandardMaterial | null = null;
    scene.traverse((obj) => {
      if (found || !(obj as THREE.Mesh).isMesh) return;
      const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (mat?.isMeshStandardMaterial) found = mat;
    });
    glowMat.current = found;
  }, [scene]);

  // Dispose the canvas texture on unmount.
  useEffect(() => {
    return () => auraTexture?.dispose();
  }, [auraTexture]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Gentle idle motion — slow float + sway, never a spin.
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.4) * 0.05;
      root.current.rotation.y = Math.sin(t * 0.4) * 0.05;
      root.current.rotation.x =
        Math.sin(t * 0.3 + 1) * 0.018 + (state === "speaking" ? Math.sin(t * 3.2) * 0.012 : 0);
    }

    // State-driven emissive glow with a slow hue drift (colorful AI feel).
    if (glowMat.current) {
      const cfg = STATE_GLOW[state];
      let pulse = 1;
      if (state === "listening") pulse = 1 + Math.sin(t * 5) * 0.09;
      else if (state === "thinking") pulse = 1 + Math.sin(t * 3.5) * 0.07;
      else if (state === "speaking") pulse = 1 + Math.sin(t * 6) * 0.11;
      else if (state === "idle") pulse = 1 + Math.sin(t * 2) * 0.05;
      glowMat.current.emissiveIntensity = cfg.intensity * pulse;
      // Gentle cyan tint (kept moderate so the model keeps its colors).
      glowMat.current.emissive.setHSL(cfg.hue + Math.sin(t * 0.22) * 0.04, 0.38, 0.62);
    }

    // Hue-cycling aura halo pulses with the state.
    if (auraMat.current) {
      const stateBoost =
        state === "listening" || state === "thinking" || state === "analyzing" ? 0.18 : 0;
      auraMat.current.opacity = Math.min(0.85, 0.42 + Math.sin(t * 1.5) * 0.12 + stateBoost);
      auraMat.current.color.setHSL((t * 0.035) % 1, 0.8, 0.55);
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
      {/* The model is a ~1.74-unit standing figure — shift it up so the head
          sits in the upper third of the frame, scaled to fill the hero. */}
      <group position={[0, -1.15, 0]}>
        <primitive object={scene} scale={1.5} />

        {/* Hue-cycling energy-field aura behind the upper body (behind the
            model's back extent so depth testing keeps the halo clean) */}
        <mesh ref={auraRef} position={[0, 1.8, -0.8]} scale={2.2}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={auraMat}
            map={auraTexture ?? undefined}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbital ring + progress arc around the torso */}
        <mesh ref={ring} position={[0, 1.5, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[0.95, 0.008, 12, 96]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.28} />
        </mesh>
        <mesh ref={ringArc} position={[0, 1.5, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[1.02, 0.018, 12, 64, Math.PI * 0.66]} />
          <meshBasicMaterial ref={ringMat} color="#22D3EE" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
