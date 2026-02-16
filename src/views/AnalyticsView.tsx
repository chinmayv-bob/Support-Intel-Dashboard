import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTrends } from '../hooks/useTrends';
import { useMetrics } from '../hooks/useMetrics';
import { useDashboard } from '../hooks/useDashboard';
import { Skeleton } from '../components/shared/Skeleton';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const AnalyticsView: React.FC = () => {
    const { data: trendsData, isLoading: isTrendsLoading, error: trendsError } = useTrends();
    const { isLoading: isMetricsLoading, error: metricsError } = useMetrics();
    const { data: dashboard, isLoading: isDashboardLoading } = useDashboard();

    // Filter State
    const [selectedPanels, setSelectedPanels] = React.useState<Set<string>>(new Set());
    const [showNegativeOnly, setShowNegativeOnly] = React.useState(true);

    // Initialize panels when data loads
    React.useEffect(() => {
        if (dashboard?.riskScores) {
            const allPanels = new Set(dashboard.riskScores.map(r => r.name));
            setSelectedPanels(allPanels);
        }
    }, [dashboard?.riskScores]);


    const isLoading = isTrendsLoading || isMetricsLoading || isDashboardLoading;
    const hasError = !!trendsError || !!metricsError;

    // Prepare filtered tickets for display
    const filteredTickets = React.useMemo(() => {
        return (dashboard?.criticalTickets || [])
            .filter(t => {
                // 1. Filter by Panel Selection
                if (!selectedPanels || selectedPanels.size === 0) return true;
                const panel = (t.panel || '').toLowerCase();
                return Array.from(selectedPanels).some(sp => {
                    const sPanel = (sp || '').toLowerCase();
                    return panel.includes(sPanel) || sPanel.includes(panel);
                });
            })
            // 2. Filter by Sentiment Toggle (Default True: Show only <= 3)
            .filter(t => !showNegativeOnly || (Number(t.sentiment?.score) || 10) <= 3);
    }, [dashboard?.criticalTickets, selectedPanels, showNegativeOnly]);

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
                    <button
                        onClick={() => {
                            if (dashboard?.riskScores) {
                                setSelectedPanels(new Set(dashboard.riskScores.map(r => r.name)));
                            }
                            setShowNegativeOnly(true);
                        }}
                        className="text-xs text-primary font-medium hover:underline"
                    >Reset</button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">grid_view</span>
                            Panels
                        </h4>
                        <div className="space-y-2">
                            {(dashboard?.riskScores || []).map((risk, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedPanels.has(risk.name)}
                                        onChange={(e) => {
                                            const newPanels = new Set(selectedPanels);
                                            if (e.target.checked) newPanels.add(risk.name);
                                            else newPanels.delete(risk.name);
                                            setSelectedPanels(newPanels);
                                        }}
                                        className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{risk.name}</span>
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
                                    <span className="text-sm font-medium text-red-900">Negative Only</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showNegativeOnly}
                                    onChange={(e) => setShowNegativeOnly(e.target.checked)}
                                    className="rounded border-red-300 text-red-600 w-4 h-4"
                                />
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
                            {(() => {
                                // Extract last 7 days volume from metrics sparkline
                                const volumeMetric = dashboard?.metrics?.find(m => m.label === 'Total Tickets');
                                const volumeData = volumeMetric?.sparklineData
                                    ? volumeMetric.sparklineData.split(',').map(Number)
                                    : [65, 82, 45, 55, 90, 25, 20]; // Fallback to mock if empty

                                // Generate labels for the last 7 days ending today
                                const days: string[] = [];
                                for (let i = 6; i >= 0; i--) {
                                    const d = new Date();
                                    d.setDate(d.getDate() - i);
                                    days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
                                }

                                const sevenDaysData = volumeData.slice(-7);

                                return sevenDaysData.map((val, i) => {
                                    const maxVal = Math.max(...sevenDaysData, 100); // Normalize height
                                    const h = Math.round((val / maxVal) * 100) + '%';
                                    const isActive = i === 6; // Last one is today
                                    // Highlight weekends if label is Sat/Sun
                                    const isWeekend = days[i] === 'Sat' || days[i] === 'Sun';

                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                            <div className="relative w-full bg-slate-100 rounded-t-sm h-32 group-hover:bg-slate-200 transition-colors overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "absolute bottom-0 w-full rounded-t-sm transition-all",
                                                        isActive ? "bg-primary border-t-2 border-dashed border-primary" :
                                                            isWeekend ? "bg-slate-300" : "bg-primary group-hover:bg-primary-dark"
                                                    )}
                                                    style={{ height: h }}
                                                />
                                            </div>
                                            <span className={cn("text-xs font-medium", isActive ? "text-primary font-bold" : "text-slate-500")}>
                                                {days[i]}
                                            </span>
                                        </div>
                                    );
                                });
                            })()}
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
                                {isLoading ? '-' : filteredTickets.length} Detected
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
                                filteredTickets
                                    .slice(0, 10) // Top 10 matches
                                    .map((item, i) => (
                                        <div key={i} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg group transition-colors cursor-pointer relative overflow-hidden">
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-1",
                                                (item.sentiment?.score || 0) < 2 ? 'bg-red-500' : 'bg-orange-400'
                                            )}></div>
                                            <div className="flex justify-between items-start mb-1 pl-2">
                                                <span className="text-xs font-mono font-bold text-slate-500">{item.ticket_id}</span>
                                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Score: {item.sentiment?.score}</span>
                                            </div>
                                            <p className="text-xs text-slate-800 pl-2 leading-relaxed italic line-clamp-2">"{item.summary}"</p>
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
                            (trendsData?.trends || [])
                                .map((trend, i) => (
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
                                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">confirmation_number</span>
                                                <p className="text-xs text-slate-700 font-medium">{trend.ticket_count || (trend as any).ticket_ids?.length || 0} tickets</p>
                                            </div>
                                            {trend.confidence > 0 && (
                                                <span className="text-[10px] font-bold text-slate-500">{trend.confidence}% confidence</span>
                                            )}
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
