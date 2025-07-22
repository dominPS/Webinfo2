import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUIState } from '@/hooks/useUIState';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: ${props => props.theme.spacing.xl};
`;

const LoginForm = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.large};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border || '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 68, 68, 0.1);
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid rgba(255, 68, 68, 0.3);
`;


export const LoginPage: React.FC = () => {
  return (
    <LoginContainer>
      <LoginForm>
        <Title>Witaj w systemie WebInfo.</Title>
      </LoginForm>
    </LoginContainer>
  );
};
