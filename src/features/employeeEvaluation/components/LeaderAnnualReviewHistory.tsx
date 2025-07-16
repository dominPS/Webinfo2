import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LeaderAnnualReviewHistory.css';

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

// Mock data matching the Figma design
const mockReviewHistory: ReviewRecord[] = [
  {
    id: '2025-1',
    year: 2025,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'A',
    detailedGoals: 'Procesy w biznesie',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Realizacja zadań wspierających z angażowaniem pracowników współpracowników i współpracę między działami',
      'Wspieranie informatej również co wykonanie/rozwijanie i regularne współpraca zespołów wf, planowanie procesów',
      'Prezentowanie kopert wf, umownienienie procesów'
    ],
    reportDate: '2025-01-15'
  },
  {
    id: '2025-2',
    year: 2025,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'B',
    detailedGoals: 'Procesy w biznesie',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Uczestnictwo również w skutecznym procesie biznesowego inżyniera',
      'Realizacja zadań wspierających z angażowaniem pracowników współpracowników i współpracę między działami',
      'Wspieranie informatej również co wykonanie/rozwijanie i regularne współpraca zespołów wf, planowanie procesów',
      'Prezentowanie kopert wf, umownienienie procesów'
    ],
    reportDate: '2025-02-15'
  },
  {
    id: '2025-3',
    year: 2025,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'A',
    detailedGoals: 'Procesy w biznesie',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Opracowywanie układa w wykonywaniu procesów biznesowych inżyniera',
      'Realizacja zadań wspierających z angażowaniem pracowników współpracowników i współpracę między działami',
      'Wspieranie informatej również co wykonanie/rozwijanie i regularne współpraca zespołów wf, planowanie procesów',
      'Prezentowanie kopert wf, umownienienie procesów'
    ],
    reportDate: '2025-03-15'
  },
  {
    id: '2024-1',
    year: 2024,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'B',
    detailedGoals: 'Rozwój umiejętności technicznych',
    goalType: 'Cel rozwojowy',
    goalResults: [
      'Ukończenie kursu zaawansowanego JavaScript i React',
      'Wdrożenie nowych technologii w projektach zespołowych',
      'Mentoring młodszych programistów'
    ],
    reportDate: '2024-12-15'
  },
  {
    id: '2024-2',
    year: 2024,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'A',
    detailedGoals: 'Zarządzanie projektami',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Pomyślne zarządzanie 3 projektami o wartości ponad 100k złotych',
      'Poprawa efektywności zespołu o 25%',
      'Wdrożenie metodyki Agile w dziale'
    ],
    reportDate: '2024-11-20'
  },
  {
    id: '2023-1',
    year: 2023,
    employee: 'Marek Nowak',
    type: 'IDP',
    status: 'C',
    detailedGoals: 'Komunikacja i przywództwo',
    goalType: 'Cel rozwojowy',
    goalResults: [
      'Ukończenie kursu komunikacji interpersonalnej',
      'Prowadzenie comiesięcznych spotkań zespołu',
      'Poprawa wskaźników zadowolenia zespołu'
    ],
    reportDate: '2023-12-10'
  },
  {
    id: '2022-1',
    year: 2022,
    employee: 'Marek Nowak',
    type: 'Performance',
    status: 'A',
    detailedGoals: 'Optymalizacja procesów sprzedażowych',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Zwiększenie konwersji o 30% przez optymalizację lejka sprzedaży',
      'Wdrożenie systemu CRM w całej organizacji',
      'Szkolenie zespołu sprzedaży z nowych technik negocjacji'
    ],
    reportDate: '2022-12-20'
  },
  {
    id: '2021-1',
    year: 2021,
    employee: 'Marek Nowak',
    type: 'Annual',
    status: 'B',
    detailedGoals: 'Cyfryzacja i automatyzacja',
    goalType: 'Cel biznesowy',
    goalResults: [
      'Automatyzacja 60% rutynowych procesów biurowych',
      'Wdrożenie elektronicznego obiegu dokumentów',
      'Redukcja czasu przetwarzania zamówień o 40%'
    ],
    reportDate: '2021-12-15'
  }
];

const LeaderAnnualReviewHistory: React.FC = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const availableYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const filteredReviews = mockReviewHistory.filter(review => review.year === selectedYear);

  const handleReportClick = (reviewId: string) => {
    console.log(`Generate report for review: ${reviewId}`);
    alert('Czas sprawozania - funkcja w przygotowaniu');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'A': return 'leader-annual-review-history__status-badge--a';
      case 'B': return 'leader-annual-review-history__status-badge--b';
      case 'C': return 'leader-annual-review-history__status-badge--c';
      case 'D': return 'leader-annual-review-history__status-badge--d';
      default: return 'leader-annual-review-history__status-badge--default';
    }
  };

  return (
    <div className="leader-annual-review-history">
      <div className="leader-annual-review-history__header">
        <h1 className="leader-annual-review-history__title">
          {t('annualReview.history.title', 'Historia Ocen')}
        </h1>
      </div>

      <div className="leader-annual-review-history__year-tabs">
        {availableYears.map(year => (
          <button
            key={year}
            className={`leader-annual-review-history__year-tab ${
              selectedYear === year ? 'leader-annual-review-history__year-tab--active' : ''
            }`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="leader-annual-review-history__scrollable-container">
        {filteredReviews.length === 0 ? (
          <div className="leader-annual-review-history__content-section">
            <div className="leader-annual-review-history__section-content">
              {t('annualReview.history.noReviews', 'Brak dostępnych ocen dla roku')} {selectedYear}.
            </div>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="leader-annual-review-history__review-card">
              <div className="leader-annual-review-history__card-header">
                <h3 className="leader-annual-review-history__card-title">
                  {t(`annualReview.history.types.${review.type}`, review.type)} {review.year} - {t('annualReview.history.employee', 'Pracownik')}: {review.employee}
                </h3>
                <div className="leader-annual-review-history__status-group">
                  <span className={`leader-annual-review-history__status-badge ${getStatusBadgeClass(review.status)}`}>
                    {t(`annualReview.history.status.${review.status}`, `Ocena ${review.status}`)}
                  </span>
                  <button 
                    className="leader-annual-review-history__report-button"
                    onClick={() => handleReportClick(review.id)}
                  >
                    {t('annualReview.history.generateReport', 'Czas sprawozania')}
                  </button>
                </div>
              </div>

              <div className="leader-annual-review-history__content-grid">
                <div className="leader-annual-review-history__content-section">
                  <div className="leader-annual-review-history__section-label">
                    {t('annualReview.history.sections.goalDetails', 'Szczegóły celu')}
                  </div>
                  <div className="leader-annual-review-history__section-content">
                    {review.detailedGoals}
                  </div>
                </div>

                <div className="leader-annual-review-history__content-section">
                  <div className="leader-annual-review-history__section-label">
                    {t('annualReview.history.sections.goalType', 'Typ celu')}
                  </div>
                  <div className="leader-annual-review-history__section-content">
                    {review.goalType}
                  </div>
                </div>

                <div className="leader-annual-review-history__content-section">
                  <div className="leader-annual-review-history__section-label">
                    {t('annualReview.history.sections.goalResults', 'Wyniki celu')}
                  </div>
                  <div className="leader-annual-review-history__section-content">
                    <ul className="leader-annual-review-history__result-list">
                      {review.goalResults.map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderAnnualReviewHistory;
