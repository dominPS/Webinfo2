import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { whiteV1, whiteV2, whiteV3, whiteV4 } from '../assets/images/idp';

interface WhiteValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 900px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const SlideshowContainer = styled.div`
  position: relative;
  padding: 24px;
`;

const SlideImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
`;

const NavButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const SlideIndicator = styled.div`
  display: flex;
  gap: 8px;
`;

const IndicatorDot = styled.button<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.isActive ? '#2563eb' : '#d1d5db'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isActive ? '#1d4ed8' : '#9ca3af'};
  }
`;

const SlideCounter = styled.div`
  background-color: #f3f4f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const SlideTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  text-align: center;
`;

const whiteValuesSlides = [
  { image: whiteV1, titleKey: 'whiteValues.slide1.title', title: 'WHITE Value 1' },
  { image: whiteV2, titleKey: 'whiteValues.slide2.title', title: 'WHITE Value 2' },
  { image: whiteV3, titleKey: 'whiteValues.slide3.title', title: 'WHITE Value 3' },
  { image: whiteV4, titleKey: 'whiteValues.slide4.title', title: 'WHITE Value 4' },
];

export const WhiteValuesModal: React.FC<WhiteValuesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % whiteValuesSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + whiteValuesSlides.length) % whiteValuesSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <ModalOverlay 
      isOpen={isOpen} 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t('whiteValues.modalTitle', '"WHITE" Company Values')}
          </ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            ✕
          </CloseButton>
        </ModalHeader>

        <SlideshowContainer>
          <SlideTitle>
            {t(whiteValuesSlides[currentSlide].titleKey, whiteValuesSlides[currentSlide].title)}
          </SlideTitle>
          
          <SlideImage 
            src={whiteValuesSlides[currentSlide].image} 
            alt={t(whiteValuesSlides[currentSlide].titleKey, whiteValuesSlides[currentSlide].title)}
          />

          <NavigationContainer>
            <NavButton 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              ← {t('common.previous', 'Previous')}
            </NavButton>

            <SlideIndicator>
              {whiteValuesSlides.map((_, index) => (
                <IndicatorDot
                  key={index}
                  isActive={index === currentSlide}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </SlideIndicator>

            <SlideCounter>
              {currentSlide + 1} / {whiteValuesSlides.length}
            </SlideCounter>

            <NavButton 
              onClick={nextSlide}
              disabled={currentSlide === whiteValuesSlides.length - 1}
            >
              {t('common.next', 'Next')} →
            </NavButton>
          </NavigationContainer>
        </SlideshowContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WhiteValuesModal;
