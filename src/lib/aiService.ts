import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Schema for AI-generated game state changes
const GameStateChangesSchema = z.object({
	weather: z.object({
		temperature: z.number().describe('Temperature in Celsius'),
		precipitation: z.number().describe('Precipitation in mm'),
		condition: z.enum(['sunny', 'cloudy', 'rainy', 'stormy'])
	}),
	soilMoisture: z.number().min(0).max(100).describe('Soil moisture percentage'),
	cropChanges: z.array(
		z.object({
			fieldId: z.string(),
			growthIncrease: z
				.number()
				.min(0)
				.max(100)
				.describe('Growth percentage increase based on optimal conditions'),
			healthChange: z
				.number()
				.min(-50)
				.max(50)
				.describe('Health change considering disease, water stress, and environmental factors'),
			diseaseRisk: z
				.number()
				.min(0)
				.max(100)
				.describe('Disease risk based on crop resistance, weather, and conditions'),
			waterLevelChange: z
				.number()
				.min(-50)
				.max(0)
				.describe('Water consumption based on crop water requirements and weather'),
			fertilizerLevelChange: z
				.number()
				.min(-20)
				.max(0)
				.describe('Fertilizer depletion based on growth activity'),
			soilQualityChange: z
				.number()
				.min(-5)
				.max(2)
				.describe('Soil quality change based on farming practices'),
			needsAttention: z.boolean(),
			recommendation: z
				.string()
				.describe('Specific actionable advice for this crop based on its current state'),
			cropSpecificInsights: z
				.string()
				.optional()
				.describe(
					'Plant-specific observations (e.g., "Tomatoes showing excellent fruit set", "Wheat reaching heading stage")'
				)
		})
	),
	alerts: z.array(
		z.object({
			type: z.enum(['warning', 'info', 'success', 'nasa_insight']),
			message: z.string()
		})
	),
	nasaInsights: z.array(z.string()).describe('NASA satellite observations and recommendations')
});

export type GameStateChanges = z.infer<typeof GameStateChangesSchema>;

interface GameContext {
	currentDay: number;
	season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
	location: { lat: number; lon: number };
	fields: Array<{
		id: string;
		cropType: string | null;
		cropName?: string; // Human-readable name (e.g., "Wheat", "Tomato")
		growthStage?: number; // Current growth stage
		maxGrowthStages?: number; // Total stages to maturity
		waterRequirement?: number; // Daily water requirement (0-100)
		diseaseResistance?: number; // Disease resistance (0-100)
		growth: number; // Overall growth percentage
		health: number;
		waterLevel: number;
		fertilizerLevel: number;
		soilQuality: number;
		diseased: boolean;
	}>;
	activeSatellites: string[];
	recentWeather: {
		temperature: number;
		precipitation: number;
		condition: string;
	};
}
const openAiProvider = createOpenAI({
	apiKey:
		'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'
});
/**
 * Generate realistic game state changes using AI
 * This simulates what would happen over the course of a day based on current conditions
 */
export async function generateDayAdvancement(
	context: GameContext,
	daysToAdvance: number = 1
): Promise<GameStateChanges> {
	try {
		const { object } = await generateObject({
			model: openAiProvider('gpt-4o-mini'),
			schema: GameStateChangesSchema,
			prompt: `You are a farming simulation AI that generates realistic agricultural changes based on NASA satellite data and environmental conditions.

Current Game State:
- Day: ${context.currentDay}
- Season: ${context.season}
- Location: ${context.location.lat}°N, ${context.location.lon}°W
- Days to advance: ${daysToAdvance}
- Active NASA Satellites: ${context.activeSatellites.join(', ')}

Recent Weather:
- Temperature: ${context.recentWeather.temperature}°C
- Precipitation: ${context.recentWeather.precipitation}mm
- Condition: ${context.recentWeather.condition}

Current Fields (${context.fields.length} total):
${context.fields
	.map(
		(f) =>
			`Field ${f.id}: ${f.cropName || f.cropType || 'empty'}${f.cropType ? ` (Stage ${f.growthStage}/${f.maxGrowthStages})` : ''} | Growth: ${f.growth}% | Health: ${f.health}% | Water: ${f.waterLevel}% (needs ${f.waterRequirement || 50}/day) | Fertilizer: ${f.fertilizerLevel}% | Soil: ${f.soilQuality}%${f.diseased ? ' [DISEASED]' : ''}${f.diseaseResistance ? ` | Resistance: ${f.diseaseResistance}%` : ''}`
	)
	.join('\n')}

CRITICAL INSTRUCTIONS FOR CROP-SPECIFIC BEHAVIOR:

For each crop type, consider their unique characteristics:
- **Wheat**: Moderate water needs (40/day), high disease resistance (70%), grows in 4 stages over ~12 days
- **Carrot**: High water needs (60/day), very resistant to disease (80%), fast growth in 3 stages over ~6 days
- **Corn**: Very high water needs (70/day), moderate disease resistance (60%), slow growth in 5 stages over ~20 days
- **Tomato**: Extremely high water needs (80/day), low disease resistance (50%), medium growth in 4 stages over ~12 days
- **Potato**: Moderate water needs (50/day), good disease resistance (75%), fast growth in 3 stages over ~6 days

Generate realistic changes for the next ${daysToAdvance} day(s) considering:

1. **Plant-Specific Water Consumption**: 
   - Deduct water based on each crop's waterRequirement value
   - Increase deduction in hot weather (>25°C) by 20-40%
   - Reduce deduction in rainy conditions by 30-50%
   - If water drops below 20%, apply drought stress (health -5 to -15 per day)

2. **Growth Progression (2.5x FASTER for testing)**:
   - Base growth rate: ~83% per stage for 3-stage crops, ~63% for 4-stage, ~50% for 5-stage (2.5x faster)
   - Boost growth by 10-30% if: water 60-90%, fertilizer >40%, soil >70%, temp optimal (18-25°C)
   - Reduce growth by 30-60% if: water <30%, fertilizer <20%, temp extreme (<10°C or >30°C)
   - Disease reduces growth by 40-70%

3. **Disease Dynamics**:
   - Base risk = 100 - diseaseResistance
   - Multiply risk by 2-3x in: high humidity, recent rain, temperatures 20-28°C
   - Disease spreads faster in dense plantings
   - Diseased crops: health decreases 3-10 per day, growth severely stunted

4. **Fertilizer Consumption**:
   - Active growing crops consume 3-8% fertilizer per day
   - Faster-growing crops (corn, tomato) consume more
   - Low fertilizer (<20%) reduces growth by 20-40%

5. **Soil Quality**:
   - Degrades slowly over time (0.5-1% per day with crops)
   - Improves slightly (+0.5-1%) in rainy conditions
   - Poor soil (<30%) reduces health and growth

6. **NASA Satellite Observations**:
   - SMAP: Soil moisture trends, irrigation recommendations
   - Landsat 8: NDVI crop health analysis, growth stage verification
   - MODIS: Temperature stress alerts, heat wave warnings
   - GPM: Precipitation forecasts, flood/drought risks
   - Provide 1-2 actionable insights based on active satellites

7. **Crop-Specific Insights**:
   - Comment on growth stage transitions (e.g., "Corn entering tasseling stage")
   - Note optimal/suboptimal conditions for each crop
   - Warn about crop-specific vulnerabilities (e.g., "Tomatoes at high blight risk in current humidity")

8. **Health Changes**:
   - Good conditions: +1 to +5 health per day
   - Disease: -3 to -10 health per day
   - Drought stress: -5 to -15 health per day
   - Temperature stress: -2 to -8 health per day
   - Optimal conditions can slowly heal unhealthy crops

BE REALISTIC:
- Not every day has major events
- Some crops just grow normally
- Create 0-3 alerts only for important events (disease outbreaks, severe weather, harvest readiness)
- Recommendations should be specific and actionable
- Account for the actual current state - don't make crops healthier if they're diseased!`
		});

		return object;
	} catch (error) {
		console.error('AI generation failed:', error);

		// Fallback to simple simulation
		return generateFallbackChanges(context, daysToAdvance);
	}
}

/**
 * Fallback simulation when AI is unavailable
 */
function generateFallbackChanges(context: GameContext, daysToAdvance: number): GameStateChanges {
	const isHotSeason = context.season === 'Summer';
	const baseTemp = context.recentWeather.temperature;

	return {
		weather: {
			temperature: baseTemp + (Math.random() * 4 - 2),
			precipitation: Math.random() * (isHotSeason ? 5 : 15),
			condition: (Math.random() > 0.7 ? 'rainy' : 'sunny') as 'sunny' | 'cloudy' | 'rainy' | 'stormy'
		},
		soilMoisture: Math.max(20, Math.min(80, 50 + (Math.random() * 40 - 20))),
		cropChanges: context.fields
			.filter((f) => f.cropType)
			.map((f) => {
				const waterReq = f.waterRequirement || 50;
				const tempStress = baseTemp > 30 || baseTemp < 10;
				const waterStress = f.waterLevel < 30;

				// Calculate water consumption based on crop needs and weather
				let waterChange = -(waterReq / 10) * daysToAdvance;
				if (baseTemp > 25) waterChange *= 1.3; // More water needed in heat

				// Calculate growth based on conditions
				let growthIncrease = 0;
				if (f.growth < 100 && !f.diseased && !waterStress) {
					// 2.5x faster growth for testing
					growthIncrease = (2 + Math.random() * 2) * daysToAdvance * 2.5;
					if (f.fertilizerLevel > 40) growthIncrease *= 1.2;
					if (tempStress) growthIncrease *= 0.5;
				}

				// Calculate health change
				let healthChange = 0;
				if (f.diseased) healthChange = -5 * daysToAdvance;
				else if (waterStress) healthChange = -3 * daysToAdvance;
				else if (tempStress) healthChange = -2 * daysToAdvance;
				else if (f.health < 100) healthChange = 1 * daysToAdvance;

				// Disease risk based on resistance
				const baseRisk = 100 - (f.diseaseResistance || 70);
				const diseaseRisk = Math.min(100, baseRisk * (isHotSeason ? 1.5 : 1));

				return {
					fieldId: f.id,
					growthIncrease,
					healthChange,
					diseaseRisk,
					waterLevelChange: waterChange,
					fertilizerLevelChange: f.growth < 100 ? -3 * daysToAdvance : -1 * daysToAdvance,
					soilQualityChange: -0.5 * daysToAdvance,
					needsAttention: f.waterLevel < 30 || f.diseased || f.health < 50,
					recommendation:
						f.waterLevel < 30
							? `${f.cropName || 'Crop'} needs water urgently`
							: f.diseased
								? `Treat disease on ${f.cropName || 'crop'} immediately`
								: f.fertilizerLevel < 20
									? `Apply fertilizer to boost ${f.cropName || 'crop'} growth`
									: f.health < 50
										? `${f.cropName || 'Crop'} health is poor, investigate conditions`
										: `${f.cropName || 'Crop'} is growing well, continue current care`,
					cropSpecificInsights:
						f.growth > 80 ? `${f.cropName || 'Crop'} approaching maturity` : undefined
				};
			}),
		alerts: [],
		nasaInsights: ['SMAP data shows normal soil moisture levels for the region']
	};
}
