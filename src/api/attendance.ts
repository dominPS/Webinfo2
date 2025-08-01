import { api } from '@/services/authServices';
import { 
    AttendanceWorkerListModelSchema, 
    AttendanceGuestListModelSchema, 
    AttendanceGuestPresenceListModelSchema, 
    AttendanceVehicleListModelSchema 
} from '@/schemas/AttendanceWorkerListModel';
import type { 
    AttendanceWorkerListModel, 
    AttendanceGuestListModel, 
    AttendanceGuestPresenceListModel, 
    AttendanceVehicleListModel 
} from '@/schemas/AttendanceWorkerListModel';
import axios from 'axios';
import { ApiError } from '@/api/user';

export const getAttendanceList = async (): Promise<AttendanceWorkerListModel> => {
    try {
        console.log('Fetching attendance list data from:', '/AttendanceList/AttendanceListJson');
        const response = await api.get('/AttendanceList/AttendanceListJson');
        console.log('Attendance List API response:', response.data);
        return AttendanceWorkerListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceList:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

export const getAttendanceListWithCode = async (code?: string): Promise<AttendanceWorkerListModel> => {
    try {
        const params = code ? { code } : {};
        console.log('Fetching attendance list with code:', params);
        const response = await api.get('/AttendanceList/AttendanceListJson', { params });
        console.log('Attendance List with code API response:', response.data);
        return AttendanceWorkerListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceListWithCode:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

// POPRAWKA - Add detailed logging to see actual structure
export const getAttendanceGuestsList = async (): Promise<AttendanceGuestListModel> => {
    try {
        console.log('Fetching attendance guests list data from:', '/AttendanceList/GuestsListJson');
        const response = await api.get('/AttendanceList/GuestsListJson');
        console.log('Attendance Guests List API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First guest element structure:', response.data.Elements[0]);
            console.log('First guest element keys:', Object.keys(response.data.Elements[0]));
            console.log('First 3 guest elements:', response.data.Elements.slice(0, 3));
        }
        
        return AttendanceGuestListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceGuestsList:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

export const getAttendanceGuestsListWithCode = async (code?: string): Promise<AttendanceGuestListModel> => {
    try {
        const params = code ? { code } : {};
        console.log('Fetching attendance guests list with code:', params);
        const response = await api.get('/AttendanceList/GuestsListJson', { params });
        console.log('Attendance Guests List with code API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First guest element structure:', response.data.Elements[0]);
            console.log('First guest element keys:', Object.keys(response.data.Elements[0]));
        }
        
        return AttendanceGuestListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceGuestsListWithCode:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

// POPRAWKA - Add detailed logging for guest presence
export const getAttendanceGuestsPresenceList = async (): Promise<AttendanceGuestPresenceListModel> => {
    try {
        console.log('Fetching attendance guests presence list data from:', '/AttendanceList/GuestsPresenceListJson');
        const response = await api.get('/AttendanceList/GuestsPresenceListJson');
        console.log('Attendance Guests Presence List API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First guest presence element structure:', response.data.Elements[0]);
            console.log('First guest presence element keys:', Object.keys(response.data.Elements[0]));
        }
        
        return AttendanceGuestPresenceListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceGuestsPresenceList:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

export const getAttendanceGuestsPresenceListWithCode = async (code?: string): Promise<AttendanceGuestPresenceListModel> => {
    try {
        const params = code ? { code } : {};
        console.log('Fetching attendance guests presence list with code:', params);
        const response = await api.get('/AttendanceList/GuestsPresenceListJson', { params });
        console.log('Attendance Guests Presence List with code API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First guest presence element structure:', response.data.Elements[0]);
            console.log('First guest presence element keys:', Object.keys(response.data.Elements[0]));
        }
        
        return AttendanceGuestPresenceListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceGuestsPresenceListWithCode:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

// POPRAWKA - Add detailed logging for vehicles
export const getAttendanceVehiclesList = async (): Promise<AttendanceVehicleListModel> => {
    try {
        console.log('Fetching attendance vehicles list data from:', '/AttendanceList/VehiclesListJson');
        const response = await api.get('/AttendanceList/VehiclesListJson');
        console.log('Attendance Vehicles List API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First vehicle element structure:', response.data.Elements[0]);
            console.log('First vehicle element keys:', Object.keys(response.data.Elements[0]));
        }
        
        return AttendanceVehicleListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceVehiclesList:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany błąd');
    }
};

export const getAttendanceVehiclesListWithCode = async (code?: string): Promise<AttendanceVehicleListModel> => {
    try {
        const params = code ? { code } : {};
        console.log('Fetching attendance vehicles list with code:', params);
        const response = await api.get('/AttendanceList/VehiclesListJson', { params });
        console.log('Attendance Vehicles List with code API response:', response.data);
        
        // DODANO - Log first few elements to see structure
        if (response.data.Elements && response.data.Elements.length > 0) {
            console.log('First vehicle element structure:', response.data.Elements[0]);
            console.log('First vehicle element keys:', Object.keys(response.data.Elements[0]));
        }
        
        return AttendanceVehicleListModelSchema.parse(response.data);
    } catch (error: unknown) {
        console.error('Error in getAttendanceVehiclesListWithCode:', error);
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.message, error.response?.status);
        }
        if (error instanceof Error) {
            throw new ApiError(error.message);
        }
        throw new ApiError('Nieznany b��d');
    }
};