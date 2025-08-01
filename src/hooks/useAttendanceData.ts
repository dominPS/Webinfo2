import { useQuery } from '@tanstack/react-query';
import { 
  getAttendanceList, 
  getAttendanceGuestsList, 
  getAttendanceGuestsPresenceList, 
  getAttendanceVehiclesList 
} from '../api/attendance';
import type { 
  AttendanceWorkerListModel, 
  AttendanceGuestListModel, 
  AttendanceGuestPresenceListModel, 
  AttendanceVehicleListModel 
} from '../schemas/AttendanceWorkerListModel';

// Query keys for cache management
export const attendanceQueryKeys = {
  employees: ['attendance', 'employees'] as const,
  guests: ['attendance', 'guests'] as const,
  guestsPresence: ['attendance', 'guests-presence'] as const,
  vehicles: ['attendance', 'vehicles'] as const,
} as const;

// Hook for employees data
export const useAttendanceEmployees = (enabled: boolean = true) => {
  return useQuery<AttendanceWorkerListModel>({
    queryKey: attendanceQueryKeys.employees,
    queryFn: getAttendanceList,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for guests data
export const useAttendanceGuests = (enabled: boolean = true) => {
  return useQuery<AttendanceGuestListModel>({
    queryKey: attendanceQueryKeys.guests,
    queryFn: getAttendanceGuestsList,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for guests presence data
export const useAttendanceGuestsPresence = (enabled: boolean = true) => {
  return useQuery<AttendanceGuestPresenceListModel>({
    queryKey: attendanceQueryKeys.guestsPresence,
    queryFn: getAttendanceGuestsPresenceList,
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes (presence data changes more frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for vehicles data
export const useAttendanceVehicles = (enabled: boolean = true) => {
  return useQuery<AttendanceVehicleListModel>({
    queryKey: attendanceQueryKeys.vehicles,
    queryFn: getAttendanceVehiclesList,
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes (vehicles change less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Combined hook with prefetching for better UX
export const useAttendanceDataManager = (activeTab: string) => {
  // Only load data for active tab initially
  const employees = useAttendanceEmployees(activeTab === 'employees');
  const guests = useAttendanceGuests(activeTab === 'guests');
  const guestsPresence = useAttendanceGuestsPresence(activeTab === 'presentGuests');
  const vehicles = useAttendanceVehicles(activeTab === 'vehicles');

  // Combined loading state
  const isLoading = employees.isLoading || guests.isLoading || guestsPresence.isLoading || vehicles.isLoading;
  
  // Combined error state
  const error = employees.error || guests.error || guestsPresence.error || vehicles.error;

  // Refetch all function
  const refetchAll = async () => {
    await Promise.all([
      employees.refetch(),
      guests.refetch(),
      guestsPresence.refetch(),
      vehicles.refetch()
    ]);
  };

  return {
    employees: {
      data: employees.data,
      error: employees.error,
      isLoading: employees.isLoading,
      refetch: employees.refetch
    },
    guests: {
      data: guests.data,
      error: guests.error,
      isLoading: guests.isLoading,
      refetch: guests.refetch
    },
    guestsPresence: {
      data: guestsPresence.data,
      error: guestsPresence.error,
      isLoading: guestsPresence.isLoading,
      refetch: guestsPresence.refetch
    },
    vehicles: {
      data: vehicles.data,
      error: vehicles.error,
      isLoading: vehicles.isLoading,
      refetch: vehicles.refetch
    },
    // Combined states
    isLoading,
    error,
    refetchAll
  };
};
