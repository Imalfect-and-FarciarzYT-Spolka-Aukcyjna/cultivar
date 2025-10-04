'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Field } from '@/types/field';
import { useGameStore } from '@/store/gameStore';
import { ShoppingCart, Sprout, Droplets, Leaf, Trash2 } from 'lucide-react';

interface FieldActionsProps {
	field: Field;
	onPlant: () => void;
	onWater: () => void;
	onFertilize: () => void;
	onHarvest: () => void;
	onClear: () => void;
}

export function FieldActions({
	field,
	onPlant,
	onWater,
	onFertilize,
	onHarvest,
	onClear
}: FieldActionsProps) {
	const { purchaseField, money } = useGameStore();

	if (!field.owned) {
		const canAfford = money >= field.purchasePrice;

		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="space-y-3"
			>
				<div className="rounded-lg border bg-card p-4 text-center">
					<p className="text-sm text-muted-foreground">Unowned Field</p>
					<p className="text-2xl font-bold mt-1">${field.purchasePrice}</p>
				</div>
				<Button
					onClick={() => purchaseField(field.id, field.purchasePrice)}
					disabled={!canAfford}
					className="w-full"
					size="lg"
				>
					<ShoppingCart className="mr-2 h-4 w-4" />
					{canAfford ? 'Purchase Field' : 'Not Enough Money'}
				</Button>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-2"
		>
			{field.isEmpty ? (
				<Button onClick={onPlant} className="w-full" size="lg">
					<Sprout className="mr-2 h-4 w-4" />
					Plant Crop
				</Button>
			) : (
				<>
					{field.plant?.isFullyGrown ? (
						<Button onClick={onHarvest} className="w-full" size="lg" variant="default">
							<Leaf className="mr-2 h-4 w-4" />
							Harvest (${field.plant.harvestValue})
						</Button>
					) : (
						<div className="grid grid-cols-2 gap-2">
							<Button onClick={onWater} size="sm" variant="outline">
								<Droplets className="mr-1 h-3 w-3" />
								Water
							</Button>
							<Button onClick={onFertilize} size="sm" variant="outline">
								<Leaf className="mr-1 h-3 w-3" />
								Fertilize
							</Button>
						</div>
					)}
					<Button onClick={onClear} className="w-full" size="sm" variant="destructive">
						<Trash2 className="mr-2 h-3 w-3" />
						Clear Field
					</Button>
				</>
			)}
		</motion.div>
	);
}
