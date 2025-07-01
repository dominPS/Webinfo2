import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../shared/components/Icon';
import { 
  dashboardIcon, 
  whiteValuesIcon, 
  directReportsIcon, 
  helpHrIcon, 
  idpIcon, 
  annualReviewIcon, 
  selfAssessmentIcon 
} from '../../shared/assets/icons/evaluation';

const PageContainer = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
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
 * Leader Evaluation Page
 * This page provides leader dashboard controls for managing team evaluations and development
 */
const LeaderEvaluationPage: React.FC = () => {
  const { t } = useTranslation();

  const handleControlClick = (controlType: string) => {
    // In a real app, this would navigate to specific sections or open modals
    console.log(`Leader Control clicked: ${controlType}`);
    alert(`${controlType} functionality coming soon!`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('evaluation.leader.title', 'Leader Evaluation')}</PageTitle>
        <PageDescription>
          {t('evaluation.leader.dashboardDescription', 'Manage your team evaluations, development plans, and performance reviews')}
        </PageDescription>
      </PageHeader>

      <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('dashboard')}>
          <Icon src={dashboardIcon} alt="Dashboard" size={32} />
          {t('evaluation.leader.controls.dashboard', 'Dashboard')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('whiteValues')}>
          <Icon src={whiteValuesIcon} alt="White Values" size={32} />
          {t('evaluation.leader.controls.whiteValues', '"WHITE" Values')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('meAndDirectReports')}>
          <Icon src={directReportsIcon} alt="Direct Reports" size={32} />
          {t('evaluation.leader.controls.meAndDirectReports', 'Me and My Direct Reports')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('helpContactHR')}>
          <Icon src={helpHrIcon} alt="Help and Contact HR" size={32} />
          {t('evaluation.leader.controls.helpContactHR', 'Help and Contact with HR')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('idp')}>
          <Icon src={idpIcon} alt="Individual Development Plan" size={32} />
          {t('evaluation.leader.controls.idp', 'IDP (Individual Development Plan)')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('annualReview')}>
          <Icon src={annualReviewIcon} alt="Annual Review" size={32} />
          {t('evaluation.leader.controls.annualReview', 'Annual Review')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('selfAssessment')}>
          <Icon src={selfAssessmentIcon} alt="Self Assessment" size={32} />
          {t('evaluation.leader.controls.selfAssessment', 'Self-Assessment')}
        </ControlButton>
      </ControlsGrid>
    </PageContainer>
  );
};

export default LeaderEvaluationPage;
