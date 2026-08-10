"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cinematic lighting for the AI interviewer (§ lighting spec):
 *   Key   — soft cool light from upper front-left
 *   Fill  — very subtle neutral light
 *   Rim   — slowly hue-cycling (cyan → violet → sky) + pulsing so the model
 *           picks up a living, colorful "AI" glow
 *   Ambient — low base so the face stays readable
 */
export function AIAvatarLights({ low = false }: { low?: boolean }) {
  const rimCyan = useRef<THREE.PointLight>(null);
  const rimViolet = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (low) return;
    const t = clock.getElapsedTime();
    // Slow hue cycle across cyan → violet → sky — a colorful AI aura on the model.
    if (rimCyan.current) {
      rimCyan.current.color.setHSL((t * 0.045) % 1, 0.75, 0.6);
      rimCyan.current.intensity = 52 + Math.sin(t * 1.3) * 14;
    }
    if (rimViolet.current) {
      rimViolet.current.color.setHSL(((t * 0.045) % 1) + 0.14, 0.7, 0.55);
      rimViolet.current.intensity = 40 + Math.cos(t * 1.1) * 10;
    }
  });

  if (low) {
    // Low-power tier: basic lighting only.
    return (
      <>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 5, 5]}
        intensity={1.5}
        color="#EAF2FF"
      />
      {/* Key — soft cool from front-left */}
      <pointLight position={[-3.5, 2.5, 3.5]} intensity={40} color="#BFD9FF" />
      {/* Rim — hue-cycling cyan from behind-right */}
      <pointLight ref={rimCyan} position={[3.5, 1, -3]} intensity={60} color="#38BDF8" />
      {/* Rim — hue-cycling violet from behind-left */}
      <pointLight ref={rimViolet} position={[-3.5, -1, -3.5]} intensity={45} color="#818CF8" />
      {/* Soft top glow */}
      <pointLight position={[0, 4, 0.5]} intensity={18} color="#93C5FD" />
    </>
  );
}
