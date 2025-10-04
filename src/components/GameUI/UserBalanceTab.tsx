'use client';
import { InfoCard } from '@/components/GameUI/UI/InfoCard';
import { Badge } from '@/components/ui/badge';
import type { UserBalance } from '@/types/game';
import { Coins, MapPin } from 'lucide-react';

interface UserBalanceTabProps {
	data: UserBalance;
}

export function UserBalanceTab({ data }: UserBalanceTabProps) {
	return (
		<InfoCard title="Balance">
			<div className="space-y-3">
				<div className="flex items-center justify-between rounded-lg border p-3">
					<div className="flex items-center gap-3">
						<Coins className="h-5 w-5" />
						<div>
							<p className="text-muted-foreground text-xs">Coins</p>
							<p className="text-xl font-bold">{data.coins.toLocaleString()}</p>
						</div>
					</div>
					<Badge variant="secondary">Currency</Badge>
				</div>

				<div className="flex items-center justify-between rounded-lg border p-3">
					<div className="flex items-center gap-3">
						<MapPin className="h-5 w-5" />
						<div>
							<p className="text-muted-foreground text-xs">Land Owned</p>
							<p className="text-xl font-bold">{data.landOwned}</p>
						</div>
					</div>
					<Badge variant="secondary">Hexagons</Badge>
				</div>
			</div>
		</InfoCard>
	);
}
