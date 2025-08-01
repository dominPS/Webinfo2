import React from 'react';
import { Box, Button } from '@mui/material';
import { useAttendanceTranslations } from '../hooks/useAttendanceTranslations';
import type { TabType } from '../hooks/useAttendanceData';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRefresh: () => void;
  onPrint: () => void;
  isLoading: boolean;
  counts: {
    employees: number;
    guests: number;
    presentGuests: number;
    vehicles: number;
  };
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  onRefresh,
  onPrint,
  isLoading,
  counts
}) => {
  const { t } = useAttendanceTranslations();

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Button 
          variant={activeTab === 'employees' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('employees')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Employees.Label', 'Pracownicy')} ({counts.employees})
        </Button>
        <Button 
          variant={activeTab === 'guests' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('guests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.Guests.Label', 'Goście')} ({counts.guests})
        </Button>
        <Button 
          variant={activeTab === 'presentGuests' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('presentGuests')}
          sx={{ mr: 1 }}
        >
          {t('AttendanceList.Tabs.PresentGuests.Label', 'Obecni goście')} ({counts.presentGuests})
        </Button>
        <Button 
          variant={activeTab === 'vehicles' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('vehicles')}
        >
          {t('AttendanceList.Tabs.Vehicles.Label', 'Pojazdy')} ({counts.vehicles})
        </Button>
      </Box>
      <Box>
        <Button 
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={onRefresh}
          disabled={isLoading}
        >
          {t('AttendanceList.Refresh', 'ODŚWIEŻ')}
        </Button>
        <Button 
          variant="outlined"
          onClick={onPrint}
          disabled={isLoading}
        >
          {t('AttendanceList.Print.Button', 'DRUKUJ')}
        </Button>
      </Box>
    </Box>
  );
};
