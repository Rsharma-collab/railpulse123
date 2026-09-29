import React, { useState, useMemo } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { StationStop } from '../../types/railway';

export const JourneyTimelineView: React.FC = () => {
  const { selectedTrain, prediction, setActiveTab, jumpToStation } = useRailway();
  const [expandedStopCode, setExpandedStopCode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'major'>('all');

  const toggleStop = (code: string) => {
    setExpandedStopCode(expandedStopCode === code ? null : code);
  };

  const stops = useMemo(() => {
    if (filterType === 'major') {
      return selectedTrain.stops.filter(s => s.isJunction);
    }
    return selectedTrain.stops;
  }, [selectedTrain.stops, filterType]);

  const junctionsCount = useMemo(() => {
    return selectedTrain.stops.filter(s => s.isJunction).length;
  }, [selectedTrain.stops]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Temporal Milestone Progression
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Dynamic Journey Timeline</h2>
          <p className="text-xs text-neutral-400">
            {selectedTrain.number} {selectedTrain.name} · {selectedTrain.source} ({selectedTrain.sourceCode}) → {selectedTrain.destination} ({selectedTrain.destCode})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterType === 'all' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Stops ({selectedTrain.stops.length})
            </button>
            <button
              onClick={() => setFilterType('major')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterType === 'major' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Major Junctions ({junctionsCount})
            </button>
          </div>

          <button
            onClick={() => setActiveTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI ETA Breakdown →</span>
          </button>
        </div>
      </div>

      {/* Summary Milestone Ribbon */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-neutral-400 block text-[10px] uppercase font-mono">Total Route Distance</span>
            <span className="font-mono text-sm font-bold text-white">{selectedTrain.totalDistanceKm} km</span>
          </div>
          <div className="border-l border-neutral-800 pl-4">
            <span className="text-neutral-400 block text-[10px] uppercase font-mono">Stoppages Remaining</span>
            <span className="font-mono text-sm font-bold text-neutral-200">
              {stops.filter(s => s.status !== 'passed').length} stations
            </span>
          </div>
          <div className="border-l border-neutral-800 pl-4">
            <span className="text-neutral-400 block text-[10px] uppercase font-mono">Current Corridor Variance</span>
            <span className="font-mono text-sm font-bold text-amber-400">+{prediction.netDelayDeltaMin || 7} min</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('gps')}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            Track on Live GPS →
          </button>
        </div>
      </div>

      {/* Station Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-neutral-800">
        {stops.map((stop, idx) => {
          const isExpanded = expandedStopCode === stop.code;
          const isPassed = stop.status === 'passed';
          const isCurrent = stop.status === 'current';
          const isUpcoming = stop.status === 'upcoming';

          // Deterministic confidence computation per stop
          const stopConfidence = Math.max(76, 96 - idx * 3);

          return (
            <div key={stop.code} className="relative">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all ${
                  isPassed
                    ? 'border-neutral-600 bg-neutral-900 text-neutral-400'
                    : isCurrent
                    ? 'border-emerald-500 bg-neutral-950 text-emerald-400 shadow-md ring-4 ring-emerald-500/20'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                ) : isCurrent ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="text-[10px] font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Station Card */}
              <div
                className={`rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/20 via-neutral-900 to-neutral-900 shadow-lg'
                    : 'border-neutral-800/90 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div
                  onClick={() => toggleStop(stop.code)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-white tracking-wide">
                        {stop.code}
                      </span>
                      <h3 className="text-base font-semibold text-neutral-100">
                        {stop.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                          CURRENT / NEXT HALT
                        </span>
                      )}
                      {stop.isJunction ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                          JUNCTION
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {stop.stationType === 'halt' ? 'WAYSIDE HALT' : 'STATION'}
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          DEPARTED
                        </span>
                      )}
                      {isUpcoming && idx === stops.length - 1 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          DESTINATION
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span>Platform {stop.platform}</span>
                      <span>·</span>
                      <span>Track: {stop.track}</span>
                      <span>·</span>
                      <span className="font-mono">{stop.distanceKm} km from source</span>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToStation(stop.code);
                          setActiveTab('gps');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                      >
                        Track on Live Map →
                      </button>
                    </div>
                  </div>

                  {/* Timings & Variance */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[11px] text-neutral-400">Arr:</span>
                        <span className="font-mono font-bold text-sm text-white">
                          {isCurrent ? prediction.predictedETA : stop.predictedArr}
                        </span>
                        {stop.delayArrMin > 0 && (
                          <span className="text-xs font-mono font-semibold text-amber-400">
                            (+{stop.delayArrMin}m)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Sched: {stop.scheduledArr} · Dep: {stop.predictedDep}
                      </div>
                    </div>

                    <button className="text-neutral-500 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Station Details & Coach Orientation */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-neutral-800/80 bg-neutral-950/60 rounded-b-2xl space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                          Coach Position Recommendation
                        </span>
                        <p className="font-semibold text-white">
                          {stop.coachPositionGuide || 'Coach B4 aligns near FOB 2 Staircase / Middle'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                        <span className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                          Recommended Gate / Exit
                        </span>
                        <p className="font-semibold text-white">
                          {stop.gateRecommendation || 'Main Concourse & Circulating Area'}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="text-neutral-400 text-[10px] uppercase font-mono block mb-1">
                            Station Facilities
                          </span>
                          <span className="text-xs text-neutral-300">Food, Lounge, Cloak room</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('station_guide')}
                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-emerald-400 font-semibold"
                        >
                          Guide Me →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
