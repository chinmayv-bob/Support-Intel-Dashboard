import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOCK_DASHBOARD } from '../lib/mockData';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: api.getDashboard,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        placeholderData: MOCK_DASHBOARD
    });
}
