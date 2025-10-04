import { PLANT_TYPES } from '@/data/plants';
import { generateDayAdvancement, type GameStateChanges } from '@/lib/aiService';
import { Field } from '@/types/field';
import { create } from 'zustand';

type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

// ==================== PLAYER INVENTORY & UPGRADES ====================
interface PlayerInventory {
	// Active items with durations (fieldId -> itemId -> expiresOnDay)
	activeFieldItems: Map<string, Map<string, number>>;
	// Global upgrades (not field-specific)
	activeGlobalUpgrades: Map<string, number>; // itemId -> expiresOnDay
	// Purchased items count (for consumables)
	itemsOwned: Map<string, number>; // itemId -> quantity
}

// ==================== NASA DATA TRACKING ====================
interface NASADataAccess {
	// Which NASA satellites/data sources player has unlocked
	unlockedDataSources: Set<string>; // e.g., "SMAP", "MODIS", "Landsat 8"
	// Data quality level (affects prediction accuracy)
	dataQualityLevel: number; // 0-100
	// Historical data collected (more data = better predictions)
	historicalDataDays: number;
}

// ==================== PLAYER PROGRESSION ====================
interface PlayerProgress {
	level: number;
	experience: number;
	experienceToNextLevel: number;
	// Achievements/milestones
	achievements: Set<string>;
	// Technology tree unlocks
	unlockedTechnologies: Set<string>;
}

// ==================== FARM STATISTICS ====================
interface FarmStatistics {
	// Production metrics
	totalHarvests: number;
	totalRevenue: number;
	totalWaterUsed: number;
	totalFertilizerUsed: number;

	// Efficiency metrics
	averageYieldPerField: number;
	waterEfficiency: number; // Revenue per water unit
	fertilizerEfficiency: number;

	// Environmental impact
	carbonSequestered: number; // in tons
	pesticideReduction: number; // percentage vs. baseline
	soilHealthAverage: number;

	// NASA integration stats
	satelliteDataUsed: number; // total data queries
	accuratePredictions: number; // successful forecasts
	moneysSavedByData: number; // calculated savings from optimization
}

interface GameState {
	// ==================== CORE RESOURCES ====================
	money: number;
	ownedFieldIds: Set<string>;

	// ==================== FIELD MANAGEMENT ====================
	fields: Map<string, Field>; // fieldId -> Field instance
	fieldUpdateCounter: number; // Increment to trigger re-renders

	// ==================== LOCATION ====================
	location: {
		lat: number;
		lon: number;
		name: string;
	};

	// ==================== TIME & WEATHER ====================
	currentDay: number;
	currentSeason: Season;
	weatherConditions: {
		temperature: number; // Celsius
		rainfall: number; // mm
		humidity: number; // percentage
		windSpeed: number; // km/h
		uvIndex: number;
	};
	// Daily weather history for each game day
	dailyWeatherHistory: Map<
		number,
		{
			temperature: number;
			precipitation: number;
			soilMoisture: number;
			condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
		}
	>;

	// ==================== PLAYER DATA ====================
	inventory: PlayerInventory;
	nasaData: NASADataAccess;
	progress: PlayerProgress;
	statistics: FarmStatistics;

	// ==================== ALERTS & NOTIFICATIONS ====================
	alerts: Array<{
		id: string;
		type: 'warning' | 'info' | 'success' | 'nasa_insight';
		message: string;
		day: number; // Day the alert was created
		fieldId?: string;
		dataSource?: string; // Which NASA satellite provided this insight
	}>;

	// ==================== ACTIONS - BASIC ====================
	addMoney: (amount: number) => void;
	spendMoney: (amount: number) => boolean;
	purchaseField: (fieldId: string, price: number) => boolean;

	// ==================== ACTIONS - FIELD MANAGEMENT ====================
	getField: (fieldId: string) => Field | undefined;
	updateField: (fieldId: string, field: Field) => void;
	initializeFields: (fields: Field[]) => void;
	applyFieldChanges: (changes: GameStateChanges['cropChanges']) => void;

	// ==================== ACTIONS - INVENTORY ====================
	purchaseItem: (itemId: string, price: number, quantity?: number) => boolean;
	applyItemToField: (fieldId: string, itemId: string) => boolean;
	applyGlobalUpgrade: (itemId: string, duration: number) => void;
	checkItemActive: (fieldId: string, itemId: string) => boolean;
	getActiveItems: (fieldId: string) => string[];

	// ==================== ACTIONS - NASA DATA ====================
	unlockDataSource: (satellite: string) => void;
	improveDataQuality: (amount: number) => void;
	recordDataUsage: () => void;
	addNASAInsight: (message: string, satellite: string) => void;

	// ==================== ACTIONS - PROGRESSION ====================
	addExperience: (amount: number) => void;
	unlockTechnology: (techId: string) => void;
	earnAchievement: (achievementId: string) => void;

	// ==================== ACTIONS - STATISTICS ====================
	recordHarvest: (value: number, fieldId: string) => void;
	recordResourceUsage: (water: number, fertilizer: number) => void;
	updateEnvironmentalImpact: (
		carbon: number,
		pesticideReduction: number,
		soilHealth: number
	) => void;

	// ==================== ACTIONS - ALERTS ====================
	addAlert: (
		type: 'warning' | 'info' | 'success' | 'nasa_insight',
		message: string,
		fieldId?: string,
		dataSource?: string
	) => void;
	dismissAlert: (id: string) => void;
	clearAlerts: () => void;

	// ==================== ACTIONS - TIME ====================
	advanceDay: () => void;
	advanceDayWithAI: (daysToAdvance?: number) => Promise<void>;
	updateWeather: () => void;

	// ==================== ACTIONS - UTILITY ====================
	resetGame: () => void;
	getGameData: () => object; // For save/load
}

const STARTING_MONEY = 500;
const STARTING_FIELDS = [
	'hex-0-0',
	'hex-0--1',
	'hex-0-1',
	'hex-1--1',
	'hex-1-0',
	'hex--1-1',
	'hex--1-0',
	'hex-1--2',
	'hex-2--2',
	'hex-2--1'
];

export const useGameStore = create<GameState>((set, get) => ({
	// ==================== INITIAL STATE ====================
	money: STARTING_MONEY,
	ownedFieldIds: new Set(STARTING_FIELDS),
	fields: new Map(), // Will be initialized by the component
	fieldUpdateCounter: 0,

	location: {
		lat: 40.7,
		lon: -74.0,
		name: 'Central US Farm'
	},

	currentDay: 1,
	currentSeason: 'Spring',
	weatherConditions: {
		temperature: 20,
		rainfall: 2.5,
		humidity: 65,
		windSpeed: 12,
		uvIndex: 6
	},
	dailyWeatherHistory: new Map(),

	inventory: {
		activeFieldItems: new Map(),
		activeGlobalUpgrades: new Map(),
		itemsOwned: new Map()
	},

	nasaData: {
		unlockedDataSources: new Set(['SMAP']), // Start with basic soil moisture
		dataQualityLevel: 30,
		historicalDataDays: 0
	},

	progress: {
		level: 1,
		experience: 0,
		experienceToNextLevel: 100,
		achievements: new Set(),
		unlockedTechnologies: new Set(['basic_irrigation', 'organic_farming'])
	},

	statistics: {
		totalHarvests: 0,
		totalRevenue: 0,
		totalWaterUsed: 0,
		totalFertilizerUsed: 0,
		averageYieldPerField: 0,
		waterEfficiency: 0,
		fertilizerEfficiency: 0,
		carbonSequestered: 0,
		pesticideReduction: 0,
		soilHealthAverage: 85,
		satelliteDataUsed: 0,
		accuratePredictions: 0,
		moneysSavedByData: 0
	},

	alerts: [
		{
			id: 'welcome',
			type: 'info',
			message: '🚀 Welcome to Cultivar! Use NASA satellite data to optimize your farming.',
			day: 1
		},
		{
			id: 'smap_intro',
			type: 'nasa_insight',
			message: '📡 SMAP satellite unlocked! Monitor soil moisture every 2-3 days at 9km resolution.',
			dataSource: 'SMAP',
			day: 1
		}
	],

	// ==================== BASIC ACTIONS ====================
	addMoney: (amount) =>
		set((state) => ({
			money: state.money + amount
		})),

	spendMoney: (amount) => {
		const state = get();
		if (state.money >= amount) {
			set({ money: state.money - amount });
			return true;
		}
		return false;
	},

	// ==================== FIELD MANAGEMENT ACTIONS ====================
	getField: (fieldId) => {
		return get().fields.get(fieldId);
	},

	updateField: (fieldId, field) => {
		set((state) => {
			const newFields = new Map(state.fields);
			// Create a shallow copy of the field to ensure Zustand detects the change
			const fieldCopy = Object.assign(Object.create(Object.getPrototypeOf(field)), field);
			newFields.set(fieldId, fieldCopy);
			return {
				fields: newFields,
				fieldUpdateCounter: state.fieldUpdateCounter + 1
			};
		});
	},

	initializeFields: (fieldsList) => {
		const state = get();
		const fieldsMap = new Map<string, Field>();
		fieldsList.forEach((field) => {
			// Set ownership based on ownedFieldIds
			field.owned = state.ownedFieldIds.has(field.id);
			fieldsMap.set(field.id, field);
		});
		set({
			fields: fieldsMap,
			fieldUpdateCounter: 0
		});
	},

	applyFieldChanges: (changes) => {
		const state = get();
		const newFields = new Map(state.fields);

		changes.forEach((change) => {
			const field = newFields.get(change.fieldId);
			if (!field || !field.plant) return;

			// Apply growth
			if (
				change.growthIncrease > 0 &&
				field.plant.currentGrowthStage < field.plant.data.growthStages
			) {
				const stageProgress =
					(field.plant.currentGrowthStage * 100 + change.growthIncrease) / field.plant.data.growthStages;
				const newStage = Math.floor((stageProgress / 100) * field.plant.data.growthStages);
				field.plant.currentGrowthStage = Math.min(newStage, field.plant.data.growthStages);
			}

			// Apply health change
			if (change.healthChange !== 0) {
				field.plant.health = Math.max(0, Math.min(100, field.plant.health + change.healthChange));
			}

			// Apply water level change
			field.plant.waterLevel = Math.max(
				0,
				Math.min(100, field.plant.waterLevel + change.waterLevelChange)
			);

			// Apply fertilizer change
			if (change.fertilizerLevelChange !== undefined) {
				field.plant.fertilizerLevel = Math.max(
					0,
					Math.min(100, field.plant.fertilizerLevel + change.fertilizerLevelChange)
				);
			}

			// Apply soil quality change
			if (change.soilQualityChange !== undefined) {
				field.soilQuality = Math.max(0, Math.min(100, field.soilQuality + change.soilQualityChange));
			}

			// Handle disease risk
			if (
				change.diseaseRisk > 70 &&
				!field.plant.diseased &&
				Math.random() * 100 < change.diseaseRisk
			) {
				field.plant.infectDisease();
				get().addAlert(
					'warning',
					`⚠️ ${field.plant.data.name} in ${change.fieldId} has been infected!`,
					change.fieldId
				);
			}

			// Add field-specific alerts
			if (change.needsAttention) {
				get().addAlert('warning', change.recommendation, change.fieldId);
			}

			// Add crop-specific insights
			if (change.cropSpecificInsights) {
				get().addAlert('info', `📊 ${change.cropSpecificInsights}`, change.fieldId);
			}

			newFields.set(change.fieldId, field);
		});

		set({
			fields: newFields,
			fieldUpdateCounter: state.fieldUpdateCounter + 1
		});
	},

	purchaseField: (fieldId, price) => {
		const state = get();
		if (state.money >= price && !state.ownedFieldIds.has(fieldId)) {
			// Update field ownership
			const field = state.fields.get(fieldId);
			if (field) {
				field.owned = true;
			}

			set((state) => ({
				money: state.money - price,
				ownedFieldIds: new Set([...state.ownedFieldIds, fieldId]),
				fieldUpdateCounter: state.fieldUpdateCounter + 1
			}));
			get().addAlert('success', `Field ${fieldId} purchased!`);
			get().addExperience(10);
			return true;
		}
		if (state.money < price) {
			get().addAlert('warning', 'Not enough money to purchase this field!');
		}
		return false;
	},

	// ==================== INVENTORY ACTIONS ====================
	purchaseItem: (itemId, price, quantity = 1) => {
		const state = get();
		const totalCost = price * quantity;

		if (state.money >= totalCost) {
			const newItemsOwned = new Map(state.inventory.itemsOwned);
			const currentQuantity = newItemsOwned.get(itemId) || 0;
			newItemsOwned.set(itemId, currentQuantity + quantity);

			set((state) => ({
				money: state.money - totalCost,
				inventory: {
					...state.inventory,
					itemsOwned: newItemsOwned
				}
			}));

			get().addExperience(price / 10);
			return true;
		}
		return false;
	},

	applyItemToField: (fieldId, itemId) => {
		const state = get();
		const itemsOwned = state.inventory.itemsOwned.get(itemId) || 0;

		if (itemsOwned > 0) {
			const newItemsOwned = new Map(state.inventory.itemsOwned);
			newItemsOwned.set(itemId, itemsOwned - 1);

			const newActiveFieldItems = new Map(state.inventory.activeFieldItems);
			if (!newActiveFieldItems.has(fieldId)) {
				newActiveFieldItems.set(fieldId, new Map());
			}
			const fieldItems = newActiveFieldItems.get(fieldId)!;
			// Item expires in 30 days by default (can be customized)
			fieldItems.set(itemId, state.currentDay + 30);

			set((state) => ({
				inventory: {
					...state.inventory,
					itemsOwned: newItemsOwned,
					activeFieldItems: newActiveFieldItems
				}
			}));
			return true;
		}
		return false;
	},

	applyGlobalUpgrade: (itemId, duration) => {
		const state = get();
		const newGlobalUpgrades = new Map(state.inventory.activeGlobalUpgrades);
		newGlobalUpgrades.set(itemId, state.currentDay + duration);

		set((state) => ({
			inventory: {
				...state.inventory,
				activeGlobalUpgrades: newGlobalUpgrades
			}
		}));
	},

	checkItemActive: (fieldId, itemId) => {
		const state = get();
		const fieldItems = state.inventory.activeFieldItems.get(fieldId);
		if (!fieldItems) return false;

		const expiresOnDay = fieldItems.get(itemId);
		return expiresOnDay !== undefined && expiresOnDay > state.currentDay;
	},

	getActiveItems: (fieldId) => {
		const state = get();
		const fieldItems = state.inventory.activeFieldItems.get(fieldId);
		if (!fieldItems) return [];

		const activeItems: string[] = [];
		fieldItems.forEach((expiresOnDay, itemId) => {
			if (expiresOnDay > state.currentDay) {
				activeItems.push(itemId);
			}
		});
		return activeItems;
	},

	// ==================== NASA DATA ACTIONS ====================
	unlockDataSource: (satellite) => {
		set((state) => ({
			nasaData: {
				...state.nasaData,
				unlockedDataSources: new Set([...state.nasaData.unlockedDataSources, satellite])
			}
		}));
		get().addNASAInsight(`New satellite unlocked: ${satellite}! 🛰️`, satellite);
	},

	improveDataQuality: (amount) => {
		set((state) => ({
			nasaData: {
				...state.nasaData,
				dataQualityLevel: Math.min(100, state.nasaData.dataQualityLevel + amount)
			}
		}));
	},

	recordDataUsage: () => {
		set((state) => ({
			statistics: {
				...state.statistics,
				satelliteDataUsed: state.statistics.satelliteDataUsed + 1
			}
		}));
	},

	addNASAInsight: (message, satellite) => {
		get().addAlert('nasa_insight', message, undefined, satellite);
		get().recordDataUsage();
	},

	// ==================== PROGRESSION ACTIONS ====================
	addExperience: (amount) => {
		set((state) => {
			const newExp = state.progress.experience + amount;
			let newLevel = state.progress.level;
			let expToNext = state.progress.experienceToNextLevel;

			// Level up logic
			if (newExp >= expToNext) {
				newLevel += 1;
				expToNext = Math.floor(expToNext * 1.5);
				get().addAlert('success', `🎉 Level Up! You are now level ${newLevel}!`);
			}

			return {
				progress: {
					...state.progress,
					experience: newExp,
					level: newLevel,
					experienceToNextLevel: expToNext
				}
			};
		});
	},

	unlockTechnology: (techId) => {
		set((state) => ({
			progress: {
				...state.progress,
				unlockedTechnologies: new Set([...state.progress.unlockedTechnologies, techId])
			}
		}));
		get().addAlert('success', `New technology unlocked! 🔬`);
	},

	earnAchievement: (achievementId) => {
		const state = get();
		if (!state.progress.achievements.has(achievementId)) {
			set((state) => ({
				progress: {
					...state.progress,
					achievements: new Set([...state.progress.achievements, achievementId])
				}
			}));
			get().addAlert('success', `Achievement earned! 🏆`);
			get().addExperience(50);
		}
	},

	// ==================== STATISTICS ACTIONS ====================
	recordHarvest: (value, fieldId?) => {
		set((state) => {
			const newTotalHarvests = state.statistics.totalHarvests + 1;
			const newTotalRevenue = state.statistics.totalRevenue + value;

			return {
				money: state.money + value,
				statistics: {
					...state.statistics,
					totalHarvests: newTotalHarvests,
					totalRevenue: newTotalRevenue,
					averageYieldPerField: newTotalRevenue / newTotalHarvests
				}
			};
		});
		get().addExperience(value / 5);

		// Future: Could use fieldId for field-specific tracking
		if (fieldId) {
			// Track per-field statistics
		}
	},

	recordResourceUsage: (water, fertilizer) => {
		set((state) => ({
			statistics: {
				...state.statistics,
				totalWaterUsed: state.statistics.totalWaterUsed + water,
				totalFertilizerUsed: state.statistics.totalFertilizerUsed + fertilizer,
				waterEfficiency: state.statistics.totalRevenue / (state.statistics.totalWaterUsed + water || 1),
				fertilizerEfficiency:
					state.statistics.totalRevenue / (state.statistics.totalFertilizerUsed + fertilizer || 1)
			}
		}));
	},

	updateEnvironmentalImpact: (carbon, pesticideReduction, soilHealth) => {
		set((state) => ({
			statistics: {
				...state.statistics,
				carbonSequestered: state.statistics.carbonSequestered + carbon,
				pesticideReduction: pesticideReduction,
				soilHealthAverage: soilHealth
			}
		}));
	},

	// ==================== ALERTS ====================
	addAlert: (type, message, fieldId, dataSource) =>
		set((state) => ({
			alerts: [
				...state.alerts,
				{
					id: `${Date.now()}-${Math.random()}`,
					type,
					message,
					day: state.currentDay,
					fieldId,
					dataSource
				}
			]
		})),

	dismissAlert: (id) =>
		set((state) => ({
			alerts: state.alerts.filter((alert) => alert.id !== id)
		})),

	clearAlerts: () => set({ alerts: [] }),

	// ==================== TIME & WEATHER ====================
	advanceDay: () => {
		set((state) => {
			const newDay = state.currentDay + 1;
			let newSeason: Season = state.currentSeason;

			// Season calculation (every 30 days)
			const dayInYear = newDay % 120;
			if (dayInYear < 30) newSeason = 'Spring';
			else if (dayInYear < 60) newSeason = 'Summer';
			else if (dayInYear < 90) newSeason = 'Autumn';
			else newSeason = 'Winter';

			// Clean up expired items
			const newActiveFieldItems = new Map(state.inventory.activeFieldItems);
			newActiveFieldItems.forEach((items) => {
				items.forEach((expiresOnDay, itemId) => {
					if (expiresOnDay <= newDay) {
						items.delete(itemId);
					}
				});
			});

			const newActiveGlobalUpgrades = new Map(state.inventory.activeGlobalUpgrades);
			newActiveGlobalUpgrades.forEach((expiresOnDay, itemId) => {
				if (expiresOnDay <= newDay) {
					newActiveGlobalUpgrades.delete(itemId);
				}
			});

			return {
				currentDay: newDay,
				currentSeason: newSeason,
				inventory: {
					...state.inventory,
					activeFieldItems: newActiveFieldItems,
					activeGlobalUpgrades: newActiveGlobalUpgrades
				},
				nasaData: {
					...state.nasaData,
					historicalDataDays: state.nasaData.historicalDataDays + 1
				}
			};
		});
		get().updateWeather();
	},

	advanceDayWithAI: async (daysToAdvance: number = 1) => {
		const state = get();

		// Get field data from the fields map
		const fields = Array.from(state.fields.values())
			.filter((field) => state.ownedFieldIds.has(field.id))
			.map((field) => {
				const plant = field.plant;
				const plantData = plant ? PLANT_TYPES[plant.data.id.toUpperCase()] : null;

				return {
					id: field.id,
					cropType: plant?.data.id || null,
					cropName: plant?.data.name,
					growthStage: plant?.currentGrowthStage,
					maxGrowthStages: plant?.data.growthStages,
					waterRequirement: plantData?.waterRequirement,
					diseaseResistance: plantData?.diseaseResistance,
					growth: plant?.growthPercentage || 0,
					health: plant?.health || 100,
					waterLevel: plant?.waterLevel || 100,
					fertilizerLevel: plant?.fertilizerLevel || 0,
					soilQuality: field.soilQuality,
					diseased: plant?.diseased || false
				};
			});

		try {
			const changes: GameStateChanges = await generateDayAdvancement(
				{
					currentDay: state.currentDay,
					season: state.currentSeason,
					location: state.location,
					fields,
					activeSatellites: Array.from(state.nasaData.unlockedDataSources),
					recentWeather: {
						temperature: state.weatherConditions.temperature,
						precipitation: state.weatherConditions.rainfall,
						condition: 'sunny' // TODO: track condition in state
					}
				},
				daysToAdvance
			);

			// Apply AI-generated changes
			const newDailyWeatherHistory = new Map(state.dailyWeatherHistory);
			newDailyWeatherHistory.set(state.currentDay, {
				temperature: changes.weather.temperature,
				precipitation: changes.weather.precipitation,
				soilMoisture: changes.soilMoisture,
				condition: changes.weather.condition
			});

			set({
				weatherConditions: {
					temperature: changes.weather.temperature,
					rainfall: changes.weather.precipitation,
					humidity: state.weatherConditions.humidity,
					windSpeed: state.weatherConditions.windSpeed,
					uvIndex: state.weatherConditions.uvIndex
				},
				dailyWeatherHistory: newDailyWeatherHistory
			});

			// Apply changes to fields
			get().applyFieldChanges(changes.cropChanges);

			// Add alerts from AI
			changes.alerts.forEach((alert) => {
				get().addAlert(alert.type, alert.message);
			});

			// Add NASA insights
			changes.nasaInsights.forEach((insight) => {
				get().addNASAInsight(insight, 'AI Analysis');
			});

			// Advance the appropriate number of days
			for (let i = 0; i < daysToAdvance; i++) {
				get().advanceDay();
			}
		} catch (error) {
			console.error('AI day advancement failed, using fallback:', error);
			// Fallback to regular advancement
			for (let i = 0; i < daysToAdvance; i++) {
				get().advanceDay();
			}
		}
	},

	updateWeather: () => {
		// Generate realistic weather with gradual transitions
		const state = get();
		const season = state.currentSeason;
		const previousDay = state.dailyWeatherHistory.get(state.currentDay - 1);

		// Season-based temperature ranges
		let baseTempRange: [number, number];
		if (season === 'Summer') baseTempRange = [25, 35];
		else if (season === 'Winter') baseTempRange = [0, 10];
		else if (season === 'Autumn') baseTempRange = [10, 20];
		else baseTempRange = [15, 25]; // Spring

		// Gradual temperature change (max ±3°C per day)
		let temperature: number;
		if (previousDay) {
			const tempChange = Math.random() * 6 - 3; // -3 to +3
			temperature = Math.max(
				baseTempRange[0],
				Math.min(baseTempRange[1], previousDay.temperature + tempChange)
			);
		} else {
			temperature = baseTempRange[0] + Math.random() * (baseTempRange[1] - baseTempRange[0]);
		}

		// Weather condition transitions (realistic patterns)
		let condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
		let precipitation: number;

		const previousCondition = previousDay?.condition || 'sunny';

		// Transition probabilities based on previous condition
		const rand = Math.random();
		if (previousCondition === 'sunny') {
			if (rand < 0.7) {
				condition = 'sunny';
				precipitation = 0;
			} else if (rand < 0.9) {
				condition = 'cloudy';
				precipitation = Math.random() * 2;
			} else {
				condition = 'rainy';
				precipitation = 2 + Math.random() * 8;
			}
		} else if (previousCondition === 'cloudy') {
			if (rand < 0.3) {
				condition = 'sunny';
				precipitation = 0;
			} else if (rand < 0.7) {
				condition = 'cloudy';
				precipitation = Math.random() * 3;
			} else {
				condition = 'rainy';
				precipitation = 3 + Math.random() * 10;
			}
		} else if (previousCondition === 'rainy') {
			if (rand < 0.2) {
				condition = 'sunny';
				precipitation = 0;
			} else if (rand < 0.5) {
				condition = 'cloudy';
				precipitation = Math.random() * 5;
			} else if (rand < 0.85) {
				condition = 'rainy';
				precipitation = 5 + Math.random() * 15;
			} else {
				condition = 'stormy';
				precipitation = 15 + Math.random() * 25;
			}
		} else {
			// stormy
			if (rand < 0.4) {
				condition = 'rainy';
				precipitation = 10 + Math.random() * 15;
			} else if (rand < 0.7) {
				condition = 'cloudy';
				precipitation = Math.random() * 5;
			} else {
				condition = 'stormy';
				precipitation = 20 + Math.random() * 30;
			}
		}

		// Calculate soil moisture (affected by precipitation and previous day)
		const previousMoisture = previousDay?.soilMoisture || 50;
		let soilMoisture = previousMoisture;

		// Add moisture from precipitation (1mm rain = ~2% soil moisture increase)
		soilMoisture += precipitation * 2;

		// Natural drainage/evaporation (-5 to -15% per day depending on temperature)
		const evaporationRate = 5 + ((temperature - 15) / 20) * 10; // Higher temp = more evaporation
		soilMoisture = Math.max(10, Math.min(100, soilMoisture - evaporationRate));

		// Store in daily history
		const newDailyWeatherHistory = new Map(state.dailyWeatherHistory);
		newDailyWeatherHistory.set(state.currentDay, {
			temperature,
			precipitation,
			soilMoisture,
			condition
		});

		set({
			weatherConditions: {
				temperature,
				rainfall: precipitation,
				humidity: 40 + precipitation * 3, // Higher rain = higher humidity
				windSpeed: condition === 'stormy' ? 30 + Math.random() * 40 : 5 + Math.random() * 25,
				uvIndex:
					condition === 'sunny' ? 7 + Math.floor(Math.random() * 4) : Math.floor(Math.random() * 5)
			},
			dailyWeatherHistory: newDailyWeatherHistory
		});
	},

	// ==================== UTILITY ====================
	resetGame: () =>
		set({
			money: STARTING_MONEY,
			ownedFieldIds: new Set(STARTING_FIELDS),
			fields: new Map(),
			fieldUpdateCounter: 0,
			currentDay: 1,
			currentSeason: 'Spring',
			weatherConditions: {
				temperature: 20,
				rainfall: 2.5,
				humidity: 65,
				windSpeed: 12,
				uvIndex: 6
			},
			dailyWeatherHistory: new Map(),
			inventory: {
				activeFieldItems: new Map(),
				activeGlobalUpgrades: new Map(),
				itemsOwned: new Map()
			},
			nasaData: {
				unlockedDataSources: new Set(['SMAP']),
				dataQualityLevel: 30,
				historicalDataDays: 0
			},
			progress: {
				level: 1,
				experience: 0,
				experienceToNextLevel: 100,
				achievements: new Set(),
				unlockedTechnologies: new Set(['basic_irrigation', 'organic_farming'])
			},
			statistics: {
				totalHarvests: 0,
				totalRevenue: 0,
				totalWaterUsed: 0,
				totalFertilizerUsed: 0,
				averageYieldPerField: 0,
				waterEfficiency: 0,
				fertilizerEfficiency: 0,
				carbonSequestered: 0,
				pesticideReduction: 0,
				soilHealthAverage: 85,
				satelliteDataUsed: 0,
				accuratePredictions: 0,
				moneysSavedByData: 0
			},
			alerts: [
				{
					id: 'welcome',
					type: 'info',
					message: '🚀 Welcome to Cultivar!',
					day: 1
				}
			]
		}),

	getGameData: () => {
		const state = get();
		return {
			money: state.money,
			currentDay: state.currentDay,
			currentSeason: state.currentSeason,
			progress: {
				level: state.progress.level,
				experience: state.progress.experience
			},
			statistics: state.statistics
		};
	}
}));
