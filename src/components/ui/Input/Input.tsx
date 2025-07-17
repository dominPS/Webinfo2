import React from 'react';
import styled from '@emotion/styled';
import type { InputProps, StyledInputProps } from './Input.types';

const StyledInput = styled.input<StyledInputProps>`
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '6px 12px';
      case 'large': return '16px 20px';
      default: return '12px 16px';
    }
  }};
  
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  }};
  
  border: 1px solid ${props => {
    if (props.$error) return '#dc2626';
    return props.theme.colors.border;
  }};
  
  border-radius: 5px;
  background-color: ${props => props.$disabled ? props.theme.colors.border : props.theme.colors.surface};
  color: ${props => props.$disabled ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.primary};
  transition: all 0.2s ease;
  outline: none;
  
  &:focus {
    border-color: ${props => props.$error ? '#dc2626' : '#126678'};
    box-shadow: 0 0 0 2px ${props => props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(18, 102, 120, 0.1)'};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'medium',
  error = false,
  className,
  id,
  name,
  ...props
}) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      required={required}
      $fullWidth={fullWidth}
      $size={size}
      $error={error}
      $disabled={disabled}
      className={className}
      id={id}
      name={name}
      {...props}
    />
  );
};
