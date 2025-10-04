export interface WeatherData {
	temperature: number; // in Celsius
	humidity: number; // percentage
	soilMoisture: number; // percentage
	rainfall: number; // mm
	windSpeed: number; // km/h
	uvIndex: number; // 0-11+
}

export interface UserBalance {
	coins: number;
	landOwned: number; // number of hexagons owned
}

export interface TimeData {
	day: number;
	month: string;
	year: number;
	hour: number;
	season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}

export interface HexagonInfoData {
	id: string;
	name: string;
	owner?: string;
	cropType?: string;
	growthStage?: number; // 0-100
	harvestReady?: boolean;
}
