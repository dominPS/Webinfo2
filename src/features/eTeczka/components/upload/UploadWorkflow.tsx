import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { EmployeeSelector } from './EmployeeSelector';
import { FileUpload } from './FileUpload';
import { DocumentSplitter } from './DocumentSplitter';
import { CategoryAssignment } from './CategoryAssignment';
import { FinalPreview } from './FinalPreview';

export type UploadStep = 'employee' | 'upload' | 'split' | 'category' | 'preview';

export interface UploadedFile {
  id: string;
  file: File;
  pages: PageData[];
  processing: boolean;
}

export interface PageData {
  id: string;
  pageNumber: number;
  thumbnail: string;
  ocrText?: string;
}

export interface DocumentRange {
  id: string;
  startPage: number;
  endPage: number;
  title: string;
  suggestedCategory?: string;
  confirmedCategory?: string;
  documentType?: string;
  section?: 'A' | 'B' | 'C' | 'D' | 'E';
  date?: string;
  retentionPeriod?: string;
  notes?: string;
}

export interface SelectedEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
}

const Container = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  min-height: calc(100vh - 200px);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin: 0 0 8px 0;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  gap: 16px;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => {
    if (props.completed) {
      return `
        background-color: #d1fae5;
        color: #065f46;
      `;
    }
    if (props.active) {
      return `
        background-color: #126678;
        color: white;
      `;
    }
    return `
      background-color: ${props.theme.colors.border};
      color: ${props.theme.colors.text.secondary};
    `;
  }}
`;

const StepNumber = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const ContentArea = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 16px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 14px;
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
          transform: translateY(-1px);
        }
        
        &:disabled {
          background-color: ${props.theme.colors.border};
          color: ${props.theme.colors.text.secondary};
          cursor: not-allowed;
          transform: none;
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
    `;
  }}
`;

export const UploadWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<UploadStep>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentRanges, setDocumentRanges] = useState<DocumentRange[]>([]);

  const steps = [
    { key: 'employee', label: t('eTeczka.upload.steps.employee', 'Wybierz pracownika'), number: 1 },
    { key: 'upload', label: t('eTeczka.upload.steps.upload', 'Wgraj pliki'), number: 2 },
    { key: 'split', label: t('eTeczka.upload.steps.split', 'Podziel dokumenty'), number: 3 },
    { key: 'category', label: t('eTeczka.upload.steps.category', 'Przypisz kategorie'), number: 4 },
    { key: 'preview', label: t('eTeczka.upload.steps.preview', 'Podgląd i zapis'), number: 5 }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep);
  
  const canProceedToNext = () => {
    switch (currentStep) {
      case 'employee':
        return selectedEmployee !== null;
      case 'upload':
        return uploadedFiles.length > 0 && uploadedFiles.every(file => !file.processing);
      case 'split':
        return documentRanges.length > 0;
      case 'category':
        return documentRanges.every(range => range.confirmedCategory);
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key as UploadStep);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key as UploadStep);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'employee':
        return (
          <EmployeeSelector
            selectedEmployee={selectedEmployee}
            onEmployeeSelect={setSelectedEmployee}
          />
        );
      case 'upload':
        return (
          <FileUpload
            uploadedFiles={uploadedFiles}
            onFilesUpload={setUploadedFiles}
          />
        );
      case 'split':
        return (
          <DocumentSplitter
            uploadedFiles={uploadedFiles}
            documentRanges={documentRanges}
            onRangesChange={setDocumentRanges}
          />
        );
      case 'category':
        return (
          <CategoryAssignment
            documentRanges={documentRanges}
            onRangesChange={setDocumentRanges}
          />
        );
      case 'preview':
        return (
          <FinalPreview
            selectedEmployee={selectedEmployee}
            documentRanges={documentRanges}
            uploadedFiles={uploadedFiles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>{t('eTeczka.upload.title', 'Dodaj dokumenty do e-Teczki')}</Title>
      </Header>

      <StepIndicator>
        {steps.map((step, index) => (
          <Step
            key={step.key}
            active={step.key === currentStep}
            completed={getCurrentStepIndex() > index}
          >
            <StepNumber>{step.number}</StepNumber>
            {step.label}
          </Step>
        ))}
      </StepIndicator>

      <ContentArea>
        {renderStepContent()}
      </ContentArea>

      <NavigationButtons>
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={getCurrentStepIndex() === 0}
        >
          {t('eTeczka.upload.previous', 'Poprzedni')}
        </Button>
        
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canProceedToNext() || getCurrentStepIndex() === steps.length - 1}
        >
          {currentStep === 'preview' 
            ? t('eTeczka.upload.save', 'Zapisz dokumenty')
            : t('eTeczka.upload.next', 'Następny')
          }
        </Button>
      </NavigationButtons>
    </Container>
  );
};
