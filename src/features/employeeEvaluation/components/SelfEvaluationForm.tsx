import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

interface SelfEvaluationData {
  // Personal Information
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  evaluationPeriod: string;
  
  // Performance Areas
  jobPerformance: {
    rating: number;
    comments: string;
    achievements: string;
    challenges: string;
  };
  
  communication: {
    rating: number;
    comments: string;
    improvements: string;
  };
  
  teamwork: {
    rating: number;
    comments: string;
    collaboration: string;
  };
  
  leadership: {
    rating: number;
    comments: string;
    initiatives: string;
  };
  
  problemSolving: {
    rating: number;
    comments: string;
    examples: string;
  };
  
  professionalDevelopment: {
    rating: number;
    comments: string;
    goals: string;
    training: string;
  };
  
  // Goals and Development
  currentYearGoals: {
    achieved: string;
    partiallyAchieved: string;
    notAchieved: string;
  };
  
  nextYearGoals: {
    professional: string;
    personal: string;
    skills: string;
  };
  
  // Overall Assessment
  overallRating: number;
  overallComments: string;
  managerFeedback: string;
  
  // Status
  status: 'draft' | 'submitted' | 'approved' | 'requires_revision';
  submissionDate?: string;
  lastModified: string;
}

interface SelfEvaluationFormProps {
  onSave: (data: Partial<SelfEvaluationData>) => void;
  onSubmit: (data: SelfEvaluationData) => void;
  onCancel: () => void;
  initialData?: Partial<SelfEvaluationData>;
  isReadOnly?: boolean;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const FormTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const RatingLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 120px;
`;

const RatingScale = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RatingButton = styled.button<{ isSelected: boolean; disabled?: boolean }>`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.isSelected ? '#126678' : '#d1d5db'};
  border-radius: 50%;
  background-color: ${props => props.isSelected ? '#126678' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#374151'};
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: #126678;
    background-color: ${props => props.isSelected ? '#0f5459' : '#f0f9ff'};
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const RatingDescription = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-left: 16px;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #126678;
          color: white;
          &:hover { background-color: #0f5459; }
        `;
      case 'secondary':
        return `
          background-color: white;
          color: #126678;
          border: 2px solid #126678;
          &:hover { background-color: #f0f9ff; }
        `;
      case 'danger':
        return `
          background-color: #dc2626;
          color: white;
          &:hover { background-color: #b91c1c; }
        `;
      default:
        return `
          background-color: #126678;
          color: white;
          &:hover { background-color: #0f5459; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'submitted':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'approved':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'requires_revision':
        return `
          background-color: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const SelfEvaluationForm: React.FC<SelfEvaluationFormProps> = ({
  onSave,
  onSubmit,
  onCancel,
  initialData,
  isReadOnly = false
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<SelfEvaluationData>>({
    employeeId: '',
    employeeName: '',
    position: '',
    department: '',
    evaluationPeriod: new Date().getFullYear().toString(),
    jobPerformance: { rating: 0, comments: '', achievements: '', challenges: '' },
    communication: { rating: 0, comments: '', improvements: '' },
    teamwork: { rating: 0, comments: '', collaboration: '' },
    leadership: { rating: 0, comments: '', initiatives: '' },
    problemSolving: { rating: 0, comments: '', examples: '' },
    professionalDevelopment: { rating: 0, comments: '', goals: '', training: '' },
    currentYearGoals: { achieved: '', partiallyAchieved: '', notAchieved: '' },
    nextYearGoals: { professional: '', personal: '', skills: '' },
    overallRating: 0,
    overallComments: '',
    managerFeedback: '',
    status: 'draft',
    lastModified: new Date().toISOString(),
    ...initialData
  });

  const updateFormData = (path: string, value: any) => {
    if (isReadOnly) return;
    
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return { ...newData, lastModified: new Date().toISOString() };
    });
  };

  const getRatingDescription = (rating: number) => {
    const descriptions = {
      1: t('evaluation.rating.poor', 'Niewystarczający'),
      2: t('evaluation.rating.below', 'Poniżej oczekiwań'),
      3: t('evaluation.rating.meets', 'Spełnia oczekiwania'),
      4: t('evaluation.rating.exceeds', 'Przekracza oczekiwania'),
      5: t('evaluation.rating.outstanding', 'Wybitny')
    };
    return descriptions[rating as keyof typeof descriptions] || '';
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData as SelfEvaluationData);
    }
  };

  const isFormValid = () => {
    return formData.employeeName && 
           formData.position && 
           formData.department &&
           formData.jobPerformance?.rating &&
           formData.overallRating;
  };

  const RatingComponent = ({ 
    path, 
    label, 
    value 
  }: { 
    path: string; 
    label: string; 
    value: number 
  }) => (
    <RatingContainer>
      <RatingLabel>{label}:</RatingLabel>
      <RatingScale>
        {[1, 2, 3, 4, 5].map(rating => (
          <RatingButton
            key={rating}
            isSelected={value === rating}
            disabled={isReadOnly}
            onClick={() => updateFormData(path, rating)}
            type="button"
          >
            {rating}
          </RatingButton>
        ))}
      </RatingScale>
      <RatingDescription>
        {value > 0 && getRatingDescription(value)}
      </RatingDescription>
    </RatingContainer>
  );

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>{t('evaluation.selfEvaluation.title', 'Formularz Samooceny')}</FormTitle>
        <FormSubtitle>
          {t('evaluation.selfEvaluation.subtitle', 'Oceń swoją pracę i rozwój zawodowy w ostatnim okresie')}
        </FormSubtitle>
        {formData.status && formData.status !== 'draft' && (
          <div style={{ marginTop: '12px' }}>
            <StatusBadge status={formData.status}>
              {t(`evaluation.status.${formData.status}`, formData.status)}
            </StatusBadge>
          </div>
        )}
      </FormHeader>

      {/* Personal Information */}
      <Section>
        <SectionTitle>{t('evaluation.personalInfo.title', 'Informacje podstawowe')}</SectionTitle>
        <TwoColumnGrid>
          <FormGroup>
            <Label>{t('evaluation.personalInfo.employeeId', 'ID Pracownika')}</Label>
            <Input
              type="text"
              value={formData.employeeId || ''}
              onChange={(e) => updateFormData('employeeId', e.target.value)}
              disabled={isReadOnly}
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('evaluation.personalInfo.name', 'Imię i nazwisko')}</Label>
            <Input
              type="text"
              value={formData.employeeName || ''}
              onChange={(e) => updateFormData('employeeName', e.target.value)}
              disabled={isReadOnly}
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('evaluation.personalInfo.position', 'Stanowisko')}</Label>
            <Input
              type="text"
              value={formData.position || ''}
              onChange={(e) => updateFormData('position', e.target.value)}
              disabled={isReadOnly}
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('evaluation.personalInfo.department', 'Dział')}</Label>
            <Input
              type="text"
              value={formData.department || ''}
              onChange={(e) => updateFormData('department', e.target.value)}
              disabled={isReadOnly}
            />
          </FormGroup>
        </TwoColumnGrid>
        <FormGroup>
          <Label>{t('evaluation.personalInfo.period', 'Okres oceny')}</Label>
          <Input
            type="text"
            value={formData.evaluationPeriod || ''}
            onChange={(e) => updateFormData('evaluationPeriod', e.target.value)}
            disabled={isReadOnly}
            placeholder="np. 2024, Q1 2024, styczeń-grudzień 2024"
          />
        </FormGroup>
      </Section>

      {/* Performance Areas */}
      <Section>
        <SectionTitle>{t('evaluation.performanceAreas.title', 'Obszary wydajności')}</SectionTitle>
        
        {/* Job Performance */}
        <FormGroup>
          <RatingComponent
            path="jobPerformance.rating"
            label={t('evaluation.performanceAreas.jobPerformance', 'Wykonywanie obowiązków')}
            value={formData.jobPerformance?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.jobPerformance?.comments || ''}
            onChange={(e) => updateFormData('jobPerformance.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.performanceAreas.commentsPlaceholder', 'Opisz swoje osiągnięcia i wyzwania...')}
          />
        </FormGroup>

        {/* Communication */}
        <FormGroup>
          <RatingComponent
            path="communication.rating"
            label={t('evaluation.performanceAreas.communication', 'Komunikacja')}
            value={formData.communication?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.communication?.comments || ''}
            onChange={(e) => updateFormData('communication.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.placeholders.communication', 'Opisz swoje umiejętności komunikacyjne...')}
          />
        </FormGroup>

        {/* Teamwork */}
        <FormGroup>
          <RatingComponent
            path="teamwork.rating"
            label={t('evaluation.performanceAreas.teamwork', 'Praca zespołowa')}
            value={formData.teamwork?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.teamwork?.comments || ''}
            onChange={(e) => updateFormData('teamwork.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.placeholders.teamwork', 'Opisz swój wkład w pracę zespołu...')}
          />
        </FormGroup>

        {/* Leadership */}
        <FormGroup>
          <RatingComponent
            path="leadership.rating"
            label={t('evaluation.performanceAreas.leadership', 'Przywództwo/Inicjatywa')}
            value={formData.leadership?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.leadership?.comments || ''}
            onChange={(e) => updateFormData('leadership.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.placeholders.leadership', 'Opisz swoje inicjatywy i przywództwo...')}
          />
        </FormGroup>

        {/* Problem Solving */}
        <FormGroup>
          <RatingComponent
            path="problemSolving.rating"
            label={t('evaluation.performanceAreas.problemSolving', 'Rozwiązywanie problemów')}
            value={formData.problemSolving?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.problemSolving?.comments || ''}
            onChange={(e) => updateFormData('problemSolving.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.placeholders.problemSolving', 'Opisz przykłady rozwiązywania problemów...')}
          />
        </FormGroup>

        {/* Professional Development */}
        <FormGroup>
          <RatingComponent
            path="professionalDevelopment.rating"
            label={t('evaluation.performanceAreas.development', 'Rozwój zawodowy')}
            value={formData.professionalDevelopment?.rating || 0}
          />
          <Label>{t('evaluation.performanceAreas.comments', 'Komentarze')}</Label>
          <TextArea
            value={formData.professionalDevelopment?.comments || ''}
            onChange={(e) => updateFormData('professionalDevelopment.comments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.placeholders.development', 'Opisz swój rozwój i naukę...')}
          />
        </FormGroup>
      </Section>

      {/* Goals */}
      <Section>
        <SectionTitle>{t('evaluation.goals.title', 'Cele i rozwój')}</SectionTitle>
        
        <FormGroup>
          <Label>{t('evaluation.goals.achieved', 'Cele osiągnięte w tym roku')}</Label>
          <TextArea
            value={formData.currentYearGoals?.achieved || ''}
            onChange={(e) => updateFormData('currentYearGoals.achieved', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.goals.achievedPlaceholder', 'Wymień cele które udało Ci się osiągnąć...')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('evaluation.goals.nextYear', 'Cele na następny rok')}</Label>
          <TextArea
            value={formData.nextYearGoals?.professional || ''}
            onChange={(e) => updateFormData('nextYearGoals.professional', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.goals.nextYearPlaceholder', 'Opisz swoje cele zawodowe na następny rok...')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('evaluation.goals.skills', 'Umiejętności do rozwijania')}</Label>
          <TextArea
            value={formData.nextYearGoals?.skills || ''}
            onChange={(e) => updateFormData('nextYearGoals.skills', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.goals.skillsPlaceholder', 'Jakie umiejętności chcesz rozwijać...')}
          />
        </FormGroup>
      </Section>

      {/* Overall Assessment */}
      <Section>
        <SectionTitle>{t('evaluation.overall.title', 'Ocena ogólna')}</SectionTitle>
        
        <FormGroup>
          <RatingComponent
            path="overallRating"
            label={t('evaluation.overall.rating', 'Ogólna ocena')}
            value={formData.overallRating || 0}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('evaluation.overall.comments', 'Komentarze końcowe')}</Label>
          <TextArea
            value={formData.overallComments || ''}
            onChange={(e) => updateFormData('overallComments', e.target.value)}
            disabled={isReadOnly}
            placeholder={t('evaluation.overall.commentsPlaceholder', 'Dodatkowe uwagi i komentarze...')}
          />
        </FormGroup>

        {formData.managerFeedback && (
          <FormGroup>
            <Label>{t('evaluation.overall.managerFeedback', 'Feedback od przełożonego')}</Label>
            <TextArea
              value={formData.managerFeedback || ''}
              disabled={true}
              style={{ backgroundColor: '#f9fafb' }}
            />
          </FormGroup>
        )}
      </Section>

      {/* Action Buttons */}
      <ActionButtons>
        <Button variant="secondary" onClick={onCancel}>
          {t('common.cancel', 'Anuluj')}
        </Button>
        {!isReadOnly && (
          <>
            <Button variant="secondary" onClick={handleSave}>
              {t('common.save', 'Zapisz szkic')}
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              {t('common.submit', 'Wyślij')}
            </Button>
          </>
        )}
      </ActionButtons>
    </FormContainer>
  );
};

export default SelfEvaluationForm;
