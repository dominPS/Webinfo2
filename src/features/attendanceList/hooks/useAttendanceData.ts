import { useState } from 'react';
import { 
  useAttendanceEmployees,
  useAttendanceGuests,
  useAttendanceGuestsPresence,
  useAttendanceVehicles
} from '@/hooks/useAttendanceData';

export type TabType = 'employees' | 'guests' | 'presentGuests' | 'vehicles';

export const useAttendanceData = () => {
  const [activeTab, setActiveTab] = useState<TabType>('employees');

  // API hooks with lazy loading
  const { 
    data: attendanceData, 
    error: attendanceError, 
    isLoading: attendanceLoading, 
    refetch: attendanceRefetch 
  } = useAttendanceEmployees(activeTab === 'employees');

  const { 
    data: guestsData, 
    error: guestsError, 
    isLoading: guestsLoading, 
    refetch: guestsRefetch 
  } = useAttendanceGuests(activeTab === 'guests');

  const { 
    data: guestsPresenceData, 
    error: guestsPresenceError, 
    isLoading: guestsPresenceLoading, 
    refetch: guestsPresenceRefetch 
  } = useAttendanceGuestsPresence(activeTab === 'presentGuests');

  const { 
    data: vehiclesData, 
    error: vehiclesError, 
    isLoading: vehiclesLoading, 
    refetch: vehiclesRefetch 
  } = useAttendanceVehicles(activeTab === 'vehicles');

  // Extract data
  const employees = attendanceData?.Elements || [];
  const guests = guestsData?.Elements || [];
  const presentGuests = guestsPresenceData?.Elements || [];
  const vehicles = vehiclesData?.Elements || [];

  // Loading and error states
  const isAnyLoading = attendanceLoading || guestsLoading || guestsPresenceLoading || vehiclesLoading;
  const hasAnyError = attendanceError || guestsError || guestsPresenceError || vehiclesError;
  const errorMessage = attendanceError?.message || guestsError?.message || 
                      guestsPresenceError?.message || vehiclesError?.message;

  // Refresh all data
  const handleRefreshAll = async () => {
    await Promise.all([
      attendanceRefetch(),
      guestsRefetch(),
      guestsPresenceRefetch(),
      vehiclesRefetch()
    ]);
  };

  return {
    activeTab,
    setActiveTab,
    data: {
      employees,
      guests,
      presentGuests,
      vehicles
    },
    loading: {
      isAnyLoading,
      attendanceLoading,
      guestsLoading,
      guestsPresenceLoading,
      vehiclesLoading
    },
    errors: {
      hasAnyError,
      errorMessage,
      attendanceError,
      guestsError,
      guestsPresenceError,
      vehiclesError
    },
    actions: {
      handleRefreshAll
    }
  };
};
