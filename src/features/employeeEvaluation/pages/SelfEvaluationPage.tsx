import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { SelfEvaluationForm } from '../components';
import apiClient, { handleApiError } from '../../../lib/api/client';

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

const PageContainer = styled.div`
  padding: 18px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 6px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
`;

const BackButton = styled.button`
  margin-bottom: 12px;
  padding: 5px 10px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: #0f5459;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const EvaluationListContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const EvaluationGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
`;

const EvaluationCard = styled.div`
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #126678;
    box-shadow: 0 2px 8px rgba(18, 102, 120, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'submitted':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'approved':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'requires_revision':
        return `
          background-color: #fecaca;
          color: #991b1b;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const CardContent = styled.div`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 16px;
  border: 2px dashed #126678;
  border-radius: 8px;
  background-color: transparent;
  color: #126678;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f9ff;
    border-color: #0f5459;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const SelfEvaluationPage: React.FC<SelfEvaluationPageProps> = ({ 
  showBackButton = true, 
  onBack 
}) => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [selectedEvaluation, setSelectedEvaluation] = useState<SelfEvaluationData | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [evaluations, setEvaluations] = useState<SelfEvaluationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch evaluations from API
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get<SelfEvaluationData[]>('/SelfEvaluation');
        setEvaluations(data);
        setError(null);
      } catch (err) {
        setError(handleApiError(err));
        console.error('Failed to fetch self-evaluations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const handleCreateNew = () => {
    setSelectedEvaluation(null);
    setIsReadOnly(false);
    setCurrentView('form');
  };

  const handleEditEvaluation = (evaluation: SelfEvaluationData) => {
    setSelectedEvaluation(evaluation);
    setIsReadOnly(evaluation.status === 'approved' || evaluation.status === 'submitted');
    setCurrentView('form');
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedEvaluation?.id) {
        // Update existing
        await apiClient.put(`/SelfEvaluation/${selectedEvaluation.id}`, data);
      } else {
        // Create new
        await apiClient.post('/SelfEvaluation', data);
      }
      
      alert(t('evaluation.messages.saved', 'Samoocena została zapisana jako szkic'));
      
      // Refresh evaluations list
      const updatedData = await apiClient.get<SelfEvaluationData[]>('/SelfEvaluation/my');
      setEvaluations(updatedData);
    } catch (err) {
      alert(t('common.error', 'Błąd') + ': ' + handleApiError(err));
      console.error('Failed to save evaluation:', err);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let evaluationId;
      
      if (selectedEvaluation?.id) {
        // First update
        await apiClient.put(`/SelfEvaluation/${selectedEvaluation.id}`, data);
        evaluationId = selectedEvaluation.id;
      } else {
        // Create new and get ID
        const result = await apiClient.post<SelfEvaluationData>('/SelfEvaluation', data);
        evaluationId = result.id;
      }
      
      // Then submit
      await apiClient.post(`/SelfEvaluation/${evaluationId}/submit`, {});
      
      alert(t('evaluation.messages.submitted', 'Samoocena została wysłana do przełożonego'));
      
      // Refresh evaluations list
      const updatedData = await apiClient.get<SelfEvaluationData[]>('/SelfEvaluation/my');
      setEvaluations(updatedData);
      
      setCurrentView('list');
    } catch (err) {
      alert(t('common.error', 'Błąd') + ': ' + handleApiError(err));
      console.error('Failed to submit evaluation:', err);
    }
  };

  const handleCancel = () => {
    if (currentView === 'form') {
      setCurrentView('list');
      setSelectedEvaluation(null);
    } else if (onBack) {
      // If we're in list view and have an onBack prop, use it
      onBack();
    } else {
      // Default behavior for standalone usage
      setCurrentView('list');
      setSelectedEvaluation(null);
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      'draft': t('evaluation.status.draft', 'Szkic'),
      'submitted': t('evaluation.status.submitted', 'Wysłane'),
      'approved': t('evaluation.status.approved', 'Zatwierdzone'),
      'requires_revision': t('evaluation.status.requires_revision', 'Wymaga poprawek')
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  if (currentView === 'form') {
    return (
      <PageContainer>
        <ContentWrapper>
          {showBackButton && (
            <BackButton onClick={handleCancel}>
              ← {t('common.back', 'Powrót')}
            </BackButton>
          )}
          <SelfEvaluationForm
            onSave={handleSave}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={selectedEvaluation || undefined}
            isReadOnly={isReadOnly}
          />
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {showBackButton && onBack && (
          <BackButton onClick={handleCancel}>
            ← {t('common.back', 'Powrót')}
          </BackButton>
        )}
        <PageHeader>
          <PageTitle>{t('evaluation.selfEvaluation.pageTitle', 'Moje Samooceny')}</PageTitle>
          <PageDescription>
            {t('evaluation.selfEvaluation.pageDescription', 'Zarządzaj swoimi samoocenami i śledź postępy w rozwoju zawodowym')}
          </PageDescription>
        </PageHeader>

        <EvaluationListContainer>
          <EvaluationGrid>
            <CreateButton onClick={handleCreateNew}>
              + {t('evaluation.selfEvaluation.createNew', 'Utwórz nową samoocenę')}
            </CreateButton>

            {isLoading ? (
              <EmptyState>
                {t('common.loading', 'Ładowanie...')}
              </EmptyState>
            ) : error ? (
              <EmptyState>
                {t('common.error', 'Błąd')}: {error}
              </EmptyState>
            ) : evaluations.length === 0 ? (
              <EmptyState>
                {t('evaluation.selfEvaluation.noEvaluations', 'Nie masz jeszcze żadnych samoocen')}
              </EmptyState>
            ) : (
              evaluations.map((evaluation: SelfEvaluationData) => (
                <EvaluationCard
                  key={evaluation.id}
                  onClick={() => handleEditEvaluation(evaluation)}
                >
                  <CardHeader>
                    <CardTitle>
                      {t('evaluation.selfEvaluation.cardTitle', 'Samoocena za okres {{period}}', {
                        period: evaluation.evaluationPeriod
                      })}
                    </CardTitle>
                    <StatusBadge status={evaluation.status}>
                      {getStatusText(evaluation.status)}
                    </StatusBadge>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <strong>{t('evaluation.personalInfo.position', 'Stanowisko')}:</strong> {evaluation.position}
                    </div>
                    <div>
                      <strong>{t('evaluation.personalInfo.department', 'Dział')}:</strong> {evaluation.department}
                    </div>
                    {evaluation.submissionDate && (
                      <div>
                        <strong>{t('evaluation.submissionDate', 'Data wysłania')}:</strong> {formatDate(evaluation.submissionDate)}
                      </div>
                    )}
                    <div>
                      <strong>{t('evaluation.lastModified', 'Ostatnia modyfikacja')}:</strong> {formatDate(evaluation.lastModified)}
                    </div>
                  </CardContent>
                </EvaluationCard>
              ))
            )}
          </EvaluationGrid>
        </EvaluationListContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default SelfEvaluationPage;
