import { api } from '@/services/authServices';
import { VacationModelSchema } from '@/schemas/VacationModel';
import type { VacationModel } from '@/schemas/VacationModel';
import axios from 'axios';
import { ApiError } from '@/api/user';

export const getVacationData = async (code?: string): Promise<VacationModel> => {
    try {
        const params = code ? { code } : {};
        console.log('Fetching vacation data from:', '/Vacancy/VacancyJson', params);
        const response = await api.get('/Vacancy/VacancyJson', { params });
        console.log('Vacation API response:', response.data);
        
        // Detailed logging to see structure
        if (response.data) {
            console.log('VacancyInfo:', response.data.VacancyInfo);
            console.log('VacancyPlan:', response.data.VacancyPlan);
            console.log('VacancyHistory:', response.data.VacancyHistory);
            console.log('VacanciesRevoked:', response.data.VacanciesRevoked);
            
            if (response.data.VacancyHistory?.Vacancies?.length > 0) {
                console.log('First vacation element structure:', response.data.VacancyHistory.Vacancies[0]);
                console.log('First vacation element keys:', Object.keys(response.data.VacancyHistory.Vacancies[0]));
            }
            
            if (response.data.VacanciesRevoked?.length > 0) {
                console.log('First revoked vacation element structure:', response.data.VacanciesRevoked[0]);
                console.log('First revoked vacation element keys:', Object.keys(response.data.VacanciesRevoked[0]));
            }
        }
        
        return VacationModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getVacationData:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};
