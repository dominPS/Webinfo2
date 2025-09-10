import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormGroup,
  Label,
  RadioGroup,
  RadioOption,
  RadioInput,
  RadioLabel,
  TitleContainer,
  TextAreaLabel,
  StyledTitleInput,
  TextAreaContainer,
  StyledTextArea,
  InfoBadge
} from './IDPFlowStyledComponents';

interface GoalFormData {
  title: string;
  description: string;
  details: string;
  category: 'business' | 'development';
}

interface GoalFormProps {
  goalData: GoalFormData;
  onGoalDataChange: (data: GoalFormData) => void;
  onInfoClick: () => void;
  onTitleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  goalData,
  onGoalDataChange,
  onInfoClick,
  onTitleInputChange
}) => {
  const { t } = useTranslation();

  return (
    <>
      <InfoBadge type="training" onClick={onInfoClick}>
        {t('idp.info.badge', 'IDP info about Goals - Goal Categories')}
      </InfoBadge>

      <FormGroup>
        <Label>{t('idp.form.goalType', 'Typ celu')}</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="goalType"
              value="business"
              checked={goalData.category === 'business'}
              onChange={(e) => onGoalDataChange({...goalData, category: 'business'})}
            />
            <RadioLabel>{t('idp.categories.business', 'Cel biznesowy')}</RadioLabel>
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="goalType"
              value="development"
              checked={goalData.category === 'development'}
              onChange={(e) => onGoalDataChange({...goalData, category: 'development'})}
            />
            <RadioLabel>{t('idp.categories.development', 'Cel rozwojowy')}</RadioLabel>
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      <TitleContainer>
        <TextAreaLabel>{t('idp.form.goalTitle', 'Tytuł celu')}</TextAreaLabel>
        <StyledTitleInput
          value={goalData.title}
          onChange={onTitleInputChange}
          placeholder={t('idp.form.goalTitlePlaceholder', 'Wprowadź tytuł celu rozwoju')}
          rows={1}
        />
      </TitleContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>{t('idp.form.goalDescription', 'Opis celu')}</TextAreaLabel>
        <StyledTextArea
          value={goalData.description}
          onChange={(e) => onGoalDataChange({...goalData, description: e.target.value})}
          placeholder={t('idp.form.goalDescriptionPlaceholder', 'Opisz swój cel...')}
        />
      </TextAreaContainer>
      
      <TextAreaContainer>
        <TextAreaLabel>{t('idp.form.goalDetails', 'Szczegóły celu')}</TextAreaLabel>
        <StyledTextArea
          value={goalData.details}
          onChange={(e) => onGoalDataChange({...goalData, details: e.target.value})}
          placeholder={t('idp.form.goalDetailsPlaceholder', 'Opisz szczegółowe kroki i oczekiwane wyniki...')}
        />
      </TextAreaContainer>
    </>
  );
};
