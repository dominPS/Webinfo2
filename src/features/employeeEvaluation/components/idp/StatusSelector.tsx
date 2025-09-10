import React from 'react';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioOption, RadioInput, RadioLabel } from './IDPStyledComponents';

interface StatusSelectorProps {
  status: 'draft' | 'submitted';
  onStatusChange: (status: 'draft' | 'submitted') => void;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({ status, onStatusChange }) => {
  const { t } = useTranslation();

  return (
    <RadioGroup>
      <RadioOption>
        <RadioInput
          type="radio"
          name="status"
          value="draft"
          checked={status === 'draft'}
          onChange={() => onStatusChange('draft')}
        />
        <RadioLabel>{t('employee.evaluation.idp.draft')}</RadioLabel>
      </RadioOption>
      
      <RadioOption>
        <RadioInput
          type="radio"
          name="status"
          value="submitted"
          checked={status === 'submitted'}
          onChange={() => onStatusChange('submitted')}
        />
        <RadioLabel>{t('employee.evaluation.idp.submitted')}</RadioLabel>
      </RadioOption>
    </RadioGroup>
  );
};
