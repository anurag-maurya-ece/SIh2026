import React from 'react';
import { Navigation } from 'lucide-react';

export const CompassWidget: React.FC = () => {
  return (
    <div className="absolute bottom-14 right-8 pointer-events-none select-none z-20 flex flex-col items-center">
      <div className="text-[10px] font-mono text-slate-300 font-bold mb-1">N</div>
      <div className="w-10 h-10 rounded-full bg-[#081224]/80 border border-white/10 flex items-center justify-center shadow-lg shadow-black/50 backdrop-blur-md">
        <Navigation className="w-5 h-5 text-cyan-400 fill-cyan-400/20 -rotate-45" />
      </div>
    </div>
  );
};
