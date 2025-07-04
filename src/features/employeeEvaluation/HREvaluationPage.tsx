import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

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
  margin: 0 auto 32px auto;
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
  min-height: 600px;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ModuleSection = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #126678 0%, #0f5459 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ModuleButton = styled.button`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 50px;
  
  &:hover {
    background-color: #126678;
    color: white;
    border-color: #126678;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const AlertItem = styled.div`
  padding: 12px 16px;
  border-left: 4px solid #dc2626;
  background-color: #fef2f2;
  border-radius: 0 8px 8px 0;
  margin-bottom: 12px;
  font-size: 14px;
  color: #7f1d1d;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const AlertDescription = styled.div`
  font-size: 12px;
  color: #991b1b;
`;

const DashboardCard = styled.div`
  background: linear-gradient(135deg, #126678 0%, #0f5459 100%);
  color: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(18, 102, 120, 0.25);
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const DashboardTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const DashboardDescription = styled.p`
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
`;

const StatCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  font-weight: 500;
`;

const RoundManagementContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const RoundManagementHeader = styled.div`
  margin-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
`;

const RoundManagementTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin: 0;
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

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
`;

const WorkflowSection = styled.div`
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
`;

const WorkflowTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WorkflowSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WorkflowStep = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #126678;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StepTitle = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const StepDescription = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const StepBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #126678;
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 600;
`;

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const ActionButton = styled.button`
  padding: 16px;
  border: 2px solid #3b82f6;
  border-radius: 10px;
  background-color: #3b82f6;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;

  &:hover {
    background-color: #2563eb;
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }

  &.secondary {
    background-color: white;
    color: #3b82f6;
    border-color: #3b82f6;

    &:hover {
      background-color: #3b82f6;
      color: white;
    }
  }
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

/**
 * HR Evaluation Page
 * This page provides HR dashboard controls for managing evaluation processes
 */
const HREvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<string | null>(null);

  const handleControlClick = (controlType: string) => {
    console.log(`HR Control clicked: ${controlType}`);
    
    // Set active flow for all controls
    setActiveFlow(controlType);
    setActiveModule(null);
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
    setActiveModule(null);
  };

  const handleModuleClick = (moduleType: string) => {
    console.log(`Module clicked: ${moduleType}`);
    setActiveModule(moduleType);
    alert(`${moduleType} module coming soon!`);
  };

  const handleWorkflowStepClick = (stepType: string) => {
    console.log(`Workflow step clicked: ${stepType}`);
    alert(`${stepType} functionality coming soon!`);
  };

  const renderActiveFlow = () => {
    switch (activeFlow) {
      case 'managingAssessmentRounds':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              {renderRoundManagement()}
            </ContentWrapper>
          </PageContainer>
        );
      case 'assessmentForms':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              <RoundManagementContainer>
                <RoundManagementHeader>
                  <RoundManagementTitle>Formularze ocen</RoundManagementTitle>
                </RoundManagementHeader>
                <p>Moduł Formularze ocen - funkcjonalność w trakcie implementacji</p>
              </RoundManagementContainer>
            </ContentWrapper>
          </PageContainer>
        );
      case 'monitoringProgress':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              <RoundManagementContainer>
                <RoundManagementHeader>
                  <RoundManagementTitle>Monitorowanie postępu ocen</RoundManagementTitle>
                </RoundManagementHeader>
                <p>Moduł Monitorowanie postępu - funkcjonalność w trakcie implementacji</p>
              </RoundManagementContainer>
            </ContentWrapper>
          </PageContainer>
        );
      case 'reportingAnalysis':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              <RoundManagementContainer>
                <RoundManagementHeader>
                  <RoundManagementTitle>Raporty i analiza</RoundManagementTitle>
                </RoundManagementHeader>
                <p>Moduł Raporty i analiza - funkcjonalność w trakcie implementacji</p>
              </RoundManagementContainer>
            </ContentWrapper>
          </PageContainer>
        );
      case 'competencyManagement':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              <RoundManagementContainer>
                <RoundManagementHeader>
                  <RoundManagementTitle>Zarządzanie kompetencjami</RoundManagementTitle>
                </RoundManagementHeader>
                <p>Moduł Zarządzanie kompetencjami - funkcjonalność w trakcie implementacji</p>
              </RoundManagementContainer>
            </ContentWrapper>
          </PageContainer>
        );
      case 'integrationsSettings':
        return (
          <PageContainer>
            <ContentWrapper>
              <BackButton onClick={handleBackToDashboard}>
                ← Powrót
              </BackButton>
              <RoundManagementContainer>
                <RoundManagementHeader>
                  <RoundManagementTitle>Integracje i ustawienia</RoundManagementTitle>
                </RoundManagementHeader>
                <p>Moduł Integracje i ustawienia - funkcjonalność w trakcie implementacji</p>
              </RoundManagementContainer>
            </ContentWrapper>
          </PageContainer>
        );
      default:
        return null;
    }
  };

  const renderRoundManagement = () => (
    <RoundManagementContainer>
      <RoundManagementHeader>
        <RoundManagementTitle>Zarządzanie rundami ocen</RoundManagementTitle>
      </RoundManagementHeader>

      <WorkflowGrid>
        {/* Lewa kolumna - Proces tworzenia rundy */}
        <WorkflowSection>
          <WorkflowTitle>Proces tworzenia nowej rundy</WorkflowTitle>
          <WorkflowSteps>
            <WorkflowStep onClick={() => handleWorkflowStepClick('createRound')}>
              <StepBadge>KROK 1</StepBadge>
              <StepTitle>Uruchamia kreator nowej rundy oceny</StepTitle>
              <StepDescription>Rozpocznij proces tworzenia nowej rundy ocen dla organizacji</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('editDetails')}>
              <StepBadge>KROK 2</StepBadge>
              <StepTitle>Pozwala edytować nazwę, daty, opis, uczestników</StepTitle>
              <StepDescription>Skonfiguruj szczegóły rundy: nazwa, termin, uczestników</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('selectEmployees')}>
              <StepBadge>KROK 3</StepBadge>
              <StepTitle>Wybór pracowników, przypisanie rół ocen</StepTitle>
              <StepDescription>Wybierz pracowników i przypisz role: samoocena, przełożony</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('setDates')}>
              <StepBadge>KROK 4</StepBadge>
              <StepTitle>Ustawienia dat rozpoczęcia, zakończenia, przypomnień</StepTitle>
              <StepDescription>Ustaw harmonogram: start, koniec, przypomnienia</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('finalize')}>
              <StepBadge>KROK 5</StepBadge>
              <StepTitle>Finalizuje konfigurację i uruchamia proces oceny</StepTitle>
              <StepDescription>Przejrzyj ustawienia i uruchom rundę ocen</StepDescription>
            </WorkflowStep>
          </WorkflowSteps>
        </WorkflowSection>

        {/* Prawa kolumna - Działania na rundach */}
        <WorkflowSection>
          <WorkflowTitle>Działania na rundach</WorkflowTitle>
          <WorkflowSteps>
            <WorkflowStep onClick={() => handleWorkflowStepClick('addRound')}>
              <StepTitle>Dodaj nową rundę oceny</StepTitle>
              <StepDescription>Utwórz nową rundę ocen dla całej organizacji lub wybranych zespołów</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('editRound')}>
              <StepTitle>Edytuj rundę</StepTitle>
              <StepDescription>Modyfikuj istniejącą rundę: daty, uczestników, ustawienia</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('addParticipants')}>
              <StepTitle>Dodaj ocenianych / oceniających</StepTitle>
              <StepDescription>Dodaj nowych uczestników do aktywnej rundy ocen</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('setDeadlines')}>
              <StepTitle>Ustal terminy</StepTitle>
              <StepDescription>Ustaw lub zmień terminy dla poszczególnych etapów oceny</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('approveRound')}>
              <StepTitle>Zatwierdź rundę</StepTitle>
              <StepDescription>Potwierdź rundę i aktywuj proces oceniania</StepDescription>
            </WorkflowStep>
            
            <WorkflowStep onClick={() => handleWorkflowStepClick('deleteRound')}>
              <StepTitle>Usuń rundę (jeśli nie rozpoczęta)</StepTitle>
              <StepDescription>Usuń rundę która jeszcze nie została uruchomiona</StepDescription>
            </WorkflowStep>
          </WorkflowSteps>
        </WorkflowSection>
      </WorkflowGrid>

      <ActionButtonsGrid>
        <ActionButton onClick={() => handleWorkflowStepClick('createNewRound')}>
          Dodaj nową rundę oceny
        </ActionButton>
        <ActionButton className="secondary" onClick={() => handleWorkflowStepClick('editExistingRound')}>
          Edytuj rundę
        </ActionButton>
        <ActionButton className="secondary" onClick={() => handleWorkflowStepClick('setDeadlines')}>
          Ustal terminy
        </ActionButton>
        <ActionButton className="secondary" onClick={() => handleWorkflowStepClick('approveRound')}>
          Zatwierdź rundę
        </ActionButton>
        <ActionButton className="secondary" onClick={() => handleWorkflowStepClick('deleteRound')}>
          Usuń rundę
        </ActionButton>
      </ActionButtonsGrid>
    </RoundManagementContainer>
  );

  // If any active flow is set, render it instead of the main dashboard
  if (activeFlow) {
    return renderActiveFlow();
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('evaluation.hr.title', 'HR Evaluation')}</PageTitle>
        <PageDescription>
          {t('evaluation.hr.dashboardDescription', 'Manage evaluation processes, assessments, and reporting for the organization')}
        </PageDescription>
      </PageHeader>

      <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('managingAssessmentRounds')}>
          {t('evaluation.hr.controls.managingAssessmentRounds', 'Zarządzanie rundami ocen')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('assessmentForms')}>
          {t('evaluation.hr.controls.assessmentForms', 'Formularze ocen')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('monitoringProgress')}>
          {t('evaluation.hr.controls.monitoringProgress', 'Monitorowanie postępu ocen')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('reportingAnalysis')}>
          {t('evaluation.hr.controls.reportingAnalysis', 'Raporty i analiza')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('competencyManagement')}>
          {t('evaluation.hr.controls.competencyManagement', 'Zarządzanie kompetencjami')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('integrationsSettings')}>
          {t('evaluation.hr.controls.integrationsSettings', 'Integracje i ustawienia')}
        </ControlButton>
      </ControlsGrid>

      <MainLayout>
        {/* Dashboard na górze */}
        <DashboardCard>
          <DashboardDescription>
            {t('evaluation.hr.dashboard.description', 'Przegląd kluczowych wskaźników i postępu ocen')}
          </DashboardDescription>
          <StatsGrid>
            <StatCard>
              <StatNumber>87%</StatNumber>
              <StatLabel>{t('evaluation.hr.dashboard.completion', 'Ukończono')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>23</StatNumber>
              <StatLabel>{t('evaluation.hr.dashboard.activeEvaluations', 'Aktywne oceny')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>12</StatNumber>
              <StatLabel>{t('evaluation.hr.dashboard.pendingApprovals', 'Oczekujące zatwierdzenia')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>3</StatNumber>
              <StatLabel>{t('evaluation.hr.dashboard.overdue', 'Zaległe')}</StatLabel>
            </StatCard>
          </StatsGrid>
        </DashboardCard>

        <ContentSection>
          {/* Rundy ocen, Formularze, Raporty */}
          <ModuleSection>
            <SectionTitle>
              {t('evaluation.hr.modules.evaluationRounds', 'Rundy ocen')}
            </SectionTitle>
            <ModuleGrid>
              <ModuleButton onClick={() => handleModuleClick('progressRounds')}>
                {t('evaluation.hr.modules.progressRounds', 'Postęp rundy')}
              </ModuleButton>
              <ModuleButton onClick={() => handleModuleClick('evaluationCalendar')}>
                {t('evaluation.hr.modules.evaluationCalendar', 'Kalendarz ocen')}
              </ModuleButton>
              <ModuleButton onClick={() => handleModuleClick('systemNotifications')}>
                {t('evaluation.hr.modules.systemNotifications', 'Powiadomienia systemowe')}
              </ModuleButton>
            </ModuleGrid>
          </ModuleSection>

          <ModuleSection>
            <SectionTitle>
              {t('evaluation.hr.modules.reports', 'Raporty')}
            </SectionTitle>
            <ModuleGrid>
              <ModuleButton onClick={() => handleModuleClick('completionPercentage')}>
                {t('evaluation.hr.modules.completionPercentage', 'Pokaż % zakończonych ocen, liczba wypełnionych formularzy')}
              </ModuleButton>
              <ModuleButton onClick={() => handleModuleClick('scheduleHarmonogram')}>
                {t('evaluation.hr.modules.scheduleHarmonogram', 'Pokaż harmonogram rund ocen i przypomnienia')}
              </ModuleButton>
            </ModuleGrid>
          </ModuleSection>

          {/* Alerty */}
          <ModuleSection>
            <SectionTitle>
              {t('evaluation.hr.modules.alerts', 'Alerty o zaległych ocenach, zbliżających się terminach, błędach')}
            </SectionTitle>
            <div>
              <AlertItem>
                <AlertTitle>{t('evaluation.hr.alerts.overdue', 'Zaległe oceny')}</AlertTitle>
                <AlertDescription>{t('evaluation.hr.alerts.overdueDesc', '5 pracowników ma zaległe oceny przekraczające 2 tygodnie')}</AlertDescription>
              </AlertItem>
              <AlertItem>
                <AlertTitle>{t('evaluation.hr.alerts.upcoming', 'Zbliżające się terminy')}</AlertTitle>
                <AlertDescription>{t('evaluation.hr.alerts.upcomingDesc', '12 ocen kończy się w ciągu najbliższych 3 dni')}</AlertDescription>
              </AlertItem>
              <AlertItem>
                <AlertTitle>{t('evaluation.hr.alerts.errors', 'Błędy systemowe')}</AlertTitle>
                <AlertDescription>{t('evaluation.hr.alerts.errorsDesc', '2 formularze wymagają sprawdzenia przez administratora')}</AlertDescription>
              </AlertItem>
            </div>
          </ModuleSection>

          {/* Lista rzeczy do wykonania */}
          <ModuleSection>
            <SectionTitle>
              {t('evaluation.hr.modules.todoList', 'Lista rzeczy do wykonania: zatwierdzenia, przypomnienia, edycje')}
            </SectionTitle>
            <ModuleGrid>
              <ModuleButton onClick={() => handleModuleClick('approvals')}>
                {t('evaluation.hr.todo.approvals', 'Zatwierdzenia (8)')}
              </ModuleButton>
              <ModuleButton onClick={() => handleModuleClick('reminders')}>
                {t('evaluation.hr.todo.reminders', 'Przypomnienia (15)')}
              </ModuleButton>
              <ModuleButton onClick={() => handleModuleClick('edits')}>
                {t('evaluation.hr.todo.edits', 'Edycje (3)')}
              </ModuleButton>
            </ModuleGrid>
          </ModuleSection>
        </ContentSection>
      </MainLayout>
    </PageContainer>
  );
};

export default HREvaluationPage;
