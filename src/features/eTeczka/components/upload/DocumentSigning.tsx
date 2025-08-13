import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DocumentRange } from '../../types';

interface DocumentSigningProps {
  documentRanges: DocumentRange[];
  employeeName: string;
  onSign: (signatureData: SignatureData) => void;
  onBack: () => void;
}

interface SignatureData {
  certificateId: string;
  timestamp: Date;
  signatureMethod: 'qualified' | 'trusted';
  documents: DocumentRange[];
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #126678 0%, #0f5a6b 100%);
  color: white;
  border-radius: 12px;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
`;

const SigningSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StepCard = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  padding: 24px;
  border-radius: 12px;
  border: 2px solid ${props => 
    props.isCompleted ? '#10b981' : 
    props.isActive ? '#126678' : '#e5e7eb'
  };
  background-color: ${props => 
    props.isCompleted ? '#f0fdf4' : 
    props.isActive ? '#f8fafc' : '#ffffff'
  };
  transition: all 0.3s ease;
`;

const StepNumber = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 16px;
  background-color: ${props => 
    props.isCompleted ? '#10b981' : 
    props.isActive ? '#126678' : '#e5e7eb'
  };
  color: ${props => 
    props.isCompleted || props.isActive ? 'white' : '#6b7280'
  };
`;

const StepTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #111827;
`;

const StepDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const DocumentsSummary = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const SummaryNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #126678;
  margin-bottom: 8px;
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const CertificateSelection = styled.div`
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const CertificateOption = styled.div<{ isSelected: boolean }>`
  padding: 16px;
  border: 2px solid ${props => props.isSelected ? '#126678' : '#e5e7eb'};
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? '#f8fafc' : 'white'};

  &:hover {
    border-color: #126678;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CertificateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CertificateIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #126678;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const CertificateDetails = styled.div`
  flex: 1;
`;

const CertificateName = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const CertificateDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const SigningArea = styled.div`
  background-color: white;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
`;

const SigningIcon = styled.div`
  font-size: 64px;
  color: #126678;
  margin-bottom: 16px;
`;

const SigningButton = styled.button<{ isLoading?: boolean }>`
  background: linear-gradient(135deg, #126678 0%, #0f5a6b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 16px 8px;
  min-width: 200px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(18, 102, 120, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.isLoading && `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -10px;
      border: 2px solid transparent;
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 1s ease infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

const BackButton = styled.button`
  background-color: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
`;

const WarningBox = styled.div`
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`;

const WarningText = styled.p`
  margin: 0;
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
`;

const ChecklistItem = styled.div<{ isChecked: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: ${props => props.isChecked ? '#f0fdf4' : '#f9fafb'};
  border: 1px solid ${props => props.isChecked ? '#10b981' : '#e5e7eb'};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ChecklistText = styled.label`
  flex: 1;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

export const DocumentSigning: React.FC<DocumentSigningProps> = ({
  documentRanges,
  employeeName,
  onSign,
  onBack
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [isSigning, setIsSigning] = useState(false);
  const [checklist, setChecklist] = useState({
    documentsVerified: false,
    legalCompliance: false,
    employeeConsent: false,
    dataProtection: false
  });

  const totalDocuments = documentRanges.length;
  const totalPages = documentRanges.reduce((sum, doc) => sum + (doc.endPage - doc.startPage + 1), 0);
  const sectionStats = documentRanges.reduce((acc, doc) => {
    if (doc.section) {
      acc[doc.section] = (acc[doc.section] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const isChecklistComplete = Object.values(checklist).every(Boolean);
  const canProceedToSigning = selectedCertificate && isChecklistComplete;

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSign = async () => {
    if (!canProceedToSigning) return;

    setIsSigning(true);
    setCurrentStep(3);

    // Symulacja procesu podpisywania
    setTimeout(() => {
      const signatureData: SignatureData = {
        certificateId: selectedCertificate,
        timestamp: new Date(),
        signatureMethod: 'qualified',
        documents: documentRanges
      };
      
      onSign(signatureData);
      setIsSigning(false);
    }, 3000);
  };

  const handleFinish = () => {
    navigate('/e-teczka');
  };

  const steps = [
    {
      number: 1,
      title: t('eTeczka.signing.verification', 'Weryfikacja'),
      description: t('eTeczka.signing.verificationDesc', 'Sprawdzenie dokumentów i zgodności')
    },
    {
      number: 2,
      title: t('eTeczka.signing.certificate', 'Certyfikat'),
      description: t('eTeczka.signing.certificateDesc', 'Wybór certyfikatu kwalifikowanego')
    },
    {
      number: 3,
      title: t('eTeczka.signing.signing', 'Podpisywanie'),
      description: t('eTeczka.signing.signingDesc', 'Podpisanie dokumentów')
    }
  ];

  return (
    <Container>
      <Header>
        <Title>{t('eTeczka.signing.title', 'Podpisywanie dokumentów')}</Title>
        <Subtitle>
          {t('eTeczka.signing.subtitle', 'Podpisz dokumenty podpisem kwalifikowanym dla pracownika:')} <strong>{employeeName}</strong>
        </Subtitle>
      </Header>

      {/* Kroki procesu */}
      <SigningSteps>
        {steps.map((step) => (
          <StepCard 
            key={step.number}
            isActive={currentStep === step.number}
            isCompleted={currentStep > step.number}
          >
            <StepNumber 
              isActive={currentStep === step.number}
              isCompleted={currentStep > step.number}
            >
              {currentStep > step.number ? '✓' : step.number}
            </StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepCard>
        ))}
      </SigningSteps>

      {/* Podsumowanie dokumentów */}
      <DocumentsSummary>
        <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>
          {t('eTeczka.signing.documentsSummary', 'Podsumowanie dokumentów')}
        </h3>
        <SummaryGrid>
          <SummaryItem>
            <SummaryNumber>{totalDocuments}</SummaryNumber>
            <SummaryLabel>{t('eTeczka.signing.documentsCount', 'Dokumentów')}</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>{totalPages}</SummaryNumber>
            <SummaryLabel>{t('eTeczka.signing.pagesCount', 'Stron')}</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>{Object.keys(sectionStats).length}</SummaryNumber>
            <SummaryLabel>{t('eTeczka.signing.sectionsCount', 'Sekcji')}</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryNumber>1</SummaryNumber>
            <SummaryLabel>{t('eTeczka.signing.employeeCount', 'Pracownik')}</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
      </DocumentsSummary>

      {/* Krok 1: Weryfikacja */}
      {currentStep === 1 && (
        <div>
          <WarningBox>
            <WarningText>
              {t('eTeczka.signing.legalWarning', 'Podpis kwalifikowany ma moc prawną równoważną podpisowi własnoręcznemu. Upewnij się, że wszystkie dokumenty zostały zweryfikowane pod kątem poprawności i zgodności z przepisami prawa.')}
            </WarningText>
          </WarningBox>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ margin: '0 0 20px 0', color: '#111827' }}>
              {t('eTeczka.signing.verificationChecklist', 'Lista kontrolna weryfikacji')}
            </h4>

            <ChecklistItem isChecked={checklist.documentsVerified}>
              <Checkbox
                type="checkbox"
                checked={checklist.documentsVerified}
                onChange={() => handleChecklistChange('documentsVerified')}
                id="documentsVerified"
              />
              <ChecklistText htmlFor="documentsVerified">
                {t('eTeczka.signing.documentsVerifiedCheck', 'Zweryfikowałem poprawność wszystkich dokumentów i ich przypisania do odpowiednich sekcji akt osobowych')}
              </ChecklistText>
            </ChecklistItem>

            <ChecklistItem isChecked={checklist.legalCompliance}>
              <Checkbox
                type="checkbox"
                checked={checklist.legalCompliance}
                onChange={() => handleChecklistChange('legalCompliance')}
                id="legalCompliance"
              />
              <ChecklistText htmlFor="legalCompliance">
                {t('eTeczka.signing.legalComplianceCheck', 'Potwierdzam zgodność dokumentów z przepisami Kodeksu pracy oraz ustawy o ochronie danych osobowych')}
              </ChecklistText>
            </ChecklistItem>

            <ChecklistItem isChecked={checklist.employeeConsent}>
              <Checkbox
                type="checkbox"
                checked={checklist.employeeConsent}
                onChange={() => handleChecklistChange('employeeConsent')}
                id="employeeConsent"
              />
              <ChecklistText htmlFor="employeeConsent">
                {t('eTeczka.signing.employeeConsentCheck', 'Pracownik wyraził zgodę na przetwarzanie danych osobowych zawartych w dokumentach')}
              </ChecklistText>
            </ChecklistItem>

            <ChecklistItem isChecked={checklist.dataProtection}>
              <Checkbox
                type="checkbox"
                checked={checklist.dataProtection}
                onChange={() => handleChecklistChange('dataProtection')}
                id="dataProtection"
              />
              <ChecklistText htmlFor="dataProtection">
                {t('eTeczka.signing.dataProtectionCheck', 'Dokumenty będą przechowywane zgodnie z polityką retencji danych i zabezpieczone przed dostępem osób nieuprawnionych')}
              </ChecklistText>
            </ChecklistItem>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <BackButton onClick={onBack}>
              {t('eTeczka.signing.back', 'Powrót')}
            </BackButton>
            <SigningButton 
              onClick={() => setCurrentStep(2)}
              disabled={!isChecklistComplete}
            >
              {t('eTeczka.signing.nextToCertificate', 'Przejdź do wyboru certyfikatu')}
            </SigningButton>
          </div>
        </div>
      )}

      {/* Krok 2: Wybór certyfikatu */}
      {currentStep === 2 && (
        <div>
          <CertificateSelection>
            <h4 style={{ margin: '0 0 20px 0', color: '#111827' }}>
              {t('eTeczka.signing.selectCertificate', 'Wybierz certyfikat kwalifikowany')}
            </h4>

            <CertificateOption 
              isSelected={selectedCertificate === 'cert1'}
              onClick={() => setSelectedCertificate('cert1')}
            >
              <CertificateInfo>
                <CertificateIcon>🔐</CertificateIcon>
                <CertificateDetails>
                  <CertificateName>
                    {t('eTeczka.signing.personalCertificate', 'Certyfikat osobisty - Jan Kowalski')}
                  </CertificateName>
                  <CertificateDescription>
                    {t('eTeczka.signing.personalCertDesc', 'Ważny do: 15.08.2026 | Wystawca: KIR S.A.')}
                  </CertificateDescription>
                </CertificateDetails>
              </CertificateInfo>
            </CertificateOption>

            <CertificateOption 
              isSelected={selectedCertificate === 'cert2'}
              onClick={() => setSelectedCertificate('cert2')}
            >
              <CertificateInfo>
                <CertificateIcon>🏢</CertificateIcon>
                <CertificateDetails>
                  <CertificateName>
                    {t('eTeczka.signing.companyCertificate', 'Certyfikat firmowy - WebInfo Sp. z o.o.')}
                  </CertificateName>
                  <CertificateDescription>
                    {t('eTeczka.signing.companyCertDesc', 'Ważny do: 22.12.2025 | Wystawca: Certum')}
                  </CertificateDescription>
                </CertificateDetails>
              </CertificateInfo>
            </CertificateOption>
          </CertificateSelection>

          <div style={{ textAlign: 'center' }}>
            <BackButton onClick={() => setCurrentStep(1)}>
              {t('eTeczka.signing.backToVerification', 'Powrót do weryfikacji')}
            </BackButton>
            <SigningButton 
              onClick={handleSign}
              disabled={!selectedCertificate}
            >
              {t('eTeczka.signing.startSigning', 'Rozpocznij podpisywanie')}
            </SigningButton>
          </div>
        </div>
      )}

      {/* Krok 3: Podpisywanie */}
      {currentStep === 3 && (
        <SigningArea>
          <SigningIcon>
            {isSigning ? '⏳' : '✅'}
          </SigningIcon>
          <h3 style={{ margin: '0 0 16px 0', color: '#111827' }}>
            {isSigning 
              ? t('eTeczka.signing.signingInProgress', 'Podpisywanie w toku...')
              : t('eTeczka.signing.signingComplete', 'Podpisywanie zakończone')
            }
          </h3>
          <p style={{ margin: '0 0 24px 0', color: '#6b7280' }}>
            {isSigning 
              ? t('eTeczka.signing.pleaseWait', 'Proszę czekać, dokumenty są podpisywane podpisem kwalifikowanym')
              : t('eTeczka.signing.documentsSignedSuccessfully', 'Wszystkie dokumenty zostały pomyślnie podpisane i zapisane w e-Teczce')
            }
          </p>
          
          {isSigning ? (
            <SigningButton isLoading disabled>
              {t('eTeczka.signing.signing', 'Podpisywanie...')}
            </SigningButton>
          ) : (
            <SigningButton onClick={handleFinish}>
              {t('eTeczka.signing.finish', 'Zakończ')}
            </SigningButton>
          )}
        </SigningArea>
      )}
    </Container>
  );
};
