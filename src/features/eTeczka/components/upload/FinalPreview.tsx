import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { SelectedEmployee, DocumentRange, UploadedFile } from '../../types';

interface FinalPreviewProps {
  selectedEmployee: SelectedEmployee | null;
  documentRanges: DocumentRange[];
  uploadedFiles: UploadedFile[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummarySection = styled.div`
  background-color: rgba(18, 102, 120, 0.05);
  border: 1px solid #126678;
  border-radius: 8px;
  padding: 20px;
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #126678;
  margin: 0 0 16px 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
  text-transform: uppercase;
`;

const SummaryValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DocumentCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.surface};
`;

const DocumentHeader = styled.div`
  padding: 16px 20px;
  background-color: rgba(18, 102, 120, 0.02);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const DocumentTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const DocumentMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  flex-wrap: wrap;
`;

const DocumentDetails = styled.div`
  padding: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: between;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
  flex: 1;
`;

const DetailValue = styled.div`
  color: ${props => props.theme.colors.text.primary};
  flex: 2;
`;

const ActionSection = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
`;

const ActionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 16px 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const WarningBox = styled.div`
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
`;

const WarningText = styled.div`
  font-size: 14px;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessBox = styled.div`
  background-color: #d1fae5;
  border: 1px solid #10b981;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
`;

const SuccessText = styled.div`
  font-size: 14px;
  color: #065f46;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SaveButton = styled.button<{ ready: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.ready ? `
    background-color: #10b981;
    color: white;
    
    &:hover {
      background-color: #059669;
      transform: translateY(-1px);
    }
  ` : `
    background-color: ${props.theme.colors.border};
    color: ${props.theme.colors.text.secondary};
    cursor: not-allowed;
  `}
`;

export const FinalPreview: React.FC<FinalPreviewProps> = ({
  selectedEmployee,
  documentRanges,
  uploadedFiles
}) => {
  const { t } = useTranslation();
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [legalComplianceChecked, setLegalComplianceChecked] = useState(false);
  const [digitalSignatureChecked, setDigitalSignatureChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);

  const isReadyToSave = verificationChecked && legalComplianceChecked && digitalSignatureChecked;

  const getTotalPages = () => {
    return documentRanges.reduce((total, range) => 
      total + (range.endPage - range.startPage + 1), 0
    );
  };

  const getRetentionLabel = (retentionPeriod: string) => {
    const labels: Record<string, string> = {
      '10_years': t('eTeczka.upload.retention.10years', '10 lat'),
      '50_years': t('eTeczka.upload.retention.50years', '50 lat'),
      '75_years': t('eTeczka.upload.retention.75years', '75 lat'),
      '5_years': t('eTeczka.upload.retention.5years', '5 lat'),
      '4_years': t('eTeczka.upload.retention.4years', '4 lata'),
      'permanent': t('eTeczka.upload.retention.permanent', 'Bezterminowo'),
      'custom': t('eTeczka.upload.retention.custom', 'Niestandardowy')
    };
    return labels[retentionPeriod] || retentionPeriod;
  };

  const handleSave = async () => {
    if (!isReadyToSave) return;
    
    setIsSaving(true);
    
    try {
      // Symulacja zapisywania do systemu
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // W prawdziwej aplikacji tutaj byłby API call do zapisania dokumentów
      console.log('Saving documents:', {
        employee: selectedEmployee,
        documents: documentRanges,
        files: uploadedFiles
      });
      
      setSaveComplete(true);
    } catch (error) {
      console.error('Error saving documents:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (saveComplete) {
    return (
      <Container>
        <SuccessBox>
          <SuccessText>
            ✅ {t('eTeczka.upload.saveSuccess', 'Dokumenty zostały pomyślnie zapisane w e-Teczce!')}
          </SuccessText>
        </SuccessBox>
        
        <SummarySection>
          <SummaryTitle>{t('eTeczka.upload.operationSummary', 'Podsumowanie operacji:')}</SummaryTitle>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p>• {t('eTeczka.upload.employeeFolder', 'Pracownik:')} <strong>{selectedEmployee?.name}</strong></p>
            <p>• {t('eTeczka.upload.documentsAdded', 'Dodano dokumentów:')} <strong>{documentRanges.length}</strong></p>
            <p>• {t('eTeczka.upload.totalPages', 'Łączna liczba stron:')} <strong>{getTotalPages()}</strong></p>
            <p>• {t('eTeczka.upload.timestamp', 'Data operacji:')} <strong>{new Date().toLocaleString('pl-PL')}</strong></p>
          </div>
        </SummarySection>
      </Container>
    );
  }

  return (
    <Container>
      <h3>{t('eTeczka.upload.finalPreview', 'Podgląd przed zapisem')}</h3>
      
      <SummarySection>
        <SummaryTitle>{t('eTeczka.upload.operationSummary', 'Podsumowanie operacji')}</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <SummaryLabel>{t('eTeczka.upload.employee', 'Pracownik')}</SummaryLabel>
            <SummaryValue>{selectedEmployee?.name || 'Nie wybrano'}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>{t('eTeczka.upload.filesCount', 'Liczba plików')}</SummaryLabel>
            <SummaryValue>{uploadedFiles.length}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>{t('eTeczka.upload.documentsCount', 'Liczba dokumentów')}</SummaryLabel>
            <SummaryValue>{documentRanges.length}</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>{t('eTeczka.upload.totalPages', 'Łączna liczba stron')}</SummaryLabel>
            <SummaryValue>{getTotalPages()}</SummaryValue>
          </SummaryItem>
        </SummaryGrid>
      </SummarySection>

      <div>
        <h4>{t('eTeczka.upload.documentsToSave', 'Dokumenty do zapisania:')}</h4>
        <DocumentsList>
          {documentRanges.map((range, index) => (
            <DocumentCard key={range.id}>
              <DocumentHeader>
                <DocumentTitle>
                  {index + 1}. {range.title}
                </DocumentTitle>
                <DocumentMeta>
                  <span>{t('eTeczka.upload.pages', 'Strony')} {range.startPage}-{range.endPage}</span>
                  <span>{range.documentType}</span>
                  <span>{t('eTeczka.upload.section', 'Część')} {range.section}</span>
                </DocumentMeta>
              </DocumentHeader>
              
              <DocumentDetails>
                <DetailRow>
                  <DetailLabel>{t('eTeczka.upload.documentDate', 'Data dokumentu:')}</DetailLabel>
                  <DetailValue>{range.date || t('eTeczka.upload.notSet', 'Nie ustawiono')}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>{t('eTeczka.upload.retentionPeriod', 'Okres przechowywania:')}</DetailLabel>
                  <DetailValue>
                    {range.retentionPeriod ? getRetentionLabel(range.retentionPeriod) : t('eTeczka.upload.notSet', 'Nie ustawiono')}
                  </DetailValue>
                </DetailRow>
                {range.notes && (
                  <DetailRow>
                    <DetailLabel>{t('eTeczka.upload.notes', 'Uwagi:')}</DetailLabel>
                    <DetailValue>{range.notes}</DetailValue>
                  </DetailRow>
                )}
              </DocumentDetails>
            </DocumentCard>
          ))}
        </DocumentsList>
      </div>

      <ActionSection>
        <ActionTitle>{t('eTeczka.upload.beforeSaving', 'Przed zapisaniem dokumentów')}</ActionTitle>
        
        {!isReadyToSave && (
          <WarningBox>
            <WarningText>
              ⚠️ {t('eTeczka.upload.confirmationRequired', 'Wymagane jest potwierdzenie wszystkich kroków weryfikacji')}
            </WarningText>
          </WarningBox>
        )}

        <CheckboxGroup>
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              checked={verificationChecked}
              onChange={(e) => setVerificationChecked(e.target.checked)}
            />
            {t('eTeczka.upload.confirmVerification', 'Potwierdzam, że zweryfikowałem poprawność wszystkich dokumentów i metadanych')}
          </CheckboxItem>
          
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              checked={legalComplianceChecked}
              onChange={(e) => setLegalComplianceChecked(e.target.checked)}
            />
            {t('eTeczka.upload.confirmCompliance', 'Potwierdzam zgodność z przepisami o ochronie danych osobowych i prawem pracy')}
          </CheckboxItem>
          
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              checked={digitalSignatureChecked}
              onChange={(e) => setDigitalSignatureChecked(e.target.checked)}
            />
            {t('eTeczka.upload.confirmSignature', 'Dokumenty zostaną podpisane podpisem kwalifikowanym i oznaczone jako zweryfikowane')}
          </CheckboxItem>
        </CheckboxGroup>

        <SaveButton
          ready={isReadyToSave && !isSaving}
          onClick={handleSave}
          disabled={!isReadyToSave || isSaving}
        >
          {isSaving ? (
            t('eTeczka.upload.saving', 'Zapisywanie dokumentów...')
          ) : (
            t('eTeczka.upload.saveToFolder', 'Zapisz dokumenty w e-Teczce')
          )}
        </SaveButton>
      </ActionSection>
    </Container>
  );
};
