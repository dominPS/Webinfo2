import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input, Select } from './IDPStyledComponents';

interface BasicInfoFormProps {
  employeeName: string;
  onEmployeeNameChange: (value: string) => void;
  position: string;
  onPositionChange: (value: string) => void;
  planType: 'training' | 'plan';
  onPlanTypeChange: (value: 'training' | 'plan') => void;
  year: number;
  onYearChange: (value: number) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  employeeName,
  onEmployeeNameChange,
  position,
  onPositionChange,
  planType,
  onPlanTypeChange,
  year,
  onYearChange
}) => {
  const { t } = useTranslation();

  const yearOptions = [];
  for (let y = 2020; y <= 2030; y++) {
    yearOptions.push(y);
  }

  return (
    <>
      <FormGroup>
        <Label htmlFor="employeeName">{t('employee.evaluation.idp.employee_name')}</Label>
        <Input
          id="employeeName"
          type="text"
          value={employeeName}
          onChange={(e) => onEmployeeNameChange(e.target.value)}
          placeholder={t('employee.evaluation.idp.employee_name_placeholder')}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="position">{t('employee.evaluation.idp.position')}</Label>
        <Input
          id="position"
          type="text"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          placeholder={t('employee.evaluation.idp.position_placeholder')}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="planType">{t('employee.evaluation.idp.plan_type')}</Label>
        <Select
          id="planType"
          value={planType}
          onChange={(e) => onPlanTypeChange(e.target.value as 'training' | 'plan')}
        >
          <option value="training">{t('employee.evaluation.idp.training_plan')}</option>
          <option value="plan">{t('employee.evaluation.idp.development_plan')}</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="year">{t('employee.evaluation.idp.year')}</Label>
        <Select
          id="year"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
        >
          {yearOptions.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Select>
      </FormGroup>
    </>
  );
};
