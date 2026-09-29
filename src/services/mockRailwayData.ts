import {
  Train,
  BlockSection,
  Junction,
  Signal,
  CrewStatus,
  RakeStatus,
  HistoricalMetric,
  Connection,
  StationFacility,
  SmartAlert,
  SimulationStep,
  StationInfo
} from '../types/railway';
import {
  buildMumbaiToBhopalStops,
  buildBhopalToMumbaiStops,
  ALL_CORRIDOR_STATIONS
} from './stationCorridors';

export const MAJOR_STATIONS: StationInfo[] = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', platforms: 16 },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', platforms: 8 },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', state: 'Maharashtra', platforms: 18 },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', platforms: 8 },
  { code: 'DR', name: 'Dadar', city: 'Mumbai', state: 'Maharashtra', platforms: 8 },
  { code: 'TNA', name: 'Thane', city: 'Thane', state: 'Maharashtra', platforms: 10 },
  { code: 'KYN', name: 'Kalyan Junction', city: 'Kalyan', state: 'Maharashtra', platforms: 8 },
  { code: 'IGP', name: 'Igatpuri', city: 'Igatpuri', state: 'Maharashtra', platforms: 4 },
  { code: 'NK', name: 'Nashik Road', city: 'Nashik', state: 'Maharashtra', platforms: 4 },
  { code: 'MMR', name: 'Manmad Junction', city: 'Manmad', state: 'Maharashtra', platforms: 6 },
  { code: 'CSN', name: 'Chalisgaon Junction', city: 'Chalisgaon', state: 'Maharashtra', platforms: 4 },
  { code: 'PC', name: 'Pachora Junction', city: 'Pachora', state: 'Maharashtra', platforms: 3 },
  { code: 'JL', name: 'Jalgaon Junction', city: 'Jalgaon', state: 'Maharashtra', platforms: 5 },
  { code: 'BSL', name: 'Bhusaval Junction', city: 'Bhusaval', state: 'Maharashtra', platforms: 8 },
  { code: 'BAU', name: 'Burhanpur', city: 'Burhanpur', state: 'Madhya Pradesh', platforms: 3 },
  { code: 'NPN', name: 'Nepanagar', city: 'Nepanagar', state: 'Madhya Pradesh', platforms: 2 },
  { code: 'KNW', name: 'Khandwa Junction', city: 'Khandwa', state: 'Madhya Pradesh', platforms: 6 },
  { code: 'HD', name: 'Harda', city: 'Harda', state: 'Madhya Pradesh', platforms: 3 },
  { code: 'TBN', name: 'Timarni', city: 'Timarni', state: 'Madhya Pradesh', platforms: 2 },
  { code: 'ET', name: 'Itarsi Junction', city: 'Itarsi', state: 'Madhya Pradesh', platforms: 8 },
  { code: 'NDPM', name: 'Narmadapuram', city: 'Hoshangabad', state: 'Madhya Pradesh', platforms: 3 },
  { code: 'RKMP', name: 'Rani Kamlapati', city: 'Bhopal', state: 'Madhya Pradesh', platforms: 5 },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', platforms: 6 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', platforms: 12 },
  { code: 'GNC', name: 'Gandhinagar Capital', city: 'Gandhinagar', state: 'Gujarat', platforms: 3 },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', platforms: 4 },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', platforms: 7 },
  { code: 'BVI', name: 'Borivali', city: 'Mumbai', state: 'Maharashtra', platforms: 10 },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', platforms: 8 },
  { code: 'BD', name: 'Badnera Junction', city: 'Amravati', state: 'Maharashtra', platforms: 3 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', platforms: 6 },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', platforms: 5 },
  { code: 'VGLJ', name: 'VGL Jhansi Junction', city: 'Jhansi', state: 'Uttar Pradesh', platforms: 8 },
  { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', platforms: 10 },
  { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu', platforms: 12 },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', platforms: 6 },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', platforms: 23 }
];

export const INITIAL_TRAINS: Train[] = [
  {
    id: 'train-12153',
    number: '12153',
    name: 'Mumbai - Bhopal Express',
    type: 'Superfast',
    source: 'Mumbai CSMT',
    sourceCode: 'CSMT',
    destination: 'Bhopal Junction',
    destCode: 'BPL',
    totalDistanceKm: 846,
    rakeComposition: ['EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'A1', 'A2', 'H1', 'PC', 'S1', 'S2', 'S3', 'S4', 'EOG'],
    departureTime: '19:05',
    arrivalTime: '11:10',
    duration: '16h 05m',
    punctualityScore: 96,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.8,
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    liveStatusSummary: 'Running 6 mins late · Passing Jalgaon Jn toward Bhusaval on Green Aspect',
    currentDelayMin: 6,
    stops: buildMumbaiToBhopalStops('19:05', 27) // 58 stations from Mumbai to Bhopal!
  },
  {
    id: 'train-12951',
    number: '12951',
    name: 'Bhopal - Mumbai Rajdhani Express',
    type: 'Rajdhani',
    source: 'Bhopal Junction',
    sourceCode: 'BPL',
    destination: 'Mumbai CSMT',
    destCode: 'CSMT',
    totalDistanceKm: 846,
    rakeComposition: ['EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'A1', 'A2', 'A3', 'H1', 'PC', 'B7', 'B8', 'EOG'],
    departureTime: '14:00',
    arrivalTime: '06:05',
    duration: '16h 05m',
    punctualityScore: 94,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.8,
    classesAvailable: ['1A', '2A', '3A'],
    liveStatusSummary: 'Running 11 mins late · Approach Signal Clear at Itarsi Jn',
    currentDelayMin: 11,
    stops: buildBhopalToMumbaiStops('14:00', 8) // 58 stations from Bhopal to Mumbai!
  },
  {
    id: 'train-20901',
    number: '20901',
    name: 'Vande Bharat Express',
    type: 'Vande Bharat',
    source: 'Mumbai Central',
    sourceCode: 'MMCT',
    destination: 'Gandhinagar Capital',
    destCode: 'GNC',
    totalDistanceKm: 522,
    rakeComposition: ['DTC1', 'NDTC1', 'TC1', 'NDTC2', 'EC1', 'EC2', 'TC2', 'NDTC3', 'NDTC4', 'DTC2'],
    departureTime: '06:10',
    arrivalTime: '12:28',
    duration: '6h 18m',
    punctualityScore: 99,
    crowdLevel: 'Low',
    cleanlinessRating: 5.0,
    classesAvailable: ['EC', 'CC'],
    liveStatusSummary: 'On Time · Approaching Surat on Clear Track',
    currentDelayMin: 3,
    stops: [
      {
        code: 'MMCT',
        name: 'Mumbai Central',
        scheduledArr: '06:00',
        scheduledDep: '06:10',
        predictedArr: '06:00',
        predictedDep: '06:10',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '5',
        status: 'passed',
        track: 'Platform 5',
        coordinates: { lat: 18.9696, lng: 72.8193 }
      },
      {
        code: 'BVI',
        name: 'Borivali',
        scheduledArr: '06:38',
        scheduledDep: '06:40',
        predictedArr: '06:40',
        predictedDep: '06:42',
        delayArrMin: 2,
        delayDepMin: 2,
        distanceKm: 30,
        platform: '6',
        status: 'passed',
        track: 'Fast Line',
        coordinates: { lat: 19.2288, lng: 72.8569 }
      },
      {
        code: 'ST',
        name: 'Surat',
        scheduledArr: '08:53',
        scheduledDep: '08:58',
        predictedArr: '08:56',
        predictedDep: '09:01',
        delayArrMin: 3,
        delayDepMin: 3,
        distanceKm: 263,
        platform: '1',
        status: 'current',
        track: 'Main Corridor',
        coordinates: { lat: 21.2049, lng: 72.8411 }
      },
      {
        code: 'BRC',
        name: 'Vadodara Junction',
        scheduledArr: '10:13',
        scheduledDep: '10:18',
        predictedArr: '10:17',
        predictedDep: '10:22',
        delayArrMin: 4,
        delayDepMin: 4,
        distanceKm: 392,
        platform: '2',
        status: 'upcoming',
        track: 'Main Up',
        coordinates: { lat: 22.3107, lng: 73.1812 }
      },
      {
        code: 'ADI',
        name: 'Ahmedabad Junction',
        scheduledArr: '11:25',
        scheduledDep: '11:30',
        predictedArr: '11:29',
        predictedDep: '11:34',
        delayArrMin: 4,
        delayDepMin: 4,
        distanceKm: 491,
        platform: '1',
        status: 'upcoming',
        track: 'Platform 1',
        coordinates: { lat: 23.0225, lng: 72.5714 }
      },
      {
        code: 'GNC',
        name: 'Gandhinagar Capital',
        scheduledArr: '12:25',
        scheduledDep: '12:25',
        predictedArr: '12:28',
        predictedDep: '12:28',
        delayArrMin: 3,
        delayDepMin: 3,
        distanceKm: 522,
        platform: '1',
        status: 'upcoming',
        track: 'Terminal Line',
        coordinates: { lat: 23.2386, lng: 72.6397 }
      }
    ]
  },
  {
    id: 'train-12002',
    number: '12002',
    name: 'Bhopal Shatabdi Express',
    type: 'Shatabdi',
    source: 'New Delhi',
    sourceCode: 'NDLS',
    destination: 'Rani Kamlapati (Bhopal)',
    destCode: 'RKMP',
    totalDistanceKm: 708,
    rakeComposition: ['EOG', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'E1', 'E2', 'EOG'],
    stops: [
      {
        code: 'NDLS',
        name: 'New Delhi',
        scheduledArr: '06:00',
        scheduledDep: '06:00',
        predictedArr: '06:00',
        predictedDep: '06:00',
        distanceKm: 0,
        platform: '1',
        status: 'passed',
        delayArrMin: 0,
        delayDepMin: 0,
        track: 'Platform 1',
        coordinates: { lat: 28.6415, lng: 77.2197 }
      },
      {
        code: 'AGC',
        name: 'Agra Cantt',
        scheduledArr: '07:50',
        scheduledDep: '07:55',
        predictedArr: '07:53',
        predictedDep: '07:58',
        distanceKm: 195,
        platform: '1',
        status: 'passed',
        delayArrMin: 3,
        delayDepMin: 3,
        track: 'Main Corridor',
        coordinates: { lat: 27.1587, lng: 78.0094 }
      },
      {
        code: 'GWL',
        name: 'Gwalior Junction',
        scheduledArr: '09:23',
        scheduledDep: '09:28',
        predictedArr: '09:25',
        predictedDep: '09:30',
        distanceKm: 313,
        platform: '2',
        status: 'current',
        delayArrMin: 2,
        delayDepMin: 2,
        track: 'Central Up',
        coordinates: { lat: 26.2183, lng: 78.1828 }
      },
      {
        code: 'VGLJ',
        name: 'VGL Jhansi Junction',
        scheduledArr: '10:45',
        scheduledDep: '10:50',
        predictedArr: '10:52',
        predictedDep: '10:57',
        distanceKm: 410,
        platform: '1',
        status: 'upcoming',
        delayArrMin: 7,
        delayDepMin: 7,
        track: 'Platform 1',
        coordinates: { lat: 25.4484, lng: 78.5685 }
      },
      {
        code: 'BPL',
        name: 'Bhopal Junction',
        scheduledArr: '14:07',
        scheduledDep: '14:12',
        predictedArr: '14:15',
        predictedDep: '14:20',
        distanceKm: 702,
        platform: '1',
        status: 'upcoming',
        delayArrMin: 8,
        delayDepMin: 8,
        track: 'Main Line',
        coordinates: { lat: 23.2599, lng: 77.4126 }
      },
      {
        code: 'RKMP',
        name: 'Rani Kamlapati',
        scheduledArr: '14:40',
        scheduledDep: '14:40',
        predictedArr: '14:48',
        predictedDep: '14:48',
        distanceKm: 708,
        platform: '1',
        status: 'upcoming',
        delayArrMin: 8,
        delayDepMin: 8,
        track: 'Terminal Line',
        coordinates: { lat: 23.2185, lng: 77.4377 }
      }
    ],
    departureTime: '06:00',
    arrivalTime: '14:48',
    duration: '8h 40m',
    punctualityScore: 98,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.9,
    classesAvailable: ['EC', 'CC'],
    liveStatusSummary: 'Running 8 mins late · Approaching Rani Kamlapati Terminal',
    currentDelayMin: 8
  },
  {
    id: 'train-12953',
    number: '12953',
    name: 'August Kranti Tejas Rajdhani',
    type: 'Tejas',
    source: 'Hazrat Nizamuddin',
    sourceCode: 'NZM',
    destination: 'Mumbai Central',
    destCode: 'MMCT',
    totalDistanceKm: 1377,
    rakeComposition: ['EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'A1', 'A2', 'H1', 'PC', 'EOG'],
    departureTime: '17:15',
    arrivalTime: '10:05',
    duration: '16h 50m',
    punctualityScore: 97,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.9,
    classesAvailable: ['1A', '2A', '3A'],
    liveStatusSummary: 'On Time · Green Interlocking Wave Ahead',
    currentDelayMin: 0,
    stops: [
      {
        code: 'NZM',
        name: 'Hazrat Nizamuddin',
        scheduledArr: '17:15',
        scheduledDep: '17:15',
        predictedArr: '17:15',
        predictedDep: '17:15',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '3',
        status: 'passed',
        track: 'Platform 3',
        coordinates: { lat: 28.5888, lng: 77.2536 }
      },
      {
        code: 'KOTA',
        name: 'Kota Junction',
        scheduledArr: '21:50',
        scheduledDep: '22:00',
        predictedArr: '21:50',
        predictedDep: '22:00',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 458,
        platform: '1',
        status: 'passed',
        track: 'Main Down Corridor',
        coordinates: { lat: 25.2181, lng: 75.8647 }
      },
      {
        code: 'RTM',
        name: 'Ratlam Junction',
        scheduledArr: '01:13',
        scheduledDep: '01:15',
        predictedArr: '01:13',
        predictedDep: '01:15',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 725,
        platform: '4',
        status: 'current',
        track: 'Central Trunk',
        coordinates: { lat: 23.3315, lng: 75.0367 }
      },
      {
        code: 'BRC',
        name: 'Vadodara Junction',
        scheduledArr: '05:18',
        scheduledDep: '05:28',
        predictedArr: '05:20',
        predictedDep: '05:30',
        delayArrMin: 2,
        delayDepMin: 2,
        distanceKm: 986,
        platform: '1',
        status: 'upcoming',
        track: 'Platform 1 Main',
        coordinates: { lat: 22.3107, lng: 73.1812 }
      },
      {
        code: 'ST',
        name: 'Surat',
        scheduledArr: '07:07',
        scheduledDep: '07:12',
        predictedArr: '07:09',
        predictedDep: '07:14',
        delayArrMin: 2,
        delayDepMin: 2,
        distanceKm: 1115,
        platform: '2',
        status: 'upcoming',
        track: 'Main Line',
        coordinates: { lat: 21.2049, lng: 72.8411 }
      },
      {
        code: 'BVI',
        name: 'Borivali',
        scheduledArr: '09:28',
        scheduledDep: '09:30',
        predictedArr: '09:29',
        predictedDep: '09:31',
        delayArrMin: 1,
        delayDepMin: 1,
        distanceKm: 1348,
        platform: '7',
        status: 'upcoming',
        track: 'Fast Up',
        coordinates: { lat: 19.2288, lng: 72.8569 }
      },
      {
        code: 'MMCT',
        name: 'Mumbai Central',
        scheduledArr: '10:05',
        scheduledDep: '10:05',
        predictedArr: '10:05',
        predictedDep: '10:05',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 1377,
        platform: '1',
        status: 'upcoming',
        track: 'Terminal Line',
        coordinates: { lat: 18.9696, lng: 72.8193 }
      }
    ]
  },
  {
    id: 'train-12009',
    number: '12009',
    name: 'Mumbai - Ahmedabad Shatabdi',
    type: 'Shatabdi',
    source: 'Mumbai Central',
    sourceCode: 'MMCT',
    destination: 'Ahmedabad Junction',
    destCode: 'ADI',
    totalDistanceKm: 491,
    rakeComposition: ['EOG', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'E1', 'E2', 'EOG'],
    departureTime: '06:20',
    arrivalTime: '12:45',
    duration: '6h 25m',
    punctualityScore: 98,
    crowdLevel: 'Low',
    cleanlinessRating: 4.9,
    classesAvailable: ['EC', 'CC'],
    liveStatusSummary: 'On Time · Cleared through Surat Corridor',
    currentDelayMin: 0,
    stops: [
      {
        code: 'MMCT',
        name: 'Mumbai Central',
        scheduledArr: '06:20',
        scheduledDep: '06:20',
        predictedArr: '06:20',
        predictedDep: '06:20',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '1',
        status: 'passed',
        track: 'Platform 1',
        coordinates: { lat: 18.9696, lng: 72.8193 }
      },
      {
        code: 'BVI',
        name: 'Borivali',
        scheduledArr: '06:53',
        scheduledDep: '06:55',
        predictedArr: '06:53',
        predictedDep: '06:55',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 30,
        platform: '6',
        status: 'passed',
        track: 'Fast Down Line',
        coordinates: { lat: 19.2288, lng: 72.8569 }
      },
      {
        code: 'ST',
        name: 'Surat',
        scheduledArr: '09:18',
        scheduledDep: '09:23',
        predictedArr: '09:18',
        predictedDep: '09:23',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 263,
        platform: '1',
        status: 'current',
        track: 'Main Corridor',
        coordinates: { lat: 21.2049, lng: 72.8411 }
      },
      {
        code: 'BRC',
        name: 'Vadodara Junction',
        scheduledArr: '10:45',
        scheduledDep: '10:50',
        predictedArr: '10:45',
        predictedDep: '10:50',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 392,
        platform: '3',
        status: 'upcoming',
        track: 'Main Line',
        coordinates: { lat: 22.3107, lng: 73.1812 }
      },
      {
        code: 'ADI',
        name: 'Ahmedabad Junction',
        scheduledArr: '12:45',
        scheduledDep: '12:45',
        predictedArr: '12:45',
        predictedDep: '12:45',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 491,
        platform: '1',
        status: 'upcoming',
        track: 'Platform 1',
        coordinates: { lat: 23.0225, lng: 72.5714 }
      }
    ]
  },
  {
    id: 'train-12290',
    number: '12290',
    name: 'CSMT Duronto Express',
    type: 'Duronto',
    source: 'Nagpur Junction',
    sourceCode: 'NGP',
    destination: 'Mumbai CSMT',
    destCode: 'CSMT',
    totalDistanceKm: 837,
    rakeComposition: ['EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'A1', 'A2', 'H1', 'S1', 'S2', 'S3', 'EOG'],
    departureTime: '20:30',
    arrivalTime: '08:05',
    duration: '11h 35m',
    punctualityScore: 92,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.7,
    classesAvailable: ['1A', '2A', '3A', 'SL'],
    liveStatusSummary: 'Running 6 mins late · High Priority Freight Preemption',
    currentDelayMin: 6,
    stops: [
      {
        code: 'NGP',
        name: 'Nagpur Junction',
        scheduledArr: '20:30',
        scheduledDep: '20:30',
        predictedArr: '20:30',
        predictedDep: '20:30',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '8',
        status: 'passed',
        track: 'Platform 8',
        coordinates: { lat: 21.1524, lng: 79.0882 }
      },
      {
        code: 'BD',
        name: 'Badnera Junction',
        scheduledArr: '22:48',
        scheduledDep: '22:50',
        predictedArr: '22:52',
        predictedDep: '22:54',
        delayArrMin: 4,
        delayDepMin: 4,
        distanceKm: 174,
        platform: '1',
        status: 'current',
        track: 'Main Corridor',
        coordinates: { lat: 20.8656, lng: 77.7289 }
      },
      {
        code: 'BSL',
        name: 'Bhusaval Junction',
        scheduledArr: '01:50',
        scheduledDep: '01:55',
        predictedArr: '01:56',
        predictedDep: '02:01',
        delayArrMin: 6,
        delayDepMin: 6,
        distanceKm: 392,
        platform: '3',
        status: 'upcoming',
        track: 'Up Line',
        coordinates: { lat: 21.0456, lng: 75.7892 }
      },
      {
        code: 'CSMT',
        name: 'Mumbai CSMT',
        scheduledArr: '08:05',
        scheduledDep: '08:05',
        predictedArr: '08:11',
        predictedDep: '08:11',
        delayArrMin: 6,
        delayDepMin: 6,
        distanceKm: 837,
        platform: '16',
        status: 'upcoming',
        track: 'Terminal Line 16',
        coordinates: { lat: 18.9401, lng: 72.8352 }
      }
    ]
  },
  {
    id: 'train-20608',
    number: '20608',
    name: 'Chennai Vande Bharat Express',
    type: 'Vande Bharat',
    source: 'KSR Bengaluru',
    sourceCode: 'SBC',
    destination: 'MGR Chennai Central',
    destCode: 'MAS',
    totalDistanceKm: 359,
    rakeComposition: ['DTC1', 'NDTC1', 'TC1', 'EC1', 'EC2', 'TC2', 'NDTC2', 'DTC2'],
    departureTime: '05:45',
    arrivalTime: '10:10',
    duration: '4h 25m',
    punctualityScore: 99,
    crowdLevel: 'Low',
    cleanlinessRating: 5.0,
    classesAvailable: ['EC', 'CC'],
    liveStatusSummary: 'On Time · High-Speed Track Clearance Active',
    currentDelayMin: 0,
    stops: [
      {
        code: 'SBC',
        name: 'KSR Bengaluru',
        scheduledArr: '05:45',
        scheduledDep: '05:45',
        predictedArr: '05:45',
        predictedDep: '05:45',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '7',
        status: 'passed',
        track: 'Platform 7',
        coordinates: { lat: 12.9781, lng: 77.5695 }
      },
      {
        code: 'KJM',
        name: 'Krishnarajapuram',
        scheduledArr: '06:03',
        scheduledDep: '06:05',
        predictedArr: '06:03',
        predictedDep: '06:05',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 14,
        platform: '2',
        status: 'current',
        track: 'Fast Main',
        coordinates: { lat: 12.9996, lng: 77.6766 }
      },
      {
        code: 'KPD',
        name: 'Katpadi Junction',
        scheduledArr: '08:23',
        scheduledDep: '08:25',
        predictedArr: '08:23',
        predictedDep: '08:25',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 229,
        platform: '1',
        status: 'upcoming',
        track: 'Main Corridor',
        coordinates: { lat: 12.9702, lng: 79.1362 }
      },
      {
        code: 'MAS',
        name: 'MGR Chennai Central',
        scheduledArr: '10:10',
        scheduledDep: '10:10',
        predictedArr: '10:10',
        predictedDep: '10:10',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 359,
        platform: '2A',
        status: 'upcoming',
        track: 'Terminal Line 2A',
        coordinates: { lat: 13.0827, lng: 80.2755 }
      }
    ]
  }
];

/**
 * Intelligent route finder that matches trains between stations.
 * Extracts station names and station codes (handling strings like 'Mumbai Central (MMCT)' or 'Bhopal Junction (BPL)').
 */
export function findTrainsForRoute(fromQuery: string, toQuery: string, allTrains: Train[]): Train[] {
  const normFrom = fromQuery.toLowerCase().trim();
  const normTo = toQuery.toLowerCase().trim();

  if (!normFrom || !normTo) return allTrains;

  // Extract tokens from query (e.g. "Mumbai CSMT (CSMT)" -> ["mumbai csmt (csmt)", "csmt", "mumbai csmt", "mumbai", "csmt"])
  const getTokens = (q: string): string[] => {
    const raw = q.toLowerCase().trim();
    const codeMatch = raw.match(/\(([^)]+)\)/);
    const code = codeMatch ? codeMatch[1].trim() : '';
    const withoutParen = raw.replace(/\([^)]+\)/g, '').trim();
    const words = withoutParen.split(/\s+/).filter(w => w.length > 2);
    return Array.from(new Set([raw, code, withoutParen, ...words].filter(Boolean)));
  };

  const fromTokens = getTokens(fromQuery);
  const toTokens = getTokens(toQuery);

  const testMatch = (targetName: string, targetCode: string, tokens: string[]) => {
    const tName = targetName.toLowerCase();
    const tCode = targetCode.toLowerCase();
    return tokens.some(tok => 
      tName.includes(tok) || 
      tok.includes(tName) || 
      tCode === tok || 
      tName.replace(' junction', '').trim().includes(tok) ||
      tName.replace(' central', '').trim().includes(tok)
    );
  };

  // Direct origin/destination or intermediate stop match
  const matches = allTrains.filter(t => {
    const srcMatch = testMatch(t.source, t.sourceCode, fromTokens);
    const destMatch = testMatch(t.destination, t.destCode, toTokens);
    if (srcMatch && destMatch) return true;

    // Check intermediate stop progression
    const fromStopIdx = t.stops.findIndex(s => testMatch(s.name, s.code, fromTokens));
    const toStopIdx = t.stops.findIndex(s => testMatch(s.name, s.code, toTokens));

    return fromStopIdx !== -1 && toStopIdx !== -1 && fromStopIdx < toStopIdx;
  });

  if (matches.length > 0) {
    return matches;
  }

  // Synthesize realistic options if a custom pair was selected
  const fromStation = MAJOR_STATIONS.find(s => s.name.toLowerCase().includes(normFrom) || s.code.toLowerCase() === normFrom) || {
    name: fromQuery,
    code: fromQuery.slice(0, 4).toUpperCase(),
    city: fromQuery,
    state: 'Network',
    platforms: 4
  };

  const toStation = MAJOR_STATIONS.find(s => s.name.toLowerCase().includes(normTo) || s.code.toLowerCase() === normTo) || {
    name: toQuery,
    code: toQuery.slice(0, 4).toUpperCase(),
    city: toQuery,
    state: 'Network',
    platforms: 6
  };

  const syntheticTrain1: Train = {
    id: `train-vb-${fromStation.code}-${toStation.code}`,
    number: `20${Math.floor(100 + Math.random() * 899)}`,
    name: `${fromStation.name} - ${toStation.name} Vande Bharat`,
    type: 'Vande Bharat',
    source: fromStation.name,
    sourceCode: fromStation.code,
    destination: toStation.name,
    destCode: toStation.code,
    totalDistanceKm: 480,
    departureTime: '06:15',
    arrivalTime: '11:45',
    duration: '5h 30m',
    punctualityScore: 99,
    crowdLevel: 'Low',
    cleanlinessRating: 4.9,
    classesAvailable: ['EC', 'CC'],
    liveStatusSummary: 'On Time · High-Speed Corridor Track Cleared',
    currentDelayMin: 0,
    rakeComposition: ['DTC1', 'NDTC1', 'TC1', 'EC1', 'EC2', 'TC2', 'NDTC2', 'DTC2'],
    stops: [
      {
        code: fromStation.code,
        name: fromStation.name,
        scheduledArr: '06:15',
        scheduledDep: '06:15',
        predictedArr: '06:15',
        predictedDep: '06:15',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '1',
        status: 'passed',
        track: 'Platform 1',
        coordinates: { lat: 21.0, lng: 76.0 }
      },
      {
        code: `${fromStation.code.slice(0, 2)}X`,
        name: `Inter-Corridor Section`,
        scheduledArr: '08:30',
        scheduledDep: '08:35',
        predictedArr: '08:30',
        predictedDep: '08:35',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 240,
        platform: '2',
        status: 'current',
        track: 'Central Fast Main',
        coordinates: { lat: 22.0, lng: 77.0 }
      },
      {
        code: toStation.code,
        name: toStation.name,
        scheduledArr: '11:45',
        scheduledDep: '11:45',
        predictedArr: '11:45',
        predictedDep: '11:45',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 480,
        platform: '1',
        status: 'upcoming',
        track: 'Platform 1',
        coordinates: { lat: 23.0, lng: 78.0 }
      }
    ]
  };

  const syntheticTrain2: Train = {
    id: `train-sf-${fromStation.code}-${toStation.code}`,
    number: `12${Math.floor(100 + Math.random() * 899)}`,
    name: `${fromStation.name} - ${toStation.name} Superfast Express`,
    type: 'Superfast',
    source: fromStation.name,
    sourceCode: fromStation.code,
    destination: toStation.name,
    destCode: toStation.code,
    totalDistanceKm: 480,
    departureTime: '14:20',
    arrivalTime: '21:05',
    duration: '6h 45m',
    punctualityScore: 94,
    crowdLevel: 'Moderate',
    cleanlinessRating: 4.6,
    classesAvailable: ['2A', '3A', 'SL'],
    liveStatusSummary: 'Running 5 mins late · Controlled Junction Clearance',
    currentDelayMin: 5,
    rakeComposition: ['EOG', 'B1', 'B2', 'B3', 'A1', 'S1', 'S2', 'S3', 'S4', 'PC', 'EOG'],
    stops: [
      {
        code: fromStation.code,
        name: fromStation.name,
        scheduledArr: '14:20',
        scheduledDep: '14:20',
        predictedArr: '14:20',
        predictedDep: '14:20',
        delayArrMin: 0,
        delayDepMin: 0,
        distanceKm: 0,
        platform: '3',
        status: 'passed',
        track: 'Platform 3',
        coordinates: { lat: 21.0, lng: 76.0 }
      },
      {
        code: `${fromStation.code.slice(0, 2)}J`,
        name: `Junction Junction`,
        scheduledArr: '17:40',
        scheduledDep: '17:45',
        predictedArr: '17:44',
        predictedDep: '17:49',
        delayArrMin: 4,
        delayDepMin: 4,
        distanceKm: 240,
        platform: '1',
        status: 'current',
        track: 'Loop Track 1',
        coordinates: { lat: 22.0, lng: 77.0 }
      },
      {
        code: toStation.code,
        name: toStation.name,
        scheduledArr: '21:00',
        scheduledDep: '21:00',
        predictedArr: '21:05',
        predictedDep: '21:05',
        delayArrMin: 5,
        delayDepMin: 5,
        distanceKm: 480,
        platform: '2',
        status: 'upcoming',
        track: 'Platform 2',
        coordinates: { lat: 23.0, lng: 78.0 }
      }
    ]
  };

  return [syntheticTrain1, syntheticTrain2];
}

export const INITIAL_SIGNALS: Signal[] = [
  {
    id: 'sig-s14',
    code: 'S14',
    name: 'Itarsi North Outer Home',
    aspect: 'GREEN',
    location: 'Km 90.4 Down Main',
    blockSectionId: 'blk-b22',
    speedLimitKmph: 110,
    distanceM: 2400,
    type: 'Automatic 4-Aspect'
  },
  {
    id: 'sig-s16',
    code: 'S16',
    name: 'Junction J12 Approach Signal',
    aspect: 'YELLOW',
    location: 'Km 91.8 Down Main',
    blockSectionId: 'blk-b23',
    speedLimitKmph: 60,
    distanceM: 1100,
    type: 'Automatic 4-Aspect'
  },
  {
    id: 'sig-s18',
    code: 'S18',
    name: 'J12 Junction Home Signal',
    aspect: 'YELLOW',
    location: 'Km 92.1 Station Throat',
    blockSectionId: 'blk-b24',
    speedLimitKmph: 30,
    distanceM: 350,
    type: 'Home'
  },
  {
    id: 'sig-s20',
    code: 'S20',
    name: 'Platform 2 Starter Signal',
    aspect: 'RED',
    location: 'Km 92.6 Platform End',
    blockSectionId: 'blk-b25',
    speedLimitKmph: 0,
    distanceM: 700,
    type: 'Starter'
  },
  {
    id: 'sig-s22',
    code: 'S22',
    name: 'South Cabin Advance Starter',
    aspect: 'RED',
    location: 'Km 93.4 South Exit',
    blockSectionId: 'blk-b26',
    speedLimitKmph: 0,
    distanceM: 1500,
    type: 'Semi-Automatic'
  }
];

export const INITIAL_BLOCKS: BlockSection[] = [
  {
    id: 'blk-b22',
    code: 'Dewas Area',
    name: 'Dewas Area',
    areaName: 'Dewas Area',
    lengthKm: 1.8,
    status: 'CLEAR',
    congestionLevel: 'LOW',
    maxPermissibleSpeedKmph: 130
  },
  {
    id: 'blk-b23',
    code: 'Indore Area',
    name: 'Indore Area',
    areaName: 'Indore Area',
    lengthKm: 1.4,
    status: 'RESTRICTED',
    congestionLevel: 'MODERATE',
    maxPermissibleSpeedKmph: 75
  },
  {
    id: 'blk-b24',
    code: 'Bhopal Area',
    name: 'Bhopal Area',
    areaName: 'Bhopal Area',
    lengthKm: 0.9,
    status: 'OCCUPIED',
    occupiedByTrain: '01215 Goods Container rake',
    congestionLevel: 'HIGH',
    maxPermissibleSpeedKmph: 30
  },
  {
    id: 'blk-b25',
    code: 'Itarsi Area',
    name: 'Itarsi Area',
    areaName: 'Itarsi Area',
    lengthKm: 1.1,
    status: 'OCCUPIED',
    occupiedByTrain: '12808 Samta Express (Platform 2)',
    congestionLevel: 'HIGH',
    maxPermissibleSpeedKmph: 15
  },
  {
    id: 'blk-b26',
    code: 'Khandwa Area',
    name: 'Khandwa Area',
    areaName: 'Khandwa Area',
    lengthKm: 2.2,
    status: 'CLEAR',
    congestionLevel: 'LOW',
    maxPermissibleSpeedKmph: 110
  }
];

export const INITIAL_JUNCTIONS: Junction[] = [
  {
    id: 'junc-j12',
    code: 'J12',
    name: 'Itarsi North Junction & Cabin',
    tracksCount: 6,
    activeRoutes: 4,
    congestionLevel: 'HIGH',
    queuedTrains: ['12951 Rajdhani', '01215 Goods Freight', '12808 Samta Express'],
    conflictDetected: true,
    conflictSummary: 'Train 12951 route holds overlap with crossing freight rake 01215 at diamond switch 14A.',
    estimatedCrossingDelayMin: 8
  },
  {
    id: 'junc-j14',
    code: 'J14',
    name: 'Itarsi South Bye-pass Cabin',
    tracksCount: 4,
    activeRoutes: 2,
    congestionLevel: 'MODERATE',
    queuedTrains: ['12616 Grand Trunk Express'],
    conflictDetected: false,
    estimatedCrossingDelayMin: 3
  },
  {
    id: 'junc-j16',
    code: 'J16',
    name: 'Amla Chord Junction',
    tracksCount: 3,
    activeRoutes: 1,
    congestionLevel: 'LOW',
    queuedTrains: [],
    conflictDetected: false,
    estimatedCrossingDelayMin: 0
  }
];

export const INITIAL_CREW: CrewStatus = {
  assignedDriver: 'Rajesh K. Sharma (LP-G1)',
  assignedGuard: 'Sunil V. Deshmukh (Sr. Goods/Mail Guard)',
  driverId: 'IR-WCR-44910',
  signOnStatus: 'COMPLETE',
  signOnTime: '13:05',
  dutyHoursElapsed: 2.6,
  maxDutyHours: 9.0,
  readiness: 'READY',
  connectingCrewStatus: 'ON_TIME',
  locoFitnessCleared: true,
  breathalyzerPassed: true
};

export const INITIAL_RAKE: RakeStatus = {
  rakeId: 'LHB-WCR-2023-R08',
  coachCount: 15,
  mechanicalInspection: 'PASSED',
  maintenanceStatus: 'CLEARED',
  coachReadiness: '100% READY',
  turnaroundRemainingMin: 12,
  departureShiftMin: 0,
  acTractionHealthPct: 98,
  brakePressurePsi: 5.0
};

export const INITIAL_HISTORICAL: HistoricalMetric = {
  section: 'Bhopal (BPL) — Itarsi (ET) — Nagpur (NGP)',
  fromStation: 'Itarsi Jn (ET)',
  toStation: 'Nagpur Jn (NGP)',
  avgDelayMin: 14,
  medianDelayMin: 11,
  delayFrequencyPct: 68,
  highDelayWindow: '18:00 – 22:30',
  typicalRecoveryMin: 4,
  seasonalRisk: 'MODERATE',
  patternInsight: 'Over the last 90 days, 68% of southbound Rajdhani class trains experience a +6 to +12 minute hold at Itarsi North Cabin during evening freight priority windows.',
  hourlyTrends: [
    { hour: '14:00', avgDelay: 4 },
    { hour: '15:00', avgDelay: 8 },
    { hour: '16:00', avgDelay: 11 },
    { hour: '17:00', avgDelay: 13 },
    { hour: '18:00', avgDelay: 17 },
    { hour: '19:00', avgDelay: 15 },
    { hour: '20:00', avgDelay: 12 },
    { hour: '21:00', avgDelay: 9 },
    { hour: '22:00', avgDelay: 6 }
  ]
};

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    type: 'TRAIN',
    transportName: 'Connecting 12138 Punjab Mail',
    identifier: 'Train 12138',
    destination: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    departureTime: '15:52',
    platformOrGate: 'Platform 4',
    walkingTimeMin: 5,
    riskLevel: 'WATCH',
    bufferRemainingMin: 11,
    guidance: 'Deboard from Coach B4, take FOB 2 directly over Track 3 to Platform 4.'
  },
  {
    id: 'conn-2',
    type: 'BUS',
    transportName: 'MSRTC Super Express',
    identifier: 'Bus Route 402',
    destination: 'Hoshangabad City Hub',
    departureTime: '16:15',
    platformOrGate: 'East Bus Terminal Bay 3',
    walkingTimeMin: 6,
    riskLevel: 'SAFE',
    bufferRemainingMin: 28,
    guidance: 'Take North Exit past Parcel office towards East Bus Stand.'
  },
  {
    id: 'conn-3',
    type: 'CAB',
    transportName: 'Prepaid Taxi / App Ride',
    identifier: 'Zone Alpha',
    destination: 'Itarsi Ordinance Estate',
    departureTime: 'Flexible (Scheduled 16:00)',
    platformOrGate: 'Station Circulating Area Gate B',
    walkingTimeMin: 3,
    riskLevel: 'SAFE',
    bufferRemainingMin: 45,
    guidance: 'Follow the green ceiling signs to Prepaid Taxi counter near Gate B.'
  }
];

export const INITIAL_FACILITIES: StationFacility[] = [
  {
    id: 'fac-1',
    category: 'lounge',
    name: 'IRCTC Executive Lounge & AC Waiting Hall',
    location: 'Platform 1, Concourse Area',
    platform: 1,
    distanceM: 65,
    walkTimeMin: 1,
    openStatus: '24/7',
    details: 'Reclining seating, Wi-Fi, flight/train status monitors, light refreshments.'
  },
  {
    id: 'fac-2',
    category: 'food',
    name: 'Comesum Multi-Cuisine Food Court',
    location: 'Platform 2, Central Section',
    platform: 2,
    distanceM: 40,
    walkTimeMin: 1,
    openStatus: 'OPEN',
    details: 'Thali meals, South Indian snacks, bottled water, packed snacks.'
  },
  {
    id: 'fac-3',
    category: 'washroom',
    name: 'Clean Modern Restrooms & Baby Care',
    location: 'Platform 2 near Foot Over Bridge 2',
    platform: 2,
    distanceM: 35,
    walkTimeMin: 1,
    openStatus: '24/7',
    details: 'Wheelchair accessible, dedicated baby changing station, attendant on duty.'
  },
  {
    id: 'fac-4',
    category: 'cloak_room',
    name: 'Left Luggage & Cloak Room',
    location: 'East Entrance, Beside Booking Office',
    platform: 1,
    distanceM: 110,
    walkTimeMin: 2,
    openStatus: '24/7',
    details: 'Verified QR digital luggage token, Rs 20 / 24 hours per bag.'
  },
  {
    id: 'fac-5',
    category: 'medical',
    name: 'Emergency First Aid Post & Jan Aushadhi',
    location: 'Platform 1, Middle Hall',
    platform: 1,
    distanceM: 80,
    walkTimeMin: 2,
    openStatus: '24/7',
    details: 'Stretcher available, on-call railway assistant medical officer.'
  },
  {
    id: 'fac-6',
    category: 'atm',
    name: 'State Bank of India & Bank of Baroda ATMs',
    location: 'Station Main Hall',
    platform: 1,
    distanceM: 90,
    walkTimeMin: 2,
    openStatus: '24/7',
    details: 'Cash withdrawal and mini-statement services.'
  },
  {
    id: 'fac-7',
    category: 'taxi',
    name: 'Pre-paid Auto Rickshaw & Taxi Booth',
    location: 'Circulating Area Gate A',
    distanceM: 120,
    walkTimeMin: 3,
    openStatus: '24/7',
    details: 'Government regulated fixed rates with computerized receipt slip.'
  }
];

export const INITIAL_ALERTS: SmartAlert[] = [
  {
    id: 'alt-1',
    type: 'ETA_CHANGED',
    title: 'ETA Updated (+7 min)',
    message: 'Predicted arrival at Itarsi Jn shifted from 15:25 to 15:36 due to J12 junction track occupancy.',
    timestamp: '15:18',
    read: false,
    severity: 'warning',
    targetTab: 'prediction',
    category: 'journey'
  },
  {
    id: 'alt-2',
    type: 'CONGESTION_ALERT',
    title: 'Approaching High Congestion Zone',
    message: 'Signal S16 caution aspect active. Freight rake 01215 is clearing Bhopal Area.',
    timestamp: '15:15',
    read: false,
    severity: 'warning',
    targetTab: 'network',
    category: 'network'
  },
  {
    id: 'alt-3',
    type: 'CONNECTION_RISK',
    title: 'Connection Buffer Alert',
    message: 'Connecting train 12138 transfer buffer reduced to 11 min. Platform 4 transfer advised.',
    timestamp: '15:12',
    read: false,
    severity: 'critical',
    targetTab: 'connection',
    category: 'connection'
  },
  {
    id: 'alt-4',
    type: 'STATION_APPROACHING',
    title: 'Next Halt: Itarsi Jn (ET)',
    message: 'Train is 3.8 km from Itarsi Junction. Platform 2 allocation confirmed.',
    timestamp: '15:10',
    read: true,
    severity: 'info',
    targetTab: 'gps',
    category: 'journey'
  }
];

export const SIMULATION_PIPELINE_STEPS: SimulationStep[] = [
  {
    step: 1,
    title: 'Train Running Normally',
    description: '12951 Mumbai Rajdhani running at 112 km/h through Dewas Area. All signals green.',
    section: 'Bhopal Outer Corridor',
    speedKmph: 112,
    delayMin: 2,
    congestion: 'LOW',
    signalAspect: 'GREEN',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'LOW',
    connectionBufferMin: 24,
    connectionRisk: 'SAFE',
    alertMessage: 'Train running within nominal speed envelope. ETA nominal at 15:27.'
  },
  {
    step: 2,
    title: 'GPS Position Updates',
    description: 'Satellite telemetry reports Km 88.2. Speed settles to 94 km/h approaching Itarsi North territory.',
    section: 'Approach Sector Itarsi North',
    speedKmph: 94,
    delayMin: 3,
    congestion: 'LOW',
    signalAspect: 'GREEN',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'LOW',
    connectionBufferMin: 22,
    connectionRisk: 'SAFE',
    alertMessage: 'GPS fix synchronized (14 satellites locked). Speed 94 km/h.'
  },
  {
    step: 3,
    title: 'Signal Congestion Increases',
    description: 'Signal S16 turns Yellow. Up freight rake holds Bhopal Area ahead.',
    section: 'Indore Area - Signal S16',
    speedKmph: 62,
    delayMin: 6,
    congestion: 'MODERATE',
    signalAspect: 'YELLOW',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'MODERATE',
    connectionBufferMin: 18,
    connectionRisk: 'WATCH',
    alertMessage: 'Signal S16 aspect changed to Caution (Yellow). Speed restriction 60 km/h applied.'
  },
  {
    step: 4,
    title: 'Network Delay Detected',
    description: 'Junction J12 North Cabin routes hold diamond crossover. Signal S18 drops to Double Yellow/Stop hold.',
    section: 'Junction J12 Throat',
    speedKmph: 28,
    delayMin: 9,
    congestion: 'HIGH',
    signalAspect: 'YELLOW',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'MODERATE',
    connectionBufferMin: 14,
    connectionRisk: 'WATCH',
    alertMessage: 'Network delay detected at Junction J12. Expected clearance impact +4 to +6 min.'
  },
  {
    step: 5,
    title: 'Crew / Rake Readiness Constraint',
    description: 'Station inspection flag: Platform 2 turnaround rake watering line valve verification underway.',
    section: 'Itarsi Jn Yard',
    speedKmph: 22,
    delayMin: 12,
    congestion: 'HIGH',
    signalAspect: 'YELLOW',
    crewReadiness: 'ATTENTION',
    rakeReadiness: 'WATERING_IN_PROGRESS',
    historicalRisk: 'MODERATE',
    connectionBufferMin: 10,
    connectionRisk: 'WATCH',
    alertMessage: 'Rake servicing in progress on Platform 2. Turnaround window extended by 3 minutes.'
  },
  {
    step: 6,
    title: 'Historical Pattern Increases Risk',
    description: 'Historical Engine correlates 15:00-18:00 freight peak hours. High delay recurrence detected.',
    section: 'Itarsi-Nagpur Corridor',
    speedKmph: 18,
    delayMin: 14,
    congestion: 'HIGH',
    signalAspect: 'YELLOW',
    crewReadiness: 'ATTENTION',
    rakeReadiness: 'WATERING_IN_PROGRESS',
    historicalRisk: 'HIGH',
    connectionBufferMin: 8,
    connectionRisk: 'AT_RISK',
    alertMessage: 'Historical pattern match: Evening corridor freight contention adds +3 min expected delay.'
  },
  {
    step: 7,
    title: 'Dynamic ETA Recalculates',
    description: 'ETA Engine aggregates GPS progress + Network hold + Rake delay + Historical trend.',
    section: 'Itarsi Junction Approach',
    speedKmph: 15,
    delayMin: 15,
    congestion: 'CRITICAL',
    signalAspect: 'YELLOW',
    crewReadiness: 'ATTENTION',
    rakeReadiness: 'WATERING_IN_PROGRESS',
    historicalRisk: 'HIGH',
    connectionBufferMin: 7,
    connectionRisk: 'AT_RISK',
    alertMessage: 'Predicted ETA adjusted to 15:40 (+15 min total delay). Confidence 88%.'
  },
  {
    step: 8,
    title: 'Explainable AI Breakdown',
    description: 'Prediction engine generates deterministic waterfall factors for complete transparency.',
    section: 'Itarsi Junction Entry',
    speedKmph: 25,
    delayMin: 15,
    congestion: 'HIGH',
    signalAspect: 'YELLOW',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'HIGH',
    connectionBufferMin: 7,
    connectionRisk: 'AT_RISK',
    alertMessage: 'Prediction explanation updated: Net +11 min (+5 netw, +3 rake, +3 hist, -2 rec).'
  },
  {
    step: 9,
    title: 'Connection Risk Increases',
    description: 'Connecting train 12138 buffer drops below critical threshold (7 min remaining vs 5 min walk).',
    section: 'Platform 2 Approach',
    speedKmph: 20,
    delayMin: 15,
    congestion: 'MODERATE',
    signalAspect: 'GREEN',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'MODERATE',
    connectionBufferMin: 6,
    connectionRisk: 'AT_RISK',
    alertMessage: 'Connection Alert: Transfer window critically tight! Buffer down to 6 minutes.'
  },
  {
    step: 10,
    title: 'Smart Alert Generated',
    description: 'Multi-channel priority notification dispatched to user with action instructions.',
    section: 'Itarsi Platform 2 Docking',
    speedKmph: 10,
    delayMin: 14,
    congestion: 'MODERATE',
    signalAspect: 'GREEN',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'MODERATE',
    connectionBufferMin: 7,
    connectionRisk: 'AT_RISK',
    alertMessage: 'Critical Alert: Proceed immediately via FOB 2 to Platform 4 upon train halt.'
  },
  {
    step: 11,
    title: 'Station Orientation Guidance',
    description: 'Dynamic Station Guide activates: coach B4 alignment mapped directly to FOB 2 ramp.',
    section: 'Itarsi Jn Platform 2',
    speedKmph: 0,
    delayMin: 13,
    congestion: 'LOW',
    signalAspect: 'GREEN',
    crewReadiness: 'READY',
    rakeReadiness: '100% READY',
    historicalRisk: 'LOW',
    connectionBufferMin: 9,
    connectionRisk: 'WATCH',
    alertMessage: 'Platform 2 Guide active: Coach B4 door opens directly opposite FOB 2 staircase.'
  }
];
