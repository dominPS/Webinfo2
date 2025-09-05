import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 24px;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    opacity: 0.9;
  }
`;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // W normalnej aplikacji tutaj byłaby prawdziwa logika uwierzytelniania
    // Dla demonstracji, po prostu przekierowujemy na stronę główną
    if (username && password) {
      navigate('/');
    } else {
      setError(t('login.invalidCredentials'));
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>{t('login.title')}</Title>
        
        <InputGroup>
          <Label htmlFor="username">{t('login.username')}</Label>
          <Input 
            id="username"
            type="text" 
            placeholder={t('login.usernamePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">{t('login.password')}</Label>
          <Input 
            id="password"
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        
        <Button type="submit">
          {t('login.loginButton')}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
