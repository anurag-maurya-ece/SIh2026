import React from 'react';
import { Thermometer, Waves } from 'lucide-react';

interface TopLeftStatCardsProps {
  surfaceTemp?: number;
  depthRange?: [number, number];
}

export const TopLeftStatCards: React.FC<TopLeftStatCardsProps> = ({
  surfaceTemp = 21.9,
  depthRange = [0, 1000],
}) => {
  return (
    <div className="flex flex-col gap-3 pointer-events-auto select-none z-20">
      {/* Card 1: Sea Surface Temp */}
      <div className="glass-hud p-4 rounded-2xl w-48 shadow-xl border border-white/10 backdrop-blur-md flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Thermometer className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold font-mono text-white tracking-tight leading-none">
            {surfaceTemp.toFixed(1)}°C
          </div>
          <div className="text-[10px] text-slate-300 font-medium mt-1 truncate">
            Sea Surface Temp.
          </div>
          <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5 mt-0.5">
            <span>▾ 0.3°C</span>
            <span className="text-slate-400">(24h)</span>
          </div>
        </div>
      </div>

      {/* Card 2: Depth Range */}
      <div className="glass-hud p-4 rounded-2xl w-48 shadow-xl border border-white/10 backdrop-blur-md flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Waves className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold font-mono text-white tracking-tight leading-none">
            {depthRange[0]} - {depthRange[1]} m
          </div>
          <div className="text-[10px] text-slate-300 font-medium mt-1 truncate">
            Depth Range
          </div>
          <div className="text-[9px] text-cyan-300 font-mono mt-0.5">
            (4 signals)
          </div>
        </div>
      </div>
    </div>
  );
};
