import React from 'react';
import MetricCard from '../components/shared/MetricCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDashboard } from '../hooks/useDashboard';
import { useMetrics } from '../hooks/useMetrics';
import { BriefSkeleton, MetricSkeleton, RiskCardSkeleton, Skeleton } from '../components/shared/Skeleton';
import { useUIStore } from '../store/useUIStore';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const FocusView: React.FC = () => {
    const { searchQuery } = useUIStore();
    const [isTicketsExpanded, setIsTicketsExpanded] = React.useState(false);
    const [isPanelsExpanded, setIsPanelsExpanded] = React.useState(false);
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
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[#130e1b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Focus View</h1>
                        <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Live</span>
                    </div>
                    <p className="text-[#694d99] dark:text-[#bbaadd] text-base font-normal">Real-time Support Intelligence Dashboard</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-card-dark p-2 rounded-lg border border-slate-200 dark:border-border-dark shadow-sm">
                    <span className="text-sm font-semibold px-2 text-slate-700">Real-Time</span>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                </div>
            </div>

            {/* Daily AI Brief */}
            {isLoading ? (
                <BriefSkeleton />
            ) : (
                <div className="relative overflow-hidden rounded-xl border-l-4 border-primary bg-purple-50 dark:bg-card-dark shadow-md mb-8">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                    <h3 className="text-xl font-bold text-[#130e1b] dark:text-white">Daily AI Brief</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(dashboard?.dailyBrief || []).map((item, i) => (
                                        <div key={i} className={cn(
                                            "flex items-start gap-3 p-3 rounded-lg border",
                                            item.type === 'risk' ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20" :
                                                item.type === 'metric' ? "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/20" :
                                                    item.type === 'bot' ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20" :
                                                        "bg-purple-50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/20"
                                        )}>
                                            <span className="text-xl">{item.icon || '📌'}</span>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {(item.text || '').split(new RegExp(`(${(item.bold || []).join('|')})`, 'g')).map((part, j) =>
                                                    (item.bold || []).includes(part) ? <strong key={j} className="text-slate-900 font-bold">{part}</strong> : part
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center h-full min-w-[200px]">
                                <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">Generated at {dashboard?.generatedAt || '08:00 AM'}</p>
                            </div>
                        </div>
                    </div>
                </div>
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

            {/* Data Visualization Section */}
            <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-[#130e1b] dark:text-white tracking-tight text-2xl font-bold leading-tight">Panel Risk Heatmap</h2>
                    <button
                        onClick={() => setIsPanelsExpanded(!isPanelsExpanded)}
                        className="text-primary text-sm font-bold hover:underline"
                    >
                        {isPanelsExpanded ? 'Show Less' : 'View All Panels'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {isLoading ? (
                        <>
                            <RiskCardSkeleton />
                            <RiskCardSkeleton />
                            <RiskCardSkeleton />
                        </>
                    ) : (
                        ([...(dashboard?.riskScores || [])])
                            .filter((risk: any) =>
                                !searchQuery ||
                                risk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                risk.description.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .sort((a: any, b: any) => (Number(b.score) || 0) - (Number(a.score) || 0))
                            .slice(0, isPanelsExpanded ? undefined : 3)
                            .map((risk, i) => (
                                <div key={i} className={cn(
                                    "relative rounded-xl bg-white dark:bg-card-dark p-6 shadow-sm border overflow-hidden transition-all hover:shadow-md",
                                    risk.color === 'border-l-red-500' ? "border-red-200 ring-2 ring-red-500/30 animate-pulse-glow" :
                                        risk.color === 'border-l-amber-500' ? "border-slate-200" : "border-slate-200"
                                )}>
                                    {risk.hasJumped && (
                                        <div className="absolute top-0 right-0 p-3">
                                            <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                                        </div>
                                    )}
                                    <div className="flex flex-col h-full justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{risk.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{risk.description}</p>
                                        </div>
                                        <div className="my-6 flex items-center justify-center">
                                            <div className={cn(
                                                "relative size-24 flex items-center justify-center rounded-full border-8 transform transition-transform duration-1000",
                                                risk.color === 'border-l-red-500' ? "border-red-100 border-t-red-500 border-r-red-500 rotate-45" :
                                                    risk.color === 'border-l-amber-500' ? "border-amber-100 border-t-amber-500 -rotate-12" :
                                                        "border-emerald-100 border-t-emerald-500 rotate-180"
                                            )}>
                                                <span className={cn(
                                                    "text-3xl font-black text-gray-900 dark:text-white transform",
                                                    risk.color === 'border-l-red-500' ? "-rotate-45" :
                                                        risk.color === 'border-l-amber-500' ? "rotate-12" : "-rotate-180"
                                                )}>{risk.score}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded text-xs font-bold uppercase",
                                                risk.color === 'border-l-red-500' ? "bg-red-100 text-red-700" :
                                                    risk.color === 'border-l-amber-500' ? "bg-amber-100 text-amber-700" :
                                                        "bg-emerald-100 text-emerald-700"
                                            )}>{risk.level}</span>
                                            <span className="text-xs text-gray-400 font-mono">ID: {risk.name.substring(0, 3).toUpperCase()}-{Math.floor(Math.random() * 900) + 100}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* Tickets Feed Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[#130e1b] dark:text-white tracking-tight text-2xl font-bold leading-tight">Action Feed: Critical Tickets</h2>
                        <div className="flex gap-2">
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-xl">filter_list</span>
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors">
                                <span className="material-symbols-outlined text-xl">more_horiz</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map(i => (
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
                        ) : (() => {
                            const filteredTickets = (dashboard?.criticalTickets || []).filter(ticket => {
                                const score = ticket.sentiment?.score || 0;
                                const isHighImpact = ticket.impact?.some(tag =>
                                    ['Revenue', 'SLA', 'Revenue Risk', 'High Priority'].includes(tag)
                                );
                                // Filter out Irrelevant tickets: 
                                // - Must be Negative (1), Frustrated (2), or Neutral (3)
                                // - OR have a High Impact tag
                                // - Positive (4+) are excluded unless High Impact
                                const isRelevant = (score > 0 && score <= 3) || isHighImpact;

                                if (!isRelevant) return false;

                                // Apply Search Query
                                if (!searchQuery) return true;
                                const query = searchQuery.toLowerCase();
                                return (
                                    (ticket.summary || '').toLowerCase().includes(query) ||
                                    (ticket.ticket_id || '').toLowerCase().includes(query) ||
                                    (ticket.panel || '').toLowerCase().includes(query) ||
                                    (ticket.desc || '').toLowerCase().includes(query) ||
                                    (ticket.impact || []).some(tag => tag.toLowerCase().includes(query))
                                );
                            });

                            const displayedTickets = isTicketsExpanded ? filteredTickets : filteredTickets.slice(0, 3);

                            if (filteredTickets.length === 0) {
                                return (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                        <div className="size-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-3xl">verified</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-1">No Critical Issues Today</h4>
                                        <p className="text-sm text-slate-500 max-w-xs">All monitored signals are within nominal ranges and sentiment is stable.</p>
                                    </div>
                                );
                            }

                            return (
                                <>
                                    <div className="overflow-x-auto">
                                        <div className="w-full text-left">
                                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <div className="col-span-1">ID</div>
                                                <div className="col-span-5">Summary</div>
                                                <div className="col-span-2">Panel</div>
                                                <div className="col-span-1 text-center">Sentiment</div>
                                                <div className="col-span-1 text-center">Aging</div>
                                                <div className="col-span-2 text-right">Impact</div>
                                            </div>
                                            <div className="divide-y divide-border-light dark:divide-border-dark text-sm">
                                                {displayedTickets.map((ticket, i) => (
                                                    <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-3 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors items-center group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary hover:-translate-y-0.5 hover:shadow-sm">
                                                        <div className="col-span-1 font-mono text-sm font-bold text-primary">{ticket.ticket_id}</div>
                                                        <div className="col-span-5 text-sm font-medium text-gray-900 dark:text-white pr-4 leading-relaxed">
                                                            <span className="md:hidden text-xs font-bold text-gray-500 uppercase mr-2">Summary:</span>
                                                            {ticket.summary}
                                                            <p className="text-xs text-slate-500 truncate mt-1">{ticket.desc}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                                                                ticket.panel.includes('Checkout') ? "bg-purple-50 text-purple-700" :
                                                                    ticket.panel.includes('Auth') ? "bg-blue-50 text-blue-700" :
                                                                        ticket.panel.includes('Billing') ? "bg-emerald-50 text-emerald-700" :
                                                                            "bg-slate-50 text-slate-600"
                                                            )}>
                                                                {ticket.panel}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-1 text-center text-lg" title={ticket.sentiment?.label}>
                                                            {ticket.sentiment?.label === 'Negative' ? '🤬' :
                                                                ticket.sentiment?.label === 'Frustrated' ? '😡' :
                                                                    ticket.sentiment?.label === 'Neutral' ? '😒' : '😤'}
                                                        </div>
                                                        <div className="col-span-1 text-center">
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold",
                                                                ticket.agingColor === 'red' ? "bg-red-100 text-red-700" :
                                                                    ticket.agingColor === 'amber' ? "bg-amber-100 text-amber-700" :
                                                                        "bg-gray-100 text-gray-700"
                                                            )}>
                                                                {ticket.aging}
                                                                {ticket.agingColor === 'red' && <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-2 flex justify-end gap-2">
                                                            {ticket.impact?.map((tag, j) => (
                                                                <span key={j} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">
                                                                    {tag === 'Revenue' ? '💰 Revenue' :
                                                                        tag === 'SLA' ? '⏱ SLA' :
                                                                            tag === 'CX' ? '👤 CX' : tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {filteredTickets.length > 3 && (
                                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-center mt-auto">
                                            <button
                                                onClick={() => setIsTicketsExpanded(!isTicketsExpanded)}
                                                className="w-full text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wide py-2 transition-colors flex items-center justify-center gap-1"
                                            >
                                                {isTicketsExpanded ? 'Show Less' : 'View All Tickets'}
                                                <span className={cn("material-symbols-outlined text-sm transition-transform", isTicketsExpanded && "rotate-180")}>
                                                    expand_more
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusView;
