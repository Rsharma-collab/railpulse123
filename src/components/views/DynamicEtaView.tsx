import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Activity,
  UserCheck,
  BarChart3,
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';

export const DynamicEtaView: React.FC = () => {
  const {
    selectedTrain,
    prediction,
    gps,
    setActiveTab,
    simStep,
    isSimulating
  } = useRailway();

  const [expandedFactor, setExpandedFactor] = useState<number | null>(null);

  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1];

  const toggleFactor = (idx: number) => {
    setExpandedFactor(expandedFactor === idx ? null : idx);
  };

  const getFactorIcon = (category: string) => {
    switch (category) {
      case 'network':
        return <Activity className="h-4 w-4 text-amber-400" />;
      case 'crew_rake':
        return <UserCheck className="h-4 w-4 text-blue-400" />;
      case 'historical':
        return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case 'recovery':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Deterministic Multi-Factor Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Explainable AI & Dynamic ETA Prediction</h2>
          <p className="text-xs text-neutral-400">
            Real-time synthesis of kinematics, signal queues, rolling stock servicing, and empirical models
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold font-mono text-emerald-400">
            Prediction Health: {prediction.predictionHealth} ({prediction.confidencePct}% Confidence)
          </div>
          <button
            onClick={() => setActiveTab('simulation')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            <Sliders className="h-3.5 w-3.5 text-neutral-400" />
            <span>Tune in Simulation →</span>
          </button>
        </div>
      </div>

      {/* Primary ETA Scorecard */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
          {/* Scheduled */}
          <div className="space-y-1">
            <span className="text-neutral-400 text-xs uppercase font-mono block">Timetable Scheduled</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {prediction.scheduledArrival}
              </span>
            </div>
            <span className="text-xs text-neutral-500 block">Station: {currentStop.name} ({currentStop.code})</span>
          </div>

          {/* Current Observed ETA */}
          <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
            <span className="text-neutral-400 text-xs uppercase font-mono block">Current Observed ETA</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-300 tabular-nums">
                {prediction.currentETA}
              </span>
            </div>
            <span className="text-xs text-amber-400 font-mono block">+{currentStop.delayArrMin} min observed</span>
          </div>

          {/* Dynamic Predicted ETA */}
          <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6 col-span-2 lg:col-span-1">
            <span className="text-emerald-400 text-xs uppercase font-mono font-bold block flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Predicted Dynamic ETA
            </span>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                {prediction.predictedETA}
              </span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {prediction.netDelayDeltaMin >= 0 ? `+${prediction.netDelayDeltaMin}` : prediction.netDelayDeltaMin}m net
              </span>
            </div>
            <span className="text-xs text-neutral-400 block">Includes junction & rake impact</span>
          </div>

          {/* Confidence Score */}
          <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
            <span className="text-neutral-400 text-xs uppercase font-mono block">Prediction Confidence</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {prediction.confidencePct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-neutral-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${prediction.confidencePct}%` }}
              />
            </div>
          </div>

          {/* Delay Probability */}
          <div className="space-y-1 pt-4 lg:pt-0 lg:pl-6">
            <span className="text-neutral-400 text-xs uppercase font-mono block">Delay Risk Probability</span>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
                {prediction.delayProbabilityPct}%
              </span>
            </div>
            <span className="text-xs text-neutral-400 block">Downstream saturation risk</span>
          </div>
        </div>
      </div>

      {/* Visual Prediction Timeline */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Visual Arrival Variance Comparison</h3>
        <p className="text-xs text-neutral-500">Timeline delta between Scheduled, Current Kinematics, and RailPulse Dynamic Model</p>

        <div className="pt-4 pb-2">
          <div className="relative h-12 w-full flex items-center">
            {/* Timeline base track */}
            <div className="absolute left-0 right-0 h-1.5 bg-neutral-800 rounded-full" />

            {/* Scheduled Marker */}
            <div className="absolute left-[10%] -translate-x-1/2 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full border-2 border-neutral-400 bg-neutral-900" />
              <span className="text-[11px] font-mono text-neutral-400 mt-1">{prediction.scheduledArrival}</span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500">Scheduled</span>
            </div>

            {/* Current Kinematic Observed Marker */}
            <div className="absolute left-[45%] -translate-x-1/2 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full border-2 border-amber-400 bg-neutral-900" />
              <span className="text-[11px] font-mono text-amber-400 font-semibold mt-1">{prediction.currentETA}</span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400">Observed</span>
            </div>

            {/* RailPulse Dynamic ETA Marker */}
            <div className="absolute left-[80%] -translate-x-1/2 flex flex-col items-center">
              <div className="h-5 w-5 rounded-full border-2 border-emerald-400 bg-emerald-500/30 flex items-center justify-center animate-pulse">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold mt-1">{prediction.predictedETA}</span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Saarthi AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: "WHY THIS ETA?" EXPLAINABLE WATERFALL FACTOR BREAKDOWN */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Why This ETA?</span>
              <span className="text-xs font-normal text-neutral-400">
                (Explainable Deterministic Factor Waterfall)
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Every single minute added or recovered is mathematically justified by empirical and sensor inputs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">
              Net Impact: <strong className="text-white">+{prediction.netDelayDeltaMin} min</strong>
            </span>
          </div>
        </div>

        {/* Factors Waterfall List */}
        <div className="space-y-3">
          {prediction.factors.map((factor, idx) => {
            const isExpanded = expandedFactor === idx;
            const isPositive = factor.impactMin > 0;
            const isNegative = factor.impactMin < 0;

            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800/90 bg-neutral-950/60 transition-all hover:border-neutral-700 overflow-hidden"
              >
                <div
                  onClick={() => toggleFactor(idx)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                      {getFactorIcon(factor.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{factor.factor}</h4>
                      <span className="text-[11px] text-neutral-500 capitalize">Category: {factor.category.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-mono font-bold px-2.5 py-1 rounded-md border ${
                        isPositive
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : isNegative
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-neutral-400 bg-neutral-900 border-neutral-800'
                      }`}
                    >
                      {isPositive ? `+${factor.impactMin} min` : `${factor.impactMin} min`}
                    </span>
                    <button className="text-neutral-500 hover:text-white">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-neutral-900 text-xs text-neutral-300 leading-relaxed bg-neutral-900/30">
                    <p className="mb-2">{factor.explanation}</p>
                    <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono">
                      <span>Telemetry source: Sensor Feed & Interlocking</span>
                      <span>·</span>
                      <span>Weight in dynamic prior: High</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Explainability Summary Box */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400">
            <strong className="text-white block mb-0.5">Transparent Intelligence:</strong>
            RailPulse provides white-box predictions. As soon as Signal S16 clears or train achieves MPS on the Betul stretch, the dynamic recovery factor automatically reclaims lost minutes.
          </div>
          <button
            onClick={() => setActiveTab('connection')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold transition-colors"
          >
            <span>Check Connection Protection</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
