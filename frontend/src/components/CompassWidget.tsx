import React from 'react';
import { Navigation } from 'lucide-react';

export const CompassWidget: React.FC = () => {
  return (
    <div className="absolute bottom-12 right-6 pointer-events-none select-none z-20 flex flex-col items-center">
      {/* Space HUD Precision Compass */}
      <div className="relative w-11 h-11 rounded-full bg-slate-950/85 backdrop-blur-md border border-sky-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        {/* Cardinal Markers */}
        <span className="absolute top-1 text-[8.5px] font-mono font-bold text-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]">N</span>
        <span className="absolute bottom-1 text-[7.5px] font-mono font-medium text-slate-500">S</span>
        <span className="absolute left-1.5 text-[7.5px] font-mono font-medium text-slate-500">W</span>
        <span className="absolute right-1.5 text-[7.5px] font-mono font-medium text-slate-500">E</span>

        {/* Center Needle */}
        <Navigation className="w-4.5 h-4.5 text-cyan-300 fill-cyan-400 -rotate-45 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
      </div>
    </div>
  );
};
