import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Button, Card, Container } from '../../components/ui';
import { UploadWorkflow } from './components/upload/UploadWorkflow';

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #126678;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
  margin: 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

export const ETeczkaPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'documents',
      title: t('eTeczka.documents.title', 'Dokumenty osobowe'),
      description: t('eTeczka.documents.description', 'Zarządzaj dokumentami osobowymi pracowników - CV, umowy, certyfikaty'),
      action: () => setSelectedSection('documents')
    },
    {
      id: 'folders',
      title: t('eTeczka.folders.title', 'Teczki pracowników'),
      description: t('eTeczka.folders.description', 'Przeglądaj i organizuj teczki osobowe wszystkich pracowników'),
      action: () => setSelectedSection('folders')
    },
    {
      id: 'upload',
      title: t('eTeczka.upload.title', 'Dodaj dokumenty'),
      description: t('eTeczka.upload.description', 'Przesyłaj nowe dokumenty i załączniki do teczek pracowników'),
      action: () => setSelectedSection('upload')
    },
    {
      id: 'search',
      title: t('eTeczka.search.title', 'Wyszukaj dokumenty'),
      description: t('eTeczka.search.description', 'Szybko znajdź dokumenty używając zaawansowanych filtrów'),
      action: () => setSelectedSection('search')
    }
  ];

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'upload':
        return <UploadWorkflow />;
      case 'documents':
      case 'folders':
      case 'search':
        return (
          <Card padding="large">
            <CardTitle>
              {t(`eTeczka.${selectedSection}.title`, 'Wybrana sekcja')}
            </CardTitle>
            <CardDescription>
              {t('eTeczka.comingSoon', 'Ta funkcjonalność zostanie wkrótce wdrożona.')}
            </CardDescription>
            <Button onClick={() => setSelectedSection(null)}>
              {t('eTeczka.back', 'Powrót')}
            </Button>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>{t('eTeczka.title', 'e-Teczka')}</Title>
        <Subtitle>
          {t('eTeczka.subtitle', 'Elektroniczny system zarządzania dokumentami pracowniczymi')}
        </Subtitle>
      </Header>

      <ContentGrid>
        {sections.map((section) => (
          <Card key={section.id} hoverable onClick={section.action}>
            <CardTitle>
              {section.title}
            </CardTitle>
            <CardDescription>
              {section.description}
            </CardDescription>
            <Button size="small">
              {t('eTeczka.openSection', 'Otwórz sekcję')}
            </Button>
          </Card>
        ))}
      </ContentGrid>

      {selectedSection && renderSectionContent()}
    </Container>
  );
};
