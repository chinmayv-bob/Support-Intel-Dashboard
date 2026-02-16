import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTrends() {
    return useQuery({
        queryKey: ['trends'],
        queryFn: api.getTrends,
        staleTime: 10 * 60 * 1000,
        retry: 1,
    });
}
