import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EvaluationCriteria from './EvaluationCriteria';
import './EvaluationForm.css';

interface EvaluationFormProps {
  employeeId: string;
  employeeName: string;
  onSubmit: (data: any) => void;
}

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
    <div className="evaluation-form">
      <form onSubmit={handleSubmit}>
        <div className="evaluation-form__employee-info">
          <h2 className="evaluation-form__employee-name">{employeeName}</h2>
          <div>Employee ID: {employeeId}</div>
        </div>

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

        <div className="evaluation-form__comments">
          <h3 className="evaluation-form__comments-title">{t('evaluation.comments.title', 'Additional Comments')}</h3>
          <textarea
            className="evaluation-form__comments-textarea"
            rows={5}
            value={evaluation.comments}
            onChange={handleCommentsChange}
            placeholder={t('evaluation.comments.placeholder', 'Provide any additional feedback or observations...')}
          />
        </div>

        <div className="evaluation-form__actions">
          <button type="button" className="evaluation-form__button evaluation-form__button--secondary">
            {t('common.cancel', 'Cancel')}
          </button>
          <button type="submit" className="evaluation-form__button evaluation-form__button--primary">
            {t('common.submit', 'Submit Evaluation')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
