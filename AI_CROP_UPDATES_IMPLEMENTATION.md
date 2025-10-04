# AI Crop Updates Implementation

## Summary

Enhanced the `aiService.ts` and game state management to provide comprehensive, plant-specific
updates based on environmental conditions, crop characteristics, and NASA satellite data.

## Key Changes

### 1. Enhanced AI Service (`src/lib/aiService.ts`)

#### Updated Schema

Added new fields to `GameStateChangesSchema`:

- `fertilizerLevelChange`: Tracks fertilizer consumption based on growth activity
- `soilQualityChange`: Monitors soil degradation/improvement
- `cropSpecificInsights`: Plant-specific observations (e.g., growth stage transitions)
- Enhanced descriptions for all fields to guide AI behavior

#### Enhanced Game Context Interface

Extended the `GameContext` interface to include detailed plant information:

```typescript
fields: Array<{
	id: string;
	cropType: string | null;
	cropName?: string; // Human-readable name
	growthStage?: number; // Current stage (0-n)
	maxGrowthStages?: number; // Total stages to maturity
	waterRequirement?: number; // Daily water needs (0-100)
	diseaseResistance?: number; // Resistance percentage (0-100)
	growth: number; // Overall growth percentage
	health: number;
	waterLevel: number;
	fertilizerLevel: number;
	soilQuality: number;
	diseased: boolean;
}>;
```

#### Comprehensive AI Prompt

Created a detailed prompt that instructs the AI to consider:

**Plant-Specific Characteristics:**

- Wheat: Moderate water (40/day), high disease resistance (70%), 4 stages over ~12 days
- Carrot: High water (60/day), very resistant (80%), 3 stages over ~6 days
- Corn: Very high water (70/day), moderate resistance (60%), 5 stages over ~20 days
- Tomato: Extremely high water (80/day), low resistance (50%), 4 stages over ~12 days
- Potato: Moderate water (50/day), good resistance (75%), 3 stages over ~6 days

**Dynamic Factors:**

1. **Water Consumption**: Based on crop requirements, weather (hot = +20-40%), rain (-30-50%)
2. **Growth Progression**: Stage-based with environmental modifiers
3. **Disease Dynamics**: Resistance-based with weather multipliers
4. **Fertilizer Consumption**: Linked to growth activity (3-8% per day)
5. **Soil Quality**: Slow degradation, weather-influenced
6. **NASA Satellite Data**: SMAP, Landsat, MODIS, GPM insights
7. **Health Changes**: Multi-factor (disease, drought, temperature stress)

#### Enhanced Fallback System

Improved the fallback simulation to match AI capabilities:

- Crop-specific water consumption
- Temperature and water stress calculations
- Disease risk based on resistance
- Detailed recommendations
- Growth stage insights

### 2. Game Store Integration (`src/store/gameStore.ts`)

#### Added Field Management

```typescript
interface GameState {
	fields: Map<string, Field>; // Centralized field storage

	// New methods:
	getField(fieldId: string): Field | undefined;
	updateField(fieldId: string, field: Field): void;
	initializeFields(fields: Field[]): void;
	applyFieldChanges(changes: GameStateChanges['cropChanges']): void;
}
```

#### Field Change Application

The `applyFieldChanges` method:

1. Updates growth stages based on percentage increases
2. Applies health modifications
3. Manages water and fertilizer levels
4. Updates soil quality
5. Handles disease infection based on risk
6. Generates field-specific alerts

#### Enhanced Day Advancement

The `advanceDayWithAI` function now:

1. Extracts actual field data from the store
2. Includes plant type information (name, stages, requirements)
3. Passes comprehensive context to AI
4. Applies AI-generated changes to fields
5. Syncs weather conditions
6. Manages alerts and NASA insights

### 3. Component Integration (`src/components/SomeGrid.tsx`)

Updated to use centralized field management:

- Initializes fields in the store on mount
- Uses `getField()` to retrieve current field state
- Calls `updateField()` after modifications
- Ensures synchronization between UI and store

## How It Works

### Flow Diagram

```
User advances day
    ↓
SomeGrid.tsx calls advanceDayWithAI()
    ↓
gameStore extracts field data (crops, health, water, etc.)
    ↓
Calls generateDayAdvancement() with comprehensive context
    ↓
AI analyzes:
  - Crop types and their characteristics
  - Current environmental conditions
  - Weather patterns
  - NASA satellite data
  - Field-specific states
    ↓
AI generates:
  - Weather updates
  - Crop-specific changes (growth, health, water, fertilizer)
  - Disease risks and infections
  - Recommendations
  - Alerts and insights
    ↓
gameStore.applyFieldChanges() updates all fields
    ↓
UI re-renders with updated field states
```

## Plant-Specific Behavior Examples

### Tomatoes in Hot Weather

- High water requirement (80/day)
- Heat stress if temp > 30°C: growth -40%, water consumption +30%
- Low disease resistance: higher infection risk in humidity
- AI might recommend: "Tomatoes need urgent watering in current heat"

### Wheat in Spring

- Moderate water needs (40/day)
- High disease resistance: stable even in rain
- Steady growth if fertilizer > 40%
- AI might note: "Wheat entering heading stage, on track for harvest"

### Corn During Drought

- Very high water needs (70/day)
- Water stress at <30%: health -10/day, growth -50%
- AI alerts: "Corn shows severe drought stress - irrigate immediately"
- Growth stage transitions delayed

## Benefits

1. **Realistic Simulation**: Each crop behaves according to its actual characteristics
2. **Dynamic Interactions**: Weather, soil, and plant traits interact realistically
3. **Actionable Insights**: AI provides specific, contextual recommendations
4. **Educational Value**: Players learn about different crop needs
5. **Strategic Depth**: Must plan crop selection based on conditions
6. **NASA Integration**: Satellite data informs farming decisions

## Future Enhancements

1. **Multi-day Predictions**: Use historical data for forecasting
2. **Crop Rotation**: Soil quality improvements from rotation
3. **Companion Planting**: Crops affecting each other
4. **Pest Management**: Pest-specific threats and treatments
5. **Climate Adaptation**: Long-term weather pattern impacts
6. **Yield Optimization**: AI suggestions for maximum productivity

## Testing Recommendations

1. Plant different crops in various conditions
2. Advance time and observe crop-specific behaviors
3. Test drought conditions with high-water crops (tomatoes, corn)
4. Verify disease spreads faster in susceptible crops
5. Check that fertilizer affects growth appropriately
6. Confirm NASA insights are relevant and actionable
