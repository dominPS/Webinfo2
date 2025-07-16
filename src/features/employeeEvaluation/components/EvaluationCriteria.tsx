import React from 'react';
import './EvaluationCriteria.css';

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
    <div className="evaluation-criteria">
      <h3 className="evaluation-criteria__title">{title}</h3>
      <p className="evaluation-criteria__description">{description}</p>
      <div className="evaluation-criteria__options">
        {options.map(option => (
          <button
            key={option.value}
            className={`evaluation-criteria__option-button ${value === option.value ? 'evaluation-criteria__option-button--selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EvaluationCriteria;
