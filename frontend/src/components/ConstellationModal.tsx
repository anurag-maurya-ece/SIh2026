import React, { useState } from 'react';
import {
  Satellite,
  X,
  Radio,
  Clock,
  ShieldCheck,
  Compass,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';

interface SatelliteData {
  id: string;
  name: string;
  agency: string;
  type: string;
  altitude: string;
  inclination: string;
  payload: string[];
  revisit: string;
  status: 'active' | 'calibrating' | 'standby';
  health: number;
  lastPass: string;
  description: string;
  color: string;
}

const SATELLITES: SatelliteData[] = [
  {
    id: 'sentinel-6',
    name: 'Sentinel-6 Michael Freilich',
    agency: 'ESA / NASA / EUMETSAT',
    type: 'Radar Altimetry',
    altitude: '1,336 km',
    inclination: '66.0°',
    payload: ['Poseidon-4 Altimeter', 'AMR-C Radiometer', 'DORIS / GNSS'],
    revisit: '10 days',
    status: 'active',
    health: 99.4,
    lastPass: '14 mins ago (Over Bay of Bengal)',
    description: 'Reference mission for sea surface height anomaly (SSHA) measurements with millimetric precision.',
    color: 'bg-[#FFB703]',
  },
  {
    id: 'jason-3',
    name: 'Jason-3',
    agency: 'CNES / NASA / NOAA',
    type: 'High-Precision Altimetry',
    altitude: '1,336 km',
    inclination: '66.0°',
    payload: ['Poseidon-3B Altimeter', 'JMR Microwave Radiometer', 'Laser Retroreflector'],
    revisit: '9.9 days',
    status: 'active',
    health: 98.1,
    lastPass: '32 mins ago (Over Arabian Sea)',
    description: 'Cross-calibration baseline for Indian Ocean geostrophic currents and ocean heat content analysis.',
    color: 'bg-[#E0F2FE]',
  },
  {
    id: 'insat-3dr',
    name: 'INSAT-3DR',
    agency: 'ISRO (India)',
    type: 'Geostationary Meteorological',
    altitude: '35,786 km',
    inclination: '74.0° E Geostationary',
    payload: ['Multi-Spectral Imager (6 channels)', 'Sounder (19 channels)', 'Data Relay Transponder'],
    revisit: 'Continuous (15-min refresh)',
    status: 'active',
    health: 99.8,
    lastPass: 'Continuous Real-time Telemetry',
    description: 'Provides uninterrupted thermal infrared sea surface temperature (SST) and atmospheric profiles over the entire Indian Ocean region.',
    color: 'bg-[#DCFCE7]',
  },
  {
    id: 'oceansat-3',
    name: 'Oceansat-3 (EOS-06)',
    agency: 'ISRO (India)',
    type: 'Ocean Color & Wind Scatterometry',
    altitude: '740 km',
    inclination: '98.28° Sun-Synchronous',
    payload: ['Ocean Colour Monitor (OCM-3)', 'Ku-Band Scatterometer (OSCAT-3)', 'Argos-4 Data Relay'],
    revisit: '2 days',
    status: 'active',
    health: 97.6,
    lastPass: '48 mins ago (Over Maldives-Chagos Basin)',
    description: 'Dedicated Indian oceanographic satellite delivering chlorophyll-a, sea surface wind stress vectors, and live Argo float data relay.',
    color: 'bg-[#FFB703]',
  },
  {
    id: 'swot',
    name: 'SWOT',
    agency: 'NASA / CNES / CSA / UKSA',
    type: 'Wide-Swath Ka-Band Altimeter',
    altitude: '891 km',
    inclination: '77.6°',
    payload: ['KaRIn Ka-band Interferometer', 'Poseidon-3C', 'Water Vapor Radiometer'],
    revisit: '21 days (120km Swath)',
    status: 'active',
    health: 98.9,
    lastPass: '2 hrs ago (Over Andaman Sea)',
    description: 'High-resolution 2D wide-swath radar interferometry resolving sub-mesoscale ocean eddies down to 15km scale.',
    color: 'bg-[#E0F2FE]',
  },
  {
    id: 'saral',
    name: 'SARAL / AltiKa',
    agency: 'ISRO / CNES',
    type: 'Ka-Band Altimeter',
    altitude: '800 km',
    inclination: '98.55° Sun-Synchronous',
    payload: ['AltiKa Ka-Band Radar', 'DORIS Tracking', 'Laser Retroreflector Array'],
    revisit: '35 days',
    status: 'active',
    health: 96.2,
    lastPass: '3.4 hrs ago (Over Southern Indian Ocean)',
    description: 'Joint Indo-French satellite providing high-frequency Ka-band altimetry optimized for coastal and inland water surfaces.',
    color: 'bg-[#DCFCE7]',
  },
];

interface ConstellationModalProps {
  onClose: () => void;
}

export const ConstellationModal: React.FC<ConstellationModalProps> = ({ onClose }) => {
  const [selectedSat, setSelectedSat] = useState<SatelliteData>(SATELLITES[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 pointer-events-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 md:py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-xs">
              <Satellite className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-display font-bold text-white tracking-tight">
                  Satellite Constellation Telemetry
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  6 SATELLITES ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Earth Observation constellation feeding surface boundary data to MoES PS 26066
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

        {/* Modal Body: Left List + Right Detail View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Column: Satellite Grid/List */}
          <div className="md:col-span-5 p-3.5 bg-slate-50/80 flex flex-col gap-2 overflow-y-auto max-h-[60vh] md:max-h-[65vh]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 flex items-center justify-between">
              <span>Active Constellation Feeds</span>
              <span className="font-mono text-slate-700 font-semibold">INCOIS Downlink</span>
            </div>

            {SATELLITES.map((sat) => {
              const isSelected = selectedSat.id === sat.id;
              return (
                <div
                  key={sat.id}
                  onClick={() => setSelectedSat(sat)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-sm ring-1 ring-sky-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <h3 className="text-xs font-bold text-slate-900">
                        {sat.name}
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {sat.agency.split('/')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-medium text-slate-500">
                      {sat.type}
                    </span>
                    <span className="text-[9.5px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ● {sat.health}% Health
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Satellite Telemetry & Specs */}
          <div className="md:col-span-7 p-4 md:p-5 bg-white flex flex-col gap-3 overflow-y-auto max-h-[60vh] md:max-h-[65vh]">
            {/* Header Badge Card */}
            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold bg-slate-900 text-white mb-1.5">
                  {selectedSat.agency}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSat.name}
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  {selectedSat.description}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs shrink-0 text-center">
                <Radio className="w-4 h-4 text-sky-600 mx-auto stroke-[2.2]" />
                <span className="text-[8.5px] font-bold font-mono block mt-1 text-slate-700">LIVE LINK</span>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/80">
                <span className="text-[9px] font-medium text-slate-500 block">Orbit Altitude</span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">{selectedSat.altitude}</span>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/80">
                <span className="text-[9px] font-medium text-slate-500 block">Inclination / Orbit</span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">{selectedSat.inclination}</span>
              </div>
              <div className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200/80">
                <span className="text-[9px] font-medium text-slate-500 block">Revisit Frequency</span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">{selectedSat.revisit}</span>
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
                <span className="text-[9px] font-medium text-emerald-800 block">Telemetry Downlink</span>
                <span className="text-[11px] font-mono font-bold text-emerald-900 mt-0.5 block">{selectedSat.lastPass}</span>
              </div>
            </div>

            {/* Instruments & Sensor Payload */}
            <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-slate-700 stroke-[2.2]" />
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  Active Sensor Payloads
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedSat.payload.map((pl, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800 shadow-xs"
                  >
                    ⚡ {pl}
                  </span>
                ))}
              </div>
            </div>

            {/* Neural Network Integration Flow */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  AI Pipeline Integration
                </span>
                <span className="text-[9.5px] font-mono text-emerald-400 font-semibold">
                  Latency: 18ms
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Raw Level-2 / Level-3 swath telemetry from <span className="font-semibold text-white">{selectedSat.name}</span> is ingested, rasterized on a 0.25° Indian Ocean grid, and fed into the OceanEmbed deep encoder to estimate 0–1000m thermal profiles in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Source: INCOIS Live Data Gateway • ISRO MOSDAC • Copernicus Marine Service
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all active:scale-[0.99]"
          >
            Return to 3D Globe
          </button>
        </div>
      </div>
    </div>
  );
};

