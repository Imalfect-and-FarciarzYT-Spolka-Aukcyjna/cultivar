# Cultivar - Architecture Documentation

## Class-Based Field System

### Overview

Each hexagon in the grid is now a `Field` instance that can contain a `Plant`. This provides a
clean, object-oriented approach to managing game state.

## Core Classes

### Plant (`/src/types/plant.ts`)

Represents a crop planted in a field.

**Properties:**

- `data: PlantData` - Static plant information (name, emoji, growth stages)
- `currentGrowthStage: number` - Current growth progress (0 to growthStages)
- `health: number` - Plant health (0-100)

**Methods:**

- `grow()` - Advance growth by one stage
- `damage(amount)` - Reduce health
- `heal(amount)` - Increase health
- `isFullyGrown` - Check if ready to harvest
- `growthPercentage` - Get growth as percentage

**Example:**

```typescript
import { Plant } from '@/types/plant';
import { PLANT_TYPES } from '@/data/plants';

const wheat = new Plant(PLANT_TYPES.WHEAT, 0, 100);
wheat.grow(); // Advance to stage 1
wheat.damage(20); // Reduce health to 80
```

### Field (`/src/types/field.ts`)

Represents a hexagonal field on the game map.

**Properties:**

- `id: string` - Unique identifier
- `coordinates: {q, r, s}` - Axial coordinates
- `plant: Plant | null` - Currently planted crop

**Methods:**

- `plantCrop(plant)` - Plant a crop (returns false if occupied)
- `harvest()` - Remove and return the plant
- `isEmpty` - Check if field is empty
- `condition` - Get field condition (0-100)
- `conditionColor` - Get RGB color based on condition
- `displayEmoji` - Get plant emoji or empty string

**Color System:**

- **Red (0-49)**: Unhealthy plant
- **White (50)**: Empty field or neutral
- **Green (51-100)**: Healthy plant

**Example:**

```typescript
import { Field } from '@/types/field';
import { Plant } from '@/types/plant';
import { PLANT_TYPES } from '@/data/plants';

const field = new Field('hex-0-0', 0, 0);
const carrot = new Plant(PLANT_TYPES.CARROT);

field.plantCrop(carrot); // Returns true
field.plant?.grow(); // Grow the carrot
const harvested = field.harvest(); // Remove plant
```

## Plant Types (`/src/data/plants.ts`)

Pre-defined plant configurations:

- **WHEAT** 🌾 - 4 stages, 3 days/stage
- **CARROT** 🥕 - 3 stages, 2 days/stage
- **CORN** 🌽 - 5 stages, 4 days/stage
- **TOMATO** 🍅 - 4 stages, 3 days/stage
- **POTATO** 🥔 - 3 stages, 2 days/stage

Add more in `/src/data/plants.ts`:

```typescript
export const PLANT_TYPES: Record<string, PlantData> = {
	YOUR_PLANT: {
		id: 'your_plant',
		name: 'Your Plant',
		emoji: '🌱',
		growthStages: 3,
		baseGrowthTime: 2
	}
	// ...
};
```

## File Structure

```
src/
├── types/
│   ├── plant.ts          # Plant class and interface
│   ├── field.ts          # Field class and interface
│   └── game.ts           # Game state types
├── data/
│   └── plants.ts         # Plant type definitions
├── components/
│   ├── HexGrid/
│   │   ├── Hexagon.tsx   # Individual hexagon renderer
│   │   ├── HexGrid.tsx   # Grid container
│   │   ├── types.ts      # HexGrid-specific types
│   │   └── utils.ts      # Coordinate math
│   ├── GameUI/
│   │   ├── HexagonInfoPanel.tsx  # Field details panel
│   │   ├── WeatherTab.tsx
│   │   ├── UserBalanceTab.tsx
│   │   └── TimeControlTab.tsx
│   └── SomeGrid.tsx      # Main game component
```

## Usage Example

```typescript
// Initialize fields
const fields = [new Field('hex-0-0', 0, 0), new Field('hex-1-0', 1, 0)];

// Plant crops
const wheat = new Plant(PLANT_TYPES.WHEAT, 0, 100);
fields[0].plantCrop(wheat);

// Access field data
console.log(fields[0].condition); // 100 (healthy)
console.log(fields[0].conditionColor); // "rgb(0, 255, 0)" (green)
console.log(fields[0].displayEmoji); // "🌾"

// Damage plant
fields[0].plant?.damage(60);
console.log(fields[0].condition); // 40 (unhealthy)
console.log(fields[0].conditionColor); // "rgb(255, 204, 204)" (red-ish)

// Grow plant
fields[0].plant?.grow();
console.log(fields[0].plant?.growthPercentage); // 25% (1/4 stages)
```

## UI Integration

### Hexagon Display

- Background color: `field.conditionColor` (red→white→green)
- Center emoji: `field.displayEmoji` (plant emoji or empty)
- Selection: Yellow stroke on click

### Info Panel

Shows for selected field:

- Field ID and coordinates
- Plant name and emoji (if planted)
- Growth progress bar
- Health progress bar
- "Ready to Harvest!" badge when fully grown
- "Empty Field" message when vacant

## Extending the System

### Add New Plant Properties

Edit `/src/types/plant.ts`:

```typescript
export interface PlantData {
	// ... existing
	waterRequirement?: number;
	fertilizer?: string;
}
```

### Add Field Features

Edit `/src/types/field.ts`:

```typescript
export class Field {
	// ... existing
	soilQuality: number = 100;

	fertilize() {
		this.soilQuality = 100;
	}
}
```

### Add Game Actions

In `/src/components/SomeGrid.tsx`:

```typescript
const handlePlantCrop = (fieldId: string, plantType: PlantData) => {
	const field = fields.find((f) => f.id === fieldId);
	if (field) {
		const plant = new Plant(plantType);
		field.plantCrop(plant);
		// Trigger re-render or state update
	}
};
```

## KISS Principles Applied

1. **Classes over complex state**: Field and Plant are simple classes
2. **Raw data, no magic**: Direct property access, no hidden state
3. **Split files properly**: Each class in its own file
4. **Types separate**: Types defined alongside classes
5. **Clear separation**: Data (`/data`), Types (`/types`), Components (`/components`)
