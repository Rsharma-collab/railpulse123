import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { THEME_CONFIGS } from '../../types/theme';
import {
  Train,
  ArrowRight,
  Search,
  Navigation,
  ShieldCheck,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Sliders,
  ChevronRight,
  TrendingUp,
  Cpu,
  Zap,
  Repeat,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const {
    setActiveTab,
    trains,
    setSelectedTrain,
    searchOrigin,
    setSearchOrigin,
    searchDestination,
    setSearchDestination,
    travelDate,
    setTravelDate,
    travelClass,
    setTravelClass,
    swapStations,
    themePalette,
    theme
  } = useRailway();

  const isDark = theme === 'dark';
  const currentTheme = THEME_CONFIGS[themePalette];

  // Interactive Persona Mode: Passenger vs Station Operations
  const [activePersona, setActivePersona] = useState<'passenger' | 'operations'>('passenger');

  // Interactive Live Telemetry Preview in Bento
  const [selectedPreviewStation, setSelectedPreviewStation] = useState<string>('Kanpur Central');

  const popularRoutes = [
    {
      trainNumber: '22436',
      name: 'Vande Bharat Express',
      route: 'New Delhi (NDLS) → Varanasi (BSB)',
      duration: '8h 00m',
      speed: '130 km/h max',
      status: 'On Time',
      statusType: 'ontime'
    },
    {
      trainNumber: '12951',
      name: 'Mumbai Tejas Rajdhani',
      route: 'Mumbai CSMT (CSMT) → New Delhi (NDLS)',
      duration: '15h 32m',
      speed: '120 km/h avg',
      status: '+8m Minor Hold',
      statusType: 'delayed'
    },
    {
      trainNumber: '12028',
      name: 'Shatabdi Express',
      route: 'Bengaluru (SBC) → Chennai Central (MAS)',
      duration: '4h 50m',
      speed: '110 km/h avg',
      status: 'On Time',
      statusType: 'ontime'
    },
    {
      trainNumber: '22895',
      name: 'Vande Bharat Express',
      route: 'Howrah (HWH) → Puri (PURI)',
      duration: '6h 25m',
      speed: '130 km/h max',
      status: 'On Time',
      statusType: 'ontime'
    }
  ];

  const handleSelectPopularRoute = (trainNum: string) => {
    const matched = trains.find(t => t.number === trainNum);
    if (matched) {
      setSelectedTrain(matched);
      setSearchOrigin(matched.source);
      setSearchDestination(matched.destination);
    }
    setActiveTab('dashboard');
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('dashboard');
  };

  return (
    <div className="space-y-16 pb-16 max-w-6xl mx-auto">
      {/* 1. HERO SECTION: High-impact cinematic visual banner with search */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl">
        {/* Background Visual Asset with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_railway_express_1790676571141.jpg"
            alt="Modern aerodynamic high-speed express train gliding across elevated viaduct at blue hour"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-75 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Measured multi-layer contrast scrim ensuring legible WCAG AA text */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className={`absolute inset-0 opacity-40 bg-gradient-to-r ${currentTheme.accentGradient} mix-blend-overlay`} />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white space-y-8">
          {/* Subtle Top Metadata Kicker */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-cyan-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="uppercase tracking-widest text-[11px] font-bold">RailPulse Intelligence Network</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">Active Satellite Lock</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">Real-Time Delay Precedence</span>
          </div>

          {/* Headline & Value Proposition */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Real-Time Railway Intelligence. <br className="hidden sm:inline" />
              <span className={`bg-gradient-to-r ${currentTheme.accentGradient} bg-clip-text text-transparent`}>
                Zero Passenger Panic.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
              High-precision GPS telemetry, explainable delay predictions, automated connection safety buffers, and coach positioning — engineered for both everyday travelers and station dispatch controllers.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg flex items-center gap-2 group cursor-pointer ${currentTheme.primaryButton}`}
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setActiveTab('route_finder')}
              className="px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-700/80 hover:border-slate-500 transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <Search className="h-4 w-4 text-slate-300" />
              <span>Explore Train Routes</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="px-4 py-3 rounded-xl font-medium text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Interactive Network Simulation</span>
            </button>
          </div>

          {/* Embedded Interactive Route Search Box */}
          <div className="pt-4">
            <form
              onSubmit={handleHeroSearch}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/70 backdrop-blur-xl shadow-2xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* From Station */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    From Station
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchOrigin}
                      onChange={e => setSearchOrigin(e.target.value)}
                      placeholder="e.g. Mumbai CSMT (CSMT)"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-1 flex items-center justify-center pt-2 md:pt-4">
                  <button
                    type="button"
                    onClick={swapStations}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-slate-300 hover:text-white transition-all duration-150 cursor-pointer"
                    title="Swap Origin and Destination"
                    aria-label="Swap Origin and Destination"
                  >
                    <Repeat className="h-4 w-4" />
                  </button>
                </div>

                {/* To Station */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    To Station
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchDestination}
                      onChange={e => setSearchDestination(e.target.value)}
                      placeholder="e.g. Bhopal Junction (BPL)"
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="md:col-span-3 pt-2 md:pt-4">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${currentTheme.primaryButton}`}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search & Track</span>
                  </button>
                </div>
              </div>

              {/* Quick Select Popular Corridors */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Popular corridors:</span>
                {popularRoutes.slice(0, 3).map(pr => (
                  <button
                    key={pr.trainNumber}
                    type="button"
                    onClick={() => handleSelectPopularRoute(pr.trainNumber)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="font-mono text-cyan-400">{pr.trainNumber}</span>
                    <span>{pr.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. QUANTITATIVE IMPACT & RIGOR: 4 Unboxed Proof Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-cyan-400">
            99.4%
          </div>
          <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            ETA Accuracy
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Explainable block & rake turnaround modeling
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-emerald-400">
            14,200+
          </div>
          <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Tracked Rail Routes
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Vande Bharat, Rajdhani, Shatabdi & Expresses
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-amber-400">
            &lt; 2.5 min
          </div>
          <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Precedence Resolution
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Automated loop track crossing diagnostics
          </p>
        </div>

        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-indigo-400">
            100%
          </div>
          <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Connection Protection
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Safe transfer buffer and pre-booked cab insurance
          </p>
        </div>
      </section>

      {/* 3. CAPABILITIES BENTO GRID: Asymmetric Visual Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 block mb-1">
              Core Capabilities
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              End-to-End Operational Precision
            </h2>
          </div>
          <p className={`text-xs sm:text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Replacing opaque railway delays with transparent signal metrics, live rake readiness, and calm passenger steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1 (Span 2): Explainable Delay & Dynamic ETA */}
          <div className={`md:col-span-2 p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  DYNAMIC ETA ENGINE
                </span>
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Explainable Arrival Predictions
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Unlike generic train apps that blindly extrapolate past delays, RailPulse inspects the real-time block section occupancy, freight precedence at junctions, and incoming rake turnaround to compute accurate ETAs.
              </p>

              {/* Interactive Micro Telemetry Simulator */}
              <div className={`p-4 rounded-2xl border text-xs space-y-3 mt-4 ${
                isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Signal Block Inspection</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Block B-104 Clear
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewStation('Aligarh Junction')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPreviewStation === 'Aligarh Junction'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">Aligarh Jn</div>
                    <div className="text-[10px] font-mono mt-0.5">+4m (Freight Hold)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewStation('Kanpur Central')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPreviewStation === 'Kanpur Central'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">Kanpur Central</div>
                    <div className="text-[10px] font-mono mt-0.5 text-emerald-400">On Time · P1</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewStation('Prayagraj')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPreviewStation === 'Prayagraj'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">Prayagraj Jn</div>
                    <div className="text-[10px] font-mono mt-0.5">Speed Recovery</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('prediction')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group cursor-pointer"
              >
                <span>View Full Prediction Model</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                12 historical variables evaluated
              </span>
            </div>
          </div>

          {/* Bento Card 2: Operations Room Visual */}
          <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 relative">
              <img
                src="/src/assets/images/railway_control_center_1790676585711.jpg"
                alt="State-of-the-art railway traffic operations control room with glowing digital route walls"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/80 text-cyan-200 border border-cyan-500/30 font-semibold backdrop-blur-md">
                Operations Console
              </span>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Digital Twin Network
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Real-time sectional track modeling, speed restrictions, and automated turnaround telemetry across corridors.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('network')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-between cursor-pointer"
            >
              <span>Explore Network Tracks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bento Card 3: Station Orientation Visual */}
          <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 relative">
              <img
                src="/src/assets/images/train_platform_concourse_1790676598418.jpg"
                alt="Airy modern railway terminal platform with train docked and natural morning sunlight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-500/30 font-semibold backdrop-blur-md">
                Platform Orientation
              </span>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Coach & Concourse Guide
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Know exactly where your coach (B3, A1, C4) docks on the platform 20 minutes before train arrival.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('station_guide')}
              className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between cursor-pointer"
            >
              <span>Locate Coach on Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bento Card 4 (Span 2): Connection & Cab Safety */}
          <div className={`md:col-span-2 p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-indigo-400 font-semibold">
                  SAFETY & TRANSFERS
                </span>
              </div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Missed Transfer Shield & Safe Late-Night Exits
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Travel with total peace of mind. If your primary train incurs a delay, RailPulse alerts connecting train staff, auto-adjusts your pre-booked station pickup cab, and provides lighted exit routes for late-night arrivals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Dynamic Transfer Buffer</span>
                  </div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Monitors platform walking distance and luggage transfer times at interchanges.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Station Perimeter Radar</span>
                  </div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Emergency helpline (139), pre-paid taxi booths, and round-the-clock medical kiosks.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('connection')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group cursor-pointer"
              >
                <span>Setup Transfer Protection</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PASSENGER VS OPERATOR INTERACTIVE SHOWCASE */}
      <section className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Built for Every Railway Stakeholder
            </h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Select a persona to see tailored capabilities in action
            </p>
          </div>

          {/* Persona Segmented Control */}
          <div className={`inline-flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActivePersona('passenger')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePersona === 'passenger'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Passengers
            </button>
            <button
              onClick={() => setActivePersona('operations')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePersona === 'operations'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Rail Controllers & Operations
            </button>
          </div>
        </div>

        {activePersona === 'passenger' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Navigation className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Calm, Step-by-Step Guidance
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No anxiety about sudden track switches or late announcements. Know what to do 30 minutes before arrival.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <MapPin className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Coach & Platform Map
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Stand at the exact platform marker for your coach (AC Tier 2, Sleeper, Chair Car) before the train stops.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Saarthi AI Travel Assistant
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Multilingual AI answers PNR questions, dining options, water refill points, and emergency contacts.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Cpu className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Block Section Congestion Radar
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Observe interlocking signals, automatic signaling headway, and train spacing across critical divisions.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3">
                <Clock className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rake & Crew Readiness Turnaround
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Live telemetry on loco pilot sign-ons, brake power certificates, coach watering, and washing pit clearances.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
                <Activity className="h-4 w-4" />
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dispatch Precedence Optimization
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Simulate precedence decisions between high-priority premium expresses and freight rakes to minimize overall network delay.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. POPULAR VERIFIED CORRIDORS: 1-Click Launch */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Featured National Corridors
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Click any train to load real-time telemetry into the Live Dashboard
            </p>
          </div>
          <button
            onClick={() => setActiveTab('route_finder')}
            className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all trains</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularRoutes.map(item => (
            <div
              key={item.trainNumber}
              onClick={() => handleSelectPopularRoute(item.trainNumber)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 group flex flex-col justify-between ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/50 hover:shadow-lg'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-cyan-400 group-hover:underline">
                    {item.trainNumber}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.statusType === 'ontime'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h4 className={`text-sm font-bold mb-1 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </h4>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.route}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {item.duration} · {item.speed}
                </span>
                <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Track <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BLOCK */}
      <section className={`p-8 sm:p-10 rounded-3xl border relative overflow-hidden text-center space-y-4 ${
        isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800' : 'bg-gradient-to-b from-blue-50 to-white border-blue-100 shadow-sm'
      }`}>
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready for a Stress-Free Journey?
          </h3>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Access the full Operations Command Dashboard with interactive train radar, speed telemetry, and coach positioners right now.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer ${currentTheme.primaryButton}`}
            >
              <span>Open Live Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-search-train'))}
              className={`px-5 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                isDark ? 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-white' : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
              }`}
            >
              Search Train by Number
            </button>
          </div>
        </div>
      </section>

      {/* 7. QUIET FOOTER */}
      <footer className={`pt-8 border-t text-xs space-y-4 ${
        isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-cyan-400" />
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              RailPulse Platform
            </span>
            <span>·</span>
            <span>Intelligent Indian Railways Assistant</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Railway Helpline: Dial 139
            </span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="hover:underline cursor-pointer"
            >
              Preferences & Themes
            </button>
          </div>
        </div>
        <p className="text-[11px] text-center sm:text-left">
          RailPulse correlates live GPS telemetry, signal block status, and train composition. For passenger safety, emergency services can be contacted directly via 139 or the Security Helpdesk.
        </p>
      </footer>
    </div>
  );
};
