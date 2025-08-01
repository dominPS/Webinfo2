import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
  
  const [data, setData] = useState<VacationData>({
    limitedVacations: [],
    approvedPlan: [],
    vacationHistory: [],
    cancelledHistory: []
  });

  const [loading, setLoading] = useState<VacationLoading>({
    limitedVacations: false,
    approvedPlan: false,
    vacationHistory: false,
    cancelledHistory: false,
    isAnyLoading: false
  });

  const [errors, setErrors] = useState<VacationErrors>({
    limitedVacations: null,
    approvedPlan: null,
    vacationHistory: null,
    cancelledHistory: null,
    hasAnyError: false,
    errorMessage: ''
  });

  // Mock data loading functions - replace with actual API calls
  const loadLimitedVacations = useCallback(async () => {
    setLoading(prev => ({ ...prev, limitedVacations: true, isAnyLoading: true }));
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: LimitedVacation[] = [];
      
      setData(prev => ({ ...prev, limitedVacations: mockData }));
      setErrors(prev => ({ ...prev, limitedVacations: null }));
    } catch (error) {
      const errorMessage = t('Vacations.Errors.LimitedVacations', 'Błąd podczas ładowania urlopów limitowanych');
      setErrors(prev => ({ ...prev, limitedVacations: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, limitedVacations: false }));
    }
  }, []);

  const loadApprovedPlan = useCallback(async () => {
    setLoading(prev => ({ ...prev, approvedPlan: true, isAnyLoading: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: ApprovedVacation[] = [];
      
      setData(prev => ({ ...prev, approvedPlan: mockData }));
      setErrors(prev => ({ ...prev, approvedPlan: null }));
    } catch (error) {
      const errorMessage = t('Vacations.Errors.ApprovedPlan', 'Błąd podczas ładowania zatwierdzonego planu urlopowego');
      setErrors(prev => ({ ...prev, approvedPlan: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, approvedPlan: false }));
    }
  }, []);

  const loadVacationHistory = useCallback(async () => {
    setLoading(prev => ({ ...prev, vacationHistory: true, isAnyLoading: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: VacationHistory[] = [];
      
      setData(prev => ({ ...prev, vacationHistory: mockData }));
      setErrors(prev => ({ ...prev, vacationHistory: null }));
    } catch (error) {
      const errorMessage = t('Vacations.Errors.VacationHistory', 'Błąd podczas ładowania historii urlopów');
      setErrors(prev => ({ ...prev, vacationHistory: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, vacationHistory: false }));
    }
  }, []);

  const loadCancelledHistory = useCallback(async () => {
    setLoading(prev => ({ ...prev, cancelledHistory: true, isAnyLoading: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: CancelledVacation[] = [];
      
      setData(prev => ({ ...prev, cancelledHistory: mockData }));
      setErrors(prev => ({ ...prev, cancelledHistory: null }));
    } catch (error) {
      const errorMessage = t('Vacations.Errors.CancelledHistory', 'Błąd podczas ładowania historii anulowanych urlopów');
      setErrors(prev => ({ ...prev, cancelledHistory: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, cancelledHistory: false }));
    }
  }, []);

  const handleRefreshAll = useCallback(() => {
    loadLimitedVacations();
    loadApprovedPlan();
    loadVacationHistory();
    loadCancelledHistory();
  }, [loadLimitedVacations, loadApprovedPlan, loadVacationHistory, loadCancelledHistory]);

  // Update loading and error states
  useEffect(() => {
    const isAnyLoading = loading.limitedVacations || loading.approvedPlan || 
                        loading.vacationHistory || loading.cancelledHistory;
    
    const hasAnyError = !!(errors.limitedVacations || errors.approvedPlan || 
                          errors.vacationHistory || errors.cancelledHistory);
    
    const errorMessage = errors.limitedVacations || errors.approvedPlan || 
                        errors.vacationHistory || errors.cancelledHistory || '';

    setLoading(prev => ({ ...prev, isAnyLoading }));
    setErrors(prev => ({ ...prev, hasAnyError, errorMessage }));
  }, [loading.limitedVacations, loading.approvedPlan, loading.vacationHistory, loading.cancelledHistory,
      errors.limitedVacations, errors.approvedPlan, errors.vacationHistory, errors.cancelledHistory]);

  // Load initial data
  useEffect(() => {
    handleRefreshAll();
  }, [handleRefreshAll]);

  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    errors,
    actions: {
      handleRefreshAll,
      loadLimitedVacations,
      loadApprovedPlan,
      loadVacationHistory,
      loadCancelledHistory
    }
  };
};
