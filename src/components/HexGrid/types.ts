import { Field } from '@/types/field';

export interface HexagonProps {
	field: Field;
	size: number;
	isSelected: boolean;
	onSelect: (id: string) => void;
}

export interface HexGridProps {
	fields: Field[];
	size?: number;
	initialScale?: number;
	minScale?: number;
	maxScale?: number;
	onHexagonSelect?: (id: string, field: Field) => void;
	onHexagonDeselect?: () => void;
	showLabel?: boolean;
	className?: string;
}

export interface HexCoordinates {
	x: number;
	y: number;
}
