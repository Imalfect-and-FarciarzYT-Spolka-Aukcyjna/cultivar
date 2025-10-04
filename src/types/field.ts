import { Plant } from './plant';

export interface FieldCoordinates {
	q: number;
	r: number;
	s: number;
}

export class Field {
	readonly id: string;
	readonly coordinates: FieldCoordinates;
	plant: Plant | null;
	owned: boolean;
	soilQuality: number; // 0-100
	purchasePrice: number;

	constructor(id: string, q: number, r: number, owned: boolean = false) {
		this.id = id;
		this.coordinates = {
			q,
			r,
			s: -q - r
		};
		this.plant = null;
		this.owned = owned;
		this.soilQuality = 70 + Math.random() * 30; // Random 70-100

		// Calculate price based on distance from center
		const distance = Math.abs(q) + Math.abs(r) + Math.abs(-q - r);
		this.purchasePrice = Math.round(100 + distance * 50);
	}

	get isEmpty(): boolean {
		return this.plant === null;
	}

	get condition(): number {
		if (!this.plant) return 50; // Neutral when empty
		return this.plant.health;
	}

	get conditionColor(): string {
		const condition = this.condition;

		// Red to white to green gradient based on condition
		if (condition < 50) {
			// Red (0) to White (50) - more intense red
			const intensity = condition / 50;
			// Use quadratic curve for more visible red at low health
			const adjusted = Math.pow(intensity, 0.5);
			return `rgb(${255}, ${Math.round(255 * adjusted)}, ${Math.round(255 * adjusted)})`;
		} else {
			// White (50) to Green (100)
			const intensity = (condition - 50) / 50;
			// Use quadratic curve for more visible green at high health
			const adjusted = Math.pow(intensity, 0.5);
			return `rgb(${Math.round(255 * (1 - adjusted))}, ${255}, ${Math.round(255 * (1 - adjusted))})`;
		}
	}

	plantCrop(plant: Plant): boolean {
		if (!this.isEmpty || !this.owned) return false;
		this.plant = plant;
		return true;
	}

	harvest(): Plant | null {
		if (!this.plant?.isFullyGrown) return null;
		const harvestedPlant = this.plant;
		this.plant = null;
		return harvestedPlant;
	}

	get displayEmoji(): string {
		return this.plant?.emoji ?? '';
	}

	// Apply fertilizer to improve soil quality
	fertilizeSoil(amount: number = 20): void {
		this.soilQuality = Math.min(100, this.soilQuality + amount);
	}

	// Daily update for field
	dailyUpdate(): void {
		// Soil quality slowly degrades
		this.soilQuality = Math.max(0, this.soilQuality - 0.5);

		// Update plant if exists
		if (this.plant) {
			this.plant.dailyUpdate();

			// Soil quality affects plant health
			if (this.soilQuality < 30) {
				this.plant.damage(2);
			}
		}
	}
}
