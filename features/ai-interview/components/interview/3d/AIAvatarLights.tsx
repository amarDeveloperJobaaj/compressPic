"use client";

/**
 * Cinematic lighting for the AI interviewer (§ lighting spec):
 *   Key   — soft cool light from upper front-left
 *   Fill  — very subtle neutral light
 *   Rim   — cyan/violet from behind to separate the avatar
 *   Ambient — low base so the face stays readable
 */

export function AIAvatarLights({ low = false }: { low?: boolean }) {
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
      {/* Rim — cyan from behind-right */}
      <pointLight position={[3.5, 1, -3]} intensity={60} color="#38BDF8" />
      {/* Rim — violet from behind-left */}
      <pointLight position={[-3.5, -1, -3.5]} intensity={45} color="#818CF8" />
      {/* Soft top glow */}
      <pointLight position={[0, 4, 0.5]} intensity={18} color="#93C5FD" />
    </>
  );
}
