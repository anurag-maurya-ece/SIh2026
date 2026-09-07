import React from 'react';

export const SunLight: React.FC = () => {
  return (
    <>
      {/* Deep space ambient fill light */}
      <ambientLight intensity={0.28} color="#94a3b8" />

      {/* Main directional sun casting distinct day/night terminator line */}
      <directionalLight
        position={[12, 6, 10]}
        intensity={2.8}
        color="#fffaf0"
      />

      {/* Subtle back-light / earthshine for rim contrast on night side */}
      <directionalLight
        position={[-10, -4, -10]}
        intensity={0.18}
        color="#38bdf8"
      />

      {/* Sun billboard glow sprite representation in space */}
      <mesh position={[12, 6, 10]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#fffbe6" />
      </mesh>
    </>
  );
};
