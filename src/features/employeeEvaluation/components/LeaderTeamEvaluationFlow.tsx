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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
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
          &:hover { background-color: #f8f9fa; }
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

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  min-width: 150px;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #126678;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const LeaderTeamEvaluationFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('team-overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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

  const getStatusText = (status: string, type: 'review' | 'idp') => {
    const prefix = type === 'review' ? 'review' : 'idp';
    return t(`evaluation.status.${prefix}.${status}`, status.replace('_', ' '));
  };

  const getTeamStats = () => {
    const totalMembers = teamMembers.length;
    const completedReviews = teamMembers.filter(m => m.reviewStatus === 'completed').length;
    const activeIDPs = teamMembers.filter(m => m.idpStatus === 'approved' || m.idpStatus === 'submitted').length;
    const pendingActions = teamMembers.filter(m => 
      m.reviewStatus === 'requires_correction' || 
      m.reviewStatus === 'in_progress' ||
      m.idpStatus === 'submitted'
    ).length;

    return { totalMembers, completedReviews, activeIDPs, pendingActions };
  };

  const stats = getTeamStats();

  const handleProcessStepClick = (step: FlowStep) => {
    setCurrentStep(step);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentStep('employee-detail');
  };

  const renderTeamOverview = () => (
    <StepContainer>
      <StepHeader>
        <StepTitle>{t('evaluation.leader.team.overview.title', 'Przegląd zespołu')}</StepTitle>
      </StepHeader>

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.totalMembers}</StatNumber>
          <StatLabel>{t('evaluation.leader.team.stats.total', 'Członkowie zespołu')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.completedReviews}</StatNumber>
          <StatLabel>{t('evaluation.leader.team.stats.completed', 'Ukończone oceny')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.activeIDPs}</StatNumber>
          <StatLabel>{t('evaluation.leader.team.stats.idps', 'Aktywne IDP')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pendingActions}</StatNumber>
          <StatLabel>{t('evaluation.leader.team.stats.pending', 'Oczekujące akcje')}</StatLabel>
        </StatCard>
      </StatsContainer>

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

      <EmployeeGrid>
        {teamMembers.map((employee) => (
          <EmployeeCard key={employee.id} onClick={() => handleEmployeeClick(employee)}>
            <EmployeeName>{employee.name}</EmployeeName>
            <EmployeePosition>{employee.position} • {employee.department}</EmployeePosition>
            
            <div>
              <StatusBadge status={employee.reviewStatus}>
                {t('evaluation.leader.team.review', 'Ocena')}: {getStatusText(employee.reviewStatus, 'review')}
              </StatusBadge>
              <StatusBadge status={employee.idpStatus}>
                IDP: {getStatusText(employee.idpStatus, 'idp')}
              </StatusBadge>
            </div>
          </EmployeeCard>
        ))}
      </EmployeeGrid>
    </StepContainer>
  );

  const renderAnnualReviewManagement = () => (
    <StepContainer>
      <StepHeader>
        <StepTitle>{t('evaluation.leader.team.annualReview.title', 'Zarządzanie Ocenami Rocznymi')}</StepTitle>
      </StepHeader>

      <EmployeeGrid>
        {teamMembers.map((employee) => (
          <EmployeeCard key={employee.id}>
            <EmployeeName>{employee.name}</EmployeeName>
            <EmployeePosition>{employee.position}</EmployeePosition>
            
            <StatusBadge status={employee.reviewStatus}>
              {getStatusText(employee.reviewStatus, 'review')}
            </StatusBadge>

            <ActionButtons>
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
            </ActionButtons>
          </EmployeeCard>
        ))}
      </EmployeeGrid>

      <ActionButtons>
        <ActionButton variant="secondary" onClick={() => setCurrentStep('team-overview')}>
          {t('common.back', 'Powrót')}
        </ActionButton>
      </ActionButtons>
    </StepContainer>
  );

  const renderIDPManagement = () => (
    <StepContainer>
      <StepHeader>
        <StepTitle>{t('evaluation.leader.team.idp.title', 'Zarządzanie Planami IDP')}</StepTitle>
      </StepHeader>

      <EmployeeGrid>
        {teamMembers.map((employee) => (
          <EmployeeCard key={employee.id}>
            <EmployeeName>{employee.name}</EmployeeName>
            <EmployeePosition>{employee.position}</EmployeePosition>
            
            <StatusBadge status={employee.idpStatus}>
              {getStatusText(employee.idpStatus, 'idp')}
            </StatusBadge>

            <ActionButtons>
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
            </ActionButtons>
          </EmployeeCard>
        ))}
      </EmployeeGrid>

      <ActionButtons>
        <ActionButton variant="secondary" onClick={() => setCurrentStep('team-overview')}>
          {t('common.back', 'Powrót')}
        </ActionButton>
      </ActionButtons>
    </StepContainer>
  );

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

        <ActionButtons>
          <ActionButton variant="secondary" onClick={() => setCurrentStep('team-overview')}>
            {t('common.back', 'Powrót')}
          </ActionButton>
        </ActionButtons>
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
