import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 5rem;
  color: #126678;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #666666;
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #126678;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid #126678;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #126678;
    color: white;
  }
`;

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Title>404</Title>
      <Message>{t('notFound.message', 'The page you are looking for does not exist.')}</Message>
      <StyledLink to="/">{t('notFound.goHome', 'Go to Home')}</StyledLink>
    </Container>
  );
};

export default NotFoundPage;
