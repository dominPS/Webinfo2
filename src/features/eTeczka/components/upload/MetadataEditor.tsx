import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { DocumentRange } from './UploadWorkflow';

interface MetadataEditorProps {
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
  margin-bottom: 16px;
`;

const DocumentTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const DocumentSummary = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
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

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 4px;
`;

const CompletionIndicator = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  
  ${props => props.completed ? `
    background-color: #d1fae5;
    color: #065f46;
  ` : `
    background-color: #fef3c7;
    color: #92400e;
  `}
`;

const BulkActionsSection = styled.div`
  background-color: rgba(18, 102, 120, 0.02);
  border: 1px solid #126678;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const BulkActionsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #126678;
  margin: 0 0 12px 0;
`;

const BulkActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
`;

const ApplyButton = styled.button`
  padding: 8px 16px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #0f5459;
  }
  
  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

export const MetadataEditor: React.FC<MetadataEditorProps> = ({
  documentRanges,
  onRangesChange
}) => {
  const { t } = useTranslation();
  const [bulkDate, setBulkDate] = React.useState('');
  const [bulkRetention, setBulkRetention] = React.useState('');

  // Okresy przechowywania zgodnie z polskim prawem pracy
  const retentionPeriods = [
    { value: '', label: t('eTeczka.upload.selectRetention', 'Wybierz okres przechowywania...') },
    { value: '10_years', label: t('eTeczka.upload.retention.10years', '10 lat (dokumenty związane z zatrudnieniem)') },
    { value: '50_years', label: t('eTeczka.upload.retention.50years', '50 lat (dokumenty emerytalne)') },
    { value: '75_years', label: t('eTeczka.upload.retention.75years', '75 lat (dokumenty BHP)') },
    { value: '5_years', label: t('eTeczka.upload.retention.5years', '5 lat (dokumenty płacowe)') },
    { value: '4_years', label: t('eTeczka.upload.retention.4years', '4 lata (dokumenty podatkowe)') },
    { value: 'permanent', label: t('eTeczka.upload.retention.permanent', 'Bezterminowo') },
    { value: 'custom', label: t('eTeczka.upload.retention.custom', 'Niestandardowy okres') }
  ];

  const updateRange = (rangeId: string, updates: Partial<DocumentRange>) => {
    const updatedRanges = documentRanges.map(range =>
      range.id === rangeId ? { ...range, ...updates } : range
    );
    onRangesChange(updatedRanges);
  };

  const applyBulkMetadata = () => {
    const updates: Partial<DocumentRange> = {};
    if (bulkDate) updates.date = bulkDate;
    if (bulkRetention) updates.retentionPeriod = bulkRetention;
    
    if (Object.keys(updates).length > 0) {
      const updatedRanges = documentRanges.map(range => ({ ...range, ...updates }));
      onRangesChange(updatedRanges);
      setBulkDate('');
      setBulkRetention('');
    }
  };

  const isDocumentComplete = (range: DocumentRange) => {
    return !!(range.date && range.retentionPeriod);
  };

  const getCompletedCount = () => {
    return documentRanges.filter(isDocumentComplete).length;
  };

  // Automatyczne wykrywanie dat z OCR (mock)
  const suggestDateFromOCR = (rangeId: string) => {
    // W prawdziwej aplikacji tutaj byłaby analiza OCR
    const today = new Date().toISOString().split('T')[0];
    updateRange(rangeId, { date: today });
  };

  return (
    <Container>
      <h3>{t('eTeczka.upload.addMetadata', 'Dodaj metadane dokumentów')}</h3>
      
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#126678',
        fontSize: '14px'
      }}>
        {t('eTeczka.upload.metadataProgress', 'Ukończono:')} {getCompletedCount()} / {documentRanges.length} {t('eTeczka.upload.documents', 'dokumentów')}
      </div>

      {documentRanges.length > 1 && (
        <BulkActionsSection>
          <BulkActionsTitle>
            {t('eTeczka.upload.bulkActions', 'Masowe przypisywanie metadanych')}
          </BulkActionsTitle>
          <BulkActionsGrid>
            <FormGroup>
              <Label>{t('eTeczka.upload.bulkDate', 'Data dla wszystkich dokumentów:')}</Label>
              <Input
                type="date"
                value={bulkDate}
                onChange={(e) => setBulkDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('eTeczka.upload.bulkRetention', 'Okres przechowywania dla wszystkich:')}</Label>
              <Select
                value={bulkRetention}
                onChange={(e) => setBulkRetention(e.target.value)}
              >
                {retentionPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </BulkActionsGrid>
          <ApplyButton
            onClick={applyBulkMetadata}
            disabled={!bulkDate && !bulkRetention}
          >
            {t('eTeczka.upload.applyToAll', 'Zastosuj do wszystkich')}
          </ApplyButton>
        </BulkActionsSection>
      )}

      {documentRanges.map(range => (
        <DocumentCard key={range.id}>
          <DocumentHeader>
            <DocumentTitle>{range.title}</DocumentTitle>
            <DocumentSummary>
              <span>{t('eTeczka.upload.pages', 'Strony')} {range.startPage}-{range.endPage}</span>
              <span>{range.documentType || t('eTeczka.upload.noType', 'Brak typu')}</span>
              <span>{t('eTeczka.upload.section', 'Część')} {range.section || '?'}</span>
            </DocumentSummary>
          </DocumentHeader>

          <MetadataGrid>
            <FormGroup>
              <Label>{t('eTeczka.upload.documentDate', 'Data dokumentu:')}</Label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  type="date"
                  value={range.date || ''}
                  onChange={(e) => updateRange(range.id, { date: e.target.value })}
                  style={{ flex: 1 }}
                />
                <ApplyButton
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                  onClick={() => suggestDateFromOCR(range.id)}
                  title={t('eTeczka.upload.detectDate', 'Wykryj datę z OCR')}
                >
                  🔍
                </ApplyButton>
              </div>
              <HelperText>
                {t('eTeczka.upload.dateHelp', 'Data utworzenia lub podpisania dokumentu')}
              </HelperText>
            </FormGroup>

            <FormGroup>
              <Label>{t('eTeczka.upload.retentionPeriod', 'Okres przechowywania:')}</Label>
              <Select
                value={range.retentionPeriod || ''}
                onChange={(e) => updateRange(range.id, { retentionPeriod: e.target.value })}
              >
                {retentionPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </Select>
              <HelperText>
                {t('eTeczka.upload.retentionHelp', 'Zgodnie z przepisami prawa pracy')}
              </HelperText>
            </FormGroup>

            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>{t('eTeczka.upload.notes', 'Uwagi i notatki:')}</Label>
              <TextArea
                placeholder={t('eTeczka.upload.notesPlaceholder', 'Dodatkowe informacje o dokumencie...')}
                value={range.notes || ''}
                onChange={(e) => updateRange(range.id, { notes: e.target.value })}
              />
              <HelperText>
                {t('eTeczka.upload.notesHelp', 'Opcjonalne uwagi, które mogą być przydatne w przyszłości')}
              </HelperText>
            </FormGroup>
          </MetadataGrid>

          <CompletionIndicator completed={isDocumentComplete(range)}>
            {isDocumentComplete(range) ? (
              <>
                ✅ {t('eTeczka.upload.metadataComplete', 'Metadane kompletne')}
              </>
            ) : (
              <>
                ⚠️ {t('eTeczka.upload.metadataIncomplete', 'Wymagana data i okres przechowywania')}
              </>
            )}
          </CompletionIndicator>
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
          {t('eTeczka.upload.noDocuments', 'Brak dokumentów do edycji metadanych.')}
        </div>
      )}
    </Container>
  );
};
