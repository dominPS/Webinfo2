import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';
import { idpIcon } from '../../../shared/assets/icons/evaluation';
import { trainingBreakdownImage as idpBreakdownImage } from '../../../shared/assets/images/idp';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

const FlowContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const FlowHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const FlowTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 8px;
`;

const FlowStep = styled.div<{ isActive: boolean }>`
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: ${props => props.isActive ? '#f8fafc' : 'white'};
  transition: all 0.3s ease;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ScrollableContainer = styled.div`
  margin-bottom: 16px;
  padding-bottom: 40px;
`;

const GoalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const YearSection = styled.div`
  margin-bottom: 24px;
`;

const YearTitle = styled.h4`
  color: #126678;
  font-weight: 600;
  margin-bottom: 16px;
  font-size: 16px;
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
  background-color: ${props => props.type === 'training' ? '#126678' : '#126678'};
  color: white;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const PlanBox = styled.div`
  padding: 16px;
  background-color: #126678;
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
  flex-wrap: wrap;
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
      case 'cancel': return 'white';
      case 'draft': return '#126678';
      case 'save': return '#126678';
      case 'submit': return '#126678';
      case 'approve': return '#126678';
      case 'correct': return '#126678';
      default: return '#126678';
    }
  }};
  
  color: ${props => props.variant === 'cancel' ? '#126678' : 'white'};
  border: ${props => props.variant === 'cancel' ? '2px solid #126678' : 'none'};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    background-color: ${props => {
      switch (props.variant) {
        case 'cancel': return '#f8f9fa';
        default: return '#0f5459';
      }
    }};
  }
`;

const GoalForm = styled.div`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CompanyLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #126678;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const RadioOption = styled.label<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #126678;
`;

const RadioLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const TextAreaGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextAreaLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 3px rgba(18, 102, 120, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const ModernButton = styled.button<{ variant: 'cancel' | 'save' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.variant === 'cancel' ? `
    background-color: white;
    color: #126678;
    border: 2px solid #126678;
    
    &:hover {
      background-color: #f8f9fa;
    }
  ` : `
    background-color: #126678;
    color: white;
    
    &:hover {
      background-color: #0f5459;
    }
  `}
  
  &:active {
    transform: translateY(1px);
  }
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
      case 'success': return '#126678';
      case 'warning': return '#126678';
      case 'info': return '#126678';
      default: return '#126678';
    }
  }};
`;

type FlowStep = 'my-idp' | 'add-goal' | 'plan-2025' | 'review' | 'final' | 'drafts' | 'saved-goals' | 'past-plans';

// Mock data for past IDP plans
const mockPastPlans = {
  2024: [
    {
      id: '2024-1',
      title: 'Improve Leadership Skills',
      description: 'Develop team management and communication abilities through mentoring and training programs.',
      category: 'development' as const,
      status: 'approved' as const,
      year: 2024
    },
    {
      id: '2024-2',
      title: 'Increase Sales Revenue by 15%',
      description: 'Focus on expanding client base and improving conversion rates through strategic initiatives.',
      category: 'business' as const,
      status: 'approved' as const,
      year: 2024
    },
    {
      id: '2024-3',
      title: 'Complete Advanced Project Management Certification',
      description: 'Obtain PMP certification to enhance project delivery capabilities and methodologies.',
      category: 'development' as const,
      status: 'approved' as const,
      year: 2024
    },
    {
      id: '2024-4',
      title: 'Implement Customer Feedback System',
      description: 'Design and deploy a comprehensive customer feedback collection and analysis system to improve service quality.',
      category: 'business' as const,
      status: 'approved' as const,
      year: 2024
    },
    {
      id: '2024-5',
      title: 'Master Data Analytics and Visualization',
      description: 'Complete advanced courses in data analytics, Python, and Tableau to enhance decision-making capabilities.',
      category: 'development' as const,
      status: 'approved' as const,
      year: 2024
    }
  ],
  2023: [
    {
      id: '2023-1',
      title: 'Digital Transformation Initiative',
      description: 'Lead the implementation of new digital tools and processes to improve operational efficiency.',
      category: 'business' as const,
      status: 'approved' as const,
      year: 2023
    },
    {
      id: '2023-2',
      title: 'Public Speaking and Presentation Skills',
      description: 'Enhance communication skills through Toastmasters participation and presentation workshops.',
      category: 'development' as const,
      status: 'approved' as const,
      year: 2023
    },
    {
      id: '2023-3',
      title: 'Cross-Functional Team Collaboration',
      description: 'Improve collaboration with marketing, sales, and product teams to enhance project outcomes.',
      category: 'business' as const,
      status: 'approved' as const,
      year: 2023
    },
    {
      id: '2023-4',
      title: 'Agile and Scrum Methodology Mastery',
      description: 'Become certified Scrum Master and implement agile practices across development teams.',
      category: 'development' as const,
      status: 'approved' as const,
      year: 2023
    }
  ]
};

const LeaderIDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('my-idp');
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [selectedPastYear, setSelectedPastYear] = useState<2024 | 2023>(2024);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'business' as 'business' | 'development'
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
      setNewGoal({ title: '', description: '', category: 'business' });
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
      setNewGoal({ title: '', description: '', category: 'business' });
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
          <ActionButton 
            variant="draft" 
            onClick={() => setCurrentStep('drafts')}
          >
            {t('idp.actions.viewDrafts', 'View Drafts')}
          </ActionButton>
          <ActionButton 
            variant="save" 
            onClick={() => setCurrentStep('saved-goals')}
          >
            {t('idp.actions.viewSaved', 'View Saved Goals')}
          </ActionButton>
          <ActionButton 
            variant="correct" 
            onClick={() => setCurrentStep('past-plans')}
          >
            {t('idp.actions.viewPastPlans', 'Past Plans')}
          </ActionButton>
        </ActionButtons>
      </FlowStep>

      {/* Step 2: Add IDP Goal */}
      {currentStep === 'add-goal' && (
        <FlowStep isActive={true}>
          <GoalForm>
            <FormHeader>
              <FormTitle>{t('idp.addGoal.title', 'Dodaj Cel')}</FormTitle>
              <CompanyLogo>
                🔲 WHITE
              </CompanyLogo>
            </FormHeader>
            
            <InfoBadge type="training" onClick={() => setShowIdpModal(true)}>
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
                    checked={newGoal.category === 'business'}
                    onChange={(e) => setNewGoal({...newGoal, category: 'business'})}
                  />
                  <RadioLabel>{t('idp.categories.business', 'Cel biznesowy')}</RadioLabel>
                </RadioOption>
                <RadioOption>
                  <RadioInput
                    type="radio"
                    name="goalType"
                    value="development"
                    checked={newGoal.category === 'development'}
                    onChange={(e) => setNewGoal({...newGoal, category: 'development'})}
                  />
                  <RadioLabel>{t('idp.categories.development', 'Cel rozwojowy')}</RadioLabel>
                </RadioOption>
              </RadioGroup>
            </FormGroup>

            <TextAreaGroup>
              <TextAreaContainer>
                <TextAreaLabel>{t('idp.form.goalDetails', 'Szczegóły celu')}</TextAreaLabel>
                <StyledTextArea
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder={t('idp.form.goalDetailsPlaceholder', 'Wpisz szczegóły swojego celu...')}
                />
              </TextAreaContainer>
              
              <TextAreaContainer>
                <TextAreaLabel>{t('idp.form.goalDescription', 'Wyniki celu')}</TextAreaLabel>
                <StyledTextArea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder={t('idp.form.goalResultsPlaceholder', 'Opisz oczekiwane wyniki...')}
                />
              </TextAreaContainer>
            </TextAreaGroup>

            <ButtonGroup>
              <ModernButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
                {t('idp.actions.cancel', 'Anuluj')}
              </ModernButton>
              <ModernButton variant="save" onClick={handleAddGoal}>
                {t('idp.actions.save', 'Zapisz')}
              </ModernButton>
            </ButtonGroup>
          </GoalForm>
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

          <ScrollableContainer>
            <GoalsContainer>
              {goals.map((goal) => (
                <PlanBox key={goal.id}>
                  <PlanTitle>{goal.title}</PlanTitle>
                  <PlanDetails>
                    <div><strong>{t('idp.plan.category', 'Category')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                    <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                    <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                    <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
                  </PlanDetails>
                </PlanBox>
              ))}
            </GoalsContainer>
          </ScrollableContainer>

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

      {/* Drafts Section */}
      {currentStep === 'drafts' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.drafts.title', 'Draft Goals')}</StepTitle>
          </StepHeader>
          
          <p>{t('idp.drafts.description', 'View and manage your draft goals')}</p>
          
          {goals.filter(goal => goal.status === 'draft').length === 0 ? (
            <StatusMessage type="info">
              {t('idp.drafts.empty', 'No draft goals yet. Start by adding a new goal.')}
            </StatusMessage>
          ) : (
            <ScrollableContainer>
              <GoalsContainer>
                {goals.filter(goal => goal.status === 'draft').map((goal) => (
                  <PlanBox key={goal.id}>
                    <PlanTitle>{goal.title}</PlanTitle>
                    <PlanDetails>
                      <div><strong>{t('idp.plan.category', 'Category')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                      <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                      <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                      <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
                    </PlanDetails>
                    <ActionButtons style={{ marginTop: '12px', justifyContent: 'flex-start' }}>
                      <ActionButton variant="submit" onClick={() => handleSaveGoal(goal.id)}>
                        {t('idp.actions.save', 'Save')}
                      </ActionButton>
                      <ActionButton variant="cancel" onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}>
                        {t('idp.actions.deleteGoal', 'Delete Goal')}
                      </ActionButton>
                    </ActionButtons>
                  </PlanBox>
                ))}
              </GoalsContainer>
            </ScrollableContainer>
          )}

          <ActionButtons>
            <ActionButton variant="submit" onClick={() => setCurrentStep('add-goal')}>
              {t('idp.actions.addGoal', 'Add IDP Goal')}
            </ActionButton>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.backToMain', 'Back to Main')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Saved Goals Section */}
      {currentStep === 'saved-goals' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.savedGoals.title', 'Saved Goals')}</StepTitle>
          </StepHeader>
          
          <p>{t('idp.savedGoals.description', 'View your submitted and approved goals for 2025')}</p>
          
          {goals.filter(goal => goal.status !== 'draft').length === 0 ? (
            <StatusMessage type="info">
              {t('idp.savedGoals.empty', 'No saved goals for 2025 yet.')}
            </StatusMessage>
          ) : (
            <ScrollableContainer>
              <GoalsContainer>
                {goals.filter(goal => goal.status !== 'draft').map((goal) => (
                  <PlanBox key={goal.id}>
                    <PlanTitle>{goal.title}</PlanTitle>
                    <PlanDetails>
                      <div><strong>{t('idp.plan.category', 'Category')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                      <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                      <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                      <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
                    </PlanDetails>
                  </PlanBox>
                ))}
              </GoalsContainer>
            </ScrollableContainer>
          )}

          <ActionButtons>
            <ActionButton variant="submit" onClick={() => setCurrentStep('add-goal')}>
              {t('idp.actions.addGoal', 'Add IDP Goal')}
            </ActionButton>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.backToMain', 'Back to Main')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Past Plans Section */}
      {currentStep === 'past-plans' && (
        <FlowStep isActive={true}>
          <GoalForm>
            <FormHeader>
              <FormTitle>{t('idp.pastPlans.title', 'Historia Planów IDP')}</FormTitle>
              <CompanyLogo>
                🔲 WHITE
              </CompanyLogo>
            </FormHeader>
            
            <RadioGroup style={{ marginBottom: '24px' }}>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="pastYear"
                  value="2024"
                  checked={selectedPastYear === 2024}
                  onChange={() => setSelectedPastYear(2024)}
                />
                <RadioLabel>2024</RadioLabel>
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="pastYear"
                  value="2023"
                  checked={selectedPastYear === 2023}
                  onChange={() => setSelectedPastYear(2023)}
                />
                <RadioLabel>2023</RadioLabel>
              </RadioOption>
            </RadioGroup>

            <ScrollableContainer>
              <GoalsContainer>
                {(mockPastPlans[selectedPastYear] as IDPGoal[])?.map((goal: IDPGoal) => (
                  <div key={goal.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    backgroundColor: 'white'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#126678',
                        margin: '0'
                      }}>
                        {String(t(`idp.categories.${goal.category}`, goal.category))} {goal.year} - {goal.title}
                      </h4>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: goal.status === 'approved' ? '#10b981' : 
                                          goal.status === 'submitted' ? '#3b82f6' : '#6b7280',
                          color: 'white'
                        }}>
                          {String(t(`idp.status.${goal.status}`, goal.status))}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          marginBottom: '8px',
                          textTransform: 'uppercase'
                        }}>
                          {t('idp.plan.description', 'Opis Celu')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {goal.description}
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#6b7280',
                          marginBottom: '8px',
                          textTransform: 'uppercase'
                        }}>
                          {t('idp.plan.category', 'Kategoria')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {String(t(`idp.categories.${goal.category}`, goal.category))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </GoalsContainer>
            </ScrollableContainer>

            <ButtonGroup>
              <ModernButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
                {t('idp.actions.backToMain', 'Powrót do głównej')}
              </ModernButton>
            </ButtonGroup>
          </GoalForm>
        </FlowStep>
      )}

      {/* IDP Info Modal */}
      {showIdpModal && (
        <ModalOverlay onClick={() => setShowIdpModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowIdpModal(false)}>
              ×
            </ModalCloseButton>
            <ModalTitle>{t('idp.modal.title', 'IDP Goal Categories')}</ModalTitle>
            <ModalImage 
              src={idpBreakdownImage} 
              alt={t('idp.modal.alt', 'IDP goal categories diagram')}
            />
            <p style={{ marginTop: '16px', color: '#6b7280' }}>
              {t('idp.modal.description', 'Business Goals focus on achieving specific business objectives and outcomes. Development Goals focus on personal and professional skill development and growth.')}
            </p>
          </ModalContent>
        </ModalOverlay>
      )}
    </FlowContainer>
  );
};

export default LeaderIDPFlow;

// Modal/Popup Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #126678;
  
  &:hover {
    color: #0f5459;
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;
