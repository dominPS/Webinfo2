import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoginPage } from '@/features/auth/LoginPage';
import { useUIState } from '@/hooks/useUIState';
import { useAuth } from '@/hooks/useAuth';
import './Dashboard.css';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { showLoginForm } = useUIState();
  const { isLoggedIn, user } = useAuth();

  if (showLoginForm && !isLoggedIn) {
    return <LoginPage />;
  }

  if (isLoggedIn && user) {
    return (
      <div className="dashboard">
        <h1 className="dashboard__title">{t('homepage.title')}</h1>
        <p className="dashboard__welcome-text">
          {t('homepage.loggedInAs', { username: user.username })}
        </p>
        <p className="dashboard__welcome-text">
          {t('homepage.loggedInWelcome')}
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">{t('homepage.title')}</h1>
      <p className="dashboard__welcome-text">{t('homepage.welcome')}</p>
      <div className="dashboard__login-section">
        <p className="dashboard__login-instructions">{t('homepage.loginInstructions')}</p>
        <div className="dashboard__login-option">{t('homepage.employeeLogin')}</div>
        <div className="dashboard__login-option">{t('homepage.managerLogin')}</div>
        <div className="dashboard__login-option">{t('homepage.adminLogin')}</div>
      </div>
    </div>
  );
};
