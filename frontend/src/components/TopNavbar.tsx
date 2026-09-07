import React from 'react';
import {
  Globe,
  Database,
  Satellite,
  BarChart3,
  Info,
  Search,
  Sun,
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
  const navLinks = [
    { id: 'explore', label: 'Explore', icon: Globe },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'satellites', label: 'Satellites', icon: Satellite },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="w-full h-16 bg-[#070c18]/90 border-b border-cyan-500/10 px-6 flex items-center justify-between pointer-events-auto select-none z-30 backdrop-blur-md">
      {/* 1. Left Brand & Tagline */}
      <div className="flex items-center gap-3">
        {/* Wave logo (cyan-to-blue gradient square with overlapping curved wave lines) */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-md shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-[#060c19] rounded-[11px] flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7c2 .8 4 .8 6 0 2-.8 4-.8 6 0 2 .8 4 .8 6 0" />
              <path d="M2 12c2 .8 4 .8 6 0 2-.8 4-.8 6 0 2 .8 4 .8 6 0" />
              <path d="M2 17c2 .8 4 .8 6 0 2-.8 4-.8 6 0 2 .8 4 .8 6 0" />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-base font-bold text-white tracking-tight leading-none">
            Ocean Embed
          </h1>
          <span className="text-[8.5px] tracking-[0.18em] text-slate-400 uppercase font-semibold block mt-1">
            Real-Time Ocean Intelligence
          </span>
        </div>
      </div>

      {/* 2. Center Nav Links with Icons */}
      <nav className="flex items-center gap-8">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeNav === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavChange(link.id)}
              className={`flex items-center gap-2 text-xs font-medium py-5 relative transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Right Search Bar, Theme Toggle & Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search location, coordinates, or region..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-9 pr-3 text-xs bg-[#0b1325]/80 border border-white/10 rounded-full text-slate-200 placeholder-slate-400 outline-none focus:border-cyan-400/50 transition-all font-sans"
          />
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-white/10" />

        {/* Sun / Theme Toggle Button */}
        <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Sun className="w-4 h-4" />
        </button>

        {/* Avatar Profile Badge (OE in cyan outline circle) */}
        <div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-300 bg-[#0c1e3d] flex items-center justify-center font-bold text-xs font-mono shadow-sm shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-transform">
          OE
        </div>
      </div>
    </header>
  );
};
