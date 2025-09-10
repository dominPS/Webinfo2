import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SuccessNotification,
  NotificationIcon,
  NotificationText
} from './IDPFlowStyledComponents';

interface NotificationProps {
  isVisible: boolean;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({
  isVisible,
  message,
  type = 'success'
}) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  const defaultMessage = type === 'success' 
    ? t('idp.notification.deleted', 'Usunięto szkic')
    : t('idp.notification.error', 'Wystąpił błąd');

  return (
    <SuccessNotification>
      <NotificationIcon>
        {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
      </NotificationIcon>
      <NotificationText>
        {message || defaultMessage}
      </NotificationText>
    </SuccessNotification>
  );
};
