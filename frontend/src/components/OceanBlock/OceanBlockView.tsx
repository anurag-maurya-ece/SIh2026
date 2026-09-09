import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  Layers,
  Thermometer,
  Eye,
  RotateCcw,
  Play,
  Pause,
  ArrowDown,
  Sparkles,
  Compass,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  Info,
} from 'lucide-react';

import { OceanBlock3D } from './OceanBlock3D';
import { Starfield } from '../Starfield';
import { ProfilePoint, interpolateProfileTemp, getTemperatureColor } from '../../utils/geo';

interface OceanBlockViewProps {
  profile: ProfilePoint[];
  currentDepth: number;
  onDepthChange: (depth: number) => void;
  lat: number;
  lon: number;
  region?: string;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const OceanBlockView: React.FC<OceanBlockViewProps> = ({
  profile,
  currentDepth,
  onDepthChange,
  lat,
  lon,
  region = 'Indian Ocean',
  onClose,
  isStandalonePage = false,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'iso' | 'front' | 'side' | 'top'>('iso');

  // Interpolated data points
  const surfaceData = interpolateProfileTemp(profile, 0);
  const currentData = interpolateProfileTemp(profile, currentDepth);
  const deepData = interpolateProfileTemp(profile, 1000);
  const deltaT = (surfaceData.temp - currentData.temp).toFixed(1);

  const depthRef = useRef(currentDepth);
  depthRef.current = currentDepth;

  // Auto depth animation scrubber
  useEffect(() => {
    if (!isPlaying) return;
    let step = 6;
    const interval = setInterval(() => {
      let next = depthRef.current + step;
      if (next >= 1000) {
        next = 1000;
        step = -6;
      } else if (next <= 0) {
        next = 0;
        step = 6;
      }
      onDepthChange(next);
    }, 35);

    return () => clearInterval(interval);
  }, [isPlaying, onDepthChange]);

  // Camera presets
  const setPresetView = (view: 'iso' | 'front' | 'side' | 'top') => {
    setCameraView(view);
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (view === 'iso') {
      controls.object.position.set(5.2, 4.0, 5.2);
      controls.target.set(0, 0, 0);
    } else if (view === 'front') {
      controls.object.position.set(0, 0.2, 6.8);
      controls.target.set(0, 0, 0);
    } else if (view === 'side') {
      controls.object.position.set(6.8, 0.2, 0);
      controls.target.set(0, 0, 0);
    } else if (view === 'top') {
      controls.object.position.set(0, 7.2, 0.01);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  const depthPresets = [
    { label: 'Surface', depth: 0, tag: '0m' },
    { label: 'Mixed Layer', depth: 75, tag: '75m' },
    { label: 'Thermocline', depth: 200, tag: '200m' },
    { label: 'Mesopelagic', depth: 500, tag: '500m' },
    { label: 'Abyssal', depth: 1000, tag: '1000m' },
  ];

  return (
    <div className="relative w-full h-full bg-[#050811] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* ─── 1. 3D WebGL Canvas Layer ─── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [5.2, 3.8, 5.2], fov: 45, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            {/* Background & Lighting */}
            <color attach="background" args={['#050811']} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[6, 8, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-6, -4, -5]} intensity={0.4} color="#00f2fe" />
            <pointLight position={[0, 4, 0]} intensity={1.2} color="#38bdf8" />
            <Starfield count={1500} />

            {/* 3D Ocean Block Slice */}
            <OceanBlock3D
              profile={profile}
              currentDepth={currentDepth}
              onDepthChange={onDepthChange}
              lat={lat}
              lon={lon}
              region={region}
              width={4.2}
              length={4.2}
              height={2.8}
            />

            <OrbitControls
              ref={controlsRef}
              enableDamping={true}
              dampingFactor={0.06}
              minDistance={3.2}
              maxDistance={14.0}
              rotateSpeed={0.7}
              zoomSpeed={0.8}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ─── 2. TOP HEADER HUD ─── */}
      <div className="relative z-10 w-full px-3 sm:px-5 py-2.5 flex items-center justify-between pointer-events-none gap-2">
        {/* Left Title Badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 shadow-sm">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shadow-xs shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-display font-bold text-slate-900 tracking-tight whitespace-nowrap">
                3D Ocean Block Slice
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                0–1000m
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono font-medium flex items-center gap-1">
              <span className="truncate max-w-[90px] sm:max-w-none">{region}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-semibold">
                {Math.abs(lat).toFixed(1)}°{lat >= 0 ? 'N' : 'S'}, {Math.abs(lon).toFixed(1)}°{lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
          </div>
        </div>

        {/* Center View Angle Selector */}
        <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 pointer-events-auto shadow-sm">
          <button
            onClick={() => setPresetView('iso')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              cameraView === 'iso'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setPresetView('front')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              cameraView === 'front'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setPresetView('side')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              cameraView === 'side'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Side
          </button>
          <button
            onClick={() => setPresetView('top')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              cameraView === 'top'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Top
          </button>
          <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
          <button
            onClick={() => setPresetView('iso')}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Reset Orbit"
          >
            <RotateCcw className="w-3 h-3 stroke-[2.2]" />
          </button>
        </div>

        {/* Right Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all pointer-events-auto shadow-sm"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* ─── 3. CENTER HUD (COMPACT TELEMETRY CARD & THERMAL SCALE) ─── */}
      <div className="relative z-10 w-full flex justify-between px-3 sm:px-5 pointer-events-none items-start gap-2">
        {/* Left Telemetry Card */}
        <div className="institutional-card p-2.5 sm:p-3 rounded-xl flex flex-col gap-2 w-60 sm:w-64 md:w-68 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200 text-slate-900 shadow-md">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500">
              Subsurface Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Active Selected Depth Temp */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border border-slate-800 shadow-xs flex items-center justify-between text-white">
              <div>
                <div className="text-[9px] uppercase font-semibold text-sky-300">
                  Slice Depth: {Math.round(currentDepth)}m
                </div>
                <div className="text-base sm:text-lg font-bold font-mono mt-0.5 text-white">
                  {currentData.temp.toFixed(2)}°C
                </div>
              </div>
              <div
                className="w-4 h-4 rounded-full border border-white/40 shadow-xs shrink-0"
                style={{ backgroundColor: getTemperatureColor(currentData.temp).hex }}
              />
            </div>

            {/* Compact Metric Rows */}
            <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
              <div className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex flex-col">
                <span className="text-[9px] text-slate-400 font-medium">Surface (0m)</span>
                <span className="font-mono font-bold text-slate-800">{surfaceData.temp.toFixed(1)}°C</span>
              </div>
              <div className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex flex-col">
                <span className="text-[9px] text-slate-400 font-medium">Abyssal (1000m)</span>
                <span className="font-mono font-bold text-slate-800">{deepData.temp.toFixed(1)}°C</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] px-1 font-medium text-slate-600">
              <span>ΔT Thermal Gradient:</span>
              <span className="font-mono font-bold text-rose-600">-{deltaT}°C</span>
            </div>

            <div className="flex items-center justify-between text-[10px] px-1 font-medium text-slate-600">
              <span>AI Validation:</span>
              <span className="font-mono font-bold text-emerald-700">
                {(currentData.confidence * 100).toFixed(1)}% R²
              </span>
            </div>
          </div>

          {/* Thermal Layer Description Badge */}
          <div className="p-2 rounded-lg bg-slate-50/90 border border-slate-200/70 text-[9.5px] leading-snug text-slate-600">
            {currentDepth < 80 ? (
              <span>
                ☀️ <strong className="text-slate-900 font-semibold">Epipelagic:</strong> Sunlit mixed layer with direct atmospheric coupling.
              </span>
            ) : currentDepth < 350 ? (
              <span>
                ⚡ <strong className="text-slate-900 font-semibold">Thermocline:</strong> Steep gradient zone of rapid cooling.
              </span>
            ) : (
              <span>
                ❄️ <strong className="text-slate-900 font-semibold">Bathypelagic:</strong> Cold, uniform deep water layer (~4-6°C).
              </span>
            )}
          </div>
        </div>

        {/* Right Color Scale & Legend Card */}
        <div className="hidden sm:flex institutional-card p-2.5 sm:p-3 rounded-xl flex-col gap-2 w-44 md:w-48 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-200 text-slate-900 shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-wider font-mono pb-1 border-b border-slate-100 text-slate-500">
            Thermal Spectrum
          </div>

          {/* Color Gradient Bar */}
          <div className="flex flex-col gap-1">
            <div
              className="h-2 w-full rounded-md border border-slate-200/60 overflow-hidden shadow-xs"
              style={{
                background:
                  'linear-gradient(to right, #1a0033 0%, #0a2558 15%, #00a8cc 35%, #2ec4b6 55%, #38bdf8 75%, #fb8500 88%, #d62828 100%)',
              }}
            />
            <div className="flex justify-between text-[8.5px] font-mono font-medium text-slate-500">
              <span>-2°C</span>
              <span>15°C</span>
              <span>&gt;32°C</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1 text-[9.5px] font-medium text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-[#d62828] shrink-0" />
              <span>Warm (&gt;25°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-[#00a8cc] shrink-0" />
              <span>Thermocline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-[#0a2558] shrink-0" />
              <span>Deep (&lt;6°C)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. BOTTOM DEPTH SCRUBBER CONTROLS ─── */}
      <div className="relative z-10 w-full px-3 sm:px-5 py-2.5 sm:py-3 pointer-events-auto">
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-xl flex flex-col gap-2.5 text-slate-900">
          {/* Slider Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-slate-700 stroke-[2.2]" />
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-900">
                Depth Scrubber Plane
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Play / Auto Animation Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3 stroke-[2.2]" /> : <Play className="w-3 h-3 stroke-[2.2]" />}
                <span>{isPlaying ? 'Pause' : 'Auto Sweep'}</span>
              </button>

              {/* Exact Depth Counter */}
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[11px] font-bold shadow-xs">
                {Math.round(currentDepth)} m
              </div>
            </div>
          </div>

          {/* Depth Range Slider Input */}
          <div className="relative flex flex-col gap-1">
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={currentDepth}
              onChange={(e) => onDepthChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
            />

            {/* Slider Ticks */}
            <div className="flex justify-between px-0.5 text-[8.5px] font-mono font-medium text-slate-500">
              <span>0m</span>
              <span>200m</span>
              <span>400m</span>
              <span>600m</span>
              <span>800m</span>
              <span>1000m</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 overflow-x-auto pb-0.5">
            <span className="text-[9.5px] font-mono font-semibold text-slate-500 shrink-0">Quick Jump:</span>
            {depthPresets.map((preset) => (
              <button
                key={preset.depth}
                onClick={() => onDepthChange(preset.depth)}
                className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono transition-all shrink-0 ${
                  Math.abs(currentDepth - preset.depth) < 15
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
                }`}
              >
                {preset.label} ({preset.tag})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
