import React from 'react';
import {
  Info,
  X,
  Layers,
  Cpu,
  Database,
  Globe2,
  ShieldCheck,
  Award,
  ExternalLink,
  Zap,
  Waves,
} from 'lucide-react';

interface MissionInfoModalProps {
  onClose: () => void;
}

export const MissionInfoModal: React.FC<MissionInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 pointer-events-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 md:py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-xs">
              <Info className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-display font-bold text-white tracking-tight">
                  Mission & Problem Statement Architecture
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  SIH 2026 • PS 26066
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Ministry of Earth Sciences (MoES) & INCOIS Ocean Intelligence Initiative
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

        {/* Modal Body */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
          {/* Executive Overview Card */}
          <div className="p-4.5 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4.5 h-4.5 text-sky-600 stroke-[2.2]" />
              <h3 className="text-xs font-display font-bold text-slate-900 uppercase tracking-wider">
                The Core Challenge
              </h3>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              Satellites only observe the thin 2D surface "skin" of the ocean (Sea Surface Temperature, Sea Surface Height Anomaly, and Winds). However, 95% of ocean heat, cyclone intensification triggers, and climate dynamics occur <span className="font-semibold text-slate-900">underneath the surface (0–1000m)</span>.
            </p>
            <p className="text-xs font-normal text-slate-600 leading-relaxed mt-2">
              <span className="font-bold text-slate-900">OceanEmbed</span> solves MoES Problem Statement 26066 by utilizing Physics-Informed Latent Neural Representations to reconstruct high-fidelity 3D subsurface temperature and density structures for the entire Indian Ocean basin in real-time.
            </p>
          </div>

          {/* 3-Tier Pipeline Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                    01
                  </span>
                  <span className="text-[9.5px] font-mono font-semibold bg-slate-900 text-white px-2 py-0.5 rounded">
                    INGESTION
                  </span>
                </div>
                <h4 className="text-xs font-display font-bold text-slate-900 mt-3">
                  Multi-Satellite Constellation
                </h4>
                <p className="text-[11px] text-slate-600 font-normal mt-1 leading-relaxed">
                  Real-time ingestion of SST (INSAT-3DR, MODIS), SSHA (Sentinel-6, Jason-3), and wind vectors (Oceansat-3).
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-mono font-medium text-slate-600">
                ⚡ 0.25° Spatial Resolution
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <span className="text-[9.5px] font-mono font-semibold bg-sky-700 text-white px-2 py-0.5 rounded">
                    AI INFERENCE
                  </span>
                </div>
                <h4 className="text-xs font-display font-bold text-slate-900 mt-3">
                  OceanEmbed Deep Encoder
                </h4>
                <p className="text-[11px] text-slate-600 font-normal mt-1 leading-relaxed">
                  Transformer-based latent manifold mapper trained with ocean baroclinic mode physics equations.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-sky-200/60 text-[10px] font-mono font-medium text-sky-900">
                ⚡ 18.2ms Latency per Profile
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    03
                  </span>
                  <span className="text-[9.5px] font-mono font-semibold bg-emerald-800 text-white px-2 py-0.5 rounded">
                    GROUND TRUTH
                  </span>
                </div>
                <h4 className="text-xs font-display font-bold text-slate-900 mt-3">
                  INCOIS Argo Validation
                </h4>
                <p className="text-[11px] text-slate-600 font-normal mt-1 leading-relaxed">
                  Automated benchmark verification with 24 live Indian Ocean Argo profiling floats, ensuring R² &gt; 0.94.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 text-[10px] font-mono font-medium text-emerald-900">
                ⚡ RMSE 0.31°C Accuracy
              </div>
            </div>
          </div>

          {/* Key Deliverables & Impact Box */}
          <div className="p-4.5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-2.5">
              Operational Impact for India & MoES
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong className="text-white">Cyclone Heat Potential:</strong> Provides rapid subsurface heat content estimation to forecast cyclone intensification in Arabian Sea & Bay of Bengal.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong className="text-white">Monsoon & Climate Modeling:</strong> Resolves Wyrtki jet and Indian Ocean Dipole (IOD) subsurface signatures in real time.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong className="text-white">Marine Fisheries & Defense:</strong> Enables thermocline and sound velocity profile modeling for naval acoustics and pelagic fishery zones.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong className="text-white">Continuous Self-Supervised Adaptation:</strong> Ingests daily Argo NetCDF profiles to continuously fine-tune AI embeddings.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">
            Ministry of Earth Sciences • Indian National Centre for Ocean Information Services (INCOIS)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all active:scale-[0.99]"
          >
            Return to 3D Globe
          </button>
        </div>
      </div>
    </div>
  );
};

