import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, ModernButton } from './IDPStyledComponents';

interface ActionButtonsProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onApprove?: () => void;
  onCorrect?: () => void;
  showApproval?: boolean;
  isSubmitting?: boolean;
  status?: 'draft' | 'submitted' | 'approved' | 'needs_correction';
}

export const IDPActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSaveDraft,
  onSubmit,
  onApprove,
  onCorrect,
  showApproval = false,
  isSubmitting = false,
  status = 'draft'
}) => {
  const { t } = useTranslation();

  return (
    <ButtonGroup>
      <ModernButton 
        variant="cancel" 
        onClick={onCancel}
        type="button"
      >
        {t('employee.evaluation.idp.cancel')}
      </ModernButton>
      
      <ModernButton 
        variant="draft" 
        onClick={onSaveDraft}
        disabled={isSubmitting}
        type="button"
      >
        {t('employee.evaluation.idp.save_draft')}
      </ModernButton>
      
      {status === 'draft' && (
        <ModernButton 
          variant="save" 
          onClick={onSubmit}
          disabled={isSubmitting}
          type="button"
        >
          {t('employee.evaluation.idp.submit')}
        </ModernButton>
      )}

      {showApproval && status === 'submitted' && (
        <>
          <ModernButton 
            variant="save" 
            onClick={onApprove}
            disabled={isSubmitting}
            type="button"
          >
            {t('employee.evaluation.idp.approve')}
          </ModernButton>
          
          <ModernButton 
            variant="draft" 
            onClick={onCorrect}
            disabled={isSubmitting}
            type="button"
          >
            {t('employee.evaluation.idp.request_correction')}
          </ModernButton>
        </>
      )}
    </ButtonGroup>
  );
};
