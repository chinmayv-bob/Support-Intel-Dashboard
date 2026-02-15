import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface RiskCardProps {
    label: string;
    score: number;
    status: string;
    description: string;
    level: 'high' | 'medium' | 'low';
}

const RiskCard: React.FC<RiskCardProps> = ({
    label,
    score,
    status,
    description,
    level
}) => {
    const getBorderColor = () => {
        switch (level) {
            case 'high': return 'border-risk-red';
            case 'medium': return 'border-risk-amber';
            case 'low': return 'border-risk-emerald';
            default: return 'border-slate-200';
        }
    };

    const getTextColor = () => {
        switch (level) {
            case 'high': return 'text-risk-red';
            case 'medium': return 'text-risk-amber';
            case 'low': return 'text-risk-emerald';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className={cn(
            "relative bg-white p-5 rounded-xl border-l-4 shadow-sm transition-all",
            getBorderColor(),
            level === 'high' && score > 70 && "animate-pulse-glow"
        )}>
            {level === 'high' && (
                <div className="absolute right-4 top-4">
                    <div className="relative">
                        <span className="block size-3 bg-risk-red rounded-full"></span>
                    </div>
                </div>
            )}
            <h4 className="text-sm font-bold text-slate-700 mb-1">{label}</h4>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">{score}</span>
                <span className={cn("text-xs font-medium", getTextColor())}>{status}</span>
            </div>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
    );
};

export default RiskCard;
