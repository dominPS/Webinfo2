import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollableContainer,
  GoalsContainer,
  ActionButtons,
  ActionButton,
  StatusMessage
} from './IDPFlowStyledComponents';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

interface GoalCardProps {
  goal: IDPGoal;
  onEdit: (goal: IDPGoal) => void;
  onDelete: (goal: IDPGoal) => void;
  onSubmit: (goalId: string) => void;
  loading?: boolean;
  showDeleteModal?: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  onEdit, 
  onDelete, 
  onSubmit, 
  loading = false, 
  showDeleteModal = false 
}) => {
  const { t } = useTranslation();

  return (
    <div style={{
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
        {goal.status === 'draft' && (
          <ActionButton variant="submit" onClick={() => onSubmit(goal.id)}>
            {t('idp.actions.sendToApproval', 'Wyślij do akceptacji')}
          </ActionButton>
        )}
        <ActionButton variant="save" onClick={() => onEdit(goal)}>
          {t('idp.actions.editGoal', 'Edytuj cel')}
        </ActionButton>
        {goal.status === 'draft' && (
          <ActionButton 
            variant="cancel" 
            onClick={() => onDelete(goal)} 
            disabled={loading || showDeleteModal}
          >
            {t('idp.actions.deleteGoal', 'Usuń cel')}
          </ActionButton>
        )}
      </ActionButtons>
    </div>
  );
};

interface GoalsListProps {
  goals: IDPGoal[];
  filterStatus?: 'draft' | 'submitted' | 'approved' | 'all';
  onEditGoal: (goal: IDPGoal) => void;
  onDeleteGoal: (goal: IDPGoal) => void;
  onSubmitGoal: (goalId: string) => void;
  loading?: boolean;
  showDeleteModal?: boolean;
  emptyMessage?: string;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  filterStatus = 'all',
  onEditGoal,
  onDeleteGoal,
  onSubmitGoal,
  loading = false,
  showDeleteModal = false,
  emptyMessage
}) => {
  const { t } = useTranslation();

  const filteredGoals = filterStatus === 'all' 
    ? goals 
    : goals.filter(goal => goal.status === filterStatus);

  if (filteredGoals.length === 0) {
    return (
      <StatusMessage type="info">
        {emptyMessage || t('idp.goals.empty', 'Brak celów do wyświetlenia')}
      </StatusMessage>
    );
  }

  return (
    <ScrollableContainer>
      <GoalsContainer>
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={onEditGoal}
            onDelete={onDeleteGoal}
            onSubmit={onSubmitGoal}
            loading={loading}
            showDeleteModal={showDeleteModal}
          />
        ))}
      </GoalsContainer>
    </ScrollableContainer>
  );
};
