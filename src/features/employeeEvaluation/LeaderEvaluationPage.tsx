import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import IDPFlow from './components/LeaderIDPFlow';
import AnnualReviewHistory from './components/LeaderAnnualReviewHistory';
import LeaderTeamEvaluationFlow from './components/LeaderTeamEvaluationFlow';
import SelfEvaluationPage from './SelfEvaluationPage';
import WhiteValuesModal from '../../shared/components/WhiteValuesModal';

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

const PageContainer = styled.div`
  padding: 18px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 6px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
  max-width: 1000px;
  margin: 0 auto;
`;

const ControlButton = styled.button`
  padding: 18px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 10px;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  margin-bottom: 12px;
  padding: 5px 10px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: #0f5459;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 80px;
`;

const TeamOverviewSection = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 16px;
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
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e2e8f0;
    border-color: #126678;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
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

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const EmployeeCard = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;

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

/**
 * Leader Evaluation Page
 * This page provides leader dashboard controls for managing team evaluations and development
 */
const LeaderEvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isWhiteValuesModalOpen, setIsWhiteValuesModalOpen] = useState(false);
  const [activeStatView, setActiveStatView] = useState<string | null>(null);
  const [teamFlowStep, setTeamFlowStep] = useState<string>('team-overview');
  const [backTrigger, setBackTrigger] = useState(false);

  // Mock data for team members - in real app this would come from API
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

  const handleEmployeeClick = (employee: Employee) => {
    // In a real app, this would navigate to employee detail page
    console.log(`Employee clicked: ${employee.name}`);
    alert(`Szczegóły pracownika ${employee.name} - funkcjonalność wkrótce!`);
  };

  const handleStatCardClick = (statType: string) => {
    setActiveStatView(statType);
  };

  const getFilteredEmployeesByStatType = (statType: string) => {
    switch (statType) {
      case 'total':
        return teamMembers;
      case 'completed':
        return teamMembers.filter(m => m.reviewStatus === 'completed');
      case 'idps':
        return teamMembers.filter(m => m.idpStatus === 'approved' || m.idpStatus === 'submitted');
      case 'pending':
        return teamMembers.filter(m => 
          m.reviewStatus === 'requires_correction' || 
          m.reviewStatus === 'in_progress' ||
          m.idpStatus === 'submitted'
        );
      default:
        return teamMembers;
    }
  };

  const renderStatDetailView = () => {
    if (!activeStatView) return null;

    const filteredEmployees = getFilteredEmployeesByStatType(activeStatView);
    let title = '';
    
    switch (activeStatView) {
      case 'total':
        title = t('evaluation.leader.team.stats.total', 'Członkowie zespołu');
        break;
      case 'completed':
        title = t('evaluation.leader.team.stats.completed', 'Ukończone oceny');
        break;
      case 'idps':
        title = t('evaluation.leader.team.stats.idps', 'Aktywne IDP');
        break;
      case 'pending':
        title = t('evaluation.leader.team.stats.pending', 'Oczekujące akcje');
        break;
    }

    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={() => setActiveStatView(null)}>
            ← {t('common.back', 'Powrót')}
          </BackButton>
          
          <TeamOverviewSection>
            <SectionTitle>{title}</SectionTitle>
            
            <EmployeeGrid>
              {filteredEmployees.map((employee) => (
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
          </TeamOverviewSection>
        </ContentWrapper>
      </PageContainer>
    );
  };

  const handleControlClick = (controlType: string) => {
    if (controlType === 'idp') {
      setActiveFlow('idp');
    } else if (controlType === 'annualReview') {
      setActiveFlow('annualReview');
    } else if (controlType === 'selfAssessment') {
      setActiveFlow('selfAssessment');
    } else if (controlType === 'meAndDirectReports') {
      // Reset team flow state when entering
      setTeamFlowStep('team-overview');
      setBackTrigger(false);
      setActiveFlow('teamEvaluation');
    } else if (controlType === 'whiteValues') {
      setIsWhiteValuesModalOpen(true);
    } else {
      // In a real app, this would navigate to specific sections or open modals
      console.log(`Leader Control clicked: ${controlType}`);
      alert(`${controlType} functionality coming soon!`);
    }
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
    setActiveStatView(null);
  };

  const handleBackFromTeamFlow = (resetFilters?: () => void) => {
    if (resetFilters) {
      resetFilters();
    }
    setActiveFlow(null);
    setTeamFlowStep('team-overview');
    setBackTrigger(false); // Reset the back trigger
  };

  const handleTeamFlowStepChange = (step: string) => {
    setTeamFlowStep(step);
  };

  // Handle back navigation in team flow
  const handleTeamFlowBack = () => {
    if (teamFlowStep === 'team-overview') {
      // If we're in team overview, go back to main dashboard
      handleBackFromTeamFlow();
    } else {
      // If we're in a subview, trigger back navigation in the flow component
      setBackTrigger(prev => !prev); // Toggle to trigger effect
    }
  };

  const handleCloseWhiteValuesModal = () => {
    setIsWhiteValuesModalOpen(false);
  };

  // If stat detail view is active, show it
  if (activeStatView) {
    return renderStatDetailView();
  }

  // If Team Evaluation flow is active, show it instead of the main dashboard
  if (activeFlow === 'teamEvaluation') {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleTeamFlowBack}>
            ← {teamFlowStep === 'team-overview' ? t('common.backToDashboard', 'Powrót') : t('common.back', 'Powrót')}
          </BackButton>
          <LeaderTeamEvaluationFlow 
            onBack={handleBackFromTeamFlow} 
            onStepChange={handleTeamFlowStepChange}
            backTrigger={backTrigger}
          />
        </ContentWrapper>
      </PageContainer>
    );
  }

  // If IDP flow is active, show it instead of the main dashboard
  if (activeFlow === 'idp') {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleBackToDashboard}>
            ← {t('common.backToDashboard', 'Powrót')}
          </BackButton>
          <IDPFlow />
        </ContentWrapper>
      </PageContainer>
    );
  }

  // If Annual Review flow is active, show it instead of the main dashboard
  if (activeFlow === 'annualReview') {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleBackToDashboard}>
            ← {t('common.backToDashboard', 'Powrót')}
          </BackButton>
          <AnnualReviewHistory />
        </ContentWrapper>
      </PageContainer>
    );
  }

  // If Self-Assessment flow is active, show it instead of the main dashboard
  if (activeFlow === 'selfAssessment') {
    return (
      <PageContainer>
        <ContentWrapper>
          <SelfEvaluationPage showBackButton={true} onBack={handleBackToDashboard} />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <PageHeader>
          <PageTitle>{t('evaluation.leader.title', 'Leader Evaluation')}</PageTitle>
          <PageDescription>
            {t('evaluation.leader.dashboardDescription', 'Manage your team evaluations, development plans, and performance reviews')}
          </PageDescription>
        </PageHeader>

        <TeamOverviewSection>
          <SectionTitle>{t('evaluation.leader.team.overview.title', 'Przegląd zespołu')}</SectionTitle>
          
          <StatsContainer>
            <StatCard onClick={() => handleStatCardClick('total')}>
              <StatNumber>{stats.totalMembers}</StatNumber>
              <StatLabel>{t('evaluation.leader.team.stats.total', 'Członkowie zespołu')}</StatLabel>
            </StatCard>
            <StatCard onClick={() => handleStatCardClick('completed')}>
              <StatNumber>{stats.completedReviews}</StatNumber>
              <StatLabel>{t('evaluation.leader.team.stats.completed', 'Ukończone oceny')}</StatLabel>
            </StatCard>
            <StatCard onClick={() => handleStatCardClick('idps')}>
              <StatNumber>{stats.activeIDPs}</StatNumber>
              <StatLabel>{t('evaluation.leader.team.stats.idps', 'Aktywne IDP')}</StatLabel>
            </StatCard>
            <StatCard onClick={() => handleStatCardClick('pending')}>
              <StatNumber>{stats.pendingActions}</StatNumber>
              <StatLabel>{t('evaluation.leader.team.stats.pending', 'Oczekujące akcje')}</StatLabel>
            </StatCard>
          </StatsContainer>
        </TeamOverviewSection>

        <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('whiteValues')}>
          {t('evaluation.leader.controls.whiteValues', 'Company Values')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('meAndDirectReports')}>
          {t('evaluation.leader.controls.meAndDirectReports', 'Me and My Direct Reports')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('helpContactHR')}>
          {t('evaluation.leader.controls.helpContactHR', 'Help and Contact with HR')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('idp')}>
          {t('evaluation.leader.controls.idp', 'IDP (Individual Development Plan)')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('annualReview')}>
          {t('evaluation.leader.controls.annualReview', 'Annual Review')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('selfAssessment')}>
          {t('evaluation.leader.controls.selfAssessment', 'Self-Assessment')}
        </ControlButton>
        </ControlsGrid>
      </ContentWrapper>

      <WhiteValuesModal 
        isOpen={isWhiteValuesModalOpen}
        onClose={handleCloseWhiteValuesModal}
      />
    </PageContainer>
  );
};

export default LeaderEvaluationPage;
