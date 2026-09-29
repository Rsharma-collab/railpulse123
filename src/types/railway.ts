export type SignalAspect = 'GREEN' | 'YELLOW' | 'DOUBLE_YELLOW' | 'RED';

export type CongestionLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface StationStop {
  code: string;
  name: string;
  scheduledArr: string;
  scheduledDep: string;
  predictedArr: string;
  predictedDep: string;
  delayArrMin: number;
  delayDepMin: number;
  distanceKm: number;
  platform: string;
  status: 'passed' | 'current' | 'upcoming';
  track: string;
  coordinates: { lat: number; lng: number };
  coachPositionGuide?: string;
  gateRecommendation?: string;
  isJunction?: boolean;
  stationType?: 'junction' | 'station' | 'halt';
}

export interface StationInfo {
  code: string;
  name: string;
  city: string;
  state: string;
  platforms: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Rajdhani' | 'Vande Bharat' | 'Shatabdi' | 'Duronto' | 'Superfast' | 'Tejas' | 'Express';
  source: string;
  sourceCode: string;
  destination: string;
  destCode: string;
  totalDistanceKm: number;
  rakeComposition: string[];
  stops: StationStop[];
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  punctualityScore?: number;
  crowdLevel?: 'Low' | 'Moderate' | 'High';
  cleanlinessRating?: number;
  classesAvailable?: string[];
  liveStatusSummary?: string;
  currentDelayMin?: number;
}

export interface GPSLocation {
  lat: number;
  lng: number;
  altitudeM: number;
  speedKmph: number;
  headingDeg: number;
  currentSection: string;
  prevStation: string;
  nextStation: string;
  distanceToNextKm: number;
  progressPercent: number;
  lastUpdatedSecsAgo: number;
  confidencePct: number;
  satellitesLocked: number;
}

export interface Signal {
  id: string;
  code: string;
  name: string;
  aspect: SignalAspect;
  location: string;
  blockSectionId: string;
  speedLimitKmph: number;
  distanceM: number;
  type: 'Automatic 4-Aspect' | 'Semi-Automatic' | 'Home' | 'Starter';
}

export interface BlockSection {
  id: string;
  code: string;
  name?: string;
  areaName?: string;
  lengthKm: number;
  status: 'CLEAR' | 'OCCUPIED' | 'RESTRICTED' | 'MAINTENANCE';
  occupiedByTrain?: string;
  congestionLevel: CongestionLevel;
  maxPermissibleSpeedKmph: number;
}

export interface Junction {
  id: string;
  code: string;
  name: string;
  tracksCount: number;
  activeRoutes: number;
  congestionLevel: CongestionLevel;
  queuedTrains: string[];
  conflictDetected: boolean;
  conflictSummary?: string;
  estimatedCrossingDelayMin: number;
}

export interface CrewStatus {
  assignedDriver: string;
  assignedGuard: string;
  driverId: string;
  signOnStatus: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE';
  signOnTime: string;
  dutyHoursElapsed: number;
  maxDutyHours: number;
  readiness: 'READY' | 'ATTENTION' | 'DELAYED';
  connectingCrewStatus: 'ON_TIME' | 'DELAYED_INBOUND' | 'REPLACED';
  locoFitnessCleared: boolean;
  breathalyzerPassed: boolean;
}

export interface RakeStatus {
  rakeId: string;
  coachCount: number;
  mechanicalInspection: 'PASSED' | 'IN_PROGRESS' | 'PENDING_BRAKE_TEST' | 'FLAGGED';
  maintenanceStatus: 'CLEARED' | 'MINOR_REPAIR' | 'CRITICAL';
  coachReadiness: '100% READY' | 'CLEANING' | 'WATERING_IN_PROGRESS';
  turnaroundRemainingMin: number;
  departureShiftMin: number;
  acTractionHealthPct: number;
  brakePressurePsi: number;
}

export interface HistoricalMetric {
  section: string;
  fromStation: string;
  toStation: string;
  avgDelayMin: number;
  medianDelayMin: number;
  delayFrequencyPct: number;
  highDelayWindow: string;
  typicalRecoveryMin: number;
  seasonalRisk: 'LOW' | 'MODERATE' | 'HIGH';
  patternInsight: string;
  hourlyTrends: { hour: string; avgDelay: number }[];
}

export interface ETAExplanationFactor {
  factor: string;
  impactMin: number;
  category: 'network' | 'crew_rake' | 'historical' | 'recovery' | 'weather' | 'gps';
  explanation: string;
}

export interface ETAPrediction {
  scheduledArrival: string;
  currentETA: string;
  predictedETA: string;
  netDelayDeltaMin: number;
  confidencePct: number;
  delayProbabilityPct: number;
  predictionHealth: 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'CRITICAL';
  factors: ETAExplanationFactor[];
}

export interface Connection {
  id: string;
  type: 'TRAIN' | 'METRO' | 'BUS' | 'CAB' | 'FLIGHT';
  transportName: string;
  identifier: string;
  destination: string;
  departureTime: string;
  platformOrGate: string;
  walkingTimeMin: number;
  riskLevel: 'SAFE' | 'WATCH' | 'AT_RISK';
  bufferRemainingMin: number;
  guidance: string;
}

export interface StationFacility {
  id: string;
  category: 'food' | 'washroom' | 'lounge' | 'cloak_room' | 'atm' | 'medical' | 'taxi' | 'metro' | 'bus';
  name: string;
  location: string;
  platform?: number;
  distanceM: number;
  walkTimeMin: number;
  openStatus: 'OPEN' | 'CLOSING_SOON' | '24/7' | 'TEMPORARILY_CLOSED';
  details: string;
}

export interface StationPerimeterItem {
  id: string;
  stationCode: string;
  stationName: string;
  type: 'medical' | 'famous_food' | 'beverage';
  name: string;
  specialtyOrMeds: string;
  locationDescription: string;
  isInsideStation: boolean;
  distanceMeters: number;
  oneWayWalkTimeMin: number;
  avgPrepOrQueueTimeMin: number;
  pricing: string;
  operatingHours: string;
  rating: number;
  reviewsCount: number;
  phone?: string;
  hasQuickPackDelivery: boolean;
  recommendedItems: string[];
}

export interface FetchProbabilityAnalysis {
  item: StationPerimeterItem;
  haltDurationMin: number;
  roundTripWalkMin: number;
  fobPenaltyMin: number;
  prepQueueMin: number;
  safetyBufferMin: number;
  totalTimeRequiredMin: number;
  timeMarginMin: number;
  probabilityScorePct: number;
  verdict: 'SAFE_RUN' | 'QUICK_RUN_ONLY' | 'HIGH_RISK' | 'IMPOSSIBLE';
  recommendationText: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface SmartAlert {
  id: string;
  type: 'ETA_CHANGED' | 'PLATFORM_CHANGED' | 'TRAIN_DELAYED' | 'CONNECTION_RISK' | 'STATION_APPROACHING' | 'CONGESTION_ALERT' | 'OPERATIONAL_DELAY' | 'ROUTE_DISRUPTION' | 'BOARDING_REMINDER';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: AlertSeverity;
  targetTab: string;
  category: 'journey' | 'network' | 'operations' | 'connection';
}

export interface SavedJourney {
  id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  date: string;
  pnr?: string;
  coach?: string;
  berth?: string;
  createdAt: string;
}

export interface SimulationStep {
  step: number;
  title: string;
  description: string;
  section: string;
  speedKmph: number;
  delayMin: number;
  congestion: CongestionLevel;
  signalAspect: SignalAspect;
  crewReadiness: 'READY' | 'ATTENTION' | 'DELAYED';
  rakeReadiness: '100% READY' | 'CLEANING' | 'WATERING_IN_PROGRESS';
  historicalRisk: 'LOW' | 'MODERATE' | 'HIGH';
  connectionBufferMin: number;
  connectionRisk: 'SAFE' | 'WATCH' | 'AT_RISK';
  alertMessage?: string;
}
