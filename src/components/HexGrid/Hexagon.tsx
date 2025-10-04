'use client';
import { useState } from 'react';
import type { HexagonProps } from './types';
import { generateHexPath, hexToPixel } from './utils';

export function Hexagon({ field, size, isSelected, onSelect }: HexagonProps) {
	const [isHovered, setIsHovered] = useState(false);

	const opacity = field.owned ? (isSelected ? 1 : isHovered ? 0.95 : 0.8) : isHovered ? 0.7 : 0.5;
	const strokeWidth = isSelected ? 2 : field.owned ? 0.5 : 1.5;
	const stroke = isSelected ? '#ffff00' : field.owned ? '#000000' : '#666666';
	const fill = field.owned ? field.conditionColor : '#e0e0e0';
	const { x, y } = hexToPixel(field.coordinates.q, field.coordinates.r, size);

	return (
		<g>
			<polygon
				points={generateHexPath(field.coordinates.q, field.coordinates.r, size)}
				fill={fill}
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeLinejoin="round"
				strokeLinecap="round"
				strokeDasharray={field.owned ? undefined : '2,2'}
				className="rounded-4xl"
				style={{
					cursor: 'pointer',
					opacity,
					transition: 'opacity 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, fill 0.3s ease',
					filter: 'url(#round-corners)',
					pointerEvents: 'all'
				}}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onSelect(field.id);
				}}
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				suppressHydrationWarning
			/>
			{field.displayEmoji && (
				<text
					x={x}
					y={y}
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize={size * 0.6}
					pointerEvents="none"
					suppressHydrationWarning
				>
					{field.displayEmoji}
				</text>
			)}
			{!field.owned && isHovered && (
				<text
					x={x}
					y={y + size * 0.4}
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize={size * 0.3}
					fill="#666"
					fontWeight="bold"
					pointerEvents="none"
					suppressHydrationWarning
				>
					${field.purchasePrice}
				</text>
			)}
		</g>
	);
}
