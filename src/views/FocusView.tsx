import React from 'react';
import MetricCard from '../components/shared/MetricCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDashboard } from '../hooks/useDashboard';
import { useMetrics } from '../hooks/useMetrics';
import { BriefSkeleton, MetricSkeleton, RiskCardSkeleton, Skeleton } from '../components/shared/Skeleton';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const FocusView: React.FC = () => {
    const { data: dashboard, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();
    const { data: metricsData, isLoading: isMetricsLoading, error: metricsError } = useMetrics();

    const isLoading = isDashboardLoading || isMetricsLoading;
    const hasError = !!dashboardError || !!metricsError;

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-red-50 rounded-xl border border-red-100">
                <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Failed</h3>
                <p className="text-slate-600 max-w-md">
                    We couldn't reach the Support Intel backend. Please verify your <code className="bg-red-100 px-1 rounded">VITE_APPS_SCRIPT_URL</code> in <code className="bg-red-100 px-1 rounded">.env</code>.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Daily AI Brief */}
            {isLoading ? (
                <BriefSkeleton />
            ) : (
                <section className="bg-intel-purple/5 border border-intel-purple/20 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl text-intel-purple">auto_awesome</span>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-intel-purple text-white p-1 rounded">
                                <span className="material-symbols-outlined text-[16px] block">auto_awesome</span>
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-intel-purple">Daily AI Brief</h3>
                            <span className="text-xs text-intel-purple/60 ml-auto font-medium">Generated at {dashboard?.generatedAt || '08:00 AM'}</span>
                        </div>
                        <ul className="space-y-3">
                            {(dashboard?.dailyBrief || []).map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-800 text-sm font-medium">
                                    <span className="mt-1.5 size-1.5 rounded-full bg-intel-purple shrink-0"></span>
                                    <span>
                                        {(item.text || '').split(new RegExp(`(${(item.bold || []).join('|')})`, 'g')).map((part, j) =>
                                            (item.bold || []).includes(part) ? <strong key={j} className="text-slate-900 font-bold">{part}</strong> : part
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <>
                        <MetricSkeleton />
                        <MetricSkeleton />
                        <MetricSkeleton />
                        <MetricSkeleton />
                    </>
                ) : (
                    (metricsData?.metrics || dashboard?.metrics || []).map((metric, i) => (
                        <MetricCard
                            key={i}
                            label={metric.label}
                            value={String(metric.value)}
                            trend={metric.trend}
                            trendDirection={metric.trendDirection}
                            status={metric.status}
                            sparklineData={metric.sparklineData}
                            sparklineColor={metric.sparklineColor}
                        />
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Heatmap Section */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Panel Risk Heatmap</h3>
                        <button className="text-xs font-semibold text-primary hover:text-primary-dark">View All</button>
                    </div>

                    {isLoading ? (
                        <>
                            <RiskCardSkeleton />
                            <RiskCardSkeleton />
                            <RiskCardSkeleton />
                        </>
                    ) : (
                        (dashboard?.riskScores || []).map((risk, i) => (
                            <div key={i} className={cn(
                                "relative bg-white p-5 rounded-xl border-l-4 shadow-sm transition-all",
                                risk.color,
                                risk.hasJumped && "animate-pulse-glow"
                            )}>
                                <div className="absolute right-4 top-4">
                                    <span className={cn("block size-3 rounded-full", risk.color.replace('border-l-', 'bg-'))}></span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-700 mb-1">{risk.name}</h4>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-black text-slate-900">{risk.score}</span>
                                    <span className={cn("text-xs font-medium", risk.color.replace('border-l-', 'text-'))}>{risk.level}</span>
                                </div>
                                <p className="text-xs text-slate-500">{risk.description}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Tickets Feed Section */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Action Feed: Critical Tickets</h3>
                        <div className="flex gap-2">
                            <button className="p-1 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-4 p-4 border-b border-slate-100 last:border-0">
                                        <Skeleton className="size-10 rounded-full shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4 w-1/3">Summary</th>
                                            <th className="px-6 py-4">Panel</th>
                                            <th className="px-6 py-4 text-center">Sentiment</th>
                                            <th className="px-6 py-4">Aging</th>
                                            <th className="px-6 py-4">Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {(dashboard?.criticalTickets || []).map((ticket, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-500 group-hover:text-primary font-medium">{ticket.ticket_id}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-900">{ticket.summary}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{ticket.desc}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                        {ticket.panel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-xl grayscale group-hover:grayscale-0 transition-all">
                                                    {ticket.sentiment?.label === 'Negative' ? '🤬' :
                                                        ticket.sentiment?.label === 'Frustrated' ? '😡' :
                                                            ticket.sentiment?.label === 'Neutral' ? '😒' : '😤'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border",
                                                        ticket.agingColor === 'red' ? "bg-red-50 text-red-700 border-red-100" :
                                                            ticket.agingColor === 'amber' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                                "bg-slate-50 text-slate-700 border-slate-100"
                                                    )}>
                                                        {ticket.aging}
                                                        {ticket.agingColor !== 'slate' && <span className={cn("size-2 rounded-full", ticket.agingColor === 'red' ? "bg-red-500 animate-pulse" : "bg-amber-500")}></span>}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {ticket.impact?.map((tag, j) => (
                                                            <span key={j} className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">{tag}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-center">
                            <button className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                                Load More Tickets <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusView;
