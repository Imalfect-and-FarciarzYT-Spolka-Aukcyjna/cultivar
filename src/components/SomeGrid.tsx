'use client';
import { PLANT_TYPES } from '@/data/plants';
import { STORE_ITEMS } from '@/data/storeItems';
import { useGameStore } from '@/store/gameStore';
import { Field } from '@/types/field';
import type { TimeData, UserBalance, WeatherData } from '@/types/game';
import { Plant } from '@/types/plant';
import { Satellite, Store } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AlertCenter } from './GameUI/AlertCenter';
import { HexagonInfoPanel } from './GameUI/HexagonInfoPanel';
import { TimeControlTab } from './GameUI/TimeControlTab';
import { UserBalanceTab } from './GameUI/UserBalanceTab';
import { WeatherTab } from './GameUI/WeatherTab';
import { HexGrid } from './HexGrid';
import { NASADashboard } from './NASA/NASADashboard';
import { StoreModal } from './Store/StoreModal';
import { Button } from './ui/button';

// Generate more fields in a hex pattern
function generateFields(radius: number = 5): Field[] {
	const fields: Field[] = [];

	for (let q = -radius; q <= radius; q++) {
		const r1 = Math.max(-radius, -q - radius);
		const r2 = Math.min(radius, -q + radius);
		for (let r = r1; r <= r2; r++) {
			const id = `hex-${q}-${r}`;
			fields.push(new Field(id, q, r, false));
		}
	}

	return fields;
}

export default function HexPlace() {
	const {
		ownedFieldIds,
		money,
		currentDay,
		currentSeason,
		advanceDayWithAI,
		addAlert,
		recordHarvest,
		initializeFields,
		getField,
		updateField,
		fieldUpdateCounter
	} = useGameStore();

	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [storeOpen, setStoreOpen] = useState(false);
	const [nasaDashboardOpen, setNasaDashboardOpen] = useState(false);
	const [pendingAction, setPendingAction] = useState<'plant' | 'water' | 'fertilize' | null>(null);

	// Generate all fields on mount and initialize the store
	const [fields] = useState<Field[]>(() => {
		const generatedFields = generateFields(5);
		// Initialize fields in the store
		setTimeout(() => initializeFields(generatedFields), 0);
		return generatedFields;
	});

	// Sync ownership to store when it changes
	useEffect(() => {
		let hasChanges = false;
		fields.forEach((field) => {
			const isOwned = ownedFieldIds.has(field.id);
			const storeField = getField(field.id);
			if (storeField && storeField.owned !== isOwned) {
				storeField.owned = isOwned;
				hasChanges = true;
			}
		});
		// Only update if there were actual changes to prevent infinite loop
		if (hasChanges) {
			// Batch update by incrementing the counter
			const state = useGameStore.getState();
			useGameStore.setState({ fieldUpdateCounter: state.fieldUpdateCounter + 1 });
		}
	}, [ownedFieldIds, fields, getField]); // Removed updateField from deps

	// Update field ownership based on store AND sync back to store
	const fieldsWithOwnership = useMemo(() => {
		console.log('Syncing fields, updateCounter:', fieldUpdateCounter);
		const updatedFields = fields.map((field) => {
			const isOwned = ownedFieldIds.has(field.id);
			field.owned = isOwned;

			// Sync with store's field data
			const storeField = getField(field.id);
			if (storeField) {
				field.plant = storeField.plant;
				field.soilQuality = storeField.soilQuality;
				if (storeField.plant) {
					console.log(`Field ${field.id} has plant:`, storeField.plant.data.name);
				}
			}

			return field;
		});
		return updatedFields;
	}, [fields, ownedFieldIds, getField, fieldUpdateCounter]); // Re-run when fields update

	// Weather data
	const weatherData: WeatherData = {
		temperature: 23,
		humidity: 65,
		soilMoisture: 42,
		rainfall: 5.2,
		windSpeed: 12,
		uvIndex: 6
	};

	const userBalanceData: UserBalance = {
		coins: money,
		landOwned: ownedFieldIds.size
	};

	const [timeData, setTimeData] = useState<TimeData>({
		day: currentDay,
		month: 'October',
		year: 2025,
		hour: 14,
		season: currentSeason
	});

	const handleFieldSelect = (id: string) => {
		setSelectedFieldId(id);
	};

	const handleFieldDeselect = () => {
		setSelectedFieldId(null);
	};

	const handleAdvanceDay = async () => {
		await advanceDayWithAI();
		setTimeData((prev) => ({ ...prev, day: currentDay + 1 }));
	};

	const handleAdvanceWeek = async () => {
		// Make a single batched AI request for 7 days instead of 7 separate calls
		await advanceDayWithAI(7);
		setTimeData((prev) => ({ ...prev, day: currentDay + 7 }));
	};

	const handleAdvanceMonth = () => {
		setTimeData((prev) => ({ ...prev, day: 1, month: 'November' }));
	};

	const selectedField = fieldsWithOwnership.find((f) => f.id === selectedFieldId) ?? null;

	// Field actions
	const handlePlant = () => {
		setPendingAction('plant');
		setStoreOpen(true);
	};

	const handleWater = () => {
		setPendingAction('water');
		setStoreOpen(true);
	};

	const handleFertilize = () => {
		setPendingAction('fertilize');
		setStoreOpen(true);
	};

	const handleHarvest = () => {
		const storeField = getField(selectedFieldId!);
		if (!storeField?.plant) return;

		const plantName = storeField.plant.data.name;
		const value = storeField.plant.harvestValue;
		recordHarvest(value, storeField.id);
		storeField.harvest();
		updateField(storeField.id, storeField);
		addAlert('success', `Harvested ${plantName} for $${value}! 🎉`);
	};

	const handleClear = () => {
		const storeField = getField(selectedFieldId!);
		if (!storeField) return;
		storeField.plant = null;
		updateField(storeField.id, storeField);
		addAlert('info', 'Field cleared');
	};

	// Store purchases
	const handlePurchaseSeed = (plantId: string) => {
		const storeField = getField(selectedFieldId!);
		if (!storeField || pendingAction !== 'plant') {
			console.error('Cannot plant:', { storeField, pendingAction, selectedFieldId });
			return;
		}

		const plantData = Object.values(PLANT_TYPES).find((p) => p.id === plantId);
		if (!plantData) {
			console.error('Plant data not found:', plantId);
			return;
		}

		console.log('Planting:', {
			plantId,
			plantData,
			fieldId: storeField.id,
			isEmpty: storeField.isEmpty,
			owned: storeField.owned
		});

		const plant = new Plant(plantData);
		if (storeField.plantCrop(plant)) {
			updateField(storeField.id, storeField);
			console.log('Plant added to field, updated store');
			addAlert('success', `Planted ${plantData.name}! 🌱`);
			setStoreOpen(false);
			setPendingAction(null);
		} else {
			console.error('Failed to plant crop', {
				isEmpty: storeField.isEmpty,
				owned: storeField.owned,
				plant: storeField.plant
			});
		}
	};

	const handlePurchaseItem = (itemId: string) => {
		const storeField = getField(selectedFieldId!);
		if (!storeField) return;

		const item = Object.values(STORE_ITEMS).find((i) => i.id === itemId);
		if (!item || !item.effect) return;

		// Apply effects
		if (item.effect.water && storeField.plant) {
			storeField.plant.water(item.effect.water);
			addAlert('success', `Watered crop! 💧`);
		}

		if (item.effect.fertilizer) {
			if (storeField.plant) {
				storeField.plant.fertilize(item.effect.fertilizer);
			}
			storeField.fertilizeSoil(item.effect.fertilizer / 2);
			addAlert('success', `Applied fertilizer! 🌱`);
		}

		if (item.effect.cureDisease && storeField.plant?.diseased) {
			storeField.plant.cureDisease();
			if (item.effect.health) {
				storeField.plant.heal(item.effect.health);
			}
			addAlert('success', `Cured disease! 🍃`);
		}

		updateField(storeField.id, storeField);
		setStoreOpen(false);
		setPendingAction(null);
	};

	return (
		<div className="relative h-full w-full">
			{/* Left sidebar */}
			<div className="pointer-events-none absolute left-4 top-4 z-10 flex w-80 flex-col gap-4">
				<div className="pointer-events-auto">
					<WeatherTab data={weatherData} />
				</div>
				<div className="pointer-events-auto">
					<UserBalanceTab data={userBalanceData} />
				</div>
				<div className="pointer-events-auto">
					<TimeControlTab
						data={timeData}
						onAdvanceDay={handleAdvanceDay}
						onAdvanceWeek={handleAdvanceWeek}
						onAdvanceMonth={handleAdvanceMonth}
					/>
				</div>

				<Button
					onClick={() => setNasaDashboardOpen(true)}
					className="pointer-events-auto w-full"
					size="lg"
					variant="secondary"
				>
					<Satellite className="mr-2 h-5 w-5" />
					NASA Data
				</Button>

				<Button onClick={() => setStoreOpen(true)} className="pointer-events-auto w-full" size="lg">
					<Store className="mr-2 h-5 w-5" />
					Open Store
				</Button>

				{/* Alert Center Button */}
				<AlertCenter />
			</div>

			{/* Right sidebar - Field info panel */}
			<HexagonInfoPanel
				field={selectedField}
				onClose={handleFieldDeselect}
				onPlant={handlePlant}
				onWater={handleWater}
				onFertilize={handleFertilize}
				onHarvest={handleHarvest}
				onClear={handleClear}
			/>

			{/* NASA Dashboard */}
			<NASADashboard open={nasaDashboardOpen} onClose={() => setNasaDashboardOpen(false)} />

			{/* Store Modal */}
			<StoreModal
				open={storeOpen}
				onClose={() => {
					setStoreOpen(false);
					setPendingAction(null);
				}}
				onPurchaseSeed={handlePurchaseSeed}
				onPurchaseItem={handlePurchaseItem}
			/>

			{/* Main hex grid */}
			<HexGrid
				fields={fieldsWithOwnership}
				size={10}
				initialScale={1}
				minScale={0.5}
				maxScale={8}
				onHexagonSelect={handleFieldSelect}
				onHexagonDeselect={handleFieldDeselect}
			/>
		</div>
	);
}
