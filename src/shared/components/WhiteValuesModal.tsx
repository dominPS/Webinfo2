import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { whiteV1, whiteV2, whiteV3, whiteV4 } from '../assets/images/idp';
import './WhiteValuesModal.css';

interface WhiteValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const whiteValuesSlides = [
  { image: whiteV1, titleKey: 'whiteValues.slide1.title', title: 'Company Value 1' },
  { image: whiteV2, titleKey: 'whiteValues.slide2.title', title: 'Company Value 2' },
  { image: whiteV3, titleKey: 'whiteValues.slide3.title', title: 'Company Value 3' },
  { image: whiteV4, titleKey: 'whiteValues.slide4.title', title: 'Company Value 4' },
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
    <div 
      className={`white-values-modal__overlay ${!isOpen ? 'white-values-modal__overlay--hidden' : ''}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="white-values-modal__content">
        <div className="white-values-modal__header">
          <h2 className="white-values-modal__title">
            {t('whiteValues.modalTitle', '"WHITE" Company Values')}
          </h2>
          <button className="white-values-modal__close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="white-values-modal__slideshow">
          <h3 className="white-values-modal__slide-title">
            {t(whiteValuesSlides[currentSlide].titleKey, whiteValuesSlides[currentSlide].title)}
          </h3>
          
          <img 
            className="white-values-modal__slide-image"
            src={whiteValuesSlides[currentSlide].image} 
            alt={t(whiteValuesSlides[currentSlide].titleKey, whiteValuesSlides[currentSlide].title)}
          />

          <div className="white-values-modal__navigation">
            <button 
              className="white-values-modal__nav-button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              ← {t('common.previous', 'Previous')}
            </button>

            <div className="white-values-modal__slide-indicator">
              {whiteValuesSlides.map((_, index) => (
                <button
                  key={index}
                  className={`white-values-modal__indicator-dot ${index === currentSlide ? 'white-values-modal__indicator-dot--active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="white-values-modal__slide-counter">
              {currentSlide + 1} / {whiteValuesSlides.length}
            </div>

            <button 
              className="white-values-modal__nav-button"
              onClick={nextSlide}
              disabled={currentSlide === whiteValuesSlides.length - 1}
            >
              {t('common.next', 'Next')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteValuesModal;
