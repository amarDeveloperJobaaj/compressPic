"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * 3D hero scene for the AI mock interview landing.
 *
 * A glowing "AI interviewer core" orb with orbit rings, wireframe geometry
 * satellites, and a particle field. The whole rig drifts with the pointer
 * for a spatial feel. Loaded only on this page, after hydration
 * (see HeroSceneLoader). Respects prefers-reduced-motion (returns null —
 * the loader falls back to a static orb).
 */

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.x * 0.4, delta * 1.6);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.y * 0.3, delta * 1.6);
  });

  return <group ref={group}>{children}</group>;
}

function Core() {
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
      {/* AI interviewer core */}
      <mesh>
        <sphereGeometry args={[1.15, 64, 64]} />
        <MeshDistortMaterial
          color="#2563EB"
          emissive="#3B82F6"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.18}
          distort={0.32}
          speed={2}
        />
      </mesh>
      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.95, 0.018, 16, 120]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.6, 0]}>
        <torusGeometry args={[2.45, 0.012, 16, 120]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Satellites({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.6} position={[-2.1, 1.5, -1.2]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshBasicMaterial wireframe color="#38BDF8" transparent opacity={0.35} />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={1.5} floatIntensity={1.4} position={[-1.3, -1.8, -0.6]}>
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#818CF8"
            metalness={0.7}
            roughness={0.3}
            emissive="#6366F1"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={1} floatIntensity={1.8} position={[2.6, 1.7, -1.6]}>
        <mesh>
          <tetrahedronGeometry args={[0.45, 0]} />
          <meshBasicMaterial wireframe color="#A5B4FC" transparent opacity={0.5} />
        </mesh>
      </Float>
      {!isMobile && (
        <Sparkles
          count={90}
          scale={9}
          size={2.2}
          speed={0.35}
          color="#93C5FD"
          opacity={0.7}
          position={[0.6, 0, 0]}
        />
      )}
    </>
  );
}

export function HeroScene() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (reducedMotion) return null;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[5, 4, 4]} intensity={80} color="#3B82F6" />
      <pointLight position={[-5, -3, 2]} intensity={50} color="#818CF8" />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      <Rig>
        <group position={[2.3, 0, 0]} scale={0.95}>
          <Core />
          <Satellites isMobile={isMobile} />
        </group>
      </Rig>
    </Canvas>
  );
}
