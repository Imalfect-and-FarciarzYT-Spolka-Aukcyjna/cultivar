# Final Planting Fix - Proper Zustand Usage

## The Real Problem

You were RIGHT - Zustand IS reactive by default with hooks. The problem was:

1. **Field Ownership Not Synced**: When fields were initialized in the store, they had
   `owned: false` even for starting fields
2. **plantCrop() Method Check**: The `Field.plantCrop()` method returns `false` if `!this.owned`
3. **Missing Ownership Sync**: The store's fields never got their `owned` property updated

## Why It Failed

```typescript
// Field.plantCrop() in field.ts
plantCrop(plant: Plant): boolean {
	if (!this.isEmpty || !this.owned) return false; // ← This check failed!
	this.plant = plant;
	return true;
}
```

Even though `ownedFieldIds` contained the field ID, the actual Field object in the store had
`owned: false`.

## The Fix

### 1. Initialize Fields with Correct Ownership

```typescript
// In gameStore.ts - initializeFields
initializeFields: (fieldsList) => {
	const state = get();
	const fieldsMap = new Map<string, Field>();
	fieldsList.forEach((field) => {
		// ← KEY FIX: Set ownership based on ownedFieldIds
		field.owned = state.ownedFieldIds.has(field.id);
		fieldsMap.set(field.id, field);
	});
	set({ fields: fieldsMap, fieldUpdateCounter: 0 });
};
```

### 2. Update Ownership When Purchasing Fields

```typescript
// In gameStore.ts - purchaseField
purchaseField: (fieldId, price) => {
	const field = state.fields.get(fieldId);
	if (field) {
		field.owned = true; // ← Update the field object
	}
	set({
		ownedFieldIds: new Set([...state.ownedFieldIds, fieldId]),
		fieldUpdateCounter: state.fieldUpdateCounter + 1
	});
};
```

### 3. Sync Ownership Reactively in Component

```typescript
// In SomeGrid.tsx - useEffect to keep ownership in sync
useEffect(() => {
	fields.forEach((field) => {
		const isOwned = ownedFieldIds.has(field.id);
		const storeField = getField(field.id);
		if (storeField && storeField.owned !== isOwned) {
			storeField.owned = isOwned;
			updateField(field.id, storeField);
		}
	});
}, [ownedFieldIds, fields, getField, updateField]);
```

### 4. Proper Field Cloning for Zustand Reactivity

```typescript
// In gameStore.ts - updateField
updateField: (fieldId, field) => {
	set((state) => {
		const newFields = new Map(state.fields);
		// Create a copy to ensure Zustand detects the change
		const fieldCopy = Object.assign(Object.create(Object.getPrototypeOf(field)), field);
		newFields.set(fieldId, fieldCopy);
		return {
			fields: newFields,
			fieldUpdateCounter: state.fieldUpdateCounter + 1
		};
	});
};
```

## How Zustand Reactivity Works

Zustand detects changes by comparing the STATE OBJECT, not the contents:

### ✅ This triggers re-render:

```typescript
set({ fields: new Map(fields) }); // New Map object
set({ fieldUpdateCounter: counter + 1 }); // New value
```

### ❌ This does NOT trigger re-render:

```typescript
const field = fields.get('id');
field.plant = newPlant; // Mutating existing object
// No set() call = no re-render
```

## The Flow Now

```
1. User clicks Plant button
2. Opens store modal (pendingAction = 'plant')
3. User buys seed → money deducted ✅
4. handlePurchaseSeed called with plantId
5. Gets field from store via getField()
   → Field has owned: true ✅ (from initializeFields or purchaseField)
6. Creates Plant instance
7. Calls field.plantCrop(plant)
   → Checks: !isEmpty ✅, owned ✅
   → Sets field.plant = plant ✅
   → Returns true ✅
8. Calls updateField(fieldId, field)
   → Creates field copy
   → Updates Map
   → Increments fieldUpdateCounter
   → Triggers Zustand update ✅
9. Component re-renders (fieldUpdateCounter changed)
10. fieldsWithOwnership recalculates
11. Syncs storeField.plant → localField.plant
12. Hexagon displays plant emoji ✅
```

## Key Takeaways

1. **Zustand IS reactive** - but only to state object changes, not mutations
2. **Always create new objects** when updating (Maps, Arrays, etc.)
3. **Use counters** to force re-renders when needed
4. **Sync derived state** (like ownership) properly
5. **Clone objects** that you mutate to ensure Zustand sees the change

## Testing

Try this:

1. Start game - some fields should be owned
2. Select an owned field
3. Click "Plant"
4. Buy a seed
5. Check console for: "Planting: { owned: true }"
6. Plant should appear on hexagon immediately

If "owned: false" appears, the useEffect hasn't run yet - refresh and try again.
