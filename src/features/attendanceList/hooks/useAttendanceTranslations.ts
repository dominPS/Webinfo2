import { useTranslation } from 'react-i18next';

// Translation utilities for attendance list
export const useAttendanceTranslations = () => {
  const { t } = useTranslation();

  // Translate attendance status
  const translateStatus = (status: string): string => {
    if (!status) return '';
    
    const statusMap: Record<string, string> = {
      'Obecny': t('AttendanceList.Status.Present', 'Obecny'),
      'Obecny (Brak odbić)': t('AttendanceList.Status.PresentNoCard', 'Obecny (Brak odbić)'),
      'Nieobecny': t('AttendanceList.Status.Absent', 'Nieobecny'),
      'Wszedł, nie wyszedł': t('AttendanceList.Status.EnteredNotExited', 'Wszedł, nie wyszedł'),
      'Wyszedł, nie wszedł': t('AttendanceList.Status.ExitedNotEntered', 'Wyszedł, nie wszedł')
    };
    
    return statusMap[status] || status;
  };

  // Translate guest type
  const translateGuestType = (type: string): string => {
    if (!type) return '';
    
    const typeMap: Record<string, string> = {
      'gość': t('AttendanceList.GuestType.Guest', 'Gość'),
      'Gość': t('AttendanceList.GuestType.Guest', 'Gość'),
      'kontrahent': t('AttendanceList.GuestType.Contractor', 'Kontrahent'),
      'Kontrahent': t('AttendanceList.GuestType.Contractor', 'Kontrahent'),
      'odwiedzający': t('AttendanceList.GuestType.Visitor', 'Odwiedzający'),
      'Odwiedzający': t('AttendanceList.GuestType.Visitor', 'Odwiedzający'),
      'usługodawca': t('AttendanceList.GuestType.ServiceProvider', 'Usługodawca'),
      'Usługodawca': t('AttendanceList.GuestType.ServiceProvider', 'Usługodawca'),
      'dostawa': t('AttendanceList.GuestType.Delivery', 'Dostawa'),
      'Dostawa': t('AttendanceList.GuestType.Delivery', 'Dostawa')
    };
    
    return typeMap[type] || type;
  };

  // Translate document type
  const translateDocument = (document: string): string => {
    if (!document) return '';
    
    const documentMap: Record<string, string> = {
      '<brak danych>': t('AttendanceList.Document.NoData', '<brak danych>'),
      '<Brak danych>': t('AttendanceList.Document.NoData', '<brak danych>'),
      'brak danych': t('AttendanceList.Document.NoData', '<brak danych>'),
      'Brak danych': t('AttendanceList.Document.NoData', '<brak danych>'),
      'dowód osobisty': t('AttendanceList.Document.ID', 'Dowód osobisty'),
      'Dowód osobisty': t('AttendanceList.Document.ID', 'Dowód osobisty'),
      'paszport': t('AttendanceList.Document.Passport', 'Paszport'),
      'Paszport': t('AttendanceList.Document.Passport', 'Paszport'),
      'prawo jazdy': t('AttendanceList.Document.DriverLicense', 'Prawo jazdy'),
      'Prawo jazdy': t('AttendanceList.Document.DriverLicense', 'Prawo jazdy'),
      'inne': t('AttendanceList.Document.Other', 'Inne'),
      'Inne': t('AttendanceList.Document.Other', 'Inne')
    };
    
    return documentMap[document] || document;
  };

  return {
    translateStatus,
    translateGuestType,
    translateDocument,
    t
  };
};
