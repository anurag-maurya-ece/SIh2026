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
import { X, Waves, MapPin, Download } from 'lucide-react';
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

  const selectedDepthTemp = (profile.find((p) => p.depth === currentDepth) || profile[0])?.temp.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 pointer-events-auto">
      <div className="bg-white rounded-2xl p-5 w-full max-w-xl border border-slate-200/90 shadow-2xl flex flex-col gap-3.5 text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-sky-400 border border-slate-800 shadow-xs">
              <Waves className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-mono">{id}</h3>
                <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  0m – 1000m CTD
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                <span>{latStr}, {lonStr}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">{region}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-lg text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
              title="Download CSV Dataset"
            >
              <Download className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 font-mono">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border border-slate-800 shadow-xs text-center text-white">
            <div className="text-[9.5px] uppercase font-sans font-semibold text-sky-300 tracking-wide">Surface (0m)</div>
            <div className="text-xl font-bold mt-0.5 text-white">
              {surfaceTemp.toFixed(1)}°C
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-100 shadow-xs text-center text-slate-900">
            <div className="text-[9.5px] uppercase font-sans font-semibold text-slate-600 tracking-wide">At {currentDepth}m Depth</div>
            <div className="text-xl font-bold mt-0.5 text-sky-950">
              {selectedDepthTemp}°C
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-xs text-center text-white">
            <div className="text-[9.5px] uppercase font-sans font-medium text-slate-400 tracking-wide">Abyssal (1000m)</div>
            <div className="text-xl font-bold mt-0.5 text-white">
              {deepTemp.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Vertical Depth Plot with Side Color Bar */}
        <div className="flex gap-2.5 items-stretch mt-0.5">
          {/* Depth Color Bar */}
          <div className="w-3 rounded-lg overflow-hidden flex flex-col border border-slate-200 shadow-xs" title="0m to 1000m thermal column">
            {profile.map((p, idx) => (
              <div
                key={idx}
                className="flex-1 w-full"
                style={{ backgroundColor: getTemperatureColor(p.temp).hex }}
              />
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 h-60 bg-slate-50/80 rounded-xl p-2.5 border border-slate-200 shadow-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={profile}
                layout="vertical"
                margin={{ top: 5, right: 15, bottom: 5, left: -10 }}
              >
                <defs>
                  <linearGradient id="modalTempGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis
                  type="number"
                  domain={[0, 32]}
                  unit="°C"
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: '500' }}
                  axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                <YAxis
                  type="number"
                  dataKey="depth"
                  reversed={true}
                  domain={[0, 1000]}
                  unit="m"
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: '500' }}
                  axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ProfilePoint;
                      return (
                        <div className="bg-slate-900 text-white border border-slate-800 p-2.5 rounded-lg text-xs shadow-xl font-mono">
                          <div className="font-bold text-white">Depth: {data.depth}m</div>
                          <div className="text-sky-300">Temp: {data.temp.toFixed(2)}°C</div>
                          <div className="text-emerald-400 text-[10.5px]">Confidence: {(data.confidence * 100).toFixed(1)}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={currentDepth} stroke="#0284c7" strokeDasharray="3 3" strokeWidth={1.5} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={0.5}
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
