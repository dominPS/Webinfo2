import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import IDPFlow from './components/LeaderIDPFlow';
import AnnualReviewHistory from './components/LeaderAnnualReviewHistory';
import WhiteValuesModal from '../../shared/components/WhiteValuesModal';

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
  margin-bottom: 16px;
  padding: 6px 12px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
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
 * Leader Evaluation Page
 * This page provides leader dashboard controls for managing team evaluations and development
 */
const LeaderEvaluationPage: React.FC = () => {
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
      console.log(`Leader Control clicked: ${controlType}`);
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
          <PageTitle>{t('evaluation.leader.title', 'Leader Evaluation')}</PageTitle>
          <PageDescription>
            {t('evaluation.leader.dashboardDescription', 'Manage your team evaluations, development plans, and performance reviews')}
          </PageDescription>
        </PageHeader>

        <ControlsGrid>
        <ControlButton onClick={() => handleControlClick('dashboard')}>
          {t('evaluation.leader.controls.dashboard', 'Dashboard')}
        </ControlButton>
        
        <ControlButton onClick={() => handleControlClick('whiteValues')}>
          {t('evaluation.leader.controls.whiteValues', '"WHITE" Values')}
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
