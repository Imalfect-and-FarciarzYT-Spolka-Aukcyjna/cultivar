import { PlantData } from '../types/plant';

export const PLANT_TYPES: Record<string, PlantData> = {
	WHEAT: {
		id: 'wheat',
		name: 'Wheat',
		emoji: '🌾',
		growthStages: 4,
		baseGrowthTime: 3,
		waterRequirement: 40,
		fertilizerBoost: 0.3,
		diseaseResistance: 70,
		marketValue: 150,
		seedCost: 50
	},
	CARROT: {
		id: 'carrot',
		name: 'Carrot',
		emoji: '🥕',
		growthStages: 3,
		baseGrowthTime: 2,
		waterRequirement: 60,
		fertilizerBoost: 0.4,
		diseaseResistance: 80,
		marketValue: 120,
		seedCost: 40
	},
	CORN: {
		id: 'corn',
		name: 'Corn',
		emoji: '🌽',
		growthStages: 5,
		baseGrowthTime: 4,
		waterRequirement: 70,
		fertilizerBoost: 0.5,
		diseaseResistance: 60,
		marketValue: 200,
		seedCost: 70
	},
	TOMATO: {
		id: 'tomato',
		name: 'Tomato',
		emoji: '🍅',
		growthStages: 4,
		baseGrowthTime: 3,
		waterRequirement: 80,
		fertilizerBoost: 0.4,
		diseaseResistance: 50,
		marketValue: 180,
		seedCost: 60
	},
	POTATO: {
		id: 'potato',
		name: 'Potato',
		emoji: '🥔',
		growthStages: 3,
		baseGrowthTime: 2,
		waterRequirement: 50,
		fertilizerBoost: 0.3,
		diseaseResistance: 75,
		marketValue: 130,
		seedCost: 45
	}
};
