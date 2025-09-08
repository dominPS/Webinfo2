import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../lib/stores';

interface Props {
  className?: string;
}

const ProfileMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: background-color 0.2s ease;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserIcon = styled.span`
  font-size: 16px;
`;

const UserName = styled.span`
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownArrow = styled.span<{ isOpen: boolean }>`
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  color: #334155;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:focus {
    outline: none;
    background: #f1f5f9;
  }

  &:first-of-type {
    border-radius: 8px 8px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 8px 8px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;

const UserInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const UserFullName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  color: #64748b;
  font-size: 12px;
`;

const UserRoles = styled.div`
  color: #64748b;
  font-size: 11px;
  margin-top: 4px;
`;

export const ProfileMenu: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    setIsOpen(false);
    // Navigate to profile page (when implemented)
    // navigate('/profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    // Navigate to settings page (when implemented)
    // navigate('/settings');
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const displayName = user.firstName || user.email.split('@')[0];
  const roles = user.roles?.join(', ') || 'Employee';

  return (
    <ProfileMenuContainer className={className} ref={menuRef}>
      <ProfileButton onClick={handleToggle}>
        <UserIcon>👤</UserIcon>
        <UserName>{displayName}</UserName>
        <DropdownArrow isOpen={isOpen}>▼</DropdownArrow>
      </ProfileButton>

      <DropdownMenu isOpen={isOpen}>
        <UserInfo>
          <UserFullName>
            {user.firstName} {user.lastName}
          </UserFullName>
          <UserEmail>{user.email}</UserEmail>
          <UserRoles>{roles}</UserRoles>
        </UserInfo>

        <DropdownItem onClick={handleProfile}>
          <span>👤</span>
          {t('profile.menu.profile', 'Mój profil')}
        </DropdownItem>

        <DropdownItem onClick={handleSettings}>
          <span>⚙️</span>
          {t('profile.menu.settings', 'Ustawienia')}
        </DropdownItem>

        <Divider />

        <DropdownItem onClick={handleLogout}>
          <span>🚪</span>
          {t('profile.menu.logout', 'Wyloguj się')}
        </DropdownItem>
      </DropdownMenu>
    </ProfileMenuContainer>
  );
};

export default ProfileMenu;
