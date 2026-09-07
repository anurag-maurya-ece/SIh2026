import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ProfilePoint, getTemperatureColor } from '../utils/geo';

interface SlicedEarthCutawayProps {
  radius?: number;
  profile: ProfilePoint[];
  currentDepth: number;
  lat: number;
  lon: number;
  active: boolean;
}

/**
 * Generates an internal cross-section wall canvas texture showing:
 * - Subsurface Ocean Thermal Layers (0m to 1000m)
 * - Depth grid ticks (0, 100, 300, 500, 1000m)
 * - Active slider depth laser line
 * - Earth lithosphere / mantle beneath
 */
function createCrossSectionWallTexture(
  profile: ProfilePoint[],
  currentDepth: number,
  width: number = 1024,
  height: number = 1024
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background deep mantle gradient
  const mantleGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    20,
    width / 2,
    height / 2,
    width / 2
  );
  mantleGrad.addColorStop(0, '#ffaa00'); // Outer core glow
  mantleGrad.addColorStop(0.35, '#8b2500'); // Lower mantle
  mantleGrad.addColorStop(0.7, '#1f1610'); // Upper mantle
  mantleGrad.addColorStop(0.85, '#0d131f'); // Crust base
  mantleGrad.addColorStop(1.0, '#030712');

  ctx.fillStyle = mantleGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw oceanic lithosphere & subsurface temperature gradient in the outer rim (88% to 100% radius)
  const outerR = width * 0.48;
  const oceanBottomR = outerR * 0.86; // 1000m boundary exaggerated for visibility
  const center = width / 2;

  // Render thermal stratification bands
  const numSteps = 40;
  for (let i = 0; i < numSteps; i++) {
    const fraction = i / numSteps;
    const nextFraction = (i + 1) / numSteps;
    const r1 = outerR - fraction * (outerR - oceanBottomR);
    const r2 = outerR - nextFraction * (outerR - oceanBottomR);

    const d = fraction * 1000;
    const p = profile.find((pt) => pt.depth >= d) || profile[profile.length - 1] || { temp: 20 };
    const color = getTemperatureColor(p.temp);

    ctx.beginPath();
    ctx.arc(center, center, (r1 + r2) / 2, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.lineWidth = Math.abs(r1 - r2) + 1.5;
    ctx.stroke();
  }

  // Draw depth horizon rings & annotations
  const depthHorizons = [
    { d: 0, label: '0m (Surface SST)' },
    { d: 150, label: '150m (Upper Thermocline)' },
    { d: 300, label: '300m (Main Thermocline)' },
    { d: 500, label: '500m (Mesopelagic)' },
    { d: 1000, label: '1000m (Abyssal Ocean Base)' },
  ];

  depthHorizons.forEach((h) => {
    const r = outerR - (h.d / 1000) * (outerR - oceanBottomR);
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.strokeStyle = h.d === 0 ? '#ffffff' : 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = h.d === 0 ? 3 : 1;
    ctx.setLineDash(h.d === 0 ? [] : [4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Highlight active slider depth with glowing laser ring
  const activeR = outerR - (currentDepth / 1000) * (outerR - oceanBottomR);
  ctx.beginPath();
  ctx.arc(center, center, activeR, 0, Math.PI * 2);
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Add high-tech circular grid lines
  for (let gr = 0.2; gr <= 0.7; gr += 0.15) {
    ctx.beginPath();
    ctx.arc(center, center, outerR * gr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return canvas;
}

export const SlicedEarthCutaway: React.FC<SlicedEarthCutawayProps> = ({
  radius = 2.0,
  profile,
  currentDepth,
  lat,
  lon,
  active,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [wallTexture, setWallTexture] = useState<THREE.CanvasTexture | null>(null);

  // Load NASA textures for the exterior 3/4 sphere
  const [colorMap, bumpMap, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/ColorMap.jpg',
    '/textures/BumpMap.jpg',
    '/textures/SpecularMap.png',
  ]);

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    bumpMap.colorSpace = THREE.LinearSRGBColorSpace;
    specularMap.colorSpace = THREE.LinearSRGBColorSpace;
  }, [colorMap, bumpMap, specularMap]);

  // Generate internal cutaway wall texture whenever profile or depth changes
  useEffect(() => {
    const canvas = createCrossSectionWallTexture(profile, currentDepth, 1024, 1024);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    setWallTexture((prev) => {
      if (prev) prev.dispose();
      return tex;
    });

    return () => {
      tex.dispose();
    };
  }, [profile, currentDepth]);

  // 90° Wedge Cutaway Geometry (3/4 sphere = 270 degrees)
  const cutawaySphereGeo = useMemo(() => {
    // thetaLength = Math.PI * 1.5 (270 degrees)
    return new THREE.SphereGeometry(radius, 64, 64, 0, Math.PI * 1.5, 0, Math.PI);
  }, [radius]);

  // Flat cross-section face 1 (Equatorial / Meriodional cut plane)
  const faceGeo1 = useMemo(() => {
    return new THREE.CircleGeometry(radius, 48, 0, Math.PI);
  }, [radius]);

  // Flat cross-section face 2 (Perpendicular cut plane)
  const faceGeo2 = useMemo(() => {
    return new THREE.CircleGeometry(radius, 48, 0, Math.PI);
  }, [radius]);

  if (!active || !wallTexture) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Exterior 3/4 Earth Globe Surface */}
      <mesh geometry={cutawaySphereGeo} receiveShadow castShadow>
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.06}
          roughnessMap={specularMap}
          roughness={0.6}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Internal Cutaway Face 1 (Z-plane slice) */}
      <mesh
        geometry={faceGeo1}
        position={[0, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial
          map={wallTexture}
          roughness={0.4}
          metalness={0.2}
          emissive="#00f2fe"
          emissiveIntensity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Internal Cutaway Face 2 (X-plane slice) */}
      <mesh
        geometry={faceGeo2}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, -Math.PI / 2]}
      >
        <meshStandardMaterial
          map={wallTexture}
          roughness={0.4}
          metalness={0.2}
          emissive="#00f2fe"
          emissiveIntensity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Glowing 3D Laser Axis at Earth's Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
    </group>
  );
};
