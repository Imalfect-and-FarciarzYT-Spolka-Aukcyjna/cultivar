'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PLANT_TYPES } from '@/data/plants';
import { STORE_ITEMS } from '@/data/storeItems';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface StoreModalProps {
	open: boolean;
	onClose: () => void;
	onPurchaseSeed?: (plantId: string) => void;
	onPurchaseItem?: (itemId: string) => void;
}

export function StoreModal({ open, onClose, onPurchaseSeed, onPurchaseItem }: StoreModalProps) {
	const { money, spendMoney } = useGameStore();
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	const handlePurchaseSeed = (plantId: string, cost: number) => {
		if (spendMoney(cost)) {
			onPurchaseSeed?.(plantId);
		}
	};

	const handlePurchaseItem = (itemId: string, cost: number) => {
		if (spendMoney(cost)) {
			onPurchaseItem?.(itemId);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl">
						<Sparkles className="h-6 w-6" />
						Farm Store
					</DialogTitle>
					<DialogDescription>
						Purchase seeds and supplies for your farm. Current balance:{' '}
						<span className="font-bold">${money}</span>
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="seeds" className="mt-4">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="seeds">🌱 Seeds</TabsTrigger>
						<TabsTrigger value="supplies">💧 Supplies</TabsTrigger>
						<TabsTrigger value="treatment">🌿 Treatment</TabsTrigger>
					</TabsList>

					<TabsContent value="seeds" className="mt-4 space-y-3">
						<div className="grid gap-3">
							{Object.values(PLANT_TYPES).map((plant) => (
								<motion.div
									key={plant.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									whileHover={{ scale: 1.02 }}
									onHoverStart={() => setHoveredItem(plant.id)}
									onHoverEnd={() => setHoveredItem(null)}
									className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
								>
									<div className="flex items-center gap-4">
										<motion.div
											animate={{
												scale: hoveredItem === plant.id ? 1.2 : 1,
												rotate: hoveredItem === plant.id ? [0, -10, 10, 0] : 0
											}}
											transition={{ duration: 0.3 }}
											className="text-4xl"
										>
											{plant.emoji}
										</motion.div>
										<div className="flex-1">
											<h3 className="font-semibold">{plant.name}</h3>
											<div className="mt-1 flex gap-2">
												<Badge variant="secondary" className="text-xs">
													{plant.growthStages} stages
												</Badge>
												<Badge variant="secondary" className="text-xs">
													💰 Sells for ${plant.marketValue}
												</Badge>
											</div>
											<div className="text-muted-foreground mt-2 space-y-1 text-xs">
												<div>💧 Water: {plant.waterRequirement}/day</div>
												<div>🛡️ Disease Resistance: {plant.diseaseResistance}%</div>
											</div>
										</div>
									</div>
									<Button
										onClick={() => handlePurchaseSeed(plant.id, plant.seedCost)}
										disabled={money < plant.seedCost}
										className="ml-4"
									>
										${plant.seedCost}
									</Button>
								</motion.div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="supplies" className="mt-4 space-y-3">
						<div className="grid gap-3">
							{Object.values(STORE_ITEMS)
								.filter((item) => item.type === 'water' || item.type === 'fertilizer')
								.map((item) => (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										whileHover={{ scale: 1.02 }}
										onHoverStart={() => setHoveredItem(item.id)}
										onHoverEnd={() => setHoveredItem(null)}
										className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
									>
										<div className="flex flex-1 items-center gap-4">
											<motion.div
												animate={{
													scale: hoveredItem === item.id ? 1.2 : 1,
													y: hoveredItem === item.id ? [0, -5, 0] : 0
												}}
												transition={{ duration: 0.5, repeat: hoveredItem === item.id ? Infinity : 0 }}
												className="text-4xl"
											>
												{item.emoji}
											</motion.div>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold">{item.name}</h3>
													{item.educationalTip && (
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Info className="text-muted-foreground h-4 w-4 cursor-help" />
																</TooltipTrigger>
																<TooltipContent className="max-w-xs">
																	<p className="text-xs">{item.educationalTip}</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)}
												</div>
												<p className="text-muted-foreground mt-1 text-xs">{item.description}</p>
											</div>
										</div>
										<Button
											onClick={() => handlePurchaseItem(item.id, item.price)}
											disabled={money < item.price}
											className="ml-4"
										>
											${item.price}
										</Button>
									</motion.div>
								))}
						</div>
					</TabsContent>

					<TabsContent value="treatment" className="mt-4 space-y-3">
						<div className="grid gap-3">
							{Object.values(STORE_ITEMS)
								.filter((item) => item.type === 'pesticide')
								.map((item) => (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										whileHover={{ scale: 1.02 }}
										onHoverStart={() => setHoveredItem(item.id)}
										onHoverEnd={() => setHoveredItem(null)}
										className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
									>
										<div className="flex flex-1 items-center gap-4">
											<motion.div
												animate={{
													scale: hoveredItem === item.id ? 1.2 : 1,
													rotate: hoveredItem === item.id ? [0, 360] : 0
												}}
												transition={{ duration: 0.6 }}
												className="text-4xl"
											>
												{item.emoji}
											</motion.div>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h3 className="font-semibold">{item.name}</h3>
													{item.educationalTip && (
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Info className="text-muted-foreground h-4 w-4 cursor-help" />
																</TooltipTrigger>
																<TooltipContent className="max-w-xs">
																	<p className="text-xs">{item.educationalTip}</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)}
												</div>
												<p className="text-muted-foreground mt-1 text-xs">{item.description}</p>
											</div>
										</div>
										<Button
											onClick={() => handlePurchaseItem(item.id, item.price)}
											disabled={money < item.price}
											className="ml-4"
										>
											${item.price}
										</Button>
									</motion.div>
								))}
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
