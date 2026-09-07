import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import {
  X,
  MapPin,
  Waves,
  Satellite,
  Layers,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Wind,
  Droplets,
  Activity,
} from 'lucide-react';
import { ProfilePoint, getTemperatureColor } from '../utils/geo';

interface PointTooltipProps {
  lat: number;
  lon: number;
  region: string;
  surfaceTemp: number;
  deepTemp: number;
  confidence: number;
  profile: ProfilePoint[];
  currentDepth: number;
  tempDomain?: [number, number];
  onClose?: () => void;
}

export const PointTooltip: React.FC<PointTooltipProps> = ({
  lat,
  lon,
  region,
  surfaceTemp,
  deepTemp,
  confidence,
  profile,
  currentDepth,
  tempDomain = [0, 32],
  onClose,
}) => {
  const [expandedTab, setExpandedTab] = useState<'none' | 'satellite' | 'strata'>('none');

  // Format coordinate strings
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;

  // Find temperature at currently active slider depth
  const activeDepthPoint = profile.find((p) => p.depth === currentDepth) || profile[0];

  // Satellite signal estimates
  const ssha = (Math.sin((lat * Math.PI) / 45) * Math.cos((lon * Math.PI) / 45) * 8.5).toFixed(1);
  const sss = (35.2 + Math.sin(lat * 0.1) * 0.9).toFixed(1);
  const windSpeed = (12.4 + Math.cos(lon * 0.1) * 3.5).toFixed(1);

  return (
    <div className="glass-panel rounded-2xl p-3.5 w-80 md:w-88 max-h-[380px] overflow-y-auto shadow-2xl border border-cyan-500/20 backdrop-blur-md pointer-events-auto transition-all duration-300 ease-out no-scrollbar">
      {/* Header: Coordinates & Subsurface Core Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-mono font-bold text-white truncate">
              {latStr}, {lonStr}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {region}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            Core Active
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Compact Readout: Temperature at current depth */}
      <div className="flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] text-slate-400">At {currentDepth}m:</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {activeDepthPoint ? activeDepthPoint.temp.toFixed(1) : '--'}°C
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Confidence: <span className="text-cyan-400 font-bold">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Main Depth-vs-Temperature Recharts Curve with Side Color Column */}
      <div className="mt-2.5 flex gap-2 items-stretch">
        {/* Physical Depth Color Bar */}
        <div className="w-2.5 rounded-md overflow-hidden flex flex-col shadow-inner border border-white/10" title="Subsurface thermal gradient">
          {profile.map((p, idx) => (
            <div
              key={idx}
              className="flex-1 w-full"
              style={{ backgroundColor: getTemperatureColor(p.temp).hex }}
            />
          ))}
        </div>

        {/* Recharts Area Chart */}
        <div className="flex-1 h-36 bg-slate-950/80 rounded-xl p-1.5 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={profile}
              layout="vertical"
              margin={{ top: 2, right: 10, bottom: 2, left: -15 }}
            >
              <defs>
                <linearGradient id="coreTempGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ff416c" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis
                type="number"
                domain={tempDomain}
                unit="°"
                tick={{ fill: '#94a3b8', fontSize: 9 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                type="number"
                dataKey="depth"
                reversed={true}
                domain={[0, 1000]}
                unit="m"
                tick={{ fill: '#94a3b8', fontSize: 9 }}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProfilePoint;
                    return (
                      <div className="bg-slate-900 border border-cyan-500/40 px-2 py-1 rounded-lg text-[10px] shadow-lg">
                        <div className="font-bold text-cyan-300">{data.depth}m</div>
                        <div className="text-white font-mono">{data.temp.toFixed(1)}°C</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={currentDepth} stroke="#00f2fe" strokeDasharray="2 2" />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#00f2fe"
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#coreTempGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optional Expandable Tabs (Satellite Inputs / Strata) */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex gap-1.5">
        <button
          onClick={() => setExpandedTab(expandedTab === 'satellite' ? 'none' : 'satellite')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${
            expandedTab === 'satellite'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          <Satellite className="w-3 h-3" />
          <span>Satellite Signals</span>
          {expandedTab === 'satellite' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <button
          onClick={() => setExpandedTab(expandedTab === 'strata' ? 'none' : 'strata')}
          className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${
            expandedTab === 'strata'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Strata Details</span>
          {expandedTab === 'strata' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Satellite View */}
      {expandedTab === 'satellite' && (
        <div className="grid grid-cols-2 gap-1.5 mt-2 animate-in fade-in duration-150">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-[10px]">
            <div className="text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" /> SST (IR)
            </div>
            <div className="font-mono font-bold text-white mt-0.5">{surfaceTemp.toFixed(1)}°C</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-[10px]">
            <div className="text-slate-400 flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400" /> SSH Anomaly
            </div>
            <div className="font-mono font-bold text-white mt-0.5">{ssha} cm</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-[10px]">
            <div className="text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" /> SSS (Salinity)
            </div>
            <div className="font-mono font-bold text-white mt-0.5">{sss} PSU</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-[10px]">
            <div className="text-slate-400 flex items-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" /> Wind Stress
            </div>
            <div className="font-mono font-bold text-white mt-0.5">{windSpeed} kts</div>
          </div>
        </div>
      )}

      {/* Expanded Strata View */}
      {expandedTab === 'strata' && (
        <div className="flex flex-col gap-1 mt-2 text-[10px] animate-in fade-in duration-150">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border-l-2 border-cyan-400 flex justify-between">
            <span className="text-slate-300">Mixed Layer (0-50m)</span>
            <span className="font-mono font-bold text-white">{surfaceTemp.toFixed(1)}°C</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/80 border-l-2 border-cyan-400 flex justify-between">
            <span className="text-slate-300">Thermocline (50-400m)</span>
            <span className="font-mono font-bold text-white">{(surfaceTemp - 12.5).toFixed(1)}°C</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-900/80 border-l-2 border-blue-500 flex justify-between">
            <span className="text-slate-300">Deep Ocean (400-1000m)</span>
            <span className="font-mono font-bold text-white">{deepTemp.toFixed(1)}°C</span>
          </div>
        </div>
      )}
    </div>
  );
};
