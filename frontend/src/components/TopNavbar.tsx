import React, { useState } from 'react';
import {
  Globe,
  Database,
  Satellite,
  BarChart3,
  Info,
  Search,
  Menu,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';

interface TopNavbarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeNav,
  onNavChange,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const navLinks = [
    { id: 'explore', label: '3D Orbit Globe', shortLabel: 'Globe', icon: Globe },
    { id: 'data', label: '3D Ocean Block', shortLabel: 'Block', icon: Database },
    { id: 'satellites', label: 'Constellation', shortLabel: 'Satellites', icon: Satellite },
    { id: 'analytics', label: 'AI Telemetry', shortLabel: 'Telemetry', icon: BarChart3 },
    { id: 'about', label: 'Mission Architecture', shortLabel: 'Mission', icon: Info },
  ];

  return (
    <header className="w-full h-14 md:h-16 bg-slate-950/85 backdrop-blur-2xl border-b border-sky-500/20 px-3 md:px-6 flex items-center justify-between pointer-events-auto select-none z-30 shadow-[0_4px_30px_rgba(0,0,0,0.6)] relative text-white">
      {/* 1. Left Brand & Space-Ocean Mission Emblem */}
      <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
        {/* Glowing 3D Volumetric Space-Ocean Emblem */}
        <div className="w-8 h-8 md:w-9.5 md:h-9.5 rounded-xl bg-slate-900 border border-sky-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.25)] p-1 shrink-0 group cursor-pointer hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.45)] transition-all">
          <svg className="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Orbit Path */}
            <circle cx="16" cy="16" r="14" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            {/* Hexagonal 3D Ocean Volume Shell */}
            <path
              d="M16 4L27 10V22L16 28L5 22V10L16 4Z"
              fill="#060A14"
              stroke="#38BDF8"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Top Surface SST Layer */}
            <path
              d="M16 4L27 10L16 16L5 10L16 4Z"
              fill="#0284C7"
              fillOpacity="0.5"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Subsurface Thermocline Strata (Cyan) */}
            <path
              d="M5 14.5L16 20.5L27 14.5"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Intermediate Strata (Emerald) */}
            <path
              d="M5 18.5L16 24.5L27 18.5"
              stroke="#34D399"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Deep Volumetric Sounding Axis */}
            <path
              d="M16 16V28"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="1.5 1.5"
            />
            {/* Satellite Beacon Dot */}
            <circle cx="16" cy="10" r="2" fill="#38BDF8" className="animate-pulse" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-display font-extrabold tracking-tight text-white flex items-center">
              Ocean<span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-1.5 py-0.2 rounded-md font-mono text-xs font-bold ml-1 shadow-[0_0_12px_rgba(56,189,248,0.4)] border border-sky-400/40">Embed</span>
            </h1>
            <span className="px-1.5 md:px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-mono font-semibold bg-sky-950/80 text-sky-300 border border-sky-500/30 shadow-xs">
              SIH26066
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] text-slate-400 font-mono font-medium hidden sm:block leading-none mt-0.5">
            Earth Observation • 3D Subsurface Digital Twin • Team REGALIA
          </span>
        </div>
      </div>

      {/* 2. Center Nav Links (Cosmic Space HUD Pills) */}
      <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner max-w-[55vw] md:max-w-none overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeNav === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavChange(link.id)}
              className={`flex items-center gap-1.5 text-[11px] md:text-xs px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-[0_0_15px_rgba(2,132,199,0.45)] border border-sky-400/40 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] ${isActive ? 'text-sky-200' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sm:hidden">{link.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right Space Telemetry Badges & Search */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
        {/* Live Satellite Downlink Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE DOWNLINK • 6 SATS</span>
        </div>

        {/* Space Command Search Input (Desktop) */}
        <div className="relative hidden md:block w-44 lg:w-52">
          <Search className="w-3.5 h-3.5 text-sky-400/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
          <input
            type="text"
            placeholder="Search coordinates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8.5 pl-8 pr-7 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 font-mono font-medium shadow-inner focus:outline-none focus:bg-slate-900 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/25 transition-all"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9.5px] font-mono font-medium text-slate-400 px-1 py-0.2 rounded border border-slate-700 bg-slate-800 pointer-events-none">
            /
          </span>
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden w-8 h-8 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-300 shadow-xs"
        >
          {isMobileSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
        </button>

        {/* Mission Control Node Badge */}
        <div className="w-8 h-8 md:w-8.5 md:h-8.5 rounded-lg border border-sky-500/40 text-sky-300 bg-slate-900/90 flex items-center justify-center font-bold text-[10.5px] font-mono shadow-[0_0_10px_rgba(56,189,248,0.2)]">
          IN
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-2.5 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 shadow-xl z-40 flex items-center gap-2 md:hidden">
          <Search className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="text"
            placeholder="Search coordinates (e.g. 12.5 N, 75.2 E)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 px-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};
