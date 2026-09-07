import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ProfilePoint, latLonToVector3, getTemperatureColor } from '../utils/geo';
import { ArrowRight } from 'lucide-react';

interface OceanCrossSectionProps {
  lat: number;
  lon: number;
  region?: string;
  profile: ProfilePoint[];
  currentDepth: number;
  globeRadius?: number;
  onViewDetails?: () => void;
}

export const OceanCrossSection: React.FC<OceanCrossSectionProps> = ({
  lat,
  lon,
  region = 'Indian Ocean',
  profile,
  currentDepth,
  globeRadius = 2.0,
  onViewDetails,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const depthMarkerRef = useRef<THREE.Group>(null);

  // Convert lat/lon to 3D Cartesian position on globe surface
  const surfacePosition = useMemo(() => {
    return latLonToVector3(lat, lon, globeRadius);
  }, [lat, lon, globeRadius]);

  // Compute normal orientation so cylinder extends radially into the globe
  const rotation = useMemo(() => {
    const normal = surfacePosition.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quat);
  }, [surfacePosition]);

  const subsurfaceLength = 0.52;
  const aboveSurfaceLength = 0.08;
  const coreRadius = 0.034;

  const segments = useMemo(() => {
    if (!profile || profile.length < 2) return [];

    const result = [];
    const maxD = profile[profile.length - 1].depth || 1000;

    for (let i = 0; i < profile.length - 1; i++) {
      const p1 = profile[i];
      const p2 = profile[i + 1];

      const d1 = p1.depth;
      const d2 = p2.depth;
      const avgTemp = (p1.temp + p2.temp) / 2;
      const colorHex = getTemperatureColor(avgTemp).hex;

      const y1 = -(d1 / maxD) * subsurfaceLength;
      const y2 = -(d2 / maxD) * subsurfaceLength;
      const segLength = Math.abs(y2 - y1);
      const midY = (y1 + y2) / 2;

      const taper1 = coreRadius * (1 - 0.25 * (d1 / maxD));
      const taper2 = coreRadius * (1 - 0.25 * (d2 / maxD));

      result.push({
        d1,
        d2,
        midY,
        segLength,
        taper1,
        taper2,
        colorHex,
        temp: p1.temp,
      });
    }

    return result;
  }, [profile, subsurfaceLength, coreRadius]);

  const surfaceTemp = profile && profile.length > 0 ? profile[0].temp : 21.9;
  const surfaceColor = getTemperatureColor(surfaceTemp).hex;

  const activeDepthFraction = Math.min(1, Math.max(0, currentDepth / 1000));
  const activeCursorY = -activeDepthFraction * subsurfaceLength;

  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;

  useFrame(({ clock }) => {
    if (pulseRingRef.current) {
      const t = clock.getElapsedTime() * 2.5;
      const s = 1.0 + Math.sin(t) * 0.25;
      pulseRingRef.current.scale.set(s, s, s);
      const mat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.8 - (s - 1.0) * 2.0);
      }
    }
  });

  return (
    <group position={surfacePosition} rotation={rotation} ref={groupRef}>
      {/* 1. Sea Level Surface Marker Ring */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[coreRadius * 1.05, coreRadius * 1.35, 32]} />
        <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>

      {/* Surface Pulsing Ring */}
      <mesh ref={pulseRingRef} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[coreRadius * 1.35, coreRadius * 2.2, 32]} />
        <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Protruding Core Cap (above sea level) */}
      <mesh position={[0, aboveSurfaceLength / 2, 0]}>
        <cylinderGeometry args={[coreRadius * 0.95, coreRadius, aboveSurfaceLength, 24]} />
        <meshStandardMaterial
          color={surfaceColor}
          emissive={surfaceColor}
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* 2. Stacked Subsurface Depth Segments */}
      {segments.map((seg, idx) => (
        <mesh key={idx} position={[0, seg.midY, 0]}>
          <cylinderGeometry args={[seg.taper1, seg.taper2, seg.segLength, 24]} />
          <meshStandardMaterial
            color={seg.colorHex}
            emissive={seg.colorHex}
            emissiveIntensity={0.45}
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}

      {/* Bottom 1000m Cap */}
      <mesh position={[0, -subsurfaceLength, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[coreRadius * 0.75, 24]} />
        <meshBasicMaterial color="#0a2558" side={THREE.DoubleSide} />
      </mesh>

      {/* Active Depth Slider Indicator Laser Ring */}
      <group ref={depthMarkerRef} position={[0, activeCursorY, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[coreRadius * 1.15, coreRadius * 1.45, 32]} />
          <meshBasicMaterial color="#00f2fe" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. 3D Floating Target Reticle Label Card matching the Screenshot */}
      <Html
        position={[coreRadius * 1.8, aboveSurfaceLength + 0.04, 0]}
        distanceFactor={8}
        className="pointer-events-auto select-none"
      >
        <div className="glass-hud p-2.5 rounded-2xl text-[10px] text-white whitespace-nowrap border border-white/10 shadow-2xl flex flex-col gap-1 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="font-mono font-bold text-white text-xs">
            {latStr}, {lonStr}
          </div>
          <div className="text-slate-400 text-[9px] font-sans">
            {region}
          </div>
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="mt-1 flex items-center gap-1 text-[9px] text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </Html>
    </group>
  );
};
