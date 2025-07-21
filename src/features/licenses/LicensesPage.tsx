import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  margin-top: 20px;
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

export const LicensesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t('topMenu.licenses')}</Title>
      {/* Add your licenses content here */}
    </Container>
  );
};
