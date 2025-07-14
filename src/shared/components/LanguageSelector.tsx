import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '@/i18n';
import './LanguageSelector.css';

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button className="language-selector__button" onClick={toggleMenu}>
        {availableLanguages[i18n.language as keyof typeof availableLanguages] || availableLanguages.en}
      </button>
      <div className={`language-selector__menu ${isOpen ? 'language-selector__menu--open' : ''}`}>
        {Object.entries(availableLanguages).map(([code]) => (
          <button
            key={code}
            className="language-selector__item"
            onClick={() => changeLanguage(code)}
          >
            {t(`languages.${code}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
