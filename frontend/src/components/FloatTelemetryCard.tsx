import React from 'react';
import { Radio, Activity, MapPin, X, ArrowRight } from 'lucide-react';
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
    <div className="institutional-card p-3 rounded-2xl flex flex-col gap-2.5 w-68 md:w-72 pointer-events-auto select-none animate-in fade-in slide-in-from-left-4 duration-200 text-slate-900 shadow-md">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div>
            <span className="font-mono font-bold text-xs text-slate-900 tracking-tight block leading-tight">
              {float.id}
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium">
              {float.basin || 'Indian Ocean Basin'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {float.status || 'Active'}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          )}
        </div>
      </div>

      {/* Sensor Type & Coordinates Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/80">
          <span className="text-[9px] text-slate-500 block font-medium">Payload Sensor</span>
          <span className="text-slate-900 font-bold text-[10.5px] truncate block mt-0.5">
            {float.sensor_type || 'CTD-Oxygen'}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-sky-50/60 border border-sky-100">
          <span className="text-[9px] text-slate-500 block font-medium">Observed Depth</span>
          <span className="text-sky-950 font-bold text-[10.5px] font-mono truncate block mt-0.5">
            {float.last_depth_m || 1000}m
          </span>
        </div>
      </div>

      {/* Coordinates */}
      <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-slate-700 px-2.5 py-1.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-slate-500 stroke-[2] shrink-0" />
          <span>{latStr}, {lonStr}</span>
        </div>
        <span className="text-[9px] font-semibold text-sky-800 px-1.5 py-0.2 rounded bg-sky-100 border border-sky-200">INCOIS</span>
      </div>

      {/* Action Button */}
      {onSelect && (
        <button
          onClick={handleClick}
          disabled={isSubmitting}
          className="w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs disabled:opacity-60 transition-all active:scale-[0.99]"
        >
          <span>{isSubmitting ? 'Reconstructing 0–1000m...' : 'Load Subsurface Profile'}</span>
          <ArrowRight className={`w-3.5 h-3.5 stroke-[2.2] ${isSubmitting ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};

