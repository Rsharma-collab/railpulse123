import {
  GPSLocation,
  BlockSection,
  Junction,
  Signal,
  CrewStatus,
  RakeStatus,
  HistoricalMetric,
  ETAPrediction,
  ETAExplanationFactor,
  Connection,
  CongestionLevel
} from '../types/railway';

// Helper to convert HH:MM to total minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Helper to convert total minutes back to HH:MM format
export function minutesToTime(totalMin: number): string {
  const norm = ((totalMin % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Deterministic Dynamic ETA calculation engine
 */
export function computeETAPrediction(params: {
  scheduledArrival: string;
  currentObservedDelayMin: number;
  junctions: Junction[];
  blocks: BlockSection[];
  crew: CrewStatus;
  rake: RakeStatus;
  historical: HistoricalMetric;
  speedKmph: number;
}): ETAPrediction {
  const {
    scheduledArrival,
    currentObservedDelayMin,
    junctions,
    blocks,
    crew,
    rake,
    historical,
    speedKmph
  } = params;

  const factors: ETAExplanationFactor[] = [];

  // 1. Network Congestion factor
  let networkImpactMin = 0;
  const highCongestionJunctions = junctions.filter(j => j.congestionLevel === 'HIGH' || j.congestionLevel === 'CRITICAL');
  if (highCongestionJunctions.length > 0) {
    networkImpactMin += highCongestionJunctions.reduce((sum, j) => sum + j.estimatedCrossingDelayMin, 0);
    factors.push({
      factor: 'Junction J12 Crossing Contention',
      impactMin: Math.min(8, networkImpactMin),
      category: 'network',
      explanation: `Queued freight rake and interlocking slot delay at Junction J12 (+${Math.min(8, networkImpactMin)} min).`
    });
  } else {
    factors.push({
      factor: 'Clear Track Signals',
      impactMin: 0,
      category: 'network',
      explanation: 'Ahead route sections reporting Green clear aspects with no speed restrictions.'
    });
  }

  // Check occupied section speed restrictions
  const restrictedBlocks = blocks.filter(b => b.status === 'OCCUPIED' || b.status === 'RESTRICTED');
  if (restrictedBlocks.length > 0 && speedKmph < 60) {
    const blockDelay = 2;
    networkImpactMin += blockDelay;
    factors.push({
      factor: 'Caution Aspect Speed Restriction',
      impactMin: blockDelay,
      category: 'network',
      explanation: `Speed throttled below 60 km/h across restricted section ${restrictedBlocks[0].name || restrictedBlocks[0].code} (+${blockDelay} min).`
    });
  }

  // 2. Crew & Rake readiness impact
  let operationalImpactMin = 0;
  if (rake.coachReadiness !== '100% READY' || rake.mechanicalInspection !== 'PASSED') {
    operationalImpactMin += 3;
    factors.push({
      factor: 'Platform Rake Servicing',
      impactMin: 3,
      category: 'crew_rake',
      explanation: 'Mid-route coach watering and brake line valve verification at station yard (+3 min).'
    });
  }
  if (crew.readiness === 'ATTENTION' || crew.connectingCrewStatus === 'DELAYED_INBOUND') {
    operationalImpactMin += 2;
    factors.push({
      factor: 'Loco Crew Transition',
      impactMin: 2,
      category: 'crew_rake',
      explanation: 'Relief driver breathalyzer check and caution order hand-over buffer (+2 min).'
    });
  }

  // 3. Historical bottleneck correlation
  let historicalImpactMin = 0;
  if (historical.seasonalRisk === 'HIGH' || historical.delayFrequencyPct > 60) {
    historicalImpactMin = Math.round(historical.avgDelayMin * 0.25);
    factors.push({
      factor: 'Historical Corridor Bottleneck',
      impactMin: historicalImpactMin,
      category: 'historical',
      explanation: `Historical pattern: ${historical.delayFrequencyPct}% of trains in window ${historical.highDelayWindow} lose time here (+${historicalImpactMin} min).`
    });
  }

  // 4. Expected dynamic recovery allowance
  let recoveryMin = 0;
  if (speedKmph > 90 && rake.acTractionHealthPct > 95) {
    recoveryMin = -historical.typicalRecoveryMin;
    factors.push({
      factor: 'Loco MPS Speed Recovery',
      impactMin: recoveryMin,
      category: 'recovery',
      explanation: `Dual WAP-7 traction with nominal line voltage enables recovery on downstream section (${recoveryMin} min).`
    });
  } else if (speedKmph >= 60) {
    recoveryMin = -1;
    factors.push({
      factor: 'Corridor Recovery Margin',
      impactMin: recoveryMin,
      category: 'recovery',
      explanation: `Built-in timetable slack between Itarsi and Betul allows minor recovery (${recoveryMin} min).`
    });
  }

  // Net delay additions on top of observed delay
  const netAdditionalMin = networkImpactMin + operationalImpactMin + historicalImpactMin + recoveryMin;
  const totalPredictedDelayMin = Math.max(0, currentObservedDelayMin + netAdditionalMin);

  const baseMinutes = timeToMinutes(scheduledArrival);
  const currentETAMin = baseMinutes + currentObservedDelayMin;
  const predictedETAMin = baseMinutes + totalPredictedDelayMin;

  // Confidence calculation based on stability of inputs
  let confidencePct = 94;
  if (highCongestionJunctions.length > 0) confidencePct -= 5;
  if (operationalImpactMin > 0) confidencePct -= 4;
  if (historical.seasonalRisk === 'HIGH') confidencePct -= 3;
  if (speedKmph < 30) confidencePct -= 3;
  confidencePct = Math.max(72, Math.min(98, confidencePct));

  // Delay probability calculation
  const delayProbabilityPct = Math.min(95, Math.max(12, Math.round((totalPredictedDelayMin / 30) * 100)));

  let predictionHealth: 'EXCELLENT' | 'STABLE' | 'DEGRADED' | 'CRITICAL' = 'EXCELLENT';
  if (confidencePct < 78 || totalPredictedDelayMin > 20) {
    predictionHealth = 'CRITICAL';
  } else if (confidencePct < 85 || totalPredictedDelayMin > 10) {
    predictionHealth = 'DEGRADED';
  } else if (confidencePct < 90) {
    predictionHealth = 'STABLE';
  }

  return {
    scheduledArrival,
    currentETA: minutesToTime(currentETAMin),
    predictedETA: minutesToTime(predictedETAMin),
    netDelayDeltaMin: netAdditionalMin,
    confidencePct,
    delayProbabilityPct,
    predictionHealth,
    factors
  };
}

/**
 * Recomputes connection risks based on predicted arrival
 */
export function recalculateConnections(
  predictedArrivalStr: string,
  connections: Connection[]
): Connection[] {
  const arrivalMin = timeToMinutes(predictedArrivalStr);

  return connections.map(conn => {
    // If departureTime is flexible, leave as safe
    if (conn.departureTime.includes('Flexible')) {
      return {
        ...conn,
        riskLevel: 'SAFE' as const,
        bufferRemainingMin: 45,
        guidance: 'Cab is pre-booked and available on arrival at Gate B.'
      };
    }

    const depMin = timeToMinutes(conn.departureTime);
    // In case departure is next morning (e.g. 01:20 after 23:50 arrival)
    let bufferMin = depMin - arrivalMin;
    if (bufferMin < -720) {
      bufferMin += 1440;
    }

    const effectiveBuffer = bufferMin - conn.walkingTimeMin;

    let riskLevel: 'SAFE' | 'WATCH' | 'AT_RISK' = 'SAFE';
    let guidance = conn.guidance;

    if (effectiveBuffer < 5) {
      riskLevel = 'AT_RISK';
      guidance = `CRITICAL: Available transfer buffer has reduced to ${bufferMin} min (Walk time: ${conn.walkingTimeMin} min). Move promptly to ${conn.platformOrGate}!`;
    } else if (effectiveBuffer < 12) {
      riskLevel = 'WATCH';
      guidance = `Transfer buffer narrowed to ${bufferMin} min. De-board from front coach doors and proceed toward ${conn.platformOrGate}.`;
    } else {
      riskLevel = 'SAFE';
      guidance = `Ample transfer window of ${bufferMin} min available (Walk time: ${conn.walkingTimeMin} min) to reach ${conn.platformOrGate}.`;
    }

    return {
      ...conn,
      riskLevel,
      bufferRemainingMin: Math.max(0, bufferMin),
      guidance
    };
  });
}
