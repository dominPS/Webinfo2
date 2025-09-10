import styled from '@emotion/styled';

// Main containers
export const FlowContainer = styled.div`
  padding: 18px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: ${props => props.theme.fonts.primary};
  
  * {
    font-family: ${props => props.theme.fonts.primary};
  }
`;

export const FlowHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const FlowTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #126678;
  margin-bottom: 6px;
`;

export const FlowStep = styled.div<{ isActive: boolean }>`
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: ${props => props.isActive ? '#f8fafc' : 'white'};
  transition: all 0.3s ease;
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

// Layout components
export const ScrollableContainer = styled.div`
  margin-bottom: 12px;
  padding-bottom: 30px;
`;

export const GoalsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const YearSection = styled.div`
  margin-bottom: 18px;
`;

export const YearTitle = styled.h4`
  color: #126678;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
`;

export const MainFormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 24px;
  align-items: stretch;
`;

export const LeftFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  justify-content: space-between;
`;

export const RightImageSection = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  height: 100%;
`;

export const TextAreaGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  margin-bottom: 24px;
  align-items: start;
`;

export const TextAreaColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 300px;
  margin-top: 0;
`;

// Form components
export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #374151;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  rows: 3;
  resize: vertical;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TextAreaLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  flex: 1;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 3px rgba(18, 102, 120, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const StyledTitleInput = styled.textarea`
  width: 100%;
  min-height: 48px;
  max-height: 120px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  overflow-y: hidden;
  
  &:focus {
    outline: none;
    border-color: #126678;
    box-shadow: 0 0 0 3px rgba(18, 102, 120, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

// Radio buttons
export const RadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

export const RadioOption = styled.label<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #126678;
`;

export const RadioLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

// Buttons
export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-top: 16px;
  flex-wrap: wrap;
  padding-left: 0;
`;

export const ActionButton = styled.button<{ variant: 'cancel' | 'draft' | 'save' | 'submit' | 'approve' | 'correct' }>`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'cancel': return 'white';
      case 'draft': return '#126678';
      case 'save': return '#126678';
      case 'submit': return '#126678';
      case 'approve': return '#126678';
      case 'correct': return '#126678';
      default: return '#126678';
    }
  }};
  
  color: ${props => props.variant === 'cancel' ? '#126678' : 'white'};
  border: ${props => props.variant === 'cancel' ? '2px solid #126678' : 'none'};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    background-color: ${props => {
      switch (props.variant) {
        case 'cancel': return '#f8f9fa';
        default: return '#0f5459';
      }
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  flex-shrink: 0;
`;

export const ModernButton = styled.button<{ variant: 'cancel' | 'save' | 'draft' }>`
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'cancel':
        return `
          background-color: white;
          color: #126678;
          border: 2px solid #126678;
          
          &:hover {
            background-color: #f8f9fa;
          }
        `;
      case 'draft':
        return `
          background-color: #6b7280;
          color: white;
          
          &:hover {
            background-color: #4b5563;
          }
        `;
      default: // 'save'
        return `
          background-color: #126678;
          color: white;
          
          &:hover {
            background-color: #0f5459;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

// Content components
export const InfoBadge = styled.div<{ type: 'training' | 'plan' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.type === 'training' ? '#126678' : '#126678'};
  color: white;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: fit-content;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const PlanBox = styled.div`
  padding: 16px;
  background-color: #126678;
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const PlanTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const PlanDetails = styled.div`
  font-size: 14px;
  line-height: 1.5;
`;

export const StatusMessage = styled.div<{ type: 'success' | 'warning' | 'info' }>`
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#d1fae5';
      case 'warning': return '#fef3c7';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#126678';
      case 'warning': return '#126678';
      case 'info': return '#126678';
      default: return '#126678';
    }
  }};
`;

export const IDPImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
`;

// Modal components
export const ModalOverlay = styled.div`
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

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #126678;
  
  &:hover {
    color: #0f5459;
  }
`;

export const ModalImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
`;

export const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
`;

// Confirmation Modal Styles
export const ConfirmModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90vw;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

export const ConfirmModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #dc2626;
  text-align: center;
`;

export const ConfirmModalText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.5;
`;

export const GoalPreview = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #126678;
`;

export const ConfirmModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ConfirmButton = styled.button<{ variant: 'cancel' | 'delete' }>`
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'cancel':
        return `
          background-color: white;
          color: #6b7280;
          border: 2px solid #d1d5db;
          
          &:hover {
            background-color: #f9fafb;
            border-color: #9ca3af;
          }
        `;
      case 'delete':
        return `
          background-color: #dc2626;
          color: white;
          
          &:hover {
            background-color: #b91c1c;
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
  }
`;

// Notification Styles
export const SuccessNotification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const NotificationIcon = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export const NotificationText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;
