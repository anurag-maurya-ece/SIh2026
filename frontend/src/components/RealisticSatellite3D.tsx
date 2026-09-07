import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RealisticSatellite3DProps {
  orbitRadius: number;
  inclination: [number, number, number]; // Euler rotation angles
  speed: number;
  initialAngle?: number;
  name?: string;
  showSensorCone?: boolean;
  scale?: number;
}

/**
 * Procedural photovoltaic solar panel texture with blue silicon cells and golden busbars
 */
function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark deep navy/blue silicon background
    ctx.fillStyle = '#061a38';
    ctx.fillRect(0, 0, 512, 256);

    // Solar cells grid
    const cols = 8;
    const rows = 4;
    const cellW = 512 / cols;
    const cellH = 256 / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * cellW + 2;
        const y = r * cellH + 2;
        const w = cellW - 4;
        const h = cellH - 4;

        // Photovoltaic cell gradient
        const grad = ctx.createLinearGradient(x, y, x + w, y + h);
        grad.addColorStop(0, '#0d3875');
        grad.addColorStop(0.5, '#072450');
        grad.addColorStop(1, '#051b3d');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Thin silicon anti-reflective wafer lines
        ctx.strokeStyle = '#00a8ff';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.4;
        for (let l = 1; l < 4; l++) {
          ctx.beginPath();
          ctx.moveTo(x, y + (h / 4) * l);
          ctx.lineTo(x + w, y + (h / 4) * l);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // Silver/Gold busbars
        ctx.strokeStyle = '#e2b024';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.33, y);
        ctx.lineTo(x + w * 0.33, y + h);
        ctx.moveTo(x + w * 0.66, y);
        ctx.lineTo(x + w * 0.66, y + h);
        ctx.stroke();
      }
    }

    // Outer frame border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const RealisticSatellite3D: React.FC<RealisticSatellite3DProps> = ({
  orbitRadius,
  inclination,
  speed,
  initialAngle = 0,
  name = 'Sentinel-6',
  showSensorCone = true,
  scale = 0.85,
}) => {
  const satellitePivotRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const angleRef = useRef<number>(initialAngle);

  // Reusable procedural solar panel texture
  const solarTexture = useMemo(() => createSolarPanelTexture(), []);

  // Gold foil thermal insulation blanket material for central satellite bus
  const goldFoilMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'),
        emissive: new THREE.Color('#382800'),
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  // Solar panel frame & wings material
  const solarPanelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: solarTexture,
        roughness: 0.2,
        metalness: 0.6,
        side: THREE.DoubleSide,
      }),
    [solarTexture]
  );

  // High gain antenna dish material
  const dishMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e2e8f0'),
        roughness: 0.25,
        metalness: 0.4,
      }),
    []
  );

  // Titanium/Dark alloy frame material
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        roughness: 0.4,
        metalness: 0.7,
      }),
    []
  );

  // Orbital revolution and self-attitude nadir pointing
  useFrame((_, delta) => {
    angleRef.current += speed * delta;
    const currentAngle = angleRef.current;

    if (satellitePivotRef.current) {
      const x = Math.cos(currentAngle) * orbitRadius;
      const z = Math.sin(currentAngle) * orbitRadius;
      satellitePivotRef.current.position.set(x, 0, z);

      // Nadir pointing: Orient satellite sensor suite directly facing Earth center (0,0,0)
      if (bodyGroupRef.current) {
        bodyGroupRef.current.lookAt(0, 0, 0);
      }
    }
  });

  return (
    <group rotation={inclination}>
      <group ref={satellitePivotRef}>
        <group ref={bodyGroupRef} scale={[scale, scale, scale]}>
          {/* ─── 1. CENTRAL SATELLITE BUS (GOLD FOIL CORE) ─── */}
          <mesh position={[0, 0, 0]} material={goldFoilMaterial}>
            <boxGeometry args={[0.07, 0.08, 0.12]} />
          </mesh>

          {/* Optical/Altimeter Sensor Payload on Nadir Face (+Z points toward Earth) */}
          <mesh position={[0, 0, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.026, 0.018, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Sensor Aperture Blue Lens */}
          <mesh position={[0, 0, 0.075]}>
            <circleGeometry args={[0.018, 16]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.8} />
          </mesh>

          {/* Top Avionics Equipment Bay */}
          <mesh position={[0, 0.045, 0]} material={frameMaterial}>
            <boxGeometry args={[0.05, 0.02, 0.09]} />
          </mesh>

          {/* ─── 2. HIGH-GAIN PARABOLIC DISH ANTENNA ─── */}
          <group position={[0, 0.065, -0.02]} rotation={[-0.4, 0.2, 0]}>
            {/* Dish Reflector Bowl */}
            <mesh material={dishMaterial}>
              <sphereGeometry args={[0.042, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            </mesh>
            {/* Feed Horn Support Rod */}
            <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.002, 0.04, 8]} />
              <meshBasicMaterial color="#e2b024" />
            </mesh>
            {/* Feed Horn Sub-reflector */}
            <mesh position={[0, 0, 0.045]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshBasicMaterial color="#d4af37" />
            </mesh>
          </group>

          {/* ─── 3. SOLAR ARRAY WINGS (LEFT & RIGHT) ─── */}
          {/* Right Solar Array Boom & Panel */}
          <group position={[0.035, 0, 0]}>
            {/* Support Truss / Boom */}
            <mesh position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
              <cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />
            </mesh>
            {/* Solar Array Slabs */}
            <mesh position={[0.13, 0, 0]} rotation={[0, 0, 0]} material={solarPanelMaterial}>
              <boxGeometry args={[0.16, 0.004, 0.075]} />
            </mesh>
          </group>

          {/* Left Solar Array Boom & Panel */}
          <group position={[-0.035, 0, 0]}>
            {/* Support Truss / Boom */}
            <mesh position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
              <cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />
            </mesh>
            {/* Solar Array Slabs */}
            <mesh position={[-0.13, 0, 0]} rotation={[0, 0, 0]} material={solarPanelMaterial}>
              <boxGeometry args={[0.16, 0.004, 0.075]} />
            </mesh>
          </group>

          {/* ─── 4. MAGNETOMETER / SENSOR BOOM ARM ─── */}
          <group position={[0, -0.04, -0.04]} rotation={[0.5, 0, 0]}>
            <mesh position={[0, -0.03, 0]}>
              <cylinderGeometry args={[0.002, 0.002, 0.06, 8]} />
              <meshBasicMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
            </mesh>
          </group>

          {/* ─── 5. STATUS TELEMETRY LED BEACON ─── */}
          <mesh position={[0.036, 0.04, 0.06]}>
            <sphereGeometry args={[0.004, 8, 8]} />
            <meshBasicMaterial color="#00ff66" />
          </mesh>

          {/* ─── 6. OCEAN ALTIMETRY RADAR SCANNING CONE (NADIR) ─── */}
          {showSensorCone && (
            <mesh position={[0, 0, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.16, 0.85, 16, 1, true]} />
              <meshBasicMaterial
                color="#00f2fe"
                transparent
                opacity={0.07}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};
