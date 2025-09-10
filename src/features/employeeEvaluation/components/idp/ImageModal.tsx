import React from 'react';
import { ModalOverlay, ModalContent, ModalCloseButton, ModalImage } from './IDPStyledComponents';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalCloseButton onClick={onClose}>×</ModalCloseButton>
        <ModalImage src={imageUrl} alt="IDP Preview" />
      </ModalContent>
    </ModalOverlay>
  );
};
