export type StoreItemType =
	| 'seed'
	| 'fertilizer'
	| 'water'
	| 'pesticide'
	| 'satellite_data'
	| 'soil_amendment'
	| 'technology'
	| 'climate_tool';

export type ItemTier = 'basic' | 'advanced' | 'premium' | 'nasa_tech';

export interface NASADataSource {
	satellite: string; // e.g., "SMAP", "MODIS", "Landsat 8"
	dataType: string; // e.g., "Soil Moisture", "NDVI", "Surface Temperature"
	resolution: string; // e.g., "9km", "250m"
	updateFrequency: string; // e.g., "Daily", "Every 3 days"
}

export interface StoreItem {
	id: string;
	name: string;
	description: string;
	educationalTip?: string;
	nasaDataSource?: NASADataSource;
	type: StoreItemType;
	tier: ItemTier;
	price: number;
	emoji: string;
	unlockLevel?: number; // Player needs to reach this level/day
	effect?: {
		water?: number;
		fertilizer?: number;
		health?: number;
		cureDisease?: boolean;
		soilQuality?: number;
		diseaseResistance?: number;
		growthSpeed?: number; // Percentage boost
		yieldBoost?: number; // Percentage boost to harvest value
		droughtTolerance?: number;
		frostProtection?: boolean;
		pestResistance?: number;
	};
	duration?: number; // How many days the effect lasts
	areaEffect?: boolean; // Does it affect neighboring hexes?
}

export interface StoreCategory {
	id: string;
	name: string;
	description: string;
	icon: string;
	items: StoreItem[];
}
