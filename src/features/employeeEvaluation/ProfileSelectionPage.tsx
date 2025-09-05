import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 40px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  max-width: 800px;
  margin: 0 auto;
`;

const AppTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #126678;
  margin-bottom: 12px;
  text-align: center;
`;

const AppDescription = styled.p`
  font-size: 18px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 40px;
  text-align: center;
  max-width: 600px;
`;

const Label = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 32px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileButton = styled.button`
  padding: 16px 32px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.colors.primary};
  background-color: white;
  color: ${props => props.theme.colors.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  min-width: 150px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}33;
  }
`;

/**
 * Profile Selection Page
 * Allows users to choose their profile before accessing employee evaluation
 */
const ProfileSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProfileSelect = (profile: string) => {
    // Navigate to the appropriate evaluation page based on profile
    switch (profile) {
      case 'worker':
        navigate('/employee-evaluation/worker');
        break;
      case 'leader':
        navigate('/employee-evaluation/leader');
        break;
      case 'hr':
        navigate('/employee-evaluation/hr');
        break;
      default:
        navigate('/employee-evaluation/worker');
    }
  };

  return (
    <PageContainer>
      <AppTitle>{t('app.title', 'Employee Evaluation System')}</AppTitle>
      <AppDescription>
        {t('app.description', 'Welcome to the employee evaluation system. Please select your role to proceed with the appropriate evaluation process.')}
      </AppDescription>
      <Label>{t('evaluation.chooseProfile', 'Choose your profile')}</Label>
      <ButtonContainer>
        <ProfileButton onClick={() => handleProfileSelect('worker')}>
          {t('evaluation.profiles.worker', 'Worker')}
        </ProfileButton>
        <ProfileButton onClick={() => handleProfileSelect('leader')}>
          {t('evaluation.profiles.leader', 'Leader')}
        </ProfileButton>
        <ProfileButton onClick={() => handleProfileSelect('hr')}>
          {t('evaluation.profiles.hr', 'HR')}
        </ProfileButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default ProfileSelectionPage;
