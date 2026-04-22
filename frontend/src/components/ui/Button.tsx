import React, from 'react';

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
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue disabled:opacity-50 disabled:cursor-not-allowed';
  const roundedStyles = 'rounded-full px-6 py-2.5';
  
  const variants = {
    primary: 'bg-gov-blue text-white hover:bg-gov-darkBlue border border-transparent',
    outline: 'bg-white text-gov-blue border-2 border-gov-blue hover:bg-gov-lightBlue',
    ghost: 'bg-transparent text-gov-blue hover:bg-gov-lightBlue border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${roundedStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
