import { useState, useEffect, useCallback, useRef } from 'react';
import { getAttendanceVehiclesList } from '@/api/attendance';
import type { AttendanceVehicleListModel } from '@/schemas/AttendanceWorkerListModel';

// Cache storage
const cache = new Map<string, { data: AttendanceVehicleListModel; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache (vehicles change less frequently)

export const useAttendanceVehicles = (enabled: boolean = true) => {
    const [data, setData] = useState<AttendanceVehicleListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasInitialized = useRef(false);

    const cacheKey = 'attendance-vehicles';

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
            const result = await getAttendanceVehiclesList();
            setData(result);
            
            // Store in cache
            cache.set(cacheKey, { data: result, timestamp: Date.now() });
        } catch (err) {
            console.error('Error fetching attendance vehicles data:', err);
            setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, [enabled, cacheKey]);

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

    const refetch = useCallback(() => {
        if (enabled) {
            fetchData(true); // Force refresh
        }
    }, [fetchData, enabled]);

    return {
        data,
        error,
        isLoading,
        refetch
    };
};