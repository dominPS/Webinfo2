import { useState, useCallback, useEffect } from 'react';
import { getAttendanceList, getAttendanceListWithCode } from '@/api/attendance';
import type { AttendanceWorkerListModel } from '@/schemas/AttendanceWorkerListModel';

interface UseAttendanceListReturn {
    data: AttendanceWorkerListModel | null;
    error: Error | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

export const useAttendanceList = (code?: string): UseAttendanceListReturn => {
    const [data, setData] = useState<AttendanceWorkerListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const result = code ? 
                await getAttendanceListWithCode(code) : 
                await getAttendanceList();
                
            setData(result);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Nieznany b³¹d');
            setError(error);
            console.error('Error fetching attendance list:', error);
        } finally {
            setIsLoading(false);
        }
    }, [code]);

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        error,
        isLoading,
        refetch
    };
};