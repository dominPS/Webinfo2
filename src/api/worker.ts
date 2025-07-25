import { api } from '@/services/authServices';
import { WorkerModelSchema } from '@/schemas/WorkerModel';
import type { WorkerModel } from '@/schemas/WorkerModel';
import axios from 'axios';
import { eventPath } from '@/routes/eventPath'; // if you already define paths here

import { ApiError } from '@/api/user'; // reuse your existing ApiError

export const getWorker = async (): Promise<WorkerModel> => {
    try {
        const response = await api.get(eventPath.worker.path); // <— adjust the path
        return WorkerModelSchema.parse(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};