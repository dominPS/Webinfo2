import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ScheduleReview.css';

interface ScheduleReviewProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

/**
 * ScheduleReview Component
 * Form for scheduling a new employee review
 */
const ScheduleReview: React.FC<ScheduleReviewProps> = ({ onSave, onCancel }) => {
  const { t } = useTranslation();
  
  // Mock employee data - In a real app, this would come from an API
  const mockEmployees = [
    { id: 'emp001', name: 'Anna Kowalska', position: 'Senior Developer' },
    { id: 'emp002', name: 'Jan Wiśniewski', position: 'UX Designer' },
    { id: 'emp003', name: 'Katarzyna Dąbrowska', position: 'Project Manager' },
    { id: 'emp004', name: 'Michał Lewandowski', position: 'QA Engineer' },
    { id: 'emp005', name: 'Piotr Nowak', position: 'Frontend Developer' },
    { id: 'emp006', name: 'Maria Zielińska', position: 'Team Lead' },
  ];
  
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    date: '',
    type: 'quarterly',
    objective: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Wybierz pracownika';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Podaj tytuł oceny';
    }
    if (!formData.date) {
      newErrors.date = 'Wybierz datę oceny';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Data oceny nie może być z przeszłości';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);
    
    onSave({
      ...formData,
      employeeName: selectedEmployee?.name || '',
      employeePosition: selectedEmployee?.position || '',
      status: 'scheduled',
      reviewer: 'Aktualny użytkownik', // In real app, this would be the current user
      createdAt: new Date().toISOString()
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  return (
    <div className="schedule-review">
      <h2 className="schedule-review__title">Zaplanuj nową ocenę</h2>
      
      <form className="schedule-review__form" onSubmit={handleSubmit}>
        <div className="schedule-review__form-group">
          <label htmlFor="employeeId" className="schedule-review__label">
            Pracownik <span className="schedule-review__required">*</span>
          </label>
          <select 
            id="employeeId"
            name="employeeId"
            className="schedule-review__select"
            value={formData.employeeId}
            onChange={handleChange}
          >
            <option value="">-- Wybierz pracownika --</option>
            {mockEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <div className="schedule-review__error">{errors.employeeId}</div>
          )}
        </div>
        
        <div className="schedule-review__form-row">
          <div className="schedule-review__form-group">
            <label htmlFor="type" className="schedule-review__label">
              Typ oceny <span className="schedule-review__required">*</span>
            </label>
            <select
              id="type"
              name="type"
              className="schedule-review__select"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="quarterly">Ocena kwartalna</option>
              <option value="annual">Ocena roczna</option>
              <option value="project">Ocena projektowa</option>
              <option value="probation">Ocena próbna</option>
              <option value="other">Inna</option>
            </select>
          </div>

          <div className="schedule-review__form-group">
            <label htmlFor="date" className="schedule-review__label">
              Data oceny <span className="schedule-review__required">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              className="schedule-review__input"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
            />
            {errors.date && (
              <div className="schedule-review__error">{errors.date}</div>
            )}
          </div>
        </div>
        
        <div className="schedule-review__form-group">
          <label htmlFor="title" className="schedule-review__label">
            Tytuł oceny <span className="schedule-review__required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="schedule-review__input"
            value={formData.title}
            onChange={handleChange}
            placeholder="np. Ocena kwartalna Q4 2024"
          />
          {errors.title && (
            <div className="schedule-review__error">{errors.title}</div>
          )}
        </div>
        
        <div className="schedule-review__form-group">
          <label htmlFor="objective" className="schedule-review__label">
            Cel oceny
          </label>
          <input
            id="objective"
            name="objective"
            type="text"
            className="schedule-review__input"
            value={formData.objective}
            onChange={handleChange}
            placeholder="Jaki jest cel tej oceny?"
          />
          <div className="schedule-review__help-text">
            Opcjonalnie opisz główny cel lub fokus tej oceny
          </div>
        </div>
        
        <div className="schedule-review__form-group">
          <label htmlFor="notes" className="schedule-review__label">
            Notatki przygotowawcze
          </label>
          <textarea
            id="notes"
            name="notes"
            className="schedule-review__textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Dodaj notatki przygotowawcze lub tematy do omówienia podczas oceny"
          />
          <div className="schedule-review__help-text">
            Te notatki pomogą w przygotowaniu się do rozmowy oceniającej
          </div>
        </div>
        
        <div className="schedule-review__button-group">
          <button 
            type="button" 
            className="schedule-review__button schedule-review__button--secondary"
            onClick={onCancel}
          >
            Anuluj
          </button>
          <button 
            type="submit" 
            className="schedule-review__button schedule-review__button--primary"
          >
            Zaplanuj ocenę
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleReview;
