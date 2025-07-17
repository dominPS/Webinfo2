export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface StyledInputProps {
  $fullWidth: boolean;
  $size: InputProps['size'];
  $error: boolean;
  $disabled: boolean;
}
