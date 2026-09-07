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
      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Left Title Badge */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#070e1c] rounded-[11px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                3D Ocean Block Slice
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                0 – 1000m Subsurface
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
              <span>{region}</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-300 font-bold">
                {Math.abs(lat).toFixed(2)}°{lat >= 0 ? 'N' : 'S'}, {Math.abs(lon).toFixed(2)}°{lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
          </div>
        </div>

        {/* Center View Angle Selector */}
        <div className="flex items-center gap-1.5 glass-hud p-1 rounded-xl border border-white/10 pointer-events-auto backdrop-blur-md">
          <button
            onClick={() => setPresetView('iso')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraView === 'iso'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setPresetView('front')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraView === 'front'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Front Slice
          </button>
          <button
            onClick={() => setPresetView('side')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraView === 'side'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side Profile
          </button>
          <button
            onClick={() => setPresetView('top')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              cameraView === 'top'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Surface View
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button
            onClick={() => setPresetView('iso')}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Reset Orbit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Close Button if used in overlay/modal mode */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-hud border border-white/10 text-slate-300 hover:text-white hover:border-red-400/40 hover:bg-red-500/10 transition-all pointer-events-auto shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ─── 3. CENTER HUD (TELEMETRY CARD & THERMAL SCALE) ─── */}
      <div className="relative z-10 w-full flex justify-between px-6 pointer-events-none items-start">
        {/* Left Telemetry Card */}
        <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-3 w-72 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
              Thermal Profile Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Active Selected Depth Temp */}
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-[9.5px] text-cyan-300 uppercase font-semibold">
                  Active Slice ({Math.round(currentDepth)}m)
                </div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {currentData.temp.toFixed(2)}°C
                </div>
              </div>
              <div
                className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: getTemperatureColor(currentData.temp).hex }}
              />
            </div>

            {/* Surface SST */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Sea Surface (0m):</span>
              <span className="font-mono font-bold text-amber-300">{surfaceData.temp.toFixed(1)}°C</span>
            </div>

            {/* 1000m Abyssal */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Abyssal Floor (1000m):</span>
              <span className="font-mono font-bold text-blue-400">{deepData.temp.toFixed(1)}°C</span>
            </div>

            {/* Thermal Gradient Drop */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">ΔT Surface Drop:</span>
              <span className="font-mono font-bold text-emerald-400">-{deltaT}°C</span>
            </div>

            {/* Confidence */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">AI Confidence:</span>
              <span className="font-mono font-bold text-cyan-400">
                {(currentData.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Thermal Layer Description Badge */}
          <div className="p-2 rounded-xl bg-[#09152b] border border-white/5 text-[10px] text-slate-300 leading-relaxed">
            {currentDepth < 80 ? (
              <span className="text-amber-200">
                ☀️ <strong>Epipelagic Mixed Layer:</strong> Sunlit surface zone with active atmospheric heat exchange.
              </span>
            ) : currentDepth < 350 ? (
              <span className="text-cyan-200">
                ⚡ <strong>Main Thermocline:</strong> Rapid thermal gradient zone with highest temperature decline rate.
              </span>
            ) : (
              <span className="text-blue-300">
                ❄️ <strong>Mesopelagic / Bathypelagic:</strong> Cold, uniform deep ocean water layer stable near 4-6°C.
              </span>
            )}
          </div>
        </div>

        {/* Right Color Scale & Legend Card */}
        <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-3 w-56 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider font-mono pb-2 border-b border-white/5">
            Thermal Scale (SST/Subsurface)
          </div>

          {/* Color Gradient Bar */}
          <div className="flex flex-col gap-1.5">
            <div
              className="h-3 w-full rounded-md shadow-inner border border-white/10"
              style={{
                background:
                  'linear-gradient(to right, #1a0033 0%, #0a2558 15%, #00a8cc 35%, #2ec4b6 55%, #ffb703 75%, #fb8500 88%, #d62828 100%)',
              }}
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>-2°C</span>
              <span>4°C</span>
              <span>10°C</span>
              <span>18°C</span>
              <span>26°C</span>
              <span>&gt;32°C</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5 text-[9.5px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#d62828]" />
              <span>Warm Mixed Water (&gt;25°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#00a8cc]" />
              <span>Thermocline Transition (10-20°C)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#0a2558]" />
              <span>Deep Cold Core (&lt;6°C)</span>
            </div>
          </div>

          {/* Orbit Control Tip */}
          <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-1">
            <Info className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Drag block to rotate, scroll to zoom</span>
          </div>
        </div>
      </div>

      {/* ─── 4. BOTTOM DEPTH SCRUBBER CONTROLS ─── */}
      <div className="relative z-10 w-full px-6 py-4 pointer-events-auto">
        <div className="max-w-4xl mx-auto glass-hud p-4 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-2xl flex flex-col gap-3">
          {/* Slider Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Depth Scrubber Plane
              </span>
              <span className="text-[10px] text-slate-400">
                (Sweeps highlighted marker slice through the 3D block)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Play / Auto Animation Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Pause Sweep' : 'Auto Sweep'}</span>
              </button>

              {/* Exact Depth Counter */}
              <div className="px-3 py-1 rounded-xl bg-[#081326] border border-cyan-400/30 font-mono text-xs font-bold text-cyan-300">
                {Math.round(currentDepth)} m
              </div>
            </div>
          </div>

          {/* Depth Range Slider Input */}
          <div className="relative flex flex-col gap-1.5">
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={currentDepth}
              onChange={(e) => onDepthChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />

            {/* Slider Ticks */}
            <div className="flex justify-between px-0.5 text-[9.5px] font-mono text-slate-400">
              <span>0m (Surface)</span>
              <span>200m</span>
              <span>400m</span>
              <span>600m</span>
              <span>800m</span>
              <span>1000m (Abyssal)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto">
            <span className="text-[10px] text-slate-400 font-mono shrink-0">Quick Layers:</span>
            {depthPresets.map((preset) => (
              <button
                key={preset.depth}
                onClick={() => onDepthChange(preset.depth)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  Math.abs(currentDepth - preset.depth) < 15
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-bold shadow-sm shadow-cyan-500/20'
                    : 'bg-[#09152b] text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/20'
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
