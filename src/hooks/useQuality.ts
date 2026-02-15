import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { MOCK_QUALITY } from '../lib/mockData';

export function useQuality() {
    return useQuery({
        queryKey: ['quality'],
        queryFn: api.getQualityData,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        placeholderData: MOCK_QUALITY
    });
}
