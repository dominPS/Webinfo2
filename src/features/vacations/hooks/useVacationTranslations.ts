import { useTranslation } from 'react-i18next';

export const useVacationTranslations = () => {
  const { t } = useTranslation();
  
  return { t };
};
