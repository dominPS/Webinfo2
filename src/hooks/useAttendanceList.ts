import { useState, useCallback, useEffect, useRef } from 'react';
import { getAttendanceList, getAttendanceListWithCode } from '@/api/attendance';
import type { AttendanceWorkerListModel } from '@/schemas/AttendanceWorkerListModel';

interface UseAttendanceListReturn {
    data: AttendanceWorkerListModel | null;
    error: Error | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

// Cache storage
const cache = new Map<string, { data: AttendanceWorkerListModel; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const useAttendanceList = (code?: string, enabled: boolean = true): UseAttendanceListReturn => {
    const [data, setData] = useState<AttendanceWorkerListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasInitialized = useRef(false);

    const cacheKey = `attendance-list-${code || 'default'}`;

    const fetchData = useCallback(async (forceRefresh: boolean = false) => {
        if (!enabled) return;
        
        // Check cache first
        if (!forceRefresh) {
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setData(cached.data);
                setError(null);
                return;
            }
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            const result = code ? 
                await getAttendanceListWithCode(code) : 
                await getAttendanceList();
                
            setData(result);
            
            // Store in cache
            cache.set(cacheKey, { data: result, timestamp: Date.now() });
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Nieznany błąd');
            setError(error);
            console.error('Error fetching attendance list:', error);
        } finally {
            setIsLoading(false);
        }
    }, [code, enabled, cacheKey]);

    const refetch = useCallback(async () => {
        if (enabled) {
            await fetchData(true); // Force refresh
        }
    }, [fetchData, enabled]);

    // Initial data fetch - only load from cache or if no cache exists
    useEffect(() => {
        if (enabled && !hasInitialized.current) {
            hasInitialized.current = true;
            
            // Try cache first
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setData(cached.data);
                setError(null);
            } else {
                // Only fetch if no valid cache
                fetchData(false);
            }
        }
    }, [enabled, cacheKey, fetchData]);

    return {
        data,
        error,
        isLoading,
        refetch
    };
};