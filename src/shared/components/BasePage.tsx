import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  padding: 18px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const Title = styled.h1`
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const Content = styled.div`
  color: ${props => props.theme.colors.text.primary};
`;

interface PageProps {
  translationKey: string;
}

export const BasePage: React.FC<PageProps> = ({ translationKey }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>{t(`navigation.${translationKey}`)}</Title>
      <Content>
        {/* Content will be added later */}
      </Content>
    </Container>
  );
};
