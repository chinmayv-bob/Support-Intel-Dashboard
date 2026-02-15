import type { DashboardResponse, TrendData, QualityData, MetricData } from './types';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

async function apiFetch<T>(params: Record<string, string>): Promise<T> {
    if (!APPS_SCRIPT_URL) {
        throw new Error('VITE_APPS_SCRIPT_URL is not defined in .env');
    }

    const queryParams = new URLSearchParams(params);
    const url = `${APPS_SCRIPT_URL}?${queryParams.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            if (text.includes('Script function not found: doGet')) {
                throw new Error('Backend Error: The Google Apps Script is not deployed as a Web App or is missing a doGet() function.');
            }
            throw new Error(`API Error: Expected JSON but received ${contentType || 'unknown content'}`);
        }

        const json = await response.json();

        // Handle explicit errors returned from the backend JSON
        if (json && typeof json === 'object' && 'error' in json) {
            throw new Error(`Backend API Error: ${json.error}`);
        }

        return json as T;
    } catch (error) {
        console.error('API Fetch failed:', error);
        throw error;
    }
}

export const api = {
    getDashboard: () => apiFetch<DashboardResponse>({ action: 'getDashboard' }),
    getTrends: () => apiFetch<{ trends: TrendData[] }>({ action: 'getTrends' }),
    getQualityData: () => apiFetch<QualityData>({ action: 'getQualityData' }),
    getMetrics: () => apiFetch<{ metrics: MetricData[] }>({ action: 'getMetrics' }),
};
