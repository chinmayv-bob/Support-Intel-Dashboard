import type { DashboardResponse, TrendData, MetricData, QualityData } from './types';

export const MOCK_DASHBOARD: DashboardResponse = {
    dailyBrief: [
        { text: "Volume spiked 22% in Billing & Refunds due to renewal cycle.", bold: ["22%", "Billing & Refunds"] },
        { text: "High frustration detected in 3 tickets related to Enterprise Login.", bold: ["frustration", "Enterprise Login"] },
        { text: "Sentiment remains positive (85%) in Technical Support panel.", bold: ["85%", "Technical Support"] }
    ],
    riskScores: [
        { name: "Billing & Refunds", score: 72, level: "Elevated", description: "Critical volume growth in last 4h.", color: "border-l-amber-500", hasJumped: true },
        { name: "Enterprise Access", score: 88, level: "High Risk", description: "OIDC timeout issues escalating.", color: "border-l-red-500", hasJumped: false },
        { name: "Technical Support", score: 12, level: "Nominal", description: "Stable processing across all regions.", color: "border-l-emerald-500", hasJumped: false }
    ],
    criticalTickets: [
        {
            ticket_id: "#T-9241",
            summary: "Enterprise Login Timeout",
            desc: "Users reporting 504 errors on Google OIDC login.",
            panel: "Account Access",
            resolved: false,
            ikc_found: false,
            date: "2026-02-15",
            aging: "4h 12m",
            agingColor: "red",
            sentiment: { score: 4.8, label: "Negative", keywords: ["login", "unacceptable", "waiting"] },
            ai_reasoning: "Customer frustration dropped 40% after 2 template replies.",
            impact: ["Revenue Risk", "High Priority"]
        }
    ],
    metrics: [], // populated via getMetricData in actual use
    generatedAt: "08:00 AM"
};

export const MOCK_TRENDS: TrendData[] = [
    {
        trend_id: "TR-101",
        title: "Double Billing on Renewal",
        state: "ESCALATING",
        ticket_count: 45,
        affected_panels: ["Billing"],
        root_cause: "Stripe Webhook Latency > 500ms",
        confidence: 92,
        needs_escalation: true,
        growth_percentage: 25,
        first_seen: "2026-02-14",
        last_seen: "2026-02-15"
    }
];

export const MOCK_METRICS: MetricData[] = [
    { label: "Daily Volume", value: "1,242", trend: "+12.5%", trendDirection: "up", status: "warning", sparklineData: "10,20,15,30,25,40,35", sparklineColor: "#f59e0b" },
    { label: "Avg Sentiment", value: "4.2", trend: "-2.1%", trendDirection: "down", status: "neutral", sparklineData: "4.5,4.3,4.4,4.2,4.1,4.2,4.2", sparklineColor: "#64748b" },
    { label: "SLA Adherence", value: "94%", trend: "+0.8%", trendDirection: "up", status: "success", sparklineData: "90,92,91,93,94,94,95", sparklineColor: "#10b981" },
    { label: "Risk Tickets", value: "12", trend: "-3", trendDirection: "down", status: "error", sparklineData: "15,14,18,12,10,12,12", sparklineColor: "#ef4444" }
];

export const MOCK_QUALITY: QualityData = {
    qualitySignals: {
        score: 88,
        redundant_replies: 14,
        process_flagged: []
    },
    coachingOpportunities: [
        "Improve empathy markers in Billing responses.",
        "Reduce technical jargon in Onboarding tickets.",
        "Use 'Step-by-step' formatting for billing queries."
    ]
};

// Add metrics to the mock dashboard
MOCK_DASHBOARD.metrics = MOCK_METRICS;
