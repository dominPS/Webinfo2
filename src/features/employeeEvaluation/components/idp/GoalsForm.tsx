import React from 'react';
import { useTranslation } from 'react-i18next';
import { GoalsContainer, YearSection, YearTitle, FormGroup, Label, Input, TextArea, Select, ActionButtons, ActionButton } from './IDPStyledComponents';

export interface Goal {
  id: string;
  title: string;
  description: string;
  year: number;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed';
  category: string;
}

interface GoalsFormProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

export const GoalsForm: React.FC<GoalsFormProps> = ({ goals, onGoalsChange }) => {
  const { t } = useTranslation();

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      year: new Date().getFullYear(),
      priority: 'medium',
      status: 'not_started',
      category: ''
    };
    onGoalsChange([...goals, newGoal]);
  };

  const handleUpdateGoal = (goalId: string, field: keyof Goal, value: any) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, [field]: value } : goal
    );
    onGoalsChange(updatedGoals);
  };

  const handleRemoveGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    onGoalsChange(updatedGoals);
  };

  const groupGoalsByYear = () => {
    return goals.reduce((acc, goal) => {
      if (!acc[goal.year]) {
        acc[goal.year] = [];
      }
      acc[goal.year].push(goal);
      return acc;
    }, {} as Record<number, Goal[]>);
  };

  const goalsByYear = groupGoalsByYear();
  const years = Object.keys(goalsByYear).map(year => parseInt(year)).sort();

  return (
    <GoalsContainer>
      {years.map(year => (
        <YearSection key={year}>
          <YearTitle>{t('employee.evaluation.idp.year')} {year}</YearTitle>
          {goalsByYear[year].map(goal => (
            <div key={goal.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <FormGroup>
                <Label>{t('employee.evaluation.idp.goal_title')}</Label>
                <Input
                  type="text"
                  value={goal.title}
                  onChange={(e) => handleUpdateGoal(goal.id, 'title', e.target.value)}
                  placeholder={t('employee.evaluation.idp.goal_title_placeholder')}
                />
              </FormGroup>

              <FormGroup>
                <Label>{t('employee.evaluation.idp.goal_description')}</Label>
                <TextArea
                  value={goal.description}
                  onChange={(e) => handleUpdateGoal(goal.id, 'description', e.target.value)}
                  placeholder={t('employee.evaluation.idp.goal_description_placeholder')}
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <FormGroup>
                  <Label>{t('employee.evaluation.idp.priority')}</Label>
                  <Select
                    value={goal.priority}
                    onChange={(e) => handleUpdateGoal(goal.id, 'priority', e.target.value)}
                  >
                    <option value="high">{t('employee.evaluation.idp.priority_high')}</option>
                    <option value="medium">{t('employee.evaluation.idp.priority_medium')}</option>
                    <option value="low">{t('employee.evaluation.idp.priority_low')}</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>{t('employee.evaluation.idp.status')}</Label>
                  <Select
                    value={goal.status}
                    onChange={(e) => handleUpdateGoal(goal.id, 'status', e.target.value)}
                  >
                    <option value="not_started">{t('employee.evaluation.idp.status_not_started')}</option>
                    <option value="in_progress">{t('employee.evaluation.idp.status_in_progress')}</option>
                    <option value="completed">{t('employee.evaluation.idp.status_completed')}</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>{t('employee.evaluation.idp.category')}</Label>
                  <Input
                    type="text"
                    value={goal.category}
                    onChange={(e) => handleUpdateGoal(goal.id, 'category', e.target.value)}
                    placeholder={t('employee.evaluation.idp.category_placeholder')}
                  />
                </FormGroup>
              </div>

              <ActionButtons>
                <ActionButton 
                  variant="cancel" 
                  onClick={() => handleRemoveGoal(goal.id)}
                  type="button"
                >
                  {t('employee.evaluation.idp.remove_goal')}
                </ActionButton>
              </ActionButtons>
            </div>
          ))}
        </YearSection>
      ))}

      <ActionButtons>
        <ActionButton 
          variant="save" 
          onClick={handleAddGoal}
          type="button"
        >
          {t('employee.evaluation.idp.add_goal')}
        </ActionButton>
      </ActionButtons>
    </GoalsContainer>
  );
};
