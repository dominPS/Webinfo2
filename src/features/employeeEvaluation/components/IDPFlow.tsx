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

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
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
  color: #2563eb;
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
  background-color: ${props => props.type === 'training' ? '#10b981' : '#2563eb'};
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

const IDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('my-idp');
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [showIdpModal, setShowIdpModal] = useState(false);
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
          <StepHeader>
            <StepTitle>{t('idp.addGoal.title', 'Add IDP Goal')}</StepTitle>
          </StepHeader>
          
          <InfoBadge type="training" onClick={() => setShowIdpModal(true)}>
            {t('idp.info.badge', 'IDP info about Goals - Goal Categories')}
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
              <Label>{t('idp.form.category', 'Goal Category')}</Label>
              <Select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value as 'business' | 'development'})}
              >
                <option value="business">{t('idp.categories.business', 'Business Goal')}</option>
                <option value="development">{t('idp.categories.development', 'Development Goal')}</option>
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
          <StepHeader>
            <StepTitle>{t('idp.pastPlans.title', 'Past IDP Plans')}</StepTitle>
          </StepHeader>
          
          <p>{t('idp.pastPlans.description', 'View your previous development plans')}</p>
          
          <ScrollableContainer>
            {/* 2024 Plans */}
            <YearSection>
              <YearTitle>
                {t('idp.pastPlans.year2024', '2024 Development Plan')}
              </YearTitle>
              <GoalsContainer>
                {mockPastPlans[2024].map((goal) => (
                  <PlanBox key={goal.id} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                    <PlanTitle style={{ color: '#1f2937' }}>{goal.title}</PlanTitle>
                    <PlanDetails>
                      <div><strong>{t('idp.plan.category', 'Category')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                      <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                      <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                      <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
                    </PlanDetails>
                  </PlanBox>
                ))}
              </GoalsContainer>
            </YearSection>

            {/* 2023 Plans */}
            <YearSection>
              <YearTitle>
                {t('idp.pastPlans.year2023', '2023 Development Plan')}
              </YearTitle>
              <GoalsContainer>
                {mockPastPlans[2023].map((goal) => (
                  <PlanBox key={goal.id} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                    <PlanTitle style={{ color: '#1f2937' }}>{goal.title}</PlanTitle>
                    <PlanDetails>
                      <div><strong>{t('idp.plan.category', 'Category')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                      <div><strong>{t('idp.plan.description', 'Description')}:</strong> {goal.description}</div>
                      <div><strong>{t('idp.plan.year', 'Year')}:</strong> {goal.year}</div>
                      <div><strong>{t('idp.plan.status', 'Status')}:</strong> {t(`idp.status.${goal.status}`, goal.status)}</div>
                    </PlanDetails>
                  </PlanBox>
                ))}
              </GoalsContainer>
            </YearSection>
          </ScrollableContainer>

          <ActionButtons>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.backToMain', 'Back to Main')}
            </ActionButton>
          </ActionButtons>
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

export default IDPFlow;

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
  color: #6b7280;
  
  &:hover {
    color: #374151;
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
