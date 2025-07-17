import React from 'react';
import styled from '@emotion/styled';
import type { LoadingSpinnerProps, StyledSpinnerProps } from './LoadingSpinner.types';

const StyledSpinner = styled.div<StyledSpinnerProps>`
  width: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  
  border: ${props => {
    const thickness = props.$size === 'small' ? '2px' : props.$size === 'large' ? '4px' : '3px';
    return `${thickness} solid transparent`;
  }};
  
  border-top: ${props => {
    const thickness = props.$size === 'small' ? '2px' : props.$size === 'large' ? '4px' : '3px';
    const color = props.$color || '#126678';
    return `${thickness} solid ${color}`;
  }};
  
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  className,
  ...props
}) => {
  return (
    <StyledSpinner
      $size={size}
      $color={color}
      className={className}
      {...props}
    />
  );
};
