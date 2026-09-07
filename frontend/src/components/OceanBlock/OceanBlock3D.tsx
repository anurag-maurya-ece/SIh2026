import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import {
  ProfilePoint,
  interpolateProfileTemp,
  createOceanBlockGradientTexture,
  getTemperatureColor,
} from '../../utils/geo';

interface OceanBlock3DProps {
  profile: ProfilePoint[];
  currentDepth: number;
  onDepthChange: (depth: number) => void;
  lat: number;
  lon: number;
  region?: string;
  width?: number;
  length?: number;
  height?: number;
}

export const OceanBlock3D: React.FC<OceanBlock3DProps> = ({
  profile,
  currentDepth,
  onDepthChange,
  lat,
  lon,
  region = 'Indian Ocean',
  width = 4.2,
  length = 4.2,
  height = 2.8,
}) => {
  const blockGroupRef = useRef<THREE.Group>(null);
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const markerPlaneRef = useRef<THREE.Mesh>(null);
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<THREE.Vector3 | null>(null);

  // 1. Generate Continuous Thermal Texture from Profile
  const gradientTexture = useMemo(() => {
    return createOceanBlockGradientTexture(profile, 256, 1024);
  }, [profile]);

  // 2. Interpolated Active Temperature & Surface Temp
  const activePoint = useMemo(() => {
    return interpolateProfileTemp(profile, currentDepth);
  }, [profile, currentDepth]);

  const surfacePoint = useMemo(() => {
    return interpolateProfileTemp(profile, 0);
  }, [profile]);

  const deepPoint = useMemo(() => {
    return interpolateProfileTemp(profile, 1000);
  }, [profile]);

  const surfaceColor = useMemo(() => {
    return getTemperatureColor(surfacePoint.temp).hex;
  }, [surfacePoint.temp]);

  const deepColor = useMemo(() => {
    return getTemperatureColor(deepPoint.temp).hex;
  }, [deepPoint.temp]);

  const activeColor = useMemo(() => {
    return getTemperatureColor(activePoint.temp).hex;
  }, [activePoint.temp]);

  // 3. Compute Vertical Position of Depth Plane: 0m at +H/2, 1000m at -H/2
  const activeY = useMemo(() => {
    const frac = Math.min(1, Math.max(0, currentDepth / 1000));
    return height / 2 - frac * height;
  }, [currentDepth, height]);

  // 4. Animated Water Surface Ripples (useFrame)
  useFrame(({ clock }) => {
    if (waterMeshRef.current) {
      const geo = waterMeshRef.current.geometry as THREE.PlaneGeometry;
      const pos = geo.attributes.position;
      const time = clock.getElapsedTime() * 1.8;

      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        // Harmonic wave ripples
        const wave1 = Math.sin(u * 3.5 + time) * 0.024;
        const wave2 = Math.cos(v * 4.0 + time * 1.3) * 0.018;
        const wave3 = Math.sin((u + v) * 2.5 - time * 0.9) * 0.012;
        pos.setZ(i, wave1 + wave2 + wave3);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    if (markerPlaneRef.current) {
      // Subtle glowing pulse on depth marker
      const mat = markerPlaneRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.55 + Math.sin(clock.getElapsedTime() * 4.0) * 0.15;
      }
    }
  });

  // 5. Handle Click on Block Side to Scrub Depth
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.point) {
      const localY = e.point.y;
      const clampedY = Math.min(height / 2, Math.max(-height / 2, localY));
      const frac = (height / 2 - clampedY) / height;
      const clickedDepth = Math.round(frac * 1000);
      onDepthChange(clickedDepth);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.point) {
      const localY = e.point.y;
      const clampedY = Math.min(height / 2, Math.max(-height / 2, localY));
      const frac = (height / 2 - clampedY) / height;
      const d = Math.round(frac * 1000);
      setHoveredDepth(d);
      setHoverPos(e.point.clone());
    }
  };

  const handlePointerOut = () => {
    setHoveredDepth(null);
    setHoverPos(null);
  };

  // Depth Ruler Tick Levels
  const depthTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  return (
    <group ref={blockGroupRef}>
      {/* ─── A. THE 4 VERTICAL SIDES (CONTINUOUS THERMAL GRADIENT) ─── */}
      {/* Front Face (+Z) */}
      <mesh
        position={[0, 0, length / 2]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height, 1, 32]} />
        <meshStandardMaterial
          map={gradientTexture}
          emissiveMap={gradientTexture}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.32}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back Face (-Z) */}
      <mesh
        position={[0, 0, -length / 2]}
        rotation={[0, Math.PI, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height, 1, 32]} />
        <meshStandardMaterial
          map={gradientTexture}
          emissiveMap={gradientTexture}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.32}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Face (+X) */}
      <mesh
        position={[width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[length, height, 1, 32]} />
        <meshStandardMaterial
          map={gradientTexture}
          emissiveMap={gradientTexture}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.32}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left Face (-X) */}
      <mesh
        position={[-width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[length, height, 1, 32]} />
        <meshStandardMaterial
          map={gradientTexture}
          emissiveMap={gradientTexture}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.32}
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom Face (1000m Abyssal Floor) */}
      <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color={deepColor}
          emissive={deepColor}
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* ─── B. TOP FACE: ANIMATED WATER SURFACE (0m SEA LEVEL) ─── */}
      <mesh
        ref={waterMeshRef}
        position={[0, height / 2 + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={() => onDepthChange(0)}
      >
        <planeGeometry args={[width, length, 48, 48]} />
        <meshStandardMaterial
          color={surfaceColor}
          emissive={surfaceColor}
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.4}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Glowing Sea Surface Border Rim */}
      <lineSegments position={[0, height / 2 + 0.004, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width + 0.02, length + 0.02)]} />
        <lineBasicMaterial color="#00f2fe" linewidth={2.5} transparent opacity={0.95} />
      </lineSegments>

      {/* Outer Glass Accent Lines */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width + 0.01, height + 0.01, length + 0.01)]} />
        <lineBasicMaterial color="#38bdf8" linewidth={1} transparent opacity={0.35} />
      </lineSegments>

      {/* ─── C. ACTIVE DEPTH SCRUBBER SLICE PLANE ─── */}
      <group position={[0, activeY, 0]}>
        {/* Semi-transparent glowing cross-section slice plane */}
        <mesh ref={markerPlaneRef} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width + 0.06, length + 0.06]} />
          <meshStandardMaterial
            color={activeColor}
            emissive={activeColor}
            emissiveIntensity={0.65}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Highlight Glowing Border Ring around the slice */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(width + 0.07, length + 0.07)]} />
          <lineBasicMaterial color="#ffffff" linewidth={3} transparent opacity={0.95} />
        </lineSegments>

        {/* 3D Floating Slice Telemetry Badge */}
        <Html
          position={[width / 2 + 0.25, 0, length / 2 + 0.1]}
          distanceFactor={7.5}
          className="pointer-events-auto select-none"
        >
          <div className="glass-hud px-3 py-1.5 rounded-xl border border-cyan-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 whitespace-nowrap animate-in fade-in zoom-in duration-150">
            <div
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/30 animate-pulse shrink-0"
              style={{ backgroundColor: activeColor }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
                <span className="text-cyan-300">{Math.round(currentDepth)}m</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300">{activePoint.temp.toFixed(2)}°C</span>
              </div>
              <div className="text-[9px] text-slate-400 font-sans leading-none mt-0.5">
                Confidence: {(activePoint.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* ─── D. 3D VERTICAL DEPTH RULER / AXIS ─── */}
      <group position={[-width / 2 - 0.45, 0, length / 2]}>
        {/* Main Vertical Spine */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, height, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
        </mesh>

        {/* Ticks along depth levels */}
        {depthTicks.map((d) => {
          const frac = d / 1000;
          const tickY = height / 2 - frac * height;
          const isMajor = d % 200 === 0 || d === 0 || d === 1000;
          const tickPoint = interpolateProfileTemp(profile, d);
          const tickColor = getTemperatureColor(tickPoint.temp).hex;

          return (
            <group
              key={d}
              position={[0, tickY, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onDepthChange(d);
              }}
            >
              {/* Horizontal Tick Needle */}
              <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.008, 0.008, isMajor ? 0.2 : 0.1, 12]} />
                <meshBasicMaterial color={isMajor ? '#ffffff' : '#64748b'} />
              </mesh>

              {/* Tick Dot */}
              <mesh position={[0.2, 0, 0]}>
                <sphereGeometry args={[isMajor ? 0.035 : 0.02, 12, 12]} />
                <meshBasicMaterial color={tickColor} />
              </mesh>

              {/* Major Tick Label */}
              {isMajor && (
                <Html position={[-0.15, 0, 0]} distanceFactor={8} className="pointer-events-auto select-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDepthChange(d);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold transition-all ${
                      Math.abs(currentDepth - d) < 20
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}m
                  </button>
                </Html>
              )}
            </group>
          );
        })}

        {/* Active Depth Pointer Arrow on Ruler */}
        <group position={[0.08, activeY, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.06, 0.14, 16]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ─── E. HOVER TOOLTIP ON BLOCK SIDE ─── */}
      {hoveredDepth !== null && hoverPos && (
        <Html position={[hoverPos.x, hoverPos.y + 0.15, hoverPos.z]} distanceFactor={7} className="pointer-events-none select-none">
          <div className="bg-[#081226]/90 border border-cyan-500/40 px-2 py-1 rounded-lg text-[9px] font-mono text-cyan-200 shadow-xl backdrop-blur-md">
            Click to set {hoveredDepth}m
          </div>
        </Html>
      )}

      {/* ─── F. LOCATION METADATA ANCHOR ─── */}
      <Html position={[0, height / 2 + 0.28, -length / 2]} distanceFactor={7.5} className="pointer-events-none select-none">
        <div className="glass-hud px-3 py-1 rounded-full border border-white/15 text-center shadow-2xl backdrop-blur-md">
          <span className="text-[10.5px] font-mono font-bold text-white tracking-wide">
            {region} • {Math.abs(lat).toFixed(2)}°{lat >= 0 ? 'N' : 'S'}, {Math.abs(lon).toFixed(2)}°{lon >= 0 ? 'E' : 'W'}
          </span>
        </div>
      </Html>

      {/* Subtle floor contact shadow */}
      <mesh position={[0, -height / 2 - 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 1.5, length * 1.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};
