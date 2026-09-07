import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { latLonToVector3 } from '../utils/geo';

interface IndianOceanRippleMarkerProps {
  lat?: number;
  lon?: number;
  label?: string;
  globeRadius?: number;
  onClick?: () => void;
}

export const IndianOceanRippleMarker: React.FC<IndianOceanRippleMarkerProps> = ({
  lat = -5.0,
  lon = 75.0,
  globeRadius = 2.0,
}) => {
  const ringsRef = useRef<THREE.Group>(null);

  const surfacePos = React.useMemo(() => {
    return latLonToVector3(lat, lon, globeRadius + 0.005);
  }, [lat, lon, globeRadius]);

  const rotation = React.useMemo(() => {
    const normal = surfacePos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quat);
  }, [surfacePos]);

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const t = clock.getElapsedTime() * 1.8;
      ringsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const offset = i * 0.25;
        const progress = (t + offset) % 1.5;
        const scale = 1.0 + progress * 2.2;
        mesh.scale.set(scale, scale, scale);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, 0.6 - (progress / 1.5) * 0.6);
        }
      });
    }
  });

  return (
    <group position={surfacePos} rotation={rotation}>
      {/* 1. Central Cyan Pulsing Beacon Dot */}
      <mesh position={[0, 0.005, 0]}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshBasicMaterial color="#00f2fe" />
      </mesh>

      {/* 2. Concentric Animated Radar Ripple Rings */}
      <group ref={ringsRef} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[0.03 + i * 0.025, 0.033 + i * 0.025, 32]} />
            <meshBasicMaterial
              color="#00f2fe"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
