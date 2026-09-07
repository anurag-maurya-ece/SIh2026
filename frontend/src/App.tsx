import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { Earth } from './components/Earth';
import { CloudLayer } from './components/CloudLayer';
import { Atmosphere } from './components/Atmosphere';
import { TemperatureOverlay } from './components/TemperatureOverlay';
import { IndianOceanBoundary } from './components/IndianOceanBoundary';
import { ArgoMarkers } from './components/ArgoMarkers';
import { SatellitesOrbit } from './components/SatellitesOrbit';
import { IndianOceanRippleMarker } from './components/IndianOceanRippleMarker';
import { Starfield } from './components/Starfield';
import { SunLight } from './components/SunLight';

import { TopNavbar } from './components/TopNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomStatusBar } from './components/BottomStatusBar';
import { CompassWidget } from './components/CompassWidget';
import { FullProfileModal } from './components/FullProfileModal';
import { OceanBlockView } from './components/OceanBlock';
import { FloatTelemetryCard } from './components/FloatTelemetryCard';

import {
  fetchStats,
  fetchGrid,
  fetchProfile,
  fetchArgoFloats,
  prefetchAllDepths,
} from './services/api';
import { GridPoint, ProfilePoint, ArgoFloat, ModelStats } from './utils/geo';

export function App() {
  // Navigation & Search State
  const [activeNav, setActiveNav] = useState<string>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<string>('sst');
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isOceanBlockOpen, setIsOceanBlockOpen] = useState<boolean>(false);

  // Hovered / Selected Float for side panel display
  const [hoveredFloat, setHoveredFloat] = useState<ArgoFloat | null>(null);
  const [selectedFloat, setSelectedFloat] = useState<ArgoFloat | null>(null);

  // Ocean Data & Slider State
  const [depth, setDepth] = useState<number>(0);
  const [gridData, setGridData] = useState<GridPoint[]>([]);
  const [argoFloats, setArgoFloats] = useState<ArgoFloat[]>([]);
  const [stats, setStats] = useState<ModelStats | null>(null);

  // Active Observation Coordinate
  const [selectedPoint, setSelectedPoint] = useState<{
    id: string;
    lat: number;
    lon: number;
    region: string;
    surface_temp: number;
    deep_temp_1000m: number;
    mean_confidence: number;
    profile: ProfilePoint[];
  }>({
    id: 'ARGO-IN-2902134',
    lat: 24.42,
    lon: 44.05,
    region: 'Indian Ocean',
    surface_temp: 21.9,
    deep_temp_1000m: 4.8,
    mean_confidence: 0.94,
    profile: [],
  });

  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Initial Data & Cache Prefetching
  useEffect(() => {
    async function initApp() {
      try {
        const statsData = await fetchStats();
        setStats(statsData);
      } catch (err) {
        console.warn('Error loading stats', err);
      }

      try {
        const floats = await fetchArgoFloats();
        setArgoFloats(floats);
      } catch (err) {
        console.warn('Error loading Argo floats', err);
      }

      // Initial surface grid load
      const initialGrid = await fetchGrid(0);
      setGridData(initialGrid);

      // Load profile at default coordinate
      try {
        const defaultProfile = await fetchProfile(24.42, 44.05);
        setSelectedPoint({
          id: 'ARGO-IN-2902134',
          ...defaultProfile,
        });
      } catch (err) {
        console.warn('Error loading profile', err);
      }

      // Pre-warm background cache for all depths
      prefetchAllDepths();
    }

    initApp();
  }, []);

  // Update Grid when depth changes
  useEffect(() => {
    let isCancelled = false;
    async function updateDepthGrid() {
      const grid = await fetchGrid(depth);
      if (!isCancelled) {
        setGridData(grid);
      }
    }
    updateDepthGrid();
    return () => {
      isCancelled = true;
    };
  }, [depth]);

  // Handle User Clicking Any Coordinate on Globe
  const handleSelectCoordinate = async (lat: number, lon: number, customId?: string) => {
    try {
      const profileData = await fetchProfile(lat, lon);
      setSelectedPoint({
        id: customId || `ARGO-IN-${Math.abs(Math.round(lat * 100))}`,
        ...profileData,
      });
    } catch (err) {
      console.error('Error fetching point profile', err);
    }
  };

  // Handle Loading Subsurface Profile for a Specific Float (opens Full Profile Modal)
  const handleLoadFloatProfile = async (float: ArgoFloat) => {
    try {
      setSelectedFloat(float);
      const profileData = await fetchProfile(float.lat, float.lon);
      setSelectedPoint({
        id: float.id,
        lat: float.lat,
        lon: float.lon,
        region: float.basin || profileData.region,
        surface_temp: profileData.surface_temp,
        deep_temp_1000m: profileData.deep_temp_1000m,
        mean_confidence: profileData.mean_confidence,
        profile: profileData.profile,
      });
      setIsDetailsModalOpen(true);
    } catch (err) {
      console.error('Error fetching float profile', err);
    }
  };

  const coordinatesStr = `${Math.abs(selectedPoint.lat).toFixed(2)}° ${selectedPoint.lat >= 0 ? 'N' : 'S'}, ${Math.abs(selectedPoint.lon).toFixed(2)}° ${selectedPoint.lon >= 0 ? 'W' : 'E'}`;

  return (
    <div className="relative w-screen h-screen bg-[#060a14] overflow-hidden font-sans select-none text-slate-100 flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0.3, 0.4, 4.2], fov: 42, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <SunLight />
            <Starfield count={3000} />

            {/* Earth 3D Core with NASA Day, Bump & Specular */}
            <Earth
              radius={2.0}
              autoRotate={autoUpdate}
              onSelectCoordinate={handleSelectCoordinate}
            />

            {/* Ocean Heatmap Dynamic Canvas Overlay (Visible when SST layer active) */}
            <TemperatureOverlay
              grid={gridData}
              radius={2.003}
              visible={activeLayer === 'sst'}
            />

            {/* Indian Ocean MoES Focus Boundary */}
            <IndianOceanBoundary
              radius={2.012}
              visible={true}
            />

            {/* Argo Float Observation Pins */}
            <ArgoMarkers
              floats={argoFloats}
              radius={2.016}
              visible={true}
              onSelectFloat={(f) => handleLoadFloatProfile(f)}
              onHoverFloat={(f) => setHoveredFloat(f)}
            />

            {/* Satellites Orbiting Tracks and Line-Art Glyphs */}
            <SatellitesOrbit globeRadius={2.0} />

            {/* Indian Ocean Concentric Ripple Target Marker */}
            <IndianOceanRippleMarker
              lat={-12.0}
              lon={68.0}
              label="Indian Ocean"
              globeRadius={2.0}
              onClick={() => setIsDetailsModalOpen(true)}
            />

            {/* Atmospheric Rim Glow Shell */}
            <Atmosphere radius={2.065} />

            {/* Animated Rotating Cloud Layer */}
            <CloudLayer radius={2.022} opacity={0.65} />

            <OrbitControls
              ref={controlsRef}
              enableDamping={true}
              dampingFactor={0.06}
              minDistance={2.4}
              maxDistance={12.0}
              rotateSpeed={0.65}
              zoomSpeed={0.8}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 1. TOP NAVIGATION BAR */}
      <TopNavbar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. MAIN CENTER HUD (Left Sidebar & Right Sidebar) */}
      <div className="relative z-10 w-full flex-1 flex justify-between px-6 py-4 pointer-events-none items-start">
        {/* Left Column (Left Sidebar & Side Float Telemetry Card) */}
        <div className="flex flex-col gap-3">
          <LeftSidebar
            region={selectedPoint.region}
            subRegion="MoES PS 26066"
            surfaceTemp={selectedPoint.surface_temp}
            depthRange={stats ? stats.depth_range_m : [0, 1000]}
            coordinatesStr={coordinatesStr}
            stats={stats}
            onOpenDetails={() => setIsDetailsModalOpen(true)}
            onOpenOceanBlock={() => setIsOceanBlockOpen(true)}
          />

          {/* Dedicated Side Float Observation Card */}
          {(hoveredFloat || selectedFloat) && (
            <FloatTelemetryCard
              float={hoveredFloat || selectedFloat!}
              onClose={() => {
                setHoveredFloat(null);
                setSelectedFloat(null);
              }}
              onSelect={handleLoadFloatProfile}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          depth={depth}
          onDepthChange={setDepth}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          autoUpdate={autoUpdate}
          onToggleAutoUpdate={() => setAutoUpdate(!autoUpdate)}
        />
      </div>

      {/* 3. FLOATING COMPASS WIDGET (Bottom-Right corner over the globe) */}
      <CompassWidget />

      {/* 4. BOTTOM STATUS BAR */}
      <BottomStatusBar
        coordinatesStr={coordinatesStr}
      />

      {/* 5. 3D OCEAN BLOCK VIEW (Dedicated 0-1000m Subsurface Slice View) */}
      {(isOceanBlockOpen || activeNav === 'data') && (
        <div className="absolute inset-0 z-40 animate-in fade-in zoom-in-95 duration-200">
          <OceanBlockView
            profile={selectedPoint.profile}
            currentDepth={depth}
            onDepthChange={setDepth}
            lat={selectedPoint.lat}
            lon={selectedPoint.lon}
            region={selectedPoint.region}
            onClose={() => {
              setIsOceanBlockOpen(false);
              if (activeNav === 'data') setActiveNav('explore');
            }}
          />
        </div>
      )}

      {/* 6. FULL PROFILE MODAL (When clicking View Full Profile) */}
      {isDetailsModalOpen && (
        <FullProfileModal
          id={selectedPoint.id}
          lat={selectedPoint.lat}
          lon={selectedPoint.lon}
          region={selectedPoint.region}
          surfaceTemp={selectedPoint.surface_temp}
          deepTemp={selectedPoint.deep_temp_1000m}
          confidence={selectedPoint.mean_confidence}
          profile={selectedPoint.profile}
          currentDepth={depth}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
