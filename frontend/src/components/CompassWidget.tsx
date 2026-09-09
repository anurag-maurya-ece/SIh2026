import React from 'react';
import { Navigation } from 'lucide-react';

export const CompassWidget: React.FC = () => {
  return (
    <div className="absolute bottom-12 right-6 pointer-events-none select-none z-20 flex flex-col items-center">
      {/* Modern Precision Compass */}
      <div className="relative w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 flex items-center justify-center shadow-md">
        {/* Cardinal Markers */}
        <span className="absolute top-1 text-[8.5px] font-mono font-bold text-rose-600">N</span>
        <span className="absolute bottom-1 text-[7.5px] font-mono font-medium text-slate-400">S</span>
        <span className="absolute left-1.5 text-[7.5px] font-mono font-medium text-slate-400">W</span>
        <span className="absolute right-1.5 text-[7.5px] font-mono font-medium text-slate-400">E</span>

        {/* Center Needle */}
        <Navigation className="w-4.5 h-4.5 text-slate-800 fill-slate-800 -rotate-45" />
      </div>
    </div>
  );
};
