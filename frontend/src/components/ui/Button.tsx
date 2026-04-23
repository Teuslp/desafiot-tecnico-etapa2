import React from 'react';
import { Button as GovPeButton } from '@uigovpe/components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: string; // GovPE usually uses icon names as strings or specific icon components
  label?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  label,
  ...props 
}: ButtonProps) {
  
  // Mapeamento de variantes para o padrão UI-GovPE (assumindo severity ou variantes comuns)
  // Se a biblioteca segue o padrão PrimeReact (comum em PE), seria severity.
  // No exemplo do usuário, apenas label foi mostrado.
  
  return (
    <GovPeButton 
      label={label || (typeof children === 'string' ? children : undefined)}
      icon={icon}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      variant={variant === 'outline' ? 'outlined' : variant === 'ghost' ? 'text' : undefined}
      {...(props as any)}
    >
      {typeof children !== 'string' && children}
    </GovPeButton>
  );
}
