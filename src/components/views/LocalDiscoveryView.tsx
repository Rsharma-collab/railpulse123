import React, { useState, useEffect, useMemo } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Search,
  Coffee,
  Bath,
  Armchair,
  Briefcase,
  CreditCard,
  HeartPulse,
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Navigation,
  ArrowRight,
  Pill,
  Utensils,
  Timer,
  Phone,
  ShieldAlert,
  Footprints,
  ShoppingBag,
  Zap,
  Sliders,
  Sparkles,
  Flame,
  Info,
  ChevronRight,
  BellRing
} from 'lucide-react';
import { StationFacility, StationPerimeterItem, FetchProbabilityAnalysis } from '../../types/railway';
import { STATION_PERIMETER_ITEMS, calculateFetchProbability } from '../../services/stationPerimeterService';

type MainSectionTab = 'fetch_radar' | 'station_facilities';
type ItemCategoryFilter = 'all' | 'medical' | 'famous_food' | 'beverage' | 'safe_only' | 'inside_only';

export const LocalDiscoveryView: React.FC = () => {
  const { facilities, selectedTrain, setActiveTab } = useRailway();
  
  // Active sub-tab
  const [activeTabSection, setActiveTabSection] = useState<MainSectionTab>('fetch_radar');

  // Selected Station for Perimeter & Halt Exploration
  const defaultStop = selectedTrain.stops.find(s => s.code === 'ET') || 
                      selectedTrain.stops.find(s => s.status === 'current') || 
                      selectedTrain.stops[1] || 
                      selectedTrain.stops[0];
  const [selectedStationCode, setSelectedStationCode] = useState<string>(defaultStop.code);

  const selectedStop = useMemo(() => {
    return selectedTrain.stops.find(s => s.code === selectedStationCode) || defaultStop;
  }, [selectedStationCode, selectedTrain.stops, defaultStop]);

  // Calculate default scheduled halt duration in minutes
  const calculatedScheduledHaltMin = useMemo(() => {
    if (!selectedStop.scheduledArr || !selectedStop.scheduledDep) return 10;
    const [arrH, arrM] = selectedStop.scheduledArr.split(':').map(Number);
    const [depH, depM] = selectedStop.scheduledDep.split(':').map(Number);
    if (isNaN(arrH) || isNaN(depH)) return 10;
    let diff = (depH * 60 + depM) - (arrH * 60 + arrM);
    if (diff < 0) diff += 1440; // overnight stop
    // If arrival equals departure or 0 min diff (source/destination or fast stop), assign realistic halt
    if (diff <= 0) {
      return selectedStop.isJunction ? 15 : 3;
    }
    return Math.max(2, diff);
  }, [selectedStop]);

  // Interactive user-customizable halt time slider/simulator
  const [customHaltMin, setCustomHaltMin] = useState<number>(calculatedScheduledHaltMin);

  // Sync customHaltMin when selected station changes
  useEffect(() => {
    setCustomHaltMin(calculatedScheduledHaltMin);
  }, [calculatedScheduledHaltMin]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategoryFilter>('all');
  const [activeFacilityCategory, setActiveFacilityCategory] = useState<string>('all');

  // Active Live Fetch Run Timer
  const [activeFetchItem, setActiveFetchItem] = useState<StationPerimeterItem | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Countdown effect for fetch run timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const startFetchTimer = (item: StationPerimeterItem, analysis: FetchProbabilityAnalysis) => {
    setActiveFetchItem(item);
    // Timer set to the available halt time minus safety buffer (convert to seconds)
    const runSeconds = Math.round(customHaltMin * 60);
    setTimerSecondsLeft(runSeconds);
    setIsTimerRunning(true);
  };

  const cancelFetchTimer = () => {
    setIsTimerRunning(false);
    setActiveFetchItem(null);
    setTimerSecondsLeft(0);
  };

  // Get perimeter items for the chosen station (or fallback to nearby major junction)
  const stationItems = useMemo(() => {
    let items = STATION_PERIMETER_ITEMS.filter(item => item.stationCode === selectedStationCode);
    if (items.length === 0) {
      // Fallback to Itarsi Junction or nearest station if intermediate wayside halt selected
      items = STATION_PERIMETER_ITEMS.filter(item => item.stationCode === 'ET');
    }
    return items;
  }, [selectedStationCode]);

  // Compute probability analysis for each item
  const analyzedItems: FetchProbabilityAnalysis[] = useMemo(() => {
    return stationItems.map(item => calculateFetchProbability(item, customHaltMin));
  }, [stationItems, customHaltMin]);

  // Filtered perimeter items
  const filteredAnalyzedItems = useMemo(() => {
    return analyzedItems.filter(analysis => {
      const item = analysis.item;
      const q = searchQuery.toLowerCase().trim();

      // Category filter
      if (categoryFilter === 'medical' && item.type !== 'medical') return false;
      if (categoryFilter === 'famous_food' && item.type !== 'famous_food') return false;
      if (categoryFilter === 'beverage' && item.type !== 'beverage') return false;
      if (categoryFilter === 'safe_only' && analysis.verdict !== 'SAFE_RUN') return false;
      if (categoryFilter === 'inside_only' && !item.isInsideStation) return false;

      // Text query match
      if (!q) return true;
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesSpecialty = item.specialtyOrMeds.toLowerCase().includes(q);
      const matchesLocation = item.locationDescription.toLowerCase().includes(q);
      const matchesMeds = item.recommendedItems.some(rec => rec.toLowerCase().includes(q));

      return matchesName || matchesSpecialty || matchesLocation || matchesMeds;
    });
  }, [analyzedItems, categoryFilter, searchQuery]);

  // General facilities filter
  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchesCategory = activeFacilityCategory === 'all' || f.category === activeFacilityCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.details.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [facilities, activeFacilityCategory, searchQuery]);

  // Formatter for MM:SS
  const formatTimeSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVerdictBadge = (verdict: FetchProbabilityAnalysis['verdict'], score: number) => {
    switch (verdict) {
      case 'SAFE_RUN':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: `${score}% High Probability · Safe Run`
        };
      case 'QUICK_RUN_ONLY':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          label: `${score}% Moderate · Quick Run Only`
        };
      case 'HIGH_RISK':
        return {
          bg: 'bg-red-500/15 text-red-400 border-red-500/30',
          dot: 'bg-red-400',
          label: `${score}% Low Probability · High Risk`
        };
      case 'IMPOSSIBLE':
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          dot: 'bg-neutral-500',
          label: `${score}% Impossible · Stay on Board`
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Station Radius Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Medical Shops, Famous Food & Halt Fetch Probability
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time probability engine calculating if you can fetch emergency medicines or iconic food before train departure
          </p>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTabSection('fetch_radar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTabSection === 'fetch_radar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Fetch Probability Radar</span>
          </button>
          <button
            onClick={() => setActiveTabSection('station_facilities')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTabSection === 'station_facilities'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Armchair className="h-3.5 w-3.5" />
            <span>Station Facilities Directory</span>
          </button>
        </div>
      </div>

      {/* Floating Active Fetch Timer Notification Banner */}
      {isTimerRunning && activeFetchItem && (
        <div className="sticky top-4 z-40 p-4 rounded-2xl border border-emerald-500/50 bg-neutral-950/95 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Live Fetch Run in Progress
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {selectedStop.name} (Pf {selectedStop.platform})
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                Fetching from: <span className="text-amber-300">{activeFetchItem.name}</span>
              </p>
              <p className="text-xs text-neutral-400">
                Turnaround point: Head back to Coach B4 when timer reaches 02:30!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block font-mono">TIME TILL DEPARTURE</span>
              <span className={`text-2xl font-black font-mono tracking-tight ${
                timerSecondsLeft < 180 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
              }`}>
                {formatTimeSeconds(timerSecondsLeft)}
              </span>
            </div>

            <button
              onClick={cancelFetchTimer}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 border border-neutral-700 transition-colors"
            >
              Back on Board
            </button>
          </div>
        </div>
      )}

      {/* Station Selector & Halt Duration Controls Bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Station Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Select Station Along Route ({selectedTrain.number} {selectedTrain.name}):</span>
            </label>
            <select
              value={selectedStationCode}
              onChange={e => setSelectedStationCode(e.target.value)}
              className="w-full sm:w-80 rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-emerald-500 focus:outline-none transition-colors"
            >
              {selectedTrain.stops.map(st => (
                <option key={st.code} value={st.code} className="bg-neutral-900 text-white">
                  {st.name} ({st.code}) — {st.isJunction ? '★ Major Junction' : 'Station'} · Pf {st.platform}
                </option>
              ))}
            </select>
          </div>

          {/* Station Halt Badge & Live Times */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Scheduled Timings</span>
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Arr: <strong className="text-emerald-400">{selectedStop.scheduledArr}</strong></span>
                <span>·</span>
                <span>Dep: <strong className="text-amber-400">{selectedStop.scheduledDep}</strong></span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-emerald-300 block">Scheduled Stop Duration</span>
              <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{calculatedScheduledHaltMin} Minutes Halt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Halt Time Simulator Slider */}
        <div className="pt-3 border-t border-neutral-800/80 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold">Simulate Passenger Available Window:</span>
              <span className="text-neutral-400 text-[11px]">(Test feasibility if train arrives early/late)</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-neutral-400">Available Time:</span>
              <strong className="text-amber-400 text-sm px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                {customHaltMin} Minutes
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={customHaltMin}
              onChange={e => setCustomHaltMin(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            
            {/* Quick Presets */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0 text-xs">
              {[2, 5, 10, 15, 20].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCustomHaltMin(val)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    customHaltMin === val
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {val}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab 1: Fetch Probability Radar */}
      {activeTabSection === 'fetch_radar' && (
        <div className="space-y-5">
          {/* Search & Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search emergency medicine (ORS, Paracetamol, Insulin) or famous food (Rabdi, Poha, Chips, Chai)..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Items', icon: ShoppingBag, count: stationItems.length },
                { id: 'medical', label: 'Medical & Pharmacies', icon: Pill, count: stationItems.filter(i => i.type === 'medical').length },
                { id: 'famous_food', label: 'Famous Regional Food', icon: Utensils, count: stationItems.filter(i => i.type === 'famous_food').length },
                { id: 'beverage', label: 'Tea & Beverages', icon: Coffee, count: stationItems.filter(i => i.type === 'beverage').length },
                { id: 'safe_only', label: 'Safe Fetch (≥80%)', icon: CheckCircle2, count: analyzedItems.filter(a => a.verdict === 'SAFE_RUN').length },
                { id: 'inside_only', label: 'Inside Platform Only', icon: Navigation, count: stationItems.filter(i => i.isInsideStation).length }
              ].map(pill => {
                const Icon = pill.icon;
                const isActive = categoryFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setCategoryFilter(pill.id as ItemCategoryFilter)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isActive
                        ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-semibold shadow-xs'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{pill.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono ml-0.5">
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Alert Box */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-start gap-3 text-xs text-neutral-300 leading-relaxed">
            <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">How the Probability Calculation Works:</strong> Based on{' '}
              <span className="text-emerald-400 font-semibold">{customHaltMin} min available halt</span> at{' '}
              {selectedStop.name}, our algorithm factors in round-trip walking distance, platform Foot Over Bridge stairs, stall queue preparation time, and a mandatory{' '}
              <strong className="text-white">2.5 min pre-departure coach boarding buffer</strong> so you are safely seated before the train starts moving.
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnalyzedItems.length === 0 ? (
              <div className="col-span-full p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-400">
                <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2 opacity-70" />
                <p className="text-sm font-semibold text-neutral-200">No items match your filter</p>
                <p className="text-xs text-neutral-500 mt-1">Try resetting the category filter or search query</p>
                <button
                  onClick={() => { setCategoryFilter('all'); setSearchQuery(''); }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-white hover:bg-neutral-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredAnalyzedItems.map(analysis => {
                const { item, probabilityScorePct, verdict, recommendationText, totalTimeRequiredMin, timeMarginMin } = analysis;
                const badge = getVerdictBadge(verdict, probabilityScorePct);

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4 hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header & Probability Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2.5 rounded-xl border shrink-0 ${
                            item.type === 'medical'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : item.type === 'famous_food'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          }`}>
                            {item.type === 'medical' ? (
                              <Pill className="h-4 w-4" />
                            ) : item.type === 'famous_food' ? (
                              <Utensils className="h-4 w-4" />
                            ) : (
                              <Coffee className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                              {item.type === 'medical' ? 'Pharmacy / First Aid' : item.type === 'famous_food' ? 'Famous Regional Delicacy' : 'Beverage & Chai'}
                            </span>
                            <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
                          </div>
                        </div>

                        {/* Inside/Outside Station Badge */}
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 border ${
                          item.isInsideStation
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}>
                          {item.isInsideStation ? 'On Platform' : 'Outside Gate'}
                        </span>
                      </div>

                      {/* Probability Gauge Bar */}
                      <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                            <span>Fetch Feasibility</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${badge.bg}`}>
                            {probabilityScorePct}% Probability
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              probabilityScorePct >= 75
                                ? 'bg-emerald-400'
                                : probabilityScorePct >= 50
                                ? 'bg-amber-400'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${probabilityScorePct}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-neutral-300 leading-relaxed pt-0.5">
                          {recommendationText}
                        </p>
                      </div>

                      {/* Location & Specialty */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-start gap-1.5 text-neutral-400">
                          <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0 mt-0.5" />
                          <span>{item.locationDescription}</span>
                        </div>

                        <div className="pt-1">
                          <p className="text-xs text-neutral-200 font-medium">
                            {item.specialtyOrMeds}
                          </p>
                        </div>
                      </div>

                      {/* Recommended items chips */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                          {item.type === 'medical' ? 'Available Essentials:' : 'Recommended Must-Try:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.recommendedItems.slice(0, 3).map((rec, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
                            >
                              {rec}
                            </span>
                          ))}
                          {item.recommendedItems.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 text-neutral-500">
                              +{item.recommendedItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Time Breakdown & Action Button */}
                    <div className="pt-3 border-t border-neutral-800 space-y-3">
                      {/* Timeline Breakdown */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/70">
                        <div>
                          <span className="text-neutral-500 block text-[9px]">ROUND TRIP</span>
                          <strong className="text-neutral-200">{(item.oneWayWalkTimeMin * 2).toFixed(1)}m walk</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px]">PREP / QUEUE</span>
                          <strong className="text-neutral-200">{item.avgPrepOrQueueTimeMin}m prep</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 block text-[9px]">SAFETY BUFFER</span>
                          <strong className="text-emerald-400">2.5m buffer</strong>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs">
                          <span className="text-neutral-500 block text-[10px] font-mono">ESTIMATED COST</span>
                          <span className="font-semibold text-white">{item.pricing}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.phone && (
                            <a
                              href={`tel:${item.phone}`}
                              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                              title={`Call Stall: ${item.phone}`}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => startFetchTimer(item, analysis)}
                            disabled={verdict === 'IMPOSSIBLE'}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              verdict === 'SAFE_RUN'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                                : verdict === 'QUICK_RUN_ONLY'
                                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                                : verdict === 'HIGH_RISK'
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30'
                                : 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed border border-neutral-800'
                            }`}
                          >
                            <Timer className="h-3.5 w-3.5" />
                            <span>{verdict === 'IMPOSSIBLE' ? 'Cannot Fetch' : 'Start Fetch Timer'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Tab 2: Station Facilities Directory */}
      {activeTabSection === 'station_facilities' && (
        <div className="space-y-5">
          {/* Categories Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Facilities', icon: Search },
              { id: 'food', label: 'Food & Dining', icon: Coffee },
              { id: 'washroom', label: 'Restrooms & Baby Care', icon: Bath },
              { id: 'lounge', label: 'Waiting Lounges', icon: Armchair },
              { id: 'cloak_room', label: 'Cloak Room', icon: Briefcase },
              { id: 'medical', label: 'Medical Post', icon: HeartPulse },
              { id: 'atm', label: 'Bank & ATMs', icon: CreditCard },
              { id: 'taxi', label: 'Transit & Taxis', icon: Car }
            ].map(cat => {
              const Icon = cat.icon;
              const isActive = activeFacilityCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFacilityCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isActive
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacilities.length === 0 ? (
              <div className="col-span-full p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-400">
                <p className="text-sm font-semibold text-neutral-200">No facilities found for current filter</p>
                <p className="text-xs text-neutral-500 mt-1">Try switching categories or clear search</p>
              </div>
            ) : (
              filteredFacilities.map(fac => (
                <div
                  key={fac.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 hover:border-neutral-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white">{fac.name}</h3>
                        <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-neutral-500" />
                          <span>{fac.location}</span>
                        </p>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
                        {fac.openStatus}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                      {fac.details}
                    </p>
                  </div>

                  {/* Distance & Walking Time Footer */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span>Dist: <strong className="text-white">{fac.distanceM}m</strong></span>
                      <span>·</span>
                      <span>Walk: <strong className="text-emerald-400">~{fac.walkTimeMin} min</strong></span>
                    </div>

                    <button
                      onClick={() => setActiveTab('station_guide')}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-sans font-medium"
                    >
                      <span>Station Map</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
