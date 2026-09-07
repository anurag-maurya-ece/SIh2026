import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RealisticSatellite3D } from './RealisticSatellite3D';

interface SatellitesOrbitProps {
  globeRadius?: number;
}

/**
 * Creates a dashed circular orbital trajectory line for a given radius and orientation
 */
function createOrbitTrack(
  radius: number,
  inclination: [number, number, number],
  color: number = 0x00f2fe,
  opacity: number = 0.22
): THREE.Line {
  const pts = [];
  const segments = 96;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineDashedMaterial({
    color,
    dashSize: 0.12,
    gapSize: 0.08,
    transparent: true,
    opacity,
    linewidth: 1,
  });
  const line = new THREE.Line(geom, mat);
  line.computeLineDistances();
  line.rotation.set(...inclination);
  return line;
}

export const SatellitesOrbit: React.FC<SatellitesOrbitProps> = ({ globeRadius = 2.0 }) => {
  // 4 Realistic Earth-Observation Oceanographic Satellite Orbits
  const satelliteConfigs = useMemo(() => {
    return [
      {
        name: 'Sentinel-6 Michael Freilich (Altimetry)',
        radius: globeRadius * 1.38,
        inclination: [0.65, 0.35, 0.15] as [number, number, number],
        speed: 0.18,
        initialAngle: 0.2,
        scale: 1.1,
      },
      {
        name: 'Sentinel-3 (SST / SLSTR Radiometer)',
        radius: globeRadius * 1.45,
        inclination: [-0.75, 0.45, -0.3] as [number, number, number],
        speed: 0.14,
        initialAngle: 2.1,
        scale: 1.0,
      },
      {
        name: 'Jason-3 (Ocean Topography)',
        radius: globeRadius * 1.52,
        inclination: [0.4, -0.85, 0.5] as [number, number, number],
        speed: 0.11,
        initialAngle: 4.3,
        scale: 0.95,
      },
      {
        name: 'SWOT / INSAT-3DR (Wide-Swath Oceanography)',
        radius: globeRadius * 1.6,
        inclination: [-0.35, -0.6, -0.8] as [number, number, number],
        speed: 0.09,
        initialAngle: 5.4,
        scale: 1.05,
      },
    ];
  }, [globeRadius]);

  // Orbital trajectory lines
  const orbitTracks = useMemo(() => {
    return satelliteConfigs.map((cfg) =>
      createOrbitTrack(cfg.radius, cfg.inclination, 0x00f2fe, 0.2)
    );
  }, [satelliteConfigs]);

  return (
    <group>
      {/* 1. Dashed Orbital Trajectory Rings */}
      {orbitTracks.map((track, idx) => (
        <primitive key={idx} object={track} />
      ))}

      {/* 2. Realistic 3D Satellites in Active Nadir Orbit */}
      {satelliteConfigs.map((cfg, idx) => (
        <RealisticSatellite3D
          key={idx}
          name={cfg.name}
          orbitRadius={cfg.radius}
          inclination={cfg.inclination}
          speed={cfg.speed}
          initialAngle={cfg.initialAngle}
          scale={cfg.scale}
          showSensorCone={true}
        />
      ))}
    </group>
  );
};
