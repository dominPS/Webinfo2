import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReviewDetails from './components/ReviewDetails';
import ScheduleReview from './components/ScheduleReview';
import './EmployeeReviewPage.css';

interface Review {
  id: string;
  employeeName: string;
  employeePosition: string;
  type: 'annual' | 'quarterly' | 'project';
  status: 'completed' | 'scheduled' | 'overdue';
  date: string;
  reviewer: string;
}

const EmployeeReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'scheduled' | 'overdue'>('all');

  // Mock data - in real app this would come from API
  const mockReviews: Review[] = [
    {
      id: '1',
      employeeName: 'Anna Kowalska',
      employeePosition: 'Senior Developer',
      type: 'annual',
      status: 'completed',
      date: '2024-11-15',
      reviewer: 'Piotr Nowak'
    },
    {
      id: '2',
      employeeName: 'Jan Wiśniewski',
      employeePosition: 'UX Designer',
      type: 'quarterly',
      status: 'scheduled',
      date: '2024-12-20',
      reviewer: 'Maria Zielińska'
    },
    {
      id: '3',
      employeeName: 'Katarzyna Dąbrowska',
      employeePosition: 'Project Manager',
      type: 'annual',
      status: 'overdue',
      date: '2024-11-01',
      reviewer: 'Tomasz Kowal'
    },
    {
      id: '4',
      employeeName: 'Michał Lewandowski',
      employeePosition: 'QA Engineer',
      type: 'project',
      status: 'completed',
      date: '2024-10-30',
      reviewer: 'Anna Kowalska'
    }
  ];

  const getFilteredReviews = () => {
    return mockReviews.filter(review => {
      const matchesTab = activeTab === 'all' || review.status === activeTab;
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.employeePosition.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTab && matchesStatus && matchesSearch;
    });
  };

  const getStatsData = () => {
    const total = mockReviews.length;
    const completed = mockReviews.filter(r => r.status === 'completed').length;
    const scheduled = mockReviews.filter(r => r.status === 'scheduled').length;
    const overdue = mockReviews.filter(r => r.status === 'overdue').length;
    
    return { total, completed, scheduled, overdue };
  };

  const stats = getStatsData();

  const getStatusText = (status: string) => {
    const statusMap = {
      'completed': 'Ukończone',
      'scheduled': 'Zaplanowane',
      'overdue': 'Opóźnione'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'annual': 'Ocena roczna',
      'quarterly': 'Ocena kwartalna',
      'project': 'Ocena projektowa'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusBadgeClass = (status: string) => {
    return `employee-review-page__review-status employee-review-page__review-status--${status}`;
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
  };

  const handleScheduleReview = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsScheduleModalOpen(false);
  };

  const handleSaveSchedule = (scheduleData: any) => {
    console.log('Scheduling review:', scheduleData);
    // In real app, this would save to API
    alert('Ocena została zaplanowana pomyślnie');
    setIsScheduleModalOpen(false);
  };

  const getEmployeeInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="employee-review-page">
      <div className="employee-review-page__header">
        <div className="employee-review-page__title-section">
          <h1 className="employee-review-page__title">Oceny pracowników</h1>
          <p className="employee-review-page__description">
            Zarządzaj i przeglądaj oceny zespołu
          </p>
        </div>
        <button className="employee-review-page__action-button" onClick={handleScheduleReview}>
          + Zaplanuj ocenę
        </button>
      </div>

      <div className="employee-review-page__content-section">
        {/* Statistics Summary */}
        <div className="employee-review-page__stats-summary">
          <div className="employee-review-page__stat-card">
            <div className="employee-review-page__stat-number">{stats.total}</div>
            <div className="employee-review-page__stat-label">Wszystkie oceny</div>
          </div>
          <div className="employee-review-page__stat-card">
            <div className="employee-review-page__stat-number">{stats.completed}</div>
            <div className="employee-review-page__stat-label">Ukończone</div>
          </div>
          <div className="employee-review-page__stat-card">
            <div className="employee-review-page__stat-number">{stats.scheduled}</div>
            <div className="employee-review-page__stat-label">Zaplanowane</div>
          </div>
          <div className="employee-review-page__stat-card">
            <div className="employee-review-page__stat-number">{stats.overdue}</div>
            <div className="employee-review-page__stat-label">Opóźnione</div>
          </div>
        </div>

        {/* Filters */}
        <div className="employee-review-page__filters">
          <select 
            className="employee-review-page__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Wszystkie statusy</option>
            <option value="completed">Ukończone</option>
            <option value="scheduled">Zaplanowane</option>
            <option value="overdue">Opóźnione</option>
          </select>
          
          <input
            type="text"
            className="employee-review-page__search-input"
            placeholder="Szukaj pracownika..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="employee-review-page__tabs-container">
          <button
            className={`employee-review-page__tab ${activeTab === 'all' ? 'employee-review-page__tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Wszystkie ({mockReviews.length})
          </button>
          <button
            className={`employee-review-page__tab ${activeTab === 'scheduled' ? 'employee-review-page__tab--active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            Zaplanowane ({stats.scheduled})
          </button>
          <button
            className={`employee-review-page__tab ${activeTab === 'completed' ? 'employee-review-page__tab--active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Ukończone ({stats.completed})
          </button>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="employee-review-page__reviews-container">
            {filteredReviews.map(review => (
              <div
                key={review.id}
                className="employee-review-page__review-card"
                onClick={() => handleReviewClick(review)}
              >
                <div className="employee-review-page__employee-info">
                  <div className="employee-review-page__employee-avatar">
                    {getEmployeeInitials(review.employeeName)}
                  </div>
                  <div>
                    <div className="employee-review-page__employee-name">
                      {review.employeeName}
                    </div>
                    <div className="employee-review-page__employee-position">
                      {review.employeePosition}
                    </div>
                  </div>
                </div>
                
                <h3 className="employee-review-page__review-title">
                  {getTypeText(review.type)}
                </h3>
                
                <p className="employee-review-page__review-date">
                  Data: {review.date}
                </p>
                
                <p className="employee-review-page__review-date">
                  Oceniający: {review.reviewer}
                </p>
                
                <span className={getStatusBadgeClass(review.status)}>
                  {getStatusText(review.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="employee-review-page__empty-state">
            <h3>Brak ocen</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? 'Nie znaleziono ocen spełniających kryteria wyszukiwania.'
                : 'Nie ma jeszcze żadnych ocen. Zaplanuj pierwszą ocenę dla swojego zespołu.'
              }
            </p>
            <button className="employee-review-page__empty-state-button" onClick={handleScheduleReview}>
              Zaplanuj pierwszą ocenę
            </button>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="employee-review-page__modal" onClick={handleCloseModal}>
          <div className="employee-review-page__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="employee-review-page__modal-header">
              <h2 className="employee-review-page__modal-title">
                Szczegóły oceny - {selectedReview.employeeName}
              </h2>
              <button className="employee-review-page__modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <ReviewDetails review={selectedReview} />
            
            <div className="employee-review-page__modal-actions">
              <button 
                className="employee-review-page__modal-button employee-review-page__modal-button--secondary"
                onClick={handleCloseModal}
              >
                Zamknij
              </button>
              {selectedReview.status !== 'completed' && (
                <button 
                  className="employee-review-page__modal-button employee-review-page__modal-button--primary"
                  onClick={() => {
                    alert('Edycja oceny - funkcjonalność w przygotowaniu');
                    handleCloseModal();
                  }}
                >
                  Edytuj ocenę
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Review Modal */}
      {isScheduleModalOpen && (
        <div className="employee-review-page__modal" onClick={handleCloseModal}>
          <div className="employee-review-page__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="employee-review-page__modal-header">
              <h2 className="employee-review-page__modal-title">Zaplanuj nową ocenę</h2>
              <button className="employee-review-page__modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <ScheduleReview 
              onSave={handleSaveSchedule}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReviewPage;
