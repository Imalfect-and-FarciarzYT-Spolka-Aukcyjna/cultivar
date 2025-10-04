import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface InfoCardProps {
	title: string;
	children: ReactNode;
	className?: string;
}

export function InfoCard({ title, children, className = '' }: InfoCardProps) {
	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
