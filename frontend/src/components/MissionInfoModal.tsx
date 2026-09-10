import React from 'react';
import {
  Layers,
  Brain,
  Box,
  Eye,
  Wind,
  Thermometer,
  Fish,
  Waves,
  Activity,
  X,
  Sparkles,
  ShieldCheck,
  Ship,
  ArrowRight,
} from 'lucide-react';

interface MissionInfoModalProps {
  onClose: () => void;
}

export const MissionInfoModal: React.FC<MissionInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150 pointer-events-auto">
      <div className="relative w-full max-w-6xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-display font-bold text-white tracking-tight">
                  Team REGALIA • OceanEmbed Model & Impact Architecture
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  SIH26066 • Disaster Management
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Satellite Embedding-Based Deep Learning Framework for Subsurface Ocean Temperature Reconstruction
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Modal Body: 3-Column PPT Slide 5 Layout */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ─── COLUMN 1: 01 WHAT OUR MODEL DOES (4 cols) ─── */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            <div>
              <h3 className="text-xs md:text-sm font-display font-extrabold text-[#004b87] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="text-sky-600">01</span> WHAT OUR MODEL DOES
              </h3>

              <div className="flex flex-col gap-2.5">
                {/* 1. Multiple Surface Inputs Card */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-sky-400 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0a2558] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Layers className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        Multiple Surface Inputs
                      </h4>
                      <div className="text-[10px] font-mono font-semibold text-sky-700 mt-0.5 tracking-tight">
                        SST + SSS + SLA + WIND + CHLOROPHYLL
                      </div>

                      {/* 5 Satellite Micro-Thumbnails */}
                      <div className="grid grid-cols-5 gap-1.5 mt-2 pt-2 border-t border-slate-100">
                        <div className="flex flex-col items-center">
                          <div className="w-full h-7 rounded bg-gradient-to-br from-blue-700 via-amber-400 to-red-600 border border-slate-200/80 shadow-2xs" />
                          <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">SST</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-7 rounded bg-gradient-to-br from-indigo-900 via-teal-400 to-yellow-300 border border-slate-200/80 shadow-2xs" />
                          <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">SSS</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-7 rounded bg-gradient-to-br from-blue-900 via-cyan-400 to-rose-500 border border-slate-200/80 shadow-2xs" />
                          <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">SLA/ADT</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-7 rounded bg-[#1e293b] flex items-center justify-center border border-slate-200/80 text-sky-300">
                            <Wind className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">Wind</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-7 rounded bg-gradient-to-br from-blue-800 via-emerald-400 to-yellow-400 border border-slate-200/80 shadow-2xs" />
                          <span className="text-[8.5px] font-mono font-bold text-slate-600 mt-0.5">Chl</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Deep Learning Fusion Card */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-purple-400 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Brain className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-purple-950 leading-tight">
                        Deep Learning Fusion
                      </h4>
                      <p className="text-[10.5px] text-purple-900/90 font-medium mt-1 leading-snug">
                        Learns complex relationships between surface conditions and subsurface thermal structure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. 3D Temperature Reconstruction Card */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Box className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 leading-tight">
                        3D Temperature Reconstruction
                      </h4>
                      <p className="text-[10.5px] text-emerald-900/90 font-medium mt-1 leading-snug">
                        Daily temperature profiles at multiple depths (0–1000m), at <strong>0.25° spatial resolution</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contribution Ribbon */}
            <div className="mt-1 p-2 rounded-xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004b87]">
                THE ACTUAL CONTRIBUTION OF OUR MODEL
              </span>
            </div>
          </div>

          {/* ─── COLUMN 2: 3D OCEAN BLOCK CENTER VISUAL (4 cols) ─── */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header Title */}
            <div className="text-center mb-3 relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-300 block">
                3D OCEAN TEMPERATURE ESTIMATION
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                Continuous Subsurface Stratification (0 to 1000m)
              </span>
            </div>

            {/* Isometric Cutaway Graphic / Block Simulation */}
            <div className="w-full relative px-2 py-2 flex flex-col items-center justify-center">
              {/* Surface Ocean Layer + Research Vessel */}
              <div className="w-full h-10 rounded-t-xl bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 border border-sky-300/40 relative flex items-center justify-between px-3 shadow-sm">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-950">
                  <Ship className="w-3.5 h-3.5 text-slate-950" />
                  <span>Research Cruise (INCOIS)</span>
                </div>
                <span className="text-[8.5px] font-mono font-bold bg-white/90 text-slate-900 px-1.5 py-0.5 rounded">
                  0m Surface
                </span>
              </div>

              {/* Multi-Strata Thermal Gradient Block */}
              <div className="w-full border-x border-b border-white/20 rounded-b-xl overflow-hidden flex flex-col divide-y divide-white/10 shadow-inner">
                {/* 50m Mixed Layer */}
                <div className="h-9 bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400 flex items-center justify-between px-3 text-slate-950 font-semibold text-[9.5px]">
                  <span>☀️ Epipelagic Mixed Layer</span>
                  <span className="font-mono font-bold">50 m</span>
                </div>
                {/* 100m Upper Thermocline */}
                <div className="h-9 bg-gradient-to-r from-yellow-400 via-emerald-400 to-teal-400 flex items-center justify-between px-3 text-slate-950 font-semibold text-[9.5px]">
                  <span>⚡ Upper Thermocline</span>
                  <span className="font-mono font-bold">100 m</span>
                </div>
                {/* 200m Main Thermocline */}
                <div className="h-9 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-between px-3 text-white font-semibold text-[9.5px]">
                  <span>🌊 Main Thermocline Core</span>
                  <span className="font-mono font-bold">200 m</span>
                </div>
                {/* 500m Mesopelagic */}
                <div className="h-9 bg-gradient-to-r from-blue-700 via-blue-900 to-indigo-950 flex items-center justify-between px-3 text-white font-semibold text-[9.5px]">
                  <span>❄️ Mesopelagic Cold Layer</span>
                  <span className="font-mono font-bold">500 m</span>
                </div>
                {/* 1000m Abyssal Floor */}
                <div className="h-9 bg-gradient-to-r from-indigo-950 via-slate-950 to-black flex items-center justify-between px-3 text-sky-200 font-semibold text-[9.5px]">
                  <span>🌌 Abyssal Stable Floor</span>
                  <span className="font-mono font-bold">1000 m</span>
                </div>
              </div>

              {/* Thermal Legend Indicator Bar */}
              <div className="w-full mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-16 rounded-full bg-gradient-to-r from-blue-900 via-emerald-400 to-red-500 border border-white/20" />
                  <span className="text-[8.5px] font-mono text-slate-300">Colder → Warmer</span>
                </div>
                <span className="text-[8.5px] font-mono text-sky-300">Temperature (°C)</span>
              </div>
            </div>
          </div>

          {/* ─── COLUMN 3: 02 KEY IMPACTS AND BENEFITS (4 cols) ─── */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <h3 className="text-xs md:text-sm font-display font-extrabold text-[#004b87] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="text-sky-600">02</span> KEY IMPACTS AND BENEFITS
            </h3>

            {/* 1. 3D Ocean Visibility */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-sky-400 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#004b87] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Eye className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    3D Ocean Visibility
                  </h4>
                  <p className="text-[10px] text-slate-600 font-medium leading-snug">
                    Estimates temperature beneath the surface.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-slate-100 font-mono font-black text-slate-800 text-xs flex items-center justify-center shrink-0 border border-slate-200">
                1
              </span>
            </div>

            {/* 2. Cyclone Monitoring */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-purple-400 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Waves className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950 leading-tight">
                    Cyclone Monitoring
                  </h4>
                  <p className="text-[10px] text-purple-900/90 font-medium leading-snug">
                    Reveals subsurface heat that can influence cyclone intensity.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-purple-50 font-mono font-black text-purple-900 text-xs flex items-center justify-center shrink-0 border border-purple-200">
                2
              </span>
            </div>

            {/* 3. Marine Heatwave Detection */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-orange-400 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Thermometer className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-orange-950 leading-tight">
                    Marine Heatwave Detection
                  </h4>
                  <p className="text-[10px] text-orange-900/90 font-medium leading-snug">
                    Identifies warming hidden below the surface.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-orange-50 font-mono font-black text-orange-900 text-xs flex items-center justify-center shrink-0 border border-orange-200">
                3
              </span>
            </div>

            {/* 4. Fisheries & Ecosystems */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-500 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Fish className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 leading-tight">
                    Fisheries & Ecosystems
                  </h4>
                  <p className="text-[10px] text-emerald-900/90 font-medium leading-snug">
                    Provides depth-wise thermal information for marine habitats.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-emerald-50 font-mono font-black text-emerald-900 text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                4
              </span>
            </div>

            {/* 5. Better Ocean Forecasting */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-sky-400 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Waves className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-sky-950 leading-tight">
                    Better Ocean Forecasting
                  </h4>
                  <p className="text-[10px] text-sky-900/90 font-medium leading-snug">
                    Adds continuous 3D temperature information to forecasting systems.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-sky-50 font-mono font-black text-sky-900 text-xs flex items-center justify-center shrink-0 border border-sky-200">
                5
              </span>
            </div>

            {/* 6. High-Resolution Monitoring */}
            <div className="p-2.5 rounded-xl bg-white border-2 border-slate-700 shadow-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Activity className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    High-Resolution Monitoring
                  </h4>
                  <p className="text-[10px] text-slate-600 font-medium leading-snug">
                    Daily temperature estimates at <strong>0.25° resolution</strong> across North Indian Ocean.
                  </p>
                </div>
              </div>
              <span className="w-6 h-6 rounded-md bg-slate-100 font-mono font-black text-slate-900 text-xs flex items-center justify-center shrink-0 border border-slate-300">
                6
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Team REGALIA • Ministry of Earth Sciences (MoES) SIH 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#004b87] hover:bg-[#003865] text-white shadow-xs transition-all active:scale-[0.99]"
          >
            Explore Live 3D Globe
          </button>
        </div>
      </div>
    </div>
  );
};

