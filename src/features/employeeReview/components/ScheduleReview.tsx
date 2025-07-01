import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';

interface ScheduleReviewProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.medium};
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.text.primary};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

/**
 * ScheduleReview Component
 * Form for scheduling a new employee review
 */
const ScheduleReview: React.FC<ScheduleReviewProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  
  // Mock employee data - In a real app, this would come from an API
  const mockEmployees = [
    { id: 'emp001', name: t('employees.johnSmith', 'John Smith') },
    { id: 'emp002', name: t('employees.janeDoe', 'Jane Doe') },
    { id: 'emp003', name: t('employees.michaelJohnson', 'Michael Johnson') },
    { id: 'emp004', name: t('employees.sarahWilliams', 'Sarah Williams') },
    { id: 'emp005', name: t('employees.robertBrown', 'Robert Brown') },
    { id: 'emp006', name: t('employees.emilyDavis', 'Emily Davis') },
  ];
  
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    date: '',
    type: 'quarterly',
    objective: '',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    });
  };
  
  return (
    <FormContainer>
      <FormTitle>{t('review.schedule.title', 'Schedule New Review')}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="employeeId">{t('review.schedule.employee', 'Employee')}</Label>
          <Select 
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">{t('review.schedule.selectEmployee', '-- Select Employee --')}</option>
            {mockEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="title">{t('review.schedule.title', 'Review Title')}</Label>
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('review.schedule.titlePlaceholder', 'e.g., Quarterly Performance Review')}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="type">{t('review.schedule.type', 'Review Type')}</Label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="quarterly">{t('review.types.quarterly', 'Quarterly Check-in')}</option>
            <option value="annual">{t('review.types.annual', 'Annual Performance Review')}</option>
            <option value="probation">{t('review.types.probation', 'Probation Review')}</option>
            <option value="pip">{t('review.types.pip', 'Performance Improvement Plan')}</option>
            <option value="other">{t('review.types.other', 'Other')}</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="date">{t('review.schedule.date', 'Review Date')}</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="objective">{t('review.schedule.objective', 'Objective')}</Label>
          <Input
            id="objective"
            name="objective"
            type="text"
            value={formData.objective}
            onChange={handleChange}
            placeholder={t('review.schedule.objectivePlaceholder', 'What is the purpose of this review?')}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="notes">{t('review.schedule.notes', 'Preparation Notes')}</Label>
          <TextArea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder={t('review.schedule.notesPlaceholder', 'Add any preparation notes or topics to cover during the review')}
          />
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton type="button" onClick={onCancel}>
            {t('common.cancel', 'Cancel')}
          </CancelButton>
          <SubmitButton type="submit">
            {t('review.schedule.submit', 'Schedule Review')}
          </SubmitButton>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default ScheduleReview;
