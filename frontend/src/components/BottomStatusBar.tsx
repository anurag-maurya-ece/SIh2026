import React, { useState, useEffect } from 'react';
import { Clock, Radio, Cpu } from 'lucide-react';

interface BottomStatusBarProps {
  coordinatesStr?: string;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  coordinatesStr = '24.42° N, 44.05° E',
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full h-9 md:h-10 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 md:px-6 flex items-center justify-between pointer-events-auto select-none z-30 text-[10px] md:text-[11px] text-slate-700 font-sans shadow-xs">
      {/* 1. Left: Live Data & UTC Clock Pill */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold text-[9.5px] md:text-[10px] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 font-mono font-medium text-[10px] md:text-[11px]">
          <Clock className="w-3 h-3 text-sky-600" />
          <span>{timeStr || '00:00:00 UTC'}</span>
        </div>
      </div>

      {/* 2. Center: Clean Monospace Coordinates Pill */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-white font-mono text-[11px] shadow-xs font-semibold">
        <span className="text-[9.5px] uppercase text-sky-400">Target:</span>
        <span>{coordinatesStr}</span>
      </div>

      {/* 3. Right: MoES / INCOIS Connection & Partner Badges */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-800 border border-slate-200 font-medium text-[10px] md:text-[11px] shadow-xs">
          <Radio className="w-3 h-3 text-sky-600 stroke-[2.2]" />
          <span>MoES • INCOIS Node</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100/80 text-slate-600 border border-slate-200 text-[10px] font-medium font-mono">
          <span>ISRO</span>
          <span className="text-slate-400">•</span>
          <span>NASA</span>
          <span className="text-slate-400">•</span>
          <span>Copernicus</span>
        </div>
      </div>
    </footer>
  );
};
