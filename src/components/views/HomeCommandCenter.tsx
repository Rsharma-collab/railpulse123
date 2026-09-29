import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { RouteSelectorHub } from '../route/RouteSelectorHub';
import { PanicFreeAssistanceHub } from '../assistance/PanicFreeAssistanceHub';
import { ReportIssueModal } from '../modals/ReportIssueModal';
import { StationFinderModal } from '../modals/StationFinderModal';
import {
  Navigation,
  Clock,
  MapPin,
  Coffee,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Building2,
  AlertTriangle,
  ChevronRight,
  Train,
  Bot,
  Sparkles,
  Mic
} from 'lucide-react';

export const HomeCommandCenter: React.FC = () => {
  const {
    selectedTrain,
    setActiveTab,
    gps,
    updateProgressPercent,
    prediction,
    connections,
    saveCurrentJourney,
    theme
  } = useRailway();

  const isDark = theme === 'dark';
  const [showOpsDetails, setShowOpsDetails] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [isStationFinderOpen, setIsStationFinderOpen] = useState(false);

  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1] || selectedTrain.stops[0];
  const upcomingStops = selectedTrain.stops.filter(s => s.status === 'upcoming');
  const delayMin = currentStop.delayArrMin || 0;
  const isOnTime = delayMin === 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. STARTING JOURNEY SEARCH: Select Where & To Where */}
      <RouteSelectorHub />

      {/* 2. QUICK ACCESS GRID: High-Frequency Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quick Access
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              High-frequency passenger tools & navigation shortcuts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-railpulse-ai'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ask Saarthi AI</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1: Find Stations */}
          <button
            type="button"
            onClick={() => setIsStationFinderOpen(true)}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-950/20'
                : 'bg-white hover:bg-teal-50/30 border-slate-200 hover:border-teal-400 hover:shadow-md hover:shadow-teal-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 transition-transform group-hover:scale-105">
                <Building2 className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`}>
                <span>Explore</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Find Stations
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Look up 20+ junctions, platform concourses, waiting rooms & station facilities
              </p>
            </div>
          </button>

          {/* Card 2: Live Map */}
          <button
            type="button"
            onClick={() => setActiveTab('gps')}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-950/20'
                : 'bg-white hover:bg-blue-50/30 border-slate-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-105">
                <Navigation className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <span>Track</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Live Map
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-time satellite coordinates, train speedometer ({gps.speedKmph} km/h) & live track route
              </p>
            </div>
          </button>

          {/* Card 3: Report Issue */}
          <button
            type="button"
            onClick={() => setIsReportIssueOpen(true)}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-950/20'
                : 'bg-white hover:bg-rose-50/30 border-slate-200 hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 transition-transform group-hover:scale-105">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-rose-400' : 'text-rose-600'
              }`}>
                <span>Assistance</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Report Issue
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Raise cleanliness, AC, water, security or food grievances with instant ticket tracking
              </p>
            </div>
          </button>

          {/* Card 4: Platform & Coach */}
          <button
            type="button"
            onClick={() => setActiveTab('station_guide')}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-950/20'
                : 'bg-white hover:bg-amber-50/30 border-slate-200 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 transition-transform group-hover:scale-105">
                <MapPin className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                <span>Concourse</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Platform & Coach
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Exact coach composition (B1-B8, A1-A3, PC) & platform walking guidance
              </p>
            </div>
          </button>

          {/* Card 5: Station Stops */}
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/20'
                : 'bg-white hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-105">
                <Clock className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <span>Timings</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Station Stops
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Complete {selectedTrain.stops.length}-halt schedule with arrival delays & halt durations
              </p>
            </div>
          </button>

          {/* Card 6: Connection & Safety */}
          <button
            type="button"
            onClick={() => setActiveTab('connection')}
            className={`group p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/20'
                : 'bg-white hover:bg-indigo-50/30 border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/5 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 transition-transform group-hover:scale-105">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                <span>Safety</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Connection & Cabs
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Missed connection buffer protection, late-night safety & pre-arranged cabs
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. SIMPLE PASSENGER ASSISTANT: Zero-Panic Guidance */}
      <PanicFreeAssistanceHub />

      {/* 4. CURRENT TRIP SUMMARY & PROGRESS */}
      <div
        id="current-journey-result"
        className={`rounded-2xl border p-5 sm:p-6 transition-colors duration-200 scroll-mt-20 ${
          isDark
            ? 'border-slate-800 bg-slate-900/90 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-2xs'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div>
            <div className={`flex items-center gap-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedTrain.number}
              </span>
              <span>·</span>
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedTrain.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-base sm:text-lg font-bold">
              <span>{selectedTrain.source}</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span>{selectedTrain.destination}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-left sm:text-right">
              <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
              <span className={`font-semibold ${isOnTime ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isOnTime ? 'On Time' : `${delayMin} min delay`}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expected Arrival</span>
              <span className="font-mono font-bold text-sm">
                {prediction.predictedETA}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Trip Progress Slider */}
        <div className={`mt-4 p-3.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Live Route Progress: <strong className={`font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{gps.progressPercent}%</strong>
            </span>
            <span className="text-[11px] font-mono">
              Current: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentStop.name}</strong> · Next: {gps.distanceToNextKm} km
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={gps.progressPercent}
              onChange={e => updateProgressPercent(parseFloat(e.target.value))}
              aria-label="Trip Progress Slider"
              className="w-full h-2.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #2563eb ${gps.progressPercent}%, #334155 ${gps.progressPercent}%, #334155 100%)`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5">
            <span>{selectedTrain.source} (0 km)</span>
            <span className="text-slate-500">Drag to preview live train location across stations</span>
            <span>{selectedTrain.destination} ({selectedTrain.totalDistanceKm} km)</span>
          </div>
        </div>

        {/* 4 Quick Helpful Shortcuts */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('gps')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Navigation className="h-4 w-4 text-blue-500 mb-2" />
            <div>
              <span className="text-xs font-semibold block">Live Train Map</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track on map</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Clock className="h-4 w-4 text-emerald-500 mb-2" />
            <div>
              <span className="text-xs font-semibold block">Station Stops</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedTrain.stops.length} stops scheduled
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('station_guide')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
          >
            <MapPin className="h-4 w-4 text-amber-500 mb-2" />
            <div>
              <span className="text-xs font-semibold block">Platform & Coach</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Where to stand</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Coffee className="h-4 w-4 text-emerald-500 mb-2" />
            <div>
              <span className="text-xs font-semibold block">Food & Meds Fetch</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Halt feasibility radar</span>
            </div>
          </button>
        </div>
      </div>

      {/* Optional: Operations & Signal Network (Tucked away neatly) */}
      <div
        className={`rounded-2xl border p-4 transition-colors duration-200 ${
          isDark
            ? 'border-slate-800 bg-slate-900/60 text-slate-300'
            : 'border-slate-200 bg-white text-slate-700 shadow-2xs'
        }`}
      >
        <button
          onClick={() => setShowOpsDetails(!showOpsDetails)}
          className={`w-full flex items-center justify-between text-xs transition-colors ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-semibold">Railway Operations & Signal Network</span>
            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              (Optional technical details)
            </span>
          </div>
          {showOpsDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showOpsDetails && (
          <div
            className={`mt-4 pt-4 border-t space-y-3 text-xs animate-in fade-in ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              For railway staff or enthusiasts who wish to inspect block sections, signal aspects, and crew turnaround metrics:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Track Signals & Interlocking →
              </button>
              <button
                onClick={() => setActiveTab('crew_rake')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Train Readiness & Inspection →
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Demo Pipeline →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <ReportIssueModal
        isOpen={isReportIssueOpen}
        onClose={() => setIsReportIssueOpen(false)}
      />

      <StationFinderModal
        isOpen={isStationFinderOpen}
        onClose={() => setIsStationFinderOpen(false)}
      />
    </div>
  );
};
