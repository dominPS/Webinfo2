import React from 'react';
import styled from '@emotion/styled';
import type { ButtonProps, StyledButtonProps } from './Button.types';

const StyledButton = styled.button<StyledButtonProps>`
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '6px 12px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  }};
  
  border-radius: 5px;
  font-weight: 500;
  cursor: ${props => props.$disabled || props.$loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  border: none;
  font-family: ${props => props.theme.fonts.primary};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    const disabled = props.$disabled || props.$loading;
    
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: ${disabled ? props.theme.colors.border : '#126678'};
          color: ${disabled ? props.theme.colors.text.secondary : 'white'};
          
          &:hover:not(:disabled) {
            background-color: #0f5459;
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return `
          background-color: transparent;
          color: ${disabled ? props.theme.colors.text.secondary : '#126678'};
          border: 1px solid ${disabled ? props.theme.colors.border : '#126678'};
          
          &:hover:not(:disabled) {
            background-color: #126678;
            color: white;
          }
        `;
      case 'danger':
        return `
          background-color: ${disabled ? props.theme.colors.border : '#dc2626'};
          color: ${disabled ? props.theme.colors.text.secondary : 'white'};
          
          &:hover:not(:disabled) {
            background-color: #b91c1c;
            transform: translateY(-1px);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${disabled ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.border};
          }
        `;
      default:
        return `
          background-color: ${disabled ? props.theme.colors.border : '#126678'};
          color: ${disabled ? props.theme.colors.text.secondary : 'white'};
        `;
    }
  }}
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  className,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $disabled={disabled}
      $loading={loading}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};
