'use client';
import { InfoCard } from '@/components/GameUI/UI/InfoCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { WeatherData } from '@/types/game';
import { Cloud, Droplets, Sprout, Sun, Thermometer, Wind } from 'lucide-react';

interface WeatherTabProps {
	data: WeatherData;
}

export function WeatherTab({ data }: WeatherTabProps) {
	const weatherItems = [
		{
			icon: Thermometer,
			label: 'Temperature',
			value: `${data.temperature}°C`,
			description: 'Current air temperature affecting crop growth rates'
		},
		{
			icon: Droplets,
			label: 'Humidity',
			value: `${data.humidity}%`,
			description: 'Air humidity level - affects disease resistance and water evaporation'
		},
		{
			icon: Sprout,
			label: 'Soil Moisture',
			value: `${data.soilMoisture}%`,
			description: 'Soil water content - critical for plant health and growth'
		},
		{
			icon: Cloud,
			label: 'Rainfall',
			value: `${data.rainfall}mm`,
			description: 'Precipitation in the last 24 hours'
		},
		{
			icon: Wind,
			label: 'Wind Speed',
			value: `${data.windSpeed} km/h`,
			description: 'Wind speed - can affect pollination and irrigation'
		},
		{
			icon: Sun,
			label: 'UV Index',
			value: data.uvIndex.toString(),
			description: 'Ultraviolet radiation index - affects plant stress levels'
		}
	];

	return (
		<InfoCard title="Weather">
			<TooltipProvider>
				<div className="space-y-2">
					{weatherItems.map((item, index) => {
						const Icon = item.icon;
						return (
							<Tooltip key={index}>
								<TooltipTrigger asChild>
									<div className="hover:bg-muted flex cursor-help items-center justify-between rounded-md p-2 transition-colors">
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4" />
											<span className="text-muted-foreground text-sm">{item.label}</span>
										</div>
										<span className="text-sm font-semibold">{item.value}</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-xs">{item.description}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</TooltipProvider>
		</InfoCard>
	);
}
