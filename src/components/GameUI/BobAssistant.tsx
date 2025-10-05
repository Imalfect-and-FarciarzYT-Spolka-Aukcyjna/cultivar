'use client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
	AlertTriangle,
	Droplets,
	Lightbulb,
	MessageSquare,
	Satellite,
	TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export function BobAssistant() {
	const [isOpen, setIsOpen] = useState(false);

	const satelliteInsights = [
		{
			icon: Satellite,
			title: 'SMAP Soil Moisture',
			description:
				'The SMAP satellite shows soil moisture at 45%. Healthy crops need 50-80% moisture. Below 50% means your fields are getting dry and should be watered within 1-2 days to prevent stress and stunted growth.'
		},
		{
			icon: TrendingUp,
			title: 'NDVI Vegetation Index',
			description:
				'The MODIS satellite shows NDVI at 0.72. This index ranges from 0 (no vegetation) to 1 (dense, healthy crops). Values above 0.6 indicate vigorous growth and good chlorophyll content. Your crops are thriving!'
		},
		{
			icon: Droplets,
			title: 'GPM Precipitation Forecast',
			description:
				'The GPM satellite predicts 12mm rainfall tomorrow. Most crops need 5-10mm weekly. This upcoming rain will replenish soil moisture, so you can save water and skip irrigation for the next 2-3 days.'
		},
		{
			icon: AlertTriangle,
			title: 'Plant Stress Detection',
			description:
				'Landsat thermal bands show Field 3 temperature is 3°C above normal. This indicates water stress or disease. Check soil moisture immediately and inspect for pests. Early detection prevents crop loss.'
		}
	];

	return (
		<div className="fixed right-6 bottom-6 z-50">
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						size="lg"
						className="h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110"
						variant="default"
					>
						<div className="flex flex-col items-center">
							<span className="text-2xl">👨‍🌾</span>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="mr-4 mb-2 w-96" side="top" align="end">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<span className="text-2xl">👨‍🌾</span>
							<div>
								<h3 className="text-base font-bold">Bob the Farmer</h3>
								<p className="text-muted-foreground text-xs">Your farming assistant</p>
							</div>
						</div>

						<Separator />

						<div className="space-y-3">
							<div className="mb-3 flex items-center gap-2">
								<Lightbulb className="h-4 w-4" />
								<span className="text-sm font-semibold">Satellite Insights</span>
							</div>

							{satelliteInsights.map((insight, index) => {
								const Icon = insight.icon;
								return (
									<div key={index} className="hover:bg-muted/50 flex gap-3 rounded-lg p-2 transition-colors">
										<Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
										<div className="space-y-1">
											<p className="text-sm leading-tight font-medium">{insight.title}</p>
											<p className="text-muted-foreground text-xs leading-snug">{insight.description}</p>
										</div>
									</div>
								);
							})}
						</div>

						<Separator />

						<Button variant="outline" className="w-full" size="sm">
							<MessageSquare className="mr-2 h-4 w-4" />
							Ask a Question
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
