import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Button, Container } from '../../../../components/ui';
import type { UploadStep, UploadedFile, DocumentRange, SelectedEmployee } from '../../types';
import { EmployeeSelector } from './EmployeeSelector';
import { FileUpload } from './FileUpload';
import { DocumentSplitter } from './DocumentSplitter';
import { CategoryAssignment } from './CategoryAssignment';
import { FinalPreview } from './FinalPreview';

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: #126678;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 24px;
  margin: 24px 0;
  padding: 0 12px;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => 
    props.active ? '#126678' : 
    props.completed ? '#e8f4f8' : 
    '#f5f5f5'
  };
  color: ${props => 
    props.active ? 'white' : 
    props.completed ? '#126678' : 
    '#666'
  };
  font-weight: ${props => props.active ? '600' : '500'};
  transition: all 0.3s ease;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  min-height: 400px;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const UploadWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<UploadStep>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentRanges, setDocumentRanges] = useState<DocumentRange[]>([]);

  const steps = [
    { key: 'employee', label: t('eTeczka.upload.selectEmployee', 'Wybór pracownika') },
    { key: 'upload', label: t('eTeczka.upload.uploadFiles', 'Upload plików') },
    { key: 'split', label: t('eTeczka.upload.splitDocuments', 'Podział dokumentów') },
    { key: 'category', label: t('eTeczka.upload.assignCategories', 'Przypisanie kategorii') },
    { key: 'preview', label: t('eTeczka.upload.preview', 'Podgląd') },
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep);

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'employee':
        return selectedEmployee !== null;
      case 'upload':
        return uploadedFiles.length > 0;
      case 'split':
        return documentRanges.length > 0;
      case 'category':
        return documentRanges.every(range => range.confirmedCategory);
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1 && canProceedToNext()) {
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
        return <div>Nieznany krok</div>;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          {t('eTeczka.upload.title', 'Upload dokumentów do e-teczki')}
        </Title>
        
        <StepIndicator>
          {steps.map((step, index) => (
            <Step
              key={step.key}
              active={step.key === currentStep}
              completed={getCurrentStepIndex() > index}
            >
              {step.label}
            </Step>
          ))}
        </StepIndicator>
      </Header>

      <ContentArea>
        {renderStepContent()}
      </ContentArea>

      <NavigationButtons>
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={getCurrentStepIndex() === 0}
        >
          {t('eTeczka.upload.previous', 'Poprzedni')}
        </Button>

        <Button
          variant="primary"
          onClick={currentStep === 'preview' ? () => console.log('Zapisywanie...') : handleNext}
          disabled={!canProceedToNext()}
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
