import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RadioGroup,
  RadioOption,
  RadioInput,
  RadioLabel,
  ScrollableContainer,
  GoalsContainer
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

interface PastPlansViewProps {
  pastPlans: Record<number, IDPGoal[]>;
  selectedYear: 2024 | 2023;
  onYearChange: (year: 2024 | 2023) => void;
}

export const PastPlansView: React.FC<PastPlansViewProps> = ({
  pastPlans,
  selectedYear,
  onYearChange
}) => {
  const { t } = useTranslation();

  return (
    <>
      <RadioGroup style={{ marginBottom: '24px' }}>
        <RadioOption>
          <RadioInput
            type="radio"
            name="pastYear"
            value="2024"
            checked={selectedYear === 2024}
            onChange={() => onYearChange(2024)}
          />
          <RadioLabel>2024</RadioLabel>
        </RadioOption>
        <RadioOption>
          <RadioInput
            type="radio"
            name="pastYear"
            value="2023"
            checked={selectedYear === 2023}
            onChange={() => onYearChange(2023)}
          />
          <RadioLabel>2023</RadioLabel>
        </RadioOption>
      </RadioGroup>

      <ScrollableContainer>
        <GoalsContainer>
          {(pastPlans[selectedYear] as IDPGoal[])?.map((goal: IDPGoal) => (
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
    </>
  );
};
