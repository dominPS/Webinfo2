import React from 'react';
import styled from '@emotion/styled';

interface IconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

const IconImage = styled.img<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
`;

/**
 * Icon Component
 * Consistent icon display with standard sizing
 */
const Icon: React.FC<IconProps> = ({ src, alt, size = 24, className }) => {
  return (
    <IconImage 
      src={src} 
      alt={alt} 
      size={size} 
      className={className}
    />
  );
};

export default Icon;
