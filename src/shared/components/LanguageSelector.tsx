import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../../app/i18n';

const LanguageButton = styled.button`
  font-weight: 350;
  font-size: 14px;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LanguageMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 8px 0;
  display: ${props => props.isOpen ? 'block' : 'none'};
  min-width: 160px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const Container = styled.div`
  position: relative;
`;

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <Container>
      <LanguageButton onClick={toggleMenu}>
        {availableLanguages[i18n.language as keyof typeof availableLanguages] || availableLanguages.en}
      </LanguageButton>
      <LanguageMenu isOpen={isOpen}>
        {Object.entries(availableLanguages).map(([code]) => (
          <MenuItem
            key={code}
            onClick={() => changeLanguage(code)}
          >
            {t(`languages.${code}`)}
          </MenuItem>
        ))}
      </LanguageMenu>
    </Container>
  );
};
