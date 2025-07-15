import React from 'react';
import './Icon.css';

interface IconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * Icon Component
 * Consistent icon display with standard sizing
 */
const Icon: React.FC<IconProps> = ({ src, alt, size = 24, className }) => {
  const sizeClass = `icon--size-${size}`;
  const combinedClassName = `icon ${sizeClass} ${className || ''}`.trim();

  return (
    <img 
      src={src} 
      alt={alt} 
      className={combinedClassName}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
};

export default Icon;
