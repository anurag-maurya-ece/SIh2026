import React from 'react';
import {
  Globe,
  BarChart3,
  Layers,
  TrendingUp,
  Wrench,
  Settings,
  Shield,
} from 'lucide-react';

interface LeftNavRailProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: Globe },
  { id: 'live_data', label: 'Live Data', icon: BarChart3 },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const LeftNavRail: React.FC<LeftNavRailProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="w-28 flex flex-col justify-between py-4 pointer-events-auto select-none z-20">
      {/* Navigation Pill Items */}
      <div className="flex flex-col gap-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ease-out text-left ${
                isActive
                  ? 'bg-gradient-to-r from-[#0066cc] to-[#00a8ff] text-white shadow-lg shadow-cyan-500/25 border border-cyan-300/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom MoES / INCOIS Program Badge */}
      <div className="glass-hud-subtle p-3 rounded-2xl border border-white/10 flex flex-col gap-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Emblem Icon / Lion capital representation */}
          <div className="w-6 h-6 rounded bg-slate-800/90 border border-white/10 flex items-center justify-center text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 leading-none">Powered by</div>
            <div className="text-[11px] font-bold text-white font-mono leading-tight">MoES</div>
            <div className="text-[8px] text-cyan-300 font-mono">PS 26066</div>
          </div>
        </div>
        <div className="text-[7.5px] uppercase tracking-wider text-slate-400 font-semibold border-t border-white/5 pt-1">
          Indian Ocean Observation Program
        </div>
      </div>
    </nav>
  );
};
