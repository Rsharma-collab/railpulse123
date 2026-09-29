import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Train as TrainIcon,
  Activity,
  Radio,
  Share2,
  Eye,
  Info,
  Sliders,
  Sparkles,
  MapPin
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const { selectedTrain, gps, signals, blocks, junctions, prediction, setActiveTab } = useRailway();

  // Layer toggles
  const [layers, setLayers] = useState({
    live: true,
    prediction: true,
    congestion: true,
    signals: true,
    junctions: true
  });

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'train' | 'station' | 'signal' | 'junction';
    title: string;
    details: string;
  } | null>({
    type: 'train',
    title: `Train ${selectedTrain.number} (${selectedTrain.name})`,
    details: `Speed: ${gps.speedKmph} km/h · Heading: ${gps.headingDeg}° SSE · Status: Approach corridor`
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Spatial Digital Twin & Simulation
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Digital Twin Railway Network Simulation</h2>
          <p className="text-xs text-neutral-400">
            Real-time track infrastructure topology, block occupancy, signal aspects, and kinematic ghost paths
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <button
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.2))}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-neutral-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.max(0.6, prev - 0.2))}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 rounded hover:bg-neutral-800 hover:text-white ml-1 border-l border-neutral-800"
              title="Reset Viewport"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('simulation')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Interactive Simulator</span>
          </button>
        </div>
      </div>

      {/* Layer Visibility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 font-medium mr-1 flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> Layers:
          </span>

          <button
            onClick={() => toggleLayer('live')}
            className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
              layers.live
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-500 hover:text-white'
            }`}
          >
            ● Live Trains
          </button>

          <button
            onClick={() => toggleLayer('prediction')}
            className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
              layers.prediction
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-400 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-500 hover:text-white'
            }`}
          >
            ● Predicted Path (+15m)
          </button>

          <button
            onClick={() => toggleLayer('congestion')}
            className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
              layers.congestion
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-500 hover:text-white'
            }`}
          >
            ● Congestion Zones
          </button>

          <button
            onClick={() => toggleLayer('signals')}
            className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
              layers.signals
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-400 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-500 hover:text-white'
            }`}
          >
            ● Signal Aspects
          </button>

          <button
            onClick={() => toggleLayer('junctions')}
            className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
              layers.junctions
                ? 'border-teal-500/40 bg-teal-500/10 text-teal-400 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-500 hover:text-white'
            }`}
          >
            ● Interlocking Junctions
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono hidden md:block">
          Interactive Schematic Map · Double-track Corridor
        </div>
      </div>

      {/* Main Canvas SVG Digital Twin Viewport */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-6 overflow-hidden min-h-[480px]">
        {/* Interactive SVG Canvas */}
        <div className="w-full overflow-x-auto">
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center center'
            }}
            className="min-w-[1000px] transition-transform duration-200"
          >
            <svg viewBox="0 0 1100 420" className="w-full h-auto select-none">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#18181b" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="35%" stopColor="#10b981" />
                  <stop offset="48%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="1100" height="420" fill="url(#grid-pattern)" />

              {/* Congestion Heat Zones Layer */}
              {layers.congestion && (
                <g>
                  {/* High Congestion Zone near Junction J12 */}
                  <rect
                    x="420"
                    y="110"
                    width="220"
                    height="170"
                    rx="12"
                    fill="#ef4444"
                    fillOpacity="0.08"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="430" y="130" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    HIGH CONGESTION ZONE (J12)
                  </text>
                  <text x="430" y="145" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">
                    Freight 01215 + Samta Exp Interlocking Contention
                  </text>
                </g>
              )}

              {/* Main Railway Tracks */}
              {/* Down Main line */}
              <path
                d="M 60 200 L 320 200 Q 420 180, 520 200 L 760 200 Q 860 220, 1040 200"
                fill="none"
                stroke="url(#corridor-gradient)"
                strokeWidth="5"
              />
              {/* Up Main line */}
              <path
                d="M 60 225 L 320 225 Q 420 205, 520 225 L 760 225 Q 860 245, 1040 225"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="3.5"
                strokeDasharray="8 4"
              />
              {/* Loop track to Platform 2 & Yard */}
              <path
                d="M 460 200 C 500 150, 580 150, 620 200"
                fill="none"
                stroke="#52525b"
                strokeWidth="3"
                strokeDasharray="5 3"
              />
              {/* Goods siding loop */}
              <path
                d="M 520 225 C 560 280, 680 280, 720 225"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Junction Diamond Crossings */}
              {layers.junctions && (
                <g>
                  {/* J12 North Cabin Cross */}
                  <g
                    transform="translate(480, 212)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'junction',
                        title: 'Junction J12 (Itarsi North Cabin)',
                        details: '6 Tracks · 4 Active Routes · Diamond Switch 14A holds freight crossing. Delay: +8m.'
                      })
                    }
                  >
                    <circle r="16" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="-10" y1="10" x2="10" y2="-10" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="0" y="-22" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      J12 (High Load)
                    </text>
                  </g>

                  {/* J14 South Bye-Pass Cabin */}
                  <g
                    transform="translate(740, 212)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'junction',
                        title: 'Junction J14 (Itarsi South Bye-pass Cabin)',
                        details: '4 Tracks · 2 Active Routes · Moderate traffic · Clearance buffer: +3m.'
                      })
                    }
                  >
                    <circle r="14" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="0" y="-20" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      J14 (Nominal)
                    </text>
                  </g>
                </g>
              )}

              {/* Signals Layer */}
              {layers.signals && (
                <g>
                  {/* S14 Green */}
                  <g
                    transform="translate(240, 175)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'signal',
                        title: 'Signal S14 (Dewas / Outer Corridor)',
                        details: 'Aspect: GREEN · Speed limit: 110 km/h · Dewas Area Clear.'
                      })
                    }
                  >
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#71717a" strokeWidth="2" />
                    <circle r="6" fill="#10b981" />
                    <text x="0" y="-10" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      S14 (G)
                    </text>
                  </g>

                  {/* S16 Caution Yellow */}
                  <g
                    transform="translate(420, 175)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'signal',
                        title: 'Signal S16 (Junction Approach)',
                        details: 'Aspect: YELLOW (Caution) · Speed throttled to 60 km/h · Next signal at 1100m.'
                      })
                    }
                  >
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#71717a" strokeWidth="2" />
                    <circle r="6" fill="#f59e0b" />
                    <text x="0" y="-10" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      S16 (Y)
                    </text>
                  </g>

                  {/* S18 Yellow Home */}
                  <g
                    transform="translate(560, 175)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'signal',
                        title: 'Signal S18 (J12 Station Home)',
                        details: 'Aspect: YELLOW · Permissible speed: 30 km/h · Routing to Platform 2.'
                      })
                    }
                  >
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#71717a" strokeWidth="2" />
                    <circle r="6" fill="#f59e0b" />
                    <text x="0" y="-10" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      S18 (Y)
                    </text>
                  </g>

                  {/* S20 Red Platform Starter */}
                  <g
                    transform="translate(680, 175)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'signal',
                        title: 'Signal S20 (Platform 2 Starter)',
                        details: 'Aspect: RED (Stop) · Platform dwell countdown active.'
                      })
                    }
                  >
                    <line x1="0" y1="0" x2="0" y2="25" stroke="#71717a" strokeWidth="2" />
                    <circle r="6" fill="#ef4444" />
                    <text x="0" y="-10" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      S20 (R)
                    </text>
                  </g>
                </g>
              )}

              {/* Station Markers */}
              {/* Bhopal */}
              <g
                transform="translate(100, 200)"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedEntity({
                    type: 'station',
                    title: 'Bhopal Junction (BPL)',
                    details: 'Km 0.0 · Train 12951 departed at 13:59 (+4m).'
                  })
                }
              >
                <circle r="8" fill="#10b981" />
                <text x="0" y="-16" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Bhopal (BPL)
                </text>
                <text x="0" y="22" fill="#a1a1aa" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  Passed
                </text>
              </g>

              {/* Itarsi */}
              <g
                transform="translate(600, 200)"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedEntity({
                    type: 'station',
                    title: 'Itarsi Junction (ET)',
                    details: 'Km 92.0 · Platform 2 Allocated · Predicted Arr 15:36 · Coach B4 near FOB 2.'
                  })
                }
              >
                <circle r="10" fill="#f59e0b" />
                <circle r="18" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <text x="0" y="-26" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Itarsi Jn (ET)
                </text>
                <text x="0" y="24" fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  Platform 2 (Approach)
                </text>
              </g>

              {/* Betul */}
              <g
                transform="translate(950, 200)"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedEntity({
                    type: 'station',
                    title: 'Betul (BZU)',
                    details: 'Km 199.0 · Upcoming · Predicted Arr 17:18 · Downstream recovery expected.'
                  })
                }
              >
                <circle r="8" fill="#8b5cf6" />
                <text x="0" y="-16" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Betul (BZU)
                </text>
                <text x="0" y="22" fill="#a1a1aa" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  17:18 ETA
                </text>
              </g>

              {/* PREDICTED KINEMATIC FUTURE TRAIN POSITION (GHOST PATH) */}
              {layers.prediction && (
                <g>
                  {/* Dotted future path line from train to +15 min position */}
                  <path
                    d="M 370 200 Q 420 180, 520 200 L 590 200"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                  {/* Predicted Ghost Train Marker at Itarsi dock */}
                  <g transform="translate(590, 196)" opacity="0.85">
                    <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#581c87" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
                    <polygon points="14,-6 20,0 14,6" fill="#c084fc" />
                    <text x="0" y="-14" fill="#c084fc" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      ETA +15m: 15:36 (Docked)
                    </text>
                  </g>
                </g>
              )}

              {/* LIVE MOVING TRAINS LAYER */}
              {layers.live && (
                <g>
                  {/* Train 12951 Live Position (near Itarsi North approach Km 91.2) */}
                  <g
                    transform="translate(370, 200)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'train',
                        title: '12951 Mumbai Rajdhani Express',
                        details: `Speed: ${gps.speedKmph} km/h · Heading: ${gps.headingDeg}° · Section: Itarsi North Outer · Predicted Arr: ${prediction.predictedETA}`
                      })
                    }
                  >
                    {/* Radar ping ring */}
                    <circle r="22" fill="#10b981" opacity="0.15">
                      <animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <rect x="-18" y="-9" width="36" height="18" rx="4" fill="#047857" stroke="#10b981" strokeWidth="2" />
                    <polygon points="18,-7 26,0 18,7" fill="#10b981" />
                    <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      12951
                    </text>
                    <text x="0" y="-18" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      {gps.speedKmph} km/h
                    </text>
                  </g>

                  {/* Ambient Queued Freight Train 01215 in Block B24 */}
                  <g
                    transform="translate(520, 200)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'train',
                        title: 'Freight Container Rake 01215',
                        details: 'Occupying Bhopal Area · Speed: 18 km/h · Clearing crossover switch 14A.'
                      })
                    }
                  >
                    <rect x="-24" y="-8" width="48" height="16" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="0" y="3" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      01215 Goods
                    </text>
                  </g>

                  {/* Samta Express 12808 at Platform 2 */}
                  <g
                    transform="translate(620, 160)"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedEntity({
                        type: 'train',
                        title: '12808 Samta Express (Platform 2)',
                        details: 'Dwell underway · Scheduled departure 15:32 · Clearing loop line in 3 minutes.'
                      })
                    }
                  >
                    <rect x="-22" y="-7" width="44" height="14" rx="3" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="0" y="3" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      12808 Samta
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Selected Entity Inspector Float Card */}
        {selectedEntity && (
          <div className="mt-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase">
                  {selectedEntity.type}
                </span>
                <strong className="text-white text-sm">{selectedEntity.title}</strong>
              </div>
              <p className="text-neutral-400 text-xs">{selectedEntity.details}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('network')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
              >
                Network Details
              </button>
              <button
                onClick={() => setActiveTab('prediction')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                Check ETA Impact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
