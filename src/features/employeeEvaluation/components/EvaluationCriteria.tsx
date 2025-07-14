import React from 'react';
import styled from '@emotion/styled';

interface EvaluationCriteriaProps {
  title: string;
  description: string;
  options: {
    value: number;
    label: string;
  }[];
  value: number;
  onChange: (value: number) => void;
}

const CriteriaContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: ${props => props.theme.shadows.small};
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const CriteriaTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #126678;
`;

const CriteriaDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 16px;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  border: 2px solid #126678;
  background-color: ${props => props.isSelected ? '#126678' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#126678'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.isSelected ? '#0f5459' : '#f8f9fa'};
  }
`;

/**
 * EvaluationCriteria Component
 * Renders a single evaluation criteria with rating options
 */
const EvaluationCriteria: React.FC<EvaluationCriteriaProps> = ({
  title,
  description,
  options,
  value,
  onChange
}) => {
  return (
    <CriteriaContainer>
      <CriteriaTitle>{title}</CriteriaTitle>
      <CriteriaDescription>{description}</CriteriaDescription>
      <OptionsContainer>
        {options.map(option => (
          <OptionButton
            key={option.value}
            isSelected={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </OptionButton>
        ))}
      </OptionsContainer>
    </CriteriaContainer>
  );
};

export default EvaluationCriteria;
