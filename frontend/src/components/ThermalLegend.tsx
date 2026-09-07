import React from 'react';
import { Radio } from 'lucide-react';

export const ThermalLegend: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-3 w-64 md:w-72 shadow-xl border border-cyan-500/20 backdrop-blur-md pointer-events-auto transition-all duration-300 ease-out">
      <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold mb-1.5">
        <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
          <Radio className="w-3 h-3" /> Thermal Scale
        </span>
        <span className="text-[9px] text-slate-400 font-mono">-2°C → 32°C</span>
      </div>

      {/* Multi-step color bar */}
      <div className="h-2 w-full rounded-full shadow-inner border border-white/10 overflow-hidden bg-gradient-to-r from-[#1a0033] via-[#0a2558] via-[#00a8cc] via-[#2ec4b6] via-[#ffb703] via-[#fb8500] to-[#d62828]" />

      <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1">
        <span>&lt;0°C</span>
        <span>8°C</span>
        <span>18°C</span>
        <span>26°C</span>
        <span>&gt;30°C</span>
      </div>
    </div>
  );
};
