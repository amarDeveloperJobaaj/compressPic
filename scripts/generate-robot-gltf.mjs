/**
 * Generates public/ai-interview/robot-avatar.glb — a stylized "AI interviewer"
 * robot head built from three.js primitives, exported as a real GLTF binary.
 *
 * Run:  node scripts/generate-robot-gltf.mjs
 *
 * The hero scene loads it with drei `useGLTF` (see
 * features/ai-interview/components/three/HeroScene.tsx).
 */
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// GLTFExporter's binary path uses the browser FileReader API — polyfill it
// with Node's Blob so the script can run outside the browser.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    result = null;
    onloadend = null;
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onloadend?.();
      });
    }
  };
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "ai-interview", "robot-avatar.glb");

function buildRobot() {
  const group = new THREE.Group();

  const metal = (color, metalness = 0.6, roughness = 0.35) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const emissive = (color, intensity = 2) =>
    new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: color,
      emissiveIntensity: intensity,
      metalness: 0.4,
      roughness: 0.4,
    });

  // --- Head (squashed sphere, friendly) ---
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 48), metal(0xe2e8f0, 0.15, 0.35));
  head.scale.set(1, 1.08, 0.92);
  group.add(head);

  // --- Face visor (dark glass) ---
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.24, 0.12), metal(0x0b1120, 0.9, 0.2));
  visor.position.set(0, 0.06, 0.42);
  group.add(visor);

  // --- Glowing eyes (cyan strip) ---
  const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, 0.03), emissive(0x22d3ee));
  eyes.position.set(0, 0.1, 0.5);
  group.add(eyes);

  // --- Smile strip ---
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.02), emissive(0x38bdf8, 1.4));
  mouth.position.set(0, -0.06, 0.5);
  group.add(mouth);

  // --- Antenna + tip ---
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.32, 12),
    metal(0x94a3b8, 0.7, 0.3)
  );
  antenna.position.set(0, 0.66, 0);
  group.add(antenna);
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 20), emissive(0xf472b6, 2.4));
  antennaTip.position.set(0, 0.83, 0);
  group.add(antennaTip);

  // --- Ears ---
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), metal(0x94a3b8, 0.7, 0.3));
    ear.position.set(side * 0.5, 0.04, 0);
    group.add(ear);
  }

  // --- Collar / base ---
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.16, 32), metal(0x2563eb, 0.8, 0.25));
  collar.position.set(0, -0.58, 0);
  group.add(collar);

  // --- Floating base ring ---
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.48, 0.035, 16, 64),
    metal(0x3b82f6, 0.85, 0.2)
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, -0.88, 0);
  group.add(ring);

  return group;
}

async function main() {
  const exporter = new GLTFExporter();
  const robot = buildRobot();

  const result = await new Promise((resolve, reject) => {
    exporter.parse(
      robot,
      (gltf) => resolve(gltf),
      (err) => reject(err),
      { binary: true }
    );
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, Buffer.from(result));
  console.log(`Wrote ${OUT} (${statSync(OUT).size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
