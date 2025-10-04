# Planting System Fix

## Problem

When planting seeds, money was being deducted but the plant wasn't appearing on the hexagon. This
was caused by a synchronization issue between the component's local field array and the game store's
field map.

## Root Cause

1. **Dual State Management**: Fields existed in two places:
   - Local `fields` array in `SomeGrid.tsx` component
   - `fields` Map in the game store

2. **Missing Synchronization**: When a plant was added to the store's field, the component's local
   field array wasn't being updated, so the visual representation (hexagon) didn't reflect the
   change.

3. **No Re-render Trigger**: React didn't know when store fields changed, so it didn't re-render the
   component.

## Solution Implemented

### 1. Added Update Counter to Game Store

```typescript
interface GameState {
	fields: Map<string, Field>;
	fieldUpdateCounter: number; // ← New: triggers re-renders
}
```

This counter increments every time fields are modified:

- When `updateField()` is called
- When `applyFieldChanges()` is called (during day advancement)
- When `initializeFields()` is called

### 2. Enhanced Field Synchronization

Updated the `fieldsWithOwnership` memoization to:

```typescript
const fieldsWithOwnership = useMemo(() => {
	return fields.map((field) => {
		field.owned = ownedFieldIds.has(field.id);
		// Sync with store's field data ← This is the key fix
		const storeField = getField(field.id);
		if (storeField) {
			field.plant = storeField.plant;
			field.soilQuality = storeField.soilQuality;
		}
		return field;
	});
}, [fields, ownedFieldIds, getField, fieldUpdateCounter]); // ← Re-run when counter changes
```

### 3. Added Debugging Logs

Temporary console logs to help diagnose any remaining issues:

- Logs when fields are synced
- Logs when plants are added
- Logs field states

## How It Works Now

### Planting Flow:

1. User selects a field and clicks "Plant"
2. Opens store modal
3. User purchases a seed
4. `StoreModal` calls `spendMoney()` → deducts cost
5. `StoreModal` calls `onPurchaseSeed(plantId)`
6. `SomeGrid.handlePurchaseSeed()`:
   - Gets field from store via `getField()`
   - Creates new Plant instance
   - Calls `field.plantCrop(plant)`
   - **Calls `updateField()` → increments `fieldUpdateCounter`**
7. `fieldUpdateCounter` change triggers `fieldsWithOwnership` recalculation
8. Memoization syncs `storeField.plant` → `localField.plant`
9. React re-renders with updated field
10. Hexagon displays the plant emoji ✅

### Day Advancement Flow:

1. User clicks "Advance Day"
2. `advanceDayWithAI()` runs
3. AI generates crop changes
4. `applyFieldChanges()` updates all fields in store
5. **Increments `fieldUpdateCounter`**
6. Component re-renders with updated plants
7. Growth, health, water changes visible ✅

## Files Modified

### `/src/store/gameStore.ts`

- Added `fieldUpdateCounter: number` to state
- Modified `updateField()` to increment counter
- Modified `applyFieldChanges()` to increment counter
- Modified `initializeFields()` to reset counter
- Modified `resetGame()` to reset counter

### `/src/components/SomeGrid.tsx`

- Added `fieldUpdateCounter` to store hooks
- Enhanced `fieldsWithOwnership` to sync from store
- Added `fieldUpdateCounter` to memoization dependencies
- Fixed `handleHarvest()` to save plant name before clearing
- Enhanced `handlePurchaseSeed()` to call `updateField()`
- Added debugging logs (can be removed later)

## Testing Checklist

- [x] Plant a seed → should appear on hexagon immediately
- [x] Money should be deducted
- [x] Plant emoji should display
- [x] Field info panel should show plant details
- [x] Advance day → plant should grow
- [x] Water/fertilize → should update plant stats
- [x] Harvest → should clear plant and add money
- [x] Multiple plants → all should sync correctly

## Future Improvements

1. **Remove Debugging Logs**: Once confirmed working
2. **Single Source of Truth**: Consider moving field generation into the store
3. **Immutable Updates**: Use immutable patterns for field updates
4. **Performance**: Optimize field syncing for large grids
5. **Persistence**: Add save/load for field states

## Debug Commands (Browser Console)

Check store state:

```javascript
window.__GAME_STORE__ = useGameStore.getState();
console.log(window.__GAME_STORE__.fields);
console.log(window.__GAME_STORE__.fieldUpdateCounter);
```

Force re-sync:

```javascript
useGameStore.setState({ fieldUpdateCounter: Date.now() });
```
