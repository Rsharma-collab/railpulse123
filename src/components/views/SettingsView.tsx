import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { THEME_CONFIGS, ThemePalette } from '../../types/theme';
import {
  Settings,
  Sun,
  Moon,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Bell,
  HardDrive,
  Palette,
  Sparkles,
  Download,
  FileArchive
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    themePalette,
    setThemePalette,
    isOfflineMode,
    setIsOfflineMode,
    resetSimulation,
    lastSyncTime,
    triggerManualRefresh
  } = useRailway();

  const [cacheClearedNotice, setCacheClearedNotice] = useState(false);
  const isDark = theme === 'dark';
  const allPalettes: ThemePalette[] = ['midnight', 'sunset', 'emerald', 'royal', 'daylight'];

  const handleClearCache = () => {
    try {
      localStorage.removeItem('railpulse_saved_journeys');
      localStorage.removeItem('railpulse_alerts');
      setCacheClearedNotice(true);
      setTimeout(() => setCacheClearedNotice(false), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Preferences & Visual Themes
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Customize visual themes, color gradings, offline mode, and data storage.
        </p>
      </div>

      {cacheClearedNotice && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Trip cache cleared successfully.</span>
        </div>
      )}

      {/* Section 1: Color Gradings & Visual Themes */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Palette className="h-4 w-4 text-cyan-400" />
              <span>Color Gradings & Themes</span>
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select an authentic, eye-catching color grading system for the platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {allPalettes.map(paletteKey => {
            const cfg = THEME_CONFIGS[paletteKey];
            const isSelected = themePalette === paletteKey;

            return (
              <div
                key={paletteKey}
                onClick={() => setThemePalette(paletteKey)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-950/80 shadow-md ring-2 ring-cyan-500/20'
                    : isDark
                    ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${cfg.swatchGradient} ring-1 ring-white/30`} />
                      <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {cfg.name}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cfg.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className={cfg.accentText}>{cfg.accentName}</span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    {cfg.isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Quick Light / Dark Mode Toggle */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-2xs'
        }`}
      >
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Base Mode Toggle
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Quickly switch between dark and light modes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Dark Mode Choice */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
              isDark
                ? 'border-blue-500 bg-slate-950 text-white shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-amber-400">
              <Moon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Dark Mode</span>
                {isDark && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deep midnight slate, comfortable in low light.
              </p>
            </div>
          </div>

          {/* Light Mode Choice */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
              !isDark
                ? 'border-blue-500 bg-white text-slate-900 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sun className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Light Mode</span>
                {!isDark && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Clean bright daylight background, crisp text.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Offline & Connectivity */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-2xs'
        }`}
      >
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Connectivity & Live Updates
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Control live location updates and offline schedule caching.
          </p>
        </div>

        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Offline Travel Mode
            </span>
            <p className={isDark ? 'text-slate-400 mt-0.5' : 'text-slate-500 mt-0.5'}>
              Saves station stops and schedules to device memory for travel in tunnel/low-network zones.
            </p>
          </div>
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-colors ${
              isOfflineMode
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {isOfflineMode ? 'Offline Enabled' : 'Live Online'}
          </button>
        </div>

        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Last Data Synchronization
            </span>
            <span className={`font-mono mt-0.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lastSyncTime}
            </span>
          </div>
          <button
            onClick={triggerManualRefresh}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
            }`}
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Section: Download Source Code Zip */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <FileArchive className="h-4 w-4 text-cyan-400" />
              <span>Download Project Package (.zip)</span>
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Export the complete codebase archive for local development, backup, or standalone deployment.
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="font-semibold text-sm">railpulse-app.zip</div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Complete source package with React frontend, Tailwind CSS, Express backend, and assets (~2.9 MB).
            </div>
          </div>
          <a
            href="/railpulse-app.zip"
            download="railpulse-app.zip"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center gap-2 shrink-0 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            <span>Download ZIP</span>
          </a>
        </div>
      </div>

      {/* Section 3: Data & Reset */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-2xs'
        }`}
      >
        <div>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Storage & Local Data
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage locally saved trip history and notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleClearCache}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Clear Saved Trips & Cache</span>
          </button>

          <button
            onClick={resetSimulation}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
