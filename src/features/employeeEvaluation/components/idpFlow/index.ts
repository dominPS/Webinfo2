// Component exports
export { GoalForm } from './GoalForm';
export { DeleteConfirmationModal } from './DeleteConfirmationModal';
export { Notification } from './Notification';
export { InfoModal } from './InfoModal';
export { GoalsList } from './GoalsList';
export { PastPlansView } from './PastPlansView';
export { PlanPreview } from './PlanPreview';

// Styled components exports
export * from './IDPFlowStyledComponents';

// Types
export interface IDPGoal {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: 'business' | 'development';
  status: 'draft' | 'submitted' | 'approved' | 'correction_needed';
  year: number;
}

export interface GoalFormData {
  title: string;
  description: string;
  details: string;
  category: 'business' | 'development';
}
