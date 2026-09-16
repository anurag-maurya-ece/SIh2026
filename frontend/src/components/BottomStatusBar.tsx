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
    <footer className="w-full h-9 md:h-10 bg-slate-950/85 backdrop-blur-2xl border-t border-sky-500/20 px-3 md:px-6 flex items-center justify-between pointer-events-auto select-none z-30 text-[10px] md:text-[11px] text-slate-300 font-sans shadow-lg">
      {/* 1. Left: Live Data & UTC Clock Pill */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-[9.5px] md:text-[10px] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>LIVE TELEMETRY</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-sky-200 border border-sky-500/20 font-mono font-medium text-[10px] md:text-[11px]">
          <Clock className="w-3 h-3 text-sky-400" />
          <span>{timeStr || '00:00:00 UTC'}</span>
        </div>
      </div>

      {/* 2. Center: Clean Monospace Coordinates Pill */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-0.5 rounded-md bg-slate-900/90 border border-sky-500/30 text-white font-mono text-[11px] shadow-[0_0_12px_rgba(56,189,248,0.15)] font-semibold">
        <span className="text-[9.5px] uppercase tracking-wider text-sky-400">Target Coordinates:</span>
        <span className="text-cyan-200">{coordinatesStr}</span>
      </div>

      {/* 3. Right: MoES / INCOIS Connection & Partner Badges */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/30 font-medium text-[10px] md:text-[11px] shadow-xs">
          <Radio className="w-3 h-3 text-cyan-400 stroke-[2.2] animate-pulse" />
          <span>MoES • INCOIS Gateway</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900/60 text-slate-400 border border-slate-800 text-[10px] font-medium font-mono">
          <span className="text-sky-300">ISRO</span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-300">NASA</span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-300">Copernicus</span>
        </div>
      </div>
    </footer>
  );
};
