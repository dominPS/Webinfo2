import React from 'react';
import styled from '@emotion/styled';
import { useTheme, Theme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
`;
declare module '@emotion/react' {
  export interface Theme {
    shadows: {
      large: string;
      [key: string]: string;
    };
  }
}

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const ETeczkaPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Container>
      <Title>{t('eTeczka.title', 'e-Portfolio')}</Title>
      <Card>
        <p>{t('eTeczka.comingSoon', 'This functionality will be implemented soon.')}</p>
      </Card>
    </Container>
  );
};

export default ETeczkaPage;
