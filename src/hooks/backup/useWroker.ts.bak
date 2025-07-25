import { useQuery } from '@tanstack/react-query';
import { getWorker } from '@/api/worker';

export const useWorker = () => {
    return useQuery({
        queryKey: ['worker'],
        queryFn: getWorker,
    });
};
