import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { 
  getAttendanceList, 
  getAttendanceGuestsList, 
  getAttendanceGuestsPresenceList, 
  getAttendanceVehiclesList 
} from '../api/attendance';

// Define query keys locally
const attendanceQueryKeys = {
  employees: ['attendance', 'employees'],
  guests: ['attendance', 'guests'],
  guestsPresence: ['attendance', 'guestsPresence'],
  vehicles: ['attendance', 'vehicles'],
} as const;

/**
 * Hook for prefetching attendance data in background
 * This provides instant loading when switching tabs
 */
export const useAttendancePrefetch = (activeTab: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch other tabs data when user switches to a tab
    const prefetchDelay = 1000; // Wait 1 second before prefetching

    const prefetchTimer = setTimeout(() => {
      // Prefetch only if we don't have cached data
      if (activeTab === 'employees') {
        // Prefetch guests data
        queryClient.prefetchQuery({
          queryKey: attendanceQueryKeys.guests,
          queryFn: getAttendanceGuestsList,
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
      } else if (activeTab === 'guests') {
        // Prefetch employees and guest presence
        queryClient.prefetchQuery({
          queryKey: attendanceQueryKeys.employees,
          queryFn: getAttendanceList,
          staleTime: 5 * 60 * 1000,
        });
        queryClient.prefetchQuery({
          queryKey: attendanceQueryKeys.guestsPresence,
          queryFn: getAttendanceGuestsPresenceList,
          staleTime: 3 * 60 * 1000,
        });
      } else if (activeTab === 'presentGuests') {
        // Prefetch vehicles
        queryClient.prefetchQuery({
          queryKey: attendanceQueryKeys.vehicles,
          queryFn: getAttendanceVehiclesList,
          staleTime: 10 * 60 * 1000,
        });
      }
    }, prefetchDelay);

    return () => clearTimeout(prefetchTimer);
  }, [activeTab, queryClient]);
};

/**
 * Hook for optimistic cache updates
 * Provides instant feedback for refresh operations
 */
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticRefresh = async (queryKey: readonly unknown[]) => {
    // Mark query as fetching immediately for better UX
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (oldData) {
        return { ...oldData, _refreshing: true };
      }
      return oldData;
    });

    // Invalidate and refetch
    return queryClient.invalidateQueries({ queryKey });
  };

  return { optimisticRefresh };
};
