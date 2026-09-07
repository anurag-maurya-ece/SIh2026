import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

interface CloudLayerProps {
  radius?: number;
  opacity?: number;
  speed?: number;
}

export const CloudLayer: React.FC<CloudLayerProps> = ({
  radius = 2.018,
  opacity = 0.82,
  speed = 0.045,
}) => {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const cloudTexture = useLoader(THREE.TextureLoader, '/textures/Clouds.png');

  useMemo(() => {
    cloudTexture.colorSpace = THREE.SRGBColorSpace;
  }, [cloudTexture]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <mesh ref={cloudsRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={cloudTexture}
        transparent={true}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        roughness={1.0}
        metalness={0.0}
      />
    </mesh>
  );
};
