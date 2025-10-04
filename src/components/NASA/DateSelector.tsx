'use client';

import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DateSelectorProps {
	selectedDay: number;
	onDateSelect: (day: number) => void;
}

export function DateSelector({ selectedDay, onDateSelect }: DateSelectorProps) {
	const { currentDay } = useGameStore();
	const [viewingWeek, setViewingWeek] = useState(Math.floor(currentDay / 7));

	const maxWeek = Math.floor(currentDay / 7);
	const minDay = Math.max(1, currentDay - 30); // Show last 30 days

	const canGoBack = viewingWeek > Math.floor(minDay / 7);
	const canGoForward = viewingWeek < maxWeek;

	const weekStart = viewingWeek * 7;
	const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i + 1).filter(
		(day) => day >= minDay && day <= currentDay
	);

	const getSeason = (day: number) => {
		const dayInYear = day % 120;
		if (dayInYear < 30) return 'Spring';
		if (dayInYear < 60) return 'Summer';
		if (dayInYear < 90) return 'Autumn';
		return 'Winter';
	};

	const getSeasonColor = (season: string) => {
		switch (season) {
			case 'Spring':
				return 'bg-green-100 text-green-700 border-green-300';
			case 'Summer':
				return 'bg-yellow-100 text-yellow-700 border-yellow-300';
			case 'Autumn':
				return 'bg-orange-100 text-orange-700 border-orange-300';
			case 'Winter':
				return 'bg-blue-100 text-blue-700 border-blue-300';
			default:
				return 'bg-gray-100 text-gray-700 border-gray-300';
		}
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Calendar className="text-muted-foreground h-4 w-4" />
					<span className="text-sm font-medium">Historical Data View</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setViewingWeek(viewingWeek - 1)}
						disabled={!canGoBack}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="text-muted-foreground px-2 text-xs">Week {viewingWeek + 1}</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setViewingWeek(viewingWeek + 1)}
						disabled={!canGoForward}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => {
							setViewingWeek(maxWeek);
							onDateSelect(currentDay);
						}}
						className="ml-2"
					>
						Today
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-2">
				{weekDays.map((day) => {
					const season = getSeason(day);
					const isSelected = day === selectedDay;
					const isToday = day === currentDay;

					return (
						<button
							key={day}
							onClick={() => onDateSelect(day)}
							className={`relative rounded-lg border-2 p-2 text-center transition-all hover:scale-105 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${isToday ? 'border-blue-500 shadow-md' : 'border-transparent'} ${getSeasonColor(season)} `}
						>
							<div className="text-xs font-medium">Day {day}</div>
							<div className="text-[10px] opacity-70">{season}</div>
							{isToday && (
								<div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
							)}
						</button>
					);
				})}
			</div>

			<div className="bg-muted rounded-lg p-3">
				<p className="text-muted-foreground text-xs">
					{selectedDay === currentDay ? (
						<>
							<span className="text-foreground font-medium">Current Day:</span> Showing real-time NASA
							satellite data
						</>
					) : (
						<>
							<span className="text-foreground font-medium">Day {selectedDay}:</span> Historical data from{' '}
							{currentDay - selectedDay} day
							{currentDay - selectedDay > 1 ? 's' : ''} ago
						</>
					)}
				</p>
			</div>
		</div>
	);
}
