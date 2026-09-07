import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { ArgoFloat, latLonToVector3 } from '../utils/geo';

interface ArgoMarkersProps {
  floats: ArgoFloat[];
  radius?: number;
  visible?: boolean;
  onSelectFloat?: (float: ArgoFloat) => void;
  onHoverFloat?: (float: ArgoFloat | null) => void;
}

const SingleArgoPin: React.FC<{
  float: ArgoFloat;
  radius: number;
  onSelectFloat?: (float: ArgoFloat) => void;
  onHoverFloat?: (float: ArgoFloat | null) => void;
}> = ({ float, radius, onSelectFloat, onHoverFloat }) => {
  const markerGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const position = React.useMemo(() => {
    return latLonToVector3(float.lat, float.lon, radius);
  }, [float.lat, float.lon, radius]);

  const rotation = React.useMemo(() => {
    const normal = position.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
    return new THREE.Euler().setFromQuaternion(quat);
  }, [position]);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const time = clock.getElapsedTime() * 3.0 + (float.lat * 0.5);
      const scale = 1.0 + (Math.sin(time) * 0.5 + 0.5) * 1.5;
      ringRef.current.scale.set(scale, scale, scale);

      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.8 - (scale - 1.0) / 1.5);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onSelectFloat) {
      onSelectFloat(float);
    }
  };

  const isIndianOcean = float.id.startsWith('ARGO-IN');
  const primaryColor = isIndianOcean ? '#00f2fe' : '#ffb703';

  return (
    <group
      ref={markerGroupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (onHoverFloat) onHoverFloat(float);
      }}
      onPointerOut={() => {
        if (onHoverFloat) onHoverFloat(null);
      }}
    >
      {/* Center glowing dot */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>

      {/* Floating beacon stalk */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.05, 8]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.8} />
      </mesh>

      {/* Pulsing beacon ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <ringGeometry args={[0.025, 0.04, 24]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export const ArgoMarkers: React.FC<ArgoMarkersProps> = ({
  floats,
  radius = 2.016,
  visible = true,
  onSelectFloat,
  onHoverFloat,
}) => {
  if (!visible || !floats || floats.length === 0) return null;

  return (
    <group>
      {floats.map((float) => (
        <SingleArgoPin
          key={float.id}
          float={float}
          radius={radius}
          onSelectFloat={onSelectFloat}
          onHoverFloat={onHoverFloat}
        />
      ))}
    </group>
  );
};
