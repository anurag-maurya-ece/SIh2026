import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ProfilePoint, latLonToVector3, getTemperatureColor } from '../utils/geo';
import { Layers, Thermometer, ArrowDown } from 'lucide-react';

interface SubsurfaceCutawayProps {
  lat: number;
  lon: number;
  profile: ProfilePoint[];
  currentDepth: number;
  globeRadius?: number;
}

export const SubsurfaceCutaway: React.FC<SubsurfaceCutawayProps> = ({
  lat,
  lon,
  profile,
  currentDepth,
  globeRadius = 2.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const depthCursorRef = useRef<THREE.Group>(null);

  // Position on globe surface
  const surfacePosition = useMemo(() => {
    return latLonToVector3(lat, lon, globeRadius);
  }, [lat, lon, globeRadius]);

  // Compute orientation: Normal vector pointing from globe center outward
  const rotation = useMemo(() => {
    const normal = surfacePosition.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quat);
  }, [surfacePosition]);

  // Total 3D core length representing 1000m depth
  const coreLength = 0.55; // 0.55 Three.js units into the globe

  // Interpolate temperature at standard depth horizons
  const getTempAt = (d: number) => {
    const p = profile.find((pt) => pt.depth === d);
    if (p) return p.temp;
    if (profile.length > 0) return profile[0].temp;
    return 26.0;
  };

  const t0 = getTempAt(0);
  const t50 = getTempAt(50);
  const t200 = getTempAt(200);
  const t500 = getTempAt(500);
  const t1000 = getTempAt(1000);

  const c0 = getTemperatureColor(t0).hex;
  const c100 = getTemperatureColor((t50 + t200) / 2).hex;
  const c300 = getTemperatureColor(t200).hex;
  const c500 = getTemperatureColor(t500).hex;
  const c1000 = getTemperatureColor(t1000).hex;

  // Active depth cursor position (0m -> y=0.0, 1000m -> y = -coreLength)
  const cursorY = -(currentDepth / 1000) * coreLength;

  useFrame(({ clock }) => {
    if (pulseRingRef.current) {
      const t = clock.getElapsedTime() * 2.5;
      const s = 1.0 + Math.sin(t) * 0.25;
      pulseRingRef.current.scale.set(s, s, s);
      const mat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.8 - (s - 1.0) * 1.5;
      }
    }
  });

  return (
    <group position={surfacePosition} rotation={rotation} ref={groupRef}>
      {/* 1. Surface Target Reticle / Crosshair */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.055, 32]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Surface Pulsing Ring */}
      <mesh ref={pulseRingRef} position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, 0.085, 32]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* 2. Subsurface Core Cutaway Cylinder Layers (Extending downward into Earth) */}
      
      {/* Layer 1: Mixed Layer (0m - 100m) */}
      <mesh position={[0, -coreLength * 0.05, 0]}>
        <cylinderGeometry args={[0.038, 0.036, coreLength * 0.1, 24]} />
        <meshStandardMaterial
          color={c0}
          emissive={c0}
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Layer 2: Upper Thermocline (100m - 300m) */}
      <mesh position={[0, -coreLength * 0.2, 0]}>
        <cylinderGeometry args={[0.036, 0.032, coreLength * 0.2, 24]} />
        <meshStandardMaterial
          color={c100}
          emissive={c100}
          emissiveIntensity={0.5}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Layer 3: Main Thermocline (300m - 600m) */}
      <mesh position={[0, -coreLength * 0.45, 0]}>
        <cylinderGeometry args={[0.032, 0.026, coreLength * 0.3, 24]} />
        <meshStandardMaterial
          color={c300}
          emissive={c300}
          emissiveIntensity={0.5}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Layer 4: Deep Abyssal Ocean (600m - 1000m) */}
      <mesh position={[0, -coreLength * 0.8, 0]}>
        <cylinderGeometry args={[0.026, 0.02, coreLength * 0.4, 24]} />
        <meshStandardMaterial
          color={c1000}
          emissive={c1000}
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Core Center Laser Wireframe Guide */}
      <mesh position={[0, -coreLength / 2, 0]}>
        <cylinderGeometry args={[0.002, 0.002, coreLength, 8]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.8} />
      </mesh>

      {/* 3. Depth Level Glowing Strata Rings */}
      {/* 0m Surface ring */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.038, 0.042, 24]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* 150m Upper Thermocline ring */}
      <mesh position={[0, -coreLength * 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.035, 0.038, 24]} />
        <meshBasicMaterial color="#ffb703" side={THREE.DoubleSide} />
      </mesh>

      {/* 300m Main Thermocline ring */}
      <mesh position={[0, -coreLength * 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.032, 0.035, 24]} />
        <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} />
      </mesh>

      {/* 1000m Deep boundary base cap */}
      <mesh position={[0, -coreLength, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.02, 24]} />
        <meshBasicMaterial color="#0a2558" side={THREE.DoubleSide} />
      </mesh>

      {/* 4. Active Slider Depth Cursor Laser Ring */}
      <group ref={depthCursorRef} position={[0, cursorY, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.052, 32]} />
          <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} />
        </mesh>
        {/* Pulsing cursor aura */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.042, 0.065, 32]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>

      {/* 5. 3D Holographic Label Annotations */}
      <Html position={[0.08, 0.03, 0]} distanceFactor={8} className="pointer-events-none select-none">
        <div className="glass-panel px-2 py-1 rounded-md text-[9px] text-white whitespace-nowrap border border-cyan-400/50 shadow-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono font-bold text-cyan-300">0m (SST): {t0.toFixed(1)}°C</span>
        </div>
      </Html>

      <Html position={[0.07, -coreLength * 0.3, 0]} distanceFactor={8} className="pointer-events-none select-none">
        <div className="glass-panel-subtle px-1.5 py-0.5 rounded text-[8px] text-amber-300 whitespace-nowrap border border-amber-400/40">
          <span className="font-mono">300m Thermocline: {t200.toFixed(1)}°C</span>
        </div>
      </Html>

      <Html position={[0.06, -coreLength, 0]} distanceFactor={8} className="pointer-events-none select-none">
        <div className="glass-panel-subtle px-1.5 py-0.5 rounded text-[8px] text-blue-300 whitespace-nowrap border border-blue-400/40">
          <span className="font-mono">1000m Deep: {t1000.toFixed(1)}°C</span>
        </div>
      </Html>
    </group>
  );
};
