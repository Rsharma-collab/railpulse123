import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Train,
  GPSLocation,
  Signal,
  BlockSection,
  Junction,
  CrewStatus,
  RakeStatus,
  HistoricalMetric,
  ETAPrediction,
  Connection,
  StationFacility,
  SmartAlert,
  AlertSeverity,
  SavedJourney,
  CongestionLevel,
  SignalAspect
} from '../types/railway';
import { ThemePalette, THEME_CONFIGS } from '../types/theme';
import {
  INITIAL_TRAINS,
  INITIAL_SIGNALS,
  INITIAL_BLOCKS,
  INITIAL_JUNCTIONS,
  INITIAL_CREW,
  INITIAL_RAKE,
  INITIAL_HISTORICAL,
  INITIAL_CONNECTIONS,
  INITIAL_FACILITIES,
  INITIAL_ALERTS,
  SIMULATION_PIPELINE_STEPS,
  findTrainsForRoute
} from '../services/mockRailwayData';
import { computeETAPrediction, recalculateConnections } from '../services/railwayEngine';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'home'
  | 'route_finder'
  | 'gps'
  | 'network'
  | 'crew_rake'
  | 'historical'
  | 'prediction'
  | 'digital_twin'
  | 'timeline'
  | 'connection'
  | 'station_guide'
  | 'alerts'
  | 'discovery'
  | 'operations'
  | 'my_journeys'
  | 'settings'
  | 'simulation';

interface RailwayContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  canGoBack: boolean;
  goBack: () => void;
  previousTab: ActiveTab | null;
  trains: Train[];
  selectedTrain: Train;
  setSelectedTrain: (train: Train) => void;
  searchTrainQuery: string;
  setSearchTrainQuery: (q: string) => void;
  // Route selection and assistance
  searchOrigin: string;
  setSearchOrigin: (s: string) => void;
  searchDestination: string;
  setSearchDestination: (s: string) => void;
  travelDate: string;
  setTravelDate: (d: string) => void;
  travelClass: string;
  setTravelClass: (c: string) => void;
  availableTrainsForRoute: Train[];
  selectTrainAndAssist: (train: Train) => void;
  swapStations: () => void;
  assistanceMode: 'calm' | 'advanced';
  setAssistanceMode: (mode: 'calm' | 'advanced') => void;
  gps: GPSLocation;
  updateGps: (partial: Partial<GPSLocation>) => void;
  signals: Signal[];
  blocks: BlockSection[];
  junctions: Junction[];
  crew: CrewStatus;
  rake: RakeStatus;
  historical: HistoricalMetric;
  prediction: ETAPrediction;
  connections: Connection[];
  addConnection: (connection: Omit<Connection, 'id' | 'riskLevel' | 'bufferRemainingMin' | 'guidance'>) => void;
  removeConnection: (id: string) => void;
  facilities: StationFacility[];
  alerts: SmartAlert[];
  unreadAlertCount: number;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addAlert: (alertData: {
    type: SmartAlert['type'];
    title: string;
    message: string;
    severity: AlertSeverity;
    targetTab?: string;
    category?: 'journey' | 'network' | 'operations' | 'connection';
  }) => void;
  savedJourneys: SavedJourney[];
  saveCurrentJourney: (pnr?: string, coach?: string, berth?: string) => void;
  removeSavedJourney: (id: string) => void;
  renameSavedJourney: (id: string, name: string) => void;
  // Simulation controls
  isSimulating: boolean;
  simStep: number;
  simSpeed: 1 | 2 | 5;
  setSimSpeed: (s: 1 | 2 | 5) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  nextSimStep: () => void;
  prevSimStep: () => void;
  jumpToSimStep: (stepNumber: number) => void;
  // Live Route Tracking Slider Controls
  updateProgressPercent: (percent: number) => void;
  jumpToStation: (stopCode: string) => void;
  // System states
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  lastSyncTime: string;
  triggerManualRefresh: () => void;
  isRefreshing: boolean;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  themePalette: ThemePalette;
  setThemePalette: (p: ThemePalette) => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

const SAVED_JOURNEYS_KEY = 'railpulse_saved_journeys';
const ALERTS_KEY = 'railpulse_alerts';
const THEME_KEY = 'railpulse_theme';
const THEME_PALETTE_KEY = 'railpulse_theme_palette';

export const RailwayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('landing');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>([]);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(current => {
      if (current === tab) return current;
      setTabHistory(prev => [...prev, current]);
      return tab;
    });
  };

  const goBack = () => {
    setTabHistory(prev => {
      if (prev.length === 0) {
        setActiveTabState('landing');
        return [];
      }
      const newHistory = [...prev];
      const previous = newHistory.pop() || 'landing';
      setActiveTabState(previous);
      return newHistory;
    });
  };

  const canGoBack = (activeTab !== 'landing' && activeTab !== 'dashboard') || tabHistory.length > 0;
  const previousTab = tabHistory.length > 0 ? tabHistory[tabHistory.length - 1] : (activeTab !== 'landing' ? 'landing' : null);

  const [trains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<Train>(INITIAL_TRAINS[0]);
  const [searchTrainQuery, setSearchTrainQuery] = useState('');

  const [themePalette, setThemePaletteState] = useState<ThemePalette>(() => {
    try {
      const savedPalette = localStorage.getItem(THEME_PALETTE_KEY) as ThemePalette | null;
      if (savedPalette && THEME_CONFIGS[savedPalette]) {
        return savedPalette;
      }
      const legacyTheme = localStorage.getItem(THEME_KEY);
      if (legacyTheme === 'light') return 'daylight';
    } catch (e) {
      console.warn(e);
    }
    return 'midnight';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedPalette = localStorage.getItem(THEME_PALETTE_KEY) as ThemePalette | null;
      if (savedPalette === 'daylight') return 'light';
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'dark';
  });

  const setThemePalette = (palette: ThemePalette) => {
    setThemePaletteState(palette);
    const newTheme = palette === 'daylight' ? 'light' : 'dark';
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_PALETTE_KEY, palette);
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.warn(e);
    }
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    const nextPalette: ThemePalette = t === 'light' ? 'daylight' : (themePalette === 'daylight' ? 'midnight' : themePalette);
    setThemePaletteState(nextPalette);
    try {
      localStorage.setItem(THEME_KEY, t);
      localStorage.setItem(THEME_PALETTE_KEY, nextPalette);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes first
    root.classList.remove('theme-midnight', 'theme-sunset', 'theme-emerald', 'theme-royal', 'theme-daylight');
    root.classList.add(`theme-${themePalette}`);

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme, themePalette]);

  // Route Planning & Panic-Free Assistance State
  const [searchOrigin, setSearchOrigin] = useState('Mumbai CSMT (CSMT)');
  const [searchDestination, setSearchDestination] = useState('Bhopal Junction (BPL)');
  const [travelDate, setTravelDate] = useState('Today, 28 Sep');
  const [travelClass, setTravelClass] = useState('All Classes');
  const [assistanceMode, setAssistanceMode] = useState<'calm' | 'advanced'>('calm');

  const swapStations = () => {
    const temp = searchOrigin;
    setSearchOrigin(searchDestination);
    setSearchDestination(temp);
  };

  // Find trains matching the searched route
  const availableTrainsForRoute = useMemo(() => {
    return findTrainsForRoute(searchOrigin, searchDestination, trains);
  }, [searchOrigin, searchDestination, trains]);

  const selectTrainAndAssist = (train: Train) => {
    setSelectedTrain(train);
    const curStop = train.stops.find(s => s.status === 'current') || train.stops[0];
    const nextStop = train.stops.find(s => s.status === 'upcoming') || train.stops[train.stops.length - 1];
    const prevStop = train.stops.find(s => s.status === 'passed') || train.stops[0];

    setGps(prev => ({
      ...prev,
      lat: curStop.coordinates.lat,
      lng: curStop.coordinates.lng,
      currentSection: `${curStop.name} Approach Section`,
      prevStation: prevStop ? `${prevStop.name} (${prevStop.code})` : curStop.name,
      nextStation: nextStop ? `${nextStop.name} (${nextStop.code})` : curStop.name,
      distanceToNextKm: Math.max(1.2, Math.round(Math.abs(curStop.distanceKm - (nextStop?.distanceKm || 0)) * 0.4)),
      progressPercent: Math.min(95, Math.max(15, Math.round((curStop.distanceKm / (train.totalDistanceKm || 1)) * 100)))
    }));

    // Auto add a reassuring notification to alerts
    const assistAlert: SmartAlert = {
      id: `alt-assist-${Date.now()}`,
      type: 'BOARDING_REMINDER',
      title: `Assistance Activated: ${train.name}`,
      message: `RailPulse is actively monitoring train ${train.number}. Platform, coach radar, and delay protection ready.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      severity: 'success',
      targetTab: 'home',
      category: 'journey'
    };
    setAlerts(prev => [assistAlert, ...prev]);
    setActiveTab('home');

    // Smoothly autoscroll to the result section / journey companion
    setTimeout(() => {
      const el = document.getElementById('passenger-assistance-hub') || document.getElementById('current-journey-result');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // GPS state initialized for Train 12153 Mumbai - Bhopal Express (currently approaching Bhusaval Jn)
  const [gps, setGps] = useState<GPSLocation>({
    lat: 21.0055,
    lng: 75.5667,
    altitudeM: 260,
    speedKmph: 88,
    headingDeg: 78,
    currentSection: 'Jalgaon Jn - Bhusaval Jn 3rd Line (Km 432.5)',
    prevStation: 'Jalgaon Jn (JL)',
    nextStation: 'Bhusaval Jn (BSL)',
    distanceToNextKm: 12.5,
    progressPercent: 50,
    lastUpdatedSecsAgo: 8,
    confidencePct: 98,
    satellitesLocked: 16
  });

  // Network elements
  const [signals, setSignals] = useState<Signal[]>(INITIAL_SIGNALS);
  const [blocks, setBlocks] = useState<BlockSection[]>(INITIAL_BLOCKS);
  const [junctions, setJunctions] = useState<Junction[]>(INITIAL_JUNCTIONS);

  // Operations elements
  const [crew, setCrew] = useState<CrewStatus>(INITIAL_CREW);
  const [rake, setRake] = useState<RakeStatus>(INITIAL_RAKE);

  // Historical metrics
  const [historical] = useState<HistoricalMetric>(INITIAL_HISTORICAL);

  // Connections
  const [rawConnections, setRawConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);

  // Facilities
  const [facilities] = useState<StationFacility[]>(INITIAL_FACILITIES);

  // Alerts
  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read alerts from localStorage', e);
    }
    return INITIAL_ALERTS;
  });

  // Saved journeys
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_JOURNEYS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read journeys from localStorage', e);
    }
    return [
      {
        id: 'sj-1',
        trainNumber: '12951',
        trainName: 'Mumbai Rajdhani Express',
        source: 'Bhopal Jn',
        destination: 'Mumbai Central',
        date: 'Today, 28 Sep',
        pnr: '284-9182741',
        coach: 'B4',
        berth: '32 (Side Lower)',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sj-2',
        trainNumber: '20901',
        trainName: 'Vande Bharat Express',
        source: 'Mumbai Central',
        destination: 'Gandhinagar Capital',
        date: '02 Oct 2026',
        pnr: '631-4091823',
        coach: 'EC1',
        berth: '14 (Window)',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(1);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);

  // System states
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('15:18:24 IST');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts to localStorage', e);
    }
  }, [alerts]);

  // Persist saved journeys to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_JOURNEYS_KEY, JSON.stringify(savedJourneys));
    } catch (e) {
      console.warn('Failed to save journeys to localStorage', e);
    }
  }, [savedJourneys]);

  // Periodic GPS pulse simulation to keep the interface lively
  useEffect(() => {
    const timer = setInterval(() => {
      setGps(prev => ({
        ...prev,
        lastUpdatedSecsAgo: (prev.lastUpdatedSecsAgo + 1) % 60,
        // minor speed variation +/- 1 kmph
        speedKmph: Math.max(0, prev.speedKmph + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute ETA Prediction dynamically
  const prediction: ETAPrediction = useMemo(() => {
    const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1];
    return computeETAPrediction({
      scheduledArrival: currentStop.scheduledArr,
      currentObservedDelayMin: currentStop.delayArrMin,
      junctions,
      blocks,
      crew,
      rake,
      historical,
      speedKmph: gps.speedKmph
    });
  }, [selectedTrain, junctions, blocks, crew, rake, historical, gps.speedKmph]);

  // Dynamic Connection Protection
  const connections: Connection[] = useMemo(() => {
    return recalculateConnections(prediction.predictedETA, rawConnections);
  }, [prediction.predictedETA, rawConnections]);

  const unreadAlertCount = useMemo(() => {
    return alerts.filter(a => !a.read).length;
  }, [alerts]);

  const updateGps = (partial: Partial<GPSLocation>) => {
    setGps(prev => ({ ...prev, ...partial }));
  };

  const addConnection = (conn: Omit<Connection, 'id' | 'riskLevel' | 'bufferRemainingMin' | 'guidance'>) => {
    const newConn: Connection = {
      ...conn,
      id: `conn-${Date.now()}`,
      riskLevel: 'SAFE',
      bufferRemainingMin: 30,
      guidance: `Proceed towards ${conn.platformOrGate}.`
    };
    setRawConnections(prev => [...prev, newConn]);
  };

  const removeConnection = (id: string) => {
    setRawConnections(prev => prev.filter(c => c.id !== id));
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const addAlert = (alertData: {
    type: SmartAlert['type'];
    title: string;
    message: string;
    severity: AlertSeverity;
    targetTab?: string;
    category?: 'journey' | 'network' | 'operations' | 'connection';
  }) => {
    const newAlert: SmartAlert = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: alertData.type,
      title: alertData.title,
      message: alertData.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      severity: alertData.severity,
      targetTab: alertData.targetTab || 'alerts',
      category: alertData.category || 'operations'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const saveCurrentJourney = (pnr?: string, coach?: string, berth?: string) => {
    const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[0];
    const newJourney: SavedJourney = {
      id: `sj-${Date.now()}`,
      trainNumber: selectedTrain.number,
      trainName: selectedTrain.name,
      source: selectedTrain.source,
      destination: selectedTrain.destination,
      date: 'Today, 28 Sep',
      pnr: pnr || `249-${Math.floor(1000000 + Math.random() * 9000000)}`,
      coach: coach || 'B4',
      berth: berth || '24 (Lower)',
      createdAt: new Date().toISOString()
    };
    setSavedJourneys(prev => [newJourney, ...prev]);

    // Push notification
    const alert: SmartAlert = {
      id: `alt-${Date.now()}`,
      type: 'BOARDING_REMINDER' as any,
      title: 'Journey Saved to RailPulse',
      message: `${selectedTrain.name} (${selectedTrain.number}) saved to My Journeys.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      severity: 'success',
      targetTab: 'my_journeys',
      category: 'journey'
    };
    setAlerts(prev => [alert, ...prev]);
  };

  const removeSavedJourney = (id: string) => {
    setSavedJourneys(prev => prev.filter(j => j.id !== id));
  };

  const renameSavedJourney = (id: string, name: string) => {
    setSavedJourneys(prev => prev.map(j => (j.id === id ? { ...j, trainName: name } : j)));
  };

  const triggerManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString() + ' IST');
      setIsRefreshing(false);
      setGps(prev => ({
        ...prev,
        lastUpdatedSecsAgo: 0,
        speedKmph: Math.floor(65 + Math.random() * 25)
      }));
    }, 600);
  };

  // Live Route Tracking Slider Handler
  const updateProgressPercent = (newPercent: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newPercent * 10) / 10));
    const stops = selectedTrain.stops;
    if (!stops || stops.length === 0) {
      setGps(prev => ({ ...prev, progressPercent: clamped }));
      return;
    }

    const totalStops = stops.length;
    const floatIdx = (clamped / 100) * (totalStops - 1);
    const curIdx = Math.min(totalStops - 1, Math.max(0, Math.round(floatIdx)));
    const segIdx = Math.min(totalStops - 2, Math.max(0, Math.floor(floatIdx)));
    const segT = floatIdx - segIdx;

    const p0 = stops[segIdx];
    const p1 = stops[Math.min(totalStops - 1, segIdx + 1)];

    // Interpolate coordinates
    const curLat = p0.coordinates.lat + (p1.coordinates.lat - p0.coordinates.lat) * segT;
    const curLng = p0.coordinates.lng + (p1.coordinates.lng - p0.coordinates.lng) * segT;

    // Calculate heading angle
    const dLat = p1.coordinates.lat - p0.coordinates.lat;
    const dLng = p1.coordinates.lng - p0.coordinates.lng;
    const rawHeading = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
    const heading = rawHeading >= 0 ? rawHeading : 360 + rawHeading;

    // Compute distance
    const distTraveled = Math.round(p0.distanceKm + (p1.distanceKm - p0.distanceKm) * segT);
    const distToNext = Math.max(0.4, Number((p1.distanceKm - distTraveled).toFixed(1)));

    // Speed calculation: realistic cruising vs station slowdown
    let speed = 92;
    if (clamped === 0 || clamped === 100) {
      speed = 0;
    } else if (segT < 0.08 || segT > 0.92) {
      speed = 35;
    } else {
      speed = 88;
    }

    const curStop = stops[curIdx];
    const nextStop = curIdx < totalStops - 1 ? stops[curIdx + 1] : curStop;
    const prevStop = curIdx > 0 ? stops[curIdx - 1] : curStop;

    // Update stops status in selectedTrain
    setSelectedTrain(prev => ({
      ...prev,
      stops: prev.stops.map((s, idx) => ({
        ...s,
        status: idx < curIdx ? 'passed' : idx === curIdx ? 'current' : 'upcoming'
      }))
    }));

    setGps(prev => ({
      ...prev,
      lat: Number(curLat.toFixed(5)),
      lng: Number(curLng.toFixed(5)),
      speedKmph: speed,
      headingDeg: heading,
      currentSection: `${curStop.name} Corridor (${distTraveled} km of ${selectedTrain.totalDistanceKm} km)`,
      prevStation: `${prevStop.name} (${prevStop.code})`,
      nextStation: `${nextStop.name} (${nextStop.code})`,
      distanceToNextKm: distToNext,
      progressPercent: clamped,
      lastUpdatedSecsAgo: 0
    }));
  };

  const jumpToStation = (stopCode: string) => {
    const stops = selectedTrain.stops;
    const idx = stops.findIndex(s => s.code.toLowerCase() === stopCode.toLowerCase());
    if (idx !== -1) {
      const pct = Math.round((idx / Math.max(1, stops.length - 1)) * 100);
      updateProgressPercent(pct);
    }
  };

  // Step-by-step simulation handler
  const applySimStep = (stepNumber: number) => {
    const stepDef = SIMULATION_PIPELINE_STEPS.find(s => s.step === stepNumber);
    if (!stepDef) return;

    setSimStep(stepNumber);

    // Update GPS
    setGps(prev => ({
      ...prev,
      speedKmph: stepDef.speedKmph,
      currentSection: stepDef.section,
      distanceToNextKm: Math.max(0.4, Number((4.5 - stepNumber * 0.35).toFixed(1))),
      progressPercent: Math.min(98, 35 + stepNumber * 5),
      lastUpdatedSecsAgo: 1
    }));

    // Update Signals
    setSignals(prev =>
      prev.map((s, idx) => {
        if (idx === 1) return { ...s, aspect: stepDef.signalAspect };
        if (stepNumber >= 4 && idx === 2) return { ...s, aspect: 'YELLOW' };
        if (stepNumber >= 9 && idx === 1) return { ...s, aspect: 'GREEN' };
        return s;
      })
    );

    // Update Blocks
    setBlocks(prev =>
      prev.map(b => {
        if (b.id === 'blk-b24' || b.code === 'B24' || b.code.includes('Bhopal Area')) {
          return {
            ...b,
            congestionLevel: stepDef.congestion,
            status: stepDef.congestion === 'LOW' ? 'CLEAR' : 'OCCUPIED'
          };
        }
        return b;
      })
    );

    // Update Junctions
    setJunctions(prev =>
      prev.map(j => {
        if (j.code === 'J12') {
          return {
            ...j,
            congestionLevel: stepDef.congestion,
            conflictDetected: stepDef.congestion === 'HIGH' || stepDef.congestion === 'CRITICAL',
            estimatedCrossingDelayMin: stepDef.congestion === 'LOW' ? 1 : stepDef.congestion === 'MODERATE' ? 4 : 8
          };
        }
        return j;
      })
    );

    // Update Crew & Rake
    setCrew(prev => ({
      ...prev,
      readiness: stepDef.crewReadiness
    }));
    setRake(prev => ({
      ...prev,
      coachReadiness: stepDef.rakeReadiness,
      turnaroundRemainingMin: stepDef.rakeReadiness === '100% READY' ? 4 : 14,
      departureShiftMin: stepDef.delayMin > 10 ? 4 : 0
    }));

    // Generate intelligent step alert if defined
    if (stepDef.alertMessage) {
      const newAlert: SmartAlert = {
        id: `sim-alt-${Date.now()}-${stepNumber}`,
        type: stepNumber >= 9 ? 'CONNECTION_RISK' : stepNumber >= 3 ? 'CONGESTION_ALERT' : 'ETA_CHANGED',
        title: `Step ${stepNumber}: ${stepDef.title}`,
        message: stepDef.alertMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        severity: stepDef.connectionRisk === 'AT_RISK' ? 'critical' : stepDef.congestion === 'HIGH' ? 'warning' : 'info',
        targetTab: stepNumber >= 9 ? 'connection' : stepNumber >= 7 ? 'prediction' : stepNumber >= 3 ? 'network' : 'gps',
        category: stepNumber >= 9 ? 'connection' : 'journey'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const jumpToSimStep = (stepNum: number) => {
    applySimStep(Math.max(1, Math.min(11, stepNum)));
  };

  const nextSimStep = () => {
    applySimStep(simStep < 11 ? simStep + 1 : 1);
  };

  const prevSimStep = () => {
    applySimStep(simStep > 1 ? simStep - 1 : 11);
  };

  const startSimulation = () => {
    setIsSimulating(true);
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    applySimStep(1);
  };

  // Automatic simulation ticker when active
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = (4000 / simSpeed);
    const timer = setInterval(() => {
      setSimStep(curr => {
        const next = curr < 11 ? curr + 1 : 1;
        applySimStep(next);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed]);

  return (
    <RailwayContext.Provider
      value={{
        activeTab,
        setActiveTab,
        canGoBack,
        goBack,
        previousTab,
        trains,
        selectedTrain,
        setSelectedTrain,
        searchTrainQuery,
        setSearchTrainQuery,
        // Route selection & assistance
        searchOrigin,
        setSearchOrigin,
        searchDestination,
        setSearchDestination,
        travelDate,
        setTravelDate,
        travelClass,
        setTravelClass,
        availableTrainsForRoute,
        selectTrainAndAssist,
        swapStations,
        assistanceMode,
        setAssistanceMode,
        gps,
        updateGps,
        signals,
        blocks,
        junctions,
        crew,
        rake,
        historical,
        prediction,
        connections,
        addConnection,
        removeConnection,
        facilities,
        alerts,
        unreadAlertCount,
        markAlertRead,
        markAllAlertsRead,
        addAlert,
        savedJourneys,
        saveCurrentJourney,
        removeSavedJourney,
        renameSavedJourney,
        isSimulating,
        simStep,
        simSpeed,
        setSimSpeed,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        nextSimStep,
        prevSimStep,
        jumpToSimStep,
        updateProgressPercent,
        jumpToStation,
        isOfflineMode,
        setIsOfflineMode,
        lastSyncTime,
        triggerManualRefresh,
        isRefreshing,
        theme,
        setTheme,
        themePalette,
        setThemePalette
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => {
  const ctx = useContext(RailwayContext);
  if (!ctx) throw new Error('useRailway must be used within RailwayProvider');
  return ctx;
};
