import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  Thermometer,
  Sparkles,
} from 'lucide-react';

interface RightSidebarProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  autoUpdate: boolean;
  onToggleAutoUpdate: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  depth,
  onDepthChange,
  activeLayer = 'sst',
  onLayerChange,
  autoUpdate = true,
  onToggleAutoUpdate,
}) => {
  const depthTicks = [
    { d: 0, label: '0m' },
    { d: 50, label: '50m' },
    { d: 150, label: '150m' },
    { d: 300, label: '300m' },
    { d: 500, label: '500m' },
    { d: 1000, label: '1000m' },
  ];

  const getDepthLabel = (d: number) => {
    if (d === 0) return 'Surface';
    if (d <= 100) return 'Mixed Layer';
    if (d <= 450) return 'Thermocline';
    return 'Deep Ocean';
  };

  return (
    <aside className="w-72 md:w-80 flex flex-col gap-3 pointer-events-auto select-none z-20">
      {/* CARD 1: Live View & 2x2 Data Layers */}
      <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-xs font-bold text-white">Live View</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-sans">Auto-Update</span>
            {/* Toggle Switch */}
            <button
              onClick={onToggleAutoUpdate}
              className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                autoUpdate ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  autoUpdate ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 2x2 Data Layer Tiles */}
        <div className="grid grid-cols-4 gap-2">
          {/* Layer 1: SST */}
          <button
            onClick={() => onLayerChange('sst')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all ${
              activeLayer === 'sst'
                ? 'bg-[#0a1e38] border border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#081224] border border-white/5 hover:border-white/20'
            }`}
          >
            {/* Thumbnail */}
            <div className="w-full h-10 rounded-lg overflow-hidden relative bg-gradient-to-tr from-blue-700 via-cyan-500 to-amber-500 border border-white/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white drop-shadow">SST</span>
            </div>
            <span className="text-[10px] font-medium text-slate-300">SST</span>
          </button>

          {/* Layer 2: Chlorophyll */}
          <button
            onClick={() => onLayerChange('chlorophyll')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all ${
              activeLayer === 'chlorophyll'
                ? 'bg-[#0a1e38] border border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#081224] border border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-full h-10 rounded-lg overflow-hidden relative bg-gradient-to-tr from-emerald-900 via-emerald-600 to-teal-400 border border-white/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white drop-shadow">Chl-a</span>
            </div>
            <span className="text-[10px] font-medium text-slate-300">Chlorophyll</span>
          </button>

          {/* Layer 3: Currents */}
          <button
            onClick={() => onLayerChange('currents')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all ${
              activeLayer === 'currents'
                ? 'bg-[#0a1e38] border border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#081224] border border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-full h-10 rounded-lg overflow-hidden relative bg-gradient-to-tr from-indigo-950 via-blue-800 to-cyan-600 border border-white/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white drop-shadow">Flow</span>
            </div>
            <span className="text-[10px] font-medium text-slate-300">Currents</span>
          </button>

          {/* Layer 4: Bathymetry */}
          <button
            onClick={() => onLayerChange('bathymetry')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all ${
              activeLayer === 'bathymetry'
                ? 'bg-[#0a1e38] border border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#081224] border border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-full h-10 rounded-lg overflow-hidden relative bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-600 border border-white/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white drop-shadow">Bathy</span>
            </div>
            <span className="text-[10px] font-medium text-slate-300">Bathymetry</span>
          </button>
        </div>
      </div>

      {/* CARD 2: Depth Explorer */}
      <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Depth Explorer</span>
          </div>

          {/* Dropdown pill (Surface ⌄) */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a172c] border border-white/10 text-[10px] text-slate-300 font-medium">
            <span>{getDepthLabel(depth)}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Single Horizontal Depth Slider Track */}
        <div className="relative py-1">
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={depth}
            onChange={(e) => onDepthChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <div
            className="absolute top-2 left-0 h-1 rounded-l-lg bg-gradient-to-r from-cyan-400 to-blue-500 pointer-events-none"
            style={{ width: `${(depth / 1000) * 100}%` }}
          />
        </div>

        {/* Tick Labels Underneath: 0m, 50m, 150m, 300m, 500m, 1000m */}
        <div className="flex justify-between text-[9px] font-mono text-slate-400">
          {depthTicks.map((t) => (
            <button
              key={t.d}
              onClick={() => onDepthChange(t.d)}
              className={`hover:text-cyan-300 transition-colors ${
                depth === t.d ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARD 3: Thermal Scale (SST) */}
      <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Thermal Scale (SST)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">°C</span>
        </div>

        {/* Continuous Horizontal Gradient Bar */}
        <div className="h-2 w-full rounded-full shadow-inner border border-white/10 overflow-hidden bg-gradient-to-r from-[#0a2558] via-[#00a8cc] via-[#2ec4b6] via-[#ffb703] via-[#fb8500] to-[#d62828]" />

        {/* Tick Labels: -2, 8, 18, 26, >32 */}
        <div className="flex justify-between text-[8.5px] font-mono text-slate-400">
          <span>-2</span>
          <span>8</span>
          <span>18</span>
          <span>26</span>
          <span>&gt;32</span>
        </div>
      </div>
    </aside>
  );
};
