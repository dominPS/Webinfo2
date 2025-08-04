import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IDPFlow from './components/IDPFlow';
import AnnualReviewHistory from './components/AnnualReviewHistory';
import SelfEvaluationPage from './SelfEvaluationPage';
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
    } else if (controlType === 'selfAssessment') {
      setActiveFlow('selfAssessment');
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
          <Button 
            variant="contained"
            onClick={handleBackToDashboard}
            sx={{ mb: 1.5, alignSelf: 'flex-start' }}
          >
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
          </Button>
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
          <Button 
            variant="contained"
            onClick={handleBackToDashboard}
            sx={{ mb: 1.5, alignSelf: 'flex-start' }}
          >
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
          </Button>
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
          <PageTitle>{t('evaluation.worker.title', 'Worker Evaluation')}</PageTitle>
          <PageDescription>
            {t('evaluation.worker.dashboardDescription', 'Manage your self-evaluations, development plans, and performance reviews')}
          </PageDescription>
        </PageHeader>

        <ControlsGrid>
          <Button 
            variant="outlined"
            onClick={() => handleControlClick('whiteValues')}
          >
            {t('evaluation.worker.controls.whiteValues', 'Company Values')}
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => handleControlClick('selfAssessment')}
          >
            {t('evaluation.worker.controls.selfAssessment', 'Self-Assessment')}
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => handleControlClick('idp')}
          >
            {t('evaluation.worker.controls.idp', 'IDP (Individual Development Plan)')}
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => handleControlClick('annualReview')}
          >
            {t('evaluation.worker.controls.annualReview', 'Annual Review')}
          </Button>
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
