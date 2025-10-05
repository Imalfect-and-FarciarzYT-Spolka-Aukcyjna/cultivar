'use client';
import { InfoCard } from '@/components/GameUI/UI/InfoCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { TimeData } from '@/types/game';
import { Calendar, ChevronRight, Clock, Loader2 } from 'lucide-react';

interface TimeControlTabProps {
	data: TimeData;
	onAdvanceDay?: () => void;
	onAdvanceWeek?: () => void;
	onAdvanceMonth?: () => void;
	isLoading?: boolean;
}

export function TimeControlTab({
	data,
	onAdvanceDay,
	onAdvanceWeek,
	onAdvanceMonth,
	isLoading = false
}: TimeControlTabProps) {
	return (
		<InfoCard title="Time">
			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Calendar className="text-muted-foreground h-4 w-4" />
						<span className="text-sm font-medium">
							{data.month} {data.day}, {data.year}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="text-muted-foreground h-4 w-4" />
						<span className="text-sm font-medium">{data.hour}:00</span>
						<span className="text-muted-foreground ml-auto text-xs">{data.season}</span>
					</div>
				</div>

				<Separator />

				<div className="space-y-2">
					<p className="text-muted-foreground mb-2 text-xs">Advance Time</p>
					<div className="grid grid-cols-3 gap-2">
						<Button variant="default" size="sm" onClick={onAdvanceDay} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<ChevronRight className="h-3 w-3" />
							)}
							<span className="text-xs">Day</span>
						</Button>
						<Button variant="default" size="sm" onClick={onAdvanceWeek} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="h-3 w-3 animate-spin" />
							) : (
								<ChevronRight className="h-3 w-3" />
							)}
							<span className="text-xs">Week</span>
						</Button>
						<Button variant="default" size="sm" onClick={onAdvanceMonth} disabled={isLoading}>
							<ChevronRight className="h-3 w-3" />
							<span className="text-xs">Month</span>
						</Button>
					</div>
				</div>
			</div>
		</InfoCard>
	);
}
