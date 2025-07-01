import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import EvaluationForm from './components/EvaluationForm';

const PageContainer = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
`;

const ContentSection = styled.section`
  margin-bottom: 32px;
`;

const EmployeeSelector = styled.div`
  margin-bottom: 24px;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
`;

/**
 * HR Evaluation Page
 * This page allows HR to evaluate employees across the organization
 */
const HREvaluationPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Mock employee data - in a real app, this would come from an API or state
  const employees = [
    { id: 'emp001', name: t('employees.johnSmith', 'John Smith') },
    { id: 'emp002', name: t('employees.janeDoe', 'Jane Doe') },
    { id: 'emp003', name: t('employees.michaelJohnson', 'Michael Johnson') },
    { id: 'emp004', name: t('employees.sarahWilliams', 'Sarah Williams') }
  ];

  const handleEvaluationSubmit = (data: any) => {
    // In a real app, this would send the data to an API
    console.log('HR evaluation submitted:', data);
    alert('Evaluation submitted successfully!');
    setSelectedEmployee('');
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('evaluation.hr.title', 'HR Evaluation')}</PageTitle>
        <PageDescription>
          {t('evaluation.hr.description', 'Evaluate employee performance and provide feedback as HR')}
        </PageDescription>
      </PageHeader>

      <ContentSection>
        <EmployeeSelector>
          <SelectLabel>{t('evaluation.selectEmployee', 'Select an employee to evaluate:')}</SelectLabel>
          <Select 
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">{t('evaluation.selectPlaceholder', '-- Select an employee --')}</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </EmployeeSelector>

        {selectedEmployee && (
          <EvaluationForm 
            employeeId={selectedEmployee}
            employeeName={employees.find(e => e.id === selectedEmployee)?.name || ''}
            onSubmit={handleEvaluationSubmit}
          />
        )}
        
        {!selectedEmployee && (
          <p>{t('evaluation.instructions', 'Please select an employee from the dropdown to begin the evaluation process.')}</p>
        )}
      </ContentSection>
    </PageContainer>
  );
};

export default HREvaluationPage;
