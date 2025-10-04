'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Satellite, X } from 'lucide-react';

export function AlertsPanel() {
	const { alerts, dismissAlert } = useGameStore();

	const getIcon = (type: 'warning' | 'info' | 'success' | 'nasa_insight') => {
		switch (type) {
			case 'warning':
				return <AlertTriangle className="h-4 w-4" />;
			case 'success':
				return <CheckCircle className="h-4 w-4" />;
			case 'nasa_insight':
				return <Satellite className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
	};

	const getVariant = (type: 'warning' | 'info' | 'success' | 'nasa_insight') => {
		return type === 'warning' ? 'destructive' : 'default';
	};

	if (alerts.length === 0) return null;

	return (
		<div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[32rem] max-w-[calc(100vw-2rem)] space-y-2">
			<AnimatePresence mode="popLayout">
				{alerts.slice(-3).map((alert) => (
					<motion.div
						key={alert.id}
						initial={{ opacity: 0, x: 100, scale: 0.8 }}
						animate={{ opacity: 1, x: 0, scale: 1 }}
						exit={{ opacity: 0, x: 100, scale: 0.8 }}
						transition={{ type: 'spring', stiffness: 200, damping: 25 }}
						className="pointer-events-auto"
					>
						<Alert variant={getVariant(alert.type)} className="relative pr-10">
							{getIcon(alert.type)}
							<AlertDescription className="whitespace-normal break-words">
								{alert.message}
							</AlertDescription>
							<Button
								variant="ghost"
								size="sm"
								className="absolute right-2 top-2 h-6 w-6 p-0"
								onClick={() => dismissAlert(alert.id)}
							>
								<X className="h-4 w-4" />
							</Button>
						</Alert>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
