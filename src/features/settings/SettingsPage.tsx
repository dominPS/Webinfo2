import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  padding: 24px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t('topMenu.settings')}</Title>
      {/* Add your settings content here */}
    </Container>
  );
};
