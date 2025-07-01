import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../shared/components/Icon';
import { whiteValuesIcon, selfAssessmentIcon, idpIcon, annualReviewIcon } from '../../shared/assets/icons/evaluation';
import IDPFlow from './components/IDPFlow';
import AnnualReviewHistory from './components/AnnualReviewHistory';

const PageContainer = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  min-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
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

const BackButton = styled.button`
  margin-bottom: 16px;
  padding: 6px 12px;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  padding-bottom: 200px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
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
    } else if (controlType === 'annualReview') {
      setActiveFlow('annualReview');
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
        <BackButton onClick={handleBackToDashboard}>
          ← {t('common.backToDashboard', 'Powrót do Dashboard')}
        </BackButton>
        <ContentWrapper>
          <IDPFlow />
        </ContentWrapper>
      </PageContainer>
    );
  }

  // If Annual Review flow is active, show it instead of the main dashboard
  if (activeFlow === 'annualReview') {
    return (
      <PageContainer>
        <BackButton onClick={handleBackToDashboard}>
          ← {t('common.backToDashboard', 'Powrót do Dashboard')}
        </BackButton>
        <ContentWrapper>
          <AnnualReviewHistory />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
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
      </ContentWrapper>
    </PageContainer>
  );
};

export default WorkerEvaluationPage;
