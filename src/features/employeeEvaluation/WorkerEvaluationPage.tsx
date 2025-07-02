import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import IDPFlow from './components/IDPFlow';
import AnnualReviewHistory from './components/AnnualReviewHistory';
import WhiteValuesModal from '../../shared/components/WhiteValuesModal';

const PageContainer = styled.div`
  padding: 24px;
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
  margin-bottom: 32px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #126678;
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

/**
 * Worker Evaluation Page
 * This page provides worker dashboard controls for self-evaluation and development
 */
const WorkerEvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isWhiteValuesModalOpen, setIsWhiteValuesModalOpen] = useState(false);

  const handleControlClick = (controlType: string) => {
    if (controlType === 'idp') {
      setActiveFlow('idp');
    } else if (controlType === 'annualReview') {
      setActiveFlow('annualReview');
    } else if (controlType === 'whiteValues') {
      setIsWhiteValuesModalOpen(true);
    } else {
      // In a real app, this would navigate to specific sections or open modals
      console.log(`Worker Control clicked: ${controlType}`);
      alert(`${controlType} functionality coming soon!`);
    }
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
  };

  const handleCloseWhiteValuesModal = () => {
    setIsWhiteValuesModalOpen(false);
  };

  // If IDP flow is active, show it instead of the main dashboard
  if (activeFlow === 'idp') {
    return (
      <PageContainer>
        <ContentWrapper>
          <BackButton onClick={handleBackToDashboard}>
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
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
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
          </BackButton>
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
            {t('evaluation.worker.controls.whiteValues', 'Company Values')}
          </ControlButton>
          
          <ControlButton onClick={() => handleControlClick('selfAssessment')}>
            {t('evaluation.worker.controls.selfAssessment', 'Self-Assessment')}
          </ControlButton>
          
          <ControlButton onClick={() => handleControlClick('idp')}>
            {t('evaluation.worker.controls.idp', 'IDP (Individual Development Plan)')}
          </ControlButton>
          
          <ControlButton onClick={() => handleControlClick('annualReview')}>
            {t('evaluation.worker.controls.annualReview', 'Annual Review')}
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

export default WorkerEvaluationPage;
