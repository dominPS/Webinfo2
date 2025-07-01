import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import ReviewDetails from './components/ReviewDetails';
import ScheduleReview from './components/ScheduleReview';

const PageContainer = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 32px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: none;
  border-bottom: ${props => props.active ? `3px solid ${props.theme.colors.primary}` : 'none'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const ReviewsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ReviewCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: white;
  box-shadow: ${props => props.theme.shadows.small};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ReviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text.primary};
`;

const ReviewDate = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 12px;
`;

const ReviewStatus = styled.span<{ status: 'completed' | 'scheduled' | 'overdue' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'completed': return '#e6f7e6';
      case 'scheduled': return '#e6f0ff';
      case 'overdue': return '#ffe6e6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed': return '#2e7d32';
      case 'scheduled': return '#1565c0';
      case 'overdue': return '#c62828';
    }
  }};
  margin-bottom: 12px;
`;

const EmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;

const EmployeeAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: 600;
  font-size: 14px;
`;

const EmployeeName = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text.primary};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * Employee Review Page
 * This page allows managers to view and manage employee reviews
 */
const EmployeeReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'completed' | 'overdue'>('all');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Initialize mock reviews with translations
  const initialMockReviews = [
    {
      id: 'rev1',
      title: t('review.types.annual', 'Annual Performance Review'),
      employeeId: 'emp001',
      employeeName: t('employees.johnSmith', 'John Smith'),
      date: '2025-06-15',
      status: 'completed' as const,
      type: 'annual',
    },
    {
      id: 'rev2',
      title: t('review.types.quarterly', 'Quarterly Check-in'),
      employeeId: 'emp002',
      employeeName: t('employees.janeDoe', 'Jane Doe'),
      date: '2025-07-10',
      status: 'scheduled' as const,
      type: 'quarterly',
    },
    {
      id: 'rev3',
      title: t('review.types.pip', 'Performance Improvement Plan'),
      employeeId: 'emp003',
      employeeName: t('employees.michaelJohnson', 'Michael Johnson'),
      date: '2025-05-20',
      status: 'overdue' as const,
      type: 'pip',
    },
    {
      id: 'rev4',
      title: t('review.types.probation', 'Probation Review'),
      employeeId: 'emp004',
      employeeName: t('employees.sarahWilliams', 'Sarah Williams'),
      date: '2025-06-28',
      status: 'completed' as const,
      type: 'probation',
    },
    {
      id: 'rev5',
      title: t('review.types.quarterly', 'Quarterly Check-in'),
      employeeId: 'emp005',
      employeeName: t('employees.robertBrown', 'Robert Brown'),
      date: '2025-07-15',
      status: 'scheduled' as const,
      type: 'quarterly',
    },
    {
      id: 'rev6',
      title: t('review.types.annual', 'Annual Performance Review'),
      employeeId: 'emp006',
      employeeName: t('employees.emilyDavis', 'Emily Davis'),
      date: '2025-05-05',
      status: 'overdue' as const,
      type: 'annual',
    },
  ];
  
  const [reviews, setReviews] = useState(initialMockReviews);

  // Filter reviews based on active tab
  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    return review.status === activeTab;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dateFormat.locale', 'en-US'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle scheduling a new review
  const handleScheduleReview = (data: any) => {
    // In a real app, this would send data to an API
    // For now, we'll just add it to our local state
    const newReview = {
      id: `rev${reviews.length + 1}`,
      employeeName: initialMockReviews.find(e => e.employeeId === data.employeeId)?.employeeName || t('review.unknown', 'Unknown'),
      ...data
    };
    
    setReviews([...reviews, newReview]);
    setShowScheduleModal(false);
  };

  return (
    <PageContainer>
      <PageHeader>
        <TitleSection>
          <PageTitle>{t('navigation.employeeReview')}</PageTitle>
          <PageDescription>
            {t('pages.employeeReview.description', 'View and manage employee review sessions')}
          </PageDescription>
        </TitleSection>
        
        <ActionButton onClick={() => setShowScheduleModal(true)}>
          + {t('review.actions.schedule', 'Schedule Review')}
        </ActionButton>
      </PageHeader>

      <ContentSection>
        <TabsContainer>
          <Tab 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            {t('review.tabs.all', 'All Reviews')}
          </Tab>
          <Tab 
            active={activeTab === 'scheduled'} 
            onClick={() => setActiveTab('scheduled')}
          >
            {t('review.tabs.scheduled', 'Scheduled')}
          </Tab>
          <Tab 
            active={activeTab === 'completed'} 
            onClick={() => setActiveTab('completed')}
          >
            {t('review.tabs.completed', 'Completed')}
          </Tab>
          <Tab 
            active={activeTab === 'overdue'} 
            onClick={() => setActiveTab('overdue')}
          >
            {t('review.tabs.overdue', 'Overdue')}
          </Tab>
        </TabsContainer>

        <ReviewsContainer>
          {filteredReviews.map(review => (
            <ReviewCard key={review.id} onClick={() => setSelectedReview(review.id)}>
              <ReviewTitle>{review.title || t(`review.types.${review.type}`, review.type)}</ReviewTitle>
              <ReviewDate>{formatDate(review.date)}</ReviewDate>
              <ReviewStatus status={review.status}>
                {t(`review.status.${review.status}`, review.status.charAt(0).toUpperCase() + review.status.slice(1))}
              </ReviewStatus>
              <EmployeeInfo>
                <EmployeeAvatar>{getInitials(review.employeeName)}</EmployeeAvatar>
                <EmployeeName>{review.employeeName}</EmployeeName>
              </EmployeeInfo>
            </ReviewCard>
          ))}
        </ReviewsContainer>

        {filteredReviews.length === 0 && (
          <p>{t('review.noReviews', 'No reviews found.')}</p>
        )}
      </ContentSection>
      
      {/* Review Details Sidebar */}
      {selectedReview && (
        <ReviewDetails 
          reviewId={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
      
      {/* Schedule Review Modal */}
      {showScheduleModal && (
        <Modal onClick={() => setShowScheduleModal(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ScheduleReview 
              onSubmit={handleScheduleReview}
              onCancel={() => setShowScheduleModal(false)}
            />
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default EmployeeReviewPage;
