'use client';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MoneyDisplayProps {
	amount: number;
}

export function MoneyDisplay({ amount }: MoneyDisplayProps) {
	const spring = useSpring(amount, { stiffness: 100, damping: 30 });
	const display = useTransform(spring, (current) => `$${Math.round(current)}`);

	useEffect(() => {
		spring.set(amount);
	}, [amount, spring]);

	return (
		<Card className="pointer-events-auto">
			<CardContent className="p-4">
				<div className="flex items-center gap-3">
					<motion.div
						animate={{
							rotate: [0, 10, -10, 0],
							scale: [1, 1.1, 1]
						}}
						transition={{
							duration: 0.5,
							repeat: 0
						}}
						key={amount} // Re-trigger animation on change
					>
						<Coins className="h-6 w-6 text-yellow-600" />
					</motion.div>
					<div>
						<p className="text-xs text-muted-foreground">Balance</p>
						<motion.p className="text-xl font-bold">{display}</motion.p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
