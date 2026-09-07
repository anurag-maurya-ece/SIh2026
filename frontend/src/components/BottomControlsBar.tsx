import React from 'react';
import { Crosshair, Globe, Layers, BarChart3, Play, Pause } from 'lucide-react';

interface BottomControlsBarProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeDockIcon: string;
  onSelectDockIcon: (icon: string) => void;
}

export const BottomControlsBar: React.FC<BottomControlsBarProps> = ({
  depth,
  onDepthChange,
  isPlaying,
  onTogglePlay,
  activeDockIcon,
  onSelectDockIcon,
}) => {
  return (
    <footer className="w-full flex items-end justify-between px-6 pb-4 pointer-events-none select-none z-20">
      {/* 1. Bottom Left: Ocean Depth (m) Slider Box */}
      <div className="glass-hud p-3.5 rounded-2xl w-64 shadow-xl border border-white/10 backdrop-blur-md pointer-events-auto">
        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
          <span>Ocean Depth (m)</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-cyan-300 font-bold">{depth}m</span>
            <button
              onClick={onTogglePlay}
              className="p-1 rounded-md text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title={isPlaying ? 'Pause auto-sweep' : 'Auto sweep depths'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
          </div>
        </div>

        {/* Depth Slider */}
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

        {/* Ticks 0, 250, 500, 750, 1000+ */}
        <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
          <span>0</span>
          <span>250</span>
          <span>500</span>
          <span>750</span>
          <span>1000+</span>
        </div>
      </div>

      {/* 2. Bottom Center: Floating Pill Dock + Slogan */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        <div className="glass-hud px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-6 backdrop-blur-xl">
          <button
            onClick={() => onSelectDockIcon('crosshair')}
            className="relative p-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
            {activeDockIcon === 'crosshair' && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
            )}
          </button>

          <button
            onClick={() => onSelectDockIcon('globe')}
            className="relative p-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {activeDockIcon === 'globe' && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
            )}
          </button>

          <button
            onClick={() => onSelectDockIcon('layers')}
            className="relative p-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Layers className="w-4 h-4" />
            {activeDockIcon === 'layers' && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
            )}
          </button>

          <button
            onClick={() => onSelectDockIcon('analytics')}
            className="relative p-1.5 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            {activeDockIcon === 'analytics' && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
            )}
          </button>
        </div>

        {/* Micro-Copy Slogan */}
        <div className="text-[9px] tracking-widest text-slate-400 uppercase font-semibold">
          EXPLORE &nbsp;•&nbsp; UNDERSTAND &nbsp;•&nbsp; PROTECT
        </div>
      </div>

      {/* 3. Bottom Right: Sea Surface Temperature (°C) Color Bar */}
      <div className="glass-hud p-3.5 rounded-2xl w-64 shadow-xl border border-white/10 backdrop-blur-md pointer-events-auto">
        <div className="text-[10px] text-slate-300 font-semibold mb-1.5">
          Sea Surface Temperature (°C)
        </div>

        {/* Rainbow Color Bar */}
        <div className="h-2 w-full rounded-full shadow-inner border border-white/10 overflow-hidden bg-gradient-to-r from-[#0a2558] via-[#00a8cc] via-[#2ec4b6] via-[#ffb703] via-[#fb8500] to-[#d62828]" />

        {/* Gradient Legend Scale values: -2, 8, 18, 26, >32 */}
        <div className="flex justify-between text-[8.5px] font-mono text-slate-400 mt-1">
          <span>-2</span>
          <span>8</span>
          <span>18</span>
          <span>26</span>
          <span>&gt;32</span>
        </div>
      </div>
    </footer>
  );
};
