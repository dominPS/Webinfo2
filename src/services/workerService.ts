import { api } from '@/services/authServices';
import { WorkerModelSchema } from '@/schemas/WorkerModel';
import type { WorkerModel } from '@/schemas/WorkerModel';

export const fetchWorker = async (): Promise<WorkerModel> => {
    try {
        const res = await api.get('/Worker/WorkerJson');
        return WorkerModelSchema.parse(res.data);
    } catch (error) {
        throw new Error('Failed to fetch worker');
    }
};