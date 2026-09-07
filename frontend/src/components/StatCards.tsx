import React from 'react';
import { Target, Activity, Cpu, Sparkles } from 'lucide-react';
import { ModelStats } from '../utils/geo';

interface StatCardsProps {
  stats: ModelStats | null;
  loading?: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="glass-panel rounded-2xl p-3.5 w-72 h-28 animate-pulse pointer-events-none" />
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-3.5 w-72 md:w-80 shadow-xl border border-cyan-500/20 backdrop-blur-md pointer-events-auto transition-all duration-300 ease-out">
      {/* Header with Focus Region & Pill */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <Target className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-white truncate font-mono">
            {stats.region}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shrink-0">
          MoES PS 26066
        </span>
      </div>

      {/* 2 Compact Metric Rows */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        {/* Metric 1: Accuracy */}
        <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Accuracy
          </div>
          <div className="text-xs font-bold text-white font-mono mt-0.5">
            RMSE {stats.rmse.toFixed(2)}°C
            <span className="text-[10px] text-cyan-400 font-normal ml-1">R² {stats.r2_score}</span>
          </div>
        </div>

        {/* Metric 2: Depth Range */}
        <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Depth Band
          </div>
          <div className="text-xs font-bold text-white font-mono mt-0.5 truncate">
            {stats.depth_range_m[0]}–{stats.depth_range_m[1]}m
            <span className="text-[9px] text-slate-400 font-normal ml-1">(4 Signals)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
