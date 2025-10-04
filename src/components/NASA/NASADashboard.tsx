'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/gameStore';
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Cloud,
	Droplets,
	Satellite,
	Sparkles,
	Sprout,
	Thermometer,
	TrendingDown,
	TrendingUp,
	Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateSelector } from './DateSelector';

interface NASADashboardProps {
	open: boolean;
	onClose: () => void;
}

export function NASADashboard({ open, onClose }: NASADashboardProps) {
	const [activeTab, setActiveTab] = useState('overview');
	const { currentDay } = useGameStore();
	const [selectedDay, setSelectedDay] = useState(currentDay);

	useEffect(() => {
		setSelectedDay(currentDay);
	}, [currentDay]);

	const mockData = {
		soilMoisture: {
			current: 42,
			optimal: [35, 65],
			trend: 'decreasing',
			forecast: [40, 38, 36, 35, 42, 48, 52],
			lastUpdate: '2 hours ago',
			satellite: 'SMAP',
			resolution: '9km',
			recommendation: 'Soil moisture declining. Consider irrigation within 48 hours.'
		},
		ndvi: {
			current: 0.72,
			optimal: [0.6, 0.9],
			trend: 'stable',
			zones: [
				{ name: 'Excellent', value: 65, color: 'green' },
				{ name: 'Good', value: 25, color: 'lime' },
				{ name: 'Fair', value: 8, color: 'yellow' },
				{ name: 'Poor', value: 2, color: 'orange' }
			],
			lastUpdate: '16 days ago',
			satellite: 'Landsat 8',
			resolution: '30m',
			recommendation: 'Vegetation index healthy. 65% of fields showing excellent growth.'
		},
		temperature: {
			current: 28.5,
			optimal: [18, 30],
			trend: 'increasing',
			forecast: [28, 30, 32, 31, 29, 27, 26],
			extremeRisk: 15,
			lastUpdate: '6 hours ago',
			satellite: 'MODIS (Terra/Aqua)',
			resolution: '1km',
			recommendation: 'Temperature rising. Heat stress possible in 2-3 days. Consider shade nets.'
		},
		precipitation: {
			last7Days: 12.5,
			forecast7Days: 8.3,
			trend: 'decreasing',
			probability: [10, 15, 60, 80, 40, 20, 10],
			lastUpdate: '1 hour ago',
			satellite: 'GPM',
			resolution: '10km',
			recommendation: 'Rain expected Day 3-4. Delay irrigation, save costs.'
		},
		plantStress: {
			waterStress: 28,
			heatStress: 15,
			overallHealth: 82,
			criticalFields: 3,
			lastUpdate: '12 hours ago',
			satellite: 'ECOSTRESS',
			resolution: '70m',
			recommendation: '3 fields showing water stress. Priority irrigation recommended.'
		},
		pestRisk: {
			current: 'Moderate',
			probability: 45,
			factors: [
				{ name: 'Temperature', value: 65, impact: 'High' },
				{ name: 'Humidity', value: 78, impact: 'High' },
				{ name: 'Rainfall', value: 12, impact: 'Low' }
			],
			lastUpdate: '3 hours ago',
			satellites: 'MODIS + GPM + MERRA-2',
			recommendation: 'Fungal disease risk elevated. Monitor closely, consider preventive IPM.'
		},
		unlockedSatellites: ['SMAP', 'MODIS', 'Landsat 8', 'GPM']
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] w-full max-w-[90vw] overflow-y-auto sm:max-w-[90vw]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-purple-500" />
						🛰️ NASA Space Farm Dashboard
					</DialogTitle>
					<DialogDescription>
						Real-time satellite data from space! 🚀 Powered by NASA missions
					</DialogDescription>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">🏠 Overview</TabsTrigger>
						<TabsTrigger value="soil">💧 Soil & Water</TabsTrigger>
						<TabsTrigger value="crops">🌱 Crop Health</TabsTrigger>
						<TabsTrigger value="weather">⛅ Weather</TabsTrigger>
					</TabsList>

					<div className="pt-4">
						<DateSelector
							selectedDay={selectedDay}
							onDateSelect={(day) => {
								setSelectedDay(day);
							}}
						/>
					</div>

					<TabsContent value="overview" className="space-y-4">
						<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center gap-2 text-sm">
									<Sprout className="h-4 w-4 text-green-600" />
									🌾 Farm Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span className="text-sm">Health: {mockData.plantStress.overallHealth}% 💪</span>
									</div>
									<div className="flex items-center gap-2">
										<AlertTriangle className="h-4 w-4 text-yellow-600" />
										<span className="text-sm">{mockData.plantStress.criticalFields} fields need love ❤️</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-sm">
									<Satellite className="h-4 w-4 text-blue-600" />
									🛰️ Active NASA Satellites
								</CardTitle>
								<CardDescription>Your space helpers monitoring from orbit!</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-3 md:grid-cols-2">
									{mockData.unlockedSatellites.map((sat) => (
										<div
											key={sat}
											className="flex items-center gap-3 rounded-lg border-2 border-blue-200 bg-white p-3 shadow-sm transition-all hover:scale-105 hover:shadow-md"
										>
											<Satellite className="h-5 w-5 text-blue-600" />
											<div className="flex-1">
												<p className="text-sm font-medium">{sat}</p>
												<p className="text-muted-foreground text-xs">✨ Active & watching</p>
											</div>
											<Zap className="h-4 w-4 text-green-600" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-sm">
									<Sparkles className="h-4 w-4 text-purple-600" />✨ Priority Insights
								</CardTitle>
								<CardDescription>AI-powered recommendations from space!</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-start gap-3 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-3 shadow-sm">
									<AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
									<div className="flex-1">
										<p className="text-sm font-medium">{mockData.soilMoisture.recommendation}</p>
										<p className="text-muted-foreground mt-1 text-xs">📡 SMAP Soil Moisture</p>
									</div>
								</div>
								<div className="flex items-start gap-3 rounded-lg border-2 border-blue-300 bg-blue-50 p-3 shadow-sm">
									<Droplets className="mt-0.5 h-5 w-5 text-blue-600" />
									<div className="flex-1">
										<p className="text-sm font-medium">{mockData.precipitation.recommendation}</p>
										<p className="text-muted-foreground mt-1 text-xs">🌧️ GPM Precipitation</p>
									</div>
								</div>
								<div className="flex items-start gap-3 rounded-lg border-2 border-orange-300 bg-orange-50 p-3 shadow-sm">
									<Thermometer className="mt-0.5 h-5 w-5 text-orange-600" />
									<div className="flex-1">
										<p className="text-sm font-medium">{mockData.temperature.recommendation}</p>
										<p className="text-muted-foreground mt-1 text-xs">🌡️ MODIS Temperature</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="soil" className="space-y-4">
						<Card className="border-2 border-blue-200">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Droplets className="h-5 w-5 text-blue-600" />
											💧 Soil Moisture (SMAP)
										</CardTitle>
										<CardDescription>
											9km resolution • Updated {mockData.soilMoisture.lastUpdate}
										</CardDescription>
									</div>
									<Badge
										variant={mockData.soilMoisture.trend === 'decreasing' ? 'destructive' : 'secondary'}
										className="gap-1"
									>
										{mockData.soilMoisture.trend === 'decreasing' ? (
											<TrendingDown className="h-3 w-3" />
										) : (
											<TrendingUp className="h-3 w-3" />
										)}
										{mockData.soilMoisture.trend}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Current Level</span>
										<span className="text-2xl font-bold">{mockData.soilMoisture.current}%</span>
									</div>
									<Progress value={mockData.soilMoisture.current} className="h-3" />
									<div className="mt-1 flex justify-between">
										<span className="text-muted-foreground text-xs">
											Optimal: {mockData.soilMoisture.optimal[0]}%
										</span>
										<span className="text-muted-foreground text-xs">{mockData.soilMoisture.optimal[1]}%</span>
									</div>
								</div>

								<Separator />

								<div>
									<p className="mb-2 text-sm font-medium">📊 7-Day Forecast</p>
									<div className="flex h-40 items-end gap-2">
										{mockData.soilMoisture.forecast.map((value, idx) => (
											<div key={idx} className="flex flex-1 flex-col items-center gap-1">
												<div
													className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 shadow-sm transition-all hover:scale-105"
													style={{ height: `${(value / 100) * 160}px` }}
												/>
												<p className="text-muted-foreground text-xs">{value}%</p>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.soilMoisture.recommendation}</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-orange-200">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5 text-orange-600" />
									🌡️ Plant Water Stress (ECOSTRESS)
								</CardTitle>
								<CardDescription>
									70m resolution • Updated {mockData.plantStress.lastUpdate}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-3">
									<div>
										<p className="text-muted-foreground mb-1 text-sm">💧 Water Stress</p>
										<Progress value={mockData.plantStress.waterStress} className="mb-1 h-3" />
										<p className="text-lg font-bold">{mockData.plantStress.waterStress}%</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1 text-sm">🔥 Heat Stress</p>
										<Progress value={mockData.plantStress.heatStress} className="mb-1 h-3" />
										<p className="text-lg font-bold">{mockData.plantStress.heatStress}%</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1 text-sm">💚 Overall Health</p>
										<Progress value={mockData.plantStress.overallHealth} className="mb-1 h-3" />
										<p className="text-lg font-bold">{mockData.plantStress.overallHealth}%</p>
									</div>
								</div>

								<div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.plantStress.recommendation}</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="crops" className="space-y-4">
						<Card className="border-2 border-green-200">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Sprout className="h-5 w-5 text-green-600" />
											🌱 NDVI - Vegetation Index (Landsat 8)
										</CardTitle>
										<CardDescription>30m resolution • Updated {mockData.ndvi.lastUpdate}</CardDescription>
									</div>
									<Badge variant="secondary" className="gap-1">
										<CheckCircle2 className="h-3 w-3" />
										{mockData.ndvi.trend}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Average NDVI</span>
										<span className="text-2xl font-bold">{mockData.ndvi.current}</span>
									</div>
									<Progress value={mockData.ndvi.current * 100} className="h-3" />
									<p className="text-muted-foreground mt-1 text-xs">
										Range: {mockData.ndvi.optimal[0]} - {mockData.ndvi.optimal[1]} (optimal)
									</p>
								</div>

								<Separator />

								<div>
									<p className="mb-3 text-sm font-medium">📊 Field Distribution</p>
									<div className="space-y-2">
										{mockData.ndvi.zones.map((zone) => (
											<div key={zone.name} className="flex items-center gap-3">
												<div className="w-20 text-sm">{zone.name}</div>
												<Progress value={zone.value} className="h-3 flex-1" />
												<div className="w-12 text-right text-sm font-medium">{zone.value}%</div>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border-2 border-green-300 bg-green-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.ndvi.recommendation}</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-yellow-200">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<AlertTriangle className="h-5 w-5 text-yellow-600" />
									🐛 Pest & Disease Risk (Multi-Source AI)
								</CardTitle>
								<CardDescription>
									{mockData.pestRisk.satellites} • Updated {mockData.pestRisk.lastUpdate}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm">Risk Level</p>
										<p className="text-3xl font-bold">{mockData.pestRisk.current}</p>
									</div>
									<div className="text-right">
										<p className="text-muted-foreground text-sm">Probability</p>
										<p className="text-3xl font-bold">{mockData.pestRisk.probability}%</p>
									</div>
								</div>

								<Progress value={mockData.pestRisk.probability} className="h-3" />

								<Separator />

								<div>
									<p className="mb-3 text-sm font-medium">🔍 Contributing Factors</p>
									<div className="space-y-2">
										{mockData.pestRisk.factors.map((factor) => (
											<div
												key={factor.name}
												className="flex items-center justify-between rounded-lg border-2 p-2"
											>
												<span className="text-sm">{factor.name}</span>
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium">{factor.value}%</span>
													<Badge
														variant={factor.impact === 'High' ? 'destructive' : 'secondary'}
														className="text-xs"
													>
														{factor.impact}
													</Badge>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.pestRisk.recommendation}</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="weather" className="space-y-4">
						<Card className="border-2 border-red-200">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Thermometer className="h-5 w-5 text-red-600" />
											🌡️ Surface Temperature (MODIS)
										</CardTitle>
										<CardDescription>
											1km resolution • Updated {mockData.temperature.lastUpdate}
										</CardDescription>
									</div>
									<Badge variant="destructive" className="gap-1">
										<TrendingUp className="h-3 w-3" />
										{mockData.temperature.trend}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm">Current Temperature</p>
										<p className="text-4xl font-bold">{mockData.temperature.current}°C</p>
									</div>
									<div className="text-right">
										<p className="text-muted-foreground text-sm">⚠️ Extreme Risk</p>
										<p className="text-2xl font-bold text-orange-600">{mockData.temperature.extremeRisk}%</p>
									</div>
								</div>

								<Separator />

								<div>
									<p className="mb-2 text-sm font-medium">📊 7-Day Forecast</p>
									<div className="flex h-40 items-end gap-2">
										{mockData.temperature.forecast.map((temp, idx) => (
											<div key={idx} className="flex flex-1 flex-col items-center gap-1">
												<div
													className={`w-full rounded-t-lg shadow-sm transition-all hover:scale-105 ${
														temp > 30
															? 'bg-gradient-to-t from-red-500 to-red-400'
															: temp > 25
																? 'bg-gradient-to-t from-orange-500 to-orange-400'
																: 'bg-gradient-to-t from-green-500 to-green-400'
													}`}
													style={{ height: `${(temp / 35) * 160}px` }}
												/>
												<p className="text-muted-foreground text-xs">{temp}°C</p>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.temperature.recommendation}</p>
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-blue-200">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Cloud className="h-5 w-5 text-blue-600" />
									🌧️ Precipitation (GPM)
								</CardTitle>
								<CardDescription>
									10km resolution • Updated {mockData.precipitation.lastUpdate}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-muted-foreground mb-1 text-sm">Last 7 Days</p>
										<p className="text-3xl font-bold">{mockData.precipitation.last7Days}mm 💧</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1 text-sm">Forecast 7 Days</p>
										<p className="text-3xl font-bold">{mockData.precipitation.forecast7Days}mm 🌧️</p>
									</div>
								</div>

								<Separator />

								<div>
									<p className="mb-2 text-sm font-medium">📊 Rain Probability (%)</p>
									<div className="flex h-40 items-end gap-2">
										{mockData.precipitation.probability.map((prob, idx) => (
											<div key={idx} className="flex flex-1 flex-col items-center gap-1">
												<div
													className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 shadow-sm transition-all hover:scale-105"
													style={{ height: `${(prob / 100) * 160}px` }}
												/>
												<div className="text-center">
													<p className="text-xs font-medium">Day {idx + 1}</p>
													<p className="text-muted-foreground text-xs">{prob}%</p>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-3">
									<p className="text-sm font-medium">💡 {mockData.precipitation.recommendation}</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
