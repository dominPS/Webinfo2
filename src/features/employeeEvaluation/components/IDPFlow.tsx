import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { trainingBreakdownImage as idpBreakdownImage } from '../../../shared/assets/images/idp';
import idpWomenPerson from '../../../shared/assets/images/idp/idpWomenPerson.png';
import { idpApi, type IDPGoalWithDetails, type IDPPlanWithDetails } from '../../../lib/api/idp';
import { handleApiError } from '../../../lib/api/client';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

const FlowContainer = styled.div`
  padding: 18px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const FlowHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const FlowTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 6px;
`;

const FlowStep = styled.div<{ isActive: boolean }>`
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: ${props => props.isActive ? '#f8fafc' : 'white'};
  transition: all 0.3s ease;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const ScrollableContainer = styled.div`
  margin-bottom: 12px;
  padding-bottom: 30px;
`;

const GoalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const YearSection = styled.div`
  margin-bottom: 18px;
`;

const YearTitle = styled.h4`
  color: #126678;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const InfoBadge = styled.div<{ type: 'training' | 'plan' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.type === 'training' ? '#126678' : '#126678'};
  color: white;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: fit-content;

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
  gap: 8px;
  justify-content: flex-start;
  margin-top: 16px;
  flex-wrap: wrap;
  padding-left: 0;
`;

const ActionButton = styled.button<{ variant: 'cancel' | 'draft' | 'save' | 'submit' | 'approve' | 'correct' }>`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
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

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    background-color: ${props => {
      switch (props.variant) {
        case 'cancel': return '#f8f9fa';
        default: return '#0f5459';
      }
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
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
  grid-template-columns: 1fr 400px;
  gap: 40px;
  margin-bottom: 24px;
  align-items: start;
`;

const TextAreaColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 300px;
  margin-top: 0;
`;

const MainFormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 24px;
  align-items: stretch;
`;

const LeftFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  justify-content: space-between;
`;

const RightImageSection = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  height: 100%;
`;

const IDPImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  min-height: 140px;
  flex: 1;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
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
  justify-content: flex-start;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  flex-shrink: 0;
`;

const ModernButton = styled.button<{ variant: 'cancel' | 'save' | 'draft' }>`
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'cancel':
        return `
          background-color: white;
          color: #126678;
          border: 2px solid #126678;
          
          &:hover {
            background-color: #f8f9fa;
          }
        `;
      case 'draft':
        return `
          background-color: #6b7280;
          color: white;
          
          &:hover {
            background-color: #4b5563;
          }
        `;
      default: // 'save'
        return `
          background-color: #126678;
          color: white;
          
          &:hover {
            background-color: #0f5459;
          }
        `;
    }
  }}
  
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

type FlowStep = 'my-idp' | 'add-goal' | 'edit-goal' | 'plan-2025' | 'review' | 'final' | 'drafts' | 'saved-goals' | 'past-plans';

const IDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('my-idp');
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [pastPlans, setPastPlans] = useState<Record<number, IDPGoal[]>>({});
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [selectedPastYear, setSelectedPastYear] = useState<2024 | 2023>(2024);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<IDPGoal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<IDPGoal | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    details: '',
    category: 'business' as 'business' | 'development'
  });

  // Load user's IDP data on component mount
  useEffect(() => {
    loadIdpData();
  }, []);

  const loadIdpData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load current year plans and draft goals
      const currentPlansResponse = await idpApi.getCurrentUserPlans({ 
        year: 2025,
        page: 1,
        pageSize: 100
      });

      // Load past plans
      const pastPlansResponse = await idpApi.getCurrentUserPlans({
        page: 1,
        pageSize: 100
      });

      // Transform API data to component format
      const currentGoals: IDPGoal[] = [];
      const pastGoalsGrouped: Record<number, IDPGoal[]> = {};

      // Process current plans
      if (currentPlansResponse.items) {
        currentPlansResponse.items.forEach(plan => {
          if (plan.goals) {
            plan.goals.forEach(goal => {
              currentGoals.push({
                id: goal.id.toString(),
                title: goal.title,
                description: goal.description,
                details: goal.details,
                category: goal.category,
                status: goal.isDraft ? 'draft' : 
                        (goal.approvalDate ? 'approved' : 'submitted'),
                year: plan.year
              });
            });
          }
        });
      }

      // Process past plans
      if (pastPlansResponse.items) {
        pastPlansResponse.items
          .filter(plan => plan.year < 2025)
          .forEach(plan => {
            if (plan.goals) {
              const pastGoals: IDPGoal[] = plan.goals.map(goal => ({
                id: goal.id.toString(),
                title: goal.title,
                description: goal.description,
                details: goal.details,
                category: goal.category,
                status: goal.approvalDate ? 'approved' : 'submitted',
                year: plan.year
              }));
              
              pastGoalsGrouped[plan.year] = pastGoals;
            }
          });
      }

      setGoals(currentGoals);
      setPastPlans(pastGoalsGrouped);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error loading IDP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.description) return;

    try {
      setLoading(true);
      setError(null);

      // First, get or create current year plan
      const currentPlansResponse = await idpApi.getCurrentUserPlans({ 
        year: 2025,
        page: 1,
        pageSize: 1 
      });

      let planId: number;
      
      if (currentPlansResponse.items && currentPlansResponse.items.length > 0) {
        planId = currentPlansResponse.items[0].id;
      } else {
        // Create new plan for 2025
        const newPlan = await idpApi.createPlan({
          year: 2025
        });
        planId = newPlan.id;
      }

      // Add goal to plan
      const createdGoal = await idpApi.createGoal(planId, {
        title: newGoal.title,
        description: newGoal.description,
        details: newGoal.details,
        category: newGoal.category,
        isDraft: false // Submit immediately for approval
      });

      // Update local state
      const goal: IDPGoal = {
        id: createdGoal.id.toString(),
        title: createdGoal.title,
        description: createdGoal.description,
        details: createdGoal.details,
        category: createdGoal.category,
        status: 'submitted',
        year: 2025
      };

      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', details: '', category: 'business' });
      setCurrentStep('plan-2025');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error adding goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!newGoal.title || !newGoal.description) return;

    try {
      setLoading(true);
      setError(null);

      // First, get or create current year plan
      const currentPlansResponse = await idpApi.getCurrentUserPlans({ 
        year: 2025,
        page: 1,
        pageSize: 1 
      });

      let planId: number;
      
      if (currentPlansResponse.items && currentPlansResponse.items.length > 0) {
        planId = currentPlansResponse.items[0].id;
      } else {
        // Create new plan for 2025
        const newPlan = await idpApi.createPlan({
          year: 2025
        });
        planId = newPlan.id;
      }

      // Save goal as draft
      const createdGoal = await idpApi.createGoal(planId, {
        title: newGoal.title,
        description: newGoal.description,
        details: newGoal.details,
        category: newGoal.category,
        isDraft: true
      });

      console.log('Created goal response:', createdGoal);

      // Update local state
      const goal: IDPGoal = {
        id: createdGoal.id.toString(),
        title: createdGoal.title,
        description: createdGoal.description,
        details: createdGoal.details,
        category: createdGoal.category,
        status: 'draft',
        year: 2025
      };

      console.log('Local goal object:', goal);

      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', details: '', category: 'business' });

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error saving draft:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (goalId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Submit goal for approval
      await idpApi.submitGoal({ goalId: parseInt(goalId) });

      // Update local state
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, status: 'submitted' } 
          : goal
      ));

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error submitting goal:', err);
    } finally {
      setLoading(false);
    }
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

  const handleEditGoal = (goal: IDPGoal) => {
    setEditingGoal(goal);
    setCurrentStep('edit-goal');
  };

  const handleUpdateGoal = (updatedGoal: IDPGoal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    setEditingGoal(null);
    setCurrentStep('drafts');
  };

  const handleDeleteGoal = (goal: IDPGoal) => {
    // Verify goal still exists in current state before opening modal
    const existingGoal = goals.find(g => g.id === goal.id);
    if (!existingGoal) {
      console.warn('Goal not found in current state:', goal.id);
      return;
    }
    
    console.log('Opening delete modal for goal:', goal.id, goal.title);
    setGoalToDelete(existingGoal);
    setShowDeleteModal(true);
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDelete) return;

    try {
      setLoading(true);
      setError(null);
      
      const goalIdToDelete = goalToDelete.id;
      const goalIdNumber = parseInt(goalIdToDelete);
      let apiSuccess = true;

      // If the goal has a valid API ID, delete it from backend first
      if (goalIdToDelete && !isNaN(goalIdNumber) && goalIdNumber > 0) {
        console.log('Deleting goal with ID:', goalIdNumber);
        try {
          const deleteResult = await idpApi.deleteGoal(goalIdNumber);
          console.log('API delete successful:', deleteResult);
        } catch (apiError) {
          console.error('API delete failed:', apiError);
          apiSuccess = false;
          // Still continue with local state update for better UX
        }
      } else {
        console.log('Goal has no valid server ID, only removing from local state');
      }

      // Only update local state after API call completes (or fails)
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.filter(g => g.id !== goalIdToDelete);
        console.log('Updated goals state after deletion:', updatedGoals.length, 'goals remaining');
        return updatedGoals;
      });
      
      // Close modal and clear state
      setShowDeleteModal(false);
      setGoalToDelete(null);
      
      // Show success notification
      setShowNotification(true);
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);

      if (!apiSuccess) {
        console.warn('Goal removed from local state despite API error for better UX');
      }

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error in delete process:', err);
      
      // Still clean up UI state
      setShowDeleteModal(false);
      setGoalToDelete(null);
      
      // Remove from local state for UX even if API failed
      setGoals(prevGoals => prevGoals.filter(g => g.id !== goalToDelete?.id));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteGoal = () => {
    setShowDeleteModal(false);
    setGoalToDelete(null);
  };

  return (
    <FlowContainer>
      <FlowHeader>
        <FlowTitle>{t('idp.flow.title', 'Plan Rozwoju Indywidualnego (IDP)')}</FlowTitle>
        {loading && <div>Loading...</div>}
        {error && <StatusMessage type="warning">{error}</StatusMessage>}
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
            <StepTitle>{t('idp.addGoal.title', 'Dodaj Cel')}</StepTitle>
          </StepHeader>
          
          <MainFormLayout>
              <LeftFormSection>
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

                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalTitle', 'Tytuł celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder={t('idp.form.goalTitlePlaceholder', 'Wprowadź tytuł celu rozwoju')}
                  />
                </TextAreaContainer>
                
                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalDescription', 'Opis celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder={t('idp.form.goalDescriptionPlaceholder', 'Opisz swój cel...')}
                  />
                </TextAreaContainer>
                
                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalDetails', 'Szczegóły celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={newGoal.details}
                    onChange={(e) => setNewGoal({...newGoal, details: e.target.value})}
                    placeholder={t('idp.form.goalDetailsPlaceholder', 'Opisz szczegółowe kroki i oczekiwane wyniki...')}
                  />
                </TextAreaContainer>

                <ButtonGroup>
                  <ModernButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
                    {t('idp.actions.cancel', 'Anuluj')}
                  </ModernButton>
                  <ModernButton variant="draft" onClick={handleSaveDraft}>
                    {t('idp.actions.draft', 'Szkic')}
                  </ModernButton>
                  <ModernButton variant="save" onClick={handleAddGoal}>
                    {t('idp.actions.sendToApproval', 'Wyślij do akceptacji')}
                  </ModernButton>
                </ButtonGroup>
              </LeftFormSection>
              
              <RightImageSection>
                <IDPImage 
                  src={idpWomenPerson} 
                  alt={t('idp.form.imageAlt', 'IDP planning illustration')}
                />
              </RightImageSection>
            </MainFormLayout>
        </FlowStep>
      )}

      {/* Step 2b: Edit IDP Goal */}
      {currentStep === 'edit-goal' && editingGoal && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('idp.editGoal.title', 'Edytuj Cel')}</StepTitle>
          </StepHeader>
          
          <MainFormLayout>
              <LeftFormSection>
                <InfoBadge type="training" onClick={() => setShowIdpModal(true)}>
                  {t('idp.info.badge', 'IDP info about Goals - Goal Categories')}
                </InfoBadge>

                <FormGroup>
                  <Label>{t('idp.form.goalType', 'Typ celu')}</Label>
                  <RadioGroup>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        name="editGoalType"
                        value="business"
                        checked={editingGoal.category === 'business'}
                        onChange={(e) => setEditingGoal({...editingGoal, category: 'business'})}
                      />
                      <RadioLabel>{t('idp.categories.business', 'Cel biznesowy')}</RadioLabel>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        name="editGoalType"
                        value="development"
                        checked={editingGoal.category === 'development'}
                        onChange={(e) => setEditingGoal({...editingGoal, category: 'development'})}
                      />
                      <RadioLabel>{t('idp.categories.development', 'Cel rozwojowy')}</RadioLabel>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalTitle', 'Tytuł celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={editingGoal.title}
                    onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
                    placeholder={t('idp.form.goalTitlePlaceholder', 'Wprowadź tytuł celu rozwoju')}
                  />
                </TextAreaContainer>
                
                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalDescription', 'Opis celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={editingGoal.description}
                    onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                    placeholder={t('idp.form.goalDescriptionPlaceholder', 'Opisz swój cel...')}
                  />
                </TextAreaContainer>
                
                <TextAreaContainer>
                  <TextAreaLabel>{t('idp.form.goalDetails', 'Szczegóły celu')}</TextAreaLabel>
                  <StyledTextArea
                    value={editingGoal.details}
                    onChange={(e) => setEditingGoal({...editingGoal, details: e.target.value})}
                    placeholder={t('idp.form.goalDetailsPlaceholder', 'Opisz szczegółowe kroki i oczekiwane wyniki...')}
                  />
                </TextAreaContainer>

                <ButtonGroup>
                  <ModernButton variant="cancel" onClick={() => { setEditingGoal(null); setCurrentStep('drafts'); }}>
                    {t('idp.actions.cancel', 'Anuluj')}
                  </ModernButton>
                  <ModernButton variant="save" onClick={() => handleUpdateGoal(editingGoal)}>
                    {t('idp.actions.updateGoal', 'Zaktualizuj cel')}
                  </ModernButton>
                </ButtonGroup>
              </LeftFormSection>
              
              <RightImageSection>
                <IDPImage 
                  src={idpWomenPerson} 
                  alt={t('idp.form.imageAlt', 'IDP planning illustration')}
                />
              </RightImageSection>
            </MainFormLayout>
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
                    <div><strong>{t('idp.plan.category', 'Kategoria')}:</strong> {t(`idp.categories.${goal.category}`, goal.category)}</div>
                    <div><strong>{t('idp.plan.description', 'Opis')}:</strong> {goal.description}</div>
                    {goal.details && <div><strong>{t('idp.plan.details', 'Szczegóły')}:</strong> {goal.details}</div>}
                    <div><strong>{t('idp.plan.year', 'Rok')}:</strong> {goal.year}</div>
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
            <ActionButton variant="draft" onClick={handleSaveDraft}>
              {t('idp.actions.draft', 'Draft')}
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
            <StepTitle>{t('idp.drafts.title', 'Szkice celów')}</StepTitle>
          </StepHeader>
          
          <p>{t('idp.drafts.description', 'Przeglądaj i zarządzaj swoimi szkicami celów')}</p>
          
          {goals.filter(goal => goal.status === 'draft').length === 0 ? (
            <StatusMessage type="info">
              {t('idp.drafts.empty', 'Brak szkiców celów. Zacznij od dodania nowego celu.')}
            </StatusMessage>
          ) : (
            <ScrollableContainer>
              <GoalsContainer>
                {goals.filter(goal => goal.status === 'draft').map((goal) => (
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
                        {String(t(`idp.categories.${goal.category}`, goal.category))} - {goal.title}
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
                          backgroundColor: '#6b7280',
                          color: 'white'
                        }}>
                          {String(t(`idp.status.${goal.status}`, goal.status))}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
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
                          {t('idp.plan.category', 'Kategoria')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {String(t(`idp.categories.${goal.category}`, goal.category))}
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
                          {t('idp.plan.details', 'Szczegóły celu')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {goal.title}
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
                          {t('idp.plan.description', 'Opis celu')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {goal.description}
                        </div>
                      </div>
                    </div>

                    <ActionButtons style={{ marginTop: '12px', justifyContent: 'flex-start' }}>
                      <ActionButton variant="submit" onClick={() => handleSaveGoal(goal.id)}>
                        {t('idp.actions.sendToApproval', 'Wyślij do akceptacji')}
                      </ActionButton>
                      <ActionButton variant="save" onClick={() => handleEditGoal(goal)}>
                        {t('idp.actions.editGoal', 'Edytuj cel')}
                      </ActionButton>
                      <ActionButton variant="cancel" onClick={() => handleDeleteGoal(goal)} disabled={loading || showDeleteModal}>
                        {t('idp.actions.deleteGoal', 'Usuń cel')}
                      </ActionButton>
                    </ActionButtons>
                  </div>
                ))}
              </GoalsContainer>
            </ScrollableContainer>
          )}

          <ActionButtons>
            <ActionButton variant="submit" onClick={() => setCurrentStep('add-goal')}>
              {t('idp.actions.addGoal', 'Dodaj cel IDP')}
            </ActionButton>
            <ActionButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.backToMain', 'Powrót do głównej')}
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
            <StepTitle>{t('idp.pastPlans.title', 'Historia Planów IDP')}</StepTitle>
          </StepHeader>
          
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
                {(pastPlans[selectedPastYear] as IDPGoal[])?.map((goal: IDPGoal) => (
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
                      gridTemplateColumns: '1fr 1fr 1fr',
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
                          {t('idp.plan.category', 'Kategoria')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {String(t(`idp.categories.${goal.category}`, goal.category))}
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
                          {t('idp.plan.details', 'Szczegóły Celu')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {goal.details || t('idp.plan.noDetails', 'Brak szczegółów')}
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
                          {t('idp.plan.description', 'Opis Celu')}
                        </div>
                        <div style={{ color: '#374151', lineHeight: '1.5' }}>
                          {goal.description}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay onClick={cancelDeleteGoal}>
          <ConfirmModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={cancelDeleteGoal}>
              ×
            </ModalCloseButton>
            <ConfirmModalTitle>
              {t('idp.deleteModal.title', 'Czy na pewno chcesz usunąć szkic?')}
            </ConfirmModalTitle>
            <ConfirmModalText>
              {t('idp.deleteModal.description', 'Ta operacja jest nieodwracalna. Szkic celu zostanie trwale usunięty.')}
            </ConfirmModalText>
            {goalToDelete && (
              <GoalPreview>
                <strong>{goalToDelete.title}</strong>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  {goalToDelete.description}
                </div>
              </GoalPreview>
            )}
            <ConfirmModalButtons>
              <ConfirmButton variant="cancel" onClick={cancelDeleteGoal}>
                {t('idp.actions.cancel', 'Anuluj')}
              </ConfirmButton>
              <ConfirmButton variant="delete" onClick={confirmDeleteGoal} disabled={loading}>
                {loading ? t('idp.actions.deleting', 'Usuwanie...') : t('idp.actions.confirmDelete', 'Tak, usuń')}
              </ConfirmButton>
            </ConfirmModalButtons>
          </ConfirmModalContent>
        </ModalOverlay>
      )}

      {/* Success Notification */}
      {showNotification && (
        <SuccessNotification>
          <NotificationIcon>✓</NotificationIcon>
          <NotificationText>
            {t('idp.notification.deleted', 'Usunięto szkic')}
          </NotificationText>
        </SuccessNotification>
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

// Confirmation Modal Styles
const ConfirmModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90vw;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const ConfirmModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #dc2626;
  text-align: center;
`;

const ConfirmModalText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.5;
`;

const GoalPreview = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #126678;
`;

const ConfirmModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmButton = styled.button<{ variant: 'cancel' | 'delete' }>`
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'cancel':
        return `
          background-color: white;
          color: #6b7280;
          border: 2px solid #d1d5db;
          
          &:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
          }
        `;
      case 'delete':
        return `
          background-color: #dc2626;
          color: white;
          
          &:hover {
            background-color: #b91c1c;
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
  }
`;

// Notification Styles
const SuccessNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationIcon = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const NotificationText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;
