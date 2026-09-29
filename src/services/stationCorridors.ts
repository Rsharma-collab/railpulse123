import { StationStop, StationInfo } from '../types/railway';

// Raw coordinate and distance mapping for Mumbai to Bhopal line (Central Railway route)
interface RawStationDef {
  code: string;
  name: string;
  distKm: number;
  lat: number;
  lng: number;
  isJunction: boolean;
  stationType: 'junction' | 'station' | 'halt';
  platform: string;
  arrOffsetMin: number;
  haltMin: number;
  gate?: string;
  coachGuide?: string;
}

export const RAW_MUMBAI_BHOPAL_ROUTE: RawStationDef[] = [
  { code: 'CSMT', name: 'Mumbai CSMT', distKm: 0, lat: 18.9401, lng: 72.8352, isJunction: true, stationType: 'junction', platform: '16', arrOffsetMin: 0, haltMin: 0, gate: 'Main Concourse & Taxi Bay Exit', coachGuide: 'Coach B4 near Escalator 1' },
  { code: 'DR', name: 'Dadar', distKm: 9, lat: 19.0178, lng: 72.8478, isJunction: false, stationType: 'station', platform: '6', arrOffsetMin: 14, haltMin: 3, gate: 'West FOB Gate 2', coachGuide: 'Coach B4 near Pillar 12' },
  { code: 'TNA', name: 'Thane', distKm: 34, lat: 19.1860, lng: 72.9759, isJunction: false, stationType: 'station', platform: '5', arrOffsetMin: 36, haltMin: 3, gate: 'East Circulating Area Gate B', coachGuide: 'Coach B4 near Lift 1' },
  { code: 'KYN', name: 'Kalyan Junction', distKm: 54, lat: 19.2364, lng: 73.1306, isJunction: true, stationType: 'junction', platform: '4', arrOffsetMin: 58, haltMin: 5, gate: 'North Exit FOB 2', coachGuide: 'Coach B4 aligns with Middle Ramp' },
  { code: 'TLA', name: 'Titwala', distKm: 64, lat: 19.3005, lng: 73.2081, isJunction: false, stationType: 'station', platform: '3', arrOffsetMin: 72, haltMin: 2, gate: 'Platform 3 East Gate' },
  { code: 'ASO', name: 'Asangaon', distKm: 85, lat: 19.4390, lng: 73.3056, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 92, haltMin: 2, gate: 'Main Road Exit' },
  { code: 'ATG', name: 'Atgaon', distKm: 97, lat: 19.5284, lng: 73.3592, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 104, haltMin: 1 },
  { code: 'KDI', name: 'Khardi', distKm: 108, lat: 19.5852, lng: 73.4121, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 115, haltMin: 1 },
  { code: 'KSRA', name: 'Kasara', distKm: 121, lat: 19.6547, lng: 73.4831, isJunction: false, stationType: 'station', platform: '3', arrOffsetMin: 130, haltMin: 8, gate: 'Ghat Banker Engine Detach Bay', coachGuide: 'Banker locomotive attached' },
  { code: 'IGP', name: 'Igatpuri', distKm: 137, lat: 19.6963, lng: 73.5606, isJunction: true, stationType: 'junction', platform: '2', arrOffsetMin: 165, haltMin: 5, gate: 'Main Entrance & Canteen', coachGuide: 'Thal Ghat Summit Exit' },
  { code: 'GO', name: 'Ghoti', distKm: 145, lat: 19.7214, lng: 73.6310, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 178, haltMin: 1 },
  { code: 'DVL', name: 'Devlali', distKm: 176, lat: 19.9431, lng: 73.8290, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 205, haltMin: 2, gate: 'Cantonment Main Gate' },
  { code: 'NK', name: 'Nashik Road', distKm: 188, lat: 19.9576, lng: 73.8360, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 220, haltMin: 5, gate: 'Main Concourse Gate 1', coachGuide: 'Coach B4 near Waiting Hall' },
  { code: 'ODHA', name: 'Odha', distKm: 198, lat: 20.0089, lng: 73.8962, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 233, haltMin: 1 },
  { code: 'KW', name: 'Kherwadi', distKm: 205, lat: 20.0612, lng: 73.9458, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 242, haltMin: 1 },
  { code: 'NR', name: 'Niphad', distKm: 219, lat: 20.0816, lng: 74.1120, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 256, haltMin: 2, gate: 'Station Approach Road' },
  { code: 'LS', name: 'Lasalgaon', distKm: 236, lat: 20.1472, lng: 74.2312, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 272, haltMin: 2, gate: 'Mandi Gate' },
  { code: 'MMR', name: 'Manmad Junction', distKm: 261, lat: 20.2524, lng: 74.4385, isJunction: true, stationType: 'junction', platform: '2', arrOffsetMin: 300, haltMin: 5, gate: 'North circulating area FOB 1', coachGuide: 'Coach B4 near Refreshment Room' },
  { code: 'PJN', name: 'Panjhan', distKm: 273, lat: 20.3150, lng: 74.5200, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 314, haltMin: 1 },
  { code: 'NGN', name: 'Nandgaon', distKm: 286, lat: 20.3758, lng: 74.6548, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 328, haltMin: 2, gate: 'Platform 2 Exit' },
  { code: 'NYD', name: 'Naydongri', distKm: 307, lat: 20.4280, lng: 74.8021, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 348, haltMin: 1 },
  { code: 'CSN', name: 'Chalisgaon Junction', distKm: 328, lat: 20.4632, lng: 74.9984, isJunction: true, stationType: 'junction', platform: '1', arrOffsetMin: 370, haltMin: 4, gate: 'Dhule Line Exit Gate' },
  { code: 'KJ', name: 'Kajgaon', distKm: 347, lat: 20.4850, lng: 75.1200, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 388, haltMin: 1 },
  { code: 'GAA', name: 'Galan', distKm: 358, lat: 20.5050, lng: 75.2050, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 400, haltMin: 1 },
  { code: 'PC', name: 'Pachora Junction', distKm: 373, lat: 20.5289, lng: 75.3524, isJunction: true, stationType: 'junction', platform: '3', arrOffsetMin: 415, haltMin: 3, gate: 'Ajanta Approach Road' },
  { code: 'MYJ', name: 'Maheji', distKm: 396, lat: 20.6120, lng: 75.4520, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 436, haltMin: 1 },
  { code: 'SS', name: 'Shirsoli', distKm: 409, lat: 20.7300, lng: 75.5200, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 450, haltMin: 1 },
  { code: 'JL', name: 'Jalgaon Junction', distKm: 421, lat: 21.0055, lng: 75.5667, isJunction: true, stationType: 'junction', platform: '3', arrOffsetMin: 464, haltMin: 4, gate: 'Main City Gate East', coachGuide: 'Coach B4 aligns with Pillar 8' },
  { code: 'BSL', name: 'Bhusaval Junction', distKm: 445, lat: 21.0456, lng: 75.7892, isJunction: true, stationType: 'junction', platform: '4', arrOffsetMin: 495, haltMin: 8, gate: 'Platform 4 East Overbridge', coachGuide: 'Coach B4 near Waiting Lounge' },
  { code: 'VNA', name: 'Varangaon', distKm: 457, lat: 21.0180, lng: 75.9080, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 512, haltMin: 1 },
  { code: 'SAV', name: 'Savda', distKm: 466, lat: 21.1520, lng: 75.8920, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 524, haltMin: 2, gate: 'Mandi Road Exit' },
  { code: 'RV', name: 'Raver', distKm: 480, lat: 21.2420, lng: 76.0350, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 540, haltMin: 2, gate: 'Main Entrance' },
  { code: 'BAU', name: 'Burhanpur', distKm: 500, lat: 21.3144, lng: 76.2299, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 562, haltMin: 3, gate: 'Heritage Gate 1', coachGuide: 'Coach B4 near Middle Stall' },
  { code: 'CDI', name: 'Chandni', distKm: 516, lat: 21.3650, lng: 76.2950, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 578, haltMin: 1 },
  { code: 'NPN', name: 'Nepanagar', distKm: 543, lat: 21.4589, lng: 76.4172, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 604, haltMin: 2, gate: 'Paper Mills Gate' },
  { code: 'AGQ', name: 'Asirgarh Road', distKm: 554, lat: 21.4980, lng: 76.4850, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 616, haltMin: 1 },
  { code: 'DGN', name: 'Dongargaon', distKm: 565, lat: 21.5720, lng: 76.5400, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 628, haltMin: 1 },
  { code: 'KNW', name: 'Khandwa Junction', distKm: 569, lat: 21.8258, lng: 76.3524, isJunction: true, stationType: 'junction', platform: '2', arrOffsetMin: 640, haltMin: 5, gate: 'Main Station Portico', coachGuide: 'Coach B4 near Foot Over Bridge' },
  { code: 'TLV', name: 'Talvadya', distKm: 585, lat: 21.9120, lng: 76.4620, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 658, haltMin: 1 },
  { code: 'SGBJ', name: 'Surgaon Banjari', distKm: 597, lat: 21.9850, lng: 76.5510, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 672, haltMin: 1 },
  { code: 'CAER', name: 'Chhanera', distKm: 614, lat: 22.0620, lng: 76.6850, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 690, haltMin: 2, gate: 'Platform 1 Approach' },
  { code: 'KKN', name: 'Khirkiya', distKm: 645, lat: 22.1720, lng: 76.8420, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 720, haltMin: 2, gate: 'Main Road Gate' },
  { code: 'MSO', name: 'Masangaon', distKm: 661, lat: 22.2510, lng: 76.9550, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 736, haltMin: 1 },
  { code: 'HD', name: 'Harda', distKm: 676, lat: 22.3444, lng: 77.0988, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 752, haltMin: 3, gate: 'City Concourse Gate', coachGuide: 'Coach B4 aligns with Pillar 6' },
  { code: 'TBN', name: 'Timarni', distKm: 690, lat: 22.3780, lng: 77.2340, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 768, haltMin: 2, gate: 'Main Exit Gate' },
  { code: 'PGL', name: 'Pagdhal', distKm: 704, lat: 22.4350, lng: 77.3820, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 782, haltMin: 1 },
  { code: 'BPF', name: 'Banapura', distKm: 718, lat: 22.5020, lng: 77.5120, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 796, haltMin: 2, gate: 'East Gate' },
  { code: 'DKI', name: 'Dharamkundi', distKm: 732, lat: 22.5480, lng: 77.6250, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 810, haltMin: 1 },
  { code: 'ET', name: 'Itarsi Junction', distKm: 752, lat: 22.6139, lng: 77.7618, isJunction: true, stationType: 'junction', platform: '2', arrOffsetMin: 835, haltMin: 10, gate: 'North Circulating Area Gate A', coachGuide: 'Coach B4 near FOB 2 Ramp' },
  { code: 'NDPM', name: 'Narmadapuram', distKm: 770, lat: 22.7519, lng: 77.7289, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 858, haltMin: 3, gate: 'Ghat Road Exit' },
  { code: 'BNI', name: 'Budni', distKm: 777, lat: 22.7850, lng: 77.7780, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 868, haltMin: 2, gate: 'Factory Area Gate' },
  { code: 'MDG', name: 'Midghat', distKm: 785, lat: 22.8420, lng: 77.7120, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 880, haltMin: 1, coachGuide: 'Midghat Curve Viaduct' },
  { code: 'BKA', name: 'Barkhera', distKm: 794, lat: 22.9050, lng: 77.6520, isJunction: false, stationType: 'halt', platform: '2', arrOffsetMin: 894, haltMin: 1 },
  { code: 'ODG', name: 'Obaidullaganj', distKm: 810, lat: 23.0120, lng: 77.6180, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 912, haltMin: 2, gate: 'Bhimbetka Highway Gate' },
  { code: 'MDDP', name: 'Mandideep', distKm: 824, lat: 23.0820, lng: 77.5180, isJunction: false, stationType: 'station', platform: '2', arrOffsetMin: 928, haltMin: 2, gate: 'Industrial Park Gate' },
  { code: 'MSOD', name: 'Misrod', distKm: 833, lat: 23.1620, lng: 77.4650, isJunction: false, stationType: 'halt', platform: '1', arrOffsetMin: 939, haltMin: 1 },
  { code: 'RKMP', name: 'Rani Kamlapati', distKm: 840, lat: 23.2185, lng: 77.4385, isJunction: false, stationType: 'station', platform: '1', arrOffsetMin: 950, haltMin: 4, gate: 'Air Concourse Concourse 1', coachGuide: 'Coach B4 near Escalator 3' },
  { code: 'BPL', name: 'Bhopal Junction', distKm: 846, lat: 23.2599, lng: 77.4126, isJunction: true, stationType: 'junction', platform: '1', arrOffsetMin: 965, haltMin: 0, gate: 'Gate 2 - Platform 1 Entry', coachGuide: 'Coach B4 near Main Exit' }
];

// Helper to convert minute offset from a base departure time into "HH:MM"
function addMinutesToTime(baseTime: string, addedMin: number): string {
  const [h, m] = baseTime.split(':').map(Number);
  const total = (h * 60 + m + addedMin) % 1440;
  const rh = Math.floor(total / 60);
  const rm = total % 60;
  return `${rh.toString().padStart(2, '0')}:${rm.toString().padStart(2, '0')}`;
}

/**
 * Builds all 58 station stops for Mumbai to Bhopal train
 */
export function buildMumbaiToBhopalStops(
  baseDeparture = '19:05',
  currentStationIndex = 28 // e.g. Bhusaval Junction
): StationStop[] {
  return RAW_MUMBAI_BHOPAL_ROUTE.map((raw, idx) => {
    const isPassed = idx < currentStationIndex;
    const isCurrent = idx === currentStationIndex;
    const isUpcoming = idx > currentStationIndex;

    const scheduledArr = addMinutesToTime(baseDeparture, raw.arrOffsetMin);
    const scheduledDep = addMinutesToTime(baseDeparture, raw.arrOffsetMin + raw.haltMin);

    // Realistic small dynamic delay simulation
    const delayMin = isPassed ? (idx > 10 ? 4 : 0) : isCurrent ? 6 : 6;
    const predictedArr = addMinutesToTime(scheduledArr, delayMin);
    const predictedDep = addMinutesToTime(scheduledDep, delayMin);

    return {
      code: raw.code,
      name: raw.name,
      scheduledArr,
      scheduledDep,
      predictedArr,
      predictedDep,
      delayArrMin: delayMin,
      delayDepMin: delayMin,
      distanceKm: raw.distKm,
      platform: raw.platform,
      status: isPassed ? 'passed' : isCurrent ? 'current' : 'upcoming',
      track: raw.isJunction ? 'Main Line Up' : 'Broad Gauge Up Line',
      coordinates: { lat: raw.lat, lng: raw.lng },
      isJunction: raw.isJunction,
      stationType: raw.stationType,
      coachPositionGuide: raw.coachGuide || `Coach B4 near Platform Indicator ${raw.platform}`,
      gateRecommendation: raw.gate || `Platform ${raw.platform} Overbridge Gate`
    };
  });
}

/**
 * Builds all 58 station stops for Bhopal to Mumbai train (reversed sequence)
 */
export function buildBhopalToMumbaiStops(
  baseDeparture = '14:00',
  currentStationIndex = 8 // e.g. Itarsi / Harda
): StationStop[] {
  const reversedRaw = [...RAW_MUMBAI_BHOPAL_ROUTE].reverse();
  const totalDist = 846;

  return reversedRaw.map((raw, idx) => {
    const isPassed = idx < currentStationIndex;
    const isCurrent = idx === currentStationIndex;

    const reversedDist = totalDist - raw.distKm;
    // Calculate offset based on distance traveled
    const estTravelMin = Math.round((reversedDist / totalDist) * 965);

    const scheduledArr = addMinutesToTime(baseDeparture, estTravelMin);
    const scheduledDep = addMinutesToTime(baseDeparture, estTravelMin + raw.haltMin);

    const delayMin = isPassed ? (idx > 5 ? 8 : 2) : isCurrent ? 11 : 9;
    const predictedArr = addMinutesToTime(scheduledArr, delayMin);
    const predictedDep = addMinutesToTime(scheduledDep, delayMin);

    return {
      code: raw.code,
      name: raw.name,
      scheduledArr,
      scheduledDep,
      predictedArr,
      predictedDep,
      delayArrMin: delayMin,
      delayDepMin: delayMin,
      distanceKm: reversedDist,
      platform: raw.platform,
      status: isPassed ? 'passed' : isCurrent ? 'current' : 'upcoming',
      track: raw.isJunction ? 'Down Main Corridor' : 'Broad Gauge Down Line',
      coordinates: { lat: raw.lat, lng: raw.lng },
      isJunction: raw.isJunction,
      stationType: raw.stationType,
      coachPositionGuide: raw.coachGuide || `Coach B4 near Platform Indicator ${raw.platform}`,
      gateRecommendation: raw.gate || `Platform ${raw.platform} Overbridge Gate`
    };
  });
}

// Additional stations to expand Station Finder and auto-completes
export const ALL_CORRIDOR_STATIONS: StationInfo[] = RAW_MUMBAI_BHOPAL_ROUTE.map(r => ({
  code: r.code,
  name: r.name,
  city: r.name.replace(' Junction', '').replace(' Central', ''),
  state: r.distKm <= 445 ? 'Maharashtra' : 'Madhya Pradesh',
  platforms: parseInt(r.platform) || 2
}));
