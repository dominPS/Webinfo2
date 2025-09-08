import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useIDPPlans, useIDPPlan, useApproveIDPPlan, useRejectIDPPlan } from '../../../lib/hooks/useIDP';
import type { IDPFrontendDto, IDPGoalFrontendDto } from '../../../lib/api/types';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hasAnnualReview: boolean;
  hasIDPPlan: boolean;
  reviewStatus: 'not_started' | 'in_progress' | 'completed' | 'requires_correction';
  idpStatus: 'not_started' | 'draft' | 'submitted' | 'approved';
  idpId?: string; // ID planu IDP (jeśli istnieje)
}

interface LeaderTeamEvaluationFlowProps {
  onBack?: (resetFilters?: () => void) => void;
  onStepChange?: (step: FlowStep) => void;
  backTrigger?: boolean;
}

type FlowStep = 'team-overview' | 'annual-review' | 'idp-management' | 'employee-detail';

const FlowContainer = styled.div`
  padding: 18px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const FlowHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const FlowTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 6px;
`;

const FlowDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const StepContainer = styled.div`
  margin-bottom: 24px;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const ProcessStep = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  padding: 16px;
  border: 2px solid ${props => props.isActive ? '#126678' : props.isCompleted ? '#10b981' : '#e5e7eb'};
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: ${props => props.isActive ? '#f0f9ff' : props.isCompleted ? '#f0fdf4' : 'white'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #126678;
    box-shadow: 0 2px 8px rgba(18, 102, 120, 0.15);
  }
`;

const ProcessStepTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const ProcessStepDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const FilterInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-right: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterResultsText = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  text-align: center;
`;

const EmployeeTable = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const EmployeeTableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 140px 180px;
  gap: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
`;

const EmployeeTableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 140px 180px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
  align-items: center;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EmployeeId = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
`;

const EmployeeNameCell = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const EmployeeDepartmentCell = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const StatusCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
`;

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const EmployeeCard = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;

  &:hover {
    border-color: #126678;
    box-shadow: 0 2px 8px rgba(18, 102, 120, 0.15);
  }
`;

const EmployeeName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const EmployeePosition = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 4px;
  min-width: 100px;
  text-align: center;
  
  ${props => {
    switch (props.status) {
      case 'completed':
      case 'approved':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'in_progress':
      case 'submitted':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'requires_correction':
        return `
          background-color: #fecaca;
          color: #991b1b;
        `;
      case 'draft':
        return `
          background-color: #e5e7eb;
          color: #374151;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'success' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  min-width: 140px;
  max-width: 140px;
  height: 36px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #126678;
          color: white;
          &:hover { background-color: #0f5459; }
        `;
      case 'secondary':
        return `
          background-color: white;
          color: #126678;
          border: 2px solid #126678;
          &:hover { background-color: #f0f9ff; }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
          &:hover { background-color: #059669; }
        `;
      default:
        return `
          background-color: #126678;
          color: white;
          &:hover { background-color: #0f5459; }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  
  &:hover {
    color: #374151;
  }
`;

const IDPSection = styled.div`
  margin-bottom: 24px;
`;

const IDPSectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const IDPGoal = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

const IDPGoalTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const IDPGoalDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const IDPGoalMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const EmployeeInfo = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const EmployeeInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EmployeeInfoLabel = styled.span`
  font-weight: 600;
  color: #374151;
`;

const EmployeeInfoValue = styled.span`
  color: #6b7280;
`;

const Button = styled.button<{ color: 'red' | 'green' | 'gray' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.color) {
      case 'red':
        return `
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
        `;
      case 'green':
        return `
          background-color: #10b981;
          color: white;
          &:hover {
            background-color: #059669;
          }
        `;
      case 'gray':
      default:
        return `
          background-color: #6b7280;
          color: white;
          &:hover {
            background-color: #4b5563;
          }
        `;
    }
  }}
`;

const LeaderTeamEvaluationFlow: React.FC<LeaderTeamEvaluationFlowProps> = ({ onBack, onStepChange, backTrigger }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('team-overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filterText, setFilterText] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Notify parent component of step changes
  const handleStepChange = (step: FlowStep) => {
    setCurrentStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  // Handle back navigation based on current step
  const handleBackNavigation = () => {
    if (currentStep === 'annual-review' || currentStep === 'idp-management') {
      // If we're in annual review or IDP, go back to team overview and reset filters
      resetFilters();
      handleStepChange('team-overview');
    } else if (currentStep === 'employee-detail') {
      // If we're in employee detail, go back to team overview
      resetFilters();
      handleStepChange('team-overview');
    } else {
      // If we're in team overview, go back to main dashboard
      if (onBack) {
        onBack(resetFilters);
      }
    }
  };

  // Handle back trigger from parent
  React.useEffect(() => {
    if (backTrigger) {
      handleBackNavigation();
    }
  }, [backTrigger]);

  // Reset component state when component is re-mounted or reset
  React.useEffect(() => {
    // Reset to initial state when component is first mounted
    setCurrentStep('team-overview');
    setSelectedEmployee(null);
    resetFilters();
  }, []);

  // Pobieranie danych z API
  const { data: idpPlansData, isLoading: idpLoading } = useIDPPlans();
  const approveMutation = useApproveIDPPlan();
  const rejectMutation = useRejectIDPPlan();
  
  // Przechowywanie przetworzonych danych pracowników
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  
  // Stany dla modali
  const [selectedIDPPlan, setSelectedIDPPlan] = useState<IDPFrontendDto | null>(null);
  const [isIDPModalOpen, setIsIDPModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionComment, setCorrectionComment] = useState('');
  
  // Efekt pobierający dane z API i przekształcający je na format Employee
  useEffect(() => {
    // Sprawdzamy, czy dane zostały już pobrane
    if (idpPlansData) {
      // API może zwracać pojedynczy obiekt lub tablicę, w zależności od implementacji
      // Normalizujemy to do tablicy
      let plans: any[] = [];
      
      if (Array.isArray(idpPlansData)) {
        plans = idpPlansData;
      } else if (idpPlansData.items && Array.isArray(idpPlansData.items)) {
        plans = idpPlansData.items;
      } else if (typeof idpPlansData === 'object' && 'id' in idpPlansData) {
        // Jeśli API zwraca pojedynczy obiekt
        plans = [idpPlansData];
      }
      
      // Tworzymy mapę pracowników na podstawie planów IDP
      const employeeMap = new Map<string, Employee>();
      
      plans.forEach(plan => {
        // Tylko lider może widzieć plany IDP swoich podwładnych
        // Backend zwraca nam tylko plany pracowników, którymi zarządza lider 
        // lub własny plan lidera (widok "Ja i moi bezpośredni podwładni")
        
        // Konwertujemy employeeId do stringa (w przypadku niektórych typów API może być liczbą)
        const employeeId = String(plan.employeeId);
        
        // Próbujemy odzyskać nazwę pracownika
        let employeeName = '';
        if (plan.employeeName) {
          employeeName = plan.employeeName;
        } else if (plan.employee) {
          employeeName = `${plan.employee.firstName} ${plan.employee.lastName}`;
        } else {
          employeeName = `Pracownik ${employeeId}`;
        }
        
        const employee = employeeMap.get(employeeId) || {
          id: employeeId,
          name: employeeName,
          position: plan.employeePosition || 'Nieznane',
          department: plan.employeeDepartment || 'Nieznany',
          hasAnnualReview: false, // To mogłoby być pobrane z API ocen
          hasIDPPlan: true,
          reviewStatus: 'not_started' as const,
          idpStatus: mapBackendStatusToFrontend(plan.status),
          idpId: String(plan.id)
        };
        
        employeeMap.set(employeeId, employee);
      });
      
      setTeamMembers(Array.from(employeeMap.values()));
    }
  }, [idpPlansData]);
  
  // Funkcja mapująca statusy z backendu na frontend
  const mapBackendStatusToFrontend = (status: string): 'not_started' | 'draft' | 'submitted' | 'approved' => {
    switch (status) {
      case 'draft': return 'draft';
      case 'submitted': return 'submitted';
      case 'approved': return 'approved';
      default: return 'not_started';
    }
  };

  // Helper function to filter team members
  const getFilteredTeamMembers = () => {
    return teamMembers.filter(employee => {
      const matchesText = filterText === '' || 
        employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.id.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || 
        employee.department === filterDepartment;
      
      return matchesText && matchesDepartment;
    });
  };

  // Get unique departments for filter dropdown
  const uniqueDepartments = [...new Set(teamMembers.map(emp => emp.department).filter(Boolean))];

  // Reset filters when switching views
  const resetFilters = () => {
    setFilterText('');
    setFilterDepartment('all');
  };

  const getStatusText = (status: string, type: 'review' | 'idp') => {
    const prefix = type === 'review' ? 'review' : 'idp';
    return t(`evaluation.status.${prefix}.${status}`, status.replace('_', ' '));
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      '0': { backgroundColor: '#fef3c7', color: '#d97706', text: 'Szkic' }, // Draft
      '1': { backgroundColor: '#dbeafe', color: '#2563eb', text: 'Do akceptacji' }, // Submitted
      '2': { backgroundColor: '#dcfce7', color: '#16a34a', text: 'Zaakceptowany' } // Approved
    };
    
    const style = statusStyles[status as keyof typeof statusStyles] || statusStyles['0'];
    return (
      <span
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: style.backgroundColor,
          color: style.color
        }}
      >
        {style.text}
      </span>
    );
  };

  const handleProcessStepClick = (step: FlowStep) => {
    resetFilters();
    handleStepChange(step);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleStepChange('employee-detail');
  };

  const handleViewIDPPlan = async (employee: Employee) => {
    if (employee.idpId) {
      // Znajdź plan w danych, które już mamy
      const plans = Array.isArray(idpPlansData) ? idpPlansData : 
        (idpPlansData?.items || (typeof idpPlansData === 'object' && 'id' in idpPlansData ? [idpPlansData] : []));
      
      const plan = plans.find(p => String(p.id) === employee.idpId);
      if (plan) {
        setSelectedIDPPlan(plan);
        setIsIDPModalOpen(true);
      }
    }
  };

  const handleApproveIDPPlan = async () => {
    if (selectedIDPPlan) {
      try {
        await approveMutation.mutateAsync(Number(selectedIDPPlan.id));
        setIsIDPModalOpen(false);
        setSelectedIDPPlan(null);
      } catch (error) {
        console.error('Error approving IDP plan:', error);
      }
    }
  };

  const handleRejectIDPPlan = () => {
    setIsCorrectionModalOpen(true);
  };

  const handleSendForCorrection = async () => {
    if (selectedIDPPlan) {
      try {
        await rejectMutation.mutateAsync({ 
          id: Number(selectedIDPPlan.id), 
          reason: correctionComment 
        });
        setIsCorrectionModalOpen(false);
        setIsIDPModalOpen(false);
        setSelectedIDPPlan(null);
        setCorrectionComment('');
      } catch (error) {
        console.error('Error rejecting IDP plan:', error);
      }
    }
  };

  const handleCloseCorrectionModal = () => {
    setIsCorrectionModalOpen(false);
    setCorrectionComment('');
  };

  const handleCloseIDPModal = () => {
    setIsIDPModalOpen(false);
    setSelectedIDPPlan(null);
  };

  const renderTeamOverview = () => (
    <StepContainer>
      <ProcessStep isActive={false} isCompleted={false} onClick={() => handleProcessStepClick('annual-review')}>
        <ProcessStepTitle>{t('evaluation.leader.team.annualReview.title', 'Oceny Roczne')}</ProcessStepTitle>
        <ProcessStepDescription>
          {t('evaluation.leader.team.annualReview.description', 'Zarządzaj rocznymi ocenami wydajności swojego zespołu')}
        </ProcessStepDescription>
      </ProcessStep>

      <ProcessStep isActive={false} isCompleted={false} onClick={() => handleProcessStepClick('idp-management')}>
        <ProcessStepTitle>{t('evaluation.leader.team.idp.title', 'Plany IDP')}</ProcessStepTitle>
        <ProcessStepDescription>
          {t('evaluation.leader.team.idp.description', 'Przeglądaj i zatwierdź indywidualne plany rozwoju')}
        </ProcessStepDescription>
      </ProcessStep>
    </StepContainer>
  );

  const renderAnnualReviewManagement = () => {
    const filteredMembers = getFilteredTeamMembers();
    
    return (
      <StepContainer>
        <StepHeader>
          <StepTitle>{t('evaluation.leader.team.annualReview.title', 'Zarządzanie Ocenami Rocznymi')}</StepTitle>
        </StepHeader>

        <FilterContainer>
          <FilterGroup>
            <FilterLabel htmlFor="name-filter">
              {t('evaluation.leader.team.filter.nameOrId', 'Imię/Nazwisko lub ID')}
            </FilterLabel>
            <FilterInput
              id="name-filter"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={t('evaluation.leader.team.filter.searchPlaceholder', 'Szukaj po imieniu, nazwisku lub ID...')}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="department-filter">
              {t('evaluation.leader.team.filter.department', 'Dział')}
            </FilterLabel>
            <FilterSelect
              id="department-filter"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">{t('evaluation.leader.team.filter.allDepartments', 'Wszystkie działy')}</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterContainer>

        <FilterResultsText>
          {t('evaluation.leader.team.filter.showing', 'Pokazano {{count}} z {{total}} pracowników', {
            count: filteredMembers.length,
            total: teamMembers.length
          })}
        </FilterResultsText>

        <EmployeeTable>
          <EmployeeTableHeader>
            <div>ID</div>
            <div>{t('evaluation.leader.team.table.name', 'Imię i nazwisko')}</div>
            <div>{t('evaluation.leader.team.table.department', 'Dział')}</div>
            <div>{t('evaluation.leader.team.table.status', 'Status')}</div>
            <div>{t('evaluation.leader.team.table.actions', 'Akcje')}</div>
          </EmployeeTableHeader>
          
          {filteredMembers.map((employee) => (
            <EmployeeTableRow key={employee.id}>
              <EmployeeId>{employee.id}</EmployeeId>
              <EmployeeNameCell>{employee.name}</EmployeeNameCell>
              <EmployeeDepartmentCell>{employee.department}</EmployeeDepartmentCell>
              <StatusCell>
                <StatusBadge status={employee.reviewStatus}>
                  {getStatusText(employee.reviewStatus, 'review')}
                </StatusBadge>
              </StatusCell>
              <ActionCell>
                {employee.reviewStatus === 'not_started' && (
                  <ActionButton variant="primary">
                    {t('evaluation.leader.team.actions.startReview', 'Rozpocznij ocenę')}
                  </ActionButton>
                )}
                {employee.reviewStatus === 'in_progress' && (
                  <ActionButton variant="secondary">
                    {t('evaluation.leader.team.actions.continueReview', 'Kontynuuj ocenę')}
                  </ActionButton>
                )}
                {employee.reviewStatus === 'requires_correction' && (
                  <ActionButton variant="primary">
                    {t('evaluation.leader.team.actions.reviewCorrections', 'Sprawdź poprawki')}
                  </ActionButton>
                )}
                {employee.reviewStatus === 'completed' && (
                  <ActionButton variant="success">
                    {t('evaluation.leader.team.actions.viewReview', 'Zobacz ocenę')}
                  </ActionButton>
                )}
              </ActionCell>
            </EmployeeTableRow>
          ))}
        </EmployeeTable>
    </StepContainer>
    );
  };

  const renderIDPManagement = () => {
    const filteredMembers = getFilteredTeamMembers();
    
    return (
      <StepContainer>
        <StepHeader>
          <StepTitle>{t('evaluation.leader.team.idp.title', 'Zarządzanie Planami IDP')}</StepTitle>
        </StepHeader>

        <FilterContainer>
          <FilterGroup>
            <FilterLabel htmlFor="name-filter-idp">
              {t('evaluation.leader.team.filter.nameOrId', 'Imię/Nazwisko lub ID')}
            </FilterLabel>
            <FilterInput
              id="name-filter-idp"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={t('evaluation.leader.team.filter.searchPlaceholder', 'Szukaj po imieniu, nazwisku lub ID...')}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="department-filter-idp">
              {t('evaluation.leader.team.filter.department', 'Dział')}
            </FilterLabel>
            <FilterSelect
              id="department-filter-idp"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">{t('evaluation.leader.team.filter.allDepartments', 'Wszystkie działy')}</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterContainer>

        {idpLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {t('common.loading', 'Ładowanie...')}
          </div>
        ) : (
          <>
            <FilterResultsText>
              {t('evaluation.leader.team.filter.showing', 'Pokazano {{count}} z {{total}} pracowników', {
                count: filteredMembers.length,
                total: teamMembers.length
              })}
            </FilterResultsText>

            {filteredMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                {t('evaluation.leader.team.noDataFound', 'Nie znaleziono pracowników spełniających kryteria wyszukiwania')}
              </div>
            ) : (
              <EmployeeTable>
                <EmployeeTableHeader>
                  <div>ID</div>
                  <div>{t('evaluation.leader.team.table.name', 'Imię i nazwisko')}</div>
                  <div>{t('evaluation.leader.team.table.department', 'Dział')}</div>
                  <div>{t('evaluation.leader.team.table.status', 'Status')}</div>
                  <div>{t('evaluation.leader.team.table.actions', 'Akcje')}</div>
                </EmployeeTableHeader>
                
                {filteredMembers.map((employee) => (
                  <EmployeeTableRow key={employee.id}>
                    <EmployeeId>{employee.id}</EmployeeId>
                    <EmployeeNameCell>{employee.name}</EmployeeNameCell>
                    <EmployeeDepartmentCell>{employee.department}</EmployeeDepartmentCell>
                    <StatusCell>
                      <StatusBadge status={employee.idpStatus}>
                        {getStatusText(employee.idpStatus, 'idp')}
                      </StatusBadge>
                    </StatusCell>
                    <ActionCell>
                      {employee.idpStatus === 'not_started' && (
                        <ActionButton variant="primary">
                          {t('evaluation.leader.team.actions.createIDP', 'Utwórz IDP')}
                        </ActionButton>
                      )}
                      {employee.idpStatus === 'draft' && (
                        <ActionButton variant="secondary" onClick={() => handleViewIDPPlan(employee)}>
                          {t('evaluation.leader.team.actions.viewIDPDraft', 'Zobacz szkic IDP')}
                        </ActionButton>
                      )}
                      {employee.idpStatus === 'submitted' && (
                        <ActionButton variant="primary" onClick={() => handleViewIDPPlan(employee)}>
                          {t('evaluation.leader.team.actions.reviewIDP', 'Oceń IDP')}
                        </ActionButton>
                      )}
                      {employee.idpStatus === 'approved' && (
                        <ActionButton variant="success" onClick={() => handleViewIDPPlan(employee)}>
                          {t('evaluation.leader.team.actions.viewIDP', 'Zobacz IDP')}
                        </ActionButton>
                      )}
                    </ActionCell>
                  </EmployeeTableRow>
                ))}
              </EmployeeTable>
            )}
          </>
        )}
    </StepContainer>
    );
  };

  const renderEmployeeDetail = () => {
    if (!selectedEmployee) return null;

    return (
      <StepContainer>
        <StepHeader>
          <StepTitle>{selectedEmployee.name} - {t('evaluation.leader.team.employeeDetail.title', 'Szczegóły pracownika')}</StepTitle>
        </StepHeader>

        <ProcessStep isActive={false} isCompleted={selectedEmployee.reviewStatus === 'completed'}>
          <ProcessStepTitle>{t('evaluation.leader.team.annualReview.title', 'Ocena Roczna')}</ProcessStepTitle>
          <ProcessStepDescription>
            {t('evaluation.leader.team.currentStatus', 'Aktualny status')}: {getStatusText(selectedEmployee.reviewStatus, 'review')}
          </ProcessStepDescription>
          <ActionButtons>
            <ActionButton variant="primary">
              {selectedEmployee.reviewStatus === 'completed' 
                ? t('evaluation.leader.team.actions.viewReview', 'Zobacz ocenę')
                : t('evaluation.leader.team.actions.manageReview', 'Zarządzaj oceną')
              }
            </ActionButton>
          </ActionButtons>
        </ProcessStep>

        <ProcessStep isActive={false} isCompleted={selectedEmployee.idpStatus === 'approved'}>
          <ProcessStepTitle>{t('evaluation.leader.team.idp.title', 'Plan IDP')}</ProcessStepTitle>
          <ProcessStepDescription>
            {t('evaluation.leader.team.currentStatus', 'Aktualny status')}: {getStatusText(selectedEmployee.idpStatus, 'idp')}
          </ProcessStepDescription>
          <ActionButtons>
            <ActionButton variant="primary">
              {selectedEmployee.idpStatus === 'approved' 
                ? t('evaluation.leader.team.actions.viewIDP', 'Zobacz IDP')
                : t('evaluation.leader.team.actions.manageIDP', 'Zarządzaj IDP')
              }
            </ActionButton>
          </ActionButtons>
        </ProcessStep>

      </StepContainer>
    );
  };

  return (
    <FlowContainer>
      <FlowHeader>
        <FlowTitle>{t('evaluation.leader.team.title', 'Ja i Moi Bezpośredni Podwładni')}</FlowTitle>
        <FlowDescription>
          {t('evaluation.leader.team.description', 'Zarządzaj procesami oceny i rozwoju swojego zespołu')}
        </FlowDescription>
      </FlowHeader>

      {currentStep === 'team-overview' && renderTeamOverview()}
      {currentStep === 'annual-review' && renderAnnualReviewManagement()}
      {currentStep === 'idp-management' && renderIDPManagement()}
      {currentStep === 'employee-detail' && renderEmployeeDetail()}

      {/* IDP Plan Modal */}
      {isIDPModalOpen && selectedIDPPlan && (
        <Modal onClick={() => setIsIDPModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Plan IDP - {selectedIDPPlan.employeeName}</ModalTitle>
              <CloseButton onClick={() => setIsIDPModalOpen(false)}>×</CloseButton>
            </ModalHeader>

            <EmployeeInfo>
              <EmployeeInfoRow>
                <EmployeeInfoLabel>Pracownik:</EmployeeInfoLabel>
                <EmployeeInfoValue>{selectedIDPPlan.employeeName}</EmployeeInfoValue>
              </EmployeeInfoRow>
              <EmployeeInfoRow>
                <EmployeeInfoLabel>Dział:</EmployeeInfoLabel>
                <EmployeeInfoValue>{selectedIDPPlan.employeeDepartment}</EmployeeInfoValue>
              </EmployeeInfoRow>
              <EmployeeInfoRow>
                <EmployeeInfoLabel>Stanowisko:</EmployeeInfoLabel>
                <EmployeeInfoValue>{selectedIDPPlan.employeePosition}</EmployeeInfoValue>
              </EmployeeInfoRow>
              <EmployeeInfoRow>
                <EmployeeInfoLabel>Status:</EmployeeInfoLabel>
                <EmployeeInfoValue>{getStatusBadge(selectedIDPPlan.status)}</EmployeeInfoValue>
              </EmployeeInfoRow>
            </EmployeeInfo>

            {selectedIDPPlan.goals && selectedIDPPlan.goals.length > 0 && (
              <IDPSection>
                <IDPSectionTitle>Cele rozwojowe</IDPSectionTitle>
                {selectedIDPPlan.goals.map((goal, index) => (
                  <IDPGoal key={index}>
                    <IDPGoalTitle>{goal.title}</IDPGoalTitle>
                    <IDPGoalDescription>{goal.description}</IDPGoalDescription>
                    <IDPGoalMeta>
                      {goal.targetDate && (
                        <span>Deadline: {new Date(goal.targetDate).toLocaleDateString('pl-PL')}</span>
                      )}
                      {goal.progress !== undefined && (
                        <span>Postęp: {goal.progress}%</span>
                      )}
                    </IDPGoalMeta>
                  </IDPGoal>
                ))}
              </IDPSection>
            )}

            <ModalActions>
              {selectedIDPPlan.status === '1' && ( // Submitted
                <>
                  <Button 
                    color="red" 
                    onClick={() => {
                      setIsCorrectionModalOpen(true);
                      setIsIDPModalOpen(false);
                    }}
                  >
                    Wyślij do korekty
                  </Button>
                  <Button 
                    color="green" 
                    onClick={handleApproveIDPPlan}
                  >
                    Zatwierdź
                  </Button>
                </>
              )}
              <Button color="gray" onClick={() => setIsIDPModalOpen(false)}>
                Zamknij
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Correction Comment Modal */}
      {isCorrectionModalOpen && (
        <Modal onClick={() => setIsCorrectionModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Wyślij do korekty</ModalTitle>
              <CloseButton onClick={() => setIsCorrectionModalOpen(false)}>×</CloseButton>
            </ModalHeader>

            <IDPSection>
              <IDPSectionTitle>Komentarz dla pracownika</IDPSectionTitle>
              <TextArea
                value={correctionComment}
                onChange={(e) => setCorrectionComment(e.target.value)}
                placeholder="Wprowadź uwagi do korekty planu IDP..."
              />
            </IDPSection>

            <ModalActions>
              <Button 
                color="gray" 
                onClick={() => {
                  setIsCorrectionModalOpen(false);
                  setCorrectionComment('');
                }}
              >
                Anuluj
              </Button>
              <Button 
                color="red" 
                onClick={handleSendForCorrection}
              >
                Wyślij do korekty
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </FlowContainer>
  );
};

export default LeaderTeamEvaluationFlow;
