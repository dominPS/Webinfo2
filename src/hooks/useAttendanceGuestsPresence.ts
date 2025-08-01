import { useState, useEffect, useCallback } from 'react';
import { getAttendanceGuestsPresenceList } from '@/api/attendance';
import type { AttendanceGuestPresenceListModel } from '@/schemas/AttendanceWorkerListModel';

export const useAttendanceGuestsPresence = () => {
    const [data, setData] = useState<AttendanceGuestPresenceListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await getAttendanceGuestsPresenceList();
            setData(result);
        } catch (err) {
            console.error('Error fetching attendance guests presence data:', err);
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