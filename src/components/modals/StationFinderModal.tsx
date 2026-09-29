import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { MAJOR_STATIONS } from '../../services/mockRailwayData';
import {
  Search,
  X,
  MapPin,
  Building2,
  ArrowRight,
  Compass,
  Footprints,
  Train,
  Check,
  Sparkles
} from 'lucide-react';
import { StationInfo } from '../../types/railway';

interface StationFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StationFinderModal: React.FC<StationFinderModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setSearchOrigin, theme } = useRailway();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedStation(null);
      setFilterRegion('ALL');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredStations = useMemo(() => {
    let list = MAJOR_STATIONS;
    if (filterRegion !== 'ALL') {
      list = list.filter(s => {
        if (filterRegion === 'NORTH') return ['Delhi', 'Uttar Pradesh'].includes(s.state);
        if (filterRegion === 'WEST') return ['Maharashtra', 'Gujarat'].includes(s.state);
        if (filterRegion === 'CENTRAL') return ['Madhya Pradesh'].includes(s.state);
        if (filterRegion === 'SOUTH') return ['Karnataka', 'Tamil Nadu'].includes(s.state);
        return true;
      });
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    );
  }, [query, filterRegion]);

  if (!isOpen) return null;

  const handleSelectStationGuide = (station: StationInfo) => {
    onClose();
    setActiveTab('station_guide');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleFindTrainsFromHere = (station: StationInfo) => {
    setSearchOrigin(`${station.name} (${station.code})`);
    onClose();
    const el = document.getElementById('route-search-origin-input') || document.getElementById('available-trains-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Find Stations & Platform Concourses
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant search across major Indian railway junctions and terminal platforms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar & Region Filters */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search station by name, code or city (e.g. NDLS, Bhopal, MMCT, Delhi, Surat)..."
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-hidden'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden'
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className={`text-[11px] font-semibold mr-1 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Zone:
            </span>
            {[
              { id: 'ALL', label: 'All Stations' },
              { id: 'NORTH', label: 'North (NDLS/NZM)' },
              { id: 'CENTRAL', label: 'Central (BPL/ET)' },
              { id: 'WEST', label: 'West (MMCT/ADI)' },
              { id: 'SOUTH', label: 'South (SBC/MAS)' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setFilterRegion(r.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-xs ${
                  filterRegion === r.id
                    ? 'bg-teal-600 text-white font-semibold'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-[480px]">
          {filteredStations.length === 0 ? (
            <div className="text-center py-10">
              <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No stations found matching &quot;{query}&quot;</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Try typing city names like Bhopal, Delhi, Mumbai, or code like NDLS
              </p>
            </div>
          ) : (
            filteredStations.map(station => {
              const isSelected = selectedStation?.code === station.code;
              return (
                <div
                  key={station.code}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? isDark
                        ? 'border-teal-500/50 bg-teal-950/20'
                        : 'border-teal-500 bg-teal-50/50'
                      : isDark
                      ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex flex-col items-center justify-center shrink-0">
                        <span className="font-mono font-bold text-xs text-teal-500">{station.code}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold">{station.name}</h4>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {station.platforms} Platforms
                          </span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {station.city}, {station.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleFindTrainsFromHere(station)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          isDark
                            ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <Train className="h-3.5 w-3.5 text-blue-500" />
                        <span>Trains From Here</span>
                      </button>

                      <button
                        onClick={() => handleSelectStationGuide(station)}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Compass className="h-3.5 w-3.5" />
                        <span>Platform Guide</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50/70 text-slate-500'
          }`}
        >
          <span>Showing {filteredStations.length} railway stations</span>
          <button
            onClick={onClose}
            className={`font-semibold hover:underline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
