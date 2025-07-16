import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LeaderTeamEvaluationFlow.css';

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

interface LeaderTeamEvaluationFlowProps {
  onBack?: (resetFilters?: () => void) => void;
  onStepChange?: (step: FlowStep) => void;
  backTrigger?: boolean;
}

type FlowStep = 'team-overview' | 'annual-review' | 'idp-management' | 'employee-detail';

const LeaderTeamEvaluationFlow: React.FC<LeaderTeamEvaluationFlowProps> = ({ onBack, onStepChange, backTrigger }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<FlowStep>('team-overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filterText, setFilterText] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Notify parent component of step changes
  const handleStepChange = (step: FlowStep) => {
    setCurrentStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  // Handle back navigation based on current step
  const handleBackNavigation = () => {
    if (currentStep === 'annual-review' || currentStep === 'idp-management') {
      // If we're in annual review or IDP, go back to team overview and reset filters
      resetFilters();
      handleStepChange('team-overview');
    } else if (currentStep === 'employee-detail') {
      // If we're in employee detail, go back to team overview
      resetFilters();
      handleStepChange('team-overview');
    } else {
      // If we're in team overview, go back to main dashboard
      if (onBack) {
        onBack(resetFilters);
      }
    }
  };

  // Handle back trigger from parent
  React.useEffect(() => {
    if (backTrigger) {
      handleBackNavigation();
    }
  }, [backTrigger]);

  // Reset component state when component is re-mounted or reset
  React.useEffect(() => {
    // Reset to initial state when component is first mounted
    setCurrentStep('team-overview');
    setSelectedEmployee(null);
    resetFilters();
  }, []);

  // Mock data - w rzeczywistej aplikacji to byłoby pobrane z API
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

  // Helper function to filter team members
  const getFilteredTeamMembers = () => {
    return teamMembers.filter(employee => {
      const matchesText = filterText === '' || 
        employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.id.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || 
        employee.department === filterDepartment;
      
      return matchesText && matchesDepartment;
    });
  };

  // Get unique departments for filter dropdown
  const uniqueDepartments = [...new Set(teamMembers.map(emp => emp.department))];

  // Reset filters when switching views
  const resetFilters = () => {
    setFilterText('');
    setFilterDepartment('all');
  };

  const getStatusText = (status: string, type: 'review' | 'idp') => {
    const prefix = type === 'review' ? 'review' : 'idp';
    return t(`evaluation.status.${prefix}.${status}`, status.replace('_', ' '));
  };

  const handleProcessStepClick = (step: FlowStep) => {
    resetFilters();
    handleStepChange(step);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleStepChange('employee-detail');
  };

  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = status.replace('_', '-');
    return `leader-team-evaluation-flow__status-badge--${normalizedStatus}`;
  };

  const getProcessStepClass = (isActive: boolean, isCompleted: boolean) => {
    let classes = 'leader-team-evaluation-flow__process-step';
    if (isActive) classes += ' leader-team-evaluation-flow__process-step--active';
    if (isCompleted) classes += ' leader-team-evaluation-flow__process-step--completed';
    return classes;
  };

  const renderTeamOverview = () => (
    <div className="leader-team-evaluation-flow__step-container">
      <div 
        className={getProcessStepClass(false, false)}
        onClick={() => handleProcessStepClick('annual-review')}
      >
        <h4 className="leader-team-evaluation-flow__process-step-title">
          {t('evaluation.leader.team.annualReview.title', 'Oceny Roczne')}
        </h4>
        <p className="leader-team-evaluation-flow__process-step-description">
          {t('evaluation.leader.team.annualReview.description', 'Zarządzaj rocznymi ocenami wydajności swojego zespołu')}
        </p>
      </div>

      <div 
        className={getProcessStepClass(false, false)}
        onClick={() => handleProcessStepClick('idp-management')}
      >
        <h4 className="leader-team-evaluation-flow__process-step-title">
          {t('evaluation.leader.team.idp.title', 'Plany IDP')}
        </h4>
        <p className="leader-team-evaluation-flow__process-step-description">
          {t('evaluation.leader.team.idp.description', 'Przeglądaj i zatwierdź indywidualne plany rozwoju')}
        </p>
      </div>
    </div>
  );

  const renderAnnualReviewManagement = () => {
    const filteredMembers = getFilteredTeamMembers();
    
    return (
      <div className="leader-team-evaluation-flow__step-container">
        <div className="leader-team-evaluation-flow__step-header">
          <h3 className="leader-team-evaluation-flow__step-title">
            {t('evaluation.leader.team.annualReview.title', 'Zarządzanie Ocenami Rocznymi')}
          </h3>
        </div>

        <div className="leader-team-evaluation-flow__filter-container">
          <div className="leader-team-evaluation-flow__filter-group">
            <label className="leader-team-evaluation-flow__filter-label" htmlFor="name-filter">
              {t('evaluation.leader.team.filter.nameOrId', 'Imię/Nazwisko lub ID')}
            </label>
            <input
              className="leader-team-evaluation-flow__filter-input"
              id="name-filter"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={t('evaluation.leader.team.filter.searchPlaceholder', 'Szukaj po imieniu, nazwisku lub ID...')}
            />
          </div>
          
          <div className="leader-team-evaluation-flow__filter-group">
            <label className="leader-team-evaluation-flow__filter-label" htmlFor="department-filter">
              {t('evaluation.leader.team.filter.department', 'Dział')}
            </label>
            <select
              className="leader-team-evaluation-flow__filter-select"
              id="department-filter"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">{t('evaluation.leader.team.filter.allDepartments', 'Wszystkie działy')}</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="leader-team-evaluation-flow__filter-results-text">
          {t('evaluation.leader.team.filter.showing', 'Pokazano {{count}} z {{total}} pracowników', {
            count: filteredMembers.length,
            total: teamMembers.length
          })}
        </div>

        <div className="leader-team-evaluation-flow__employee-table">
          <div className="leader-team-evaluation-flow__employee-table-header">
            <div>ID</div>
            <div>{t('evaluation.leader.team.table.name', 'Imię i nazwisko')}</div>
            <div>{t('evaluation.leader.team.table.department', 'Dział')}</div>
            <div>{t('evaluation.leader.team.table.status', 'Status')}</div>
            <div>{t('evaluation.leader.team.table.actions', 'Akcje')}</div>
          </div>
          
          {filteredMembers.map((employee) => (
            <div key={employee.id} className="leader-team-evaluation-flow__employee-table-row">
              <div className="leader-team-evaluation-flow__employee-id">{employee.id}</div>
              <div className="leader-team-evaluation-flow__employee-name-cell">{employee.name}</div>
              <div className="leader-team-evaluation-flow__employee-department-cell">{employee.department}</div>
              <div className="leader-team-evaluation-flow__status-cell">
                <span className={`leader-team-evaluation-flow__status-badge ${getStatusBadgeClass(employee.reviewStatus)}`}>
                  {getStatusText(employee.reviewStatus, 'review')}
                </span>
              </div>
              <div className="leader-team-evaluation-flow__action-cell">
                {employee.reviewStatus === 'not_started' && (
                  <button className="leader-team-evaluation-flow__action-button leader-team-evaluation-flow__action-button--primary">
                    {t('evaluation.leader.team.actions.startReview', 'Rozpocznij ocenę')}
                  </button>
                )}
                {employee.reviewStatus === 'in_progress' && (
                  <button className="leader-team-evaluation-flow__action-button leader-team-evaluation-flow__action-button--secondary">
                    {t('evaluation.leader.team.actions.continueReview', 'Kontynuuj ocenę')}
                  </button>
                )}
                {employee.reviewStatus === 'requires_correction' && (
                  <button className="leader-team-evaluation-flow__action-button leader-team-evaluation-flow__action-button--primary">
                    {t('evaluation.leader.team.actions.reviewCorrections', 'Sprawdź poprawki')}
                  </button>
                )}
                {employee.reviewStatus === 'completed' && (
                  <button className="leader-team-evaluation-flow__action-button leader-team-evaluation-flow__action-button--success">
                    {t('evaluation.leader.team.actions.viewReview', 'Zobacz ocenę')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
    </div>
    );
  };

  // Remaining render functions will be simplified for brevity - they follow the same pattern
  const renderIDPManagement = () => {
    const filteredMembers = getFilteredTeamMembers();
    return (
      <div className="leader-team-evaluation-flow__step-container">
        <div className="leader-team-evaluation-flow__step-header">
          <h3 className="leader-team-evaluation-flow__step-title">
            {t('evaluation.leader.team.idp.title', 'Zarządzanie Planami IDP')}
          </h3>
        </div>
        {/* Similar filter and table structure as annual review */}
        <div>IDP Management Content - Implementation follows same pattern as Annual Review</div>
      </div>
    );
  };

  const renderEmployeeDetail = () => {
    if (!selectedEmployee) return null;
    return (
      <div className="leader-team-evaluation-flow__step-container">
        <div className="leader-team-evaluation-flow__step-header">
          <h3 className="leader-team-evaluation-flow__step-title">
            {selectedEmployee.name} - {t('evaluation.leader.team.employeeDetail.title', 'Szczegóły pracownika')}
          </h3>
        </div>
        {/* Employee detail content */}
        <div>Employee Detail Content</div>
      </div>
    );
  };

  return (
    <div className="leader-team-evaluation-flow">
      <div className="leader-team-evaluation-flow__header">
        <h2 className="leader-team-evaluation-flow__title">
          {t('evaluation.leader.team.title', 'Ja i Moi Bezpośredni Podwładni')}
        </h2>
        <p className="leader-team-evaluation-flow__description">
          {t('evaluation.leader.team.description', 'Zarządzaj procesami oceny i rozwoju swojego zespołu')}
        </p>
      </div>

      {currentStep === 'team-overview' && renderTeamOverview()}
      {currentStep === 'annual-review' && renderAnnualReviewManagement()}
      {currentStep === 'idp-management' && renderIDPManagement()}
      {currentStep === 'employee-detail' && renderEmployeeDetail()}
    </div>
  );
};

export default LeaderTeamEvaluationFlow;
