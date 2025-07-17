export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface StyledButtonProps {
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $disabled: boolean;
  $loading: boolean;
  $fullWidth: boolean;
}
