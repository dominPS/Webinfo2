import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EvaluationForm from './components/EvaluationForm';
import './EmployeeEvaluationPage.css';

/**
 * Employee Evaluation Page
 * This page allows HR and managers to evaluate employee performance
 */
const EmployeeEvaluationPage: React.FC = () => {
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
    console.log('Evaluation submitted:', data);
    alert('Evaluation submitted successfully!');
    setSelectedEmployee('');
  };

  return (
    <div className="employee-evaluation-page">
      <div className="employee-evaluation-page__header">
        <h1 className="employee-evaluation-page__title">{t('navigation.employeeEvaluation')}</h1>
        <p className="employee-evaluation-page__description">
          {t('pages.employeeEvaluation.description', 'Evaluate employee performance and provide feedback')}
        </p>
      </div>

      <section className="employee-evaluation-page__content">
        <div className="employee-evaluation-page__employee-selector">
          <label className="employee-evaluation-page__select-label">{t('evaluation.selectEmployee', 'Select an employee to evaluate:')}</label>
          <select 
            className="employee-evaluation-page__select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">{t('evaluation.selectPlaceholder', '-- Select an employee --')}</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEmployee && (
          <EvaluationForm 
            employeeId={selectedEmployee}
            employeeName={employees.find(e => e.id === selectedEmployee)?.name || ''}
            onSubmit={handleEvaluationSubmit}
          />
        )}
        
        {!selectedEmployee && (
          <p className="employee-evaluation-page__instructions">{t('evaluation.instructions', 'Please select an employee from the dropdown to begin the evaluation process.')}</p>
        )}
      </section>
    </div>
  );
};

export default EmployeeEvaluationPage;
