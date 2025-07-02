import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

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

const HistoryContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
`;

const Logo = styled.div`
  font-weight: 600;
  color: #2563eb;
  font-size: 18px;
`;

const YearTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ScrollableReviewsContainer = styled.div`
  padding-bottom: 40px;
`;

const YearTab = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: ${props => props.isActive ? '#2563eb' : 'white'};
  color: ${props => props.isActive ? 'white' : '#374151'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isActive ? '#2563eb' : '#f3f4f6'};
  }
`;

const ReviewCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  background-color: white;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
`;

const StatusGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'A': return '#10b981';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const ReportButton = styled.button`
  padding: 6px 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const ContentSection = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const SectionContent = styled.div`
  color: #374151;
  line-height: 1.5;
`;

const ResultList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 4px;
  }
`;

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

  return (
    <HistoryContainer>
      <Header>
        <Title>{t('annualReview.history.title', 'Historia Ocen')}</Title>
        <Logo>🔲 WHITE</Logo>
      </Header>

      <YearTabs>
        {availableYears.map(year => (
          <YearTab
            key={year}
            isActive={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </YearTab>
        ))}
      </YearTabs>

      <ScrollableReviewsContainer>
        {filteredReviews.length === 0 ? (
          <ContentSection>
            <SectionContent>
              {t('annualReview.history.noReviews', 'Brak dostępnych ocen dla roku')} {selectedYear}.
            </SectionContent>
          </ContentSection>
        ) : (
          filteredReviews.map(review => (
            <ReviewCard key={review.id}>
              <CardHeader>
                <CardTitle>
                  {t(`annualReview.history.types.${review.type}`, review.type)} {review.year} - {t('annualReview.history.employee', 'Pracownik')}: {review.employee}
                </CardTitle>
                <StatusGroup>
                  <StatusBadge status={review.status}>
                    {t(`annualReview.history.status.${review.status}`, `Ocena ${review.status}`)}
                  </StatusBadge>
                  <ReportButton onClick={() => handleReportClick(review.id)}>
                    {t('annualReview.history.generateReport', 'Czas sprawozania')}
                  </ReportButton>
                </StatusGroup>
              </CardHeader>

              <ContentGrid>
                <ContentSection>
                  <SectionLabel>{t('annualReview.history.sections.goalDetails', 'Szczegóły celu')}</SectionLabel>
                  <SectionContent>{review.detailedGoals}</SectionContent>
                </ContentSection>

                <ContentSection>
                  <SectionLabel>{t('annualReview.history.sections.goalType', 'Typ celu')}</SectionLabel>
                  <SectionContent>{review.goalType}</SectionContent>
                </ContentSection>

                <ContentSection>
                  <SectionLabel>{t('annualReview.history.sections.goalResults', 'Wyniki celu')}</SectionLabel>
                  <SectionContent>
                    <ResultList>
                      {review.goalResults.map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ResultList>
                  </SectionContent>
                </ContentSection>
              </ContentGrid>
            </ReviewCard>
          ))
        )}
      </ScrollableReviewsContainer>
    </HistoryContainer>
  );
};

export default LeaderAnnualReviewHistory;
