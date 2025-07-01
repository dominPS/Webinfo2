import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../shared/components/Icon';
import { whiteValuesIcon, selfAssessmentIcon, idpIcon, annualReviewIcon } from '../../shared/assets/icons/evaluation';
import IDPFlow from './components/IDPFlow';

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
 * Worker Evaluation Page
 * This page provides worker dashboard controls for self-evaluation and development
 */
const WorkerEvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);

  const handleControlClick = (controlType: string) => {
    if (controlType === 'idp') {
      setActiveFlow('idp');
    } else {
      // In a real app, this would navigate to specific sections or open modals
      console.log(`Worker Control clicked: ${controlType}`);
      alert(`${controlType} functionality coming soon!`);
    }
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
  };

  // If IDP flow is active, show it instead of the main dashboard
  if (activeFlow === 'idp') {
    return (
      <PageContainer>
        <button 
          onClick={handleBackToDashboard}
          style={{
            marginBottom: '16px',
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← {t('common.backToDashboard', 'Powrót do Dashboard')}
        </button>
        <IDPFlow />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('evaluation.worker.title', 'Worker Evaluation')}</PageTitle>
        <PageDescription>
          {t('evaluation.worker.dashboardDescription', 'Manage your self-evaluations, development plans, and performance reviews')}
        </PageDescription>
      </PageHeader>

      <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('whiteValues')}>
          <Icon src={whiteValuesIcon} alt="White Values" size={32} />
          {t('evaluation.worker.controls.whiteValues', '"WHITE" Values')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('selfAssessment')}>
          <Icon src={selfAssessmentIcon} alt="Self Assessment" size={32} />
          {t('evaluation.worker.controls.selfAssessment', 'Self-Assessment')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('idp')}>
          <Icon src={idpIcon} alt="Individual Development Plan" size={32} />
          {t('evaluation.worker.controls.idp', 'IDP (Individual Development Plan)')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('annualReview')}>
          <Icon src={annualReviewIcon} alt="Annual Review" size={32} />
          {t('evaluation.worker.controls.annualReview', 'Annual Review')}
        </ControlButton>
      </ControlsGrid>
    </PageContainer>
  );
};

export default WorkerEvaluationPage;
