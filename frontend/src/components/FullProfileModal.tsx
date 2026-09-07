import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { X, Waves, MapPin, Gauge, Download, Layers } from 'lucide-react';
import { ProfilePoint, getTemperatureColor } from '../utils/geo';

interface FullProfileModalProps {
  id?: string;
  lat: number;
  lon: number;
  region: string;
  surfaceTemp: number;
  deepTemp: number;
  confidence: number;
  profile: ProfilePoint[];
  currentDepth: number;
  onClose: () => void;
}

export const FullProfileModal: React.FC<FullProfileModalProps> = ({
  id = 'ARGO-GL-4902120',
  lat,
  lon,
  region,
  surfaceTemp,
  deepTemp,
  confidence,
  profile,
  currentDepth,
  onClose,
}) => {
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;

  const handleExportCSV = () => {
    const csvRows = ['depth_m,temperature_celsius,confidence'];
    profile.forEach((p) => {
      csvRows.push(`${p.depth},${p.temp},${p.confidence}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oceanembed_profile_${lat.toFixed(2)}_${lon.toFixed(2)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="glass-hud rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-white/10 flex flex-col gap-4 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{id}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  0m – 1000m Profile
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{latStr}, {lonStr}</span>
                <span>• {region}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 text-center">
            <div className="text-[10px] text-slate-400">Surface (SST)</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              {surfaceTemp.toFixed(1)}°C
            </div>
          </div>
          <div className="glass-hud-subtle p-3 rounded-2xl border border-cyan-400/30 text-center">
            <div className="text-[10px] text-cyan-300">At {currentDepth}m</div>
            <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
              {(profile.find((p) => p.depth === currentDepth) || profile[0])?.temp.toFixed(1)}°C
            </div>
          </div>
          <div className="glass-hud-subtle p-3 rounded-2xl border border-white/5 text-center">
            <div className="text-[10px] text-slate-400">Deep Ocean (1000m)</div>
            <div className="text-base font-bold font-mono text-blue-400 mt-0.5">
              {deepTemp.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Vertical Depth Plot with Side Color Bar */}
        <div className="flex gap-3 items-stretch mt-1">
          {/* Depth Color Bar */}
          <div className="w-3 rounded-lg overflow-hidden flex flex-col shadow-inner border border-white/10" title="0m to 1000m thermal column">
            {profile.map((p, idx) => (
              <div
                key={idx}
                className="flex-1 w-full"
                style={{ backgroundColor: getTemperatureColor(p.temp).hex }}
              />
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 h-56 bg-slate-950/90 rounded-2xl p-2 border border-white/10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={profile}
                layout="vertical"
                margin={{ top: 5, right: 15, bottom: 5, left: -10 }}
              >
                <defs>
                  <linearGradient id="modalTempGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#ff416c" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <XAxis
                  type="number"
                  domain={[0, 32]}
                  unit="°C"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  type="number"
                  dataKey="depth"
                  reversed={true}
                  domain={[0, 1000]}
                  unit="m"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ProfilePoint;
                      return (
                        <div className="bg-slate-900 border border-cyan-400/50 p-2 rounded-lg text-xs shadow-xl">
                          <div className="font-bold text-cyan-300 font-mono">Depth: {data.depth}m</div>
                          <div className="text-white font-mono">Temp: {data.temp.toFixed(2)}°C</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={currentDepth} stroke="#00f2fe" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#00f2fe"
                  strokeWidth={2.5}
                  fillOpacity={0.35}
                  fill="url(#modalTempGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
