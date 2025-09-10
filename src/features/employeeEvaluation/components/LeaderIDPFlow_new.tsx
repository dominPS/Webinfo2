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

const LeaderIDPFlow: React.FC = () => {
  const { t } = useTranslation();
  
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

  const loadIdpData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demo - lider ma swoje własne cele IDP
      const mockGoals: IDPGoal[] = [
        {
          id: '1',
          title: 'Rozwijanie umiejętności zarządzania zespołem',
          description: 'Ukończenie kursu zarządzania i mentoring zespołu',
          details: 'Zapisanie się na kurs leadership, prowadzenie 1:1 z członkami zespołu',
          category: 'development',
          status: 'draft',
          year: 2025
        },
        {
          id: '2',
          title: 'Zwiększenie efektywności zespołu o 25%',
          description: 'Implementacja nowych procesów i narzędzi',
          details: 'Wprowadzenie metodologii Agile, optymalizacja workflow',
          category: 'business',
          status: 'submitted',
          year: 2025
        }
      ];

      const mockPastPlans: Record<number, IDPGoal[]> = {
        2024: [
          {
            id: '3',
            title: 'Certyfikacja Project Management',
            description: 'Uzyskanie certyfikatu PMP',
            details: 'Ukończony kurs i egzamin PMP',
            category: 'development',
            status: 'approved',
            year: 2024
          }
        ]
      };

      setGoals(mockGoals);
      setPastPlans(mockPastPlans);
      setCurrentPlanId('demo-plan-2025');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to load IDP data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.description.trim()) {
      setError(t('employee.evaluation.idp.errors.fill_required_fields', 'Wypełnij wszystkie wymagane pola'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Symulacja dodawania celu
      const goal: IDPGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        details: newGoal.details || '',
        category: newGoal.category,
        status: 'draft',
        year: 2025
      };

      setGoals(prev => [...prev, goal]);
      
      // Reset formularza i powrót do głównego widoku
      setNewGoal({ title: '', description: '', details: '', category: 'business' });
      setCurrentStep('my-idp');
      
      // Pokazanie powiadomienia
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to add goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoalAsDraft = async () => {
    if (!newGoal.title.trim() || !newGoal.description.trim()) {
      setError(t('employee.evaluation.idp.errors.fill_required_fields', 'Wypełnij wszystkie wymagane pola'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const goal: IDPGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        details: newGoal.details || '',
        category: newGoal.category,
        status: 'draft',
        year: 2025
      };

      setGoals(prev => [...prev, goal]);
      
      // Reset formularza i przejście do szkiców
      setNewGoal({ title: '', description: '', details: '', category: 'business' });
      setCurrentStep('drafts');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to save goal as draft:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = async () => {
    if (!editingGoal) return;

    try {
      setLoading(true);
      setError(null);

      // Zaktualizuj lokalny stan
      setGoals(prev => prev.map(g => 
        g.id === editingGoal.id ? editingGoal : g
      ));

      setEditingGoal(null);
      setCurrentStep('my-idp');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to update goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    try {
      setLoading(true);
      setError(null);

      // Usuń cel z lokalnego stanu
      setGoals(prev => prev.filter(g => g.id !== goalToDelete.id));

      setGoalToDelete(null);
      setShowDeleteModal(false);

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to delete goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPlan = async () => {
    const submittableGoals = goals.filter(g => g.status === 'draft' && g.year === 2025);
    
    if (submittableGoals.length === 0) {
      setError(t('employee.evaluation.idp.errors.no_goals_to_submit', 'Brak celów do zgłoszenia'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Update goals status to submitted
      setGoals(prev => prev.map(g => 
        submittableGoals.some(sg => sg.id === g.id) ? { ...g, status: 'submitted' } : g
      ));

      setCurrentStep('final');

    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Failed to submit plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    console.log('Image clicked:', imageUrl);
  };

  const draftGoals = goals.filter(g => g.status === 'draft' && g.year === 2025);
  const submittedGoals = goals.filter(g => g.status === 'submitted' && g.year === 2025);
  const approvedGoals = goals.filter(g => g.status === 'approved' && g.year === 2025);

  return (
    <FlowContainer>
      <FlowHeader>
        <FlowTitle>{t('employee.evaluation.idp.title', 'Mój Plan Rozwoju - IDP')}</FlowTitle>
      </FlowHeader>

      {/* Error Message */}
      {error && (
        <StatusMessage type="warning">
          {error}
        </StatusMessage>
      )}

      {/* Notification */}
      {showNotification && (
        <Notification 
          isVisible={showNotification}
          message={t('employee.evaluation.idp.goal_added_success', 'Cel został dodany pomyślnie!')}
        />
      )}

      {/* My IDP Step */}
      {currentStep === 'my-idp' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.my_idp', 'Mój IDP')}</StepTitle>
          </StepHeader>

          <ButtonGroup>
            <ModernButton 
              variant="save" 
              onClick={() => setCurrentStep('add-goal')}
              disabled={loading}
            >
              {t('employee.evaluation.idp.add_goal', 'DODAJ CEL IDP')}
            </ModernButton>
            
            <ModernButton 
              variant="draft" 
              onClick={() => setCurrentStep('drafts')}
              disabled={loading}
            >
              {t('employee.evaluation.idp.my_drafts', 'MOJE SZKICE')} ({draftGoals.length})
            </ModernButton>

            <ModernButton 
              variant="draft" 
              onClick={() => setCurrentStep('saved-goals')}
              disabled={loading}
            >
              {t('employee.evaluation.idp.saved_goals', 'ZAPISANE CELE')} ({submittedGoals.length + approvedGoals.length})
            </ModernButton>

            <ModernButton 
              variant="draft" 
              onClick={() => setCurrentStep('past-plans')}
              disabled={loading}
            >
              {t('employee.evaluation.idp.past_plans', 'PLANY Z UBIEGŁYCH LAT')}
            </ModernButton>

            <ModernButton 
              variant="cancel" 
              onClick={() => setShowIdpModal(true)}
              disabled={loading}
            >
              {t('employee.evaluation.idp.info', 'INFORMACJE O IDP')}
            </ModernButton>
          </ButtonGroup>
        </FlowStep>
      )}

      {/* Add Goal Step */}
      {currentStep === 'add-goal' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.add_goal', 'Dodaj cel IDP')}</StepTitle>
          </StepHeader>

          <MainFormLayout>
            <LeftFormSection>
              <GoalForm
                goalData={newGoal}
                onGoalDataChange={setNewGoal}
                onInfoClick={() => setShowIdpModal(true)}
                onTitleInputChange={(e) => {
                  const target = e.target;
                  target.style.height = '48px';
                  const scrollHeight = target.scrollHeight;
                  target.style.height = Math.min(scrollHeight, 120) + 'px';
                  setNewGoal({...newGoal, title: target.value});
                }}
              />
            </LeftFormSection>

            <RightImageSection>
              <IDPImage 
                src={idpWomenPerson} 
                alt={t('employee.evaluation.idp.image_alt', 'IDP Woman')}
                onClick={() => handleImageClick(idpWomenPerson)}
              />
            </RightImageSection>
          </MainFormLayout>

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => {
                setCurrentStep('my-idp');
                setNewGoal({ title: '', description: '', details: '', category: 'business' });
                setError(null);
              }}
              disabled={loading}
            >
              {t('common.cancel', 'ANULUJ')}
            </ActionButton>
            
            <ActionButton 
              variant="draft" 
              onClick={handleSaveGoalAsDraft}
              disabled={loading || !newGoal.title.trim() || !newGoal.description.trim()}
            >
              {loading ? t('common.saving', 'Zapisywanie...') : t('employee.evaluation.idp.save_draft', 'ZAPISZ SZKIC')}
            </ActionButton>
            
            <ActionButton 
              variant="submit" 
              onClick={handleAddGoal}
              disabled={loading || !newGoal.title.trim() || !newGoal.description.trim()}
            >
              {loading ? t('common.adding', 'Dodawanie...') : t('employee.evaluation.idp.add_goal_button', 'DODAJ CEL')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Edit Goal Step */}
      {currentStep === 'edit-goal' && editingGoal && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.edit_goal', 'Edytuj cel IDP')}</StepTitle>
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
                onGoalDataChange={(data) => {
                  if (editingGoal) {
                    setEditingGoal({
                      ...editingGoal,
                      ...data
                    });
                  }
                }}
                onInfoClick={() => setShowIdpModal(true)}
                onTitleInputChange={(e) => {
                  const target = e.target;
                  target.style.height = '48px';
                  const scrollHeight = target.scrollHeight;
                  target.style.height = Math.min(scrollHeight, 120) + 'px';
                  if (editingGoal) {
                    setEditingGoal({...editingGoal, title: target.value});
                  }
                }}
              />
            </LeftFormSection>

            <RightImageSection>
              <IDPImage 
                src={idpWomenPerson} 
                alt={t('employee.evaluation.idp.image_alt', 'IDP Woman')}
                onClick={() => handleImageClick(idpWomenPerson)}
              />
            </RightImageSection>
          </MainFormLayout>

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => {
                setCurrentStep('my-idp');
                setEditingGoal(null);
                setError(null);
              }}
              disabled={loading}
            >
              {t('common.cancel', 'ANULUJ')}
            </ActionButton>
            
            <ActionButton 
              variant="submit" 
              onClick={handleEditGoal}
              disabled={loading || !editingGoal.title.trim() || !editingGoal.description.trim()}
            >
              {loading ? t('common.saving', 'Zapisywanie...') : t('employee.evaluation.idp.save_changes', 'ZAPISZ ZMIANY')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Drafts Step */}
      {currentStep === 'drafts' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.my_drafts', 'Moje szkice')}</StepTitle>
          </StepHeader>

          <GoalsList
            goals={draftGoals}
            onEditGoal={(goal: IDPGoal) => {
              setEditingGoal(goal);
              setCurrentStep('edit-goal');
            }}
            onDeleteGoal={(goal: IDPGoal) => {
              setGoalToDelete(goal);
              setShowDeleteModal(true);
            }}
            onSubmitGoal={(goalId: string) => {
              console.log('Submit goal:', goalId);
            }}
            loading={loading}
            showDeleteModal={showDeleteModal}
          />

          {draftGoals.length === 0 && (
            <StatusMessage type="info">
              {t('employee.evaluation.idp.no_drafts', 'Nie masz żadnych szkiców')}
            </StatusMessage>
          )}

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => setCurrentStep('my-idp')}
              disabled={loading}
            >
              {t('common.back', 'POWRÓT')}
            </ActionButton>
            
            {draftGoals.length > 0 && (
              <ActionButton 
                variant="submit" 
                onClick={() => setCurrentStep('review')}
                disabled={loading}
              >
                {t('employee.evaluation.idp.review_plan', 'PRZEJRZYJ PLAN')}
              </ActionButton>
            )}
          </ActionButtons>
        </FlowStep>
      )}

      {/* Saved Goals Step */}
      {currentStep === 'saved-goals' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.saved_goals', 'Zapisane cele')}</StepTitle>
          </StepHeader>

          <GoalsList
            goals={[...submittedGoals, ...approvedGoals]}
            onEditGoal={() => {}}
            onDeleteGoal={() => {}}
            onSubmitGoal={(goalId: string) => {
              console.log('Goal already submitted:', goalId);
            }}
            loading={loading}
            showDeleteModal={false}
          />

          {submittedGoals.length + approvedGoals.length === 0 && (
            <StatusMessage type="info">
              {t('employee.evaluation.idp.no_saved_goals', 'Nie masz żadnych zapisanych celów')}
            </StatusMessage>
          )}

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => setCurrentStep('my-idp')}
              disabled={loading}
            >
              {t('common.back', 'POWRÓT')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Past Plans Step */}
      {currentStep === 'past-plans' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.past_plans', 'Plany z ubiegłych lat')}</StepTitle>
          </StepHeader>

          <PastPlansView
            pastPlans={pastPlans}
            selectedYear={selectedPastYear}
            onYearChange={setSelectedPastYear}
          />

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => setCurrentStep('my-idp')}
              disabled={loading}
            >
              {t('common.back', 'POWRÓT')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Review Step */}
      {currentStep === 'review' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.review_plan', 'Przejrzyj plan na 2025')}</StepTitle>
          </StepHeader>

          <PlanPreview
            goals={draftGoals}
            year={2025}
          />

          <ActionButtons>
            <ActionButton 
              variant="cancel" 
              onClick={() => setCurrentStep('drafts')}
              disabled={loading}
            >
              {t('common.back', 'POWRÓT')}
            </ActionButton>
            
            <ActionButton 
              variant="submit" 
              onClick={handleSubmitPlan}
              disabled={loading || draftGoals.length === 0}
            >
              {loading ? t('common.submitting', 'Zgłaszanie...') : t('employee.evaluation.idp.submit_plan', 'ZGŁOŚ PLAN')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* Final Step */}
      {currentStep === 'final' && (
        <FlowStep isActive={true}>
          <StepHeader>
            <StepTitle>{t('employee.evaluation.idp.plan_submitted', 'Plan zgłoszony')}</StepTitle>
          </StepHeader>

          <StatusMessage type="success">
            {t('employee.evaluation.idp.submit_success', 'Twój plan rozwoju na 2025 rok został pomyślnie zgłoszony!')}
          </StatusMessage>

          <ActionButtons>
            <ActionButton 
              variant="save" 
              onClick={() => setCurrentStep('my-idp')}
              disabled={loading}
            >
              {t('employee.evaluation.idp.back_to_main', 'POWRÓT DO GŁÓWNEJ')}
            </ActionButton>
          </ActionButtons>
        </FlowStep>
      )}

      {/* IDP Info Modal */}
      {showIdpModal && (
        <InfoModal
          isOpen={showIdpModal}
          onClose={() => setShowIdpModal(false)}
          imageUrl={idpBreakdownImage}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && goalToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          goal={goalToDelete}
          onConfirm={handleDeleteGoal}
          onCancel={() => {
            setShowDeleteModal(false);
            setGoalToDelete(null);
          }}
          loading={loading}
        />
      )}
    </FlowContainer>
  );
};

export default LeaderIDPFlow;
