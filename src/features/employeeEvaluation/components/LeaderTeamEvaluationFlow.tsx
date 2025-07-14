import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hasAnnualReview: boolean;
  hasIDPPlan: boolean;
  reviewStatus: 'not_started' | 'in_progress' | 'completed' | 'requires_correction';
  idpStatus: 'not_started' | 'draft' | 'submitted' | 'approved';
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

  // Mock data - w rzeczywistej aplikacji to byłoby pobrane z API
  const teamMembers: Employee[] = [
    {
      id: '1',
      name: 'Anna Kowalska',
      position: 'Senior Developer',
      department: 'IT',
      hasAnnualReview: true,
      hasIDPPlan: true,
      reviewStatus: 'completed',
      idpStatus: 'approved'
    },
    {
      id: '2',
      name: 'Piotr Nowak',
      position: 'Junior Developer',
      department: 'IT',
      hasAnnualReview: false,
      hasIDPPlan: true,
      reviewStatus: 'not_started',
      idpStatus: 'draft'
    },
    {
      id: '3',
      name: 'Maria Wiśniewska',
      position: 'UX Designer',
      department: 'Design',
      hasAnnualReview: true,
      hasIDPPlan: false,
      reviewStatus: 'in_progress',
      idpStatus: 'not_started'
    },
    {
      id: '4',
      name: 'Tomasz Zieliński',
      position: 'QA Engineer',
      department: 'Quality',
      hasAnnualReview: true,
      hasIDPPlan: true,
      reviewStatus: 'requires_correction',
      idpStatus: 'submitted'
    }
  ];

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
  const uniqueDepartments = [...new Set(teamMembers.map(emp => emp.department))];

  // Reset filters when switching views
  const resetFilters = () => {
    setFilterText('');
    setFilterDepartment('all');
  };

  const getStatusText = (status: string, type: 'review' | 'idp') => {
    const prefix = type === 'review' ? 'review' : 'idp';
    return t(`evaluation.status.${prefix}.${status}`, status.replace('_', ' '));
  };

  const handleProcessStepClick = (step: FlowStep) => {
    resetFilters();
    handleStepChange(step);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleStepChange('employee-detail');
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
                  <ActionButton variant="secondary">
                    {t('evaluation.leader.team.actions.reviewDraft', 'Sprawdź szkic')}
                  </ActionButton>
                )}
                {employee.idpStatus === 'submitted' && (
                  <ActionButton variant="primary">
                    {t('evaluation.leader.team.actions.approveIDP', 'Zatwierdź IDP')}
                  </ActionButton>
                )}
                {employee.idpStatus === 'approved' && (
                  <ActionButton variant="success">
                    {t('evaluation.leader.team.actions.viewIDP', 'Zobacz IDP')}
                  </ActionButton>
                )}
              </ActionCell>
            </EmployeeTableRow>
          ))}
        </EmployeeTable>
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
    </FlowContainer>
  );
};

export default LeaderTeamEvaluationFlow;
