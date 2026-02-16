import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useMetrics() {
    return useQuery({
        queryKey: ['metrics'],
        queryFn: api.getMetrics,
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
}
