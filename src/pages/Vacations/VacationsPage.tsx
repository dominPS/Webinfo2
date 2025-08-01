import React from 'react';
import { Typography, Box } from '@mui/material';
import { useVacationData } from '../../features/vacations/hooks/useVacationData';
import { useVacationTranslations } from '../../features/vacations/hooks/useVacationTranslations';
import { usePrint } from '../../features/attendanceList/hooks/usePrint';
import { 
  TabNavigation, 
  LoadingErrorWrapper,
  LimitedVacationsTable,
  ApprovedPlanTable,
  VacationHistoryTable,
  CancelledHistoryTable
} from '../../features/vacations/components';

interface VacationsPageProps {
  translationKey?: string;
}

const VacationsPage: React.FC<VacationsPageProps> = () => {
  const { t } = useVacationTranslations();
  const { printTable } = usePrint();
  const { 
    activeTab, 
    setActiveTab, 
    data, 
    loading, 
    errors, 
    actions 
  } = useVacationData();

  // Print function that uses the correct table ID based on active tab
  const handlePrint = () => {
    const tableIds = {
      limitedVacations: 'limited-vacations-table',
      approvedPlan: 'approved-plan-table',
      vacationHistory: 'vacation-history-table',
      cancelledHistory: 'cancelled-history-table'
    };

    const titles = {
      limitedVacations: t('Vacations.Tabs.LimitedVacations.Label', 'Urlopy limitowane do wykorzystania'),
      approvedPlan: t('Vacations.Tabs.ApprovedPlan.Label', `Zatwierdzony plan urlopowy (${new Date().getFullYear()})`).replace('{currentYear}', new Date().getFullYear().toString()),
      vacationHistory: t('Vacations.Tabs.VacationHistory.Label', 'Historia urlopów'),
      cancelledHistory: t('Vacations.Tabs.CancelledHistory.Label', 'Historia anulowanych urlopów')
    };

    const tableId = tableIds[activeTab as keyof typeof tableIds];
    const title = `${t('Vacations.Title', 'Urlopy')} - ${titles[activeTab as keyof typeof titles]}`;

    if (tableId) {
      printTable(tableId, { 
        title,
        orientation: 'landscape',
        showDate: true,
        showTime: true
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'limitedVacations':
        return <LimitedVacationsTable vacations={data.limitedVacations} />;
      case 'approvedPlan':
        return <ApprovedPlanTable vacations={data.approvedPlan} />;
      case 'vacationHistory':
        return <VacationHistoryTable vacations={data.vacationHistory} />;
      case 'cancelledHistory':
        return <CancelledHistoryTable vacations={data.cancelledHistory} />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const titles = {
      limitedVacations: t('Vacations.Tabs.LimitedVacations.Label', 'Urlopy limitowane do wykorzystania'),
      approvedPlan: t('Vacations.Tabs.ApprovedPlan.Label', `Zatwierdzony plan urlopowy (${new Date().getFullYear()})`).replace('{currentYear}', new Date().getFullYear().toString()),
      vacationHistory: t('Vacations.Tabs.VacationHistory.Label', 'Historia urlopów'),
      cancelledHistory: t('Vacations.Tabs.CancelledHistory.Label', 'Historia anulowanych urlopów')
    };
    
    return titles[activeTab];
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
        {getPageTitle()}
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
            limitedVacations: data.limitedVacations.length,
            approvedPlan: data.approvedPlan.length,
            vacationHistory: data.vacationHistory.length,
            cancelledHistory: data.cancelledHistory.length
          }}
        />
        
        <Box>
          {renderTabContent()}
        </Box>
      </LoadingErrorWrapper>
    </div>
  );
};

export default VacationsPage;
