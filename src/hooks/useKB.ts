import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useKB() {
    return useQuery({
        queryKey: ['kb'],
        queryFn: api.getKB,
        staleTime: 60 * 60 * 1000, // 1 hour stale time as KB doesn't change often
        retry: 1,
    });
}
