import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import IDPFlow from './components/IDPFlow';
import AnnualReviewHistory from './components/AnnualReviewHistory';
import SelfEvaluationPage from './SelfEvaluationPage';
import WhiteValuesModal from '../../shared/components/WhiteValuesModal';
import './WorkerEvaluationPage.css';

/**
 * Worker Evaluation Page
 * This page provides worker dashboard controls for self-evaluation and development
 */
const WorkerEvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isWhiteValuesModalOpen, setIsWhiteValuesModalOpen] = useState(false);

  const handleControlClick = (controlType: string) => {
    if (controlType === 'idp') {
      setActiveFlow('idp');
    } else if (controlType === 'annualReview') {
      setActiveFlow('annualReview');
    } else if (controlType === 'selfAssessment') {
      setActiveFlow('selfAssessment');
    } else if (controlType === 'whiteValues') {
      setIsWhiteValuesModalOpen(true);
    } else {
      // In a real app, this would navigate to specific sections or open modals
      console.log(`Worker Control clicked: ${controlType}`);
      alert(`${controlType} functionality coming soon!`);
    }
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
  };

  const handleCloseWhiteValuesModal = () => {
    setIsWhiteValuesModalOpen(false);
  };

  // If IDP flow is active, show it instead of the main dashboard
  if (activeFlow === 'idp') {
    return (
      <div className="worker-evaluation-page">
        <div className="worker-evaluation-page__content">
          <button className="worker-evaluation-page__back-button" onClick={handleBackToDashboard}>
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
          </button>
          <IDPFlow />
        </div>
      </div>
    );
  }

  // If Annual Review flow is active, show it instead of the main dashboard
  if (activeFlow === 'annualReview') {
    return (
      <div className="worker-evaluation-page">
        <div className="worker-evaluation-page__content">
          <button className="worker-evaluation-page__back-button" onClick={handleBackToDashboard}>
            ← {t('common.backToDashboard', 'Powrót do Dashboard')}
          </button>
          <AnnualReviewHistory />
        </div>
      </div>
    );
  }

  // If Self-Assessment flow is active, show it instead of the main dashboard
  if (activeFlow === 'selfAssessment') {
    return (
      <div className="worker-evaluation-page">
        <div className="worker-evaluation-page__content">
          <SelfEvaluationPage showBackButton={true} onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  return (
    <div className="worker-evaluation-page">
      <div className="worker-evaluation-page__content">
        <div className="worker-evaluation-page__header">
          <h1 className="worker-evaluation-page__title">{t('evaluation.worker.title', 'Worker Evaluation')}</h1>
          <p className="worker-evaluation-page__description">
            {t('evaluation.worker.dashboardDescription', 'Manage your self-evaluations, development plans, and performance reviews')}
          </p>
        </div>

        <div className="worker-evaluation-page__controls-grid">
          <button className="worker-evaluation-page__control-button" onClick={() => handleControlClick('whiteValues')}>
            {t('evaluation.worker.controls.whiteValues', 'Company Values')}
          </button>
          
          <button className="worker-evaluation-page__control-button" onClick={() => handleControlClick('selfAssessment')}>
            {t('evaluation.worker.controls.selfAssessment', 'Self-Assessment')}
          </button>
          
          <button className="worker-evaluation-page__control-button" onClick={() => handleControlClick('idp')}>
            {t('evaluation.worker.controls.idp', 'IDP (Individual Development Plan)')}
          </button>
          
          <button className="worker-evaluation-page__control-button" onClick={() => handleControlClick('annualReview')}>
            {t('evaluation.worker.controls.annualReview', 'Annual Review')}
          </button>
        </div>
      </div>

      <WhiteValuesModal 
        isOpen={isWhiteValuesModalOpen}
        onClose={handleCloseWhiteValuesModal}
      />
    </div>
  );
};

export default WorkerEvaluationPage;
