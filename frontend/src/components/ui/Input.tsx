import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  state?: 'default' | 'error' | 'success' | 'info' | 'disabled';
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, state = 'default', icon, className = '', disabled, ...props }, ref) => {
    const stateStyles = {
      default: 'border-gov-border focus:border-gov-blue focus:ring-1 focus:ring-gov-blue',
      error: 'border-gov-red focus:border-gov-red focus:ring-1 focus:ring-gov-red text-gov-red',
      success: 'border-gov-green focus:border-gov-green focus:ring-1 focus:ring-gov-green text-gov-green',
      info: 'border-gov-blue focus:border-gov-blue focus:ring-1 focus:ring-gov-blue text-gov-blue',
      disabled: 'border-gov-border bg-gray-100 text-gray-500 cursor-not-allowed',
    };

    const helperBadgeStyles = {
      default: 'text-gray-500',
      error: 'bg-gov-red text-white px-2 py-0.5 rounded-sm inline-block mr-2 font-bold text-xs',
      success: 'bg-gov-green text-white px-2 py-0.5 rounded-sm inline-block mr-2 font-bold text-xs',
      info: 'bg-gov-blue text-white px-2 py-0.5 rounded-sm inline-block mr-2 font-bold text-xs',
      disabled: 'bg-gov-yellow text-black px-2 py-0.5 rounded-sm inline-block mr-2 font-bold text-xs',
    };

    const currentState = disabled ? 'disabled' : state;

    return (
      <div className={`flex flex-col w-full mb-4 ${className}`}>
        <label className="mb-1 text-sm font-semibold text-gov-text">
          {label}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded bg-white transition-colors placeholder:italic placeholder:text-gray-400 outline-none ${stateStyles[currentState]}`}
            {...props}
          />
          {icon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gov-blue">
              {icon}
            </div>
          )}
        </div>

        {helperText && (
          <div className="mt-1 text-sm flex items-center">
            {currentState !== 'default' && (
              <span className={helperBadgeStyles[currentState]}>
                {currentState === 'error' && '✖ Campo inválido'}
                {currentState === 'success' && '✔ Campo correto'}
                {currentState === 'info' && 'ℹ Campo informacional'}
                {currentState === 'disabled' && '⚠ Campo desabilitado'}
              </span>
            )}
            <span className="text-gray-600">{helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
