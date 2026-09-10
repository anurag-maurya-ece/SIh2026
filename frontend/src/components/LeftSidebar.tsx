import React from 'react';
import {
  MapPin,
  ChevronDown,
  Thermometer,
  Waves,
  Crosshair,
  Activity,
  Satellite,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { ModelStats } from '../utils/geo';

interface LeftSidebarProps {
  region?: string;
  subRegion?: string;
  surfaceTemp?: number;
  depthRange?: [number, number];
  coordinatesStr?: string;
  stats: ModelStats | null;
  onOpenDetails: () => void;
  onOpenOceanBlock?: () => void;
  onOpenSatellites?: () => void;
  onOpenTelemetry?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  region = 'Indian Ocean',
  subRegion = 'MoES PS 26066',
  surfaceTemp = 21.9,
  depthRange = [0, 1000],
  coordinatesStr = '24.42° N, 44.05° E',
  stats,
  onOpenDetails,
  onOpenOceanBlock,
  onOpenSatellites,
  onOpenTelemetry,
}) => {
  return (
    <aside className="w-64 md:w-68 flex flex-col gap-2.5 pointer-events-auto select-none z-20">
      {/* 1. Main Observation Card */}
      <div className="institutional-card p-3 rounded-2xl flex flex-col gap-2.5">
        {/* Top Header: Region Selector */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 cursor-pointer group">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                  {region}
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[9.5px] text-slate-500 font-medium block leading-none mt-0.5">
                {subRegion}
              </span>
            </div>
          </div>
          <div className="p-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
            <ChevronDown className="w-3 h-3 stroke-[2.2]" />
          </div>
        </div>

        {/* Hero Sea Surface Temperature Card (Professional Deep Ocean Theme) */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-xl p-3 border border-slate-800/80 shadow-sm flex flex-col gap-2 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1.5 text-sky-300">
                <Thermometer className="w-3 h-3 stroke-[2.2]" />
                <span>Sea Surface Temp</span>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-mono font-bold text-white tracking-tight leading-none">
                  {surfaceTemp.toFixed(1)}
                </span>
                <span className="text-sm font-mono font-semibold text-sky-400">°C</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                0.25° Grid
              </span>
              <div className="text-[8.5px] font-medium text-slate-300 mt-1 font-mono">
                Team REGALIA
              </div>
            </div>
          </div>

          {/* 5 Input Feature Badges (SST, SSS, SLA, Wind, Chl) */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[8.5px] font-mono text-slate-400 font-semibold uppercase">Fused Inputs:</span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">SST</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">SSS</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">SLA</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">Wind</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Chl</span>
            </div>
          </div>
        </div>

        {/* Telemetry Data Grid */}
        <div className="flex flex-col gap-1.5">
          {/* Row 1: Depth Range */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Waves className="w-3 h-3 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-medium text-slate-500 leading-none">Depth Range</div>
              <div className="text-[10.5px] font-bold font-mono text-slate-900 mt-0.5 leading-none">
                {depthRange[0]}m – {depthRange[1]}m
              </div>
            </div>
            <span className="text-[9px] font-mono font-semibold text-sky-700 px-1.5 py-0.5 rounded-md bg-sky-50 border border-sky-200">
              0-1000m
            </span>
          </div>

          {/* Row 2: Target Coordinates */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Crosshair className="w-3 h-3 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-medium text-slate-500 leading-none">Coordinates</div>
              <div className="text-[10.5px] font-bold font-mono text-slate-900 mt-0.5 truncate leading-none">
                {coordinatesStr}
              </div>
            </div>
          </div>

          {/* Row 3: Model Accuracy & Confidence */}
          <div
            onClick={onOpenTelemetry}
            className={`flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/70 ${onOpenTelemetry ? 'cursor-pointer hover:bg-emerald-50 transition-colors' : ''}`}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Activity className="w-3 h-3 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between leading-none">
                <span className="text-[9px] font-medium text-slate-700">Model Accuracy</span>
                <span className="text-[10px] font-bold text-emerald-800">
                  R² {stats ? stats.r2_score : '0.942'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                </div>
                <span className="text-[9px] font-mono font-semibold text-emerald-700 shrink-0 leading-none">
                  RMSE {stats ? stats.rmse.toFixed(2) : '0.31'}°C
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 mt-1">
          {onOpenOceanBlock && (
            <button
              onClick={onOpenOceanBlock}
              className="w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">🧊</span>
                <span>3D Ocean Block Slice</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-500 text-white font-semibold">
                0–1000m →
              </span>
            </button>
          )}

          <button
            onClick={onOpenDetails}
            className="w-full py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 shadow-xs transition-all active:scale-[0.99]"
          >
            <span>View Subsurface Profile</span>
            <ArrowRight className="w-3 h-3 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* 2. Active Satellites Card */}
      <div
        onClick={onOpenSatellites}
        className={`institutional-card p-2.5 rounded-xl flex items-center justify-between transition-all group ${onOpenSatellites ? 'cursor-pointer hover:border-sky-300' : ''}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <Satellite className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-900 block leading-tight">
              Active Satellites
            </span>
            <span className="text-[9px] font-medium text-slate-500 block leading-tight mt-0.5">
              Sentinel-6, Jason-3, INSAT
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            6 Online
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-800 stroke-[2.2] transition-colors" />
        </div>
      </div>
    </aside>
  );
};
