"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Rotating icosahedron — bright wireframe + glow                     */
/* ------------------------------------------------------------------ */

function IcoShape({ color, speed, scale }: { color: string; speed: number; scale: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * speed * 0.3;
    ref.current.rotation.y += delta * speed * 0.5;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* Floating torus                                                     */
/* ------------------------------------------------------------------ */

function TorusShape({ color, speed, scale }: { color: string; speed: number; scale: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * speed * 0.2;
    ref.current.rotation.z += delta * speed * 0.3;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={ref} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* Octahedron accent                                                  */
/* ------------------------------------------------------------------ */

function OctaShape({ color, speed, scale }: { color: string; speed: number; scale: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * speed * 0.4;
    ref.current.rotation.x += delta * speed * 0.2;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
      <mesh ref={ref} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* Particles floating in space                                        */
/* ------------------------------------------------------------------ */

function Particles({ count = 100 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 14;
      arr[i + 1] = (Math.random() - 0.5) * 10;
      arr[i + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.015;
    ref.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#5eead4"
        transparent
        opacity={0.8}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Mouse-reactive camera                                              */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.5, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Main Scene                                                         */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      <CameraRig />

      {/* Strong lighting so wireframes are clearly visible */}
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#14b8a6" distance={20} />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#3b82f6" distance={18} />
      <pointLight position={[0, -4, -2]} intensity={0.5} color="#f59e0b" distance={15} />
      <directionalLight position={[0, 8, 4]} intensity={0.6} />

      {/* Main geometric — large icosahedron */}
      <IcoShape color="#2dd4bf" speed={0.6} scale={1.8} />

      {/* Secondary shapes */}
      <TorusShape color="#60a5fa" speed={0.4} scale={0.9} />
      <OctaShape color="#fbbf24" speed={0.5} scale={0.6} />

      {/* Tiny accent shape */}
      <IcoShape color="#a78bfa" speed={0.8} scale={0.4} />

      {/* Floating particles — larger and brighter */}
      <Particles count={80} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Exported Canvas wrapper                                            */
/* ------------------------------------------------------------------ */

export function HeroScene() {
  return (
    <div className="pf-3d-canvas absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
