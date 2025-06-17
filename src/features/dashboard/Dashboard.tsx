import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { LoginPage } from '@/features/auth/LoginPage';
import { useUIState } from '@/hooks/useUIState';
import { useAuth } from '@/hooks/useAuth';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const WelcomeText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

const LoginSection = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
`;

const LoginInstructions = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.1rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: 500;
`;

const LoginOption = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-family: 'Roboto', monospace;
  padding: ${props => props.theme.spacing.sm};
  margin: ${props => props.theme.spacing.sm} 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: ${props => props.theme.borderRadius.small};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

export const Dashboard = () => {
  const { t } = useTranslation();
  const { showLoginForm } = useUIState();
  const { isLoggedIn, user } = useAuth();

  if (showLoginForm && !isLoggedIn) {
    return <LoginPage />;
  }

  if (isLoggedIn && user) {
    return (
      <Container>
        <Title>{t('homepage.title')}</Title>
        <WelcomeText>
          {t('homepage.loggedInAs', { username: user.username })}
        </WelcomeText>
        <WelcomeText>
          {t('homepage.loggedInWelcome')}
        </WelcomeText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{t('homepage.title')}</Title>
      <WelcomeText>{t('homepage.welcome')}</WelcomeText>
      <LoginSection>
        <LoginInstructions>{t('homepage.loginInstructions')}</LoginInstructions>
        <LoginOption>{t('homepage.employeeLogin')}</LoginOption>
        <LoginOption>{t('homepage.managerLogin')}</LoginOption>
        <LoginOption>{t('homepage.adminLogin')}</LoginOption>
      </LoginSection>
    </Container>
  );
};
