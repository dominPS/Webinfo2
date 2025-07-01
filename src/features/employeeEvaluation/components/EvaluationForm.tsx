import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import EvaluationCriteria from './EvaluationCriteria';

interface EvaluationFormProps {
  employeeId: string;
  employeeName: string;
  onSubmit: (data: any) => void;
}

const FormContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 24px;
`;

const EmployeeInfo = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const EmployeeName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text.primary};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

/**
 * EvaluationForm Component
 * Form for evaluating an employee's performance
 */
const EvaluationForm: React.FC<EvaluationFormProps> = ({
  employeeId,
  employeeName,
  onSubmit
}) => {
  const { t } = useTranslation();
  
  // Initialize state for each criteria
  const [evaluation, setEvaluation] = useState({
    performance: 0,
    teamwork: 0,
    communication: 0,
    initiative: 0,
    leadership: 0,
    comments: ''
  });

  // Rating options
  const ratingOptions = [
    { value: 1, label: `1 - ${t('evaluation.ratings.poor', 'Poor')}` },
    { value: 2, label: `2 - ${t('evaluation.ratings.belowExpectations', 'Below Expectations')}` },
    { value: 3, label: `3 - ${t('evaluation.ratings.meetsExpectations', 'Meets Expectations')}` },
    { value: 4, label: `4 - ${t('evaluation.ratings.exceedsExpectations', 'Exceeds Expectations')}` },
    { value: 5, label: `5 - ${t('evaluation.ratings.outstanding', 'Outstanding')}` }
  ];

  const handleCriteriaChange = (criteria: string, value: number) => {
    setEvaluation(prev => ({
      ...prev,
      [criteria]: value
    }));
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluation(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      employeeId,
      ...evaluation,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <EmployeeInfo>
          <EmployeeName>{employeeName}</EmployeeName>
          <div>Employee ID: {employeeId}</div>
        </EmployeeInfo>

        <EvaluationCriteria
          title={t('evaluation.performance.title', 'Job Performance')}
          description={t('evaluation.performance.description', 'Quality and quantity of work, meeting deadlines, achieving goals')}
          options={ratingOptions}
          value={evaluation.performance}
          onChange={(value) => handleCriteriaChange('performance', value)}
        />

        <EvaluationCriteria
          title={t('evaluation.teamwork.title', 'Teamwork')}
          description={t('evaluation.teamwork.description', 'Collaboration, cooperation, and relationships with colleagues')}
          options={ratingOptions}
          value={evaluation.teamwork}
          onChange={(value) => handleCriteriaChange('teamwork', value)}
        />

        <EvaluationCriteria
          title={t('evaluation.communication.title', 'Communication')}
          description={t('evaluation.communication.description', 'Clarity, effectiveness, and appropriateness of communication')}
          options={ratingOptions}
          value={evaluation.communication}
          onChange={(value) => handleCriteriaChange('communication', value)}
        />

        <EvaluationCriteria
          title={t('evaluation.initiative.title', 'Initiative & Innovation')}
          description={t('evaluation.initiative.description', 'Self-motivation, problem-solving, and creative thinking')}
          options={ratingOptions}
          value={evaluation.initiative}
          onChange={(value) => handleCriteriaChange('initiative', value)}
        />

        <EvaluationCriteria
          title={t('evaluation.leadership.title', 'Leadership')}
          description={t('evaluation.leadership.description', 'Guiding others, taking responsibility, and setting an example')}
          options={ratingOptions}
          value={evaluation.leadership}
          onChange={(value) => handleCriteriaChange('leadership', value)}
        />

        <div>
          <h3>{t('evaluation.comments.title', 'Additional Comments')}</h3>
          <textarea
            rows={5}
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '4px' }}
            value={evaluation.comments}
            onChange={handleCommentsChange}
            placeholder={t('evaluation.comments.placeholder', 'Provide any additional feedback or observations...')}
          />
        </div>

        <FormActions>
          <SecondaryButton type="button">
            {t('common.cancel', 'Cancel')}
          </SecondaryButton>
          <PrimaryButton type="submit">
            {t('common.submit', 'Submit Evaluation')}
          </PrimaryButton>
        </FormActions>
      </form>
    </FormContainer>
  );
};

export default EvaluationForm;
