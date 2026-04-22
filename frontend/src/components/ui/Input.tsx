import React, { forwardRef } from 'react';
import { BrInput } from '@govbr-ds/react-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  state?: 'default' | 'error' | 'success' | 'info' | 'disabled';
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, state = 'default', icon, className = '', disabled, id, ...props }, ref) => {
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Mapeamento de estado
    let danger = state === 'error';
    let success = state === 'success';
    let info = state === 'info';

    return (
      <div className={`w-full mb-4 ${className}`}>
        <BrInput
          id={inputId}
          label={label}
          danger={danger}
          success={success}
          info={info}
          disabled={disabled}
          placeholder={props.placeholder}
          type={props.type as any}
          value={props.value as any}
          onChange={props.onChange as any}
          required={props.required}
          {...(props as any)}
        />
        {helperText && (
          <span className={`text-sm mt-1 block ${danger ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-600'}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
