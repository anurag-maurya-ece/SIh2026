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
    { id: 'explore', label: '3D Globe', shortLabel: 'Globe', icon: Globe },
    { id: 'data', label: 'Ocean Block', shortLabel: 'Block', icon: Database },
    { id: 'satellites', label: 'Constellation', shortLabel: 'Satellites', icon: Satellite },
    { id: 'analytics', label: 'Telemetry', shortLabel: 'Telemetry', icon: BarChart3 },
    { id: 'about', label: 'Mission Info', shortLabel: 'Mission', icon: Info },
  ];

  return (
    <header className="w-full h-14 md:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 md:px-6 flex items-center justify-between pointer-events-auto select-none z-30 shadow-xs relative">
      {/* 1. Left Brand & Institutional Badges */}
      <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
        {/* Modern 3D Subsurface Ocean AI Emblem */}
        <div className="w-8 h-8 md:w-9.5 md:h-9.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center shadow-xs p-1 shrink-0 group cursor-pointer hover:bg-slate-900 transition-colors">
          <svg className="w-full h-full" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hexagonal 3D Ocean Volume Shell */}
            <path
              d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z"
              fill="#060A14"
              stroke="#38BDF8"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Top Surface SST Layer Diamond */}
            <path
              d="M16 3L28 9.5L16 16L4 9.5L16 3Z"
              fill="#0284C7"
              fillOpacity="0.4"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Subsurface Thermocline Strata (Cyan) */}
            <path
              d="M4 14L16 20.5L28 14"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Intermediate Depth Strata (Emerald) */}
            <path
              d="M4 18.5L16 25L28 18.5"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Deep Volumetric Sounding Axis */}
            <path
              d="M16 16V29"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="1.5 1.5"
            />
            {/* Surface AI Sensor Focal Beacon */}
            <circle cx="16" cy="9.5" r="2" fill="#38BDF8" stroke="#000000" strokeWidth="0.6" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm md:text-base font-display font-bold tracking-tight text-slate-900">
              Ocean<span className="bg-sky-600 text-white px-1.5 py-0.5 rounded-md font-bold text-xs ml-0.5 shadow-xs">Embed</span>
            </h1>
            <span className="px-1.5 md:px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              PS 26066
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
            Ministry of Earth Sciences • INCOIS Ocean Intelligence
          </span>
        </div>
      </div>

      {/* 2. Center Nav Links (Horizontally scrollable on mobile) */}
      <nav className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl shadow-xs max-w-[55vw] md:max-w-none overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeNav === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavChange(link.id)}
              className={`flex items-center gap-1.5 text-[11px] md:text-xs px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sm:hidden">{link.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. Right Pill Tags & Search */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
        {/* Live Status Pill Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-[10.5px] font-semibold shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INCOIS LIVE</span>
        </div>

        {/* Clean Search Input (Desktop) */}
        <div className="relative hidden md:block w-44 lg:w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
          <input
            type="text"
            placeholder="Search coordinates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8.5 pl-8 pr-7 text-xs bg-slate-50/90 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-mono font-medium shadow-xs focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9.5px] font-mono font-medium text-slate-400 px-1 py-0.2 rounded border border-slate-200 bg-white pointer-events-none">
            /
          </span>
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-xs"
        >
          {isMobileSearchOpen ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
        </button>

        {/* User / Station Avatar Badge */}
        <div className="w-8 h-8 md:w-8.5 md:h-8.5 rounded-lg border border-slate-800 text-white bg-slate-900 flex items-center justify-center font-bold text-[11px] font-mono shadow-xs">
          IN
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md z-40 flex items-center gap-2 md:hidden">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search coordinates (e.g. 12.5 N, 75.2 E)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-slate-900 focus:outline-none focus:border-sky-500"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};
