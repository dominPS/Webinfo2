import { TextField as MuiTextField, InputAdornment } from '@mui/material';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import type { ReactElement } from 'react';

type CustomTextFieldProps = MuiTextFieldProps & {
  icon?: ReactElement;
};

const CustomTextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 11,
    '& fieldset': {
      borderColor: '#C2DEE9', //TODO kolor podmien
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: '#A0C9DB', //TODO kolor podmien
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: '#84B8D0', //TODO kolor podmien
      borderWidth: 2,
    },
  },
  '& .MuiOutlinedInput-input': {
    paddingTop: 5,
    paddingBottom: 5,
    color: 'white',
    fontSize: '12px',
  },
});

export function TextField({ icon, label, ...rest }: CustomTextFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 600,
            color: '#84B8D0',
          }}
        >
          {label}
        </label>
      )}
      <CustomTextField
        {...rest}
        label={undefined}
        fullWidth
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start" sx={{ color: '#84B8D0' }}>
              {icon}
            </InputAdornment>
          ) : undefined,
        }}
      />
    </div>
  );
}