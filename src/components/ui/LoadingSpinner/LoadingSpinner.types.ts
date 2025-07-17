export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export interface StyledSpinnerProps {
  $size: LoadingSpinnerProps['size'];
  $color?: string;
}
