import type { HexCoordinates } from './types';

/**
 * Calculate the pixel position for a hexagon given axial coordinates
 * @param q - Column coordinate
 * @param r - Row coordinate
 * @param size - Size of the hexagon
 * @returns Pixel coordinates {x, y}
 */
export function hexToPixel(q: number, r: number, size: number): HexCoordinates {
	const x = size * ((3 / 2) * q);
	const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
	return { x, y };
}

/**
 * Generate SVG polygon points for a flat-top hexagon
 * @param q - Column coordinate
 * @param r - Row coordinate
 * @param size - Size of the hexagon
 * @returns SVG points string
 */
export function generateHexPath(q: number, r: number, size: number): string {
	const { x, y } = hexToPixel(q, r, size);
	const points: string[] = [];

	for (let i = 0; i < 6; i++) {
		const angle = (Math.PI / 180) * (60 * i);
		const px = x + size * Math.cos(angle);
		const py = y + size * Math.sin(angle);
		points.push(`${px},${py}`);
	}

	return points.join(' ');
}

/**
 * Calculate the third axial coordinate (s = -q - r)
 * @param q - Column coordinate
 * @param r - Row coordinate
 * @returns s coordinate
 */
export function calculateS(q: number, r: number): number {
	return -q - r;
}
