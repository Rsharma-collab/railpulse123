import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sparkles,
  MapPin,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const HistoricalIntelligenceView: React.FC = () => {
  const { historical, selectedTrain, setActiveTab } = useRailway();
  const [selectedSection, setSelectedSection] = useState('Bhopal → Itarsi → Nagpur');
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('90d');

  const sections = [
    'Bhopal → Itarsi → Nagpur',
    'Itarsi → Betul → Nagpur',
    'Nagpur → Badnera → Bhusaval',
    'Bhusaval → Manmad → Mumbai Central'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider font-mono">
              Empirical Route Pattern Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Historical Route Delay Intelligence</h2>
          <p className="text-xs text-neutral-400">
            90-day statistical corridor models, punctuality distribution, and bottleneck recognition
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range toggle */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
            <button
              onClick={() => setSelectedRange('7d')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedRange === '7d' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedRange('30d')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedRange === '30d' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedRange('90d')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedRange === '90d' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              90 Days
            </button>
          </div>

          <button
            onClick={() => setActiveTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ETA Engine Correlation →</span>
          </button>
        </div>
      </div>

      {/* Corridor Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
        <span className="text-neutral-400 flex items-center gap-1 font-medium mr-1">
          <Filter className="h-3.5 w-3.5" /> Corridor Sector:
        </span>
        {sections.map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              selectedSection === sec
                ? 'border-purple-500/40 bg-purple-500/10 text-purple-300 font-semibold'
                : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Historical Pattern Detected Callout */}
      <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-neutral-900 to-neutral-900 text-xs text-neutral-200">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="text-white text-sm font-semibold">Corridor Pattern Detected</strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Pattern Recurrence 68%
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              {historical.patternInsight}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-neutral-400">
              <span>Risk Window: <strong className="text-amber-400 font-mono">{historical.highDelayWindow}</strong></span>
              <span>·</span>
              <span>Typical Downstream Recovery: <strong className="text-emerald-400 font-mono">{historical.typicalRecoveryMin} min</strong></span>
              <span>·</span>
              <span>Propagated to Dynamic ETA: <strong className="text-white font-mono">+3 min</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <span className="text-neutral-400 text-[11px] font-medium uppercase block mb-1">Average Delay</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{historical.avgDelayMin}</span>
            <span className="text-xs text-neutral-400">min</span>
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">Based on 184 trips</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <span className="text-neutral-400 text-[11px] font-medium uppercase block mb-1">Median Delay</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{historical.medianDelayMin}</span>
            <span className="text-xs text-neutral-400">min</span>
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">50th percentile run</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <span className="text-neutral-400 text-[11px] font-medium uppercase block mb-1">Delay Recurrence</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-purple-400 tabular-nums">{historical.delayFrequencyPct}%</span>
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">Frequency {'>'} 5 min</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
          <span className="text-neutral-400 text-[11px] font-medium uppercase block mb-1">Typical Recovery</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">-{historical.typicalRecoveryMin}</span>
            <span className="text-xs text-neutral-400">min</span>
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">Speed-up downstream</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 col-span-2 lg:col-span-1">
          <span className="text-neutral-400 text-[11px] font-medium uppercase block mb-1">Corridor Risk</span>
          <div className="text-sm font-bold text-amber-400 font-mono mt-1">
            {historical.seasonalRisk} RISK
          </div>
          <span className="text-[11px] text-neutral-500 block mt-1">Evening freight density</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Delay Distribution Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Hourly Delay Distribution (Itarsi Corridor)</h3>
              <p className="text-xs text-neutral-500">Average delay minutes by arrival hour across 90 days</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              Peak: 18:00 (17m avg)
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <svg viewBox="0 0 650 200" className="w-full h-auto select-none">
              {/* Y-axis guide lines */}
              <g stroke="#262626" strokeWidth="1" strokeDasharray="3 3">
                <line x1="40" y1="20" x2="630" y2="20" />
                <line x1="40" y1="65" x2="630" y2="65" />
                <line x1="40" y1="110" x2="630" y2="110" />
                <line x1="40" y1="155" x2="630" y2="155" />
              </g>

              {/* Y-axis text */}
              <text x="30" y="24" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">20m</text>
              <text x="30" y="69" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">15m</text>
              <text x="30" y="114" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">10m</text>
              <text x="30" y="159" fill="#737373" fontSize="10" textAnchor="end" fontFamily="monospace">5m</text>

              {/* Bars for hourly trends */}
              {historical.hourlyTrends.map((trend, idx) => {
                const x = 60 + idx * 62;
                const barHeight = (trend.avgDelay / 20) * 135;
                const y = 160 - barHeight;
                const isPeak = trend.avgDelay >= 15;
                return (
                  <g key={trend.hour} className="group cursor-pointer">
                    <rect
                      x={x}
                      y={y}
                      width="38"
                      height={barHeight}
                      rx="4"
                      fill={isPeak ? '#f59e0b' : '#8b5cf6'}
                      opacity={isPeak ? 0.9 : 0.75}
                      className="transition-all hover:opacity-100"
                    />
                    <text
                      x={x + 19}
                      y={y - 6}
                      fill={isPeak ? '#fbbf24' : '#c4b5fd'}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      +{trend.avgDelay}m
                    </text>
                    <text
                      x={x + 19}
                      y="180"
                      fill="#a3a3a3"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {trend.hour}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Primary Root Causes Breakdown */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Historical Root Cause Attribution</h3>
            <p className="text-xs text-neutral-500">Categorical share of delay minutes</p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Signal Holds & Precedences</span>
                <span className="font-mono font-bold text-amber-400">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Freight Crossing Contention</span>
                <span className="font-mono font-bold text-purple-400">30%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Caution Orders & Speed Restrictions</span>
                <span className="font-mono font-bold text-blue-400">15%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Platform Turnaround & Dwell Spills</span>
                <span className="font-mono font-bold text-emerald-400">10%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '10%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            Historical models feed the RailPulse ETA engine with a dynamic +3m weighted prior during peak windows.
          </div>
        </div>
      </div>
    </div>
  );
};
