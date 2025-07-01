import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

interface ReviewDetailsProps {
  reviewId: string;
  onClose: () => void;
}

const DetailsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
`;

const DetailHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const DetailTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text.primary};
`;

const DetailSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text.primary};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const InfoLabel = styled.div`
  flex: 0 0 120px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.secondary};
`;

const InfoValue = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.text.primary};
`;

const CommentBox = styled.div`
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 12px;
  
  &:hover {
    opacity: 0.9;
  }
`;

/**
 * ReviewDetails Component
 * Displays detailed information about a specific review
 */
const ReviewDetails: React.FC<ReviewDetailsProps> = ({ reviewId, onClose }) => {
  const { t } = useTranslation();
  
  // Mock detailed review data with translations
  const mockReviewDetails = {
    id: 'rev1',
    title: t('review.types.annual', 'Annual Performance Review'),
    employeeId: 'emp001',
    employeeName: 'John Smith',
    managerId: 'mgr001',
    managerName: 'Anna Rodriguez',
    date: '2025-06-15',
    status: 'completed',
    type: 'annual',
    department: t('review.mockData.department.engineering', 'Engineering'),
    position: t('review.mockData.position.seniorDeveloper', 'Senior Developer'),
    objective: t(
      'review.mockData.objective.annual', 
      'Assess performance over the past year and set goals for the coming year.'
    ),
    notes: t(
      'review.mockData.notes.john', 
      'John has shown excellent progress in technical skills and team collaboration.'
    ),
    feedbackPoints: [
      t('review.mockData.feedback.exceeded', 'Exceeded project delivery expectations'),
      t('review.mockData.feedback.problemSolving', 'Demonstrated strong problem-solving skills'),
      t('review.mockData.feedback.mentored', 'Mentored junior team members effectively'),
      t('review.mockData.feedback.communication', 'Improved communication with stakeholders')
    ],
    developmentAreas: [
      t('review.mockData.development.documentation', 'Documentation could be more thorough'),
      t('review.mockData.development.architecture', 'Consider taking on more architectural responsibilities')
    ],
    goals: [
      t('review.mockData.goals.certification', 'Complete Advanced System Design certification'),
      t('review.mockData.goals.leadProject', 'Lead at least one major project initiative'),
      t('review.mockData.goals.codeReview', 'Improve code review process for the team')
    ]
  };
  
  // In a real application, you would fetch the specific review details
  // based on the reviewId. Here we're using mock data.
  const review = mockReviewDetails;

  // Format date for display using locale from translation
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dateFormat.locale', 'en-US'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <DetailsContainer>
      <CloseButton onClick={onClose}>×</CloseButton>
      
      <DetailHeader>
        <DetailTitle>{t(`review.types.${review.type}`, review.title)}</DetailTitle>
        <div>{formatDate(review.date)}</div>
      </DetailHeader>
      
      <DetailSection>
        <SectionTitle>{t('review.details.employeeInfo', 'Employee Information')}</SectionTitle>
        <InfoRow>
          <InfoLabel>{t('review.details.name', 'Name')}</InfoLabel>
          <InfoValue>{review.employeeName}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{t('review.details.department', 'Department')}</InfoLabel>
          <InfoValue>{review.department}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{t('review.details.position', 'Position')}</InfoLabel>
          <InfoValue>{review.position}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{t('review.details.manager', 'Manager')}</InfoLabel>
          <InfoValue>{review.managerName}</InfoValue>
        </InfoRow>
      </DetailSection>
      
      <DetailSection>
        <SectionTitle>{t('review.details.reviewInfo', 'Review Information')}</SectionTitle>
        <InfoRow>
          <InfoLabel>{t('review.details.type', 'Type')}</InfoLabel>
          <InfoValue>{t(`review.types.${review.type}`, review.type.charAt(0).toUpperCase() + review.type.slice(1))}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{t('review.details.status', 'Status')}</InfoLabel>
          <InfoValue>{t(`review.status.${review.status}`, review.status.charAt(0).toUpperCase() + review.status.slice(1))}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{t('review.details.objective', 'Objective')}</InfoLabel>
          <InfoValue>{review.objective}</InfoValue>
        </InfoRow>
      </DetailSection>
      
      <DetailSection>
        <SectionTitle>{t('review.details.feedback', 'Feedback')}</SectionTitle>
        <CommentBox>
          <p>{review.notes}</p>
        </CommentBox>
        
        <SectionTitle>{t('review.details.strengths', 'Strengths')}</SectionTitle>
        <ul>
          {review.feedbackPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        
        <SectionTitle>{t('review.details.developmentAreas', 'Development Areas')}</SectionTitle>
        <ul>
          {review.developmentAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
        
        <SectionTitle>{t('review.details.goals', 'Goals')}</SectionTitle>
        <ul>
          {review.goals.map((goal, index) => (
            <li key={index}>{goal}</li>
          ))}
        </ul>
      </DetailSection>
      
      <div>
        <ActionButton>{t('review.actions.edit', 'Edit Review')}</ActionButton>
        <ActionButton>{t('review.actions.print', 'Print')}</ActionButton>
      </div>
    </DetailsContainer>
  );
};

export default ReviewDetails;
