import React from 'react';
import { Radio, Activity, MapPin, X, ArrowRight, Layers } from 'lucide-react';
import { ArgoFloat } from '../utils/geo';

interface FloatTelemetryCardProps {
  float: ArgoFloat;
  onClose?: () => void;
  onSelect?: (float: ArgoFloat) => void;
}

export const FloatTelemetryCard: React.FC<FloatTelemetryCardProps> = ({
  float,
  onClose,
  onSelect,
}) => {
  const isIndianOcean = float.id.startsWith('ARGO-IN');
  const latStr = `${Math.abs(float.lat).toFixed(2)}° ${float.lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(float.lon).toFixed(2)}° ${float.lon >= 0 ? 'E' : 'W'}`;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleClick = async () => {
    if (!onSelect) return;
    setIsSubmitting(true);
    try {
      await onSelect(float);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-hud p-3.5 rounded-2xl border border-cyan-400/30 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 w-72 md:w-80 pointer-events-auto select-none animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Animated Cyan Radio Wave Icon */}
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
          </div>
          <span className="font-mono font-bold text-sm text-cyan-300 tracking-tight">
            {float.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            {float.status || 'ACTIVE'}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sensor Type & Basin */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
        <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">
          {float.sensor_type || 'CTD-Oxygen'} • <span className="text-slate-300">{float.basin || 'Indian Ocean'}</span>
        </span>
      </div>

      {/* Coordinates & Depth */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>{float.lat.toFixed(2)}°, {float.lon.toFixed(2)}° ({latStr}, {lonStr})</span>
        </div>
      </div>

      {/* Action Button */}
      {onSelect && (
        <button
          onClick={handleClick}
          disabled={isSubmitting}
          className="w-full mt-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 via-cyan-500/20 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-400/50 text-cyan-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Reconstructing 0–1000m...' : 'Load Subsurface Profile'}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};
