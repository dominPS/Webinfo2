import { useState, useEffect, useCallback } from 'react';
import { getAttendanceGuestsList } from '@/api/attendance';
import type { AttendanceGuestListModel } from '@/schemas/AttendanceWorkerListModel';

export const useAttendanceGuests = () => {
    const [data, setData] = useState<AttendanceGuestListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await getAttendanceGuestsList();
            setData(result);
        } catch (err) {
            console.error('Error fetching attendance guests data:', err);
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