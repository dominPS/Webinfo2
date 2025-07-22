import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MenuIcon } from './MenuIcon';

const MenuContainer = styled.div`
  position: relative;
  margin-right: 24px;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 350;
  font-size: 14px;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;
  transition: opacity 0.2s;
  min-width: 110px;
  justify-content: flex-start;
  opacity: 0.9;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 8px 0;
  display: ${props => props.isOpen ? 'block' : 'none'};
  min-width: 200px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
  font-size: 14px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

const menuItems = [
  { key: 'licenses', path: '/licenses' },
  { key: 'clients', path: '/clients' },
  { key: 'invoices', path: '/invoices' },
  { key: 'settings', path: '/settings' }
] as const;

export const TopMenu: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  
  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <MenuContainer ref={menuRef}>      <MenuButton onClick={toggleMenu}>
        <MenuIcon />
        {t('common.menu')}
      </MenuButton>
      <DropdownMenu isOpen={isOpen}>
        {menuItems.map(item => (
          <MenuItem
            key={item.key}
            onClick={() => handleItemClick(item.path)}
          >
            {t(`topMenu.${item.key}`)}
          </MenuItem>
        ))}
      </DropdownMenu>
    </MenuContainer>
  );
};
