import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Layers, SlidersHorizontal, Activity, Globe, X } from 'lucide-react';

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
import { ConstellationModal } from './components/ConstellationModal';
import { TelemetryAnalyticsModal } from './components/TelemetryAnalyticsModal';
import { MissionInfoModal } from './components/MissionInfoModal';

import {
  fetchStats,
  fetchGrid,
  fetchProfile,
  fetchArgoFloats,
  prefetchAllDepths,
} from './services/api';
import { GridPoint, ProfilePoint, ArgoFloat, ModelStats } from './utils/geo';

interface GlobeGroupProps {
  autoRotate: boolean;
  gridData: GridPoint[];
  activeLayer: string;
  argoFloats: ArgoFloat[];
  onSelectCoordinate: (lat: number, lon: number) => void;
  onLoadFloatProfile: (float: ArgoFloat) => void;
  onHoverFloat: (float: ArgoFloat | null) => void;
  onOpenDetails: () => void;
}

const GlobeGroup: React.FC<GlobeGroupProps> = ({
  autoRotate,
  gridData,
  activeLayer,
  argoFloats,
  onSelectCoordinate,
  onLoadFloatProfile,
  onHoverFloat,
  onOpenDetails,
}) => {
  const globeGroupRef = useRef<THREE.Group>(null);

  // Synchronous auto-rotation for the entire Globe System
  // Heatmap, boundary perimeter, and Argo pins stay locked to Earth's geography
  useFrame((_, delta) => {
    if (globeGroupRef.current && autoRotate) {
      globeGroupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* Earth 3D Core with NASA Day, Bump & Specular */}
      <Earth
        radius={2.0}
        onSelectCoordinate={onSelectCoordinate}
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
        onSelectFloat={onLoadFloatProfile}
        onHoverFloat={onHoverFloat}
      />

      {/* Indian Ocean Concentric Ripple Target Marker */}
      <IndianOceanRippleMarker
        lat={-12.0}
        lon={68.0}
        label="Indian Ocean"
        globeRadius={2.0}
        onClick={onOpenDetails}
      />
    </group>
  );
};

export function App() {
  // Navigation & Search State
  const [activeNav, setActiveNav] = useState<string>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<string>('sst');
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isOceanBlockOpen, setIsOceanBlockOpen] = useState<boolean>(false);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'left' | 'right'>('none');

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

            {/* Rotating Globe Group: Synchronizes Earth, Heatmap, Boundary & Float Pins */}
            <GlobeGroup
              autoRotate={autoUpdate}
              gridData={gridData}
              activeLayer={activeLayer}
              argoFloats={argoFloats}
              onSelectCoordinate={handleSelectCoordinate}
              onLoadFloatProfile={handleLoadFloatProfile}
              onHoverFloat={setHoveredFloat}
              onOpenDetails={() => setIsDetailsModalOpen(true)}
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
      <div className="relative z-10 w-full flex-1 flex justify-between px-3 md:px-6 py-2 md:py-4 pointer-events-none items-start overflow-hidden">
        {/* Left Column - Desktop Static / Mobile Overlay */}
        <div
          className={`${
            mobilePanel === 'left'
              ? 'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm p-4 flex flex-col justify-center items-center pointer-events-auto animate-in fade-in duration-150'
              : 'hidden lg:flex pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget && mobilePanel === 'left') {
              setMobilePanel('none');
            }
          }}
        >
          <div className="flex flex-col gap-2.5 max-h-[85vh] overflow-y-auto pointer-events-auto">
            {mobilePanel === 'left' && (
              <div className="flex items-center justify-between pb-1 lg:hidden">
                <span className="text-xs font-mono font-semibold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 shadow-xs">
                  Observation Telemetry
                </span>
                <button
                  onClick={() => setMobilePanel('none')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-xs"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            )}
            <LeftSidebar
              region={selectedPoint.region}
              subRegion="MoES PS 26066"
              surfaceTemp={selectedPoint.surface_temp}
              depthRange={stats ? stats.depth_range_m : [0, 1000]}
              coordinatesStr={coordinatesStr}
              stats={stats}
              onOpenDetails={() => {
                setIsDetailsModalOpen(true);
                setMobilePanel('none');
              }}
              onOpenOceanBlock={() => {
                setIsOceanBlockOpen(true);
                setMobilePanel('none');
              }}
              onOpenSatellites={() => {
                setActiveNav('satellites');
                setMobilePanel('none');
              }}
              onOpenTelemetry={() => {
                setActiveNav('analytics');
                setMobilePanel('none');
              }}
            />

            {/* Dedicated Side Float Observation Card */}
            {(hoveredFloat || selectedFloat) && (
              <FloatTelemetryCard
                float={hoveredFloat || selectedFloat!}
                onClose={() => {
                  setHoveredFloat(null);
                  setSelectedFloat(null);
                }}
                onSelect={(f) => {
                  handleLoadFloatProfile(f);
                  setMobilePanel('none');
                }}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop Static / Mobile Overlay */}
        <div
          className={`${
            mobilePanel === 'right'
              ? 'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm p-4 flex flex-col justify-center items-center pointer-events-auto animate-in fade-in duration-150'
              : 'hidden lg:block pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget && mobilePanel === 'right') {
              setMobilePanel('none');
            }
          }}
        >
          <div className="max-h-[85vh] overflow-y-auto pointer-events-auto flex flex-col gap-2">
            {mobilePanel === 'right' && (
              <div className="flex items-center justify-between pb-1 lg:hidden">
                <span className="text-xs font-mono font-semibold text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 shadow-xs">
                  Layers & Depth Controls
                </span>
                <button
                  onClick={() => setMobilePanel('none')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-xs"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            )}
            <RightSidebar
              depth={depth}
              onDepthChange={setDepth}
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
              autoUpdate={autoUpdate}
              onToggleAutoUpdate={() => setAutoUpdate(!autoUpdate)}
            />
          </div>
        </div>
      </div>

      {/* 2.5 MOBILE QUICK DOCK (Visible on < lg screens) */}
      <div className="lg:hidden fixed bottom-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200/90 shadow-lg">
        <button
          onClick={() => setMobilePanel(mobilePanel === 'left' ? 'none' : 'left')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobilePanel === 'left'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
          <span>Telemetry</span>
        </button>

        <button
          onClick={() => setMobilePanel(mobilePanel === 'right' ? 'none' : 'right')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobilePanel === 'right'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
          <span>Depth & Layers</span>
        </button>

        {mobilePanel !== 'none' && (
          <button
            onClick={() => setMobilePanel('none')}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Return to Globe"
          >
            <Globe className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        )}
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

      {/* 6. SATELLITE CONSTELLATION TELEMETRY MODAL */}
      {activeNav === 'satellites' && (
        <ConstellationModal onClose={() => setActiveNav('explore')} />
      )}

      {/* 7. MODEL TELEMETRY & ACCURACY VALIDATION MODAL */}
      {activeNav === 'analytics' && (
        <TelemetryAnalyticsModal
          stats={stats}
          onClose={() => setActiveNav('explore')}
        />
      )}

      {/* 8. MISSION & SIH 26066 ARCHITECTURE MODAL */}
      {activeNav === 'about' && (
        <MissionInfoModal onClose={() => setActiveNav('explore')} />
      )}

      {/* 9. FULL PROFILE MODAL (When clicking View Full Profile) */}
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
