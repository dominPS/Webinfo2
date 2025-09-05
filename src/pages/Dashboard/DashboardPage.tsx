import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const DashboardContainer = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.large};
  margin-bottom: 16px;
`;

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <DashboardContainer>
      <Title>{t('navigation.employeeEvaluation')}</Title>
      <Card>
        <p>{t('homepage.welcome')}</p>
      </Card>
    </DashboardContainer>
  );
};

export default DashboardPage;
