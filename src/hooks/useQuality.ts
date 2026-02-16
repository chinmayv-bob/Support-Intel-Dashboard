import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useQuality() {
    return useQuery({
        queryKey: ['quality'],
        queryFn: api.getQualityData,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}
