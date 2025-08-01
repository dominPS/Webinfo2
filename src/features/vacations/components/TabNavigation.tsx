import React from 'react';
import { Box, Button } from '@mui/material';
import { Refresh as RefreshIcon, Print as PrintIcon } from '@mui/icons-material';
import { useVacationTranslations } from '../hooks/useVacationTranslations';
import type { VacationTabType } from '../hooks/useVacationData';

interface TabNavigationProps {
  activeTab: VacationTabType;
  onTabChange: (tab: VacationTabType) => void;
  onRefresh: () => void;
  onPrint: () => void;
  isLoading: boolean;
  counts: {
    limitedVacations: number;
    approvedPlan: number;
    vacationHistory: number;
    cancelledHistory: number;
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
  const { t } = useVacationTranslations();

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Button 
          variant={activeTab === 'limitedVacations' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('limitedVacations')}
          sx={{ mr: 1 }}
        >
          {t('Vacations.Tabs.LimitedVacations.Label', 'Urlopy limitowane do wykorzystania')}
        </Button>
        <Button 
          variant={activeTab === 'approvedPlan' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('approvedPlan')}
          sx={{ mr: 1 }}
        >
          {t('Vacations.Tabs.ApprovedPlan.Label', `Zatwierdzony plan urlopowy (${new Date().getFullYear()})`).replace('{currentYear}', new Date().getFullYear().toString())}
        </Button>
        <Button 
          variant={activeTab === 'vacationHistory' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('vacationHistory')}
          sx={{ mr: 1 }}
        >
          {t('Vacations.Tabs.VacationHistory.Label', 'Historia urlopów')}
        </Button>
        <Button 
          variant={activeTab === 'cancelledHistory' ? 'contained' : 'outlined'}
          onClick={() => onTabChange('cancelledHistory')}
        >
          {t('Vacations.Tabs.CancelledHistory.Label', 'Historia anulowanych urlopów')}
        </Button>
      </Box>
      <Box>
        <Button 
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={onRefresh}
          disabled={isLoading}
          startIcon={<RefreshIcon />}
        >
          {t('Vacations.Refresh', 'ODŚWIEŻ')}
        </Button>
        <Button 
          variant="outlined"
          onClick={onPrint}
          disabled={isLoading}
          startIcon={<PrintIcon />}
        >
          {t('Vacations.Print.Button', 'DRUKUJ')}
        </Button>
      </Box>
    </Box>
  );
};
