import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';
import { idpIcon } from '../../../shared/assets/icons/evaluation';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  category: '70' | '20' | '10'; // 70% job experience, 20% mentoring, 10% training
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

const FlowContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FlowHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const FlowTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 8px;
`;

const FlowStep = styled.div<{ isActive: boolean }>`
  padding: 20px;
  border: 2px solid ${props => props.isActive ? '#2563eb' : '#e5e7eb'};
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: ${props => props.isActive ? '#eff6ff' : 'white'};
  transition: all 0.3s ease;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const InfoBadge = styled.div<{ type: 'training' | 'plan' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.type === 'training' ? '#10b981' : '#2563eb'};
  color: white;
  margin-bottom: 16px;
`;

const PlanBox = styled.div`
  padding: 16px;
  background-color: #2563eb;
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const PlanTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 8px;
`;

const PlanDetails = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

const ActionButton = styled.button<{ variant: 'cancel' | 'draft' | 'save' | 'submit' | 'approve' | 'correct' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'cancel': return '#ef4444';
      case 'draft': return '#8b5cf6';
      case 'save': return '#6b7280';
      case 'submit': return '#2563eb';
      case 'approve': return '#10b981';
      case 'correct': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
  
  color: white;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const GoalForm = styled.div`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  rows: 3;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

const StatusMessage = styled.div<{ type: 'success' | 'warning' | 'info' }>`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#d1fae5';
      case 'warning': return '#fef3c7';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  }};
`;

type FlowStep = 'my-idp' | 'add-goal' | 'plan-2025' | 'review' | 'final';

const IDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('my-idp');
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '70' as '70' | '20' | '10'
  });

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.description) {
      const goal: IDPGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        status: 'draft',
        year: 2025
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', category: '70' });
      setCurrentStep('plan-2025');
    }
  };

  const handleSaveDraft = () => {
    if (newGoal.title && newGoal.description) {
      const goal: IDPGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        status: 'draft',
        year: 2025
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', category: '70' });
      // Stay on the same page to allow adding more goals
    }
  };

  const handleSaveGoal = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'submitted' } 
        : goal
    ));
  };

  const handleSubmitForReview = () => {
    setCurrentStep('review');
  };

  const handleApprove = () => {
    setGoals(goals.map(goal => ({ ...goal, status: 'approved' })));
    setCurrentStep('final');
  };

  const handleRequestCorrection = () => {
    setGoals(goals.map(goal => ({ ...goal, status: 'correction_needed' })));
    setCurrentStep('add-goal');
  };

  return (
    <FlowContainer>
      <FlowHeader>
        <Icon src={idpIcon} alt="IDP" size={32} />
        <FlowTitle>{t('idp.flow.title', 'Plan Rozwoju Indywidualnego (IDP)')}</FlowTitle>
      </FlowHeader>

      {/* Step 1: My IDP */}
      <FlowStep isActive={currentStep === 'my-idp'}>
        <StepHeader>
          <StepTitle>{t('idp.myIdp.title', 'My IDP')}</StepTitle>
        </StepHeader>
        <p>{t('idp.myIdp.description', 'Manage your individual development plan for 2025')}</p>
        <ActionButtons>
          <ActionButton 
            variant="submit" 
            onClick={() => setCurrentStep('add-goal')}
          >
            {t('idp.actions.addGoal', 'Add IDP Goal')}
          </ActionButton>
        </ActionButtons>
      </FlowStep>

      {/* Step 2: Add IDP Goal */}
      {currentStep === 'add-goal' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.addGoal.title', 'Add IDP Goal')}</StepTitle>
          </StepHeader>
          
          <InfoBadge type="training">
            {t('idp.training.info', 'Training info about Goals - Plan breakdown 70/20/10')}
          </InfoBadge>

          <GoalForm>
            <FormGroup>
              <Label>{t('idp.form.goalTitle', 'Goal Title')}</Label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder={t('idp.form.goalTitlePlaceholder', 'Enter development goal title')}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>{t('idp.form.goalDescription', 'Goal Description')}</Label>
              <TextArea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder={t('idp.form.goalDescriptionPlaceholder', 'Describe your development goal in detail')}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>{t('idp.form.category', 'Category (70/20/10)')}</Label>
              <Select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value as '70' | '20' | '10'})}
              >
                <option value="70">{t('idp.categories.70', '70% - Work Experience')}</option>
                <option value="20">{t('idp.categories.20', '20% - Mentoring/Coaching')}</option>
                <option value="10">{t('idp.categories.10', '10% - Formal Training')}</option>
              </Select>
            </FormGroup>
          </GoalForm>

          <ActionButtons>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.cancel', 'Cancel')}
            </ActionButton>
            <ActionButton variant="draft" onClick={handleSaveDraft}>
              {t('idp.actions.draft', 'Draft')}
            </ActionButton>
            <ActionButton variant="save" onClick={handleAddGoal}>
              {t('idp.actions.save', 'Save')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Step 3: Plan for Year 2025 */}
      {currentStep === 'plan-2025' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.plan2025.title', 'Plan for Year 2025')}</StepTitle>
          </StepHeader>
          
          <InfoBadge type="plan">
            {t('idp.plan.info', 'Creation date: Assessment tools Goal details Expected outcome')}
          </InfoBadge>

          {goals.map((goal) => (
            <PlanBox key={goal.id}>
              <PlanTitle>{goal.title}</PlanTitle>
              <PlanDetails>
                <div><strong>{t('idp.plan.category', 'Category')}:</strong> {goal.category}%</div>
                <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
              </PlanDetails>
            </PlanBox>
          ))}

          <ActionButtons>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('add-goal')}>
              {t('idp.actions.cancel', 'Cancel')}
            </ActionButton>
            <ActionButton variant="save" onClick={() => goals.forEach(goal => handleSaveGoal(goal.id))}>
              {t('idp.actions.save', 'Save')}
            </ActionButton>
            <ActionButton variant="submit" onClick={handleSubmitForReview}>
              {t('idp.actions.submit', 'Submit')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Step 4: Review */}
      {currentStep === 'review' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.review.title', 'Review and Approval')}</StepTitle>
          </StepHeader>
          
          <StatusMessage type="info">
            {t('idp.review.message', 'Plan has been submitted for review. Waiting for supervisor decision.')}
          </StatusMessage>

          <ActionButtons>
            <ActionButton variant="correct" onClick={handleRequestCorrection}>
              {t('idp.actions.needsCorrection', 'Needs Correction')}
            </ActionButton>
            <ActionButton variant="approve" onClick={handleApprove}>
              {t('idp.actions.approve', 'Approve')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Step 5: Final */}
      {currentStep === 'final' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.final.title', 'Plan Approved')}</StepTitle>
          </StepHeader>
          
          <StatusMessage type="success">
            {t('idp.final.message', 'Ability to save before printing during plan editing. Ability to return to editing.')}
          </StatusMessage>

          <ActionButtons>
            <ActionButton variant="save" onClick={() => window.print()}>
              {t('idp.actions.print', 'Print')}
            </ActionButton>
            <ActionButton variant="submit" onClick={() => setCurrentStep('add-goal')}>
              {t('idp.actions.editAgain', 'Return to Editing')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}
    </FlowContainer>
  );
};

export default IDPFlow;
