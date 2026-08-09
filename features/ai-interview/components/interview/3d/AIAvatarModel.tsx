"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { AvatarState } from "./types";

/**
 * Procedural AI interviewer bust — an original, human-inspired avatar.
 *
 * Built entirely from three.js primitives (no external GLB — no licensing
 * risk, tiny payload). Smooth translucent surfaces, soft glowing eyes, and a
 * dark minimalist bust read as "premium digital human", not a cartoon robot.
 *
 * Animation is state-driven (§ AI states):
 *   idle      — gentle breathing + occasional blink
 *   listening — cyan glow pulse on the eyes + soft chest pulse
 *   thinking  — a scanning band sweeps across the face
 *   speaking  — subtle mouth glow + head nod
 *   analyzing — orbital progress ring fills around the head
 *   success   — calm, warm glow
 */

const EYE_GLOW = new THREE.Color("#22D3EE");

export function AIAvatarModel({ state }: { state: AvatarState }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const band = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringArc = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const eyeMatL = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMatR = useRef<THREE.MeshStandardMaterial>(null);
  const mouthMat = useRef<THREE.MeshStandardMaterial>(null);
  const bandMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const chestMat = useRef<THREE.MeshStandardMaterial>(null);
  const blink = useRef({ t: 0, next: 2.5 });

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Breathing — imperceptible scale on the whole bust.
    if (root.current) {
      root.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.006);
    }

    // Slow organic head sway (2–4 degrees, never a spin).
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.45) * 0.04;
      head.current.rotation.x = Math.sin(t * 0.32 + 1) * 0.02;
      if (state === "speaking") {
        head.current.rotation.x += Math.sin(t * 3.2) * 0.015;
      }
    }

    // Blink — natural interval.
    blink.current.t += delta;
    if (blink.current.t > blink.current.next) {
      blink.current.t = 0;
      blink.current.next = 2.5 + Math.random() * 3.5;
    }
    const blinkAmt = Math.max(0, 1 - Math.abs((blink.current.t - 0.14) / 0.14));
    const eyeScaleY = 1 - blinkAmt * 0.82;
    if (eyeL.current) eyeL.current.scale.y = eyeScaleY;
    if (eyeR.current) eyeR.current.scale.y = eyeScaleY;

    // Eye glow per state.
    const glow = (() => {
      switch (state) {
        case "listening":
          return 2.2 + Math.sin(t * 5) * 0.5;
        case "thinking":
          return 2.6 + Math.sin(t * 3.5) * 0.4;
        case "speaking":
          return 2.4 + Math.sin(t * 6) * 0.6;
        case "analyzing":
          return 2.8;
        case "success":
          return 2.2;
        default:
          return 1.8 + Math.sin(t * 2) * 0.25;
      }
    })();
    if (eyeMatL.current) eyeMatL.current.emissiveIntensity = glow;
    if (eyeMatR.current) eyeMatR.current.emissiveIntensity = glow;

    // Mouth glow while speaking.
    if (mouthMat.current) {
      mouthMat.current.emissiveIntensity =
        state === "speaking" ? 0.6 + Math.sin(t * 6) * 0.4 : 0.25;
    }

    // Listening/analyzing: soft chest pulse.
    if (chestMat.current) {
      const pulse = state === "listening" || state === "analyzing" ? 1 + Math.sin(t * 4) * 0.5 : 1;
      chestMat.current.emissiveIntensity = 0.12 + pulse * 0.14;
    }

    // Thinking: scanning band sweeps the face.
    if (band.current && bandMat.current) {
      if (state === "thinking") {
        band.current.position.y = ((t * 0.55) % 1.6) - 0.8;
        bandMat.current.opacity = 0.5 + Math.sin(t * 8) * 0.25;
      } else {
        band.current.position.y = 2;
        bandMat.current.opacity = 0;
      }
    }

    // Analyzing: progress arc fills (0 → full over ~3s loop).
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

    if (ring.current) ring.current.rotation.z += delta * 0.25;
  });

  return (
    <group ref={root}>
      {/* ─── Bust: shoulders + jacket ─── */}
      <group position={[0, -2.05, 0]}>
        {/* Torso base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.05, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial
            color="#111827"
            metalness={0.45}
            roughness={0.5}
            emissive="#1E3A8A"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Collar — dark minimalist jacket */}
        <mesh position={[0, 0.28, 0.15]}>
          <torusGeometry args={[0.62, 0.13, 20, 48, Math.PI]} />
          <meshStandardMaterial color="#1F2937" metalness={0.35} roughness={0.6} />
        </mesh>
        {/* Chest accent — subtle glowing seam */}
        <mesh position={[0, 0.42, 0.42]}>
          <boxGeometry args={[0.55, 0.05, 0.02]} />
          <meshStandardMaterial
            ref={chestMat}
            color="#1F2937"
            emissive="#3B82F6"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* ─── Neck ─── */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.24, 0.3, 0.55, 32]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* ─── Head ─── */}
      <group ref={head} position={[0, -0.25, 0]}>
        {/* Smooth head shell */}
        <mesh scale={[1, 1.18, 0.98]}>
          <sphereGeometry args={[0.62, 64, 64]} />
          <meshPhysicalMaterial
            color="#E8E6F2"
            metalness={0.08}
            roughness={0.28}
            clearcoat={0.9}
            clearcoatRoughness={0.35}
            sheen={0.4}
            sheenColor="#9CA3AF"
          />
        </mesh>

        {/* Subtle nose ridge */}
        <mesh position={[0, -0.05, 0.6]} scale={[0.16, 0.3, 0.24]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color="#E2E0EC" roughness={0.3} />
        </mesh>

        {/* Brows — minimal, calm */}
        {([[-0.19, 0.16], [0.19, 0.16]] as const).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.56]} rotation={[0, 0, i === 0 ? 0.06 : -0.06]}>
            <boxGeometry args={[0.2, 0.022, 0.03]} />
            <meshStandardMaterial color="#8B93A7" roughness={0.4} />
          </mesh>
        ))}

        {/* Eyes — glowing lenses in shallow sockets. The flatten scale lives on
            a wrapper group so the blink (scale.y mutation in useFrame) is never
            overwritten by React re-applying a scale prop on re-render. */}
        <group position={[-0.17, 0.05, 0.57]} scale={[1, 1, 0.55]}>
          <mesh ref={eyeL}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial
              ref={eyeMatL}
              color="#0B1120"
              emissive={EYE_GLOW}
              emissiveIntensity={1.8}
              metalness={0.3}
              roughness={0.15}
            />
          </mesh>
        </group>
        <group position={[0.17, 0.05, 0.57]} scale={[1, 1, 0.55]}>
          <mesh ref={eyeR}>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial
              ref={eyeMatR}
              color="#0B1120"
              emissive={EYE_GLOW}
              emissiveIntensity={1.8}
              metalness={0.3}
              roughness={0.15}
            />
          </mesh>
        </group>

        {/* Mouth — subtle dark line, glows softly when speaking */}
        <mesh position={[0, -0.28, 0.6]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.11, 20, 20, 0, Math.PI, 0, Math.PI]} />
          <meshStandardMaterial
            ref={mouthMat}
            color="#5B6478"
            emissive="#38BDF8"
            emissiveIntensity={0.25}
            roughness={0.35}
          />
        </mesh>

        {/* Temple light lines — subtle AI detail */}
        {([[-0.52, 0.1, 0.1], [0.52, 0.1, 0.1]] as const).map(([x, y, z], i) => (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[0, i === 0 ? 0.7 : -0.7, i === 0 ? -0.15 : 0.15]}
          >
            <boxGeometry args={[0.045, 0.26, 0.02]} />
            <meshBasicMaterial color="#7DD3FC" transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Thinking scan band */}
        <mesh ref={band} position={[0, 2, 0.66]}>
          <boxGeometry args={[0.9, 0.02, 0.02]} />
          <meshBasicMaterial ref={bandMat} color="#38BDF8" transparent opacity={0} />
        </mesh>
      </group>

      {/* Analyzing / idle orbital ring */}
      <mesh ref={ring} position={[0, 0.1, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[1.05, 0.008, 12, 96]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.28} />
      </mesh>
      {/* Progress arc — fills while analyzing */}
      <mesh ref={ringArc} position={[0, 0.1, 0]} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[1.13, 0.018, 12, 64, Math.PI * 0.66]} />
        <meshBasicMaterial ref={ringMat} color="#22D3EE" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
