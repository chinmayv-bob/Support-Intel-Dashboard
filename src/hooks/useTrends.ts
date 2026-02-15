import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOCK_TRENDS } from '../lib/mockData';

export function useTrends() {
    return useQuery({
        queryKey: ['trends'],
        queryFn: api.getTrends,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        placeholderData: { trends: MOCK_TRENDS }
    });
}
