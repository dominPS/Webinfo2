import React, { useState } from 'react';
import styled from '@emotion/styled';
import LeaderIDPFlow from './LeaderIDPFlow';
import LeaderAnnualReviewHistory from './LeaderAnnualReviewHistory';
import { Button } from '@/components/ui';

interface LeaderTeamEvaluationFlowProps {
  onBack?: () => void;
}

type EvaluationStep = 'overview' | 'idp' | 'reviews';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const NavigationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto 32px auto;
`;

const NavigationCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${props => 
    props.color === 'blue' ? '#dbeafe' : 
    props.color === 'green' ? '#d1fae5' : '#f3f4f6'
  };
`;

const Icon = styled.svg<{ color: string }>`
  width: 20px;
  height: 20px;
  color: ${props => 
    props.color === 'blue' ? '#2563eb' : 
    props.color === 'green' ? '#059669' : '#6b7280'
  };
`;

const CardTextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArrowIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
`;

const InfoSection = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const InfoColumn = styled.div``;

const InfoHeading = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 16px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const InfoListItem = styled.li`
  margin-bottom: 4px;
`;

const LeaderTeamEvaluationFlow: React.FC<LeaderTeamEvaluationFlowProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<EvaluationStep>('overview');

  const handleStepChange = (step: EvaluationStep) => {
    setCurrentStep(step);
  };

  const handleBackToOverview = () => {
    setCurrentStep('overview');
  };

  if (currentStep === 'idp') {
    return (
      <LeaderIDPManagementFlow
        onBack={handleBackToOverview}
      />
    );
  }

  if (currentStep === 'reviews') {
    return (
      <LeaderAnnualReviewFlow
        onBack={handleBackToOverview}
      />
    );
  }

  // Overview step - navigation menu
  return (
    <Container>
      <Header>
        <Title>Zarządzanie zespołem</Title>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Wróć
          </Button>
        )}
      </Header>

      <NavigationGrid>
        <NavigationCard onClick={() => handleStepChange('idp')}>
          <CardContent>
            <IconWrapper color="blue">
              <Icon color="blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </Icon>
            </IconWrapper>
            <CardTextContent>
              <CardTitle>Plany rozwoju (IDP)</CardTitle>
              <CardDescription>Zarządzaj planami rozwoju indywidualnego pracowników</CardDescription>
            </CardTextContent>
            <ArrowIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </ArrowIcon>
          </CardContent>
        </NavigationCard>

        <NavigationCard onClick={() => handleStepChange('reviews')}>
          <CardContent>
            <IconWrapper color="green">
              <Icon color="green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </Icon>
            </IconWrapper>
            <CardTextContent>
              <CardTitle>Oceny roczne</CardTitle>
              <CardDescription>Przeprowadzaj i zarządzaj ocenami rocznymi pracowników</CardDescription>
            </CardTextContent>
            <ArrowIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </ArrowIcon>
          </CardContent>
        </NavigationCard>
      </NavigationGrid>

      <InfoSection>
        <InfoTitle>Informacje</InfoTitle>
        <InfoGrid>
          <InfoColumn>
            <InfoHeading>Plany rozwoju (IDP):</InfoHeading>
            <InfoList>
              <InfoListItem>Przeglądaj wszystkie plany rozwoju pracowników</InfoListItem>
              <InfoListItem>Akceptuj lub odrzucaj plany</InfoListItem>
              <InfoListItem>Dodawaj komentarze i feedback</InfoListItem>
            </InfoList>
          </InfoColumn>
          <InfoColumn>
            <InfoHeading>Oceny roczne:</InfoHeading>
            <InfoList>
              <InfoListItem>Przeprowadzaj oceny roczne</InfoListItem>
              <InfoListItem>Przeglądaj historię ocen</InfoListItem>
              <InfoListItem>Generuj raporty zespołowe</InfoListItem>
            </InfoList>
          </InfoColumn>
        </InfoGrid>
      </InfoSection>
    </Container>
  );
};

export default LeaderTeamEvaluationFlow;
