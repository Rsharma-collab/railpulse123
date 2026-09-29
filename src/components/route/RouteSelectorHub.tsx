import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { MAJOR_STATIONS } from '../../services/mockRailwayData';
import { Train } from '../../types/railway';
import {
  Search,
  ArrowRightLeft,
  Calendar,
  Clock,
  ArrowRight,
  Check,
  CheckCircle2
} from 'lucide-react';

export const RouteSelectorHub: React.FC = () => {
  const {
    searchOrigin,
    setSearchOrigin,
    searchDestination,
    setSearchDestination,
    travelDate,
    setTravelDate,
    availableTrainsForRoute,
    selectTrainAndAssist,
    swapStations,
    selectedTrain,
    theme
  } = useRailway();

  const isDark = theme === 'dark';

  const [fromQuery, setFromQuery] = useState(searchOrigin);
  const [toQuery, setToQuery] = useState(searchDestination);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const popularRoutes = [
    { from: 'Mumbai CSMT (CSMT)', to: 'Bhopal Junction (BPL)', label: 'Mumbai → Bhopal (All Stations)' },
    { from: 'Bhopal Junction (BPL)', to: 'Mumbai CSMT (CSMT)', label: 'Bhopal → Mumbai (All Stations)' },
    { from: 'New Delhi (NDLS)', to: 'Mumbai Central (MMCT)', label: 'Delhi → Mumbai' },
    { from: 'Mumbai Central (MMCT)', to: 'Ahmedabad Junction (ADI)', label: 'Mumbai → Ahmedabad' },
    { from: 'KSR Bengaluru (SBC)', to: 'MGR Chennai Central (MAS)', label: 'Bengaluru → Chennai' }
  ];

  const handleApplyRoute = (from: string, to: string) => {
    setSearchOrigin(from);
    setSearchDestination(to);
    setFromQuery(from);
    setToQuery(to);
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    // Smoothly autoscroll to available trains results
    setTimeout(() => {
      const el = document.getElementById('available-trains-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleTrainSelect = (train: Train) => {
    selectTrainAndAssist(train);
    // Smoothly autoscroll to the journey guidance result section
    setTimeout(() => {
      const el = document.getElementById('passenger-assistance-hub') || document.getElementById('current-journey-result');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleSwap = () => {
    swapStations();
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const filteredFromStations = MAJOR_STATIONS.filter(
    s =>
      s.name.toLowerCase().includes(fromQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(fromQuery.toLowerCase())
  );

  const filteredToStations = MAJOR_STATIONS.filter(
    s =>
      s.name.toLowerCase().includes(toQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(toQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(toQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Route Search Card */}
      <div
        className={`rounded-2xl border p-5 sm:p-7 transition-colors duration-200 ${
          isDark
            ? 'border-slate-800 bg-slate-900/90 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-2xs'
        }`}
      >
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Find Your Train
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select your departure and arrival stations to view live schedules and get step-by-step journey help.
          </p>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* FROM input */}
          <div className="md:col-span-5 relative">
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              From (Departure Station)
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromQuery}
                onFocus={() => setShowFromSuggestions(true)}
                onChange={e => {
                  setFromQuery(e.target.value);
                  setShowFromSuggestions(true);
                }}
                placeholder="e.g. New Delhi, Bhopal..."
                className={`w-full rounded-xl border py-3 px-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Dropdown suggestions */}
            {showFromSuggestions && (
              <div
                className={`absolute z-40 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-200'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <div className={`text-[11px] px-2 py-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Popular Stations
                </div>
                {filteredFromStations.slice(0, 6).map(st => (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => {
                      const val = `${st.name} (${st.code})`;
                      setFromQuery(val);
                      setSearchOrigin(val);
                      setShowFromSuggestions(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{st.name}</span>
                      <span className={`ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>· {st.city}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {st.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap stations"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* TO input */}
          <div className="md:col-span-5 relative">
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              To (Arrival Station)
            </label>
            <div className="relative">
              <input
                type="text"
                value={toQuery}
                onFocus={() => setShowToSuggestions(true)}
                onChange={e => {
                  setToQuery(e.target.value);
                  setShowToSuggestions(true);
                }}
                placeholder="e.g. Mumbai Central, Ahmedabad..."
                className={`w-full rounded-xl border py-3 px-3.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Dropdown suggestions */}
            {showToSuggestions && (
              <div
                className={`absolute z-40 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border p-1.5 shadow-xl ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-200'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <div className={`text-[11px] px-2 py-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Popular Stations
                </div>
                {filteredToStations.slice(0, 6).map(st => (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => {
                      const val = `${st.name} (${st.code})`;
                      setToQuery(val);
                      setSearchDestination(val);
                      setShowToSuggestions(false);
                      setTimeout(() => {
                        const el = document.getElementById('available-trains-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 120);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{st.name}</span>
                      <span className={`ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>· {st.city}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {st.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date Selector & Search Button */}
        <div
          className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Travel Date:</span>
            {['Today, 28 Sep', 'Tomorrow, 29 Sep'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setTravelDate(d)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  travelDate === d
                    ? 'bg-blue-600 text-white font-medium'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleApplyRoute(fromQuery, toQuery)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span>Search Trains</span>
          </button>
        </div>

        {/* Quick popular routes */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Popular routes:</span>
          {popularRoutes.map(r => (
            <button
              key={r.label}
              type="button"
              onClick={() => handleApplyRoute(r.from, r.to)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Trains List */}
      <div id="available-trains-section" className="space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Available Trains ({availableTrainsForRoute.length})
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Click on a train to see platform details, live location, and simple guidance.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {availableTrainsForRoute.map(train => {
            const isSelected = selectedTrain.id === train.id;
            const delayMin = train.currentDelayMin || 0;
            const isOnTime = delayMin === 0;

            return (
              <div
                key={train.id}
                onClick={() => handleTrainSelect(train)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? isDark
                      ? 'border-blue-500 bg-slate-900 shadow-md ring-1 ring-blue-500/20'
                      : 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Train details & Timing */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`font-mono text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {train.number}
                      </span>
                      <h4 className={`text-base font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {train.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {train.type}
                      </span>

                      {/* Status */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                          isOnTime
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isOnTime ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {isOnTime ? 'On Time' : `${delayMin} mins late`}
                      </span>
                    </div>

                    {/* Schedule times */}
                    <div className="flex flex-wrap items-center gap-5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {train.departureTime || train.stops[0]?.scheduledDep}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {train.source}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className={`h-[1px] w-6 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                        <span>{train.duration || 'Direct'}</span>
                        <span className={`h-[1px] w-6 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {train.arrivalTime || train.stops[train.stops.length - 1]?.predictedArr}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {train.destination}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Platform and Select button */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right text-xs">
                      <span className={`block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expected Platform</span>
                      <span className={`font-mono font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        Platform {train.stops[0]?.platform || '1'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleTrainSelect(train);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : isDark
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select Train'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
