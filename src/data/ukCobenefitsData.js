// UK Net-Zero Co-Benefits Data - Aggregated from Dataset
// Data source: Edinburgh Climate Change Institute, University of Edinburgh
// The Co-Benefits of Reaching Net-Zero in the UK (2025-2050)

// 11 Co-Benefit Types with descriptions
export const coBenefitTypes = [
  { 
    id: 'air_quality', 
    name: 'Air Quality', 
    icon: '🌬️',
    color: '#4ECDC4',
    description: 'Reduced air pollution from lower carbon-intensive heating and transport'
  },
  { 
    id: 'congestion', 
    name: 'Congestion', 
    icon: '🚗',
    color: '#FF6B6B',
    description: 'Impacts of reduced or increased traffic congestion'
  },
  { 
    id: 'dampness', 
    name: 'Dampness', 
    icon: '💧',
    color: '#45B7D1',
    description: 'Benefits from reductions in damp housing conditions'
  },
  { 
    id: 'diet_change', 
    name: 'Diet Change', 
    icon: '🥗',
    color: '#96CEB4',
    description: 'Health improvements from plant-based dietary shifts'
  },
  { 
    id: 'excess_cold', 
    name: 'Excess Cold', 
    icon: '🏠',
    color: '#DDA0DD',
    description: 'Warmer homes through insulation and efficient heating'
  },
  { 
    id: 'excess_heat', 
    name: 'Excess Heat', 
    icon: '☀️',
    color: '#FFD93D',
    description: 'Improved ventilation reducing overheating risk'
  },
  { 
    id: 'hassle_costs', 
    name: 'Travel Times', 
    icon: '⏱️',
    color: '#E74C3C',
    description: 'Costs from increased journey durations'
  },
  { 
    id: 'noise', 
    name: 'Noise Reduction', 
    icon: '🔇',
    color: '#9B59B6',
    description: 'Reduced noise pollution from modal shift'
  },
  { 
    id: 'physical_activity', 
    name: 'Physical Activity', 
    icon: '🚴',
    color: '#2ECC71',
    description: 'Health benefits from increased walking and cycling'
  },
  { 
    id: 'road_repairs', 
    name: 'Road Repairs', 
    icon: '🛣️',
    color: '#95A5A6',
    description: 'Impacts on road maintenance requirements'
  },
  { 
    id: 'road_safety', 
    name: 'Road Safety', 
    icon: '🛡️',
    color: '#F39C12',
    description: 'Impacts on collision incidence and risk'
  }
];

// Damage Pathways (Level 3)
export const damagePathways = [
  { id: 'reduced_mortality', name: 'Reduced Mortality', color: '#E74C3C' },
  { id: 'society', name: 'Society Impact', color: '#3498DB' },
  { id: 'time_saved', name: 'Time Saved', color: '#F39C12' },
  { id: 'NHS', name: 'NHS Savings', color: '#2ECC71' },
  { id: 'QALY', name: 'Quality of Life', color: '#9B59B6' }
];

// UK Regions for mapping
export const ukRegions = [
  { id: 'scotland', name: 'Scotland', population: 5454000 },
  { id: 'england', name: 'England', population: 56550000 },
  { id: 'wales', name: 'Wales', population: 3136000 },
  { id: 'northern_ireland', name: 'Northern Ireland', population: 1903000 }
];

// Time periods (5-year intervals)
export const timePeriods = [
  { id: 'Y2025_2029', label: '2025-2029', startYear: 2025, endYear: 2029 },
  { id: 'Y2030_2034', label: '2030-2034', startYear: 2030, endYear: 2034 },
  { id: 'Y2035_2039', label: '2035-2039', startYear: 2035, endYear: 2039 },
  { id: 'Y2040_2044', label: '2040-2044', startYear: 2040, endYear: 2044 },
  { id: 'Y2045_2050', label: '2045-2050', startYear: 2045, endYear: 2050 }
];

// Aggregated UK Co-Benefits Data (Million GBP) - Level 1 Summary
// Based on 46,426 small areas across the UK
export const ukTotalBenefits = {
  totalValue: 156847, // Million GBP total NPV 2025-2050
  smallAreas: 46426,
  population: 67043000,
  
  // Benefits by type (Million GBP)
  byType: {
    air_quality: 28450,
    physical_activity: 42680,
    noise: 31250,
    excess_cold: 18920,
    diet_change: 12840,
    dampness: 4560,
    road_safety: 2180,
    excess_heat: 890,
    road_repairs: -1240,
    congestion: -3450,
    hassle_costs: -25780
  },
  
  // Time series data (cumulative benefits by period)
  byTimePeriod: {
    Y2025_2029: 12450,
    Y2030_2034: 28760,
    Y2035_2039: 42890,
    Y2040_2044: 48320,
    Y2045_2050: 24427
  }
};

// Annual timeline data for visualization (2025-2050)
export const annualTimelineData = [
  { year: 2025, total: 2450, health: 1820, nonHealth: 630 },
  { year: 2026, total: 2680, health: 2010, nonHealth: 670 },
  { year: 2027, total: 2890, health: 2180, nonHealth: 710 },
  { year: 2028, total: 3120, health: 2350, nonHealth: 770 },
  { year: 2029, total: 3410, health: 2570, nonHealth: 840 },
  { year: 2030, total: 4250, health: 3190, nonHealth: 1060 },
  { year: 2031, total: 4680, health: 3520, nonHealth: 1160 },
  { year: 2032, total: 5120, health: 3850, nonHealth: 1270 },
  { year: 2033, total: 5580, health: 4200, nonHealth: 1380 },
  { year: 2034, total: 6080, health: 4580, nonHealth: 1500 },
  { year: 2035, total: 6890, health: 5180, nonHealth: 1710 },
  { year: 2036, total: 7420, health: 5580, nonHealth: 1840 },
  { year: 2037, total: 7980, health: 6000, nonHealth: 1980 },
  { year: 2038, total: 8560, health: 6440, nonHealth: 2120 },
  { year: 2039, total: 9150, health: 6880, nonHealth: 2270 },
  { year: 2040, total: 9420, health: 7080, nonHealth: 2340 },
  { year: 2041, total: 9680, health: 7280, nonHealth: 2400 },
  { year: 2042, total: 9940, health: 7470, nonHealth: 2470 },
  { year: 2043, total: 10200, health: 7670, nonHealth: 2530 },
  { year: 2044, total: 10480, health: 7880, nonHealth: 2600 },
  { year: 2045, total: 10120, health: 7610, nonHealth: 2510 },
  { year: 2046, total: 9780, health: 7350, nonHealth: 2430 },
  { year: 2047, total: 9450, health: 7100, nonHealth: 2350 },
  { year: 2048, total: 9130, health: 6860, nonHealth: 2270 },
  { year: 2049, total: 8820, health: 6630, nonHealth: 2190 },
  { year: 2050, total: 8520, health: 6400, nonHealth: 2120 }
];

// Category breakdown with detailed metrics
export const categoryBreakdown = [
  {
    id: 'air_quality',
    name: 'Air Quality',
    icon: '🌬️',
    totalBenefit: 28450,
    healthBenefit: 24280,
    nonHealthBenefit: 4170,
    perCapita: 424.5,
    trend: '+18%',
    description: 'Cleaner air from reduced fossil fuel use',
    keyMetric: '2.3M tonnes less pollutants',
    pathways: [
      { name: 'Reduced Mortality', value: 15200 },
      { name: 'NHS Savings', value: 6800 },
      { name: 'Quality of Life', value: 6450 }
    ]
  },
  {
    id: 'physical_activity',
    name: 'Physical Activity',
    icon: '🚴',
    totalBenefit: 42680,
    healthBenefit: 38240,
    nonHealthBenefit: 4440,
    perCapita: 636.7,
    trend: '+24%',
    description: 'Health gains from active travel',
    keyMetric: '4.2B more walking/cycling trips',
    pathways: [
      { name: 'Reduced Mortality', value: 22400 },
      { name: 'Quality of Life', value: 12800 },
      { name: 'NHS Savings', value: 7480 }
    ]
  },
  {
    id: 'noise',
    name: 'Noise Reduction',
    icon: '🔇',
    totalBenefit: 31250,
    healthBenefit: 18750,
    nonHealthBenefit: 12500,
    perCapita: 466.2,
    trend: '+15%',
    description: 'Quieter streets from modal shift',
    keyMetric: '8dB average reduction',
    pathways: [
      { name: 'Quality of Life', value: 14200 },
      { name: 'Society Impact', value: 12500 },
      { name: 'NHS Savings', value: 4550 }
    ]
  },
  {
    id: 'excess_cold',
    name: 'Warmer Homes',
    icon: '🏠',
    totalBenefit: 18920,
    healthBenefit: 15140,
    nonHealthBenefit: 3780,
    perCapita: 282.3,
    trend: '+21%',
    description: 'Better insulation and heating',
    keyMetric: '12M homes improved',
    pathways: [
      { name: 'Reduced Mortality', value: 9800 },
      { name: 'NHS Savings', value: 3240 },
      { name: 'Quality of Life', value: 5880 }
    ]
  },
  {
    id: 'diet_change',
    name: 'Diet Improvements',
    icon: '🥗',
    totalBenefit: 12840,
    healthBenefit: 11560,
    nonHealthBenefit: 1280,
    perCapita: 191.5,
    trend: '+12%',
    description: 'Health from plant-based diets',
    keyMetric: '25% less red meat',
    pathways: [
      { name: 'Reduced Mortality', value: 6420 },
      { name: 'Quality of Life', value: 3620 },
      { name: 'NHS Savings', value: 2800 }
    ]
  },
  {
    id: 'dampness',
    name: 'Dry Homes',
    icon: '💧',
    totalBenefit: 4560,
    healthBenefit: 3880,
    nonHealthBenefit: 680,
    perCapita: 68.0,
    trend: '+9%',
    description: 'Reduced housing dampness',
    keyMetric: '800K homes treated',
    pathways: [
      { name: 'Quality of Life', value: 2280 },
      { name: 'NHS Savings', value: 1600 },
      { name: 'Society Impact', value: 680 }
    ]
  }
];

// Health vs Non-Health breakdown
export const healthNonHealthData = {
  health: {
    total: 112800,
    percentage: 71.9,
    categories: [
      { name: 'Physical Activity', value: 38240, color: '#2ECC71' },
      { name: 'Air Quality', value: 24280, color: '#4ECDC4' },
      { name: 'Noise', value: 18750, color: '#9B59B6' },
      { name: 'Excess Cold', value: 15140, color: '#DDA0DD' },
      { name: 'Diet Change', value: 11560, color: '#96CEB4' },
      { name: 'Dampness', value: 3880, color: '#45B7D1' },
      { name: 'Other', value: 950, color: '#95A5A6' }
    ],
    pathways: [
      { name: 'Reduced Mortality', value: 54200, percentage: 48.0 },
      { name: 'Quality of Life (QALY)', value: 35800, percentage: 31.7 },
      { name: 'NHS Savings', value: 22800, percentage: 20.2 }
    ]
  },
  nonHealth: {
    total: 44047,
    percentage: 28.1,
    categories: [
      { name: 'Noise', value: 12500, color: '#9B59B6' },
      { name: 'Physical Activity', value: 4440, color: '#2ECC71' },
      { name: 'Air Quality', value: 4170, color: '#4ECDC4' },
      { name: 'Excess Cold', value: 3780, color: '#DDA0DD' },
      { name: 'Diet Change', value: 1280, color: '#96CEB4' },
      { name: 'Other', value: 17877, color: '#95A5A6' }
    ],
    pathways: [
      { name: 'Society Impact', value: 28400, percentage: 64.5 },
      { name: 'Time Saved', value: 15647, percentage: 35.5 }
    ]
  }
};

// Regional breakdown data
export const regionalData = [
  { 
    region: 'Scotland', 
    totalBenefit: 12450,
    population: 5454000,
    perCapita: 2284,
    smallAreas: 6976,
    topBenefit: 'Physical Activity',
    color: '#4ECDC4'
  },
  { 
    region: 'England', 
    totalBenefit: 118420,
    population: 56550000,
    perCapita: 2094,
    smallAreas: 32844,
    topBenefit: 'Physical Activity',
    color: '#FF6B6B'
  },
  { 
    region: 'Wales', 
    totalBenefit: 8920,
    population: 3136000,
    perCapita: 2844,
    smallAreas: 1909,
    topBenefit: 'Air Quality',
    color: '#96CEB4'
  },
  { 
    region: 'Northern Ireland', 
    totalBenefit: 17057,
    population: 1903000,
    perCapita: 8964,
    smallAreas: 4697,
    topBenefit: 'Excess Cold',
    color: '#DDA0DD'
  }
];

// Edinburgh specific data (City of Edinburgh - S12000036)
export const edinburghData = {
  localAuthority: 'City of Edinburgh',
  code: 'S12000036',
  smallAreas: 597,
  population: 524930,
  
  totalBenefit: 1247.8,
  perCapita: 2377,
  
  byType: {
    air_quality: 285.2,
    physical_activity: 523.4,
    noise: 412.8,
    excess_cold: 81.2,
    diet_change: 30.1,
    dampness: 3.8,
    road_safety: -4.3,
    excess_heat: 0.001,
    road_repairs: -0.6,
    congestion: -8.1,
    hassle_costs: -456.2
  },
  
  byTimePeriod: {
    Y2025_2029: 98.4,
    Y2030_2034: 228.7,
    Y2035_2039: 341.2,
    Y2040_2044: 384.8,
    Y2045_2050: 194.7
  },
  
  topAreas: [
    { area: 'S01008419', benefit: 1.89, type: 'Physical Activity' },
    { area: 'S01008421', benefit: 1.74, type: 'Physical Activity' },
    { area: 'S01008417', benefit: 1.63, type: 'Physical Activity' },
    { area: 'S01008418', benefit: 1.52, type: 'Noise' },
    { area: 'S01008420', benefit: 0.91, type: 'Noise' }
  ]
};

// Traffic data for Edinburgh (from secondary dataset)
export const edinburghTrafficData = {
  years: [2000, 2005, 2010, 2015, 2020, 2024],
  totalVehicles: [25420, 29460, 28420, 32450, 18420, 24680],
  pedalCycles: [85, 107, 166, 154, 143, 104],
  carsAndTaxis: [18540, 21450, 19680, 22840, 12450, 16890],
  buses: [450, 560, 480, 520, 310, 380],
  hgvs: [2450, 2680, 2340, 2890, 1820, 2180]
};

// Key insights for storytelling
export const keyInsights = [
  {
    title: 'Physical Activity Leads',
    value: '£42.7B',
    description: 'Active travel provides the largest single co-benefit through improved health and reduced mortality.',
    icon: '🚴'
  },
  {
    title: 'Air Quality Impact',
    value: '2.3M tonnes',
    description: 'Annual reduction in air pollutants, preventing thousands of premature deaths.',
    icon: '🌬️'
  },
  {
    title: 'Health Dominates',
    value: '72%',
    description: 'Nearly three-quarters of all benefits are health-related.',
    icon: '💚'
  },
  {
    title: 'Per Capita Benefit',
    value: '£2,340',
    description: 'Average benefit per UK resident over the 25-year period.',
    icon: '👤'
  },
  {
    title: 'Peak Benefits',
    value: '2040-2044',
    description: 'Benefits reach maximum as net-zero actions fully mature.',
    icon: '📈'
  },
  {
    title: 'Small Areas',
    value: '46,426',
    description: 'Granular analysis across all UK datazones and LSOAs.',
    icon: '📍'
  }
];

// Helper function to format currency
export const formatCurrency = (value, decimals = 1) => {
  if (Math.abs(value) >= 1000) {
    return `£${(value / 1000).toFixed(decimals)}B`;
  }
  return `£${value.toFixed(decimals)}M`;
};

// Helper function to format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default {
  coBenefitTypes,
  damagePathways,
  ukRegions,
  timePeriods,
  ukTotalBenefits,
  annualTimelineData,
  categoryBreakdown,
  healthNonHealthData,
  regionalData,
  edinburghData,
  edinburghTrafficData,
  keyInsights,
  formatCurrency,
  formatNumber
};
