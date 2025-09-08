import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/stores';
import { Alert, CircularProgress } from '@mui/material';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #F5F5F5;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  color: #126678;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
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
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #0e5260;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LoginCredentials = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
`;

const CredentialsTitle = styled.h2`
  font-size: 18px;
  color: #126678;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 600;
`;

const CredentialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CredentialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border-left: 3px solid #126678;
`;

interface RoleBadgeProps {
  employee?: boolean;
  manager?: boolean;
  hr?: boolean;
}

const RoleBadge = styled.span<RoleBadgeProps>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  min-width: 80px;
  text-align: center;
  background-color: ${props => 
    props.manager ? '#FFA000' : 
    props.hr ? '#2E7D32' : 
    '#126678'
  };
`;

const CredentialEmail = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const CredentialPassword = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('jan.kowalski@company.com'); // Pre-filled for demo
  const [password, setPassword] = useState('Test123!'); // Pre-filled for demo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>{t('login.title')}</Title>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <InputGroup>
          <Label htmlFor="email">{t('login.username')}</Label>
          <Input 
            id="email"
            type="email" 
            placeholder={t('login.usernamePlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
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
            disabled={isLoading}
            required
          />
        </InputGroup>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading && <CircularProgress size={20} color="inherit" />}
          {t('login.loginButton')}
        </Button>
      </LoginForm>
      
      <LoginCredentials>
        <CredentialsTitle>Demo Credentials</CredentialsTitle>
        <CredentialsList>
          <CredentialItem>
            <RoleBadge employee>Employee</RoleBadge>
            <div>
              <CredentialEmail>jan.kowalski@company.com</CredentialEmail>
              <CredentialPassword>Test123!</CredentialPassword>
            </div>
          </CredentialItem>
          <CredentialItem>
            <RoleBadge manager>Manager</RoleBadge>
            <div>
              <CredentialEmail>anna.nowak@company.com</CredentialEmail>
              <CredentialPassword>Test123!</CredentialPassword>
            </div>
          </CredentialItem>
          <CredentialItem>
            <RoleBadge hr>HR</RoleBadge>
            <div>
              <CredentialEmail>piotr.wisniewski@company.com</CredentialEmail>
              <CredentialPassword>Test123!</CredentialPassword>
            </div>
          </CredentialItem>
        </CredentialsList>
      </LoginCredentials>
    </LoginContainer>
  );
};

export default LoginPage;
