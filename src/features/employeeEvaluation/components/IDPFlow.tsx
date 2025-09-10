import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { trainingBreakdownImage as idpBreakdownImage } from '../../../shared/assets/images/idp';
import idpWomenPerson from '../../../shared/assets/images/idp/idpWomenPerson.png';
import { idpApi, type IDPGoalWithDetails, type IDPPlanWithDetails } from '../../../lib/api/idp';
import IDPService from '../../../lib/api/services/idpService';
import { useSubmitIDPPlanFrontend } from '../../../lib/hooks/useIDP';
import { handleApiError } from '../../../lib/api/client';
import {
  FlowContainer,
  FlowHeader,
  FlowTitle,
  FlowStep,
  StepHeader,
  StepTitle,
  MainFormLayout,
  LeftFormSection,
  RightImageSection,
  ButtonGroup,
  ModernButton,
  ActionButtons,
  ActionButton,
  StatusMessage,
  IDPImage,
  InfoBadge,
  GoalForm,
  DeleteConfirmationModal,
  Notification,
  InfoModal,
  GoalsList,
  PastPlansView,
  PlanPreview
} from './idpFlow/index';
import type { IDPGoal, GoalFormData } from './idpFlow/index';

type FlowStepType = 'my-idp' | 'add-goal' | 'edit-goal' | 'plan-2025' | 'review' | 'final' | 'drafts' | 'saved-goals' | 'past-plans';

const IDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const submitPlanMutation = useSubmitIDPPlanFrontend();
  
  const [currentStep, setCurrentStep] = useState<FlowStepType>('my-idp');
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [pastPlans, setPastPlans] = useState<Record<number, IDPGoal[]>>({});
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [showIdpModal, setShowIdpModal] = useState(false);
  const [selectedPastYear, setSelectedPastYear] = useState<2024 | 2023>(2024);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<IDPGoal | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<IDPGoal | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [newGoal, setNewGoal] = useState<GoalFormData>({
    title: '',
    description: '',
    details: '',
    category: 'business'
  });

  // Load user's IDP data on component mount
  useEffect(() => {
    loadIdpData();
  }, []);

  // Auto-resize title input
    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isEditing: boolean) => {
    const target = e.target;
    target.style.height = '48px'; // Reset to minimum height
    const scrollHeight = target.scrollHeight;
    target.style.height = Math.min(scrollHeight, 120) + 'px'; // Max height of 120px
    
    if (isEditing && editingGoal) {
      setEditingGoal({...editingGoal, title: target.value});
    } else {
      setNewGoal({...newGoal, title: target.value});
    }
  };

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
          // Przechowaj ID aktualnego planu
          if (plan.year === 2025) {
            setCurrentPlanId(plan.id.toString());
          }
          
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
        setCurrentPlanId(planId.toString());
      } else {
        // Create new plan for 2025
        const newPlan = await idpApi.createPlan({
          year: 2025
        });
        planId = newPlan.id;
        setCurrentPlanId(planId.toString());
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

  const handleSubmitForReview = async () => {
    if (!currentPlanId) {
      setError('Brak ID planu IDP');
      return;
    }

    try {
      setError(null);
      
      // Prześlij plan do akceptacji przez API
      await submitPlanMutation.mutateAsync(currentPlanId);
      
      // Przejdź do kroku review
      setCurrentStep('review');
      
      // Odśwież dane planu aby uzyskać aktualny status - hook automatycznie invaliduje cache
      await loadIdpData();
      
    } catch (err) {
      console.error('Error submitting plan for review:', err);
      setError('Błąd podczas przesyłania planu do akceptacji');
    }
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

  const handleUpdateGoal = async (updatedGoal: IDPGoal) => {
    if (!updatedGoal.title || !updatedGoal.description) return;

    try {
      setLoading(true);
      setError(null);

      const goalIdNumber = parseInt(updatedGoal.id);
      
      // Update goal in the backend
      const updatedApiGoal = await idpApi.updateGoal(goalIdNumber, {
        title: updatedGoal.title,
        description: updatedGoal.description,
        details: updatedGoal.details,
        category: updatedGoal.category,
        isDraft: updatedGoal.status === 'draft'
      });

      // Update local state with the response from the API
      const updatedLocalGoal: IDPGoal = {
        id: updatedApiGoal.id.toString(),
        title: updatedApiGoal.title,
        description: updatedApiGoal.description,
        details: updatedApiGoal.details,
        category: updatedApiGoal.category,
        status: updatedApiGoal.isDraft ? 'draft' : 
                (updatedApiGoal.approvalDate ? 'approved' : 'submitted'),
        year: updatedGoal.year
      };

      setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedLocalGoal : goal));
      setEditingGoal(null);
      setCurrentStep('drafts');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error updating goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = (goal: IDPGoal) => {
    // Verify goal still exists in current state before opening modal
    const existingGoal = goals.find(g => g.id === goal.id);
    if (!existingGoal) {
      console.warn('Goal not found in current state:', goal.id);
      return;
    }
    
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
        try {
          const deleteResult = await idpApi.deleteGoal(goalIdNumber);
          console.log('API delete successful:', deleteResult);
        } catch (apiError) {
          console.error('API delete failed:', apiError);
          apiSuccess = false;
          // Still continue with local state update for better UX
        }
      }

      // Only update local state after API call completes (or fails)
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.filter(g => g.id !== goalIdToDelete);
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
              <GoalForm
                goalData={newGoal}
                onGoalDataChange={setNewGoal}
                onInfoClick={() => setShowIdpModal(true)}
                onTitleInputChange={(e) => handleTitleInputChange(e, false)}
              />

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
              <GoalForm
                goalData={{
                  title: editingGoal.title,
                  description: editingGoal.description,
                  details: editingGoal.details || '',
                  category: editingGoal.category
                }}
                onGoalDataChange={(data: GoalFormData) => setEditingGoal({
                  ...editingGoal,
                  title: data.title,
                  description: data.description,
                  details: data.details,
                  category: data.category
                })}
                onInfoClick={() => setShowIdpModal(true)}
                onTitleInputChange={(e) => handleTitleInputChange(e, true)}
              />

              <ButtonGroup>
                <ModernButton variant="cancel" onClick={() => { setEditingGoal(null); setCurrentStep('drafts'); }}>
                  {t('idp.actions.cancel', 'Anuluj')}
                </ModernButton>
                <ModernButton 
                  variant="save" 
                  onClick={() => handleUpdateGoal(editingGoal)}
                  disabled={loading}
                >
                  {loading ? t('idp.actions.updating', 'Aktualizuję...') : t('idp.actions.updateGoal', 'Zaktualizuj cel')}
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

          <PlanPreview goals={goals} year={2025} />

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
            <ActionButton variant="submit" onClick={handleSubmitForReview} disabled={submitPlanMutation.isPending}>
              {submitPlanMutation.isPending ? 'Przesyłanie...' : t('idp.actions.submit', 'Submit')}
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
          
          <GoalsList
            goals={goals}
            filterStatus="draft"
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onSubmitGoal={handleSaveGoal}
            loading={loading}
            showDeleteModal={showDeleteModal}
            emptyMessage={t('idp.drafts.empty', 'Brak szkiców celów. Zacznij od dodania nowego celu.')}
          />

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
          
          <GoalsList
            goals={goals}
            filterStatus="all"
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onSubmitGoal={handleSaveGoal}
            loading={loading}
            showDeleteModal={showDeleteModal}
            emptyMessage={t('idp.savedGoals.empty', 'No saved goals for 2025 yet.')}
          />

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
          
          <PastPlansView
            pastPlans={pastPlans}
            selectedYear={selectedPastYear}
            onYearChange={setSelectedPastYear}
          />

          <ButtonGroup>
            <ModernButton variant="cancel" onClick={() => setCurrentStep('my-idp')}>
              {t('idp.actions.backToMain', 'Powrót do głównej')}
            </ModernButton>
          </ButtonGroup>
        </FlowStep>
      )}

      {/* IDP Info Modal */}
      <InfoModal
        isOpen={showIdpModal}
        onClose={() => setShowIdpModal(false)}
        imageUrl={idpBreakdownImage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        goal={goalToDelete}
        onConfirm={confirmDeleteGoal}
        onCancel={cancelDeleteGoal}
        loading={loading}
      />

      {/* Success Notification */}
      <Notification
        isVisible={showNotification}
        type="success"
      />
    </FlowContainer>
  );
};

export default IDPFlow;
