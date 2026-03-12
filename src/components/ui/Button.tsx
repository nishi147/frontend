import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-full shadow-md hover:shadow-lg';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border-b-4 border-primary-600 active:border-b-0',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border-b-4 border-secondary-600 active:border-b-0',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white border-b-4 border-yellow-600 active:border-b-0',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 shadow-none',
    ghost: 'shadow-none bg-transparent hover:bg-gray-100 text-gray-700'
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
      {children}
    </button>
  );
};
