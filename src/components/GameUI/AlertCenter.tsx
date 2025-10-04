'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { AlertCircle, Bell, CheckCircle, Info, Satellite, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export function AlertCenter() {
	const { alerts, currentDay, dismissAlert, clearAlerts } = useGameStore();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);

	// Group alerts by day
	const alertsByDay = useMemo(() => {
		const grouped = new Map<number, typeof alerts>();

		alerts.forEach((alert) => {
			// Alerts now have a day property
			const day = alert.day;
			if (!grouped.has(day)) {
				grouped.set(day, []);
			}
			grouped.get(day)!.push(alert);
		});

		// Sort days in descending order (newest first)
		return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
	}, [alerts]);

	const unreadCount = alerts.length;

	const getAlertIcon = (type: string) => {
		switch (type) {
			case 'warning':
				return <AlertCircle className="h-4 w-4 text-yellow-500" />;
			case 'success':
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case 'nasa_insight':
				return <Satellite className="h-4 w-4 text-blue-500" />;
			default:
				return <Info className="h-4 w-4 text-blue-400" />;
		}
	};

	const getAlertColor = (type: string) => {
		switch (type) {
			case 'warning':
				return 'border-l-4 border-l-yellow-500 bg-yellow-500/5';
			case 'success':
				return 'border-l-4 border-l-green-500 bg-green-500/5';
			case 'nasa_insight':
				return 'border-l-4 border-l-blue-500 bg-blue-500/5';
			default:
				return 'border-l-4 border-l-blue-400 bg-blue-400/5';
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<motion.div
					className="pointer-events-auto relative"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Button variant="secondary" size="lg" className="relative w-full">
						<Bell className="h-5 w-5" />
						{unreadCount > 0 && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
							>
								{unreadCount > 9 ? '9+' : unreadCount}
							</motion.div>
						)}
					</Button>
				</motion.div>
			</SheetTrigger>

			<SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[540px]">
				<SheetHeader className="border-b p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5" />
							<SheetTitle>Alert Center</SheetTitle>
							<span className="bg-muted rounded-full px-2 py-0.5 text-xs">{unreadCount} new</span>
						</div>
						{alerts.length > 0 && (
							<Button onClick={clearAlerts} variant="ghost" size="sm" className="h-8 text-xs">
								Clear All
							</Button>
						)}
					</div>
				</SheetHeader>

				{/* Day Filter */}
				<div className="border-b p-3">
					<ScrollArea className="w-full">
						<div className="flex gap-2 pb-2">
							<Button
								onClick={() => setSelectedDay(null)}
								variant={selectedDay === null ? 'default' : 'outline'}
								size="sm"
								className="whitespace-nowrap"
							>
								All Days
							</Button>
							{Array.from(alertsByDay.keys()).map((day) => (
								<Button
									key={day}
									onClick={() => setSelectedDay(day)}
									variant={selectedDay === day ? 'default' : 'outline'}
									size="sm"
									className="whitespace-nowrap"
								>
									Day {day}
									<span className="bg-muted ml-1.5 rounded-full px-1.5 text-xs">
										{alertsByDay.get(day)?.length}
									</span>
								</Button>
							))}
						</div>
					</ScrollArea>
				</div>

				{/* Alerts List */}
				<ScrollArea className="flex-1">
					<div className="space-y-4 p-4">
						{alerts.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Bell className="text-muted-foreground mb-3 h-12 w-12 opacity-50" />
								<p className="text-muted-foreground text-sm">No alerts yet</p>
								<p className="text-muted-foreground mt-1 text-xs">Alerts will appear here as you play</p>
							</div>
						) : (
							Array.from(alertsByDay.entries()).map(([day, dayAlerts]) => {
								if (selectedDay !== null && selectedDay !== day) return null;

								return (
									<div key={day} className="space-y-2">
										<div className="bg-background/95 sticky top-0 -mx-4 px-4 py-2 backdrop-blur-sm">
											<h3 className="text-muted-foreground text-sm font-semibold">
												Day {day} {day === currentDay && '(Today)'}
											</h3>
											<Separator className="mt-2" />
										</div>

										{dayAlerts.map((alert) => (
											<motion.div
												key={alert.id}
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												className={`group relative rounded-lg p-3 transition-all hover:shadow-md ${getAlertColor(
													alert.type
												)}`}
											>
												<div className="flex items-start gap-3">
													<div className="mt-0.5">{getAlertIcon(alert.type)}</div>
													<div className="flex-1 space-y-1">
														<p className="text-sm leading-relaxed">{alert.message}</p>
														{alert.dataSource && (
															<p className="text-muted-foreground text-xs">Source: {alert.dataSource}</p>
														)}
														{alert.fieldId && (
															<p className="text-muted-foreground text-xs">Field: {alert.fieldId}</p>
														)}
													</div>
													<Button
														onClick={() => dismissAlert(alert.id)}
														variant="ghost"
														size="icon"
														className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</motion.div>
										))}
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>

				{/* Footer Stats */}
				<div className="bg-muted/50 border-t p-3">
					<div className="grid grid-cols-3 gap-2 text-center text-xs">
						<div>
							<div className="text-muted-foreground font-semibold">Total</div>
							<div className="text-lg font-bold">{alerts.length}</div>
						</div>
						<div>
							<div className="text-muted-foreground font-semibold">Days</div>
							<div className="text-lg font-bold">{alertsByDay.size}</div>
						</div>
						<div>
							<div className="text-muted-foreground font-semibold">Current Day</div>
							<div className="text-lg font-bold">{currentDay}</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
