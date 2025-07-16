import React from 'react';
import { useTranslation } from 'react-i18next';
import './ReviewDetails.css';

interface Review {
  id: string;
  employeeName: string;
  employeePosition: string;
  type: 'annual' | 'quarterly' | 'project';
  status: 'completed' | 'scheduled' | 'overdue';
  date: string;
  reviewer: string;
}

interface ReviewDetailsProps {
  review: Review;
}

/**
 * ReviewDetails Component
 * Displays detailed information about a specific review
 */
const ReviewDetails: React.FC<ReviewDetailsProps> = ({ review }) => {
  const { t } = useTranslation();
  
  // Mock detailed review data with translations
  const mockReviewDetails = {
    objective: 'Ocena roczna wydajności pracownika oraz wyznaczenie celów na nadchodzący rok.',
    notes: `${review.employeeName} wykazał się doskonałym postępem w umiejętnościach technicznych i współpracy zespołowej.`,
    feedbackPoints: [
      'Przekroczył oczekiwania w realizacji projektów',
      'Wykazał silne umiejętności rozwiązywania problemów',
      'Efektywnie mentorował młodszych członków zespołu',
      'Poprawił komunikację z interesariuszami'
    ],
    developmentAreas: [
      'Dokumentacja mogłaby być bardziej szczegółowa',
      'Rozważ przejęcie większej odpowiedzialności architektonicznej'
    ],
    goals: [
      'Ukończ zaawansaną certyfikację projektowania systemów',
      'Poprowadź co najmniej jedną główną inicjatywę projektową',
      'Popraw proces przeglądu kodu dla zespołu'
    ]
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getTypeText = (type: string) => {
    const typeMap = {
      'annual': 'Ocena roczna',
      'quarterly': 'Ocena kwartalna',
      'project': 'Ocena projektowa'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'completed': 'Ukończone',
      'scheduled': 'Zaplanowane',
      'overdue': 'Opóźnione'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    return `review-details__status-badge review-details__status-badge--${status}`;
  };

  return (
    <div className="review-details">
      <div className="review-details__header">
        <h2 className="review-details__title">{getTypeText(review.type)}</h2>
        <div className="review-details__date">{formatDate(review.date)}</div>
      </div>
      
      <div className="review-details__section">
        <h3 className="review-details__section-title">Informacje o pracowniku</h3>
        <div className="review-details__employee-info">
          <div className="review-details__employee-name">{review.employeeName}</div>
          <div className="review-details__employee-position">{review.employeePosition}</div>
          <div className="review-details__review-type">{getTypeText(review.type)}</div>
        </div>
        
        <div className="review-details__info-row">
          <div className="review-details__info-label">Oceniający:</div>
          <div className="review-details__info-value">{review.reviewer}</div>
        </div>
        <div className="review-details__info-row">
          <div className="review-details__info-label">Status:</div>
          <div className="review-details__info-value">
            <span className={getStatusBadgeClass(review.status)}>
              {getStatusText(review.status)}
            </span>
          </div>
        </div>
        <div className="review-details__info-row">
          <div className="review-details__info-label">Cel oceny:</div>
          <div className="review-details__info-value">{mockReviewDetails.objective}</div>
        </div>
      </div>
      
      <div className="review-details__section">
        <h3 className="review-details__section-title">Ocena ogólna</h3>
        <div className="review-details__comment-box">
          <p>{mockReviewDetails.notes}</p>
        </div>
        
        <h3 className="review-details__section-title">Mocne strony</h3>
        <ul className="review-details__list">
          {mockReviewDetails.feedbackPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        
        <h3 className="review-details__section-title">Obszary rozwoju</h3>
        <ul className="review-details__list">
          {mockReviewDetails.developmentAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
        
        <h3 className="review-details__section-title">Cele na przyszłość</h3>
        <ul className="review-details__list">
          {mockReviewDetails.goals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </div>
      
      <div className="review-details__actions">
        <button className="review-details__action-button">
          Edytuj ocenę
        </button>
        <button className="review-details__action-button review-details__action-button--secondary">
          Drukuj
        </button>
      </div>
    </div>
  );
};

export default ReviewDetails;
