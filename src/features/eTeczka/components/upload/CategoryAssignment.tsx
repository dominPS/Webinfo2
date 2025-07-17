import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { DocumentRange } from '../../types';

interface CategoryAssignmentProps {
  documentRanges: DocumentRange[];
  onRangesChange: (ranges: DocumentRange[]) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DocumentCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  background-color: ${props => props.theme.colors.surface};
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const DocumentDetails = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

const CategorySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const SuggestionBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
`;

const AcceptSuggestionButton = styled.button`
  padding: 4px 8px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background-color: #059669;
  }
`;

const ProgressIndicator = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #126678;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

export const CategoryAssignment: React.FC<CategoryAssignmentProps> = ({
  documentRanges,
  onRangesChange
}) => {
  const { t } = useTranslation();

  // Predefiniowane kategorie dokumentów
  const documentTypes = [
    { value: '', label: t('eTeczka.upload.selectType', 'Wybierz typ dokumentu...') },
    { value: 'contract', label: t('eTeczka.upload.types.contract', 'Umowa o pracę') },
    { value: 'agreement', label: t('eTeczka.upload.types.agreement', 'Porozumienie') },
    { value: 'rodo', label: t('eTeczka.upload.types.rodo', 'Oświadczenie RODO') },
    { value: 'medical', label: t('eTeczka.upload.types.medical', 'Badania lekarskie') },
    { value: 'certificate', label: t('eTeczka.upload.types.certificate', 'Certyfikaty') },
    { value: 'training', label: t('eTeczka.upload.types.training', 'Szkolenia') },
    { value: 'evaluation', label: t('eTeczka.upload.types.evaluation', 'Oceny pracownika') },
    { value: 'disciplinary', label: t('eTeczka.upload.types.disciplinary', 'Procedury dyscyplinarne') },
    { value: 'leave', label: t('eTeczka.upload.types.leave', 'Wnioski urlopowe') },
    { value: 'other', label: t('eTeczka.upload.types.other', 'Inne') }
  ];

  // Części akt osobowych zgodnie z polskim prawem
  const sections = [
    { value: '', label: t('eTeczka.upload.selectSection', 'Wybierz część akt...') },
    { value: 'A', label: t('eTeczka.upload.sections.A', 'Część A - Dokumenty związane z zatrudnieniem') },
    { value: 'B', label: t('eTeczka.upload.sections.B', 'Część B - Dokumenty z okresu zatrudnienia') },
    { value: 'C', label: t('eTeczka.upload.sections.C', 'Część C - Dokumenty po rozwiązaniu stosunku pracy') },
    { value: 'D', label: t('eTeczka.upload.sections.D', 'Część D - Dokumenty ubezpieczeniowe') },
    { value: 'E', label: t('eTeczka.upload.sections.E', 'Część E - Dokumenty osobowe') }
  ];

  const updateRange = (rangeId: string, updates: Partial<DocumentRange>) => {
    const updatedRanges = documentRanges.map(range =>
      range.id === rangeId ? { ...range, ...updates } : range
    );
    onRangesChange(updatedRanges);
  };

  const acceptSuggestion = (rangeId: string, suggestion: string) => {
    updateRange(rangeId, { confirmedCategory: suggestion });
    
    // Auto-mapowanie kategorii na typy dokumentów
    let documentType = '';
    if (suggestion.toLowerCase().includes('umowa')) {
      documentType = 'contract';
    } else if (suggestion.toLowerCase().includes('rodo')) {
      documentType = 'rodo';
    } else if (suggestion.toLowerCase().includes('badani') || suggestion.toLowerCase().includes('lekarz')) {
      documentType = 'medical';
    } else if (suggestion.toLowerCase().includes('certyfikat')) {
      documentType = 'certificate';
    }
    
    if (documentType) {
      updateRange(rangeId, { documentType });
    }
  };

  const getCompletedCount = () => {
    return documentRanges.filter(range => range.confirmedCategory && range.section).length;
  };

  const getProgress = () => {
    if (documentRanges.length === 0) return 0;
    return (getCompletedCount() / documentRanges.length) * 100;
  };

  return (
    <Container>
      <h3>{t('eTeczka.upload.assignCategories', 'Przypisz kategorie dokumentów')}</h3>
      
      <ProgressIndicator>
        <ProgressText>
          {t('eTeczka.upload.progress', 'Postęp:')} {getCompletedCount()} / {documentRanges.length} {t('eTeczka.upload.completed', 'ukończone')}
        </ProgressText>
        <ProgressBar>
          <ProgressFill progress={getProgress()} />
        </ProgressBar>
      </ProgressIndicator>

      {documentRanges.map(range => (
        <DocumentCard key={range.id}>
          <DocumentHeader>
            <DocumentInfo>
              <DocumentTitle>{range.title}</DocumentTitle>
              <DocumentDetails>
                {t('eTeczka.upload.pages', 'Strony')} {range.startPage}-{range.endPage}
              </DocumentDetails>
              
              {range.suggestedCategory && !range.confirmedCategory && (
                <SuggestionBadge>
                  💡 {t('eTeczka.upload.suggestion', 'Sugestia:')} {range.suggestedCategory}
                  <AcceptSuggestionButton
                    onClick={() => acceptSuggestion(range.id, range.suggestedCategory!)}
                  >
                    {t('eTeczka.upload.accept', 'Akceptuj')}
                  </AcceptSuggestionButton>
                </SuggestionBadge>
              )}
            </DocumentInfo>
          </DocumentHeader>

          <CategorySection>
            <FormGroup>
              <Label>{t('eTeczka.upload.documentType', 'Typ dokumentu:')}</Label>
              <Select
                value={range.documentType || ''}
                onChange={(e) => updateRange(range.id, { documentType: e.target.value })}
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>{t('eTeczka.upload.section', 'Część akt osobowych:')}</Label>
              <Select
                value={range.section || ''}
                onChange={(e) => updateRange(range.id, { 
                  section: e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' 
                })}
              >
                {sections.map(section => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </CategorySection>

          {range.confirmedCategory && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px 12px', 
              backgroundColor: '#d1fae5', 
              borderRadius: '4px',
              fontSize: '14px',
              color: '#065f46'
            }}>
              ✅ {t('eTeczka.upload.categorized', 'Skategoryzowano jako:')} {range.confirmedCategory}
            </div>
          )}
        </DocumentCard>
      ))}

      {documentRanges.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#757575', 
          padding: '40px',
          border: '1px dashed #d1d5db',
          borderRadius: '8px'
        }}>
          {t('eTeczka.upload.noDocuments', 'Brak dokumentów do kategoryzacji. Wróć do poprzedniego kroku aby utworzyć zakresy dokumentów.')}
        </div>
      )}
    </Container>
  );
};
