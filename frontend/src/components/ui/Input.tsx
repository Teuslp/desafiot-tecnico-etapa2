import React, { forwardRef } from 'react';
import { InputText } from '@uigovpe/components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  state?: 'default' | 'error' | 'success' | 'info' | 'disabled';
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, state = 'default', icon, className = '', disabled, id, ...props }, ref) => {
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`w-full mb-4 ${className}`}>
        <InputText
          id={inputId}
          label={label}
          severity={state === 'error' ? 'danger' : state === 'success' ? 'success' : state === 'info' ? 'info' : undefined}
          disabled={disabled}
          placeholder={props.placeholder}
          type={props.type}
          value={props.value as string}
          onChange={props.onChange}
          required={props.required}
          icon={icon}
          {...(props as any)}
        />
        {helperText && (
          <span className={`text-sm mt-1 block ${state === 'error' ? 'text-red-600' : state === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
