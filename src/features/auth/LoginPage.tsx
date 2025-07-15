import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIState } from '@/hooks/useUIState';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { setShowLoginForm } = useUIState();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      setShowLoginForm(false);
    } else {
      setError(t('login.invalidCredentials'));
    }
  };

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-page__form">
        <h1 className="login-page__title">{t('login.title')}</h1>
        
        <form onSubmit={handleLogin}>
          <div className="login-page__form-group">
            <label className="login-page__label" htmlFor="username">{t('login.username')}</label>
            <input
              className="login-page__input"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('login.usernamePlaceholder')}
            />
          </div>

          <div className="login-page__form-group">
            <label className="login-page__label" htmlFor="password">{t('login.password')}</label>
            <input
              className="login-page__input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
            />
          </div>

          {error && <div className="login-page__error">{error}</div>}

          <button className="login-page__button" type="submit">
            {t('login.loginButton')}
          </button>
        </form>

        <div className="login-page__demo">
          <h3 className="login-page__demo-title">{t('login.demoCredentials')}</h3>
          <div className="login-page__demo-option" onClick={() => fillCredentials('pracownik', 'pracownik')}>
            {t('homepage.employeeLogin')}
          </div>
          <div className="login-page__demo-option" onClick={() => fillCredentials('kierownik', 'kierownik')}>
            {t('homepage.managerLogin')}
          </div>
          <div className="login-page__demo-option" onClick={() => fillCredentials('admin', 'admin')}>
            {t('homepage.adminLogin')}
          </div>
        </div>
      </div>
    </div>
  );
};
