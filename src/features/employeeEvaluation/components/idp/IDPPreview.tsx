import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoBadge, PlanBox, PlanTitle, PlanDetails, IDPImage } from './IDPStyledComponents';
import { whiteV1 as idpTrainingPlan, whiteV2 as idpDevelopmentPlan } from '../../../../shared/assets/images/idp';

interface IDPPreviewProps {
  planType: 'training' | 'plan';
  onImageClick: (imageUrl: string) => void;
}

export const IDPPreview: React.FC<IDPPreviewProps> = ({ planType, onImageClick }) => {
  const { t } = useTranslation();

  const imageUrl = planType === 'training' ? idpTrainingPlan : idpDevelopmentPlan;
  const badgeText = planType === 'training' 
    ? t('employee.evaluation.idp.training_plan')
    : t('employee.evaluation.idp.development_plan');

  return (
    <>
      <InfoBadge type={planType} onClick={() => onImageClick(imageUrl)}>
        ✨ {badgeText}
      </InfoBadge>
      
      <PlanBox>
        <PlanTitle>
          {planType === 'training' 
            ? t('employee.evaluation.idp.training_plan_title')
            : t('employee.evaluation.idp.development_plan_title')
          }
        </PlanTitle>
        <PlanDetails>
          {planType === 'training'
            ? t('employee.evaluation.idp.training_plan_description')
            : t('employee.evaluation.idp.development_plan_description')
          }
        </PlanDetails>
      </PlanBox>
      
      <IDPImage 
        src={imageUrl} 
        alt={`IDP ${planType} Preview`} 
        onClick={() => onImageClick(imageUrl)}
        style={{ cursor: 'pointer' }}
      />
    </>
  );
};
