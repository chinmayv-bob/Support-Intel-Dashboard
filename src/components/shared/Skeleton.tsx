import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={cn("animate-pulse bg-slate-200 rounded-md", className)} />
    );
};

export const MetricSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16 ml-auto" />
        </div>
    </div>
);

export const BriefSkeleton: React.FC = () => (
    <div className="bg-intel-purple/5 border border-intel-purple/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
        </div>
    </div>
);

export const RiskCardSkeleton: React.FC = () => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <Skeleton className="h-4 w-20 mb-2" />
        <div className="flex items-baseline gap-2 mb-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
    </div>
);
