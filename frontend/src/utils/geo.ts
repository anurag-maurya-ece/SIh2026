import * as THREE from 'three';

export interface GridPoint {
  lat: number;
  lon: number;
  temp: number;
}

export interface ProfilePoint {
  depth: number;
  temp: number;
  confidence: number;
  uncertainty_upper?: number;
  uncertainty_lower?: number;
}

export interface ArgoFloat {
  id: string;
  name: string;
  lat: number;
  lon: number;
  basin: string;
  status: string;
  last_depth_m: number;
  sensor_type: string;
  last_update: string;
}

export interface ModelStats {
  rmse: number;
  r2_score: number;
  mae: number;
  temp_min?: number;
  temp_max?: number;
  depth_range_m: [number, number];
  region: string;
  primary_focus: string;
  satellite_features: string[];
  ground_truth: string;
  model_architecture: string;
  last_retrained: string;
}

// Indian Ocean MoES Focus Spatial Bounds (SIH 2026 PS 26066)
export const INDIAN_OCEAN_BOUNDS = {
  minLat: -40.0,
  maxLat: 30.0,
  minLon: 30.0,
  maxLon: 120.0,
};

/**
 * Checks if a coordinate is strictly within the Indian Ocean Problem Statement Area.
 */
export function isWithinIndianOcean(lat: number, lon: number): boolean {
  return (
    lat >= INDIAN_OCEAN_BOUNDS.minLat &&
    lat <= INDIAN_OCEAN_BOUNDS.maxLat &&
    lon >= INDIAN_OCEAN_BOUNDS.minLon &&
    lon <= INDIAN_OCEAN_BOUNDS.maxLon
  );
}

/**
 * Convert Latitude & Longitude to 3D Cartesian Vector3 on a sphere of given radius.
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Convert 3D Point on Sphere to Latitude & Longitude
 */
export function vector3ToLatLon(point: THREE.Vector3, radius: number): { lat: number; lon: number } {
  const normalized = point.clone().normalize();
  const lat = 90 - Math.acos(normalized.y) * (180 / Math.PI);
  
  let lon = Math.atan2(normalized.z, -normalized.x) * (180 / Math.PI) - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;

  return {
    lat: Math.round(lat * 100) / 100,
    lon: Math.round(lon * 100) / 100
  };
}

/**
 * Maps ocean temperature (°C) to an RGB/Hex color string.
 */
export function getTemperatureColor(temp: number): { r: number; g: number; b: number; hex: string } {
  const stops = [
    { t: -2.0, r: 26, g: 0, b: 51, hex: '#1a0033' },
    { t: 4.0, r: 10, g: 37, b: 88, hex: '#0a2558' },
    { t: 10.0, r: 0, g: 168, b: 204, hex: '#00a8cc' },
    { t: 16.0, r: 46, g: 196, b: 182, hex: '#2ec4b6' },
    { t: 22.0, r: 255, g: 183, b: 3, hex: '#ffb703' },
    { t: 26.5, r: 251, g: 133, b: 0, hex: '#fb8500' },
    { t: 31.5, r: 214, g: 40, b: 40, hex: '#d62828' }
  ];

  if (temp <= stops[0].t) {
    const s = stops[0];
    return { r: s.r, g: s.g, b: s.b, hex: s.hex };
  }
  if (temp >= stops[stops.length - 1].t) {
    const s = stops[stops.length - 1];
    return { r: s.r, g: s.g, b: s.b, hex: s.hex };
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const lower = stops[i];
    const upper = stops[i + 1];
    if (temp >= lower.t && temp <= upper.t) {
      const factor = (temp - lower.t) / (upper.t - lower.t);
      const r = Math.round(lower.r + factor * (upper.r - lower.r));
      const g = Math.round(lower.g + factor * (upper.g - lower.g));
      const b = Math.round(lower.b + factor * (upper.b - lower.b));
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      return { r, g, b, hex };
    }
  }

  return { r: 0, g: 168, b: 204, hex: '#00a8cc' };
}

/**
 * Interpolate temperature and confidence at any depth (0-1000m) from a profile.
 */
export function interpolateProfileTemp(
  profile: ProfilePoint[],
  depth: number
): { temp: number; confidence: number } {
  if (!profile || profile.length === 0) {
    // Default fallback gradient if profile is loading
    const frac = Math.min(1, Math.max(0, depth / 1000));
    const fallbackTemp = 28.0 - frac * 23.5; // ~28°C surface to 4.5°C at 1000m
    return { temp: fallbackTemp, confidence: 0.94 };
  }

  if (profile.length === 1) {
    return { temp: profile[0].temp, confidence: profile[0].confidence };
  }

  // If depth is before first point
  if (depth <= profile[0].depth) {
    return { temp: profile[0].temp, confidence: profile[0].confidence };
  }

  // If depth is after last point
  if (depth >= profile[profile.length - 1].depth) {
    const last = profile[profile.length - 1];
    return { temp: last.temp, confidence: last.confidence };
  }

  for (let i = 0; i < profile.length - 1; i++) {
    const p1 = profile[i];
    const p2 = profile[i + 1];
    if (depth >= p1.depth && depth <= p2.depth) {
      const span = p2.depth - p1.depth;
      const factor = span === 0 ? 0 : (depth - p1.depth) / span;
      const temp = p1.temp + factor * (p2.temp - p1.temp);
      const confidence = p1.confidence + factor * (p2.confidence - p1.confidence);
      return { temp, confidence };
    }
  }

  return { temp: profile[0].temp, confidence: profile[0].confidence };
}

/**
 * Generate a vertical gradient CanvasTexture for the 3D Ocean Block.
 * Top (y=0) is 0m (Surface), Bottom (y=height) is 1000m (Abyssal).
 */
export function createOceanBlockGradientTexture(
  profile: ProfilePoint[],
  width: number = 256,
  height: number = 1024
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const depth = (y / (height - 1)) * 1000;
      const { temp } = interpolateProfileTemp(profile, depth);
      const color = getTemperatureColor(temp);

      // Add a very subtle horizontal depth gridline every 100m
      const isGridLine = Math.abs(depth % 100) < 1.5;
      const r = isGridLine ? Math.min(255, color.r + 35) : color.r;
      const g = isGridLine ? Math.min(255, color.g + 35) : color.g;
      const b = isGridLine ? Math.min(255, color.b + 40) : color.b;

      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}


/**
 * Generate a dynamic 2D canvas texture representing the ocean temperature heatmap grid.
 * STRICTLY restricted to the Indian Ocean Focus Area (Lat: -40 to 30, Lon: 30 to 120).
 */
export function createHeatmapCanvasTexture(
  grid: GridPoint[],
  width: number = 2048,
  height: number = 1024,
  opacity: number = 0.92,
  specularMaskImage?: HTMLImageElement | null
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, width, height);
  if (!grid || grid.length === 0) return canvas;

  const latStep = 3.0;
  const blendRadius = (width / 360) * latStep * 2.2;

  for (const point of grid) {
    // FILTER: Only draw heatmap inside the Indian Ocean region
    if (!isWithinIndianOcean(point.lat, point.lon)) {
      continue;
    }

    const x = ((point.lon + 180) / 360) * width;
    const y = ((90 - point.lat) / 180) * height;

    const color = getTemperatureColor(point.temp);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, blendRadius);
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
    gradient.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.82})`);
    gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, blendRadius, 0, Math.PI * 2);
    ctx.fill();

    // Wrap around seam at lon +-180 if needed
    if (x < blendRadius) {
      ctx.beginPath();
      ctx.arc(x + width, y, blendRadius, 0, Math.PI * 2);
      ctx.fill();
    } else if (x > width - blendRadius) {
      ctx.beginPath();
      ctx.arc(x - width, y, blendRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Mask against SpecularMap: Keep only ocean pixels, mask out landmasses
  if (specularMaskImage && specularMaskImage.complete && specularMaskImage.naturalWidth > 0) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(specularMaskImage, 0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }

  return canvas;
}
