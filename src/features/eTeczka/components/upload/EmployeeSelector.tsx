import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { SelectedEmployee } from './UploadWorkflow';

interface EmployeeSelectorProps {
  selectedEmployee: SelectedEmployee | null;
  onEmployeeSelect: (employee: SelectedEmployee | null) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 2px rgba(18, 102, 120, 0.1);
  }
`;

const EmployeeList = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => props.theme.colors.surface};
  max-height: 400px;
  overflow-y: auto;
`;

const EmployeeItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? 'rgba(18, 102, 120, 0.05)' : 'transparent'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(18, 102, 120, 0.05);
  }
`;

const EmployeeAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #126678;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const EmployeeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2px;
`;

const EmployeeDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  gap: 8px;
`;

const EmployeeDepartment = styled.span`
  background-color: rgba(18, 102, 120, 0.1);
  color: #126678;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
`;

const SelectedInfo = styled.div`
  padding: 16px;
  background-color: rgba(18, 102, 120, 0.05);
  border: 1px solid #126678;
  border-radius: 8px;
`;

const SelectedTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #126678;
  margin: 0 0 8px 0;
`;

const ClearButton = styled.button`
  margin-top: 12px;
  padding: 6px 12px;
  background-color: transparent;
  color: #126678;
  border: 1px solid #126678;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #126678;
    color: white;
  }
`;

export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  selectedEmployee,
  onEmployeeSelect
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock employee data - w prawdziwej aplikacji z API
  const mockEmployees: SelectedEmployee[] = [
    { id: 'emp001', name: 'Jan Kowalski', position: 'Programista Senior', department: 'IT' },
    { id: 'emp002', name: 'Anna Nowak', position: 'Manager Projektu', department: 'IT' },
    { id: 'emp003', name: 'Michał Wiśniewski', position: 'Analityk Biznesowy', department: 'Analiza' },
    { id: 'emp004', name: 'Sara Kowalczyk', position: 'Designer UX/UI', department: 'Design' },
    { id: 'emp005', name: 'Robert Brązowy', position: 'Tester QA', department: 'IT' },
    { id: 'emp006', name: 'Emilia Dawidowska', position: 'HR Specialist', department: 'HR' },
    { id: 'emp007', name: 'Tomasz Zieliński', position: 'DevOps Engineer', department: 'IT' },
    { id: 'emp008', name: 'Katarzyna Mazur', position: 'Księgowa', department: 'Finanse' }
  ];

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (selectedEmployee) {
    return (
      <Container>
        <SelectedInfo>
          <SelectedTitle>
            {t('eTeczka.upload.selectedEmployee', 'Wybrany pracownik:')}
          </SelectedTitle>
          <EmployeeName>{selectedEmployee.name}</EmployeeName>
          <EmployeeDetails>
            {selectedEmployee.position} • {selectedEmployee.department}
          </EmployeeDetails>
          <ClearButton onClick={() => onEmployeeSelect(null)}>
            {t('eTeczka.upload.changeEmployee', 'Zmień pracownika')}
          </ClearButton>
        </SelectedInfo>
      </Container>
    );
  }

  return (
    <Container>
      <SearchSection>
        <h3>{t('eTeczka.upload.selectEmployee', 'Wybierz pracownika:')}</h3>
        <SearchInput
          type="text"
          placeholder={t('eTeczka.upload.searchPlaceholder', 'Wyszukaj po nazwisku, stanowisku lub dziale...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchSection>

      <EmployeeList>
        {filteredEmployees.map(employee => (
          <EmployeeItem
            key={employee.id}
            selected={false}
            onClick={() => onEmployeeSelect(employee)}
          >
            <EmployeeAvatar>
              {getEmployeeInitials(employee.name)}
            </EmployeeAvatar>
            <EmployeeInfo>
              <EmployeeName>{employee.name}</EmployeeName>
              <EmployeeDetails>
                <span>{employee.position}</span>
                <EmployeeDepartment>{employee.department}</EmployeeDepartment>
              </EmployeeDetails>
            </EmployeeInfo>
          </EmployeeItem>
        ))}
      </EmployeeList>

      {filteredEmployees.length === 0 && (
        <div style={{ textAlign: 'center', color: '#757575', padding: '24px' }}>
          {t('eTeczka.upload.noEmployeesFound', 'Nie znaleziono pracowników')}
        </div>
      )}
    </Container>
  );
};
