import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../shared/components/Icon';
import { 
  assessmentRoundsIcon, 
  assessmentFormsIcon, 
  monitoringProgressIcon, 
  reportingAnalysisIcon, 
  competencyManagementIcon, 
  integrationsSettingsIcon 
} from '../../shared/assets/icons/evaluation';

const PageContainer = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 16px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ControlButton = styled.button`
  padding: 24px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  background-color: white;
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
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

  const handleControlClick = (controlType: string) => {
    // In a real app, this would navigate to specific sections or open modals
    console.log(`HR Control clicked: ${controlType}`);
    alert(`${controlType} functionality coming soon!`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('evaluation.hr.title', 'HR Evaluation')}</PageTitle>
        <PageDescription>
          {t('evaluation.hr.dashboardDescription', 'Manage evaluation processes, assessments, and reporting for the organization')}
        </PageDescription>
      </PageHeader>

      <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('dashboard')}>
          <Icon src={assessmentRoundsIcon} alt="Dashboard" size={32} />
          {t('evaluation.hr.controls.dashboard', 'DASHBOARD')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('managingAssessmentRounds')}>
          <Icon src={assessmentRoundsIcon} alt="Assessment Rounds" size={32} />
          {t('evaluation.hr.controls.managingAssessmentRounds', 'MANAGING ASSESSMENT ROUNDS')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('assessmentForms')}>
          <Icon src={assessmentFormsIcon} alt="Assessment Forms" size={32} />
          {t('evaluation.hr.controls.assessmentForms', 'ASSESSMENT FORMS')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('monitoringProgress')}>
          <Icon src={monitoringProgressIcon} alt="Monitoring Progress" size={32} />
          {t('evaluation.hr.controls.monitoringProgress', 'MONITOROWANIE POSTĘPU OCEN')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('reportingAnalysis')}>
          <Icon src={reportingAnalysisIcon} alt="Reporting and Analysis" size={32} />
          {t('evaluation.hr.controls.reportingAnalysis', 'REPORTING AND ANALYSIS')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('competencyManagement')}>
          <Icon src={competencyManagementIcon} alt="Competency Management" size={32} />
          {t('evaluation.hr.controls.competencyManagement', 'ZARZĄDZANIE KOMPETENCJAMI')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('integrationsSettings')}>
          <Icon src={integrationsSettingsIcon} alt="Integrations and Settings" size={32} />
          {t('evaluation.hr.controls.integrationsSettings', 'INTEGRATIONS AND SYSTEM SETTINGS')}
        </ControlButton>
      </ControlsGrid>
    </PageContainer>
  );
};

export default HREvaluationPage;
