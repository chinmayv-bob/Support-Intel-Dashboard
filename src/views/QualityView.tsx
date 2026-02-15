import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useQuality } from '../hooks/useQuality';
import { useDashboard } from '../hooks/useDashboard';
import { Skeleton } from '../components/shared/Skeleton';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const QualityView: React.FC = () => {
    const { data: qualityData, isLoading: isQualityLoading, error: qualityError } = useQuality();
    const { data: dashboard, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();

    const isLoading = isQualityLoading || isDashboardLoading;
    const hasError = !!qualityError || !!dashboardError;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quality Score Card */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-9xl text-slate-900">fact_check</span>
                    </div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="material-symbols-outlined text-primary">fact_check</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 border border-green-200">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> Top 15%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Today's Support Quality %</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-black text-slate-900 tracking-tight">
                                {isLoading ? <Skeleton className="h-10 w-20" /> : (qualityData?.qualitySignals?.score || '0') + '/100'}
                            </p>
                            <span className="text-sm font-medium text-slate-400">Aggregate Score</span>
                        </div>
                    </div>
                </div>

                {/* Redundant Replies Card */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span className="material-symbols-outlined text-9xl text-slate-900">content_paste_off</span>
                    </div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                            <span className="material-symbols-outlined text-amber-600">content_paste_off</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1 border border-amber-200">
                            <span className="material-symbols-outlined text-[14px]">warning</span> {isLoading ? '-' : (qualityData?.qualitySignals?.redundant_replies || '0')} Detected
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Redundant Reply Tracking</p>
                        <div className="flex items-baseline gap-3">
                            <p className="text-4xl font-black text-slate-900 tracking-tight">
                                {isLoading ? <Skeleton className="h-10 w-20" /> : (qualityData?.qualitySignals?.redundant_replies || '0')}
                            </p>
                            <span className="text-sm font-medium text-slate-400">Low-value responses detected</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Coach Section */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-intel-purple/10 rounded text-intel-purple">
                                <span className="material-symbols-outlined text-[20px]">psychology</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">AI Coach: Daily Behavioral Briefing</h3>
                                <p className="text-sm text-slate-500">Pattern-based behavioral points (Last 24h)</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-intel-purple bg-intel-purple/5 px-2 py-1 rounded border border-intel-purple/10 uppercase tracking-wider">AI Generated</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-lg border border-slate-100 space-y-2">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))
                        ) : (
                            [
                                { title: "Coaching Win", icon: "emoji_events", color: "text-green-600", bg: "bg-green-50", desc: qualityData?.coachingOpportunities?.[0] || "No major wins logged today." },
                                { title: "Coaching Risk", icon: "warning", color: "text-amber-600", bg: "bg-amber-50", desc: qualityData?.coachingOpportunities?.[1] || "No critical risks detected." },
                                { title: "Next Action", icon: "bolt", color: "text-primary", bg: "bg-primary/5", desc: qualityData?.coachingOpportunities?.[2] || "Follow standard SOPs." },
                            ].map((coach, i) => (
                                <div key={i} className={cn("p-4 rounded-lg border border-slate-100", coach.bg)}>
                                    <div className={cn("flex items-center gap-2 mb-2 font-bold text-sm", coach.color)}>
                                        <span className="material-symbols-outlined text-[18px]">{coach.icon}</span>
                                        <span>{coach.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{coach.desc}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-700">Overall Ticket Quality Trend</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-green-500"></span><span className="text-[10px] text-slate-500 font-medium">Target</span></div>
                                <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500"></span><span className="text-[10px] text-slate-500 font-medium">Warning</span></div>
                            </div>
                        </div>
                        <div className="relative w-full h-40">
                            {isLoading ? (
                                <Skeleton className="w-full h-full" />
                            ) : (
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 100">
                                    <path d="M0 45 L 30 35 L 60 40 L 90 25 L 120 45 L 150 55 L 180 65 L 210 55 L 240 40 L 270 30 L 300 35 L 330 60 L 360 85 L 390 110 L 420 80 L 450 60 L 478 45" fill="none" stroke="#135bec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="90" cy="25" fill="#fff" r="4" stroke="#135bec" strokeWidth="2" />
                                    <circle cx="180" cy="65" fill="#fff" r="4" stroke="#f59e0b" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* Process Flagged Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500">report_problem</span>
                            Process Flagged
                        </h3>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sentiment Drops</span>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            ))
                        ) : (
                            (dashboard?.criticalTickets || []).slice(0, 3).map((ticket, i) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-slate-900">{ticket.ticket_id}: {ticket.summary}</h4>
                                        <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Alert</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{ticket.ai_reasoning || "Sentiment dropped significantly."}</p>
                                    <div className="bg-white p-3 rounded border border-indigo-100 relative mt-2">
                                        <div className="absolute -top-2 left-3 bg-indigo-50 text-primary text-[9px] font-bold px-1.5 rounded uppercase">AI Advice</div>
                                        <p className="text-[11px] font-medium text-slate-600 flex gap-2">
                                            <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                                            Address the root cause immediately to prevent escalation.
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityView;
