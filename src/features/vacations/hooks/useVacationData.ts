import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { vacationService } from '../../../services/vacationService';
import type { VacationModel } from '../../../schemas/VacationModel';

// Utility function to parse .NET DateTime format and convert to readable format
const formatDateFromDotNet = (dateString: string): string => {
  if (!dateString) return '';
  
  // Check if it's in .NET format like "/Date(1745186400000)/"
  const dotNetMatch = dateString.match(/\/Date\((\d+)\)\//);
  if (dotNetMatch) {
    const timestamp = parseInt(dotNetMatch[1], 10);
    const date = new Date(timestamp);
    // Format as DD.MM.YYYY
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // If it's already a normal date string, try to parse and format it
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (error) {
    console.warn('Failed to parse date:', dateString);
  }
  
  // Return original string if parsing fails
  return dateString;
};

// Utility function to convert VacTimeView to number (can be string or number from API)
const parseVacationDays = (value: string | number | undefined): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

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
  const [apiData, setApiData] = useState<VacationModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map status numbers to readable strings
  const mapStatus = (status: string | number | undefined): string => {
    if (typeof status === 'string') return status;
    
    switch (status) {
      case 0: return t('Vacations.Status.Planned', 'Zaplanowany');
      case 1: return t('Vacations.Status.Submitted', 'Zgłoszony');
      case 2: return t('Vacations.Status.Accepted', 'Zaakceptowany');
      case 3: return t('Vacations.Status.Rejected', 'Odrzucony');
      default: return t('Vacations.Status.Unknown', 'Nieznany');
    }
  };

  // Transform API data to component format with safe access
  const transformedData: VacationData = {
    limitedVacations: apiData?.VacancyInfo?.map((info, index) => ({
      id: info.Code || `limited-${index}`,
      code: info.Code || '',
      parentCode: info.Parent || '',
      limit: info.Limit || 0,
      available: info.Left || 0,
      additionalInfo: `${t('Vacations.Used', 'Wykorzystane')}: ${info.Used || 0}`
    })) || [],
    
    approvedPlan: apiData?.VacancyPlan?.Plans?.map((plan, index) => ({
      id: plan.ID?.toString() || `plan-${index}`,
      absence: t('Vacations.VacationPlan', 'Plan urlopowy'),
      dateFrom: formatDateFromDotNet(plan.From || ''),
      dateTo: formatDateFromDotNet(plan.To || ''),
      vacationRequest: mapStatus(plan.Status)
    })) || [],
    
    vacationHistory: apiData?.VacancyHistory?.Vacancies?.length ? 
      apiData.VacancyHistory.Vacancies.map((vacation, index) => {
        console.log('Processing vacation history item:', vacation);
        console.log('Name field (for description):', vacation.Name);
        console.log('VacTimeView field (for vacation days):', vacation.VacTimeView);
        console.log('Days field (fallback):', vacation.Days);
        console.log('Comment field:', vacation.Comment);
        console.log('Description field:', vacation.Description);
        console.log('AbsenceName field:', vacation.AbsenceName);
        console.log('All keys in vacation object:', Object.keys(vacation));
        
        // Generate more informative description fallback - Name field has priority for description
        const description = vacation.Name || 
                           vacation.Comment || 
                           vacation.Description || 
                           vacation.Reason || 
                           vacation.Note || 
                           vacation.Details || 
                           (vacation.AbsenceName ? `Typ: ${vacation.AbsenceName}` : '') ||
                           (vacation.VacTimeView ? `Urlop ${parseVacationDays(vacation.VacTimeView)} dni` : '') ||
                           (vacation.Days ? `Urlop ${parseVacationDays(vacation.Days)} dni` : '') ||
                           `Historia urlopu #${index + 1}`;
        console.log('Final description (using Name field as priority):', description);
        
        return {
          id: vacation.ID?.toString() || `history-${index}`,
          vacationCode: vacation.AbsenceName || vacation.AbsenceCode || vacation.Code || vacation.Name || 'Brak kodu',
          description: description,
          dateFrom: formatDateFromDotNet(vacation.DateFrom || ''),
          dateTo: formatDateFromDotNet(vacation.DateTo || ''),
          vacationDays: parseVacationDays(vacation.VacTimeView) || parseVacationDays(vacation.Days) || 0
        };
      }) : [
        // Mock data for testing when no real data is available
        {
          id: 'mock-1',
          vacationCode: 'URL',
          description: 'Urlop wypoczynkowy (z pola Name)',
          dateFrom: '01.06.2024',
          dateTo: '15.06.2024',
          vacationDays: 10
        },
        {
          id: 'mock-2', 
          vacationCode: 'URLNA',
          description: 'Urlop na żądanie (z pola Name)',
          dateFrom: '01.08.2024',
          dateTo: '05.08.2024',
          vacationDays: 5
        }
      ],
    
    cancelledHistory: apiData?.VacanciesRevoked?.map((vacation, index) => {
      console.log('Processing cancelled vacation item:', vacation);
      console.log('Name field (for description):', vacation.Name);
      console.log('VacTimeView field (for vacation days):', vacation.VacTimeView);
      console.log('Days field (fallback):', vacation.Days);
      console.log('Comment field:', vacation.Comment);
      console.log('Description field:', vacation.Description);
      console.log('All keys in cancelled vacation object:', Object.keys(vacation));
      
      const description = vacation.Name || 
                         vacation.Comment || 
                         vacation.Description || 
                         vacation.Reason || 
                         vacation.Note || 
                         vacation.Details || 
                         (vacation.AbsenceName ? `Typ: ${vacation.AbsenceName}` : '') ||
                         (vacation.VacTimeView ? `Anulowany urlop ${parseVacationDays(vacation.VacTimeView)} dni` : '') ||
                         (vacation.Days ? `Anulowany urlop ${parseVacationDays(vacation.Days)} dni` : '') ||
                         `Anulowany urlop #${index + 1}`;
      
      return {
        id: vacation.ID?.toString() || `cancelled-${index}`,
        vacationCode: vacation.AbsenceName || vacation.AbsenceCode || vacation.Code || vacation.Name || 'Brak kodu',
        description: description,
        dateFrom: formatDateFromDotNet(vacation.DateFrom || ''),
        dateTo: formatDateFromDotNet(vacation.DateTo || '')
      };
    }) || []
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await vacationService.getVacationData();
      console.log('Vacation data received:', response);
      setApiData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('Vacations.Errors.LoadingData', 'Failed to fetch vacation data');
      setError(errorMessage);
      console.error('Error fetching vacation data:', err);
      
      // Set mock data in case of error for development
      setApiData({
        VacancyInfo: [
          {
            Code: 'WYP',
            Name: 'Urlop wypoczynkowy',
            Used: 10,
            Limit: 26,
            Left: 16
          }
        ],
        VacancyHistory: {
          Vacancies: [
            {
              ID: 1,
              DateFrom: '2024-07-01',
              DateTo: '2024-07-05',
              Days: 5,
              AbsenceName: 'Urlop wypoczynkowy',
              Status: 'Zaakceptowany',
              Comment: 'Urlop letni'
            }
          ]
        },
        VacanciesRevoked: []
      });
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
