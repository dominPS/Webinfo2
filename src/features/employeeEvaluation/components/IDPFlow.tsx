import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './IDPFlow.css';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

interface IDPFlowProps {
  onBack?: () => void;
}

const IDPFlow: React.FC<IDPFlowProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<string>('current');

  // Mock data - in real app this would come from API
  const mockGoals: IDPGoal[] = [
    {
      id: '1',
      title: 'Certyfikacja AWS Solutions Architect',
      description: 'Uzyskanie certyfikatu AWS Solutions Architect Associate w celu rozszerzenia umiejętności cloud computing',
      category: 'development',
      status: 'approved',
      year: 2024
    },
    {
      id: '2',
      title: 'Prowadzenie projektu modernizacji systemu',
      description: 'Objęcie roli lead developera w projekcie modernizacji głównego systemu firmy',
      category: 'business',
      status: 'submitted',
      year: 2024
    },
    {
      id: '3',
      title: 'Szkolenie z zarządzania zespołem',
      description: 'Ukończenie kursu management skills w przygotowaniu do roli Team Lead',
      category: 'development',
      status: 'draft',
      year: 2025
    }
  ];

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': 'Wersja robocza',
      'submitted': 'Przesłano',
      'approved': 'Zatwierdzone',
      'correction_needed': 'Wymaga poprawek'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getCategoryText = (category: string) => {
    const categoryMap = {
      'business': 'Cel biznesowy',
      'development': 'Rozwój osobisty'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const getStatusClass = (status: string) => {
    return `idp-flow__goal-status idp-flow__goal-status--${status.replace('_', '-')}`;
  };

  const getCategoryClass = (category: string) => {
    return `idp-flow__goal-category idp-flow__goal-category--${category}`;
  };

  const getGoalsByYear = (year: number) => {
    return mockGoals.filter(goal => goal.year === year);
  };

  const getStats = () => {
    const total = mockGoals.length;
    const approved = mockGoals.filter(g => g.status === 'approved').length;
    const submitted = mockGoals.filter(g => g.status === 'submitted').length;
    const draft = mockGoals.filter(g => g.status === 'draft').length;
    
    return { total, approved, submitted, draft };
  };

  const stats = getStats();
  const currentYearGoals = getGoalsByYear(2024);
  const nextYearGoals = getGoalsByYear(2025);

  const handleGoalAction = (goalId: string, action: string) => {
    console.log(`Action ${action} for goal ${goalId}`);
    // In real app, this would call API
  };

  const handleAddNewGoal = () => {
    console.log('Adding new goal');
    // In real app, this would open a form modal
  };

  return (
    <div className="idp-flow">
      <div className="idp-flow__header">
        <h2 className="idp-flow__title">Indywidualny Plan Rozwoju (IDP)</h2>
        
        <div className="idp-flow__info-badge idp-flow__info-badge--plan">
          📋 Plan rozwoju kariery
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="idp-flow__summary-stats">
        <div className="idp-flow__stat-card">
          <div className="idp-flow__stat-number">{stats.total}</div>
          <div className="idp-flow__stat-label">Wszystkie cele</div>
        </div>
        <div className="idp-flow__stat-card">
          <div className="idp-flow__stat-number">{stats.approved}</div>
          <div className="idp-flow__stat-label">Zatwierdzone</div>
        </div>
        <div className="idp-flow__stat-card">
          <div className="idp-flow__stat-number">{stats.submitted}</div>
          <div className="idp-flow__stat-label">Przesłane</div>
        </div>
        <div className="idp-flow__stat-card">
          <div className="idp-flow__stat-number">{stats.draft}</div>
          <div className="idp-flow__stat-label">Robocze</div>
        </div>
      </div>

      {/* Current Year Goals */}
      <div className="idp-flow__step idp-flow__step--active">
        <div className="idp-flow__step-header">
          <h3 className="idp-flow__step-title">Cele na rok 2024</h3>
        </div>

        <div className="idp-flow__scrollable-container">
          <div className="idp-flow__goals-container">
            {currentYearGoals.length > 0 ? (
              currentYearGoals.map(goal => (
                <div key={goal.id} className="idp-flow__goal-card">
                  <div className="idp-flow__goal-header">
                    <h4 className="idp-flow__goal-title">{goal.title}</h4>
                    <span className={getStatusClass(goal.status)}>
                      {getStatusText(goal.status)}
                    </span>
                  </div>
                  
                  <p className="idp-flow__goal-description">{goal.description}</p>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <span className={getCategoryClass(goal.category)}>
                      {getCategoryText(goal.category)}
                    </span>
                  </div>
                  
                  <div className="idp-flow__goal-actions">
                    <button 
                      className="idp-flow__goal-action"
                      onClick={() => handleGoalAction(goal.id, 'view')}
                    >
                      Szczegóły
                    </button>
                    {goal.status === 'draft' && (
                      <button 
                        className="idp-flow__goal-action idp-flow__goal-action--primary"
                        onClick={() => handleGoalAction(goal.id, 'submit')}
                      >
                        Prześlij
                      </button>
                    )}
                    <button 
                      className="idp-flow__goal-action"
                      onClick={() => handleGoalAction(goal.id, 'edit')}
                    >
                      Edytuj
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="idp-flow__empty-state">
                <h3 className="idp-flow__empty-state-title">Brak celów na 2024</h3>
                <p className="idp-flow__empty-state-description">
                  Dodaj pierwsze cele rozwojowe na bieżący rok.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Year Goals */}
      <div className="idp-flow__step">
        <div className="idp-flow__step-header">
          <h3 className="idp-flow__step-title">Planowane cele na rok 2025</h3>
        </div>

        <div className="idp-flow__scrollable-container">
          <div className="idp-flow__goals-container">
            {nextYearGoals.length > 0 ? (
              nextYearGoals.map(goal => (
                <div key={goal.id} className="idp-flow__goal-card">
                  <div className="idp-flow__goal-header">
                    <h4 className="idp-flow__goal-title">{goal.title}</h4>
                    <span className={getStatusClass(goal.status)}>
                      {getStatusText(goal.status)}
                    </span>
                  </div>
                  
                  <p className="idp-flow__goal-description">{goal.description}</p>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <span className={getCategoryClass(goal.category)}>
                      {getCategoryText(goal.category)}
                    </span>
                  </div>
                  
                  <div className="idp-flow__goal-actions">
                    <button 
                      className="idp-flow__goal-action"
                      onClick={() => handleGoalAction(goal.id, 'view')}
                    >
                      Szczegóły
                    </button>
                    <button 
                      className="idp-flow__goal-action"
                      onClick={() => handleGoalAction(goal.id, 'edit')}
                    >
                      Edytuj
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="idp-flow__empty-state">
                <h3 className="idp-flow__empty-state-title">Planowanie celów na 2025</h3>
                <p className="idp-flow__empty-state-description">
                  Rozpocznij planowanie celów rozwojowych na przyszły rok.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Goal Section */}
      <div className="idp-flow__add-goal-section">
        <button 
          className="idp-flow__add-goal-button"
          onClick={handleAddNewGoal}
        >
          + Dodaj nowy cel
        </button>
      </div>
    </div>
  );
};

export default IDPFlow;
