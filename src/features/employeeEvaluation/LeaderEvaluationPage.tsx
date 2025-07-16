import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LeaderIDPFlow from './components/LeaderIDPComponent';
import AnnualReviewHistory from './components/LeaderAnnualReviewHistory';
import LeaderTeamEvaluationFlow from './components/LeaderTeamEvaluationFlow';
import SelfEvaluationPage from './SelfEvaluationPage';
import WhiteValuesModal from '../../shared/components/WhiteValuesModal';
import TeamCharts from './components/TeamCharts';
import './LeaderEvaluationPage.css';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hasAnnualReview: boolean;
  hasIDPPlan: boolean;
  reviewStatus: 'not_started' | 'in_progress' | 'completed' | 'requires_correction';
  idpStatus: 'not_started' | 'draft' | 'submitted' | 'approved';
}

/**
 * Leader Evaluation Page
 * This page provides leader dashboard controls for managing team evaluations and development
 */
const LeaderEvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [isWhiteValuesModalOpen, setIsWhiteValuesModalOpen] = useState(false);
  const [activeStatView, setActiveStatView] = useState<string | null>(null);
  const [teamFlowStep, setTeamFlowStep] = useState<string>('team-overview');
  const [backTrigger, setBackTrigger] = useState(false);

  // Mock data for team members - in real app this would come from API
  const teamMembers: Employee[] = [
    {
      id: '1',
      name: 'Anna Kowalska',
      position: 'Senior Developer',
      department: 'IT',
      hasAnnualReview: true,
      hasIDPPlan: true,
      reviewStatus: 'completed',
      idpStatus: 'approved'
    },
    {
      id: '2',
      name: 'Piotr Nowak',
      position: 'Junior Developer',
      department: 'IT',
      hasAnnualReview: false,
      hasIDPPlan: true,
      reviewStatus: 'not_started',
      idpStatus: 'draft'
    },
    {
      id: '3',
      name: 'Maria Wiśniewska',
      position: 'UX Designer',
      department: 'Design',
      hasAnnualReview: true,
      hasIDPPlan: false,
      reviewStatus: 'in_progress',
      idpStatus: 'not_started'
    },
    {
      id: '4',
      name: 'Tomasz Zieliński',
      position: 'QA Engineer',
      department: 'Quality',
      hasAnnualReview: true,
      hasIDPPlan: true,
      reviewStatus: 'requires_correction',
      idpStatus: 'submitted'
    }
  ];

  const getStatusText = (status: string, type: 'review' | 'idp') => {
    const prefix = type === 'review' ? 'review' : 'idp';
    return t(`evaluation.status.${prefix}.${status}`, status.replace('_', ' '));
  };

  const getTeamStats = () => {
    const totalMembers = teamMembers.length;
    const completedReviews = teamMembers.filter(m => m.reviewStatus === 'completed').length;
    const activeIDPs = teamMembers.filter(m => m.idpStatus === 'approved' || m.idpStatus === 'submitted').length;
    const pendingActions = teamMembers.filter(m => 
      m.reviewStatus === 'requires_correction' || 
      m.reviewStatus === 'in_progress' ||
      m.idpStatus === 'submitted'
    ).length;

    return { totalMembers, completedReviews, activeIDPs, pendingActions };
  };

  const stats = getTeamStats();

  const handleEmployeeClick = (employee: Employee) => {
    // In a real app, this would navigate to employee detail page
    console.log(`Employee clicked: ${employee.name}`);
    alert(`Szczegóły pracownika ${employee.name} - funkcjonalność wkrótce!`);
  };

  const handleStatCardClick = (statType: string) => {
    setActiveStatView(statType);
  };

  const getFilteredEmployeesByStatType = (statType: string) => {
    switch (statType) {
      case 'total':
        return teamMembers;
      case 'completed':
        return teamMembers.filter(m => m.reviewStatus === 'completed');
      case 'idps':
        return teamMembers.filter(m => m.idpStatus === 'approved' || m.idpStatus === 'submitted');
      case 'pending':
        return teamMembers.filter(m => 
          m.reviewStatus === 'requires_correction' || 
          m.reviewStatus === 'in_progress' ||
          m.idpStatus === 'submitted'
        );
      default:
        return teamMembers;
    }
  };

  const handleControlClick = (controlType: string) => {
    console.log(`Leader Control clicked: ${controlType}`);
    setActiveFlow(controlType);
  };

  const handleBackToDashboard = () => {
    setActiveFlow(null);
    setActiveStatView(null);
    setBackTrigger(!backTrigger);
  };

  const handleOpenWhiteValuesModal = () => {
    setIsWhiteValuesModalOpen(true);
  };

  const handleCloseWhiteValuesModal = () => {
    setIsWhiteValuesModalOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    return `leader-evaluation-page__status-badge leader-evaluation-page__status-badge--${status.replace('_', '-')}`;
  };

  if (activeFlow === 'teamEvaluation') {
    return (
      <LeaderTeamEvaluationFlow
        onBack={handleBackToDashboard}
        backTrigger={backTrigger}
      />
    );
  }

  if (activeFlow === 'selfEvaluation') {
    return <SelfEvaluationPage />;
  }

  if (activeFlow === 'annualReviewHistory') {
    return (
      <AnnualReviewHistory />
    );
  }

  if (activeFlow === 'idpFlow') {
    return (
      <LeaderIDPFlow />
    );
  }

  if (activeFlow === 'teamCharts') {
    return (
      <TeamCharts
        teamMembers={teamMembers}
      />
    );
  }

  if (activeStatView) {
    const filteredEmployees = getFilteredEmployeesByStatType(activeStatView);
    const viewTitle = {
      'total': 'Wszyscy członkowie zespołu',
      'completed': 'Ukończone oceny',
      'idps': 'Aktywne plany rozwoju',
      'pending': 'Wymagające działania'
    }[activeStatView] || 'Filtrowane wyniki';

    return (
      <div className="leader-evaluation-page">
        <div className="leader-evaluation-page__content-wrapper">
          <button className="leader-evaluation-page__back-button" onClick={handleBackToDashboard}>
            ← Powrót do przeglądu zespołu
          </button>
          
          <div className="leader-evaluation-page__team-overview">
            <h2 className="leader-evaluation-page__section-title">{viewTitle}</h2>
            
            <div className="leader-evaluation-page__employee-grid">
              {filteredEmployees.map(employee => (
                <div
                  key={employee.id}
                  className="leader-evaluation-page__employee-card"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <h4 className="leader-evaluation-page__employee-name">{employee.name}</h4>
                  <p className="leader-evaluation-page__employee-position">{employee.position}</p>
                  
                  <div>
                    <span className={getStatusBadgeClass(employee.reviewStatus)}>
                      {getStatusText(employee.reviewStatus, 'review')}
                    </span>
                    <span className={getStatusBadgeClass(employee.idpStatus)}>
                      {getStatusText(employee.idpStatus, 'idp')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leader-evaluation-page">
      <div className="leader-evaluation-page__header">
        <h1 className="leader-evaluation-page__title">Panel Lidera - Zarządzanie Zespołem</h1>
        <p className="leader-evaluation-page__description">
          Kompleksowy widok na postępy zespołu w zakresie ocen i rozwoju
        </p>
      </div>

      <div className="leader-evaluation-page__controls-grid">
        <button className="leader-evaluation-page__control-button" onClick={() => handleControlClick('teamEvaluation')}>
          📊 Oceny zespołu
        </button>
        <button className="leader-evaluation-page__control-button" onClick={() => handleControlClick('selfEvaluation')}>
          📝 Moja samoocena
        </button>
        <button className="leader-evaluation-page__control-button" onClick={() => handleControlClick('annualReviewHistory')}>
          📋 Historia ocen
        </button>
        <button className="leader-evaluation-page__control-button" onClick={() => handleControlClick('idpFlow')}>
          🎯 Plany rozwoju (IDP)
        </button>
        <button className="leader-evaluation-page__control-button" onClick={() => handleControlClick('teamCharts')}>
          📈 Analiza zespołu
        </button>
        <button className="leader-evaluation-page__control-button" onClick={handleOpenWhiteValuesModal}>
          🤝 White Values
        </button>
      </div>

      <div className="leader-evaluation-page__content-wrapper">
        <div className="leader-evaluation-page__team-overview">
          <h2 className="leader-evaluation-page__section-title">Przegląd zespołu</h2>
          
          <div className="leader-evaluation-page__stats-container">
            <div className="leader-evaluation-page__stat-card" onClick={() => handleStatCardClick('total')}>
              <div className="leader-evaluation-page__stat-number">{stats.totalMembers}</div>
              <div className="leader-evaluation-page__stat-label">Członków zespołu</div>
            </div>
            
            <div className="leader-evaluation-page__stat-card" onClick={() => handleStatCardClick('completed')}>
              <div className="leader-evaluation-page__stat-number">{stats.completedReviews}</div>
              <div className="leader-evaluation-page__stat-label">Ukończone oceny</div>
            </div>
            
            <div className="leader-evaluation-page__stat-card" onClick={() => handleStatCardClick('idps')}>
              <div className="leader-evaluation-page__stat-number">{stats.activeIDPs}</div>
              <div className="leader-evaluation-page__stat-label">Aktywne plany IDP</div>
            </div>
            
            <div className="leader-evaluation-page__stat-card" onClick={() => handleStatCardClick('pending')}>
              <div className="leader-evaluation-page__stat-number">{stats.pendingActions}</div>
              <div className="leader-evaluation-page__stat-label">Wymagają działania</div>
            </div>
          </div>

          <div className="leader-evaluation-page__employee-grid">
            {teamMembers.map(employee => (
              <div
                key={employee.id}
                className="leader-evaluation-page__employee-card"
                onClick={() => handleEmployeeClick(employee)}
              >
                <h4 className="leader-evaluation-page__employee-name">{employee.name}</h4>
                <p className="leader-evaluation-page__employee-position">{employee.position}</p>
                
                <div>
                  <span className={getStatusBadgeClass(employee.reviewStatus)}>
                    {getStatusText(employee.reviewStatus, 'review')}
                  </span>
                  <span className={getStatusBadgeClass(employee.idpStatus)}>
                    {getStatusText(employee.idpStatus, 'idp')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="leader-evaluation-page__module-section">
          <h3 className="leader-evaluation-page__module-title">
            <div className="leader-evaluation-page__module-icon">⚡</div>
            Szybkie akcje
          </h3>
          
          <div className="leader-evaluation-page__module-grid">
            <button className="leader-evaluation-page__module-button" onClick={() => handleControlClick('teamEvaluation')}>
              <div className="leader-evaluation-page__module-button-title">Rozpocznij oceny zespołu</div>
              <div className="leader-evaluation-page__module-button-description">
                Uruchom proces oceny dla wybranych członków zespołu
              </div>
            </button>
            
            <button className="leader-evaluation-page__module-button" onClick={() => handleControlClick('idpFlow')}>
              <div className="leader-evaluation-page__module-button-title">Zarządzaj planami IDP</div>
              <div className="leader-evaluation-page__module-button-description">
                Przygotuj i zatwierdź plany rozwoju indywidualnego
              </div>
            </button>
            
            <button className="leader-evaluation-page__module-button" onClick={() => handleControlClick('teamCharts')}>
              <div className="leader-evaluation-page__module-button-title">Analiza wyników</div>
              <div className="leader-evaluation-page__module-button-description">
                Przejrzyj szczegółowe analizy i raporty zespołu
              </div>
            </button>
            
            <button className="leader-evaluation-page__module-button" onClick={() => handleControlClick('annualReviewHistory')}>
              <div className="leader-evaluation-page__module-button-title">Historia zespołu</div>
              <div className="leader-evaluation-page__module-button-description">
                Przeglądaj historyczne dane i trendy rozwoju
              </div>
            </button>
          </div>
        </div>
      </div>

      <WhiteValuesModal
        isOpen={isWhiteValuesModalOpen}
        onClose={handleCloseWhiteValuesModal}
      />
    </div>
  );
};

export default LeaderEvaluationPage;
