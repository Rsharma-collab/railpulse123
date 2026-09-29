import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Search,
  X,
  Train as TrainIcon,
  ArrowRight,
  AlertCircle,
  Check,
  CornerDownLeft,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Train } from '../../types/railway';

interface SearchTrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AutocompleteSuggestion {
  id: string;
  type: 'number' | 'name' | 'route' | 'type';
  badge: string;
  primaryText: string;
  secondaryText: string;
  train: Train;
}

export const SearchTrainModal: React.FC<SearchTrainModalProps> = ({ isOpen, onClose }) => {
  const { trains, selectedTrain, selectTrainAndAssist, theme } = useRailway();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionListRef = useRef<HTMLDivElement>(null);

  // Focus input when opened and reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlightedIndex(-1);
      setSelectedFilter('ALL');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Compute smart autocomplete suggestions as the user types
  const autocompleteSuggestions: AutocompleteSuggestion[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const suggestions: AutocompleteSuggestion[] = [];
    const seenTrainIds = new Set<string>();

    // 1. Exact or prefix matches on train number (highest priority for railway passengers)
    trains.forEach(t => {
      if (t.number.toLowerCase().startsWith(q) || t.number.toLowerCase().includes(q)) {
        suggestions.push({
          id: `num-${t.id}`,
          type: 'number',
          badge: 'Train #',
          primaryText: `${t.number} — ${t.name}`,
          secondaryText: `${t.source} (${t.sourceCode}) → ${t.destination} (${t.destCode})`,
          train: t
        });
        seenTrainIds.add(t.id);
      }
    });

    // 2. Name matches
    trains.forEach(t => {
      if (!seenTrainIds.has(t.id) && t.name.toLowerCase().includes(q)) {
        suggestions.push({
          id: `name-${t.id}`,
          type: 'name',
          badge: 'Name',
          primaryText: `${t.name} (${t.number})`,
          secondaryText: `${t.type} · ${t.source} → ${t.destination}`,
          train: t
        });
        seenTrainIds.add(t.id);
      }
    });

    // 3. Station or Route matches (Source or Destination)
    trains.forEach(t => {
      if (!seenTrainIds.has(t.id)) {
        const matchesRoute =
          t.source.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.sourceCode.toLowerCase().includes(q) ||
          t.destCode.toLowerCase().includes(q) ||
          t.stops.some(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));

        if (matchesRoute) {
          suggestions.push({
            id: `route-${t.id}`,
            type: 'route',
            badge: 'Route',
            primaryText: `${t.source} → ${t.destination}`,
            secondaryText: `Train ${t.number} (${t.name})`,
            train: t
          });
          seenTrainIds.add(t.id);
        }
      }
    });

    // 4. Train Type matches (e.g. 'Vande', 'Rajdhani', 'Shatabdi')
    trains.forEach(t => {
      if (!seenTrainIds.has(t.id) && t.type.toLowerCase().includes(q)) {
        suggestions.push({
          id: `type-${t.id}`,
          type: 'type',
          badge: 'Type',
          primaryText: `${t.type}: ${t.number} ${t.name}`,
          secondaryText: `${t.source} → ${t.destination}`,
          train: t
        });
        seenTrainIds.add(t.id);
      }
    });

    return suggestions.slice(0, 5); // Top 5 intuitive quick suggestions
  }, [trains, query]);

  // Filtered train results for the main list
  const filteredTrains = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trains.filter(t => {
      // Category filter check
      if (selectedFilter !== 'ALL') {
        if (selectedFilter === 'VANDE' && !t.type.toLowerCase().includes('vande')) return false;
        if (selectedFilter === 'RAJDHANI' && !t.type.toLowerCase().includes('rajdhani')) return false;
        if (selectedFilter === 'SHATABDI' && !t.type.toLowerCase().includes('shatabdi')) return false;
      }

      if (!q) return true;

      return (
        t.number.includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.sourceCode.toLowerCase().includes(q) ||
        t.destCode.toLowerCase().includes(q) ||
        t.stops.some(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      );
    });
  }, [trains, query, selectedFilter]);

  if (!isOpen) return null;

  const handleSelect = (train: Train) => {
    selectTrainAndAssist(train);
    onClose();
    // Smoothly autoscroll to result card/section
    setTimeout(() => {
      const el = document.getElementById('passenger-assistance-hub') || document.getElementById('current-journey-result');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleApplyQuery = (suggestedText: string) => {
    setQuery(suggestedText);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation for autocomplete suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (autocompleteSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev < autocompleteSuggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : autocompleteSuggestions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < autocompleteSuggestions.length) {
          handleSelect(autocompleteSuggestions[highlightedIndex].train);
        } else if (autocompleteSuggestions[0]) {
          handleSelect(autocompleteSuggestions[0].train);
        } else if (filteredTrains[0]) {
          handleSelect(filteredTrains[0]);
        }
        return;
      }
      if (e.key === 'Tab' && autocompleteSuggestions.length > 0) {
        // Tab autocompletes top suggestion
        e.preventDefault();
        const top = highlightedIndex >= 0 ? autocompleteSuggestions[highlightedIndex] : autocompleteSuggestions[0];
        setQuery(top.train.number);
      }
    } else if (e.key === 'Enter' && filteredTrains.length > 0) {
      e.preventDefault();
      handleSelect(filteredTrains[0]);
    }
  };

  // Helper to highlight matching text in suggestion strings
  const renderHighlighted = (text: string) => {
    const q = query.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <span
              key={i}
              className={`font-bold ${
                isDark
                  ? 'text-blue-400 bg-blue-500/20 px-0.5 rounded'
                  : 'text-blue-700 bg-blue-100 px-0.5 rounded'
              }`}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const quickPicks = [
    { label: '12951 Mumbai Rajdhani', queryText: '12951' },
    { label: '20901 Vande Bharat', queryText: '20901' },
    { label: '12002 Bhopal Shatabdi', queryText: '12002' },
    { label: '12953 Tejas Rajdhani', queryText: '12953' },
    { label: 'Delhi to Mumbai', queryText: 'Mumbai' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl transition-all flex flex-col max-h-[88vh] overflow-hidden ${
          isDark
            ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-black/60'
            : 'border-slate-200 bg-white text-slate-900 shadow-slate-400/20'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <TrainIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Find & Select Train</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant search with live autocomplete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search input container */}
        <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="relative">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type train number (e.g. 12951), name, or city..."
              className={`w-full rounded-xl border py-2.5 pl-10 pr-9 text-sm transition-all outline-hidden ${
                isDark
                  ? 'border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10'
              }`}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setHighlightedIndex(-1);
                  inputRef.current?.focus();
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                }`}
                title="Clear query"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* AUTOCOMPLETE SUGGESTION BAR: Shows as user types */}
          {query.trim().length > 0 && autocompleteSuggestions.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  Autocomplete Suggestions ({autocompleteSuggestions.length})
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Use ↑ ↓ then Enter
                </span>
              </div>

              <div
                ref={suggestionListRef}
                className={`rounded-xl border overflow-hidden divide-y text-xs ${
                  isDark
                    ? 'border-blue-500/30 bg-blue-950/20 divide-slate-800'
                    : 'border-blue-200 bg-blue-50/50 divide-blue-100'
                }`}
              >
                {autocompleteSuggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.train)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                        isHighlighted
                          ? isDark
                            ? 'bg-blue-600/30 text-white'
                            : 'bg-blue-100 text-blue-950 font-medium'
                          : isDark
                          ? 'hover:bg-slate-800/60 text-slate-200'
                          : 'hover:bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium shrink-0 ${
                            item.type === 'number'
                              ? isDark
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                              : item.type === 'route'
                              ? isDark
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isDark
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                        <div className="truncate">
                          <span className="font-semibold">{renderHighlighted(item.primaryText)}</span>
                          <span
                            className={`ml-2 text-[11px] truncate ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {renderHighlighted(item.secondaryText)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span
                          className={`text-[10px] flex items-center gap-1 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          Select <CornerDownLeft className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Suggestions / Popular Searches when no query is typed */}
          {query.trim().length === 0 && (
            <div className="mt-3">
              <div
                className={`text-[11px] font-medium mb-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Suggested / Popular Trains:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPicks.map(pick => (
                  <button
                    key={pick.queryText}
                    onClick={() => handleApplyQuery(pick.queryText)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      isDark
                        ? 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:text-slate-950 hover:bg-white'
                    }`}
                  >
                    {pick.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pt-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'All Trains' },
              { id: 'VANDE', label: '⚡ Vande Bharat' },
              { id: 'RAJDHANI', label: '👑 Rajdhani' },
              { id: 'SHATABDI', label: '⚡ Shatabdi' }
            ].map(pill => {
              const active = selectedFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedFilter(pill.id)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    active
                      ? isDark
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1 px-1">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Available Trains ({filteredTrains.length})
            </span>
            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Click to select and track
            </span>
          </div>

          {filteredTrains.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              <AlertCircle className="h-8 w-8 text-amber-500/80 mb-2" />
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                No trains match "{query}"
              </p>
              <p className="text-xs mt-1 max-w-sm">
                Try searching by number (e.g. 12951, 20901) or stations like "Mumbai", "Bhopal", "Delhi", "Bengaluru".
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedFilter('ALL');
                }}
                className="mt-3 text-xs text-blue-500 hover:underline font-medium"
              >
                Reset search query
              </button>
            </div>
          ) : (
            filteredTrains.map(train => {
              const isSelected = selectedTrain.id === train.id;
              const typeColor = train.type.toLowerCase().includes('vande')
                ? isDark
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : 'bg-purple-50 text-purple-700 border-purple-200'
                : train.type.toLowerCase().includes('rajdhani')
                ? isDark
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
                : train.type.toLowerCase().includes('shatabdi')
                ? isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isDark
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div
                  key={train.id}
                  onClick={() => handleSelect(train)}
                  className={`group relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? isDark
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                        : 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/30'
                      : isDark
                      ? 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950 text-slate-300 hover:text-white'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      {/* Train header & badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-500">
                          {renderHighlighted(train.number)}
                        </span>
                        <span
                          className={`font-semibold text-sm ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {renderHighlighted(train.name)}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColor}`}
                        >
                          {train.type}
                        </span>
                      </div>

                      {/* Route details */}
                      <div
                        className={`flex flex-wrap items-center gap-2 text-xs ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        <span className="font-medium">
                          {renderHighlighted(train.source)} ({train.sourceCode})
                        </span>
                        <ArrowRight
                          className={`h-3 w-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
                        />
                        <span className="font-medium">
                          {renderHighlighted(train.destination)} ({train.destCode})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 opacity-70" />
                          {train.stops.length} Stops
                        </span>
                        {train.duration && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 opacity-70" />
                              {train.duration}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status / Select badge */}
                    <div className="shrink-0 text-right">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border transition-colors ${
                            isDark
                              ? 'border-slate-800 bg-slate-900 text-slate-300 group-hover:border-blue-500/40 group-hover:text-blue-400'
                              : 'border-slate-200 bg-slate-50 text-slate-600 group-hover:border-blue-300 group-hover:text-blue-600'
                          }`}
                        >
                          Select <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div
          className={`px-5 py-2.5 border-t text-[11px] flex items-center justify-between ${
            isDark
              ? 'border-slate-800 bg-slate-900/60 text-slate-400'
              : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Tip: Start typing train number or station for immediate suggestions</span>
          </div>
          <button
            onClick={onClose}
            className={`font-medium transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
