import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MenuIcon } from './MenuIcon';
import './TopMenu.css';

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
    <div className="top-menu" ref={menuRef}>
      <button className="top-menu__button" onClick={toggleMenu}>
        <MenuIcon />
        {t('common.menu')}
      </button>
      <div className={`top-menu__dropdown ${isOpen ? 'top-menu__dropdown--open' : ''}`}>
        {menuItems.map(item => (
          <button
            key={item.key}
            className="top-menu__item"
            onClick={() => handleItemClick(item.path)}
          >
            {t(`topMenu.${item.key}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
