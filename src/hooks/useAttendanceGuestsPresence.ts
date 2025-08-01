import { useState, useEffect, useCallback, useRef } from 'react';
import { getAttendanceGuestsPresenceList } from '@/api/attendance';
import type { AttendanceGuestPresenceListModel } from '@/schemas/AttendanceWorkerListModel';

// Cache storage
const cache = new Map<string, { data: AttendanceGuestPresenceListModel; timestamp: number }>();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes cache (presence data changes more frequently)

export const useAttendanceGuestsPresence = (enabled: boolean = true) => {
    const [data, setData] = useState<AttendanceGuestPresenceListModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasInitialized = useRef(false);

    const cacheKey = 'attendance-guests-presence';

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
            const result = await getAttendanceGuestsPresenceList();
            setData(result);
            
            // Store in cache
            cache.set(cacheKey, { data: result, timestamp: Date.now() });
        } catch (err) {
            console.error('Error fetching attendance guests presence data:', err);
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