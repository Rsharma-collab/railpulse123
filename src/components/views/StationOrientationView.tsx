import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  MapPin,
  Compass,
  Footprints,
  Coffee,
  HelpCircle,
  Accessibility,
  ArrowRight,
  Info,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export const StationOrientationView: React.FC = () => {
  const { selectedTrain, setActiveTab } = useRailway();
  const [selectedPlatform, setSelectedPlatform] = useState<number>(2);
  const [selectedCoach, setSelectedCoach] = useState<string>('B4');
  const [targetFacility, setTargetFacility] = useState<string>('fob-2');
  const [isGuideModeActive, setIsGuideModeActive] = useState<boolean>(true);

  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1];

  const coaches = ['EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'A1', 'A2', 'A3', 'H1', 'PC', 'B7', 'B8', 'EOG'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-teal-400" />
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider font-mono">
              Spatial Concourse & Platform Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Station Orientation & Platform Pathfinder</h2>
          <p className="text-xs text-neutral-400">
            {currentStop.name} ({currentStop.code}) · Platform {selectedPlatform} Arrival Alignment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuideModeActive(!isGuideModeActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isGuideModeActive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <Footprints className="h-3.5 w-3.5" />
            <span>{isGuideModeActive ? 'Guide Me: Active' : 'Guide Me: Off'}</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            <span>Station Amenities →</span>
          </button>
        </div>
      </div>

      {/* Primary Orientation Summary Card */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-neutral-400 text-xs uppercase font-mono block">Allocated Platform</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-bold font-mono text-white">Platform {selectedPlatform}</span>
            </div>
            <span className="text-xs text-emerald-400 font-medium block mt-1">Confirmed by Interlocking S18</span>
          </div>

          <div>
            <span className="text-neutral-400 text-xs uppercase font-mono block">Your Coach & Position</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-bold font-mono text-emerald-400">{selectedCoach}</span>
              <span className="text-xs text-neutral-400 ml-1">Middle Rake</span>
            </div>
            <span className="text-xs text-neutral-300 block mt-1">Directly aligns with FOB 2 Staircase</span>
          </div>

          <div>
            <span className="text-neutral-400 text-xs uppercase font-mono block">Nearest Concourse Exit</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-bold font-mono text-white">Gate B (North)</span>
            </div>
            <span className="text-xs text-neutral-400 block mt-1">Circulating Area & Prepaid Taxi</span>
          </div>

          <div>
            <span className="text-neutral-400 text-xs uppercase font-mono block">Estimated Walk to Exit</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-bold font-mono text-teal-400">3 min</span>
            </div>
            <span className="text-xs text-neutral-400 block mt-1">Ramp & Lift 2 Available</span>
          </div>
        </div>
      </div>

      {/* Coach Position Selector Strip */}
      <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold text-white">Train 12951 Rake Composition & Coach Alignment:</span>
          <span>Engine direction → Southbound</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {coaches.map((c, i) => {
            const isSelected = selectedCoach === c;
            const isMyCoach = c === 'B4';
            return (
              <button
                key={`${c}-${i}`}
                onClick={() => setSelectedCoach(c)}
                className={`shrink-0 px-3 py-2 rounded-lg border font-mono text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm ring-2 ring-emerald-500/30'
                    : isMyCoach
                    ? 'border-emerald-500/40 bg-neutral-900 text-emerald-400'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 2D SVG Station Concourse & Platform Map */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">{currentStop.name} — Platform 1 & 2 Spatial Layout</h3>
            <p className="text-xs text-neutral-500">
              Interactive 2D concourse plan with foot overbridges, elevators, and coach docking markers
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Guide Path Active
            </span>
          </div>
        </div>

        {/* SVG Floorplan Graphic */}
        <div className="w-full overflow-x-auto py-3">
          <div className="min-w-[850px]">
            <svg viewBox="0 0 900 360" className="w-full h-auto select-none">
              <defs>
                <linearGradient id="walkPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Station Building / Main Concourse */}
              <rect x="40" y="30" width="820" height="70" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="2" />
              <text x="60" y="55" fill="#e4e4e7" fontSize="12" fontWeight="bold">
                Main Concourse (Gate A & Gate B Entry)
              </text>
              <text x="60" y="75" fill="#71717a" fontSize="10">
                Ticketing Office · IRCTC Lounge · Cloak Room · Escalator to FOB 1 & FOB 2
              </text>

              {/* Platform 1 */}
              <rect x="40" y="125" width="820" height="35" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
              <text x="60" y="147" fill="#ffffff" fontSize="12" fontWeight="bold">
                Platform 1 (Main Concourse Island)
              </text>

              {/* Track Line 1 */}
              <line x1="40" y1="175" x2="860" y2="175" stroke="#374151" strokeWidth="3" />

              {/* Track Line 2 */}
              <line x1="40" y1="195" x2="860" y2="195" stroke="#374151" strokeWidth="3" />

              {/* Platform 2 (Island Platform for Train 12951) */}
              <rect
                x="40"
                y="215"
                width="820"
                height="45"
                rx="4"
                fill="#1e293b"
                stroke="#10b981"
                strokeWidth="2"
              />
              <text x="60" y="242" fill="#38bdf8" fontSize="13" fontWeight="bold">
                Platform 2 (Train 12951 Arrival Platform)
              </text>

              {/* Coach Alignment Markers on Platform 2 */}
              <g transform="translate(180, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">B1</text>
              </g>
              <g transform="translate(230, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">B2</text>
              </g>
              <g transform="translate(280, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">B3</text>
              </g>

              {/* Coach B4 (Active Selected Coach) */}
              <g transform="translate(330, 245)">
                <rect x="-22" y="-14" width="44" height="24" rx="4" fill="#047857" stroke="#10b981" strokeWidth="2" />
                <text x="0" y="2" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B4</text>
                {/* User indicator marker */}
                <circle cx="0" cy="-22" r="5" fill="#10b981" />
                <text x="0" y="-30" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">YOUR SEAT</text>
              </g>

              <g transform="translate(385, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">B5</text>
              </g>
              <g transform="translate(430, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">B6</text>
              </g>
              <g transform="translate(480, 245)">
                <rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="0" y="2" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">A1</text>
              </g>

              {/* Foot Over Bridge 2 (FOB 2) Spanning Across Platforms */}
              <rect x="310" y="45" width="40" height="235" rx="6" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" opacity="0.85" />
              <text x="330" y="170" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 330, 170)">
                Foot Over Bridge 2 (FOB 2)
              </text>

              {/* FOB 2 Staircase / Ramp directly adjacent to Coach B4 */}
              <rect x="315" y="218" width="30" height="40" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="330" y="238" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">RAMP</text>

              {/* Walking Pathfinder Guidance Dashed Line (from Coach B4 to Gate B) */}
              {isGuideModeActive && (
                <g>
                  <path
                    d="M 330 230 L 330 65 L 680 65"
                    fill="none"
                    stroke="url(#walkPathGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                  />
                  <circle cx="680" cy="65" r="7" fill="#38bdf8" />
                  <text x="680" y="50" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Gate B Exit
                  </text>
                </g>
              )}

              {/* Facilities Icons on Platform 2 */}
              {/* Restroom */}
              <g transform="translate(560, 235)" className="cursor-pointer" onClick={() => setTargetFacility('restroom')}>
                <circle r="10" fill="#3b82f6" />
                <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">WC</text>
                <text x="0" y="20" fill="#93c5fd" fontSize="8" textAnchor="middle">Restroom</text>
              </g>

              {/* Food Court */}
              <g transform="translate(630, 235)" className="cursor-pointer" onClick={() => setTargetFacility('food')}>
                <circle r="10" fill="#f59e0b" />
                <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">FD</text>
                <text x="0" y="20" fill="#fde68a" fontSize="8" textAnchor="middle">Comesum Food</text>
              </g>

              {/* Water Point */}
              <g transform="translate(230, 222)">
                <circle r="6" fill="#06b6d4" />
                <text x="0" y="16" fill="#a5f3fc" fontSize="8" textAnchor="middle">RO Water</text>
              </g>

              {/* Elevator / Lift on FOB 2 */}
              <g transform="translate(355, 138)">
                <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="1" />
                <text x="0" y="4" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">LFT</text>
                <text x="24" y="4" fill="#c4b5fd" fontSize="8">Lift 2</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Step-by-Step "Guide Me" Instructions */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
          <div className="flex items-center gap-2">
            <Footprints className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Step-by-Step Pathfinder Instructions
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <span className="text-emerald-400 font-bold block mb-1">Step 1: De-board at Coach B4</span>
              <p className="text-neutral-400">
                Doors open on the right side facing Platform 2. FOB 2 ramp is directly opposite door 2.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <span className="text-teal-400 font-bold block mb-1">Step 2: Take FOB 2 Ramp / Lift</span>
              <p className="text-neutral-400">
                Walk 8 meters directly up FOB 2 ramp. If carrying heavy baggage, Lift 2 is next to Pillar 11.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <span className="text-blue-400 font-bold block mb-1">Step 3: Exit via Gate B</span>
              <p className="text-neutral-400">
                Turn left on the overbridge towards Gate B North. Walk directly into the prepaid auto/taxi bay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
