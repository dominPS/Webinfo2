export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: string;
  centerContent?: boolean;
}

export interface StyledContainerProps {
  $padding: ContainerProps['padding'];
  $maxWidth?: string;
  $centerContent: boolean;
}
