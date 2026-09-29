import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { RouteSelectorHub } from '../route/RouteSelectorHub';
import { PanicFreeAssistanceHub } from '../assistance/PanicFreeAssistanceHub';
import { THEME_CONFIGS, ThemePalette } from '../../types/theme';
import {
  Navigation,
  Clock,
  MapPin,
  Coffee,
  ArrowRight,
  ShieldCheck,
  Activity,
  Sliders,
  Bookmark,
  Building2,
  AlertTriangle,
  ChevronRight,
  Train,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  Palette,
  ExternalLink,
  Search,
  Radio,
  RefreshCw,
  Compass
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    selectedTrain,
    setActiveTab,
    gps,
    updateProgressPercent,
    prediction,
    connections,
    signals,
    blocks,
    crew,
    rake,
    themePalette,
    setThemePalette,
    theme,
    triggerManualRefresh,
    isRefreshing
  } = useRailway();

  const isDark = theme === 'dark';
  const currentTheme = THEME_CONFIGS[themePalette];

  // Tab filter inside dashboard for extreme organization
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'passenger' | 'signals' | 'readiness'>('all');

  // Currently focused station in route
  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1] || selectedTrain.stops[0];
  const upcomingStops = selectedTrain.stops.filter(s => s.status === 'upcoming');
  const delayMin = currentStop.delayArrMin || 0;
  const isOnTime = delayMin === 0;

  const palettesList: ThemePalette[] = ['midnight', 'sunset', 'emerald', 'royal', 'daylight'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. TOP COMMAND BAR: Active Train Overview & Quick Actions */}
      <section
        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-slate-900/85 border-slate-800 text-white shadow-xl'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Active Train Identity */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${currentTheme.badgeClass}`}>
                {selectedTrain.number}
              </span>
              <span className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedTrain.name}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                isOnTime
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {isOnTime ? 'On Time' : `+${delayMin} min Delay`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <span className="text-blue-400">{selectedTrain.source}</span>
              <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-emerald-400">{selectedTrain.destination}</span>
              <span className={`text-xs ml-2 hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ({selectedTrain.stops.length} halts · {selectedTrain.totalDistanceKm} km)
              </span>
            </div>
          </div>

          {/* Quick Command Hub Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-search-train'))}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Change Train</span>
            </button>

            <button
              onClick={() => triggerManualRefresh()}
              disabled={isRefreshing}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync GPS'}</span>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-railpulse-ai'))}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${currentTheme.primaryButton}`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Saarthi AI</span>
              <Sparkles className="h-3 w-3 text-amber-300" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. COLOR-GRADED KEY TELEMETRY TILES: 4 Organized KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GPS Speedometer */}
        <div
          onClick={() => setActiveTab('gps')}
          className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 group relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-blue-500/40 hover:shadow-lg'
              : 'bg-white hover:bg-blue-50/20 border-slate-200 hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Speedometer
            </span>
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Navigation className="h-3.5 w-3.5 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-blue-400">
              {gps.speedKmph}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              km/h
            </span>
          </div>
          <p className={`text-xs mt-1.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Satellite lock · Max track limit 130 km/h
          </p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (gps.speedKmph / 130) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Delay Status & Explainable Reason */}
        <div
          onClick={() => setActiveTab('prediction')}
          className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 group relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-amber-500/40 hover:shadow-lg'
              : 'bg-white hover:bg-amber-50/20 border-slate-200 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Delay Intelligence
            </span>
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${
              isOnTime ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              isOnTime ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isOnTime ? '0' : `+${delayMin}`}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              mins
            </span>
          </div>
          <p className={`text-xs mt-1.5 leading-snug truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isOnTime ? 'On-time green precedence' : prediction.factors[0]?.explanation || 'Signal clearance ahead'}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-amber-400 font-medium">
            <span>Confidence: {prediction.confidencePct}%</span>
            <span className="flex items-center gap-0.5">Details <ChevronRight className="h-3 w-3" /></span>
          </div>
        </div>

        {/* Card 3: Next Stop & Platform Concourse */}
        <div
          onClick={() => setActiveTab('station_guide')}
          className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 group relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-cyan-500/40 hover:shadow-lg'
              : 'bg-white hover:bg-cyan-50/20 border-slate-200 hover:border-cyan-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Approaching Halt
            </span>
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold tracking-tight truncate text-cyan-400">
              {currentStop.name}
            </span>
          </div>
          <p className={`text-xs mt-1.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Platform {currentStop.platform} · Arr {currentStop.scheduledArr}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
            <span>Coach mapping ready</span>
            <span className="flex items-center gap-0.5">View Map <ChevronRight className="h-3 w-3" /></span>
          </div>
        </div>

        {/* Card 4: Connection & Transfer Buffer */}
        <div
          onClick={() => setActiveTab('connection')}
          className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 group relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-indigo-500/40 hover:shadow-lg'
              : 'bg-white hover:bg-indigo-50/20 border-slate-200 hover:border-indigo-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transfer Safety
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-indigo-400">
              {connections.length > 0 ? `${connections[0].bufferRemainingMin}m` : '45m'}
            </span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              buffer
            </span>
          </div>
          <p className={`text-xs mt-1.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Safe transfer buffer · Station cabs insured
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
            <span>Protection Active</span>
            <span className="flex items-center gap-0.5">Manage <ChevronRight className="h-3 w-3" /></span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE ROUTE PROGRESS BAR */}
      <section
        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
          isDark ? 'bg-slate-900/85 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Live Route Progress Tracker
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Drag slider to preview position along the track or jump to any halt
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold self-start sm:self-auto">
            {gps.progressPercent}% of journey completed
          </span>
        </div>

        {/* Interactive Progress Slider */}
        <div className="space-y-3 pt-2">
          <input
            type="range"
            min="0"
            max="100"
            value={gps.progressPercent}
            onChange={e => updateProgressPercent(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          {/* Station Nodes Visual */}
          <div className="flex items-center justify-between overflow-x-auto gap-3 py-2 scrollbar-none">
            {selectedTrain.stops.map((stop, index) => {
              const isPassed = stop.status === 'passed';
              const isCurrent = stop.status === 'current';
              const isUpcoming = stop.status === 'upcoming';

              return (
                <div
                  key={stop.code}
                  onClick={() => setActiveTab('timeline')}
                  className="flex flex-col items-center min-w-[70px] cursor-pointer group"
                >
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center transition-all ${
                    isPassed
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                      ? 'bg-cyan-400 ring-4 ring-cyan-500/30 animate-pulse'
                      : isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-200 border border-slate-300'
                  }`}>
                    {isPassed && <CheckCircle2 className="h-3 w-3" />}
                  </div>
                  <span className={`text-[11px] font-bold mt-1 text-center truncate max-w-[80px] ${
                    isCurrent
                      ? 'text-cyan-400 font-extrabold'
                      : isPassed
                      ? isDark ? 'text-slate-300' : 'text-slate-700'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {stop.code}
                  </span>
                  <span className={`text-[10px] font-mono ${
                    isCurrent ? 'text-cyan-400' : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    P{stop.platform}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. DASHBOARD SECTION FILTER: High Organization */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className={`inline-flex items-center p-1 rounded-2xl border ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setDashboardFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                dashboardFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tools & Telemetry
            </button>
            <button
              onClick={() => setDashboardFilter('passenger')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                dashboardFilter === 'passenger'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Passenger Hub
            </button>
            <button
              onClick={() => setDashboardFilter('signals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                dashboardFilter === 'signals'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Signals & Tracks
            </button>
            <button
              onClick={() => setDashboardFilter('readiness')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                dashboardFilter === 'readiness'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crew & Rake Ops
            </button>
          </div>

          {/* Quick Palette Switcher inside Dashboard */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Theme Palette:
            </span>
            {palettesList.map(p => {
              const cfg = THEME_CONFIGS[p];
              return (
                <button
                  key={p}
                  onClick={() => setThemePalette(p)}
                  className={`h-6 w-6 rounded-full ${cfg.swatchGradient} transition-transform hover:scale-110 cursor-pointer ${
                    themePalette === p ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={`${cfg.name} (${cfg.accentName})`}
                  aria-label={`Switch to ${cfg.name}`}
                />
              );
            })}
          </div>
        </div>

        {/* 5. WORKSPACE GRID: Left (Main Tools) & Right (Operational Feeds) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Passenger Hub & Planning (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {(dashboardFilter === 'all' || dashboardFilter === 'passenger') && (
              <>
                {/* Panic Free Assistance Hub */}
                <PanicFreeAssistanceHub />

                {/* High Frequency Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Tool 1: Platform & Coach Locator */}
                  <div
                    onClick={() => setActiveTab('station_guide')}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 group flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-amber-500/50 hover:shadow-lg'
                        : 'bg-white hover:bg-amber-50/30 border-slate-200 hover:border-amber-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-0.5">
                        Concourse <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Platform & Coach Map
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Find exact coach order (B1-B8, A1-A3, PC) and platform walking distance.
                      </p>
                    </div>
                  </div>

                  {/* Tool 2: Connection & Safe Cabs */}
                  <div
                    onClick={() => setActiveTab('connection')}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 group flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-indigo-500/50 hover:shadow-lg'
                        : 'bg-white hover:bg-indigo-50/30 border-slate-200 hover:border-indigo-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-500 flex items-center gap-0.5">
                        Transfer <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Transfer & Cab Shield
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Automatic transfer delay adjustment, platform porter assistance, safe late-night taxis.
                      </p>
                    </div>
                  </div>

                  {/* Tool 3: Station Stops Timeline */}
                  <div
                    onClick={() => setActiveTab('timeline')}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 group flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-emerald-500/50 hover:shadow-lg'
                        : 'bg-white hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5">
                        Schedule <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        All Station Stops
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Full halt schedule with scheduled vs actual times, halt length & food stalls.
                      </p>
                    </div>
                  </div>

                  {/* Tool 4: Food, Meds & Halt Radar */}
                  <div
                    onClick={() => setActiveTab('discovery')}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 group flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-rose-500/50 hover:shadow-lg'
                        : 'bg-white hover:bg-rose-50/30 border-slate-200 hover:border-rose-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <Coffee className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                        En Route <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Food & Medicine Radar
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Approved pantry vendors, clean water refill points, 24/7 medical stores at upcoming halts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Collapsible Quick Route Selector */}
                <RouteSelectorHub />
              </>
            )}

            {dashboardFilter === 'signals' && (
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h4 className="text-base font-bold mb-2">Track & Block Section Monitoring</h4>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Live telemetry across automatic signaling territories
                </p>
                <div className="space-y-3">
                  {blocks.slice(0, 4).map(b => (
                    <div key={b.id} className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className="font-mono font-bold text-cyan-400">{b.code}</span>
                        <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {b.name || b.code} ({b.lengthKm} km · Max {b.maxPermissibleSpeedKmph} km/h)
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        b.congestionLevel === 'LOW'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : b.congestionLevel === 'MODERATE'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {b.congestionLevel} CONGESTION
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashboardFilter === 'readiness' && (
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h4 className="text-base font-bold mb-2">Rake & Crew Turnaround Readiness</h4>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pre-departure verification telemetry
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] font-semibold text-slate-400">Loco Pilot Sign-On</span>
                    <p className="font-bold text-emerald-400 mt-1">{crew.assignedDriver} ({crew.signOnStatus})</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] font-semibold text-slate-400">Mechanical Inspection</span>
                    <p className="font-bold text-emerald-400 mt-1">{rake.mechanicalInspection}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] font-semibold text-slate-400">Coach Readiness</span>
                    <p className="font-bold text-cyan-400 mt-1">{rake.coachReadiness}</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[11px] font-semibold text-slate-400">AC & Traction Health</span>
                    <p className="font-bold text-emerald-400 mt-1">{rake.acTractionHealthPct}% Normal</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Operational Feeds (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Network Signals */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/85 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Signal Network Telemetry
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab('network')}
                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Full Track</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {signals.slice(0, 3).map(sig => (
                  <div
                    key={sig.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold font-mono">{sig.code}</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {sig.location} · {sig.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        sig.aspect === 'GREEN'
                          ? 'bg-emerald-500 shadow-xs shadow-emerald-500'
                          : sig.aspect === 'DOUBLE_YELLOW'
                          ? 'bg-amber-400'
                          : sig.aspect === 'YELLOW'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`} />
                      <span className="text-[10px] font-mono font-semibold uppercase">
                        {sig.aspect}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Station Facilities & Emergency Help */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                isDark ? 'bg-slate-900/85 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Instant Railway Support
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">24x7 Active</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <div className="font-bold">Railway Passenger Helpline</div>
                    <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Security, Medical, Cleanliness, Catering
                    </div>
                  </div>
                  <a
                    href="tel:139"
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono hover:bg-emerald-500/20 transition-colors"
                  >
                    Dial 139
                  </a>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <div className="font-bold">Report Coach Issue</div>
                    <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Water, AC, Bedroll, Charging socket
                    </div>
                  </div>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-report-issue'))}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Link to Landing Page */}
            <div
              className={`p-4 rounded-2xl border text-center space-y-2 ${
                isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <p className="text-xs font-medium">
                Want to view the full product overview or explore features?
              </p>
              <button
                onClick={() => setActiveTab('landing')}
                className="text-xs text-blue-400 hover:underline font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>Return to RailPulse Landing Page</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
