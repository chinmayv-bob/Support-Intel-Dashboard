export interface SentimentData {
    score: number;
    label: string;
    keywords: string[];
}

export interface Ticket {
    ticket_id: string;
    summary: string;
    desc?: string;
    panel: string;
    resolved: boolean;
    ikc_found: boolean;
    date: string;
    aging?: string;
    agingColor?: 'red' | 'amber' | 'slate';
    sentiment?: SentimentData;
    ai_reasoning?: string;
    impact?: string[];
}

export interface MetricData {
    label: string;
    value: string | number;
    trend: string;
    trendDirection: 'up' | 'down' | 'stable';
    status: 'success' | 'warning' | 'error' | 'neutral';
    sparklineData: string;
    sparklineColor: string;
}

export interface RiskScore {
    name: string;
    score: number;
    level: 'High Risk' | 'Elevated' | 'Nominal';
    description: string;
    color: string;
    hasJumped: boolean;
}

export interface TrendData {
    trend_id: string;
    title: string;
    state: 'NEW' | 'RECURRING' | 'ESCALATING' | 'DECLINING';
    ticket_count: number;
    affected_panels: string[];
    ticket_ids: string[];
    root_cause: string;
    confidence: number;
    needs_escalation: boolean;
    growth_percentage: number;
    first_seen: string;
    last_seen: string;
}

export interface DailyBrief {
    text: string;
    bold: string[];
    type?: 'risk' | 'metric' | 'bot' | 'general';
    icon?: string;
}

export interface DashboardResponse {
    dailyBrief: DailyBrief[];
    riskScores: RiskScore[];
    criticalTickets: Ticket[];
    metrics: MetricData[];
    generatedAt: string;
}


export interface QualityData {
    qualitySignals: any;
    coachingOpportunities: string[];
}

export interface KBArticle {
    kb_id: string;
    title: string;
    problem_statement: string;
    resolution_steps: string;
    panels_affected: string[];
    keywords: string[];
}

export interface KBFAQ {
    question: string;
    answer: string;
    panel: string;
    keywords: string[];
}

export interface KBData {
    articles: KBArticle[];
    faqs: KBFAQ[];
}
