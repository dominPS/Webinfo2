import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LeaderIDPFlow.css';

interface IDPGoal {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

const LeaderIDPFlow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [goals, setGoals] = useState<IDPGoal[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<IDPGoal>>({
    title: '',
    description: '',
    category: 'business',
    status: 'draft',
    year: new Date().getFullYear()
  });

  const handleSaveGoal = () => {
    if (newGoal.title && newGoal.description) {
      const goal: IDPGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category as 'business' | 'development',
        status: 'draft',
        year: newGoal.year || new Date().getFullYear()
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        category: 'business',
        status: 'draft',
        year: new Date().getFullYear()
      });
    }
  };

  const getStatusClass = (status: string) => {
    return `leader-idp-flow__goal-status--${status.replace('_', '-')}`;
  };

  return (
    <div className="leader-idp-flow">
      <div className="leader-idp-flow__header">
        <h2 className="leader-idp-flow__title">
          {t('idp.leader.title', 'Zarządzanie Planami IDP')}
        </h2>
      </div>

      <div className="leader-idp-flow__step">
        <div className="leader-idp-flow__step-header">
          <h3 className="leader-idp-flow__step-title">
            {t('idp.leader.goals.title', 'Cele IDP')}
          </h3>
        </div>

        <div className="leader-idp-flow__scrollable-container">
          <div className="leader-idp-flow__goals-container">
            {goals.length > 0 && (
              <div className="leader-idp-flow__year-section">
                <h4 className="leader-idp-flow__year-title">
                  {t('idp.leader.currentGoals', 'Aktualne cele')}
                </h4>
                <ul className="leader-idp-flow__goals-list">
                  {goals.map((goal) => (
                    <li key={goal.id} className="leader-idp-flow__goal-item">
                      <h5 className="leader-idp-flow__goal-title">{goal.title}</h5>
                      <p className="leader-idp-flow__goal-description">{goal.description}</p>
                      <div className="leader-idp-flow__goal-meta">
                        <span className={`leader-idp-flow__goal-status ${getStatusClass(goal.status)}`}>
                          {t(`idp.status.${goal.status}`, goal.status)}
                        </span>
                        <span>{goal.category}</span>
                        <span>{goal.year}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="leader-idp-flow__year-section">
              <h4 className="leader-idp-flow__year-title">
                {t('idp.leader.addGoal', 'Dodaj nowy cel')}
              </h4>
              
              <div className="leader-idp-flow__radio-group">
                <label className="leader-idp-flow__radio-option">
                  <input
                    className="leader-idp-flow__radio-input"
                    type="radio"
                    name="goalCategory"
                    value="business"
                    checked={newGoal.category === 'business'}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value as 'business' | 'development'})}
                  />
                  <span className="leader-idp-flow__radio-label">
                    {t('idp.category.business', 'Cel biznesowy')}
                  </span>
                </label>
                
                <label className="leader-idp-flow__radio-option">
                  <input
                    className="leader-idp-flow__radio-input"
                    type="radio"
                    name="goalCategory"
                    value="development"
                    checked={newGoal.category === 'development'}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value as 'business' | 'development'})}
                  />
                  <span className="leader-idp-flow__radio-label">
                    {t('idp.category.development', 'Cel rozwojowy')}
                  </span>
                </label>
              </div>

              <div className="leader-idp-flow__textarea-group">
                <label className="leader-idp-flow__textarea-label">
                  {t('idp.goal.title', 'Tytuł celu')}
                </label>
                <input
                  className="leader-idp-flow__textarea"
                  type="text"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder={t('idp.goal.titlePlaceholder', 'Wprowadź tytuł celu...')}
                />
              </div>

              <div className="leader-idp-flow__textarea-group">
                <label className="leader-idp-flow__textarea-label">
                  {t('idp.goal.description', 'Opis celu')}
                </label>
                <textarea
                  className="leader-idp-flow__textarea"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder={t('idp.goal.descriptionPlaceholder', 'Opisz szczegółowo cel...')}
                />
              </div>

              <div className="leader-idp-flow__action-buttons">
                <button 
                  className="leader-idp-flow__action-button leader-idp-flow__action-button--cancel"
                  onClick={() => setNewGoal({
                    title: '',
                    description: '',
                    category: 'business',
                    status: 'draft',
                    year: new Date().getFullYear()
                  })}
                >
                  {t('idp.actions.cancel', 'Anuluj')}
                </button>
                <button 
                  className="leader-idp-flow__action-button"
                  onClick={handleSaveGoal}
                >
                  {t('idp.actions.save', 'Zapisz cel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderIDPFlow;
