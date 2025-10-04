'use client';
import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Hexagon } from './Hexagon';
import type { HexGridProps } from './types';

export function HexGrid({
	fields,
	size = 10,
	initialScale = 1,
	minScale = 0.5,
	maxScale = 8,
	onHexagonSelect,
	onHexagonDeselect,
	className = ''
}: HexGridProps) {
	const [selectedHexId, setSelectedHexId] = useState<string | null>(null);

	const handleHexSelect = (id: string) => {
		const field = fields.find((f) => f.id === id);
		if (!field) return;

		if (selectedHexId === id) {
			setSelectedHexId(null);
			onHexagonDeselect?.();
		} else {
			setSelectedHexId(id);
			onHexagonSelect?.(id, field);
		}
	};

	// Calculate the grid bounds to center it properly
	// Hex coordinates conversion: x = sqrt(3) * (q + r/2), y = 3/2 * r
	const hexWidth = Math.sqrt(3) * size;
	const hexHeight = 2 * size;

	// Find max extents
	let minX = Infinity,
		maxX = -Infinity,
		minY = Infinity,
		maxY = -Infinity;
	fields.forEach((field) => {
		const x = hexWidth * (field.coordinates.q + field.coordinates.r / 2);
		const y = (3 / 2) * size * field.coordinates.r;
		minX = Math.min(minX, x - hexWidth / 2);
		maxX = Math.max(maxX, x + hexWidth / 2);
		minY = Math.min(minY, y - hexHeight / 2);
		maxY = Math.max(maxY, y + hexHeight / 2);
	});

	const width = maxX - minX + 20; // Add padding
	const height = maxY - minY + 20;
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	const viewBox = `${centerX - width / 2} ${centerY - height / 2} ${width} ${height}`;

	return (
		<div className={`relative h-full w-full ${className}`}>
			<TransformWrapper
				initialScale={initialScale}
				minScale={minScale}
				maxScale={maxScale}
				limitToBounds={false}
				panning={{ disabled: false }}
				wheel={{ step: 0.1 }}
				doubleClick={{ disabled: true }}
			>
				<TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
					<svg
						width="100%"
						height="100%"
						viewBox={viewBox}
						style={{ display: 'block' }}
						suppressHydrationWarning
					>
						<defs>
							<filter id="round-corners" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
								<feColorMatrix
									in="blur"
									mode="matrix"
									values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
									result="rounded"
								/>
								<feComposite in="SourceGraphic" in2="rounded" operator="atop" />
							</filter>
						</defs>
						{/* Render all fields in order, with selected one last */}
						{fields
							.sort((a, b) => {
								// Selected field goes last (on top)
								if (a.id === selectedHexId) return 1;
								if (b.id === selectedHexId) return -1;
								return 0;
							})
							.map((field) => (
								<Hexagon
									key={field.id}
									field={field}
									size={size}
									isSelected={selectedHexId === field.id}
									onSelect={handleHexSelect}
								/>
							))}
					</svg>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
}
