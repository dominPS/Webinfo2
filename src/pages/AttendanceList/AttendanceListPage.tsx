import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAttendanceData } from '../../features/attendanceList/hooks/useAttendanceData';
import { useAttendanceTranslations } from '../../features/attendanceList/hooks/useAttendanceTranslations';
import { usePrint } from '../../features/attendanceList/hooks/usePrint';
import { TabNavigation } from '../../features/attendanceList/components/TabNavigation';
import { LoadingErrorWrapper } from '../../features/attendanceList/components/LoadingErrorWrapper';
import { EmployeeTable } from '../../features/attendanceList/components/EmployeeTable';
import { GuestTable } from '../../features/attendanceList/components/GuestTable';
import { PresentGuestTable } from '../../features/attendanceList/components/PresentGuestTable';
import { VehicleTable } from '../../features/attendanceList/components/VehicleTable';

interface AttendanceListPageProps {
  translationKey?: string;
}

const AttendanceListPage: React.FC<AttendanceListPageProps> = () => {
  const { t } = useAttendanceTranslations();
  const { printTable } = usePrint();
  const { 
    activeTab, 
    setActiveTab, 
    data, 
    loading, 
    errors, 
    actions 
  } = useAttendanceData();

  // Print function that uses the correct table ID based on active tab
  const handlePrint = () => {
    const tableIds = {
      employees: 'employees-table',
      guests: 'guests-table',
      presentGuests: 'present-guests-table',
      vehicles: 'vehicles-table'
    };

    const titles = {
      employees: t('AttendanceList.Tabs.Employees.Label', 'Pracownicy'),
      guests: t('AttendanceList.Tabs.Guests.Label', 'Goście'),
      presentGuests: t('AttendanceList.Tabs.PresentGuests.Label', 'Obecni goście'),
      vehicles: t('AttendanceList.Tabs.Vehicles.Label', 'Pojazdy')
    };

    const tableId = tableIds[activeTab as keyof typeof tableIds];
    const title = `${t('AttendanceList.Title', 'Lista obecności')} - ${titles[activeTab as keyof typeof titles]}`;

    if (tableId) {
      printTable(tableId, { 
        title,
        orientation: 'landscape',
        showDate: true 
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeTable employees={data.employees} />;
      case 'guests':
        return <GuestTable guests={data.guests} />;
      case 'presentGuests':
        return <PresentGuestTable guests={data.presentGuests} />;
      case 'vehicles':
        return <VehicleTable vehicles={data.vehicles} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          textAlign: 'center', 
          fontFamily: 'Roboto, sans-serif',
          marginTop: '40px',
          marginBottom: '40px',
          fontWeight: 500
        }}
      >
        {t('AttendanceList.Title', 'Lista obecności')}
      </Typography>
      
      <LoadingErrorWrapper
        isLoading={loading.isAnyLoading}
        hasError={!!errors.hasAnyError}
        errorMessage={errors.errorMessage}
      >
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={actions.handleRefreshAll}
          onPrint={handlePrint}
          isLoading={loading.isAnyLoading}
          counts={{
            employees: data.employees.length,
            guests: data.guests.length,
            presentGuests: data.presentGuests.length,
            vehicles: data.vehicles.length
          }}
        />
        
        <Box>
          {renderTabContent()}
        </Box>
      </LoadingErrorWrapper>
    </div>
  );
};

export default AttendanceListPage;