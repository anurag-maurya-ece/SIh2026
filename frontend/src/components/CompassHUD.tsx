import React from 'react';
import { Navigation } from 'lucide-react';

export const CompassHUD: React.FC = () => {
  return (
    <>
      {/* Top Right Seraphic Quote */}
      <div className="absolute top-20 right-10 text-right pointer-events-none select-none z-10 hidden lg:block">
        <p className="font-serif-italic text-sm text-slate-300/80 tracking-wide">
          &ldquo;A deeper ocean<br />for a safer tomorrow.&rdquo;
        </p>
      </div>

      {/* Bottom Right Floating Compass Coordinates */}
      <div className="absolute bottom-28 right-8 text-right pointer-events-none select-none z-10 hidden sm:flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-bold">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 -rotate-45" />
          <span>N</span>
        </div>
        <div className="text-[10px] font-mono text-slate-300">
          24.42° N, 44.05° W
        </div>
        <div className="text-[9px] text-slate-400">
          Global Ocean
        </div>
      </div>
    </>
  );
};
