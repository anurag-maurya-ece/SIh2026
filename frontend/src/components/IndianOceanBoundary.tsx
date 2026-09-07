import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { latLonToVector3 } from '../utils/geo';

interface IndianOceanBoundaryProps {
  radius?: number;
  visible?: boolean;
}

// Exact Regional Perimeter for SIH 2026 PS 26066 Focus Area
// Lat: -40° to +30°, Lon: 30° to 120°
const BOUNDARY_COORDS = [
  { lat: 30.0, lon: 32.0 },   // Suez / Red Sea North
  { lat: 30.0, lon: 50.0 },   // Persian Gulf / Kuwait
  { lat: 26.0, lon: 56.0 },   // Strait of Hormuz
  { lat: 25.0, lon: 66.5 },   // Karachi / North Arabian Sea
  { lat: 22.0, lon: 72.0 },   // Gujarat
  { lat: 8.5, lon: 77.0 },    // Cape Comorin / South India
  { lat: 22.0, lon: 88.0 },   // Bengal Delta
  { lat: 20.0, lon: 93.0 },   // Myanmar
  { lat: 8.0, lon: 98.5 },    // Phuket / Andaman Sea
  { lat: 1.5, lon: 104.0 },   // Singapore / Malacca
  { lat: -8.5, lon: 115.0 },  // Bali / Indonesia
  { lat: -21.0, lon: 114.5 }, // Northwest Cape, Australia
  { lat: -35.0, lon: 115.5 }, // Southwest Australia
  { lat: -40.0, lon: 120.0 }, // Southeast Boundary corner
  { lat: -40.0, lon: 75.0 },  // South Central Indian Ocean
  { lat: -40.0, lon: 30.0 },  // Southwest Boundary corner (Agulhas)
  { lat: -34.0, lon: 26.0 },  // South Africa East Coast
  { lat: -15.0, lon: 40.5 },  // Mozambique Channel
  { lat: -3.0, lon: 40.0 },   // Kenya
  { lat: 11.8, lon: 51.2 },   // Horn of Africa / Guardafui
  { lat: 14.5, lon: 43.2 },   // Bab-el-Mandeb
  { lat: 24.0, lon: 37.0 },   // Red Sea Central
  { lat: 30.0, lon: 32.0 },   // Close loop
];

export const IndianOceanBoundary: React.FC<IndianOceanBoundaryProps> = ({
  radius = 2.012,
  visible = true,
}) => {
  const lineRef = useRef<THREE.LineLoop>(null);

  // Convert perimeter coordinates to 3D Cartesian positions
  const points = useMemo(() => {
    return BOUNDARY_COORDS.map((c) => latLonToVector3(c.lat, c.lon, radius));
  }, [radius]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame(({ clock }) => {
    if (lineRef.current && lineRef.current.material) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      const pulse = 0.65 + 0.35 * Math.sin(clock.getElapsedTime() * 2.0);
      mat.opacity = pulse;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Glowing Neon Polyline Perimeter */}
      <primitive
        object={
          new THREE.LineLoop(
            geometry,
            new THREE.LineBasicMaterial({
              color: 0x00f2fe,
              transparent: true,
              opacity: 0.85,
              linewidth: 2,
            })
          )
        }
        ref={lineRef}
      />
    </group>
  );
};
