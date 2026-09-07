import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import { vector3ToLatLon } from '../utils/geo';

interface EarthProps {
  radius?: number;
  autoRotate?: boolean;
  onSelectCoordinate?: (lat: number, lon: number) => void;
}

export const Earth: React.FC<EarthProps> = ({
  radius = 2.0,
  autoRotate = true,
  onSelectCoordinate,
}) => {
  const earthRef = useRef<THREE.Mesh>(null);

  // Load NASA earth textures: ColorMap, BumpMap, and SpecularMap
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

  // Subtle auto-rotation when idle
  useFrame((_, delta) => {
    if (earthRef.current && autoRotate) {
      earthRef.current.rotation.y += delta * 0.03;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!earthRef.current || !onSelectCoordinate) return;

    // Get point in local sphere coordinate space
    const localPoint = e.point.clone();
    earthRef.current.worldToLocal(localPoint);

    const { lat, lon } = vector3ToLatLon(localPoint, radius);
    onSelectCoordinate(lat, lon);
  };

  return (
    <mesh
      ref={earthRef}
      onClick={handleClick}
      receiveShadow
      castShadow
    >
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.06}
        roughnessMap={specularMap}
        roughness={0.65}
        metalness={0.15}
      />
    </mesh>
  );
};
