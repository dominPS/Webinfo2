import { useQuery } from '@tanstack/react-query';
import { getWorker } from '@/api/worker';

export const useWorker = () => {
    return useQuery({
        queryKey: ['worker'],
        queryFn: getWorker,
        staleTime: 5 * 60 * 1000, // 5 minut - dane uznawane za świeże
        gcTime: 30 * 60 * 1000 // 30 minut - dane trzymane w cache (React Query v5+ uses gcTime)
    });
};
