import React from 'react';
import styled from '@emotion/styled';
import type { CardProps, StyledCardProps } from './Card.types';

const StyledCard = styled.div<StyledCardProps>`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  padding: ${props => {
    switch (props.$padding) {
      case 'none': return '0';
      case 'small': return '12px';
      case 'large': return '32px';
      default: return '20px';
    }
  }};
  
  ${props => props.$hoverable && `
    &:hover {
      border-color: #126678;
      box-shadow: 0 2px 8px rgba(18, 102, 120, 0.15);
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$clickable && `
    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  padding = 'medium',
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      $hoverable={hoverable}
      $padding={padding}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};
