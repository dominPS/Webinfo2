import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ModalOverlay,
  ConfirmModalContent,
  ModalCloseButton,
  ConfirmModalTitle,
  ConfirmModalText,
  GoalPreview,
  ConfirmModalButtons,
  ConfirmButton
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

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  goal: IDPGoal | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  goal,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ConfirmModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onCancel}>
          ×
        </ModalCloseButton>
        <ConfirmModalTitle>
          {t('idp.deleteModal.title', 'Czy na pewno chcesz usunąć szkic?')}
        </ConfirmModalTitle>
        <ConfirmModalText>
          {t('idp.deleteModal.description', 'Ta operacja jest nieodwracalna. Szkic celu zostanie trwale usunięty.')}
        </ConfirmModalText>
        {goal && (
          <GoalPreview>
            <strong>{goal.title}</strong>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {goal.description}
            </div>
          </GoalPreview>
        )}
        <ConfirmModalButtons>
          <ConfirmButton variant="cancel" onClick={onCancel}>
            {t('idp.actions.cancel', 'Anuluj')}
          </ConfirmButton>
          <ConfirmButton variant="delete" onClick={onConfirm} disabled={loading}>
            {loading ? t('idp.actions.deleting', 'Usuwanie...') : t('idp.actions.confirmDelete', 'Tak, usuń')}
          </ConfirmButton>
        </ConfirmModalButtons>
      </ConfirmModalContent>
    </ModalOverlay>
  );
};
