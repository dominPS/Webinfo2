import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Button, Container, Input } from '../../../../components/ui';
import type { UploadedFile, DocumentRange, PageData } from '../../types';

interface DocumentSplitterProps {
  uploadedFiles: UploadedFile[];
  documentRanges: DocumentRange[];
  onRangesChange: (ranges: DocumentRange[]) => void;
}

const FileSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
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
  color: #333333;
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
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

const PageItem = styled.div<{ selected: boolean; inRange: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  border: 2px solid ${props => {
    if (props.selected) return '#126678';
    if (props.inRange) return '#10b981';
    return '#e0e0e0';
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
  color: #333333;
  margin-bottom: 4px;
`;

const PageThumbnail = styled.div`
  width: 80%;
  height: 70%;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #666666;
`;

const SelectionControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  background-color: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const SectionInfo = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: rgba(18, 102, 120, 0.1);
  border: 1px solid rgba(18, 102, 120, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #126678;
  font-weight: 500;
`;

const CustomNameInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px dashed #126678;
  border-radius: 6px;
`;

const CustomInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

export const DocumentSplitter: React.FC<DocumentSplitterProps> = ({
  uploadedFiles,
  documentRanges,
  onRangesChange
}) => {
  const { t } = useTranslation();
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDocumentSection, setCustomDocumentSection] = useState<'A' | 'B' | 'C' | 'D' | 'E' | ''>('');

  // Predefiniowane typy dokumentów zgodnie z polskim prawem o aktach osobowych
  const documentTypes = [
    { value: '', label: t('eTeczka.upload.selectType', 'Wybierz typ dokumentu...'), section: undefined },
    
    // Część A - dokumenty związane z ubieganiem się o zatrudnienie
    { value: 'cv', label: t('eTeczka.upload.types.cv', 'CV / Życiorys'), section: 'A' },
    { value: 'application', label: t('eTeczka.upload.types.application', 'Podanie o zatrudnienie'), section: 'A' },
    { value: 'education_docs', label: t('eTeczka.upload.types.education_docs', 'Dokumenty wykształcenia'), section: 'A' },
    { value: 'work_experience', label: t('eTeczka.upload.types.work_experience', 'Dokumenty doświadczenia zawodowego'), section: 'A' },
    
    // Część B - dokumenty z okresu zatrudnienia
    { value: 'contract', label: t('eTeczka.upload.types.contract', 'Umowa o pracę'), section: 'B' },
    { value: 'personal_data_statement', label: t('eTeczka.upload.types.personal_data_statement', 'Oświadczenie dot. danych osobowych'), section: 'B' },
    { value: 'job_description', label: t('eTeczka.upload.types.job_description', 'Zakres czynności (obowiązków)'), section: 'B' },
    { value: 'work_regulations_confirmation', label: t('eTeczka.upload.types.work_regulations_confirmation', 'Potwierdzenie zapoznania z regulaminem pracy'), section: 'B' },
    { value: 'employment_conditions_info', label: t('eTeczka.upload.types.employment_conditions_info', 'Potwierdzenie poinformowania o warunkach zatrudnienia'), section: 'B' },
    { value: 'property_handover', label: t('eTeczka.upload.types.property_handover', 'Dokument powierzenia mienia'), section: 'B' },
    { value: 'qualifications_improvement', label: t('eTeczka.upload.types.qualifications_improvement', 'Dokumenty podnoszenia kwalifikacji'), section: 'B' },
    { value: 'safety_training', label: t('eTeczka.upload.types.safety_training', 'Przeszkolenie z przepisów BHP'), section: 'B' },
    { value: 'occupational_risk_info', label: t('eTeczka.upload.types.occupational_risk_info', 'Poinformowanie o ryzyku zawodowym'), section: 'B' },
    { value: 'monitoring_info', label: t('eTeczka.upload.types.monitoring_info', 'Informacja o monitoringu'), section: 'B' },
    { value: 'contract_change_statement', label: t('eTeczka.upload.types.contract_change_statement', 'Oświadczenie dot. zmiany warunków umowy'), section: 'B' },
    { value: 'award_document', label: t('eTeczka.upload.types.award_document', 'Dokument przyznania nagrody/wyróżnienia'), section: 'B' },
    { value: 'maternity_leave', label: t('eTeczka.upload.types.maternity_leave', 'Dokumenty urlopu macierzyńskiego/rodzicielskiego'), section: 'B' },
    { value: 'unpaid_leave', label: t('eTeczka.upload.types.unpaid_leave', 'Dokumenty urlopu bezpłatnego'), section: 'B' },
    { value: 'medical_examination', label: t('eTeczka.upload.types.medical_examination', 'Badania lekarskie (skierowania i orzeczenia)'), section: 'B' },
    { value: 'parental_rights_statement', label: t('eTeczka.upload.types.parental_rights_statement', 'Oświadczenie dot. uprawnień rodzicielskich'), section: 'B' },
    { value: 'telework_documents', label: t('eTeczka.upload.types.telework_documents', 'Dokumenty telepracy'), section: 'B' },
    { value: 'remote_work_documents', label: t('eTeczka.upload.types.remote_work_documents', 'Dokumenty pracy zdalnej'), section: 'B' },
    { value: 'contract_type_change_request', label: t('eTeczka.upload.types.contract_type_change_request', 'Wniosek o zmianę rodzaju umowy'), section: 'B' },
    { value: 'trial_period_termination_request', label: t('eTeczka.upload.types.trial_period_termination_request', 'Wniosek o wskazanie przyczyny rozwiązania umowy próbnej'), section: 'B' },
    { value: 'flexible_work_documents', label: t('eTeczka.upload.types.flexible_work_documents', 'Dokumenty elastycznej organizacji pracy'), section: 'B' },
    
    // Część C - dokumenty po zakończeniu zatrudnienia
    { value: 'termination_notice', label: t('eTeczka.upload.types.termination_notice', 'Oświadczenie o wypowiedzeniu/rozwiązaniu umowy'), section: 'C' },
    { value: 'work_certificate_request', label: t('eTeczka.upload.types.work_certificate_request', 'Oświadczenie dot. żądania świadectwa pracy'), section: 'C' },
    { value: 'work_certificate_copy', label: t('eTeczka.upload.types.work_certificate_copy', 'Kopia świadectwa pracy'), section: 'C' },
    { value: 'wage_garnishment_confirmation', label: t('eTeczka.upload.types.wage_garnishment_confirmation', 'Potwierdzenie zajęcia wynagrodzenia'), section: 'C' },
    { value: 'non_compete_agreement', label: t('eTeczka.upload.types.non_compete_agreement', 'Umowa o zakazie konkurencji'), section: 'C' },
    { value: 'vacation_compensation_documents', label: t('eTeczka.upload.types.vacation_compensation_documents', 'Dokumenty ekwiwalentu za urlop'), section: 'C' },
    
    // Część D - dokumenty dyscyplinarne
    { value: 'disciplinary_notice', label: t('eTeczka.upload.types.disciplinary_notice', 'Odpis zawiadomienia o ukaraniu'), section: 'D' },
    { value: 'disciplinary_documents', label: t('eTeczka.upload.types.disciplinary_documents', 'Dokumenty odpowiedzialności porządkowej'), section: 'D' },
    
    // Część E - kontrola trzeźwości
    { value: 'sobriety_control_employer', label: t('eTeczka.upload.types.sobriety_control_employer', 'Kontrola trzeźwości przez pracodawcę'), section: 'E' },
    { value: 'sobriety_control_authority', label: t('eTeczka.upload.types.sobriety_control_authority', 'Badanie trzeźwości przez organ publiczny'), section: 'E' },
    { value: 'substance_control_employer', label: t('eTeczka.upload.types.substance_control_employer', 'Kontrola środków odurzających przez pracodawcę'), section: 'E' },
    { value: 'substance_control_authority', label: t('eTeczka.upload.types.substance_control_authority', 'Badanie środków odurzających przez organ publiczny'), section: 'E' },
    
    { value: 'other', label: t('eTeczka.upload.types.other', 'Inne'), section: undefined }
  ];

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
    if (value === 'other') {
      setShowCustomInput(true);
      setCustomDocumentName('');
      setCustomDocumentSection('');
    } else {
      setShowCustomInput(false);
      setCustomDocumentName('');
      setCustomDocumentSection('');
    }
  };

  const getDocumentSection = (documentType: string): 'A' | 'B' | 'C' | 'D' | 'E' | undefined => {
    if (documentType === 'other') {
      return customDocumentSection || undefined;
    }
    
    switch (documentType) {
      // Część A - dokumenty związane z ubieganiem się o zatrudnienie
      case 'cv':
      case 'application':
      case 'education_docs':
      case 'work_experience':
        return 'A';
        
      // Część B - dokumenty z okresu zatrudnienia
      case 'contract':
      case 'personal_data_statement':
      case 'job_description':
      case 'work_regulations_confirmation':
      case 'employment_conditions_info':
      case 'property_handover':
      case 'qualifications_improvement':
      case 'safety_training':
      case 'occupational_risk_info':
      case 'monitoring_info':
      case 'contract_change_statement':
      case 'award_document':
      case 'maternity_leave':
      case 'unpaid_leave':
      case 'medical_examination':
      case 'parental_rights_statement':
      case 'telework_documents':
      case 'remote_work_documents':
      case 'contract_type_change_request':
      case 'trial_period_termination_request':
      case 'flexible_work_documents':
        return 'B';
        
      // Część C - dokumenty po zakończeniu zatrudnienia
      case 'termination_notice':
      case 'work_certificate_request':
      case 'work_certificate_copy':
      case 'wage_garnishment_confirmation':
      case 'non_compete_agreement':
      case 'vacation_compensation_documents':
        return 'C';
        
      // Część D - dokumenty dyscyplinarne
      case 'disciplinary_notice':
      case 'disciplinary_documents':
        return 'D';
        
      // Część E - kontrola trzeźwości
      case 'sobriety_control_employer':
      case 'sobriety_control_authority':
      case 'substance_control_employer':
      case 'substance_control_authority':
        return 'E';
        
      default:
        return undefined;
    }
  };

  const getDocumentTitle = () => {
    if (selectedDocumentType === 'other' && customDocumentName.trim() && customDocumentSection) {
      return customDocumentName.trim();
    } else if (selectedDocumentType && selectedDocumentType !== 'other') {
      const selectedType = documentTypes.find(type => type.value === selectedDocumentType);
      return selectedType?.label || '';
    }
    return '';
  };

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
    const documentTitle = getDocumentTitle();
    if (selectedPages.size === 0 || !documentTitle) return;

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

    const newRange: DocumentRange = {
      id: `range_${Date.now()}`,
      startPage,
      endPage,
      title: documentTitle,
      documentType: selectedDocumentType !== 'other' ? selectedDocumentType : undefined,
      section: getDocumentSection(selectedDocumentType)
    };

    onRangesChange([...documentRanges, newRange]);
    setSelectedPages(new Set());
    setSelectedDocumentType('');
    setCustomDocumentName('');
    setCustomDocumentSection('');
    setShowCustomInput(false);
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
            <div>
              <Select
                value={selectedDocumentType}
                onChange={(e) => handleDocumentTypeChange(e.target.value)}
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.section ? `[${type.section}] ${type.label}` : type.label}
                  </option>
                ))}
              </Select>
              {selectedDocumentType && selectedDocumentType !== 'other' && (
                <SectionInfo>
                  {(() => {
                    const selectedType = documentTypes.find(type => type.value === selectedDocumentType);
                    const section = selectedType?.section;
                    if (section) {
                      const sectionNames = {
                        A: t('eTeczka.upload.sections.A', 'Część A - Dokumenty związane z zatrudnieniem'),
                        B: t('eTeczka.upload.sections.B', 'Część B - Dokumenty z okresu zatrudnienia'),
                        C: t('eTeczka.upload.sections.C', 'Część C - Dokumenty po rozwiązaniu stosunku pracy'),
                        D: t('eTeczka.upload.sections.D', 'Część D - Dokumenty ubezpieczeniowe'),
                        E: t('eTeczka.upload.sections.E', 'Część E - Dokumenty osobowe')
                      };
                      return `📂 ${t('eTeczka.upload.willBeStoredIn', 'Zostanie zapisane w:')} ${sectionNames[section as keyof typeof sectionNames]}`;
                    }
                    return '';
                  })()}
                </SectionInfo>
              )}
            </div>
            {showCustomInput && (
              <CustomNameInput>
                <div style={{ fontWeight: 500, fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                  {t('eTeczka.upload.customDocumentSetup', 'Konfiguracja niestandardowego dokumentu:')}
                </div>
                <CustomInputRow>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder={t('eTeczka.upload.customDocumentName', 'Wprowadź nazwę dokumentu...')}
                      value={customDocumentName}
                      onChange={(e) => setCustomDocumentName(e.target.value)}
                    />
                  </div>
                  <Select
                    value={customDocumentSection}
                    onChange={(e) => setCustomDocumentSection(e.target.value as 'A' | 'B' | 'C' | 'D' | 'E')}
                    style={{ minWidth: '250px' }}
                  >
                    <option value="">{t('eTeczka.upload.selectSection', 'Wybierz część akt...')}</option>
                    <option value="A">{t('eTeczka.upload.sections.A', 'Część A - Dokumenty związane z zatrudnieniem')}</option>
                    <option value="B">{t('eTeczka.upload.sections.B', 'Część B - Dokumenty z okresu zatrudnienia')}</option>
                    <option value="C">{t('eTeczka.upload.sections.C', 'Część C - Dokumenty po rozwiązaniu stosunku pracy')}</option>
                    <option value="D">{t('eTeczka.upload.sections.D', 'Część D - Dokumenty ubezpieczeniowe')}</option>
                    <option value="E">{t('eTeczka.upload.sections.E', 'Część E - Dokumenty osobowe')}</option>
                  </Select>
                </CustomInputRow>
                {customDocumentName.trim() && customDocumentSection && (
                  <SectionInfo>
                    ✅ {t('eTeczka.upload.customDocumentPreview', 'Dokument będzie zapisany jako:')} 
                    <strong> "{customDocumentName.trim()}"</strong> 
                    {t('eTeczka.upload.inSection', ' w części')} <strong>{customDocumentSection}</strong>
                  </SectionInfo>
                )}
              </CustomNameInput>
            )}
            <Button
              variant="primary"
              onClick={createRange}
              disabled={selectedPages.size === 0 || !getDocumentTitle()}
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
                  {range.section && (
                    <div style={{ fontSize: '12px', color: '#126678', marginTop: '4px' }}>
                      {t('eTeczka.upload.section', 'Część akt:')} {range.section}
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
