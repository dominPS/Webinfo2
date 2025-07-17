import React from 'react';
import styled from '@emotion/styled';
import type { ContainerProps, StyledContainerProps } from './Container.types';

const StyledContainer = styled.div<StyledContainerProps>`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  min-height: calc(100vh - 200px);
  font-family: ${props => props.theme.fonts.primary};
  max-width: ${props => props.$maxWidth || 'none'};
  margin: ${props => props.$centerContent ? '0 auto' : '0'};
  
  padding: ${props => {
    switch (props.$padding) {
      case 'none': return '0';
      case 'small': return '12px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  padding = 'medium',
  maxWidth,
  centerContent = false,
  ...props
}) => {
  return (
    <StyledContainer
      $padding={padding}
      $maxWidth={maxWidth}
      $centerContent={centerContent}
      className={className}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};
