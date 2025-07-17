import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { UploadedFile, DocumentRange, PageData } from '../../types';

interface DocumentSplitterProps {
  uploadedFiles: UploadedFile[];
  documentRanges: DocumentRange[];
  onRangesChange: (ranges: DocumentRange[]) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FileSection = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  background-color: ${props => props.theme.colors.surface};
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`;

const FileName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const PageItem = styled.div<{ selected: boolean; inRange: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  border: 2px solid ${props => {
    if (props.selected) return '#126678';
    if (props.inRange) return '#10b981';
    return props.theme.colors.border;
  }};
  border-radius: 6px;
  background-color: ${props => {
    if (props.selected) return 'rgba(18, 102, 120, 0.1)';
    if (props.inRange) return 'rgba(16, 185, 129, 0.1)';
    return '#f9fafb';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: #126678;
    box-shadow: 0 2px 8px rgba(18, 102, 120, 0.15);
  }
`;

const PageNumber = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const PageThumbnail = styled.div`
  width: 80%;
  height: 70%;
  background-color: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${props => props.theme.colors.text.secondary};
`;

const SelectionControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background-color: #126678;
        color: white;
        
        &:hover {
          background-color: #0f5459;
        }
        
        &:disabled {
          background-color: ${props.theme.colors.border};
          color: ${props.theme.colors.text.secondary};
          cursor: not-allowed;
        }
      `;
    }
    return `
      background-color: transparent;
      color: #126678;
      border: 1px solid #126678;
      
      &:hover {
        background-color: #126678;
        color: white;
      }
      
      &:disabled {
        border-color: ${props.theme.colors.border};
        color: ${props.theme.colors.text.secondary};
        cursor: not-allowed;
      }
    `;
  }}
`;

const RangeInput = styled.input`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 13px;
  width: 120px;
  
  &:focus {
    outline: none;
    border-color: #126678;
  }
`;

const RangesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RangeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(16, 185, 129, 0.05);
  border: 1px solid #10b981;
  border-radius: 6px;
`;

const RangeInfo = styled.div`
  flex: 1;
  font-size: 14px;
`;

const RemoveRangeButton = styled.button`
  padding: 4px 8px;
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #dc2626;
    color: white;
  }
`;

export const DocumentSplitter: React.FC<DocumentSplitterProps> = ({
  uploadedFiles,
  documentRanges,
  onRangesChange
}) => {
  const { t } = useTranslation();
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [rangeTitle, setRangeTitle] = useState('');

  const handlePageSelect = (pageId: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const isPageInRange = (pageId: string) => {
    return documentRanges.some(range => {
      const file = uploadedFiles.find(f => f.pages.some(p => p.id === pageId));
      if (!file) return false;
      const page = file.pages.find(p => p.id === pageId);
      if (!page) return false;
      return page.pageNumber >= range.startPage && page.pageNumber <= range.endPage;
    });
  };

  const createRange = () => {
    if (selectedPages.size === 0 || !rangeTitle.trim()) return;

    // Znajdź strony i posortuj po numerach
    const selectedPageData: { page: PageData; fileId: string }[] = [];
    
    uploadedFiles.forEach(file => {
      file.pages.forEach(page => {
        if (selectedPages.has(page.id)) {
          selectedPageData.push({ page, fileId: file.id });
        }
      });
    });

    selectedPageData.sort((a, b) => a.page.pageNumber - b.page.pageNumber);

    if (selectedPageData.length === 0) return;

    const startPage = selectedPageData[0].page.pageNumber;
    const endPage = selectedPageData[selectedPageData.length - 1].page.pageNumber;

    // Prosta analiza OCR dla sugestii kategorii
    const combinedText = selectedPageData
      .map(item => item.page.ocrText || '')
      .join(' ')
      .toLowerCase();

    let suggestedCategory = '';
    if (combinedText.includes('umowa') || combinedText.includes('contract')) {
      suggestedCategory = 'Umowa o pracę';
    } else if (combinedText.includes('rodo') || combinedText.includes('gdpr')) {
      suggestedCategory = 'Oświadczenie RODO';
    } else if (combinedText.includes('badanie') || combinedText.includes('lekarz')) {
      suggestedCategory = 'Badania lekarskie';
    } else if (combinedText.includes('certyfikat') || combinedText.includes('certificate')) {
      suggestedCategory = 'Certyfikaty';
    }

    const newRange: DocumentRange = {
      id: `range_${Date.now()}`,
      startPage,
      endPage,
      title: rangeTitle.trim(),
      suggestedCategory
    };

    onRangesChange([...documentRanges, newRange]);
    setSelectedPages(new Set());
    setRangeTitle('');
  };

  const removeRange = (rangeId: string) => {
    onRangesChange(documentRanges.filter(range => range.id !== rangeId));
  };

  const selectAllPages = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const newSelected = new Set(selectedPages);
    file.pages.forEach(page => newSelected.add(page.id));
    setSelectedPages(newSelected);
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
  };

  return (
    <Container>
      <h3>{t('eTeczka.upload.splitDocuments', 'Podziel dokumenty na zakresy stron')}</h3>
      <p style={{ color: '#757575', fontSize: '14px', margin: '0 0 20px 0' }}>
        {t('eTeczka.upload.splitInstructions', 'Zaznacz strony należące do jednego dokumentu i nadaj mu nazwę. Możesz tworzyć wiele zakresów.')}
      </p>

      {uploadedFiles.map(file => (
        <FileSection key={file.id}>
          <FileHeader>
            <FileName>{file.file.name}</FileName>
          </FileHeader>

          <SelectionControls>
            <Button
              variant="secondary"
              onClick={() => selectAllPages(file.id)}
            >
              {t('eTeczka.upload.selectAll', 'Zaznacz wszystkie')}
            </Button>
            <Button
              variant="secondary"
              onClick={clearSelection}
            >
              {t('eTeczka.upload.clearSelection', 'Wyczyść zaznaczenie')}
            </Button>
            <RangeInput
              placeholder={t('eTeczka.upload.documentTitle', 'Nazwa dokumentu...')}
              value={rangeTitle}
              onChange={(e) => setRangeTitle(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={createRange}
              disabled={selectedPages.size === 0 || !rangeTitle.trim()}
            >
              {t('eTeczka.upload.createRange', 'Utwórz zakres')}
            </Button>
          </SelectionControls>

          <PageGrid>
            {file.pages.map(page => (
              <PageItem
                key={page.id}
                selected={selectedPages.has(page.id)}
                inRange={isPageInRange(page.id)}
                onClick={() => handlePageSelect(page.id)}
              >
                <PageNumber>{t('eTeczka.upload.page', 'Str.')} {page.pageNumber}</PageNumber>
                <PageThumbnail>
                  {/* W prawdziwej aplikacji tutaj byłaby miniatura */}
                  📄
                </PageThumbnail>
              </PageItem>
            ))}
          </PageGrid>
        </FileSection>
      ))}

      {documentRanges.length > 0 && (
        <div>
          <h4>{t('eTeczka.upload.createdRanges', 'Utworzone zakresy dokumentów:')}</h4>
          <RangesList>
            {documentRanges.map(range => (
              <RangeItem key={range.id}>
                <RangeInfo>
                  <strong>{range.title}</strong> 
                  {' '} ({t('eTeczka.upload.pages', 'Strony')} {range.startPage}-{range.endPage})
                  {range.suggestedCategory && (
                    <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                      {t('eTeczka.upload.suggested', 'Sugerowana kategoria:')} {range.suggestedCategory}
                    </div>
                  )}
                </RangeInfo>
                <RemoveRangeButton onClick={() => removeRange(range.id)}>
                  {t('eTeczka.upload.remove', 'Usuń')}
                </RemoveRangeButton>
              </RangeItem>
            ))}
          </RangesList>
        </div>
      )}
    </Container>
  );
};
