import React from 'react';
import {
  Layers,
  ChevronDown,
  Thermometer,
  Sliders,
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

  const getDepthInfo = (d: number) => {
    if (d === 0) return { label: 'Surface (Epipelagic)', color: 'text-slate-950 bg-sky-100 border-sky-400' };
    if (d <= 100) return { label: 'Mixed Layer (0-100m)', color: 'text-sky-900 bg-sky-50 border-sky-300' };
    if (d <= 450) return { label: 'Thermocline (100-450m)', color: 'text-emerald-900 bg-emerald-50 border-emerald-300' };
    return { label: 'Deep Ocean (450-1000m)', color: 'text-white bg-slate-950 border-slate-800' };
  };

  const depthInfo = getDepthInfo(depth);

  return (
    <aside className="w-64 md:w-68 flex flex-col gap-2.5 pointer-events-auto select-none z-20">
      {/* CARD 1: Live View & Geospatial Data Layers */}
      <div className="institutional-card p-3 rounded-2xl flex flex-col gap-2.5">
        {/* Header with neat separation */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">Observation Layers</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-medium">Auto-Orbit</span>
            {/* Toggle Switch */}
            <button
              onClick={onToggleAutoUpdate}
              className={`w-7.5 h-4 rounded-full p-0.5 transition-colors duration-200 relative ${
                autoUpdate ? 'bg-sky-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  autoUpdate ? 'translate-x-3.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4 Data Layer Tiles */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Layer 1: SST */}
          <button
            onClick={() => onLayerChange('sst')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-150 border ${
              activeLayer === 'sst'
                ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-full h-8 rounded-lg overflow-hidden relative bg-gradient-to-tr from-blue-600 via-sky-400 to-amber-400 flex items-center justify-center shadow-xs">
              <span className="text-[8.5px] font-mono font-bold text-white drop-shadow">SST</span>
            </div>
            <span className={`text-[10px] font-semibold ${activeLayer === 'sst' ? 'text-sky-300' : 'text-slate-800'}`}>
              Thermal
            </span>
          </button>

          {/* Layer 2: Chlorophyll */}
          <button
            onClick={() => onLayerChange('chlorophyll')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-150 border ${
              activeLayer === 'chlorophyll'
                ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-full h-8 rounded-lg overflow-hidden relative bg-gradient-to-tr from-emerald-800 via-emerald-500 to-teal-300 flex items-center justify-center shadow-xs">
              <span className="text-[8.5px] font-mono font-bold text-white drop-shadow">Chl-a</span>
            </div>
            <span className={`text-[10px] font-semibold ${activeLayer === 'chlorophyll' ? 'text-emerald-300' : 'text-slate-800'}`}>
              Biology
            </span>
          </button>

          {/* Layer 3: Currents */}
          <button
            onClick={() => onLayerChange('currents')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-150 border ${
              activeLayer === 'currents'
                ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-full h-8 rounded-lg overflow-hidden relative bg-gradient-to-tr from-indigo-900 via-blue-700 to-sky-500 flex items-center justify-center shadow-xs">
              <span className="text-[8.5px] font-mono font-bold text-white drop-shadow">Flow</span>
            </div>
            <span className={`text-[10px] font-semibold ${activeLayer === 'currents' ? 'text-sky-300' : 'text-slate-800'}`}>
              Currents
            </span>
          </button>

          {/* Layer 4: Bathymetry */}
          <button
            onClick={() => onLayerChange('bathymetry')}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-150 border ${
              activeLayer === 'bathymetry'
                ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="w-full h-8 rounded-lg overflow-hidden relative bg-gradient-to-tr from-slate-800 via-slate-600 to-slate-400 flex items-center justify-center shadow-xs">
              <span className="text-[8.5px] font-mono font-bold text-white drop-shadow">Bathy</span>
            </div>
            <span className={`text-[10px] font-semibold ${activeLayer === 'bathymetry' ? 'text-slate-300' : 'text-slate-800'}`}>
              Seabed
            </span>
          </button>
        </div>
      </div>

      {/* CARD 2: Depth Explorer (0m - 1000m) */}
      <div className="institutional-card p-3 rounded-2xl flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Sliders className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-none">Depth Explorer</span>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block border ${depthInfo.color}`}>
                {depthInfo.label}
              </span>
            </div>
          </div>

          {/* Depth Counter Pill */}
          <div className="flex items-baseline gap-0.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-xs">
            <span className="text-xs font-mono font-bold text-white">{depth}</span>
            <span className="text-[10px] font-mono text-sky-400 font-semibold">m</span>
          </div>
        </div>

        {/* Depth Slider Track */}
        <div className="relative py-1">
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={depth}
            onChange={(e) => onDepthChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
          />
        </div>

        {/* Quick-Jump Depth Chips */}
        <div className="grid grid-cols-6 gap-1">
          {depthTicks.map((t) => (
            <button
              key={t.d}
              onClick={() => onDepthChange(t.d)}
              className={`py-1 rounded-lg text-[9.5px] font-mono transition-all duration-150 border ${
                depth === t.d
                  ? 'bg-slate-900 text-white border-slate-800 font-semibold shadow-xs'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700 font-medium hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARD 3: Thermal Scale Legend (SST) */}
      <div className="institutional-card p-2.5 rounded-xl flex flex-col gap-1.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-slate-700 stroke-[2.2]" />
            <span className="text-[10.5px] font-bold text-slate-900 uppercase tracking-wider">Thermal Spectrum</span>
          </div>
          <span className="text-[9.5px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">°C</span>
        </div>

        {/* Continuous Horizontal Gradient Bar */}
        <div className="h-2 w-full rounded-md border border-slate-200/60 overflow-hidden bg-gradient-to-r from-[#0a2558] via-[#00a8cc] via-[#2ec4b6] via-[#38bdf8] via-[#fb8500] to-[#d62828]" />

        {/* Tick Labels: -2°C to >32°C */}
        <div className="flex justify-between text-[9px] font-mono font-medium text-slate-500">
          <span>-2°</span>
          <span>8°</span>
          <span>18°</span>
          <span>26°</span>
          <span>&gt;32°</span>
        </div>
      </div>
    </aside>
  );
};
