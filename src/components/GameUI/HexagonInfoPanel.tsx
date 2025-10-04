'use client';
import { FieldActions } from '@/components/GameUI/UI/FieldActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Field } from '@/types/field';
import { AlertCircle, X } from 'lucide-react';

interface HexagonInfoPanelProps {
	field: Field | null;
	onClose?: () => void;
	onPlant: () => void;
	onWater: () => void;
	onFertilize: () => void;
	onHarvest: () => void;
	onClear: () => void;
}

export function HexagonInfoPanel({
	field,
	onClose,
	onPlant,
	onWater,
	onFertilize,
	onHarvest,
	onClear
}: HexagonInfoPanelProps) {
	if (!field) return null;

	return (
		<div className="pointer-events-none absolute top-4 right-4 z-20 w-80">
			<Card className="pointer-events-auto shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
					<CardTitle className="text-base font-semibold">Field {field.id}</CardTitle>
					{onClose && (
						<Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					)}
				</CardHeader>
				<CardContent className="space-y-3">
					{/* Coordinates */}
					<div>
						<p className="text-muted-foreground text-xs">Coordinates</p>
						<p className="text-sm">
							q={field.coordinates.q}, r={field.coordinates.r}, s={field.coordinates.s}
						</p>
					</div>

					{field.owned && (
						<>
							<div>
								<p className="text-muted-foreground text-xs">Soil Quality</p>
								<Progress value={field.soilQuality} className="mt-1" />
								<p className="mt-1 text-right text-xs">{Math.round(field.soilQuality)}%</p>
							</div>
						</>
					)}

					<Separator />

					{/* Plant Info */}
					{field.plant ? (
						<>
							<div className="flex items-center gap-3">
								<span className="text-4xl">{field.plant.emoji}</span>
								<div className="flex-1">
									<p className="font-semibold">{field.plant.data.name}</p>
									<div className="mt-1 flex gap-1">
										<Badge variant="secondary" className="text-xs">
											Growing
										</Badge>
										{field.plant.diseased && (
											<Badge variant="destructive" className="text-xs">
												<AlertCircle className="mr-1 h-3 w-3" />
												Diseased
											</Badge>
										)}
									</div>
								</div>
							</div>

							<div>
								<div className="mb-1 flex justify-between text-xs">
									<span className="text-muted-foreground">Growth</span>
									<span className="font-medium">
										{field.plant.currentGrowthStage}/{field.plant.data.growthStages}
									</span>
								</div>
								<Progress value={field.plant.growthPercentage} />
							</div>

							<div>
								<div className="mb-1 flex justify-between text-xs">
									<span className="text-muted-foreground">Health</span>
									<span className="font-medium">{Math.round(field.plant.health)}%</span>
								</div>
								<Progress value={field.plant.health} />
							</div>

							<div className="grid grid-cols-2 gap-2">
								<div>
									<p className="text-muted-foreground text-xs">Water</p>
									<Progress value={field.plant.waterLevel} className="mt-1 h-2" />
									<p className="text-right text-xs">{Math.round(field.plant.waterLevel)}%</p>
								</div>
								<div>
									<p className="text-muted-foreground text-xs">Fertilizer</p>
									<Progress value={field.plant.fertilizerLevel} className="mt-1 h-2" />
									<p className="text-right text-xs">{Math.round(field.plant.fertilizerLevel)}%</p>
								</div>
							</div>

							{field.plant.isFullyGrown && (
								<Badge variant="default" className="w-full justify-center">
									Ready to Harvest! 🎉
								</Badge>
							)}

							{(field.plant.needsWater || field.plant.needsFertilizer) && (
								<div className="rounded-md bg-yellow-50 p-2 text-xs dark:bg-yellow-950">
									{field.plant.needsWater && <div>💧 Needs water</div>}
									{field.plant.needsFertilizer && <div>🌱 Could use fertilizer</div>}
								</div>
							)}
						</>
					) : field.owned ? (
						<div className="rounded-lg border p-4 text-center">
							<p className="text-muted-foreground text-sm">Empty Field</p>
							<p className="text-muted-foreground text-xs">Ready to plant</p>
						</div>
					) : null}

					<Separator />

					{/* Actions */}
					<FieldActions
						field={field}
						onPlant={onPlant}
						onWater={onWater}
						onFertilize={onFertilize}
						onHarvest={onHarvest}
						onClear={onClear}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
