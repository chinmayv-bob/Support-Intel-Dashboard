import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTrends } from '../hooks/useTrends';
import { useMetrics } from '../hooks/useMetrics';
import { Skeleton } from '../components/shared/Skeleton';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const AnalyticsView: React.FC = () => {
    const { data: trendsData, isLoading: isTrendsLoading, error: trendsError } = useTrends();
    const { isLoading: isMetricsLoading, error: metricsError } = useMetrics();

    const isLoading = isTrendsLoading || isMetricsLoading;
    const hasError = !!trendsError || !!metricsError;

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
        <div className="flex flex-col xl:flex-row gap-8 items-start pb-12">
            {/* Filters Sidebar */}
            <aside className="w-full xl:w-72 shrink-0 space-y-6 xl:sticky xl:top-24">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Filters</h3>
                    <button className="text-xs text-primary font-medium hover:underline">Reset</button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">grid_view</span>
                            Panels
                        </h4>
                        <div className="space-y-2">
                            {['Billing & Refunds', 'Technical Support', 'Account Access', 'Feature Requests'].map((panel, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked={i < 2} className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4" />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{panel}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">mood_bad</span>
                            Sentiment
                        </h4>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between p-2 rounded-lg border border-red-100 bg-red-50/50 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500 text-[18px]">sentiment_very_dissatisfied</span>
                                    <span className="text-sm font-medium text-red-900">Frustrated (4+)</span>
                                </div>
                                <input type="checkbox" defaultChecked className="rounded border-red-300 text-red-600 w-4 h-4" />
                            </label>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Analytics Content */}
            <div className="flex-1 space-y-6 min-w-0">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Full Analytics</h1>
                        <p className="text-slate-500 text-sm mt-1">Real-time monitoring of support health.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Live Updates</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Volume Trends Chart */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[320px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900">Volume Trends</h3>
                                <p className="text-xs text-slate-500">Ticket volume by day of week</p>
                            </div>
                            <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
                            {[
                                { day: 'Mon', h: '65%' },
                                { day: 'Tue', h: '82%' },
                                { day: 'Wed', h: '45%' },
                                { day: 'Thu', h: '55%' },
                                { day: 'Fri', h: '90%', active: true },
                                { day: 'Sat', h: '25%', weekend: true },
                                { day: 'Sun', h: '20%', weekend: true },
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                    <div className="relative w-full bg-slate-100 rounded-t-sm h-32 group-hover:bg-slate-200 transition-colors overflow-hidden">
                                        <div
                                            className={cn(
                                                "absolute bottom-0 w-full rounded-t-sm transition-all",
                                                bar.active ? "bg-primary border-t-2 border-dashed border-primary" :
                                                    bar.weekend ? "bg-slate-300" : "bg-primary group-hover:bg-primary-dark"
                                            )}
                                            style={{ height: bar.h }}
                                        />
                                    </div>
                                    <span className={cn("text-xs font-medium", bar.active ? "text-primary font-bold" : "text-slate-500")}>{bar.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frustration Feed */}
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm flex flex-col h-[320px] overflow-hidden">
                        <div className="p-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                                    <span className="material-symbols-outlined text-[18px]">emergency_home</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Frustration Feed</h3>
                            </div>
                            <span className="px-2 py-1 bg-white border border-red-100 text-[10px] font-bold text-red-600 rounded">
                                {isLoading ? '-' : (trendsData?.trends || []).length} Detected
                            </span>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-2">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="p-3 bg-white border border-slate-100 rounded-lg space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                ))
                            ) : (
                                [
                                    { id: "#T-9241", score: "4.8", msg: ' "I have been waiting for 3 days for a simple password reset. This is unacceptable service..." ', color: 'bg-red-500', time: '2 mins ago' },
                                    { id: "#T-9102", score: "4.2", msg: ' "Why was I charged twice? The system said the first transaction failed..." ', color: 'bg-orange-400', time: '45 mins ago' },
                                    { id: "#T-8991", score: "4.0", msg: ' "Your agent just closed my ticket without resolving the API timeout issue." ', color: 'bg-orange-400', time: '1 hr ago' },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg group transition-colors cursor-pointer relative overflow-hidden">
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", item.color)}></div>
                                        <div className="flex justify-between items-start mb-1 pl-2">
                                            <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Score: {item.score}</span>
                                        </div>
                                        <p className="text-xs text-slate-800 pl-2 leading-relaxed italic">{item.msg}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Issue Clusters Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">auto_graph</span>
                            Active Trends
                        </h3>
                        <button className="text-sm font-semibold text-primary hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-4 w-1/2 mt-4" />
                                </div>
                            ))
                        ) : (
                            (trendsData?.trends || []).map((trend, i) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border flex items-center gap-1",
                                            trend.state === 'ESCALATING' ? "bg-red-100 text-red-700 border-red-200" :
                                                trend.state === 'NEW' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                    trend.state === 'RECURRING' ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                        "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            <span className="material-symbols-outlined text-[12px]">trending_up</span> {trend.state}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">{trend.title}</h4>
                                    <p className="text-xs text-slate-500 mb-4">{trend.root_cause}</p>
                                    <div className="pt-3 border-t border-slate-200/60 flex items-start gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                                        <p className="text-xs text-slate-700 font-medium">{trend.affected_panels.join(', ')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        {!isLoading && (trendsData?.trends || []).length === 0 && (
                            <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500 font-medium">No active trends detected currently.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
