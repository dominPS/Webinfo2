import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { DocumentRange } from '../../types';

interface CategoryAssignmentProps {
  documentRanges: DocumentRange[];
  onRangesChange: (ranges: DocumentRange[]) => void;
}

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DocumentItem = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  background-color: ${props => props.theme.colors.surface};
`;

const DocumentIndex = styled.div`
  padding: 4px 12px;
  background-color: #126678;
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
`;

const DocumentDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 100px;
  gap: 16px;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

const DocumentTitleCell = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const PagesCell = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const IndexCell = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
`;

const PreviewCell = styled.div`
  text-align: center;
`;

const PreviewButton = styled.button`
  padding: 6px 12px;
  background-color: #126678;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #0f5a6b;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SectionBadge = styled.div<{ section: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.section) {
      case 'A': return '#fef3c7';
      case 'B': return '#d1fae5'; 
      case 'C': return '#fecaca';
      case 'D': return '#fed7d7';
      case 'E': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.section) {
      case 'A': return '#92400e';
      case 'B': return '#065f46';
      case 'C': return '#991b1b';
      case 'D': return '#991b1b';
      case 'E': return '#3730a3';
      default: return '#374151';
    }
  }};
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #126678;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 4px;
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const DocumentPreviewArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: #f9fafb;
  margin-bottom: 20px;
`;

const DocumentInfo = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const InfoValue = styled.span`
  color: #6b7280;
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background-color: #126678;
    color: white;
    border: 1px solid #126678;
    
    &:hover {
      background-color: #0f5a6b;
    }
  ` : `
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
    }
  `}
`;

export const CategoryAssignment: React.FC<CategoryAssignmentProps> = ({
  documentRanges,
  onRangesChange
}) => {
  const { t } = useTranslation();
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    document: DocumentRange | null;
  }>({
    isOpen: false,
    document: null
  });

  const handlePreviewDocument = (range: DocumentRange) => {
    setPreviewModal({
      isOpen: true,
      document: range
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      document: null
    });
  };

  // Automatyczne przypisywanie indeksów dla każdej sekcji
  useEffect(() => {
    const rangesWithIndexes = documentRanges.map((range, index) => {
      if (!range.documentIndex && range.section) {
        // Zlicz dokumenty w tej samej sekcji przed tym dokumentem
        const sameSeccionCount = documentRanges
          .slice(0, index)
          .filter(r => r.section === range.section).length;
        
        return {
          ...range,
          documentIndex: `${range.section}${sameSeccionCount + 1}`
        };
      }
      return range;
    });

    // Sprawdź czy są zmiany i zaktualizuj
    const hasChanges = rangesWithIndexes.some((range, index) => 
      range.documentIndex !== documentRanges[index].documentIndex
    );

    if (hasChanges) {
      onRangesChange(rangesWithIndexes);
    }
  }, [documentRanges, onRangesChange]);

  // Statystyki dokumentów w każdej sekcji
  const getSectionStats = () => {
    const stats = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    documentRanges.forEach(range => {
      if (range.section) {
        stats[range.section as keyof typeof stats]++;
      }
    });
    return stats;
  };

  const stats = getSectionStats();
  const totalDocuments = documentRanges.length;

  return (
    <div>
      <h3>{t('eTeczka.upload.documentsReview', 'Przegląd dokumentów')}</h3>
      <p style={{ color: '#757575', fontSize: '14px', margin: '0 0 20px 0' }}>
        {t('eTeczka.upload.documentsReviewDescription', 'Sprawdź poprawność przypisania dokumentów do części akt osobowych. Następnym krokiem będzie podpisanie dokumentów podpisem kwalifikowanym.')}
      </p>

      {/* Statystyki */}
      <SummaryStats>
        <StatItem>
          <StatNumber>{stats.A}</StatNumber>
          <StatLabel>{t('eTeczka.upload.sectionA', 'Część A')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{stats.B}</StatNumber>
          <StatLabel>{t('eTeczka.upload.sectionB', 'Część B')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{stats.C}</StatNumber>
          <StatLabel>{t('eTeczka.upload.sectionC', 'Część C')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{stats.D}</StatNumber>
          <StatLabel>{t('eTeczka.upload.sectionD', 'Część D')}</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{stats.E}</StatNumber>
          <StatLabel>{t('eTeczka.upload.sectionE', 'Część E')}</StatLabel>
        </StatItem>
      </SummaryStats>

      {/* Lista dokumentów */}
      <DocumentList>
        {documentRanges.map(range => (
          <DocumentItem key={range.id}>
            <DocumentDetails>
              <DocumentTitleCell>
                {range.title}
              </DocumentTitleCell>
              
              <PagesCell>
                {range.endPage - range.startPage + 1} {t('eTeczka.upload.pagesCount', 'str.')}
              </PagesCell>
              
              <IndexCell>
                {range.documentIndex && (
                  <DocumentIndex>{range.documentIndex}</DocumentIndex>
                )}
              </IndexCell>
              
              <PreviewCell>
                <PreviewButton onClick={() => handlePreviewDocument(range)}>
                  {t('eTeczka.upload.preview', 'Podgląd')}
                </PreviewButton>
              </PreviewCell>
            </DocumentDetails>
          </DocumentItem>
        ))}
      </DocumentList>

      {documentRanges.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#757575', 
          padding: '40px',
          border: '1px dashed #d1d5db',
          borderRadius: '8px'
        }}>
          {t('eTeczka.upload.noDocuments', 'Brak dokumentów do wyświetlenia. Wróć do poprzedniego kroku aby utworzyć zakresy dokumentów.')}
        </div>
      )}

      {/* Modal podglądu dokumentu */}
      {previewModal.isOpen && previewModal.document && (
        <ModalOverlay onClick={closePreviewModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {t('eTeczka.upload.documentPreview', 'Podgląd dokumentu')}
              </ModalTitle>
              <CloseButton onClick={closePreviewModal}>
                ×
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <DocumentInfo>
                <InfoRow>
                  <InfoLabel>{t('eTeczka.upload.documentTitle', 'Tytuł dokumentu')}:</InfoLabel>
                  <InfoValue>{previewModal.document.title}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t('eTeczka.upload.pagesCount', 'Liczba stron')}:</InfoLabel>
                  <InfoValue>
                    {previewModal.document.endPage - previewModal.document.startPage + 1} {t('eTeczka.upload.pagesCount', 'str.')}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t('eTeczka.upload.creationDate', 'Data utworzenia')}:</InfoLabel>
                  <InfoValue>
                    {new Date().toLocaleDateString('pl-PL')}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t('eTeczka.upload.documentSection', 'Sekcja')}:</InfoLabel>
                  <InfoValue>
                    {previewModal.document.section && (
                      <SectionBadge section={previewModal.document.section}>
                        {t(`eTeczka.upload.section${previewModal.document.section}`, `Część ${previewModal.document.section}`)}
                      </SectionBadge>
                    )}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{t('eTeczka.upload.documentIndex', 'Indeks dokumentu')}:</InfoLabel>
                  <InfoValue>
                    <DocumentIndex>{previewModal.document.documentIndex}</DocumentIndex>
                  </InfoValue>
                </InfoRow>
              </DocumentInfo>

              <DocumentPreviewArea>
                <div style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }}>
                  📄
                </div>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>
                  {t('eTeczka.upload.previewNotAvailable', 'Podgląd niedostępny')}
                </h4>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                  {t('eTeczka.upload.previewWillBeImplemented', 'Funkcja podglądu PDF zostanie wkrótce zaimplementowana')}
                </p>
              </DocumentPreviewArea>
            </ModalBody>

            <ModalFooter>
              <ModalButton variant="secondary" onClick={closePreviewModal}>
                {t('eTeczka.upload.close', 'Zamknij')}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};
