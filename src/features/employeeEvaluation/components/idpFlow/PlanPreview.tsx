import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollableContainer,
  GoalsContainer,
  PlanBox,
  PlanTitle,
  PlanDetails
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

interface PlanPreviewProps {
  goals: IDPGoal[];
  year: number;
}

export const PlanPreview: React.FC<PlanPreviewProps> = ({ goals, year }) => {
  const { t } = useTranslation();

  return (
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
  );
};
