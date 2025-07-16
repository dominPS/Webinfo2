import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AnnualReviewHistory.css';

interface ReviewRecord {
  id: string;
  year: number;
  employee: string;
  type: 'IDP' | 'Performance' | 'Annual';
  status: 'A' | 'B' | 'C' | 'D';
  detailedGoals: string;
  goalType: string;
  goalResults: string[];
  reportDate: string;
}

interface AnnualReviewHistoryProps {
  onBack?: () => void;
}

const AnnualReviewHistory: React.FC<AnnualReviewHistoryProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Mock data - in real app this would come from API
  const mockReviews: ReviewRecord[] = [
    {
      id: '1',
      year: 2024,
      employee: 'Anna Kowalska',
      type: 'Annual',
      status: 'A',
      detailedGoals: 'Zwiększenie efektywności zespołu o 25% poprzez optymalizację procesów',
      goalType: 'Cel biznesowy',
      goalResults: [
        'Wdrożono nowy system zarządzania projektami',
        'Skrócono czas realizacji projektów o 30%',
        'Zwiększono satysfakcję klientów do 95%'
      ],
      reportDate: '2024-12-15'
    },
    {
      id: '2',
      year: 2024,
      employee: 'Jan Wiśniewski',
      type: 'Performance',
      status: 'B',
      detailedGoals: 'Rozwój umiejętności przywódczych i mentoringu',
      goalType: 'Cel rozwojowy',
      goalResults: [
        'Ukończono szkolenie z zarządzania zespołem',
        'Prowadzenie mentoringu 2 junior developerów',
        'Przeprowadzono 12 sesji coachingowych'
      ],
      reportDate: '2024-11-20'
    },
    {
      id: '3',
      year: 2023,
      employee: 'Katarzyna Dąbrowska',
      type: 'IDP',
      status: 'A',
      detailedGoals: 'Certyfikacja w zakresie zarządzania projektami',
      goalType: 'Cel edukacyjny',
      goalResults: [
        'Uzyskano certyfikat PMP',
        'Wdrożono metodykę Agile w zespole',
        'Poprowadzono 5 projektów z sukcesem'
      ],
      reportDate: '2023-12-10'
    },
    {
      id: '4',
      year: 2023,
      employee: 'Michał Lewandowski',
      type: 'Annual',
      status: 'C',
      detailedGoals: 'Poprawa jakości kodu i procesów testowania',
      goalType: 'Cel techniczny',
      goalResults: [
        'Wprowadzono code review',
        'Zwiększono pokrycie testami do 80%',
        'Zredukowano liczbę bugów o 40%'
      ],
      reportDate: '2023-11-15'
    }
  ];

  const years = [...new Set(mockReviews.map(review => review.year))].sort((a, b) => b - a);
  const filteredReviews = mockReviews.filter(review => review.year === selectedYear);

  const getStatusText = (status: string) => {
    const statusMap = {
      'A': 'Wybitny',
      'B': 'Powyżej oczekiwań',
      'C': 'Zgodnie z oczekiwaniami',
      'D': 'Wymaga poprawy'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'IDP': 'Plan rozwoju',
      'Performance': 'Ocena wydajności',
      'Annual': 'Ocena roczna'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusBadgeClass = (status: string) => {
    return `annual-review-history__status-badge annual-review-history__status-badge--${status.toLowerCase()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="annual-review-history">
      <div className="annual-review-history__header">
        <h1 className="annual-review-history__title">Historia ocen rocznych</h1>
      </div>

      <div className="annual-review-history__year-tabs">
        {years.map(year => (
          <button
            key={year}
            className={`annual-review-history__year-tab ${
              selectedYear === year ? 'annual-review-history__year-tab--active' : ''
            }`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="annual-review-history__scrollable-container">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <div key={review.id} className="annual-review-history__review-card">
              <div className="annual-review-history__card-header">
                <h3 className="annual-review-history__card-title">
                  {getTypeText(review.type)} - {review.year}
                </h3>
                <div className="annual-review-history__status-group">
                  <span className="annual-review-history__type-badge">
                    {getTypeText(review.type)}
                  </span>
                  <span className={getStatusBadgeClass(review.status)}>
                    {getStatusText(review.status)}
                  </span>
                </div>
              </div>

              <div className="annual-review-history__employee-info">
                <div className="annual-review-history__employee-name">
                  {review.employee}
                </div>
              </div>

              <div className="annual-review-history__goals-section">
                <h4 className="annual-review-history__goals-title">
                  Cel szczegółowy ({review.goalType})
                </h4>
                <p className="annual-review-history__goals-text">
                  {review.detailedGoals}
                </p>
              </div>

              <div className="annual-review-history__goals-section">
                <h4 className="annual-review-history__goals-title">Rezultaty</h4>
                <ul className="annual-review-history__results-list">
                  {review.goalResults.map((result, index) => (
                    <li key={index} className="annual-review-history__results-item">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="annual-review-history__action-buttons">
                <button className="annual-review-history__action-button">
                  Wyświetl szczegóły
                </button>
                <button className="annual-review-history__action-button">
                  Pobierz raport
                </button>
                <button className="annual-review-history__action-button annual-review-history__action-button--primary">
                  Edytuj
                </button>
              </div>

              <div className="annual-review-history__report-date">
                Data raportu: {formatDate(review.reportDate)}
              </div>
            </div>
          ))
        ) : (
          <div className="annual-review-history__empty-state">
            <h3 className="annual-review-history__empty-state-title">
              Brak ocen za rok {selectedYear}
            </h3>
            <p className="annual-review-history__empty-state-description">
              Nie znaleziono żadnych ocen rocznych dla wybranego roku.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnualReviewHistory;
