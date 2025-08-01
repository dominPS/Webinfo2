import { useState, useEffect, useCallback } from 'react';
import { getAttendanceVehiclesList } from '@/api/attendance';
import type { AttendanceVehicleListModel } from '@/schemas/AttendanceWorkerListModel';

export const useAttendanceVehicles = () => {
    const [data, setData] = useState<AttendanceVehicleListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await getAttendanceVehiclesList();
            setData(result);
        } catch (err) {
            console.error('Error fetching attendance vehicles data:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        error,
        isLoading,
        refetch
    };
};