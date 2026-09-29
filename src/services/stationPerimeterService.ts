import { StationPerimeterItem, FetchProbabilityAnalysis } from '../types/railway';

export const STATION_PERIMETER_ITEMS: StationPerimeterItem[] = [
  // =================== ITARSI JUNCTION (ET) ===================
  {
    id: 'et-med-1',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'medical',
    name: 'Jan Aushadhi Kendra (Platform 1 Concourse)',
    specialtyOrMeds: 'Emergency Generic Meds, ORS, Paracetamol, Bandages & Pain Sprays',
    locationDescription: 'Platform 1, near North Foot Over Bridge & IRCTC Hall',
    isInsideStation: true,
    distanceMeters: 45,
    oneWayWalkTimeMin: 0.8,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: 'Govt Subsidized / ₹10 - ₹60',
    operatingHours: '24 Hours Open',
    rating: 4.8,
    reviewsCount: 312,
    phone: '+91 7572 240112',
    hasQuickPackDelivery: true,
    recommendedItems: ['ORS Electrolyte Sachets', 'Paracetamol 650', 'Motion Sickness Avomine', 'Dettol & Band-Aids', 'Digene Antacid']
  },
  {
    id: 'et-med-2',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'medical',
    name: 'Railway Emergency Medical First Aid Post',
    specialtyOrMeds: 'Free Emergency Medical Assessment, Stretcher, Blood Pressure & Glucose Relief',
    locationDescription: 'Platform 1 Center, opposite Station Superintendent Cabin',
    isInsideStation: true,
    distanceMeters: 60,
    oneWayWalkTimeMin: 1.0,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: 'Free Emergency Service (Indian Railways)',
    operatingHours: '24/7 Attendant on Duty',
    rating: 4.9,
    reviewsCount: 184,
    hasQuickPackDelivery: false,
    recommendedItems: ['Emergency Pain Relief', 'Oxygen / Inhaler Support', 'Wound Dressing', 'BP & Sugar Check']
  },
  {
    id: 'et-med-3',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'medical',
    name: 'Shree Ram Day-Night Chemist & Baby Care',
    specialtyOrMeds: 'Insulin Ice-Cooling Packs, Prescription Antibiotics, Baby Milk Powder & Diapers',
    locationDescription: 'Station Circulating Area, Gate 2 Circle (180m from porch)',
    isInsideStation: false,
    distanceMeters: 180,
    oneWayWalkTimeMin: 2.8,
    avgPrepOrQueueTimeMin: 2.5,
    pricing: 'Standard MRP (Card/UPI Accepted)',
    operatingHours: '24/7 Day & Night',
    rating: 4.7,
    reviewsCount: 420,
    phone: '+91 7572 258900',
    hasQuickPackDelivery: true,
    recommendedItems: ['Insulin Gel Pack Chillers', 'Lactogen Baby Milk Powder', 'N-95 Travel Masks', 'Crepe Bandage', 'Pediatric Syrups']
  },
  {
    id: 'et-food-1',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'famous_food',
    name: 'Shree Ganga Itarsi Famous Rabdi & Jalebi',
    specialtyOrMeds: 'GI-Famous Creamy Condensed Milk Rabdi with Hot Crispy Saffron Jalebi',
    locationDescription: 'Platform 2, Stall #7 (Right in front of Coach B3-B4)',
    isInsideStation: true,
    distanceMeters: 25,
    oneWayWalkTimeMin: 0.4,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: '₹50 - ₹120 / portion',
    operatingHours: '05:00 - 01:00 Daily',
    rating: 4.9,
    reviewsCount: 1850,
    phone: '+91 94250 81223',
    hasQuickPackDelivery: true,
    recommendedItems: ['Special Kesar Rabdi (200g)', 'Warm Desi Ghee Jalebi', 'Rabdi-Jalebi Combo Pack', 'Mawa Peda Gift Box']
  },
  {
    id: 'et-food-2',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'famous_food',
    name: 'Sharma Ji Authentic Kadhi Pakora & Dal Bafla',
    specialtyOrMeds: 'Authentic Malwa Kadhi Pakora with Ghee-dipped Bafla & Jeera Rice',
    locationDescription: 'Platform 1, Refreshment Stall #12 near Water Fountain',
    isInsideStation: true,
    distanceMeters: 55,
    oneWayWalkTimeMin: 0.9,
    avgPrepOrQueueTimeMin: 2.5,
    pricing: '₹80 - ₹140 / meal',
    operatingHours: '06:00 - 23:30',
    rating: 4.7,
    reviewsCount: 920,
    hasQuickPackDelivery: true,
    recommendedItems: ['Kadhi Pakora Rice Plate', 'Dal Bafla Thali (Quick Foil Box)', 'Masala Samosa with Mint Kadhi', 'Methi Puri Set']
  },
  {
    id: 'et-bev-1',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'beverage',
    name: 'Desi Kulhad Masala Chai & Badam Milk',
    specialtyOrMeds: 'Simmering Ginger-Cardamom Kulhad Tea & Hot Pistachio Kesar Milk',
    locationDescription: 'Platform 2 Center, Mobile Trolley #3 (Near Coach B4-B5)',
    isInsideStation: true,
    distanceMeters: 15,
    oneWayWalkTimeMin: 0.2,
    avgPrepOrQueueTimeMin: 0.8,
    pricing: '₹15 - ₹40',
    operatingHours: '24/7 All Train Arrivals',
    rating: 4.8,
    reviewsCount: 1420,
    hasQuickPackDelivery: true,
    recommendedItems: ['Hot Ginger Kulhad Chai', 'Piping Hot Badam Kesar Milk', 'Chilled Rose Lassi', 'Packaged Rail Neer (₹15)']
  },
  {
    id: 'et-food-3',
    stationCode: 'ET',
    stationName: 'Itarsi Junction',
    type: 'famous_food',
    name: 'Bikaner Heritage Sweets & Hing Kachori',
    specialtyOrMeds: 'Crispy Urad Dal Hing Kachori with Tangy Imli Chutney & Soan Papdi',
    locationDescription: 'Outside Station Gate 1, Porch Bazar (140m)',
    isInsideStation: false,
    distanceMeters: 140,
    oneWayWalkTimeMin: 2.2,
    avgPrepOrQueueTimeMin: 2.0,
    pricing: '₹30 - ₹90',
    operatingHours: '06:00 - 23:00',
    rating: 4.6,
    reviewsCount: 680,
    phone: '+91 7572 238120',
    hasQuickPackDelivery: true,
    recommendedItems: ['Hing Kachori (2 pcs)', 'Spicy Aloo Poha', 'Dry Petha Packets', 'Gond Ladoo (Travel pack)']
  },

  // =================== BHOPAL JUNCTION (BPL) ===================
  {
    id: 'bpl-med-1',
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    type: 'medical',
    name: 'Apollo 24/7 Station Pharmacy & Emergency Meds',
    specialtyOrMeds: 'Full Travel First Aid, Pediatric Medicines, Cardiac Emergency Aspirin, Diabetic Needs',
    locationDescription: 'Platform 1 Main Concourse, adjacent to Waiting Hall',
    isInsideStation: true,
    distanceMeters: 65,
    oneWayWalkTimeMin: 1.0,
    avgPrepOrQueueTimeMin: 1.8,
    pricing: 'MRP Verified (All UPI Accepted)',
    operatingHours: '24 Hours Open',
    rating: 4.9,
    reviewsCount: 540,
    phone: '+91 755 2741990',
    hasQuickPackDelivery: true,
    recommendedItems: ['ORS Electrolytes', 'Vomiting & Nausea Tablets', 'Diabetes Sugar Strips & Metformin', 'Sanitary Pads & Pain Balm']
  },
  {
    id: 'bpl-med-2',
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    type: 'medical',
    name: 'Hamidia City Chemist & Day-Night Pharmacy',
    specialtyOrMeds: 'Prescription Drugs, Oxygen Cans, Antiseptics, Wheelchair & Crutch Hire',
    locationDescription: 'Outside Platform 6 Exit, Hamidia Road (220m)',
    isInsideStation: false,
    distanceMeters: 220,
    oneWayWalkTimeMin: 3.2,
    avgPrepOrQueueTimeMin: 2.5,
    pricing: 'Standard Chemist Rates',
    operatingHours: '24/7 Open',
    rating: 4.6,
    reviewsCount: 310,
    phone: '+91 755 2530114',
    hasQuickPackDelivery: true,
    recommendedItems: ['Portable Oxygen Inhaler Can', 'Bandage Rolls & Betadine', 'Anti-Diarrheal Meds', 'Water Purification Tablets']
  },
  {
    id: 'bpl-food-1',
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    type: 'famous_food',
    name: 'Sharma Ji Bhopal Special Poha-Jalebi & Sulaimani Chai',
    specialtyOrMeds: 'Bhopali Steamed Poha with Crunchy Ratlami Sev, Jeeravan & Warm Golden Jalebi',
    locationDescription: 'Platform 1, Stall #3 near Foot Over Bridge',
    isInsideStation: true,
    distanceMeters: 40,
    oneWayWalkTimeMin: 0.6,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: '₹35 - ₹80',
    operatingHours: '05:00 - 22:30',
    rating: 4.9,
    reviewsCount: 2200,
    phone: '+91 98260 44120',
    hasQuickPackDelivery: true,
    recommendedItems: ['Poha Plate with Ratlami Sev', 'Hot Saffron Jalebi (100g)', 'Sulaimani Namkeen Lemon Chai', 'Bhopal Bhutte Ka Kees']
  },
  {
    id: 'bpl-bev-1',
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    type: 'beverage',
    name: 'Sulaimani Tea House & Kesar Lassi',
    specialtyOrMeds: 'Traditional Royal Nawabi Sulaimani Golden Tea with Mint & Lemongrass',
    locationDescription: 'Platform 1 Concourse Food Plaza',
    isInsideStation: true,
    distanceMeters: 50,
    oneWayWalkTimeMin: 0.8,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: '₹20 - ₹60',
    operatingHours: '24/7 Continuous Brewing',
    rating: 4.8,
    reviewsCount: 1100,
    hasQuickPackDelivery: true,
    recommendedItems: ['Authentic Sulaimani Golden Tea', 'Chilled Thick Malai Lassi', 'Cold Badam Milk', 'Fresh Mosambi Juice']
  },
  {
    id: 'bpl-food-2',
    stationCode: 'BPL',
    stationName: 'Bhopal Junction',
    type: 'famous_food',
    name: 'Hakeem Shahi Bhopali Dum Biryani (Quick Travel Box)',
    specialtyOrMeds: 'Famous Aromatic Bhopali Basmati Rice Dum Biryani Packed for Train Travel',
    locationDescription: 'Outside Platform 1 Entrance, Station Road (190m)',
    isInsideStation: false,
    distanceMeters: 190,
    oneWayWalkTimeMin: 3.0,
    avgPrepOrQueueTimeMin: 4.0,
    pricing: '₹140 - ₹240 / box',
    operatingHours: '11:00 - 23:30',
    rating: 4.8,
    reviewsCount: 1750,
    phone: '+91 755 2541999',
    hasQuickPackDelivery: true,
    recommendedItems: ['Shahi Chicken Dum Biryani (Sealed Box)', 'Paneer Tikka Biryani', 'Mughlai Kebab Roll', 'Phirni Cup']
  },

  // =================== KHANDWA JUNCTION (KNW) ===================
  {
    id: 'knw-med-1',
    stationCode: 'KNW',
    stationName: 'Khandwa Junction',
    type: 'medical',
    name: 'Khandwa Station First Aid & Generic Chemist',
    specialtyOrMeds: 'Emergency Pain Relief, Travel Sickness, Bandages, Rehydration Salts',
    locationDescription: 'Platform 1, beside Deputy SS Office',
    isInsideStation: true,
    distanceMeters: 50,
    oneWayWalkTimeMin: 0.8,
    avgPrepOrQueueTimeMin: 1.2,
    pricing: 'Govt Controlled Rates',
    operatingHours: '24 Hours Open',
    rating: 4.7,
    reviewsCount: 190,
    hasQuickPackDelivery: true,
    recommendedItems: ['ORS Electrolytes', 'Paracetamol Tablets', 'Burnol & Dettol', 'Digestive Tablets']
  },
  {
    id: 'knw-food-1',
    stationCode: 'KNW',
    stationName: 'Khandwa Junction',
    type: 'famous_food',
    name: 'Kishore Kumar Heritage Mawa Bati & Malpua',
    specialtyOrMeds: 'Khandwa Heritage Giant Mawa Bati Stuffed with Dry Fruits & Warm Malpua',
    locationDescription: 'Platform 1 Stall #4 near Engine end',
    isInsideStation: true,
    distanceMeters: 40,
    oneWayWalkTimeMin: 0.6,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: '₹40 - ₹100',
    operatingHours: '06:00 - 23:00',
    rating: 4.9,
    reviewsCount: 1320,
    phone: '+91 94253 11890',
    hasQuickPackDelivery: true,
    recommendedItems: ['Famous Khandwa Mawa Bati (2 pcs)', 'Ghee Fried Malpua', 'Dry Mawa Peda Box', 'Khandwa Samosa']
  },
  {
    id: 'knw-bev-1',
    stationCode: 'KNW',
    stationName: 'Khandwa Junction',
    type: 'beverage',
    name: 'Fresh Ginger Sugarcane & Nimbu Soda',
    specialtyOrMeds: 'Crushed Organic Sugarcane Juice with Ginger, Lemon & Rock Salt',
    locationDescription: 'Platform 2 Center',
    isInsideStation: true,
    distanceMeters: 30,
    oneWayWalkTimeMin: 0.5,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: '₹20 - ₹35',
    operatingHours: '07:00 - 22:00',
    rating: 4.7,
    reviewsCount: 460,
    hasQuickPackDelivery: true,
    recommendedItems: ['Fresh Sugarcane Juice (No Ice/Safe)', 'Tangy Lemon Mint Soda', 'Matka Cold Drinking Water', 'Masala Buttermilk']
  },

  // =================== BHUSAVAL JUNCTION (BSL) ===================
  {
    id: 'bsl-med-1',
    stationCode: 'BSL',
    stationName: 'Bhusaval Junction',
    type: 'medical',
    name: 'Jan Aushadhi Medical Store & Emergency Chemist',
    specialtyOrMeds: 'Emergency Generic Meds, Antacids, Painkillers, First Aid & Sanitizers',
    locationDescription: 'Platform 1 Concourse near Clock Tower',
    isInsideStation: true,
    distanceMeters: 55,
    oneWayWalkTimeMin: 0.9,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: 'Govt Fixed Rates / ₹15 - ₹80',
    operatingHours: '24/7 Day & Night',
    rating: 4.8,
    reviewsCount: 390,
    hasQuickPackDelivery: true,
    recommendedItems: ['Travel Sickness Avomine', 'ORS Electrolyte Packs', 'Pain Spray Moov', 'Paracetamol 650', 'Disinfectant Wipes']
  },
  {
    id: 'bsl-food-1',
    stationCode: 'BSL',
    stationName: 'Bhusaval Junction',
    type: 'famous_food',
    name: 'Bhusaval Famous Fresh Banana Chips & Wafers Emporium',
    specialtyOrMeds: 'GI-Famous Fresh Crispy Yellow Banana Chips Fried in Pure Refined Groundnut Oil',
    locationDescription: 'Platform 1 Stall #5 & Platform 3 Center',
    isInsideStation: true,
    distanceMeters: 35,
    oneWayWalkTimeMin: 0.5,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: '₹50 - ₹150 / 500g',
    operatingHours: '24 Hours Open',
    rating: 4.9,
    reviewsCount: 3100,
    phone: '+91 94222 78190',
    hasQuickPackDelivery: true,
    recommendedItems: ['Classic Salted Banana Wafers (500g)', 'Peri-Peri / Black Pepper Banana Chips', 'Sweet Banana Halwa', 'Travel Gift Pack (1kg)']
  },
  {
    id: 'bsl-bev-1',
    stationCode: 'BSL',
    stationName: 'Bhusaval Junction',
    type: 'beverage',
    name: 'Bhusaval Kela Lassi & Fresh Fruit Shakes',
    specialtyOrMeds: 'Famous Thick Bhusaval Banana Malai Lassi with Cardamom & Saffron',
    locationDescription: 'Platform 2 Refreshment Island',
    isInsideStation: true,
    distanceMeters: 30,
    oneWayWalkTimeMin: 0.5,
    avgPrepOrQueueTimeMin: 1.2,
    pricing: '₹30 - ₹70',
    operatingHours: '05:30 - 00:30',
    rating: 4.8,
    reviewsCount: 1650,
    hasQuickPackDelivery: true,
    recommendedItems: ['Thick Banana Cardamom Lassi', 'Cold Chikoo Shake', 'Fresh Orange Juice (Nagpur harvest)', 'Packaged Chilled Buttermilk']
  },
  {
    id: 'bsl-food-2',
    stationCode: 'BSL',
    stationName: 'Bhusaval Junction',
    type: 'famous_food',
    name: 'Khandeshi Shev Bhaji & Hot Chapati Canteen',
    specialtyOrMeds: 'Signature Spicy Khandeshi Tarri Shev Bhaji with Hot Soft Tawa Rotis',
    locationDescription: 'Platform 2, Central Refreshment Hall',
    isInsideStation: true,
    distanceMeters: 45,
    oneWayWalkTimeMin: 0.7,
    avgPrepOrQueueTimeMin: 2.5,
    pricing: '₹70 - ₹120 / plate',
    operatingHours: '06:00 - 23:00',
    rating: 4.7,
    reviewsCount: 880,
    hasQuickPackDelivery: true,
    recommendedItems: ['Khandeshi Shev Bhaji Thali', 'Bhurji Pav (Quick Serve)', 'Batata Vada Plate', 'Poha Chivda Snack Pack']
  },

  // =================== NASHIK ROAD (NK) ===================
  {
    id: 'nk-med-1',
    stationCode: 'NK',
    stationName: 'Nashik Road',
    type: 'medical',
    name: 'Sanjeevani Station Chemist & Emergency Pharmacy',
    specialtyOrMeds: 'Motion Sickness, Antacids, Painkillers, First Aid & Pediatric Rehydration',
    locationDescription: 'Platform 1, near Main Gate & Ticket Counter',
    isInsideStation: true,
    distanceMeters: 50,
    oneWayWalkTimeMin: 0.8,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: 'MRP / Govt Standard',
    operatingHours: '24/7 Open',
    rating: 4.8,
    reviewsCount: 290,
    phone: '+91 253 2465112',
    hasQuickPackDelivery: true,
    recommendedItems: ['Avomine Motion Sickness', 'Eno & Digene Sachets', 'Pain Relief Gel Moov', 'Baby Diapers & Wipes']
  },
  {
    id: 'nk-food-1',
    stationCode: 'NK',
    stationName: 'Nashik Road',
    type: 'famous_food',
    name: 'Nashik Tarri Misal Pav & Batata Vada',
    specialtyOrMeds: 'Authentic Spicy Nashik Sprouted Moth Misal with Crunchy Farsan, Lemons & Warm Pav',
    locationDescription: 'Platform 1, Stall #4 (Opposite Coach B3-B5)',
    isInsideStation: true,
    distanceMeters: 35,
    oneWayWalkTimeMin: 0.5,
    avgPrepOrQueueTimeMin: 1.8,
    pricing: '₹40 - ₹80',
    operatingHours: '05:00 - 23:00',
    rating: 4.9,
    reviewsCount: 2450,
    hasQuickPackDelivery: true,
    recommendedItems: ['Famous Nashik Tarri Misal Pav', 'Golden Batata Vada (2 pcs)', 'Spicy Kanda Bhaji', 'Poha Plate']
  },
  {
    id: 'nk-bev-1',
    stationCode: 'NK',
    stationName: 'Nashik Road',
    type: 'beverage',
    name: 'Sahyadri Fresh Export Grapes & Cold Grape Juice',
    specialtyOrMeds: 'Washed Fresh Seedless Nashik Table Grapes & 100% Pure Pressed Black Grape Juice',
    locationDescription: 'Platform 2, Kiosk #8',
    isInsideStation: true,
    distanceMeters: 30,
    oneWayWalkTimeMin: 0.5,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: '₹50 - ₹120 / punnet',
    operatingHours: '06:00 - 22:30',
    rating: 4.9,
    reviewsCount: 1540,
    hasQuickPackDelivery: true,
    recommendedItems: ['Fresh Seedless Green Grapes (500g)', 'Cold Pressed Black Grape Juice', 'Golden Kishmish (Travel pouch)', 'Fresh Pomegranate Arils']
  },

  // =================== MUMBAI CSMT / MMCT ===================
  {
    id: 'cst-med-1',
    stationCode: 'CSMT',
    stationName: 'Mumbai CSMT',
    type: 'medical',
    name: 'Noble Chemists 24/7 Concourse Pharmacy',
    specialtyOrMeds: 'Full Multi-Specialty Pharmacy, Cardiac First Aid, Insulin, Baby Care & Travel Meds',
    locationDescription: 'Main Concourse near Suburban Line Gate & Heritage Hall',
    isInsideStation: true,
    distanceMeters: 70,
    oneWayWalkTimeMin: 1.0,
    avgPrepOrQueueTimeMin: 2.0,
    pricing: 'MRP Verified / Digital Invoicing',
    operatingHours: '24 Hours Open',
    rating: 4.9,
    reviewsCount: 780,
    phone: '+91 22 22621188',
    hasQuickPackDelivery: true,
    recommendedItems: ['Travel Medical First Aid Kit', 'Insulin Cooling Pouch', 'Vomiting & Acidity Relief', 'Antiseptic Sprays', 'Energy Glucose Drinks']
  },
  {
    id: 'cst-food-1',
    stationCode: 'CSMT',
    stationName: 'Mumbai CSMT',
    type: 'famous_food',
    name: 'Iconic Mumbai Vada Pav & Bun Maska Stall',
    specialtyOrMeds: 'Hot Mumbai Batata Vada with Garlic Thecha & Irani Bun Maska',
    locationDescription: 'Platform 1 Concourse Food Court',
    isInsideStation: true,
    distanceMeters: 45,
    oneWayWalkTimeMin: 0.7,
    avgPrepOrQueueTimeMin: 1.5,
    pricing: '₹25 - ₹70',
    operatingHours: '05:00 - 01:00',
    rating: 4.9,
    reviewsCount: 4200,
    hasQuickPackDelivery: true,
    recommendedItems: ['Jumbo Mumbai Vada Pav (2 pcs)', 'Irani Bun Maska with Jam', 'Cheese Pav Bhaji Plate', 'Kanda Poha']
  },
  {
    id: 'cst-bev-1',
    stationCode: 'CSMT',
    stationName: 'Mumbai CSMT',
    type: 'beverage',
    name: 'Madras Filter Coffee & Cutting Masala Chai',
    specialtyOrMeds: 'Frothy South Indian Brass Cup Filter Coffee & Mumbai Cutting Chai',
    locationDescription: 'Platform 1 Food Plaza Exit',
    isInsideStation: true,
    distanceMeters: 50,
    oneWayWalkTimeMin: 0.8,
    avgPrepOrQueueTimeMin: 1.0,
    pricing: '₹20 - ₹50',
    operatingHours: '24/7 Open',
    rating: 4.8,
    reviewsCount: 1980,
    hasQuickPackDelivery: true,
    recommendedItems: ['South Indian Filter Coffee', 'Cutting Masala Chai', 'Cold Badam Milk', 'Bottled Fresh Lime Water']
  }
];

/**
 * Calculates fetch probability score (0% to 100%) and safety verdict
 * based on train halt duration, round-trip walking time, queue time, and safety buffer.
 */
export function calculateFetchProbability(
  item: StationPerimeterItem,
  haltDurationMin: number
): FetchProbabilityAnalysis {
  const roundTripWalkMin = Number((item.oneWayWalkTimeMin * 2).toFixed(1));
  // If shop is outside station gate, add Foot Over Bridge and exit/entry barrier penalty
  const fobPenaltyMin = item.isInsideStation ? 0 : 2.0;
  const prepQueueMin = item.avgPrepOrQueueTimeMin;
  const safetyBufferMin = 2.5; // Essential 2.5m buffer so passenger is in coach before departure horn

  const totalTimeRequiredMin = Number(
    (roundTripWalkMin + fobPenaltyMin + prepQueueMin + safetyBufferMin).toFixed(1)
  );

  const timeMarginMin = Number((haltDurationMin - totalTimeRequiredMin).toFixed(1));

  let probabilityScorePct = 0;
  let verdict: FetchProbabilityAnalysis['verdict'] = 'HIGH_RISK';
  let recommendationText = '';

  // Edge Case: 2 min passenger halt and shop is outside
  if (haltDurationMin <= 2 && !item.isInsideStation) {
    probabilityScorePct = 2;
    verdict = 'IMPOSSIBLE';
    recommendationText = `⛔ Extremely Dangerous! Halt is only ${haltDurationMin} min and stall is outside station gates. You will miss the train!`;
  } else if (timeMarginMin >= 5) {
    probabilityScorePct = Math.min(99, Math.round(85 + timeMarginMin * 2.2));
    verdict = 'SAFE_RUN';
    recommendationText = `🟢 Safe Run (+${timeMarginMin}m buffer)! Ample time to walk, buy, and be seated 2.5 min before departure.`;
  } else if (timeMarginMin >= 2) {
    probabilityScorePct = Math.min(94, Math.round(75 + timeMarginMin * 3.5));
    verdict = 'SAFE_RUN';
    recommendationText = `🟢 Recommended (+${timeMarginMin}m margin). You have enough time if you proceed directly to the stall.`;
  } else if (timeMarginMin >= 0) {
    probabilityScorePct = Math.min(75, Math.round(55 + timeMarginMin * 10));
    verdict = 'QUICK_RUN_ONLY';
    recommendationText = `🟡 Tight Quick Run (+${timeMarginMin}m margin). Feasible only if no long queue. Inform co-passenger or keep coach door in sight.`;
  } else if (timeMarginMin >= -3) {
    probabilityScorePct = Math.max(15, Math.round(45 + timeMarginMin * 10));
    verdict = 'HIGH_RISK';
    recommendationText = `🔴 High Risk (${Math.abs(timeMarginMin)}m short)! The train is likely to blow the departure whistle while you are waiting. Not advised.`;
  } else {
    probabilityScorePct = Math.max(2, Math.round(12 + timeMarginMin * 2));
    verdict = 'IMPOSSIBLE';
    recommendationText = `⛔ Impossible (${Math.abs(timeMarginMin)}m deficit). Time required (${totalTimeRequiredMin}m) exceeds halt time (${haltDurationMin}m). Stay on board!`;
  }

  return {
    item,
    haltDurationMin,
    roundTripWalkMin,
    fobPenaltyMin,
    prepQueueMin,
    safetyBufferMin,
    totalTimeRequiredMin,
    timeMarginMin,
    probabilityScorePct,
    verdict,
    recommendationText
  };
}
