import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GridPoint, createHeatmapCanvasTexture } from '../utils/geo';

interface TemperatureOverlayProps {
  grid: GridPoint[];
  radius?: number;
  opacity?: number;
  visible?: boolean;
}

export const TemperatureOverlay: React.FC<TemperatureOverlayProps> = ({
  grid,
  radius = 2.003,
  opacity = 0.90,
  visible = true,
}) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const specularImgRef = useRef<HTMLImageElement | null>(null);

  // Preload specular map image for ocean-only masking
  useEffect(() => {
    const img = new Image();
    img.src = '/textures/SpecularMap.png';
    img.onload = () => {
      specularImgRef.current = img;
      // Re-trigger rasterization if grid is already present
      if (grid && grid.length > 0) {
        const canvas = createHeatmapCanvasTexture(grid, 2048, 1024, opacity, img);
        const canvasTex = new THREE.CanvasTexture(canvas);
        canvasTex.colorSpace = THREE.SRGBColorSpace;
        canvasTex.wrapS = THREE.ClampToEdgeWrapping;
        canvasTex.wrapT = THREE.ClampToEdgeWrapping;
        canvasTex.needsUpdate = true;

        setTexture((prev) => {
          if (prev) prev.dispose();
          return canvasTex;
        });
      }
    };
  }, []);

  // Generate canvas texture when grid changes
  useEffect(() => {
    if (!grid || grid.length === 0) return;

    const canvas = createHeatmapCanvasTexture(
      grid,
      2048,
      1024,
      opacity,
      specularImgRef.current
    );
    const canvasTex = new THREE.CanvasTexture(canvas);
    canvasTex.colorSpace = THREE.SRGBColorSpace;
    canvasTex.wrapS = THREE.ClampToEdgeWrapping;
    canvasTex.wrapT = THREE.ClampToEdgeWrapping;
    canvasTex.needsUpdate = true;

    setTexture((prev) => {
      if (prev) prev.dispose();
      return canvasTex;
    });

    return () => {
      canvasTex.dispose();
    };
  }, [grid, opacity]);

  if (!visible || !texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={opacity}
        blending={THREE.NormalBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
