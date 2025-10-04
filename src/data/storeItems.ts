import { StoreCategory, StoreItem } from '../types/store';

// ==================== WATER MANAGEMENT ====================
const WATER_ITEMS: StoreItem[] = [
	{
		id: 'water_basic',
		name: 'Basic Irrigation',
		description: 'Standard water supply for your crops',
		educationalTip:
			'NASA SMAP satellite monitors global soil moisture every 2-3 days at 9km resolution.',
		nasaDataSource: {
			satellite: 'SMAP (Soil Moisture Active Passive)',
			dataType: 'Soil Moisture',
			resolution: '9km',
			updateFrequency: 'Every 2-3 days'
		},
		type: 'water',
		tier: 'basic',
		price: 20,
		emoji: '💧',
		effect: { water: 50 }
	},
	{
		id: 'water_drip',
		name: 'Drip Irrigation System',
		description: 'Precision water delivery to root zones',
		educationalTip:
			'Drip irrigation can reduce water usage by 30-50%. NASA GRACE satellites track groundwater depletion globally.',
		nasaDataSource: {
			satellite: 'GRACE-FO (Gravity Recovery)',
			dataType: 'Groundwater Availability',
			resolution: '300km',
			updateFrequency: 'Monthly'
		},
		type: 'water',
		tier: 'advanced',
		price: 80,
		emoji: '🌊',
		effect: { water: 100, soilQuality: 5 },
		duration: 7
	},
	{
		id: 'water_smart',
		name: 'NASA SMAP-Guided Smart Irrigation',
		description: 'AI-optimized irrigation using real-time satellite soil moisture data',
		educationalTip:
			'Combines SMAP soil moisture with weather forecasts to deliver water only when needed, saving up to 70% water.',
		nasaDataSource: {
			satellite: 'SMAP + GPM (Global Precipitation)',
			dataType: 'Soil Moisture + Rainfall Prediction',
			resolution: '9km + 10km',
			updateFrequency: 'Every 2-3 days'
		},
		type: 'technology',
		tier: 'nasa_tech',
		price: 250,
		emoji: '🛰️',
		effect: { water: 100, growthSpeed: 15, droughtTolerance: 30 },
		duration: 30,
		unlockLevel: 10
	}
];

// ==================== FERTILIZERS & SOIL ====================
const FERTILIZER_ITEMS: StoreItem[] = [
	{
		id: 'fertilizer_organic',
		name: 'Organic Compost',
		description: 'Natural nutrient-rich compost',
		educationalTip:
			'Organic matter improves soil carbon content. NASA ECOSTRESS measures plant stress from nutrient deficiency.',
		nasaDataSource: {
			satellite: 'ECOSTRESS (Ecosystem Spaceborne)',
			dataType: 'Plant Water Stress & Temperature',
			resolution: '70m',
			updateFrequency: 'Daily'
		},
		type: 'fertilizer',
		tier: 'basic',
		price: 30,
		emoji: '🌱',
		effect: { fertilizer: 50, health: 5, soilQuality: 10 }
	},
	{
		id: 'fertilizer_npk',
		name: 'NPK Precision Fertilizer',
		description: 'Balanced nitrogen-phosphorus-potassium formula',
		educationalTip:
			'NASA Landsat 8 NDVI data helps determine optimal fertilizer application rates by measuring crop greenness.',
		nasaDataSource: {
			satellite: 'Landsat 8 OLI',
			dataType: 'NDVI (Vegetation Health)',
			resolution: '30m',
			updateFrequency: 'Every 16 days'
		},
		type: 'fertilizer',
		tier: 'advanced',
		price: 60,
		emoji: '⚗️',
		effect: { fertilizer: 100, growthSpeed: 10 }
	},
	{
		id: 'soil_biochar',
		name: 'Biochar Amendment',
		description: 'Carbon-negative soil enhancer that retains nutrients',
		educationalTip:
			'Biochar increases soil carbon storage. NASA OCO-2 satellite monitors atmospheric CO2 levels.',
		nasaDataSource: {
			satellite: 'OCO-2 (Orbiting Carbon)',
			dataType: 'Atmospheric CO2',
			resolution: '1-3km²',
			updateFrequency: 'Every 16 days'
		},
		type: 'soil_amendment',
		tier: 'premium',
		price: 120,
		emoji: '🪨',
		effect: { soilQuality: 25, droughtTolerance: 20, fertilizer: 40 },
		duration: 90
	},
	{
		id: 'soil_microbial',
		name: 'Microbial Inoculant',
		description: 'Beneficial bacteria and fungi boost',
		educationalTip:
			'Mycorrhizal fungi increase nutrient uptake by 500%. NASA studies soil microbiomes using metagenomics.',
		type: 'soil_amendment',
		tier: 'advanced',
		price: 90,
		emoji: '🦠',
		effect: { fertilizer: 60, health: 15, diseaseResistance: 25, soilQuality: 15 }
	}
];

// ==================== PEST & DISEASE MANAGEMENT ====================
const PEST_ITEMS: StoreItem[] = [
	{
		id: 'pesticide_organic',
		name: 'Neem Oil Spray',
		description: 'Natural pest deterrent from neem trees',
		educationalTip:
			'NASA MODIS thermal data can predict pest outbreak zones by tracking temperature anomalies.',
		nasaDataSource: {
			satellite: 'MODIS (Terra/Aqua)',
			dataType: 'Land Surface Temperature',
			resolution: '1km',
			updateFrequency: 'Daily'
		},
		type: 'pesticide',
		tier: 'basic',
		price: 35,
		emoji: '🍃',
		effect: { cureDisease: true, health: 10, pestResistance: 15 }
	},
	{
		id: 'pesticide_integrated',
		name: 'IPM System (Integrated Pest Management)',
		description: 'Combines biological controls with targeted treatments',
		educationalTip:
			'IPM reduces pesticide use by 70%. NASA Landsat helps monitor crop health to detect early pest damage.',
		nasaDataSource: {
			satellite: 'Landsat 8 + Sentinel-2',
			dataType: 'Multispectral Crop Health',
			resolution: '10-30m',
			updateFrequency: 'Every 5 days combined'
		},
		type: 'pesticide',
		tier: 'advanced',
		price: 100,
		emoji: '🐞',
		effect: { cureDisease: true, health: 20, pestResistance: 40, diseaseResistance: 30 },
		duration: 14
	},
	{
		id: 'disease_forecast',
		name: 'Disease Prediction AI',
		description: 'NASA weather data predicts disease outbreaks 7 days ahead',
		educationalTip:
			'Combines MODIS temperature + GPM rainfall to predict fungal disease risk with 85% accuracy.',
		nasaDataSource: {
			satellite: 'GPM + MODIS + MERRA-2',
			dataType: 'Precipitation + Temp + Humidity',
			resolution: '10km',
			updateFrequency: 'Hourly forecasts'
		},
		type: 'technology',
		tier: 'nasa_tech',
		price: 200,
		emoji: '🔮',
		effect: { diseaseResistance: 50, pestResistance: 30, health: 10 },
		duration: 30,
		unlockLevel: 15
	}
];

// ==================== CLIMATE & WEATHER TECH ====================
const CLIMATE_ITEMS: StoreItem[] = [
	{
		id: 'frost_blanket',
		name: 'Frost Protection Blanket',
		description: 'Thermal covering to protect from freezing',
		educationalTip:
			'NASA GOES-R satellites provide hourly temperature forecasts to predict frost events.',
		nasaDataSource: {
			satellite: 'GOES-R (Geostationary Weather)',
			dataType: 'Real-time Temperature',
			resolution: '2km',
			updateFrequency: 'Every 5-15 minutes'
		},
		type: 'climate_tool',
		tier: 'advanced',
		price: 75,
		emoji: '🧊',
		effect: { frostProtection: true, health: 5 },
		duration: 1
	},
	{
		id: 'shade_net',
		name: 'UV-Reflective Shade Net',
		description: 'Reduces heat stress and UV damage',
		educationalTip: 'NASA OMI instrument tracks UV index globally. High UV can reduce yields by 20%.',
		nasaDataSource: {
			satellite: 'Aura OMI (Ozone Monitoring)',
			dataType: 'UV Index & Ozone',
			resolution: '13x24km',
			updateFrequency: 'Daily'
		},
		type: 'climate_tool',
		tier: 'advanced',
		price: 85,
		emoji: '☀️',
		effect: { health: 15, droughtTolerance: 25, growthSpeed: -5 },
		duration: 60
	},
	{
		id: 'weather_station',
		name: 'Micro-Climate Weather Station',
		description: 'Real-time local weather monitoring',
		educationalTip:
			'Combines on-ground sensors with NASA MERRA-2 global atmospheric reanalysis data.',
		nasaDataSource: {
			satellite: 'MERRA-2 (Atmospheric Model)',
			dataType: 'Temperature, Wind, Humidity, Pressure',
			resolution: '50km',
			updateFrequency: 'Hourly'
		},
		type: 'technology',
		tier: 'premium',
		price: 180,
		emoji: '🌡️',
		effect: { growthSpeed: 20, droughtTolerance: 15, diseaseResistance: 20 },
		duration: 90,
		areaEffect: true
	},
	{
		id: 'climate_forecast',
		name: 'Seasonal Climate Forecast',
		description: 'NASA ENSO predictions for 3-month planning',
		educationalTip:
			'El Niño/La Niña predictions help plan crop selection. NASA monitors sea surface temperatures globally.',
		nasaDataSource: {
			satellite: 'Multi-mission (JASON, MODIS, etc)',
			dataType: 'Sea Surface Temp + ENSO Index',
			resolution: '9km',
			updateFrequency: 'Weekly'
		},
		type: 'satellite_data',
		tier: 'nasa_tech',
		price: 300,
		emoji: '�',
		effect: { yieldBoost: 25, droughtTolerance: 30 },
		duration: 90,
		unlockLevel: 20,
		areaEffect: true
	}
];

// ==================== ADVANCED NASA TECHNOLOGIES ====================
const NASA_TECH_ITEMS: StoreItem[] = [
	{
		id: 'ndvi_scanner',
		name: 'Handheld NDVI Scanner',
		description: 'Measures crop health using vegetation indices',
		educationalTip:
			'NDVI (Normalized Difference Vegetation Index) correlates 0.9 with crop yield. Used by Landsat/Sentinel.',
		nasaDataSource: {
			satellite: 'Landsat 8/9 + Sentinel-2',
			dataType: 'NDVI & EVI Indices',
			resolution: '10-30m',
			updateFrequency: 'Every 2-3 days'
		},
		type: 'technology',
		tier: 'premium',
		price: 220,
		emoji: '📡',
		effect: { growthSpeed: 15, yieldBoost: 15, health: 10 },
		duration: 30
	},
	{
		id: 'precision_ag',
		name: 'Precision Agriculture Suite',
		description: 'Variable rate application using satellite maps',
		educationalTip:
			'Uses MODIS, Landsat, and Sentinel data for zone-specific management. Increases efficiency by 30%.',
		nasaDataSource: {
			satellite: 'Multi-sensor Fusion',
			dataType: 'NDVI, Soil, Weather, Elevation',
			resolution: '10m average',
			updateFrequency: 'Daily composite'
		},
		type: 'technology',
		tier: 'nasa_tech',
		price: 400,
		emoji: '🎯',
		effect: {
			growthSpeed: 25,
			yieldBoost: 30,
			fertilizer: 50,
			water: 50,
			soilQuality: 20
		},
		duration: 60,
		unlockLevel: 25,
		areaEffect: true
	},
	{
		id: 'carbon_credit',
		name: 'Carbon Sequestration Program',
		description: 'Earn credits for soil carbon storage verified by NASA',
		educationalTip: 'NASA OCO-2 validates carbon sequestration. Farmers can earn $20-50 per ton CO2.',
		nasaDataSource: {
			satellite: 'OCO-2/OCO-3 (Carbon)',
			dataType: 'Column CO2 Concentration',
			resolution: '1.3x2.3km',
			updateFrequency: 'Every 16 days'
		},
		type: 'satellite_data',
		tier: 'nasa_tech',
		price: 350,
		emoji: '💚',
		effect: {
			soilQuality: 40,
			yieldBoost: 10
			// Special: generates passive income
		},
		duration: 120,
		unlockLevel: 30
	},
	{
		id: 'harvest_optimizer',
		name: 'AI Harvest Optimizer',
		description: 'ML model predicts optimal harvest timing',
		educationalTip:
			'Analyzes 15+ NASA datasets including NDVI, weather, historical yields to maximize harvest value +40%.',
		nasaDataSource: {
			satellite: 'Ensemble: Landsat, MODIS, SMAP, GPM',
			dataType: 'Multi-parameter AI Model',
			resolution: '10-1000m',
			updateFrequency: 'Real-time processing'
		},
		type: 'technology',
		tier: 'nasa_tech',
		price: 500,
		emoji: '🤖',
		effect: {
			yieldBoost: 40,
			growthSpeed: 20,
			health: 20
		},
		duration: 90,
		unlockLevel: 35,
		areaEffect: true
	}
];

// ==================== EXPORT ORGANIZED CATALOG ====================
export const STORE_CATEGORIES: StoreCategory[] = [
	{
		id: 'water',
		name: 'Water Management',
		description: 'Irrigation systems and water optimization',
		icon: '💧',
		items: WATER_ITEMS
	},
	{
		id: 'fertilizer',
		name: 'Fertilizers & Soil',
		description: 'Nutrients, amendments, and soil health',
		icon: '🌱',
		items: FERTILIZER_ITEMS
	},
	{
		id: 'pest',
		name: 'Pest & Disease Control',
		description: 'Protection and prevention systems',
		icon: '🐞',
		items: PEST_ITEMS
	},
	{
		id: 'climate',
		name: 'Climate & Weather',
		description: 'Weather protection and monitoring',
		icon: '🌡️',
		items: CLIMATE_ITEMS
	},
	{
		id: 'nasa_tech',
		name: 'NASA Technologies',
		description: 'Advanced satellite-based farming tools',
		icon: '🛰️',
		items: NASA_TECH_ITEMS
	}
];

// Legacy flat export for backward compatibility
export const STORE_ITEMS: Record<string, StoreItem> = {};
STORE_CATEGORIES.forEach((category) => {
	category.items.forEach((item) => {
		STORE_ITEMS[item.id.toUpperCase()] = item;
	});
});
