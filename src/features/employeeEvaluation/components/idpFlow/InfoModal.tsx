import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalTitle,
  ModalImage
} from './IDPFlowStyledComponents';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={onClose}>
          ×
        </ModalCloseButton>
        <ModalTitle>{t('idp.modal.title', 'IDP Goal Categories')}</ModalTitle>
        <ModalImage 
          src={imageUrl} 
          alt={t('idp.modal.alt', 'IDP goal categories diagram')}
        />
        <p style={{ marginTop: '16px', color: '#6b7280' }}>
          {t('idp.modal.description', 'Business Goals focus on achieving specific business objectives and outcomes. Development Goals focus on personal and professional skill development and growth.')}
        </p>
      </ModalContent>
    </ModalOverlay>
  );
};
