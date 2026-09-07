import React from 'react';
import { Compass, Sparkles, Layers, Box } from 'lucide-react';
import { DepthSlider } from './DepthSlider';

interface InfoPanelProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onFocusIndianOcean: () => void;
  viewMode: 'globe' | 'cutaway';
  onToggleViewMode: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  depth,
  onDepthChange,
  isPlaying,
  onTogglePlay,
  onFocusIndianOcean,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <aside className="w-80 md:w-88 flex flex-col gap-3 pointer-events-auto transition-all duration-300 ease-out">
      {/* Brand & Depth Control Unified Glass Card */}
      <div className="glass-panel rounded-2xl p-4 shadow-xl border border-cyan-500/20 backdrop-blur-md">
        {/* Header Title + AI Live Pill */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-sm flex items-center justify-center">
              <span className="text-space-950 font-black text-xs font-mono">OE</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1 leading-none">
                Ocean<span className="text-cyan-400">Embed</span>
              </h1>
              <span className="text-[9px] text-slate-400 font-mono">SIH 2026 • PS 26066</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
            <span>AI Live</span>
          </div>
        </div>

        {/* Embedded Depth Slider */}
        <div className="pt-3">
          <DepthSlider
            depth={depth}
            onDepthChange={onDepthChange}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
          />
        </div>

        {/* Action Buttons: Focus Indian Ocean + 3D Cutaway Slice Mode */}
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
          <button
            onClick={onFocusIndianOcean}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-sm transition-all duration-300 ease-out"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus IOR</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all duration-300 ease-out border ${
              viewMode === 'cutaway'
                ? 'bg-cyan-500 text-space-950 font-bold border-cyan-300 shadow-cyan-500/30'
                : 'bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{viewMode === 'cutaway' ? 'Sliced 3D Active' : '3D Cutaway Slice'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
