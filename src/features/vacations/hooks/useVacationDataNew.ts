import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { vacationService } from '../../../services/vacationService';
import type { VacationModel } from '../../../schemas/VacationModel';

export type VacationTabType = 'limitedVacations' | 'approvedPlan' | 'vacationHistory' | 'cancelledHistory';

export interface LimitedVacation {
  id: string;
  code: string;
  parentCode: string;
  limit: number;
  available: number;
  additionalInfo: string;
}

export interface ApprovedVacation {
  id: string;
  absence: string;
  dateFrom: string;
  dateTo: string;
  vacationRequest: string;
}

export interface VacationHistory {
  id: string;
  vacationCode: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  vacationDays: number;
}

export interface CancelledVacation {
  id: string;
  vacationCode: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  vacationDays: number;
}

export interface VacationData {
  limitedVacations: LimitedVacation[];
  approvedPlan: ApprovedVacation[];
  vacationHistory: VacationHistory[];
  cancelledHistory: CancelledVacation[];
}

export interface VacationLoading {
  limitedVacations: boolean;
  approvedPlan: boolean;
  vacationHistory: boolean;
  cancelledHistory: boolean;
  isAnyLoading: boolean;
}

export interface VacationErrors {
  limitedVacations: string | null;
  approvedPlan: string | null;
  vacationHistory: string | null;
  cancelledHistory: string | null;
  hasAnyError: boolean;
  errorMessage: string;
}

export const useVacationData = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<VacationTabType>('limitedVacations');
  const [apiData, setApiData] = useState<VacationModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API data to component format
  const transformedData: VacationData = {
    limitedVacations: apiData?.VacancyInfo?.map(info => ({
      id: info.Code || '',
      code: info.Code || '',
      parentCode: info.Parent || '',
      limit: info.Limit || 0,
      available: info.Left || 0,
      additionalInfo: `${t('Vacations.Used', 'Wykorzystane')}: ${info.Used || 0}`
    })) || [],
    
    approvedPlan: apiData?.VacancyPlan?.Plans?.map(plan => ({
      id: plan.ID?.toString() || '',
      absence: t('Vacations.VacationPlan', 'Plan urlopowy'),
      dateFrom: plan.From || '',
      dateTo: plan.To || '',
      vacationRequest: (plan.Status || t('Vacations.Planned', 'Zaplanowany')).toString()
    })) || [],
    
    vacationHistory: apiData?.VacancyHistory?.Vacancies?.map(vacation => ({
      id: vacation.ID?.toString() || '',
      vacationCode: vacation.AbsenceName || '',
      description: vacation.Comment || '',
      dateFrom: vacation.DateFrom || '',
      dateTo: vacation.DateTo || '',
      vacationDays: vacation.Days || 0
    })) || [],
    
    cancelledHistory: apiData?.VacanciesRevoked?.map(vacation => ({
      id: vacation.ID?.toString() || '',
      vacationCode: vacation.AbsenceName || '',
      description: vacation.Comment || '',
      dateFrom: vacation.DateFrom || '',
      dateTo: vacation.DateTo || '',
      vacationDays: vacation.Days || 0
    })) || []
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vacationService.getVacationData();
      setApiData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Vacations.Errors.LoadingData', 'Failed to fetch vacation data'));
      console.error('Error fetching vacation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAll = useCallback(() => {
    fetchData();
  }, []);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Legacy interface for backward compatibility
  const legacyLoading: VacationLoading = {
    limitedVacations: loading,
    approvedPlan: loading,
    vacationHistory: loading,
    cancelledHistory: loading,
    isAnyLoading: loading
  };

  const legacyErrors: VacationErrors = {
    limitedVacations: error,
    approvedPlan: error,
    vacationHistory: error,
    cancelledHistory: error,
    hasAnyError: !!error,
    errorMessage: error || ''
  };

  return {
    activeTab,
    setActiveTab,
    data: transformedData,
    loading: legacyLoading,
    errors: legacyErrors,
    actions: {
      handleRefreshAll,
      loadLimitedVacations: handleRefreshAll,
      loadApprovedPlan: handleRefreshAll,
      loadVacationHistory: handleRefreshAll,
      loadCancelledHistory: handleRefreshAll
    }
  };
};
