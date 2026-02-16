import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: api.getDashboard,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}
