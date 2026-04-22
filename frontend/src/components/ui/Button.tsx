import React from 'react';
import { BrButton } from '@govbr-ds/react-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}: ButtonProps) {
  
  // Mapeamento das propriedades do nosso sistema para o BrButton oficial
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'outline';
  
  return (
    <BrButton 
      primary={isPrimary}
      secondary={isSecondary}
      block={fullWidth}
      className={className}
      {...(props as any)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </BrButton>
  );
}
