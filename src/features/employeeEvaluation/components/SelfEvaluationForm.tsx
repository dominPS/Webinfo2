import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SelfEvaluationForm.css';

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

const SelfEvaluationForm: React.FC<SelfEvaluationFormProps> = ({
  onSave,
  onSubmit,
  onCancel,
  initialData,
  isReadOnly = false
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<SelfEvaluationData>>({
    employeeName: 'Jan Kowalski',
    position: 'Senior Developer',
    department: 'IT',
    evaluationPeriod: '2024',
    status: 'draft',
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
    ...initialData
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const handleRatingChange = (section: string, rating: number) => {
    handleNestedInputChange(section, 'rating', rating);
  };

  const getStatusBadgeClass = (status: string) => {
    return `self-evaluation-form__status-badge self-evaluation-form__status-badge--${status.replace('_', '-')}`;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': 'Wersja robocza',
      'submitted': 'Przesłano',
      'approved': 'Zatwierdzone',
      'requires_revision': 'Wymaga poprawek'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const calculateProgress = () => {
    const sections = ['jobPerformance', 'communication', 'teamwork', 'leadership', 'problemSolving', 'professionalDevelopment'];
    const completedSections = sections.filter(section => {
      const sectionData = formData[section as keyof typeof formData] as any;
      return sectionData && sectionData.rating > 0 && sectionData.comments;
    }).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const renderRatingScale = (section: string, currentRating: number) => {
    return (
      <div className="self-evaluation-form__rating-scale">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            className={`self-evaluation-form__rating-button ${
              currentRating === rating ? 'self-evaluation-form__rating-button--selected' : ''
            }`}
            onClick={() => handleRatingChange(section, rating)}
            disabled={isReadOnly}
          >
            {rating}
          </button>
        ))}
        <div className="self-evaluation-form__rating-description">
          {currentRating === 1 && 'Wymaga znacznej poprawy'}
          {currentRating === 2 && 'Poniżej oczekiwań'}
          {currentRating === 3 && 'Zgodnie z oczekiwaniami'}
          {currentRating === 4 && 'Powyżej oczekiwań'}
          {currentRating === 5 && 'Wybitny'}
        </div>
      </div>
    );
  };

  const handleSave = () => {
    onSave({
      ...formData,
      lastModified: new Date().toISOString()
    });
  };

  const handleSubmit = () => {
    if (formData.status === 'draft') {
      const submissionData = {
        ...formData,
        status: 'submitted' as const,
        submissionDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      onSubmit(submissionData as SelfEvaluationData);
    }
  };

  const progress = calculateProgress();

  return (
    <div className="self-evaluation-form">
      <div className="self-evaluation-form__header">
        <h1 className="self-evaluation-form__title">
          Samoocena pracownika
          <span className={getStatusBadgeClass(formData.status || 'draft')}>
            {getStatusText(formData.status || 'draft')}
          </span>
        </h1>
        <p className="self-evaluation-form__subtitle">
          {formData.employeeName} - {formData.position} - Okres: {formData.evaluationPeriod}
        </p>
        
        <div className="self-evaluation-form__progress-text">
          Postęp: {progress}% ukończenia
        </div>
        <div className="self-evaluation-form__progress-bar">
          <div 
            className="self-evaluation-form__progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Performance Areas */}
      <div className="self-evaluation-form__section">
        <h2 className="self-evaluation-form__section-title">Obszary oceny wydajności</h2>
        
        {/* Job Performance */}
        <div className="self-evaluation-form__form-group">
          <div className="self-evaluation-form__rating-container">
            <span className="self-evaluation-form__rating-label">
              Wydajność w pracy <span className="self-evaluation-form__required">*</span>
            </span>
            {renderRatingScale('jobPerformance', formData.jobPerformance?.rating || 0)}
          </div>
          
          <div className="self-evaluation-form__two-column-grid">
            <div className="self-evaluation-form__form-group">
              <label className="self-evaluation-form__label">Osiągnięcia</label>
              <textarea
                className="self-evaluation-form__textarea"
                value={formData.jobPerformance?.achievements || ''}
                onChange={(e) => handleNestedInputChange('jobPerformance', 'achievements', e.target.value)}
                placeholder="Opisz swoje główne osiągnięcia w tym okresie..."
                disabled={isReadOnly}
              />
            </div>
            
            <div className="self-evaluation-form__form-group">
              <label className="self-evaluation-form__label">Wyzwania</label>
              <textarea
                className="self-evaluation-form__textarea"
                value={formData.jobPerformance?.challenges || ''}
                onChange={(e) => handleNestedInputChange('jobPerformance', 'challenges', e.target.value)}
                placeholder="Opisz napotkane wyzwania i sposób ich rozwiązania..."
                disabled={isReadOnly}
              />
            </div>
          </div>
          
          <div className="self-evaluation-form__form-group">
            <label className="self-evaluation-form__label">Dodatkowe komentarze</label>
            <textarea
              className="self-evaluation-form__textarea"
              value={formData.jobPerformance?.comments || ''}
              onChange={(e) => handleNestedInputChange('jobPerformance', 'comments', e.target.value)}
              placeholder="Dodatkowe uwagi dotyczące wydajności w pracy..."
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Communication */}
        <div className="self-evaluation-form__form-group">
          <div className="self-evaluation-form__rating-container">
            <span className="self-evaluation-form__rating-label">
              Komunikacja <span className="self-evaluation-form__required">*</span>
            </span>
            {renderRatingScale('communication', formData.communication?.rating || 0)}
          </div>
          
          <div className="self-evaluation-form__form-group">
            <label className="self-evaluation-form__label">Komentarze</label>
            <textarea
              className="self-evaluation-form__textarea"
              value={formData.communication?.comments || ''}
              onChange={(e) => handleNestedInputChange('communication', 'comments', e.target.value)}
              placeholder="Oceń swoje umiejętności komunikacyjne..."
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Teamwork */}
        <div className="self-evaluation-form__form-group">
          <div className="self-evaluation-form__rating-container">
            <span className="self-evaluation-form__rating-label">
              Praca zespołowa <span className="self-evaluation-form__required">*</span>
            </span>
            {renderRatingScale('teamwork', formData.teamwork?.rating || 0)}
          </div>
          
          <div className="self-evaluation-form__form-group">
            <label className="self-evaluation-form__label">Współpraca z zespołem</label>
            <textarea
              className="self-evaluation-form__textarea"
              value={formData.teamwork?.collaboration || ''}
              onChange={(e) => handleNestedInputChange('teamwork', 'collaboration', e.target.value)}
              placeholder="Opisz swoją współpracę z zespołem..."
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="self-evaluation-form__section">
        <h2 className="self-evaluation-form__section-title">Cele i rozwój</h2>
        
        <div className="self-evaluation-form__info-box">
          <h3 className="self-evaluation-form__info-box-title">Cele bieżącego roku</h3>
          <p className="self-evaluation-form__info-box-content">
            Oceń stopień realizacji celów wyznaczonych na początek roku.
          </p>
        </div>
        
        <div className="self-evaluation-form__two-column-grid">
          <div className="self-evaluation-form__form-group">
            <label className="self-evaluation-form__label">Cele osiągnięte</label>
            <textarea
              className="self-evaluation-form__textarea"
              value={formData.currentYearGoals?.achieved || ''}
              onChange={(e) => handleNestedInputChange('currentYearGoals', 'achieved', e.target.value)}
              placeholder="Cele które udało się w pełni zrealizować..."
              disabled={isReadOnly}
            />
          </div>
          
          <div className="self-evaluation-form__form-group">
            <label className="self-evaluation-form__label">Cele częściowo osiągnięte</label>
            <textarea
              className="self-evaluation-form__textarea"
              value={formData.currentYearGoals?.partiallyAchieved || ''}
              onChange={(e) => handleNestedInputChange('currentYearGoals', 'partiallyAchieved', e.target.value)}
              placeholder="Cele w trakcie realizacji..."
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="self-evaluation-form__section">
        <h2 className="self-evaluation-form__section-title">Ocena ogólna</h2>
        
        <div className="self-evaluation-form__rating-container">
          <span className="self-evaluation-form__rating-label">
            Ogólna samoocena <span className="self-evaluation-form__required">*</span>
          </span>
          {renderRatingScale('overall', formData.overallRating || 0)}
        </div>
        
        <div className="self-evaluation-form__form-group">
          <label className="self-evaluation-form__label">Komentarze końcowe</label>
          <textarea
            className="self-evaluation-form__textarea"
            value={formData.overallComments || ''}
            onChange={(e) => handleInputChange('overallComments', e.target.value)}
            placeholder="Podsumuj swoją samoocenę..."
            disabled={isReadOnly}
            style={{ minHeight: '120px' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="self-evaluation-form__action-buttons">
          <button
            type="button"
            className="self-evaluation-form__button self-evaluation-form__button--secondary"
            onClick={onCancel}
          >
            Anuluj
          </button>
          
          <button
            type="button"
            className="self-evaluation-form__button self-evaluation-form__button--secondary"
            onClick={handleSave}
          >
            Zapisz wersję roboczą
          </button>
          
          {formData.status === 'draft' && (
            <button
              type="button"
              className="self-evaluation-form__button self-evaluation-form__button--primary"
              onClick={handleSubmit}
              disabled={progress < 70}
            >
              Prześlij do przełożonego
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SelfEvaluationForm;
