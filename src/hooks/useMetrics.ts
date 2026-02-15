import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOCK_METRICS } from '../lib/mockData';

export function useMetrics() {
    return useQuery({
        queryKey: ['metrics'],
        queryFn: api.getMetrics,
        staleTime: 2 * 60 * 1000,
        retry: 1,
        placeholderData: { metrics: MOCK_METRICS }
    });
}
