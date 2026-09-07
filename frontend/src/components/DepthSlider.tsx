import React, { useEffect } from 'react';
import { Play, Pause, Layers, Sparkles } from 'lucide-react';
import { PREFETCH_DEPTHS } from '../services/api';

interface DepthSliderProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const DEPTH_PRESETS = [0, 50, 150, 300, 500, 1000];

export const DepthSlider: React.FC<DepthSliderProps> = ({
  depth,
  onDepthChange,
  isPlaying,
  onTogglePlay,
}) => {
  // Auto-sweep animation through depths
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentIndex = PREFETCH_DEPTHS.indexOf(depth);
      const nextIndex =
        currentIndex === -1 || currentIndex === PREFETCH_DEPTHS.length - 1
          ? 0
          : currentIndex + 1;
      onDepthChange(PREFETCH_DEPTHS[nextIndex]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, depth, onDepthChange]);

  const getZoneName = (d: number) => {
    if (d === 0) return 'Surface SST';
    if (d <= 100) return 'Mixed Layer';
    if (d <= 450) return 'Thermocline';
    return 'Deep Ocean';
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Depth Value & Auto-Sweep Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono tracking-tight">
            {depth}<span className="text-sm text-cyan-400 font-normal ml-0.5">m</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
            {getZoneName(depth)}
          </span>
        </div>

        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-300 ease-out shadow-sm ${
            isPlaying
              ? 'bg-cyan-400 text-space-950 shadow-cyan-400/20 hover:bg-cyan-300'
              : 'bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
          }`}
          title={isPlaying ? 'Pause auto-sweep' : 'Auto-sweep through depths'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auto-Sweep</span>
            </>
          )}
        </button>
      </div>

      {/* Main Slider Track */}
      <div className="relative py-1">
        <input
          type="range"
          min={0}
          max={1000}
          step={50}
          value={depth}
          onChange={(e) => onDepthChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div
          className="absolute top-2 left-0 h-1 rounded-l-lg bg-gradient-to-r from-cyan-400 to-blue-500 pointer-events-none"
          style={{ width: `${(depth / 1000) * 100}%` }}
        />
      </div>

      {/* Horizontal Depth Chip Row (Single unified control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {DEPTH_PRESETS.map((d) => {
          const isActive = depth === d;
          return (
            <button
              key={d}
              onClick={() => onDepthChange(d)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-medium transition-all duration-200 shrink-0 border ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {d}m
            </button>
          );
        })}
      </div>
    </div>
  );
};
