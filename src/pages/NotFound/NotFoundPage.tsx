import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__message">{t('notFound.message', 'The page you are looking for does not exist.')}</p>
      <Link className="not-found__link" to="/">{t('notFound.goHome', 'Go to Home')}</Link>
    </div>
  );
};

export default NotFoundPage;
