import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelfEvaluationForm from './components/SelfEvaluationForm';
import './SelfEvaluationPage.css';

interface SelfEvaluationData {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  evaluationPeriod: string;
  status: 'draft' | 'submitted' | 'approved' | 'requires_revision';
  submissionDate?: string;
  lastModified: string;
}

interface SelfEvaluationPageProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const SelfEvaluationPage: React.FC<SelfEvaluationPageProps> = ({ 
  showBackButton = true, 
  onBack 
}) => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [selectedEvaluation, setSelectedEvaluation] = useState<SelfEvaluationData | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Mock data - in real app this would come from API
  const mockEvaluations: SelfEvaluationData[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Jan Kowalski',
      position: 'Senior Developer',
      department: 'IT',
      evaluationPeriod: 'Ocena roczna 2024',
      status: 'submitted',
      submissionDate: '2024-11-15',
      lastModified: '2024-11-14'
    },
    {
      id: '2',
      employeeId: 'EMP001',
      employeeName: 'Jan Kowalski',
      position: 'Senior Developer',
      department: 'IT',
      evaluationPeriod: 'Ocena półroczna 2024',
      status: 'approved',
      submissionDate: '2024-06-30',
      lastModified: '2024-06-28'
    },
    {
      id: '3',
      employeeId: 'EMP001',
      employeeName: 'Jan Kowalski',
      position: 'Senior Developer',
      department: 'IT',
      evaluationPeriod: 'Ocena kwartalna Q3 2024',
      status: 'draft',
      lastModified: '2024-11-20'
    }
  ];

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': 'Szkic',
      'submitted': 'Przesłane',
      'approved': 'Zatwierdzone',
      'requires_revision': 'Wymaga poprawek'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    return `self-evaluation-page__status-badge self-evaluation-page__status-badge--${status.replace('_', '-')}`;
  };

  const handleCreateNewEvaluation = () => {
    setSelectedEvaluation(null);
    setCurrentView('form');
    setIsReadOnly(false);
  };

  const handleEvaluationClick = (evaluation: SelfEvaluationData) => {
    setSelectedEvaluation(evaluation);
    setCurrentView('form');
    // Set read-only if evaluation is submitted or approved
    setIsReadOnly(evaluation.status === 'submitted' || evaluation.status === 'approved');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEvaluation(null);
    setIsReadOnly(false);
  };

  const handleSaveEvaluation = (formData: any) => {
    console.log('Saving evaluation:', formData);
    // In real app, this would save to API
    alert('Samoocena została zapisana jako szkic');
    handleBackToList();
  };

  const handleSubmitEvaluation = (formData: any) => {
    console.log('Submitting evaluation:', formData);
    // In real app, this would submit to API
    alert('Samoocena została przesłana do przełożonego');
    handleBackToList();
  };

  if (currentView === 'form') {
    return (
      <div className="self-evaluation-page">
        <button className="self-evaluation-page__back-button" onClick={handleBackToList}>
          ← Powrót do listy samoocen
        </button>
        
        <div className="self-evaluation-page__form-container">
          <div className="self-evaluation-page__form-header">
            <h2 className="self-evaluation-page__form-title">
              {selectedEvaluation ? selectedEvaluation.evaluationPeriod : 'Nowa samoocena'}
            </h2>
            <p className="self-evaluation-page__form-subtitle">
              {selectedEvaluation ? 
                `Status: ${getStatusText(selectedEvaluation.status)}` : 
                'Wypełnij formularz samooceny dla bieżącego okresu'
              }
            </p>
          </div>
          
          {!isReadOnly && (
            <div className="self-evaluation-page__info-panel">
              <h4>Wskazówki dotyczące samooceny</h4>
              <p>Podczas wypełniania formularza pamiętaj o:</p>
              <ul>
                <li>Szczerości i obiektywności w ocenie własnych osiągnięć</li>
                <li>Podawaniu konkretnych przykładów i rezultatów</li>
                <li>Identyfikowaniu obszarów do rozwoju</li>
                <li>Wyznaczaniu realistycznych celów na przyszłość</li>
              </ul>
            </div>
          )}
          
          <SelfEvaluationForm
            onSave={handleSaveEvaluation}
            onSubmit={handleSubmitEvaluation}
            onCancel={handleBackToList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="self-evaluation-page">
      <div className="self-evaluation-page__header">
        <h1 className="self-evaluation-page__title">Moje samooceny</h1>
        <p className="self-evaluation-page__description">
          Zarządzaj swoimi samoocenami i śledź postępy w rozwoju zawodowym
        </p>
      </div>

      {showBackButton && onBack && (
        <button className="self-evaluation-page__back-button" onClick={onBack}>
          ← Powrót
        </button>
      )}

      <div className="self-evaluation-page__content-wrapper">
        <button className="self-evaluation-page__create-button" onClick={handleCreateNewEvaluation}>
          + Rozpocznij nową samoocenę
        </button>

        <div className="self-evaluation-page__evaluation-list">
          {mockEvaluations.length > 0 ? (
            <div className="self-evaluation-page__evaluation-grid">
              {mockEvaluations.map(evaluation => (
                <div
                  key={evaluation.id}
                  className="self-evaluation-page__evaluation-card"
                  onClick={() => handleEvaluationClick(evaluation)}
                >
                  <div className="self-evaluation-page__card-header">
                    <h3 className="self-evaluation-page__card-title">
                      {evaluation.evaluationPeriod}
                    </h3>
                    <span className={getStatusBadgeClass(evaluation.status)}>
                      {getStatusText(evaluation.status)}
                    </span>
                  </div>
                  
                  <div className="self-evaluation-page__card-content">
                    <p><strong>Stanowisko:</strong> {evaluation.position}</p>
                    <p><strong>Dział:</strong> {evaluation.department}</p>
                    {evaluation.submissionDate && (
                      <p><strong>Data przesłania:</strong> {evaluation.submissionDate}</p>
                    )}
                  </div>
                  
                  <div className="self-evaluation-page__card-info">
                    Ostatnia modyfikacja: {evaluation.lastModified}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="self-evaluation-page__empty-state">
              <h3>Brak samoocen</h3>
              <p>Nie masz jeszcze żadnych samoocen. Rozpocznij swoją pierwszą samoocenę.</p>
              <button className="self-evaluation-page__empty-state-button" onClick={handleCreateNewEvaluation}>
                Rozpocznij samoocenę
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfEvaluationPage;
