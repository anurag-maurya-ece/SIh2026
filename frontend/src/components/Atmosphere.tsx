import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AtmosphereProps {
  radius?: number;
  glowColor?: string;
}

const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 glowColor;
    uniform float coefficient;
    uniform float power;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      float fresnel = dot(viewDir, vNormal);
      // Rim intensity: strongest at glancing angles
      float intensity = pow(1.0 - max(0.0, fresnel), power) * coefficient;
      gl_FragColor = vec4(glowColor, intensity);
    }
  `,
};

export const Atmosphere: React.FC<AtmosphereProps> = ({
  radius = 2.06,
  glowColor = '#00c2ff',
}) => {
  const uniforms = useMemo(
    () => ({
      glowColor: { value: new THREE.Color(glowColor) },
      coefficient: { value: 0.85 },
      power: { value: 3.2 },
    }),
    [glowColor]
  );

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        vertexShader={AtmosphereShader.vertexShader}
        fragmentShader={AtmosphereShader.fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
};
