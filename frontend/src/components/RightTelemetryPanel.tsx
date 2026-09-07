import React, { useState } from 'react';
import {
  Thermometer,
  Waves,
  Crosshair,
  MoreHorizontal,
  MapPin,
  Activity,
  ArrowRight,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { ProfilePoint } from '../utils/geo';

interface RightTelemetryPanelProps {
  id?: string;
  sensorType?: string;
  basin?: string;
  lat: number;
  lon: number;
  surfaceTemp: number;
  currentDepth: number;
  profile: ProfilePoint[];
  onOpenFullProfile: () => void;
}

export const RightTelemetryPanel: React.FC<RightTelemetryPanelProps> = ({
  id = 'ARGO-GL-4902120',
  sensorType = 'CTD-Standard',
  basin = 'Indian Ocean',
  lat = -24.5,
  lon = 45.0,
  surfaceTemp = 21.9,
  currentDepth = 0,
  profile,
  onOpenFullProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'data' | 'metadata'>('overview');

  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;

  return (
    <div className="glass-hud rounded-3xl p-5 w-84 md:w-96 shadow-2xl border border-white/10 backdrop-blur-xl pointer-events-auto select-none z-20 flex flex-col gap-4">
      {/* Card Header: Title & Live Pill */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white font-mono tracking-tight leading-tight">
            {id}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Activity className="w-3.5 h-3.5" />
              {sensorType}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {basin}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </div>
          <button className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-6 border-b border-white/10 text-xs font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'overview'
              ? 'text-cyan-400 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <span>Overview</span>
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('profiles');
            onOpenFullProfile();
          }}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'profiles'
              ? 'text-cyan-400 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <span>Profiles</span>
          {activeTab === 'profiles' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'data'
              ? 'text-cyan-400 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <span>Data</span>
          {activeTab === 'data' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('metadata')}
          className={`pb-2.5 transition-all relative ${
            activeTab === 'metadata'
              ? 'text-cyan-400 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <span>Metadata</span>
          {activeTab === 'metadata' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400" />
          )}
        </button>
      </div>

      {/* 2x2 Metric Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Box 1: Sea Surface Temp */}
        <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-white">
              {surfaceTemp.toFixed(1)}°C
            </div>
            <div className="text-[10px] text-slate-400">Sea Surface Temp.</div>
          </div>
        </div>

        {/* Box 2: Depth Range */}
        <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-white">0 - 1000 m</div>
            <div className="text-[10px] text-slate-400">Depth Range</div>
          </div>
        </div>

        {/* Box 3: Latitude */}
        <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-white">{latStr}</div>
            <div className="text-[10px] text-slate-400">Latitude</div>
          </div>
        </div>

        {/* Box 4: Longitude */}
        <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-white">{lonStr}</div>
            <div className="text-[10px] text-slate-400">Longitude</div>
          </div>
        </div>
      </div>

      {/* Primary Action Button: View Full Profile */}
      <button
        onClick={onOpenFullProfile}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0066cc] to-[#00a8ff] hover:from-[#0077ee] hover:to-[#00bfff] text-white font-semibold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all duration-300 ease-out active:scale-98"
      >
        <span>View Full Profile</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
