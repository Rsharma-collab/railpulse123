import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Activity,
  AlertTriangle,
  Radio,
  Share2,
  Train as TrainIcon,
  ShieldAlert,
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { Signal, BlockSection, Junction } from '../../types/railway';

export const NetworkIntelligenceView: React.FC = () => {
  const { signals, blocks, junctions, selectedTrain, prediction, setActiveTab } = useRailway();
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(signals[1]);
  const [selectedBlock, setSelectedBlock] = useState<BlockSection | null>(blocks[2]);
  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(junctions[0]);

  // Overall congestion rating
  const overallCongestion = junctions.some(j => j.congestionLevel === 'CRITICAL')
    ? 'CRITICAL'
    : junctions.some(j => j.congestionLevel === 'HIGH')
    ? 'HIGH'
    : 'MODERATE';

  const getSignalColor = (aspect: Signal['aspect']) => {
    switch (aspect) {
      case 'GREEN':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'YELLOW':
      case 'DOUBLE_YELLOW':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'RED':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-neutral-400 bg-neutral-800';
    }
  };

  const getCongestionBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MODERATE':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-neutral-400 bg-neutral-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">
              Interlocking & Signaling Core
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Signal & Network Congestion Intelligence</h2>
          <p className="text-xs text-neutral-400">
            Real-time block section occupancy, junction diamond switch slots, and signal aspect state
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono ${getCongestionBadge(overallCongestion)}`}>
            Network Status: {overallCongestion} CONGESTION
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>View ETA Impact →</span>
          </button>
        </div>
      </div>

      {/* "Why is this train delayed?" High-Priority Intelligence Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                Why is Train {selectedTrain.number} Delayed?
              </h3>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-normal">
              Train {selectedTrain.number} ({selectedTrain.name}) is approaching <strong className="text-white">Junction J12 (Itarsi North Throat)</strong>. Two rakes (freight container <span className="font-mono text-amber-400">01215</span> and <span className="font-mono text-amber-400">Samta Express</span>) currently occupy track sections across <span className="font-mono text-white">Dewas Area, Indore Area & Bhopal Area</span>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
              <span>Expected crossing clearance: <strong className="text-amber-400 font-mono">+6 to +9 minutes</strong></span>
              <span>·</span>
              <span>Signal S16 active aspect: <strong className="text-amber-300">Caution (Yellow)</strong></span>
              <span>·</span>
              <span>Propagated to ETA engine: <strong className="text-white">+8 min buffer</strong></span>
            </div>
          </div>

          <div className="shrink-0 self-stretch md:self-auto flex flex-col justify-center">
            <button
              onClick={() => setActiveTab('prediction')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explainable ETA Breakdown</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Network Interlocking Schematic (SVG Graphic) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Junction J12 & Station Approach Interlocking Track Plan</h3>
            <p className="text-xs text-neutral-500">Click on any Signal, Route Location, or Junction switch to inspect live telemetry</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-neutral-400">Clear</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-neutral-400">Caution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-neutral-400">Occupied / Stop</span>
            </div>
          </div>
        </div>

        {/* SVG Schematic */}
        <div className="w-full overflow-x-auto py-3">
          <div className="min-w-[840px]">
            <svg viewBox="0 0 900 220" className="w-full h-auto select-none">
              {/* Background Tracks */}
              {/* Down Main (Track 1) */}
              <line x1="40" y1="80" x2="860" y2="80" stroke="#374151" strokeWidth="4" />
              {/* Up Main (Track 2) */}
              <line x1="40" y1="140" x2="860" y2="140" stroke="#374151" strokeWidth="4" />

              {/* Loop Track to Platform 2 */}
              <path d="M 380 80 Q 430 110, 480 110 L 700 110 Q 750 110, 800 80" fill="none" stroke="#4b5563" strokeWidth="3" strokeDasharray="3 3" />
              {/* Diamond Switch crossover at Junction J12 */}
              <line x1="420" y1="80" x2="520" y2="140" stroke="#eab308" strokeWidth="3" />
              <line x1="420" y1="140" x2="520" y2="80" stroke="#eab308" strokeWidth="3" />

              {/* Block Sections Overlay Bands */}
              {/* Block Dewas Area */}
              <rect
                x="60"
                y="65"
                width="150"
                height="30"
                rx="4"
                fill="#10b981"
                fillOpacity="0.12"
                stroke="#10b981"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-opacity-25 transition-all"
                onClick={() => setSelectedBlock(blocks[0])}
              />
              <text x="135" y="84" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Dewas Area (Clear)
              </text>

              {/* Block Indore Area */}
              <rect
                x="240"
                y="65"
                width="160"
                height="30"
                rx="4"
                fill="#f59e0b"
                fillOpacity="0.15"
                stroke="#f59e0b"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-opacity-30 transition-all"
                onClick={() => setSelectedBlock(blocks[1])}
              />
              <text x="320" y="84" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Indore Area (Caution)
              </text>

              {/* Train Marker */}
              <g transform="translate(300, 80)">
                <circle r="8" fill="#10b981" />
                <rect x="-18" y="-18" width="36" height="12" rx="3" fill="#065f46" stroke="#10b981" strokeWidth="1" />
                <text x="0" y="-10" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {selectedTrain.number}
                </text>
              </g>

              {/* Block Bhopal Area (J12 Diamond Interlocking) */}
              <rect
                x="430"
                y="65"
                width="180"
                height="85"
                rx="6"
                fill="#ef4444"
                fillOpacity="0.12"
                stroke="#ef4444"
                strokeWidth="2"
                className="cursor-pointer hover:fill-opacity-25 transition-all"
                onClick={() => {
                  setSelectedBlock(blocks[2]);
                  setSelectedJunction(junctions[0]);
                }}
              />
              <text x="520" y="58" fill="#ef4444" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Bhopal Area (Freight Occupied)
              </text>

              {/* Freight Rake 01215 in Bhopal Area */}
              <g transform="translate(480, 80)">
                <rect x="-24" y="-8" width="48" height="16" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                <text x="0" y="3" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Freight 01215
                </text>
              </g>

              {/* Itarsi Area (Platform 2 Approach) */}
              <rect
                x="640"
                y="65"
                width="180"
                height="30"
                rx="4"
                fill="#ef4444"
                fillOpacity="0.12"
                stroke="#ef4444"
                strokeWidth="1.5"
                className="cursor-pointer hover:fill-opacity-25 transition-all"
                onClick={() => setSelectedBlock(blocks[3])}
              />
              <text x="730" y="84" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Itarsi Area: Pf 2 (Samta Exp)
              </text>

              {/* Platform 2 Label */}
              <rect x="680" y="102" width="160" height="18" rx="3" fill="#1f2937" stroke="#4b5563" strokeWidth="1" />
              <text x="760" y="115" fill="#e5e7eb" fontSize="10" fontWeight="bold" textAnchor="middle">
                Platform 2 (Itarsi Jn)
              </text>

              {/* Interactive Signals */}
              {/* Signal S14 */}
              <g
                transform="translate(190, 48)"
                className="cursor-pointer group"
                onClick={() => setSelectedSignal(signals[0])}
              >
                <line x1="0" y1="0" x2="0" y2="32" stroke="#9ca3af" strokeWidth="2" />
                <circle r="7" fill="#10b981" />
                <text x="0" y="-10" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  S14 (G)
                </text>
              </g>

              {/* Signal S16 */}
              <g
                transform="translate(390, 48)"
                className="cursor-pointer group"
                onClick={() => setSelectedSignal(signals[1])}
              >
                <line x1="0" y1="0" x2="0" y2="32" stroke="#9ca3af" strokeWidth="2" />
                <circle r="7" fill="#f59e0b" />
                <text x="0" y="-10" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  S16 (Y)
                </text>
              </g>

              {/* Signal S18 */}
              <g
                transform="translate(615, 48)"
                className="cursor-pointer group"
                onClick={() => setSelectedSignal(signals[2])}
              >
                <line x1="0" y1="0" x2="0" y2="32" stroke="#9ca3af" strokeWidth="2" />
                <circle r="7" fill="#f59e0b" />
                <text x="0" y="-10" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  S18 (Y)
                </text>
              </g>

              {/* Signal S20 (Red Starter) */}
              <g
                transform="translate(820, 48)"
                className="cursor-pointer group"
                onClick={() => setSelectedSignal(signals[3])}
              >
                <line x1="0" y1="0" x2="0" y2="32" stroke="#9ca3af" strokeWidth="2" />
                <circle r="7" fill="#ef4444" />
                <text x="0" y="-10" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  S20 (R)
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Detail Inspector Columns: Signals, Blocks, Junctions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal Inspector */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Active Signal Telemetry</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{signals.length} Signals Tracked</span>
          </div>

          <div className="space-y-2">
            {signals.map(sig => {
              const isSelected = selectedSignal?.id === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-neutral-800/80'
                      : 'border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold font-mono text-white">{sig.code} · {sig.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getSignalColor(sig.aspect)}`}>
                      {sig.aspect}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Speed limit: <strong className="text-neutral-200">{sig.speedLimitKmph} km/h</strong></span>
                    <span>Distance: {sig.distanceM}m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedSignal && (
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1 mt-3">
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Selected Signal Inspector</span>
              <p className="font-semibold text-white">{selectedSignal.code} — {selectedSignal.name}</p>
              <p className="text-neutral-400 text-[11px]">Location: {selectedSignal.location} · Type: {selectedSignal.type}</p>
            </div>
          )}
        </div>

        {/* Route Locations & Native Places Inspector */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">Route Locations & Areas</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{blocks.length} Locations</span>
          </div>

          <div className="space-y-2">
            {blocks.map(blk => {
              const isSelected = selectedBlock?.id === blk.id;
              return (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlock(blk)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500/50 bg-neutral-800/80'
                      : 'border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{blk.name || blk.code} ({blk.lengthKm} km)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getCongestionBadge(blk.congestionLevel)}`}>
                      {blk.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {blk.occupiedByTrain ? `Occupant: ${blk.occupiedByTrain}` : `Clear for ${blk.maxPermissibleSpeedKmph} km/h`}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedBlock && (
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1 mt-3">
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Selected Location Inspector</span>
              <p className="font-semibold text-white">{selectedBlock.name || selectedBlock.code}</p>
              <p className="text-neutral-400 text-[11px]">
                Location: {selectedBlock.areaName || selectedBlock.code} · Congestion: {selectedBlock.congestionLevel} · Speed: {selectedBlock.maxPermissibleSpeedKmph} km/h
              </p>
            </div>
          )}
        </div>

        {/* Junction & Interlocking Inspector */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Junction Congestion</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{junctions.length} Junctions</span>
          </div>

          <div className="space-y-2">
            {junctions.map(junc => {
              const isSelected = selectedJunction?.id === junc.id;
              return (
                <div
                  key={junc.id}
                  onClick={() => setSelectedJunction(junc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500/50 bg-neutral-800/80'
                      : 'border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{junc.code} · {junc.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getCongestionBadge(junc.congestionLevel)}`}>
                      {junc.congestionLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Active queued trains: <strong className="text-neutral-200">{junc.queuedTrains.length}</strong> · Crossing delay: {junc.estimatedCrossingDelayMin > 0 ? `+${junc.estimatedCrossingDelayMin}m` : '0m'}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedJunction && (
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1.5 mt-3">
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Junction Contention Details</span>
              <p className="font-semibold text-white">{selectedJunction.name}</p>
              {selectedJunction.conflictDetected && (
                <p className="text-amber-400 text-[11px] leading-relaxed">
                  ⚠️ {selectedJunction.conflictSummary}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
