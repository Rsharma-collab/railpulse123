import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { StationStop } from '../../types/railway';
import { buildMumbaiToBhopalStops } from '../../services/stationCorridors';
import {
  Navigation,
  Compass,
  Gauge,
  Satellite,
  Clock,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  Info,
  Layers,
  LocateFixed,
  Activity,
  Zap,
  Radio,
  Eye,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Filter,
  Train as TrainIcon
} from 'lucide-react';

type MapViewMode = 'satellite' | 'hybrid' | 'schematic';
type StationFilterMode = 'all' | 'junctions';

export const LiveGpsView: React.FC = () => {
  const {
    selectedTrain,
    gps,
    updateGps,
    updateProgressPercent,
    jumpToStation,
    setActiveTab,
    triggerManualRefresh,
    isRefreshing
  } = useRailway();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapMode, setMapViewMode] = useState<MapViewMode>('satellite');
  const [is3DTilt, setIs3DTilt] = useState<boolean>(true);
  const [followTrain, setFollowTrain] = useState<boolean>(true);
  const [highRefreshRate, setHighRefreshRate] = useState<boolean>(true);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(120);

  // Simple, intuitive live tracker slider & station controls
  const [stationFilter, setStationFilter] = useState<StationFilterMode>('all');
  const [isPlayingRoute, setIsPlayingRoute] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stationRibbonRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  // Speed adjust helper
  const handleSpeedAdjust = (delta: number) => {
    updateGps({ speedKmph: Math.max(0, Math.min(160, gps.speedKmph + delta)) });
  };

  // Convert selected train stops into normalized coordinates
  const stops: StationStop[] = useMemo(() => {
    return selectedTrain.stops && selectedTrain.stops.length > 0
      ? selectedTrain.stops
      : buildMumbaiToBhopalStops('19:05', 27);
  }, [selectedTrain]);

  const junctionsCount = useMemo(() => {
    return stops.filter(s => s.isJunction).length;
  }, [stops]);

  // Current station being approached / at halt
  const currentStopIndex = useMemo(() => {
    const idx = stops.findIndex(s => s.status === 'current');
    return idx !== -1 ? idx : Math.min(stops.length - 1, Math.floor(((gps.progressPercent || 0) / 100) * stops.length));
  }, [stops, gps.progressPercent]);

  const currentStop = stops[currentStopIndex] || stops[0];
  const nextStop = currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1] : currentStop;
  const prevStop = currentStopIndex > 0 ? stops[currentStopIndex - 1] : currentStop;

  // Auto-play / continuous route drive
  useEffect(() => {
    if (!isPlayingRoute) return;
    const interval = setInterval(() => {
      const nextProgress = (gps.progressPercent + 0.3) % 100.1;
      updateProgressPercent(nextProgress > 100 ? 0 : Number(nextProgress.toFixed(1)));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlayingRoute, gps.progressPercent, updateProgressPercent]);

  // Auto-scroll horizontal station ribbon when train advances
  useEffect(() => {
    if (!stationRibbonRef.current) return;
    const activeChip = stationRibbonRef.current.querySelector('[data-active-station="true"]') as HTMLElement;
    if (activeChip) {
      const parent = stationRibbonRef.current;
      const chipLeft = activeChip.offsetLeft;
      const chipWidth = activeChip.offsetWidth;
      const parentWidth = parent.clientWidth;
      parent.scrollTo({
        left: chipLeft - parentWidth / 2 + chipWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentStopIndex]);

  // Stepper buttons for sliding to prev / next station
  const handleStepStation = (direction: 'prev' | 'next') => {
    let targetIdx = direction === 'prev' ? currentStopIndex - 1 : currentStopIndex + 1;
    targetIdx = Math.max(0, Math.min(stops.length - 1, targetIdx));
    const targetStop = stops[targetIdx];
    if (targetStop) {
      jumpToStation(targetStop.code);
    }
  };

  // Dynamic canvas width ensuring every station has ample breathing room
  const canvasWidth = useMemo(() => {
    return Math.max(1600, stops.length * 54);
  }, [stops.length]);

  // Layout points along SVG track canvas
  const stationSvgPoints = useMemo(() => {
    const total = stops.length;
    const paddingLeft = 140;
    const paddingRight = canvasWidth - 140;
    const widthSpan = paddingRight - paddingLeft;

    return stops.map((stop, idx) => {
      const frac = idx / Math.max(1, total - 1);
      const x = paddingLeft + frac * widthSpan;
      // Gentle natural elevation and river valley curvature matching Indian terrain
      const y = 155 + Math.sin(frac * Math.PI * 2.2) * 42;
      return {
        ...stop,
        svgX: x,
        svgY: y,
        frac
      };
    });
  }, [stops, canvasWidth]);

  // Generate smooth SVG curve path through all station nodes
  const { trackPathD, upTrackPathD, sleeperPositions } = useMemo(() => {
    if (stationSvgPoints.length === 0) {
      return { trackPathD: '', upTrackPathD: '', sleeperPositions: [] };
    }

    let d = `M ${stationSvgPoints[0].svgX} ${stationSvgPoints[0].svgY}`;
    let upD = `M ${stationSvgPoints[0].svgX} ${stationSvgPoints[0].svgY + 14}`;

    for (let i = 0; i < stationSvgPoints.length - 1; i++) {
      const p0 = stationSvgPoints[i];
      const p1 = stationSvgPoints[i + 1];
      const cpX1 = p0.svgX + (p1.svgX - p0.svgX) * 0.45;
      const cpY1 = p0.svgY;
      const cpX2 = p0.svgX + (p1.svgX - p0.svgX) * 0.55;
      const cpY2 = p1.svgY;

      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.svgX} ${p1.svgY}`;
      upD += ` C ${cpX1} ${cpY1 + 14}, ${cpX2} ${cpY2 + 14}, ${p1.svgX} ${p1.svgY + 14}`;
    }

    // Generate realistic cross-ties (sleepers) along the track path
    const sleepers: { x: number; y: number; angle: number }[] = [];
    const numSleepers = Math.round(canvasWidth / 14);
    for (let i = 0; i <= numSleepers; i++) {
      const t = i / numSleepers;
      const segIndex = Math.min(
        stationSvgPoints.length - 2,
        Math.floor(t * (stationSvgPoints.length - 1))
      );
      const localT = (t * (stationSvgPoints.length - 1)) - segIndex;
      const p0 = stationSvgPoints[segIndex];
      const p1 = stationSvgPoints[segIndex + 1];

      if (p0 && p1) {
        const x = p0.svgX + (p1.svgX - p0.svgX) * localT;
        const y = p0.svgY + (p1.svgY - p0.svgY) * localT;
        const dx = p1.svgX - p0.svgX;
        const dy = p1.svgY - p0.svgY;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        sleepers.push({ x, y, angle });
      }
    }

    return { trackPathD: d, upTrackPathD: upD, sleeperPositions: sleepers };
  }, [stationSvgPoints, canvasWidth]);

  // Train position calculated smoothly along the path based on 0-100% progress
  const trainPosition = useMemo(() => {
    const progress = Math.max(0, Math.min(1, (gps.progressPercent || 0) / 100));
    const totalSegs = Math.max(1, stationSvgPoints.length - 1);
    const globalT = progress * totalSegs;
    const segIndex = Math.min(totalSegs - 1, Math.floor(globalT));
    const localT = globalT - segIndex;

    const p0 = stationSvgPoints[segIndex];
    const p1 = stationSvgPoints[segIndex + 1] || p0;

    if (!p0) return { x: 380, y: 155, heading: gps.headingDeg || 142 };

    const x = p0.svgX + (p1.svgX - p0.svgX) * localT;
    const y = p0.svgY + (p1.svgY - p0.svgY) * localT;
    const dx = p1.svgX - p0.svgX;
    const dy = p1.svgY - p0.svgY;
    const heading = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { x, y, heading };
  }, [stationSvgPoints, gps.progressPercent, gps.headingDeg]);

  // High-smoothness RAF loop for camera tracking and FPS
  useEffect(() => {
    let active = true;

    const updateLoop = (now: number) => {
      if (!active) return;

      frameCountRef.current += 1;
      const elapsed = now - lastTimeRef.current;

      // Update FPS counter once per 600ms
      if (elapsed >= 600) {
        const calculatedFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(highRefreshRate ? Math.min(120, Math.max(58, calculatedFps)) : 60);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Smooth camera follow
      if (followTrain && containerRef.current) {
        const targetScroll = trainPosition.x - containerRef.current.clientWidth / 2;
        const currentScroll = containerRef.current.scrollLeft;
        const diff = targetScroll - currentScroll;
        if (Math.abs(diff) > 2) {
          containerRef.current.scrollLeft += diff * (highRefreshRate ? 0.12 : 0.06);
        }
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [followTrain, highRefreshRate, trainPosition.x]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* Top Header & Telemetry Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Live Satellite Spatial Kinematics
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {fps} FPS {highRefreshRate ? '· 120Hz ProMotion' : '· 60Hz'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>High-Fidelity Track Geometry & Live GPS</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Interactive Route Tracker
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Train {selectedTrain.number} ({selectedTrain.name}) · {selectedTrain.source} → {selectedTrain.destination} · {stops.length} Total Route Stations
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs text-neutral-300 backdrop-blur-md shadow-xs">
            <Clock className="h-3.5 w-3.5 text-neutral-400" />
            <span>Sync: <strong className="text-white font-mono">{gps.lastUpdatedSecsAgo}s ago</strong></span>
          </div>
          <button
            onClick={triggerManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync Fix</span>
          </button>
        </div>
      </div>

      {/* Primary Kinematic Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Speedometer */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Speedometer</span>
            <Gauge className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">{gps.speedKmph}</span>
            <span className="text-xs text-neutral-400 font-mono">km/h</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={() => handleSpeedAdjust(-5)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Throttle speed down"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              onClick={() => handleSpeedAdjust(5)}
              className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Throttle speed up"
            >
              <Plus className="h-3 w-3" />
            </button>
            <span className="text-[10px] text-neutral-500 ml-1 font-mono">MPS: 130</span>
          </div>
        </div>

        {/* Section / Km */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs col-span-2 sm:col-span-1 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Track Corridor</span>
            <MapPin className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-xs font-bold text-white truncate" title={gps.currentSection}>
            {gps.currentSection}
          </div>
          <span className="text-[11px] text-neutral-400 block mt-1">
            To next: <strong className="text-neutral-200 font-mono">{gps.distanceToNextKm} km</strong>
          </span>
        </div>

        {/* Bearing */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bearing</span>
            <Compass className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">{gps.headingDeg}°</span>
            <span className="text-xs text-neutral-400 font-mono">HEADING</span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1 font-medium">Forward Trajectory</span>
        </div>

        {/* Confidence */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">RTK Accuracy</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">{gps.confidencePct}%</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 block mt-1 font-mono">±0.4m Precision</span>
        </div>

        {/* GNSS Lock */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Constellation</span>
            <Satellite className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">{gps.satellitesLocked}</span>
            <span className="text-xs text-neutral-400 font-mono">Sats</span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1">NavIC + GNSS Active</span>
        </div>

        {/* Altitude */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md shadow-xs hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider">Elevation</span>
            <Navigation className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">{gps.altitudeM}</span>
            <span className="text-xs text-neutral-400 font-mono">m MSL</span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1 font-mono">Corridor Gradient</span>
        </div>
      </div>

      {/* CORE FEATURE: Interactive Live Route Tracking & Station Scrubber Card */}
      <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-5 sm:p-6 shadow-xl space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Route Tracking Scrubber</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {gps.progressPercent}% of Route Covered
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the slider to scrub the train through every small station & junction along the route.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter: All Stations vs Junctions Only */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setStationFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  stationFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Stations ({stops.length})
              </button>
              <button
                type="button"
                onClick={() => setStationFilter('junctions')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  stationFilter === 'junctions'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Junctions Only ({junctionsCount})
              </button>
            </div>

            {/* Auto-drive Simulation Play/Pause button */}
            <button
              type="button"
              onClick={() => setIsPlayingRoute(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                isPlayingRoute
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Automatically drive the train along all stations"
            >
              {isPlayingRoute ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{isPlayingRoute ? 'Pause Drive' : 'Auto Play'}</span>
            </button>
          </div>
        </div>

        {/* Working High-Visibility Route Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Current Position:</span>
              <strong className="text-emerald-400 text-sm">{currentStop.name} ({currentStop.code})</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {currentStop.isJunction ? 'Junction' : currentStop.stationType === 'halt' ? 'Wayside Halt' : 'Station'}
              </span>
            </span>

            <span className="text-xs font-mono text-slate-400">
              Next: <strong className="text-white">{nextStop.name}</strong> ({gps.distanceToNextKm} km away)
            </span>
          </div>

          {/* Interactive Range Input Slider */}
          <div className="relative pt-2 pb-1">
            <input
              type="range"
              min="0"
              max="100"
              step="0.2"
              value={gps.progressPercent}
              onChange={e => updateProgressPercent(parseFloat(e.target.value))}
              aria-label="Route Tracking Progress Slider"
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #059669 ${gps.progressPercent}%, #1e293b ${gps.progressPercent}%, #1e293b 100%)`
              }}
            />
          </div>

          {/* Slider Endpoints and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className="font-bold text-white">{selectedTrain.source}</span>
              <span>(0 km)</span>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleStepStation('prev')}
                disabled={currentStopIndex === 0}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium disabled:opacity-40 transition-colors"
                title="Go to previous station"
              >
                <SkipBack className="h-3 w-3" />
                <span>Prev Station</span>
              </button>

              <span className="text-[11px] font-mono text-emerald-400 px-2">
                Stop {currentStopIndex + 1} of {stops.length}
              </span>

              <button
                type="button"
                onClick={() => handleStepStation('next')}
                disabled={currentStopIndex >= stops.length - 1}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium disabled:opacity-40 transition-colors"
                title="Go to next station"
              >
                <span>Next Station</span>
                <SkipForward className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => jumpToStation(currentStop.code)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Snap to station"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className="font-bold text-white">{selectedTrain.destination}</span>
              <span>({selectedTrain.totalDistanceKm} km)</span>
            </div>
          </div>
        </div>

        {/* Horizontal All Stations Sequence Ribbon (Every small station between junctions is listed!) */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">
              Click any station below to jump train location directly to it:
            </span>
            <span className="font-mono text-emerald-400">
              {currentStop.distanceKm} km traveled · {Math.max(0, selectedTrain.totalDistanceKm - currentStop.distanceKm)} km remaining
            </span>
          </div>

          <div
            ref={stationRibbonRef}
            className="flex items-center gap-2 overflow-x-auto py-2 px-1 scroll-smooth scrollbar-thin"
          >
            {stops
              .filter(s => (stationFilter === 'all' ? true : s.isJunction))
              .map(st => {
                const isPassed = st.status === 'passed';
                const isCurrent = st.status === 'current';
                const isUpcoming = st.status === 'upcoming';

                return (
                  <button
                    key={st.code}
                    type="button"
                    data-active-station={isCurrent}
                    onClick={() => jumpToStation(st.code)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-950/80 text-white shadow-md ring-2 ring-emerald-500/40 scale-105'
                        : isPassed
                        ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        : 'border-slate-800/80 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isCurrent
                          ? 'bg-emerald-400 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold">{st.code}</span>
                        {st.isJunction && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                            JN
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[110px]" title={st.name}>
                        {st.name}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Realistic Interactive Railway Track Map */}
      <div className="relative rounded-3xl border border-neutral-800/90 bg-neutral-950 shadow-2xl overflow-hidden">
        {/* Google Maps Style Top HUD Controls Bar */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10 relative">
          {/* Map Layer Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <button
              onClick={() => setMapViewMode('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Satellite className="h-3.5 w-3.5" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setMapViewMode('hybrid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mapMode === 'hybrid'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Hybrid</span>
            </button>
            <button
              onClick={() => setMapViewMode('schematic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mapMode === 'schematic'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Tactical CTC</span>
            </button>
          </div>

          {/* Perspective & High Smoothness Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIs3DTilt(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                is3DTilt
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Google Maps 3D Angle Tilt"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{is3DTilt ? '3D Angled' : '2D Overhead'}</span>
            </button>

            <button
              onClick={() => setHighRefreshRate(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                highRefreshRate
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
              title="Toggle 120Hz Ultra Smooth Refresh Rate Interpolation"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{highRefreshRate ? '120Hz ProMotion' : '60Hz Standard'}</span>
            </button>

            <button
              onClick={() => setFollowTrain(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                followTrain
                  ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
              title="Auto-center camera on train movement"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              <span>{followTrain ? 'Centering On' : 'Free Pan'}</span>
            </button>

            <div className="flex items-center gap-1 border-l border-neutral-800 pl-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.2))}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Map Canvas Container with Smooth Scroll & 3D Perspective */}
        <div
          ref={containerRef}
          className="w-full overflow-x-auto overflow-y-hidden py-8 px-4 cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollBehavior: highRefreshRate ? 'auto' : 'smooth',
            perspective: is3DTilt ? '1200px' : 'none'
          }}
        >
          <div
            style={{
              transform: `scale(${zoomLevel}) ${is3DTilt ? 'rotateX(26deg) rotateZ(-0.5deg)' : ''}`,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              width: `${canvasWidth}px`
            }}
            className="min-w-full"
          >
            <svg
              viewBox={`0 0 ${canvasWidth} 340`}
              className="w-full h-auto overflow-visible"
              style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))' }}
            >
              <defs>
                {/* Photorealistic Satellite Terrain Pattern */}
                <pattern id="satelliteTerrain" patternUnits="userSpaceOnUse" width="220" height="220">
                  <rect width="220" height="220" fill="#0d1512" />
                  <path d="M 0 40 Q 60 20, 110 50 T 220 30 L 220 0 L 0 0 Z" fill="#0b1b15" opacity="0.6" />
                  <path d="M 20 160 Q 90 140, 150 180 T 220 150 L 220 220 L 0 220 Z" fill="#0e2319" opacity="0.5" />
                  <path d="M 0 90 Q 70 80, 140 100 T 220 85" fill="none" stroke="#132e22" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
                  <path d="M 0 130 Q 80 120, 160 140 T 220 125" fill="none" stroke="#132e22" strokeWidth="1" strokeDasharray="8 6" opacity="0.3" />
                  <rect x="30" y="30" width="40" height="35" fill="#11291f" opacity="0.25" rx="3" />
                  <rect x="85" y="25" width="55" height="40" fill="#0c1f17" opacity="0.2" rx="3" />
                  <rect x="25" y="165" width="50" height="45" fill="#143125" opacity="0.3" rx="4" />
                  <rect x="130" y="155" width="60" height="50" fill="#0e241b" opacity="0.2" rx="4" />
                </pattern>

                {/* River / Waterbody Shader */}
                <linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
                </linearGradient>

                {/* Ballast embankment gradient */}
                <linearGradient id="ballastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#334155" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
                </linearGradient>

                {/* Electric Rail Glow Filter */}
                <filter id="satelliteGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Active Train Glow */}
                <filter id="trainPulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. MAP BACKGROUND LAYER: Satellite Photorealistic or Schematic Grid */}
              {mapMode === 'satellite' || mapMode === 'hybrid' ? (
                <g id="satelliteBaseLayer">
                  <rect x="0" y="0" width={canvasWidth} height="340" fill="url(#satelliteTerrain)" rx="16" />

                  {/* Narmada river valley crossing visual bridge near Itarsi/Narmadapuram */}
                  <path
                    d={`M ${canvasWidth * 0.8} 0 C ${canvasWidth * 0.82} 80, ${canvasWidth * 0.78} 180, ${canvasWidth * 0.83} 340`}
                    fill="none"
                    stroke="url(#riverGradient)"
                    strokeWidth="38"
                    strokeLinecap="round"
                  />
                  <text x={canvasWidth * 0.81} y="45" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.8">
                    Narmada River Basin
                  </text>
                </g>
              ) : (
                <g id="tacticalGridLayer">
                  <rect x="0" y="0" width={canvasWidth} height="340" fill="#090d16" rx="16" />
                  <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.7">
                    <line x1="50" y1="50" x2={canvasWidth - 50} y2="50" />
                    <line x1="50" y1="110" x2={canvasWidth - 50} y2="110" />
                    <line x1="50" y1="170" x2={canvasWidth - 50} y2="170" />
                    <line x1="50" y1="230" x2={canvasWidth - 50} y2="230" />
                    <line x1="50" y1="280" x2={canvasWidth - 50} y2="280" />
                  </g>
                </g>
              )}

              {/* 2. BALLAST EMBANKMENT BED (Real Railway Civil Geometry) */}
              <path
                d={trackPathD}
                fill="none"
                stroke="url(#ballastGradient)"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* Concrete Sleepers (Cross-ties) along Track Alignment */}
              <g id="sleepers">
                {sleeperPositions.map((slp, idx) => (
                  <line
                    key={idx}
                    x1={slp.x - 7 * Math.cos((slp.angle * Math.PI) / 180)}
                    y1={slp.y - 7 * Math.sin((slp.angle * Math.PI) / 180)}
                    x2={slp.x + 7 * Math.cos((slp.angle * Math.PI) / 180)}
                    y2={slp.y + 7 * Math.sin((slp.angle * Math.PI) / 180)}
                    stroke="#94a3b8"
                    strokeWidth="1.8"
                    opacity="0.65"
                  />
                ))}
              </g>

              {/* 3. DUAL RUNNING RAILS */}
              <path
                d={trackPathD}
                fill="none"
                stroke="#047857"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
              <path
                d={trackPathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={mapMode !== 'schematic' ? 'url(#satelliteGlow)' : undefined}
              />

              {/* Up Main Parallel Track */}
              <path
                d={upTrackPathD}
                fill="none"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.75"
              />
              <path
                d={upTrackPathD}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="10 4"
                opacity="0.8"
              />

              {/* 4. STATION NODES & PLATFORM PINS (Every Small Station & Junction!) */}
              {stationSvgPoints.map((st, i) => {
                const isPassed = st.status === 'passed';
                const isCurrent = st.status === 'current';
                const isUpcoming = st.status === 'upcoming';
                const isJunction = !!st.isJunction;

                // When user selects "Junctions Only", we only render text labels for junctions
                const showLabel = stationFilter === 'all' || isJunction;

                return (
                  <g
                    key={st.code}
                    transform={`translate(${st.svgX}, ${st.svgY})`}
                    onClick={() => jumpToStation(st.code)}
                    className="cursor-pointer group"
                  >
                    <title>
                      {st.name} ({st.code}) - Km {st.distanceKm} | Platform {st.platform || '1'} | Status: {st.status}
                    </title>

                    {/* Outer pulse for current active station */}
                    {isCurrent && (
                      <circle r={isJunction ? 24 : 18} fill="#10b981" opacity="0.2">
                        <animate attributeName="r" values="14;28;14" dur="2.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Main Station Marker Pin */}
                    <circle
                      r={isCurrent ? (isJunction ? 10 : 8) : isJunction ? 8 : 5}
                      fill={
                        isCurrent
                          ? '#10b981'
                          : isPassed
                          ? '#059669'
                          : isJunction
                          ? '#3b82f6'
                          : '#64748b'
                      }
                      stroke="#ffffff"
                      strokeWidth={isJunction ? 2.5 : 1.5}
                      filter={isCurrent ? 'url(#satelliteGlow)' : undefined}
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Station Name & City */}
                    {showLabel && (
                      <g>
                        <text
                          x="0"
                          y={i % 2 === 0 ? -22 : 36}
                          fill={isCurrent ? '#34d399' : isJunction ? '#ffffff' : '#cbd5e1'}
                          fontSize={isCurrent ? '13' : isJunction ? '11.5' : '10'}
                          fontWeight={isCurrent || isJunction ? '800' : '600'}
                          textAnchor="middle"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.95)' }}
                        >
                          {st.name}
                          {isJunction && !st.name.includes('Jn') ? ' Jn' : ''}
                        </text>

                        {/* Kilometer and Platform Guide */}
                        <text
                          x="0"
                          y={i % 2 === 0 ? -9 : 49}
                          fill={isCurrent ? '#fcd34d' : isJunction ? '#93c5fd' : '#94a3b8'}
                          fontSize={isJunction ? '9.5' : '8.5'}
                          fontFamily="sans-serif"
                          fontWeight="500"
                          textAnchor="middle"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                        >
                          {st.code} · Km {st.distanceKm}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* 5. REAL-TIME SMOOTH TRAIN MARKER & SPEEDOMETER RADAR */}
              <g
                transform={`translate(${trainPosition.x}, ${trainPosition.y})`}
                filter="url(#trainPulseGlow)"
                style={{
                  transition: highRefreshRate ? 'transform 0.12s linear' : 'transform 0.35s ease-out'
                }}
              >
                {/* Sonar Radar Wave */}
                <circle r="26" fill="#10b981" opacity="0.25">
                  <animate attributeName="r" values="16;38;16" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Train Engine Body (High-detail aerodynamic WAP-7 / Vande Bharat cab) */}
                <g transform={`rotate(${trainPosition.heading})`}>
                  <rect
                    x="-20"
                    y="-9"
                    width="40"
                    height="18"
                    rx="5"
                    fill="#064e3b"
                    stroke="#10b981"
                    strokeWidth="2.2"
                  />
                  <path d="M 20 -7 L 28 0 L 20 7 Z" fill="#10b981" />
                  <rect x="10" y="-6" width="6" height="12" rx="2" fill="#38bdf8" opacity="0.9" />
                  <polygon points="28,-4 65,-18 65,18 28,4" fill="#fef08a" opacity="0.25" />
                </g>

                {/* Live Floating Telemetry Pin above the Train */}
                <g transform="translate(0, -32)">
                  <rect
                    x="-75"
                    y="-13"
                    width="150"
                    height="22"
                    rx="6"
                    fill="#090d16"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.85))' }}
                  />
                  <circle cx="-60" cy="-2" r="3.5" fill="#10b981" className="animate-ping" />
                  <circle cx="-60" cy="-2" r="3" fill="#10b981" />
                  <text
                    x="4"
                    y="2"
                    fill="#ffffff"
                    fontSize="10.5"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {selectedTrain.number} · {gps.speedKmph} km/h
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Spatial Coordinates & Scale Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-5 flex-wrap">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Current Station</span>
              <span className="text-neutral-200 font-mono font-bold">{currentStop.name} ({currentStop.code})</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Latitude</span>
              <span className="text-neutral-200 font-mono font-bold">{gps.lat.toFixed(5)}° N</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Longitude</span>
              <span className="text-neutral-200 font-mono font-bold">{gps.lng.toFixed(5)}° E</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Route Progress</span>
              <span className="text-emerald-400 font-mono font-bold">{gps.progressPercent}% ({currentStop.distanceKm} / {selectedTrain.totalDistanceKm} km)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('timeline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Full {stops.length}-Station Timeline →</span>
            </button>
            <button
              onClick={() => setActiveTab('digital_twin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Signal Digital Twin →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Active Station / Halt
          </div>
          <div className="text-sm font-bold text-white mb-1">
            {currentStop.name} ({currentStop.code})
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Platform {currentStop.platform} · {currentStop.coachPositionGuide || 'Main line platform entry'}.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Upcoming Halt
          </div>
          <div className="text-sm font-bold text-white mb-1">
            {nextStop.name} ({nextStop.code})
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Distance: {gps.distanceToNextKm} km · Scheduled arrival: {nextStop.scheduledArr || 'On Time'}.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-md">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Active Route Location
          </div>
          <div className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Dewas Area / Indore Area</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Continuous 4-aspect Kavach track signaling across {stops.length} route stations ({selectedTrain.source} → {selectedTrain.destination}).
          </p>
        </div>
      </div>
    </div>
  );
};
