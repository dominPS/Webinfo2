export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export interface StyledCardProps {
  $hoverable: boolean;
  $padding: CardProps['padding'];
  $clickable: boolean;
}
