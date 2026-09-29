import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  CheckCircle2,
  Clock,
  Navigation,
  MapPin,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export const PanicFreeAssistanceHub: React.FC = () => {
  const {
    selectedTrain,
    setActiveTab,
    gps,
    prediction,
    connections,
    saveCurrentJourney,
    theme
  } = useRailway();

  const isDark = theme === 'dark';

  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1] || selectedTrain.stops[0];
  const upcomingStops = selectedTrain.stops.filter(s => s.status === 'upcoming');
  const nextStop = upcomingStops[0] || currentStop;
  const primaryConnection = connections[0];

  return (
    <div id="passenger-assistance-hub" className="space-y-4 scroll-mt-20">
      {/* Calm Status Banner */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-colors duration-200 ${
          isDark
            ? 'border-slate-800 bg-slate-900/90 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Journey Assistant Active
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-0.5">
                Everything is on track for {selectedTrain.name} ({selectedTrain.number})
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Relax and follow the simple steps below. We monitor platforms, delays, and stops for you.
              </p>
            </div>
          </div>

          <button
            onClick={() => saveCurrentJourney()}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors self-start sm:self-auto border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-slate-400" />
            <span>Save to My Trips</span>
          </button>
        </div>

        {/* 3 Step Simple Cards */}
        <div
          className={`mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          {/* Card 1: Boarding */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  1. Boarding Station
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Platform Confirmed</span>
              </div>
              <div className="font-mono text-xl font-bold mb-1">
                Platform {currentStop.platform || '1'}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Coach B4 will stop near the middle stairs / Pillar 14.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('station_guide')}
              className={`mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span>Platform & Coach Guide</span>
            </button>
          </div>

          {/* Card 2: Live Ride */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  2. On The Train
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium font-mono">{gps.speedKmph} km/h</span>
              </div>
              <div className="text-base font-bold mb-1 truncate">
                Next: {nextStop.name}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Arriving in approx 18 mins. Journey is smooth and proceeding normally.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('gps')}
              className={`mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <Navigation className="h-3.5 w-3.5 text-emerald-500" />
              <span>Live Train Map</span>
            </button>
          </div>

          {/* Card 3: Destination */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  3. Arrival & Exit
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Safe Transfer</span>
              </div>
              <div className="font-mono text-xl font-bold mb-1">
                {prediction.predictedETA}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Arriving at {selectedTrain.destination}. Cabs & Metro available right outside Gate 2.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('connection')}
              className={`mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              <span>Check Connecting Rides</span>
            </button>
          </div>
        </div>

        {/* Quiet Help Bar */}
        <div
          className={`mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>24/7 Passenger Support:</span>
            <span>Dial 139 for Railway Police, Medical emergency, or Coach assistance.</span>
          </div>

          <button
            onClick={() => setActiveTab('discovery')}
            className="text-blue-500 hover:underline font-medium"
          >
            Find Food & Restrooms at Next Station →
          </button>
        </div>
      </div>
    </div>
  );
};
