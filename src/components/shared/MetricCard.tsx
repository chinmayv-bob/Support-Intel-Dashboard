import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MetricCardProps {
    label: string;
    value: string;
    trend: string;
    trendDirection: 'up' | 'down' | 'stable';
    status: 'error' | 'warning' | 'success' | 'neutral';
    sparklineData: string;
    sparklineColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    trend,
    trendDirection,
    status,
    sparklineData,
    sparklineColor
}) => {
    const getStatusColor = () => {
        switch (status) {
            case 'error': return 'text-red-600';
            case 'warning': return 'text-amber-600';
            case 'success': return 'text-green-600';
            default: return 'text-slate-400';
        }
    };

    const getTrendIcon = () => {
        switch (trendDirection) {
            case 'up': return 'arrow_upward';
            case 'down': return 'arrow_downward';
            default: return 'remove';
        }
    };

    const getPathData = (dataStr: string) => {
        if (!dataStr) return "";
        const points = dataStr.split(',').map(Number);
        if (points.some(isNaN)) return dataStr; // Fallback if it's already a path

        return points.map((p, i) => {
            const x = (i / (points.length - 1)) * 40;
            const y = 10 - (p / Math.max(...points, 1)) * 10;
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
                    <span className={cn("text-xs font-medium flex items-center mt-1", getStatusColor())}>
                        <span className="material-symbols-outlined text-[14px] mr-0.5">{getTrendIcon()}</span>
                        {trend}
                    </span>
                </div>
                <div className="w-20 h-10">
                    <svg className={cn("w-full h-full overflow-visible", sparklineColor)} fill="none" stroke="currentColor" viewBox="0 0 40 10">
                        <path d={getPathData(sparklineData)} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
