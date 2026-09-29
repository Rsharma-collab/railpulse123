import React, { useState } from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import { THEME_CONFIGS, ThemePalette } from '../../types/theme';
import {
  Train as TrainIcon,
  Search,
  Bell,
  CheckCircle2,
  Sun,
  Moon,
  ArrowLeft,
  Palette,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
  Download
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    activeTab,
    setActiveTab,
    canGoBack,
    goBack,
    previousTab,
    selectedTrain,
    alerts,
    unreadAlertCount,
    markAllAlertsRead,
    theme,
    setTheme,
    themePalette,
    setThemePalette
  } = useRailway();

  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Friendly human tab titles
  const titles: Record<ActiveTab, string> = {
    landing: 'Platform Overview',
    dashboard: 'Command Dashboard',
    home: 'Command Dashboard',
    route_finder: 'Find Trains & Routes',
    gps: 'Live Train Location',
    network: 'Signal & Network Track',
    crew_rake: 'Train Readiness & Coach Prep',
    historical: 'Delay Trends & History',
    prediction: 'Arrival Prediction',
    digital_twin: 'Interactive Route Map',
    timeline: 'Station Stops Timeline',
    connection: 'Transfer & Cab Protection',
    station_guide: 'Platform & Coach Finder',
    alerts: 'Trip Notifications',
    discovery: 'Food, Meds & Halt Radar',
    operations: 'Railway Operations Console',
    my_journeys: 'My Saved Trips',
    settings: 'Preferences',
    simulation: 'Demo Pipeline'
  };

  const isDark = theme === 'dark';
  const currentTheme = THEME_CONFIGS[themePalette];
  const allPalettes: ThemePalette[] = ['midnight', 'sunset', 'emerald', 'royal', 'daylight'];

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:px-6 backdrop-blur-md transition-colors duration-200 ${
        isDark
          ? 'border-slate-800 bg-slate-950/90 text-white'
          : 'border-slate-200 bg-white/90 text-slate-900'
      }`}
    >
      {/* Brand & Section Name */}
      <div className="flex items-center gap-2 sm:gap-3">
        {canGoBack && (
          <button
            onClick={goBack}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all group shrink-0 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-600 shadow-xs'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200 shadow-2xs'
            }`}
            title={`Return to ${previousTab ? titles[previousTab] : 'previous page'}`}
            aria-label="Back to previous page"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-blue-500 shrink-0" />
            <span className="font-semibold">Back</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('landing')}
          className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              isDark
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 group-hover:bg-blue-600/20'
                : 'bg-blue-50 border-blue-200 text-blue-600 group-hover:bg-blue-100'
            }`}
          >
            <TrainIcon className="h-5 w-5" />
          </div>
          <div>
            <span
              className={`text-base font-bold tracking-tight block ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              RailPulse
            </span>
            <span
              className={`text-[11px] hidden sm:block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Railway Intelligence Platform
            </span>
          </div>
        </button>

        {/* Primary View Switcher: Landing vs Dashboard */}
        <div className="hidden sm:flex items-center ml-2 p-1 rounded-xl border bg-slate-900/40 border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard' || activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Selected Train quick preview */}
      <div className="hidden xl:flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <span className="font-semibold text-blue-500 font-mono">{selectedTrain.number}</span>
          <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedTrain.name}</span>
          <span className={isDark ? 'text-slate-500 text-[11px]' : 'text-slate-400 text-[11px]'}>
            ({selectedTrain.sourceCode} → {selectedTrain.destCode})
          </span>
          <span className="text-[10px] text-blue-500 font-medium ml-1 underline decoration-dotted">Change</span>
        </button>
      </div>

      {/* Quick Actions & Theme Controls */}
      <div className="flex items-center gap-2">
        {/* Search train button */}
        <button
          onClick={onOpenSearch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
          }`}
          title="Search train by name or number"
        >
          <Search className={`h-3.5 w-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Download App ZIP Button */}
        <a
          href="/railpulse-app.zip"
          download="railpulse-app.zip"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 shadow-2xs'
          }`}
          title="Download app as a ZIP file (2.9 MB)"
        >
          <Download className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden xl:inline">Export ZIP</span>
        </a>

        {/* Theme Palette Picker Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeDropdown(!showThemeDropdown);
              setShowAlertDropdown(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Choose Color Grading Theme"
            aria-label="Theme selector"
          >
            <div className={`h-3.5 w-3.5 rounded-full ${currentTheme.swatchGradient}`} />
            <span className="hidden md:inline font-semibold">{currentTheme.name.split(' ')[0]}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {showThemeDropdown && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-2xl border p-3 shadow-2xl z-50 animate-in fade-in ${
                isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <div className="pb-2 border-b border-slate-800/80 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Visual Theme & Gradings
                </span>
              </div>
              <div className="space-y-1.5">
                {allPalettes.map(paletteKey => {
                  const cfg = THEME_CONFIGS[paletteKey];
                  const isSelected = themePalette === paletteKey;
                  return (
                    <button
                      key={paletteKey}
                      onClick={() => {
                        setThemePalette(paletteKey);
                        setShowThemeDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? isDark ? 'bg-blue-600/20 border border-blue-500/40 text-cyan-300 font-bold' : 'bg-blue-50 border border-blue-200 text-blue-700 font-bold'
                          : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-4 w-4 rounded-full ${cfg.swatchGradient} ring-1 ring-white/20`} />
                        <div>
                          <div>{cfg.name}</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {cfg.accentName}
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Theme Toggle (Dark / Light) */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 shadow-2xs'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlertDropdown(!showAlertDropdown);
              setShowThemeDropdown(false);
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs'
            }`}
            title="Trip notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showAlertDropdown && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border p-4 shadow-2xl z-50 animate-in fade-in ${
                isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Notifications
                  </h4>
                  {unreadAlertCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                      {unreadAlertCount} new
                    </span>
                  )}
                </div>
                {unreadAlertCount > 0 && (
                  <button
                    onClick={markAllAlertsRead}
                    className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 mt-3 pr-1">
                {alerts.length === 0 ? (
                  <p className={`text-xs text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No notifications
                  </p>
                ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveTab(alert.targetTab as ActiveTab);
                        setShowAlertDropdown(false);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer text-xs space-y-1 transition-colors ${
                        isDark
                          ? 'bg-slate-950/60 hover:bg-slate-950 border-slate-800/80'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {alert.title}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className={`mt-3 pt-2 border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setShowAlertDropdown(false);
                  }}
                  className="text-xs text-blue-500 hover:underline font-medium cursor-pointer"
                >
                  View all updates →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
