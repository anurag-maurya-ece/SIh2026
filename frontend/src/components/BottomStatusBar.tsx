import React from 'react';
import { Clock, Radio } from 'lucide-react';

interface BottomStatusBarProps {
  coordinatesStr?: string;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  coordinatesStr = '24.42° N, 44.05° W',
}) => {
  return (
    <footer className="w-full h-9 bg-[#060913]/95 border-t border-white/5 px-6 flex items-center justify-between pointer-events-auto select-none z-30 text-[11px] text-slate-400 font-sans">
      {/* 1. Left: Live Data & Timestamp */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-300 font-medium">Live Data</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-400">Last updated 2 min ago</span>
      </div>

      {/* 2. Center: Monospace Coordinates */}
      <div className="font-mono text-slate-200 font-medium">
        {coordinatesStr}
      </div>

      {/* 3. Right: MoES Connection & Partner Logos */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Connected to MoES</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2 text-[10px] tracking-wider text-slate-400 font-semibold uppercase font-mono">
          <span>ISRO</span>
          <span>|</span>
          <span>NASA</span>
          <span>|</span>
          <span>Copernicus</span>
        </div>
      </div>
    </footer>
  );
};
