import React from 'react';
import {
  MapPin,
  ChevronDown,
  Thermometer,
  Waves,
  Crosshair,
  Layers,
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
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  region = 'Indian Ocean',
  subRegion = 'MoES PS 26066',
  surfaceTemp = 21.9,
  depthRange = [0, 1000],
  coordinatesStr = '24.42° N, 44.05° W',
  stats,
  onOpenDetails,
  onOpenOceanBlock,
}) => {
  return (
    <aside className="w-72 md:w-80 flex flex-col gap-3 pointer-events-auto select-none z-20">
      {/* 1. Main Translucent Dark Navy Card */}
      <div className="glass-hud p-4 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-2xl flex flex-col gap-3.5">
        {/* Top Header: Region Selector */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 cursor-pointer hover:border-cyan-400/30 transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono leading-tight">
                {region}
              </h2>
              <span className="text-[10px] text-slate-400 font-sans block">
                {subRegion}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* 5 Vertical Stat Rows */}
        <div className="flex flex-col gap-3">
          {/* Stat 1: Sea Surface Temp */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a172c] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 leading-none">Sea Surface Temp.</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {surfaceTemp.toFixed(1)}°C
              </div>
              <div className="text-[9px] text-cyan-400 font-mono mt-0.5 flex items-center gap-0.5">
                <span>Satellite SST (MODIS/AVHRR)</span>
              </div>
            </div>
          </div>

          {/* Stat 2: Depth Range */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a172c] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Waves className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 leading-none">Depth Range</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {depthRange[0]} – {depthRange[1]} m
              </div>
              <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                {stats?.ground_truth ? 'INCOIS & Argo CTD' : 'Reconstructed 0–1000m'}
              </div>
            </div>
          </div>

          {/* Stat 3: Coordinates */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a172c] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 leading-none">Coordinates</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5 truncate">
                {coordinatesStr}
              </div>
              <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                {region}
              </div>
            </div>
          </div>

          {/* Stat 4: Data Source */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a172c] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 leading-none">Data Source</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {stats?.model_architecture ? 'AI Embedding Model' : 'Multi-satellite'}
              </div>
              <div className="text-[9px] text-slate-400 font-sans mt-0.5">
                {stats?.satellite_features?.length || 4} Satellite Sensors
              </div>
            </div>
          </div>

          {/* Stat 5: Model Accuracy */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0a172c] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 leading-none">Model Accuracy</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                RMSE {stats ? stats.rmse.toFixed(2) : '0.31'}°C
              </div>
              <div className="text-[9px] text-cyan-400 font-mono mt-0.5">
                R² {stats ? stats.r2_score : '0.942'} (MAE {stats ? stats.mae.toFixed(2) : '0.24'}°C)
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          {onOpenOceanBlock && (
            <button
              onClick={onOpenOceanBlock}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#0a1e3f] to-cyan-950/80 hover:from-cyan-900/90 hover:to-cyan-900/90 border border-cyan-400/40 text-cyan-200 font-semibold text-xs flex items-center justify-between transition-all duration-200 shadow-md shadow-cyan-950/50 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🧊</span>
                <span>3D Ocean Block Slice</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-cyan-400/20 text-cyan-300 uppercase font-bold border border-cyan-400/30">
                0-1000m
              </span>
            </button>
          )}

          <button
            onClick={onOpenDetails}
            className="w-full py-2 px-3 rounded-xl bg-[#0c1b35] hover:bg-[#102447] border border-cyan-500/20 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-inner active:scale-98"
          >
            <span>View Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Separate Smaller Active Satellites Card */}
      <div className="glass-hud p-3 rounded-2xl border border-cyan-500/15 backdrop-blur-md shadow-xl flex items-center justify-between cursor-pointer hover:border-cyan-400/30 transition-all">
        <div className="flex items-center gap-2.5">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white">Active Satellites</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            6/6
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
