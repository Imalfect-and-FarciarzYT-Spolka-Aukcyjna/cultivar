export interface PlantData {
	id: string;
	name: string;
	emoji: string;
	growthStages: number; // Total growth stages
	baseGrowthTime: number; // Time per stage in game days
	waterRequirement: number; // Water needed per day (0-100)
	fertilizerBoost: number; // Growth boost from fertilizer (0-1)
	diseaseResistance: number; // Resistance to disease (0-100)
	marketValue: number; // Base selling price when harvested
	seedCost: number; // Cost to purchase seeds
}

export class Plant {
	readonly data: PlantData;
	currentGrowthStage: number;
	health: number; // 0-100
	waterLevel: number; // 0-100
	fertilizerLevel: number; // 0-100
	diseased: boolean;

	constructor(data: PlantData, growthStage: number = 0, health: number = 100) {
		this.data = data;
		this.currentGrowthStage = Math.max(0, Math.min(growthStage, data.growthStages));
		this.health = Math.max(0, Math.min(health, 100));
		this.waterLevel = 50;
		this.fertilizerLevel = 0;
		this.diseased = false;
	}

	get isFullyGrown(): boolean {
		return this.currentGrowthStage >= this.data.growthStages;
	}

	get growthPercentage(): number {
		return (this.currentGrowthStage / this.data.growthStages) * 100;
	}

	get emoji(): string {
		return this.data.emoji;
	}

	get harvestValue(): number {
		// Value depends on health and whether fully grown
		if (!this.isFullyGrown) return 0;
		return Math.round(this.data.marketValue * (this.health / 100));
	}

	get needsWater(): boolean {
		return this.waterLevel < 30;
	}

	get needsFertilizer(): boolean {
		return this.fertilizerLevel < 20 && this.currentGrowthStage > 0;
	}

	grow(): void {
		if (!this.isFullyGrown) {
			const oldStage = this.currentGrowthStage;
			this.currentGrowthStage++;
			console.log(`🌱 ${this.data.name} grew from stage ${oldStage} to ${this.currentGrowthStage} (${this.growthPercentage.toFixed(1)}%)`);
		}
	}

	// Advanced growth method that handles percentage-based growth
	advanceGrowth(percentage: number): void {
		if (this.isFullyGrown) return;
		
		const oldStage = this.currentGrowthStage;
		const oldProgress = this.growthPercentage;
		
		// Convert percentage to stage progress
		const totalStages = this.data.growthStages;
		const currentProgress = (this.currentGrowthStage / totalStages) * 100;
		const newProgress = Math.min(100, currentProgress + percentage);
		
		// Calculate new stage based on progress
		const newStage = Math.floor((newProgress / 100) * totalStages);
		this.currentGrowthStage = Math.min(newStage, totalStages);
		
		// Debug logging for growth
		if (this.currentGrowthStage > oldStage) {
			console.log(`🌱 ${this.data.name} grew from stage ${oldStage} to ${this.currentGrowthStage} (${oldProgress.toFixed(1)}% → ${this.growthPercentage.toFixed(1)}%)`);
		}
	}

	water(amount: number = 50): void {
		this.waterLevel = Math.min(100, this.waterLevel + amount);
	}

	fertilize(amount: number = 50): void {
		this.fertilizerLevel = Math.min(100, this.fertilizerLevel + amount);
	}

	damage(amount: number): void {
		this.health = Math.max(0, this.health - amount);
	}

	heal(amount: number): void {
		this.health = Math.min(100, this.health + amount);
	}

	infectDisease(): void {
		this.diseased = true;
		this.health = Math.max(0, this.health - 20);
	}

	cureDisease(): void {
		this.diseased = false;
	}

	// Called each game day to update plant state
	dailyUpdate(): void {
		// Consume water
		this.waterLevel = Math.max(0, this.waterLevel - this.data.waterRequirement / 10);

		// Consume fertilizer slowly
		this.fertilizerLevel = Math.max(0, this.fertilizerLevel - 2);

		// Basic growth progression (only if not fully grown)
		if (!this.isFullyGrown) {
			// Base growth rate: 1 stage per baseGrowthTime days
			const growthChance = 1 / this.data.baseGrowthTime;
			if (Math.random() < growthChance) {
				console.log(`🌱 Daily growth chance triggered for ${this.data.name} (${(growthChance * 100).toFixed(1)}% chance)`);
				this.grow();
			}
		}

		// Check if needs are met
		if (this.waterLevel < 20) {
			this.damage(5); // Drought damage
		}

		// Disease chance based on resistance
		if (!this.diseased && Math.random() > this.data.diseaseResistance / 100) {
			if (Math.random() < 0.05) {
				// 5% chance per day if low resistance
				this.infectDisease();
			}
		}

		// Disease spreads if not treated
		if (this.diseased) {
			this.damage(3);
		}
	}
}
